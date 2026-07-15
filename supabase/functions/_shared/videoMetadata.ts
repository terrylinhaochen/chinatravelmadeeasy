export type MetadataJob = {
  platform: "tiktok" | "instagram";
  canonical_url: string;
};

export type OfficialMetadata = {
  provider: "tiktok_oembed" | "instagram_oembed";
  providerPayload: Record<string, unknown>;
  title: string | null;
  creatorName: string | null;
  posterUrl: string | null;
  embedState: "embeddable" | "link_only";
  metadataHash: string;
  cacheExpiresAt: string;
};

type AdapterConfig = {
  instagramEndpoint?: string;
  instagramAccessToken?: string;
};

type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export class MetadataAdapterError extends Error {
  code: string;
  terminal: boolean;
  retryAfterSeconds: number;

  constructor(code: string, terminal: boolean, retryAfterSeconds = 300) {
    super(code);
    this.name = "MetadataAdapterError";
    this.code = code;
    this.terminal = terminal;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

const clean = (value: unknown, max: number) => {
  const result = typeof value === "string" ? value.trim() : "";
  return result ? result.slice(0, max) : null;
};

function assertCanonicalSource(job: MetadataJob) {
  const url = new URL(job.canonical_url);
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const valid = job.platform === "tiktok"
    ? host === "tiktok.com" && /\/video\/\d+\/?$/.test(url.pathname)
    : host === "instagram.com" && /\/(?:reel|p)\/[A-Za-z0-9_-]+\/?$/.test(url.pathname);
  if (!valid || url.protocol !== "https:") throw new MetadataAdapterError("invalid_canonical_source", true);
}

export function buildOfficialMetadataUrl(job: MetadataJob, config: AdapterConfig = {}) {
  assertCanonicalSource(job);
  if (job.platform === "tiktok") {
    const endpoint = new URL("https://www.tiktok.com/oembed");
    endpoint.searchParams.set("url", job.canonical_url);
    return endpoint;
  }

  if (!config.instagramEndpoint || !config.instagramAccessToken) {
    throw new MetadataAdapterError("provider_credentials_missing", false, 3600);
  }
  const endpoint = new URL(config.instagramEndpoint);
  if (endpoint.protocol !== "https:" || endpoint.hostname !== "graph.facebook.com") {
    throw new MetadataAdapterError("invalid_provider_configuration", false, 3600);
  }
  endpoint.searchParams.set("url", job.canonical_url);
  endpoint.searchParams.set("access_token", config.instagramAccessToken);
  return endpoint;
}

function classifyResponse(status: number) {
  if (status === 404 || status === 410) return new MetadataAdapterError("source_unavailable", true);
  if (status === 429) return new MetadataAdapterError("provider_rate_limited", false, 1800);
  if (status >= 500) return new MetadataAdapterError("provider_temporarily_unavailable", false, 600);
  if (status === 401 || status === 403) return new MetadataAdapterError("provider_credentials_rejected", false, 3600);
  if (status === 400) return new MetadataAdapterError("source_unavailable", true);
  return new MetadataAdapterError("provider_request_rejected", true);
}

function cacheExpiry(payload: Record<string, unknown>, now: Date) {
  const raw = Number(payload.cache_age);
  const seconds = Number.isFinite(raw) ? Math.min(Math.max(Math.round(raw), 300), 604800) : 86400;
  return new Date(now.getTime() + seconds * 1000).toISOString();
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function fetchOfficialMetadata(
  job: MetadataJob,
  config: AdapterConfig = {},
  fetcher: FetchLike = fetch,
  now = new Date(),
): Promise<OfficialMetadata> {
  const endpoint = buildOfficialMetadataUrl(job, config);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  let response: Response;
  try {
    response = await fetcher(endpoint, { headers: { Accept: "application/json" }, signal: controller.signal });
  } catch (error) {
    if (error instanceof MetadataAdapterError) throw error;
    throw new MetadataAdapterError("provider_network_error", false, 300);
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) throw classifyResponse(response.status);

  let payload: Record<string, unknown>;
  try {
    const value = await response.json();
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("invalid_payload");
    payload = value as Record<string, unknown>;
  } catch {
    throw new MetadataAdapterError("provider_payload_invalid", false, 600);
  }

  const title = clean(payload.title, 500);
  const creatorName = clean(payload.author_name, 200);
  const posterUrl = clean(payload.thumbnail_url, 2048);
  const embedState = clean(payload.html, 100000) ? "embeddable" : "link_only";
  if (!title && !creatorName && !posterUrl && embedState === "link_only") {
    throw new MetadataAdapterError("provider_payload_incomplete", false, 600);
  }
  const identity = JSON.stringify({
    platform: job.platform,
    canonicalUrl: job.canonical_url,
    title,
    creatorName,
    posterUrl,
    embedState,
  });
  return {
    provider: job.platform === "tiktok" ? "tiktok_oembed" : "instagram_oembed",
    providerPayload: payload,
    title,
    creatorName,
    posterUrl,
    embedState,
    metadataHash: await sha256(identity),
    cacheExpiresAt: cacheExpiry(payload, now),
  };
}
