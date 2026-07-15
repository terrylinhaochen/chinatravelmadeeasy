import { createClient } from "npm:@supabase/supabase-js@2";

export const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info", "Access-Control-Allow-Methods": "GET, POST, OPTIONS" };
export const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "content-type": "application/json" } });
export const preflight = (req: Request) => req.method === "OPTIONS" ? new Response("ok", { headers: cors }) : null;
export const errorMessage = (error: unknown) => error instanceof Error ? error.message : String(error || "");
export const isUuid = (value: unknown) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ""));
export const admin = () => createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
export const userClient = (req: Request) => createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: req.headers.get("Authorization") || "" } }, auth: { persistSession: false } });

export function parseVideoUrl(value: string) {
  const url = new URL(value);
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  let platform: "tiktok" | "instagram";
  let externalId = "";
  if (host === "tiktok.com") { platform = "tiktok"; externalId = url.pathname.match(/^\/@[A-Za-z0-9._]{1,64}\/video\/(\d+)\/?$/)?.[1] || ""; }
  else if (host === "instagram.com") { platform = "instagram"; externalId = url.pathname.match(/^\/(?:reel|p)\/([A-Za-z0-9_-]+)\/?$/)?.[1] || ""; }
  else throw new Error("unsupported_host");
  if (!externalId || !/^[A-Za-z0-9_-]{6,40}$/.test(externalId)) throw new Error("unsupported_url");
  const canonicalUrl = platform === "tiktok"
    ? `https://www.tiktok.com${url.pathname.replace(/\/$/, "")}`
    : `https://www.instagram.com/reel/${externalId}/`;
  return { platform, externalId, canonicalUrl };
}

export async function requireUser(req: Request) {
  const client = userClient(req); const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new Error("unauthorized");
  return { client, user: data.user };
}

export async function verifyTurnstile(token: string, remoteip?: string) {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) return Deno.env.get("ALLOW_UNVERIFIED_TURNSTILE") === "true";
  const form = new FormData(); form.set("secret", secret); form.set("response", token); if (remoteip) form.set("remoteip", remoteip);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
  const result = await response.json(); return result.success === true;
}

export async function fingerprint(req: Request) {
  const secret = Deno.env.get("RATE_LIMIT_HMAC_SECRET") || "development-only";
  const source = `${req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "unknown"}|${req.headers.get("user-agent") || "unknown"}`;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return Array.from(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(source)))).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
