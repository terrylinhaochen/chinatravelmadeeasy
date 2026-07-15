export const destinationLanguages = {
  "zh-CN": "Chinese",
  "ko-KR": "Korean",
  "ja-JP": "Japanese",
} as const;

export type DestinationLanguage = keyof typeof destinationLanguages;

export type LocalResearchRequest = {
  destination: string;
  destinationLanguage: DestinationLanguage;
  intent: string;
  constraints: string | null;
};

const clean = (value: unknown) => String(value || "").replace(/\s+/g, " ").trim();

export function parseLocalResearchRequest(value: unknown): LocalResearchRequest {
  if (!value || typeof value !== "object") throw new Error("invalid_research_request");
  const body = value as Record<string, unknown>;
  const destination = clean(body.destination);
  const destinationLanguage = clean(body.destinationLanguage) as DestinationLanguage;
  const intent = clean(body.intent);
  const constraints = clean(body.constraints) || null;

  if (destination.length < 2 || destination.length > 120) throw new Error("invalid_destination");
  if (!(destinationLanguage in destinationLanguages)) throw new Error("unsupported_destination_language");
  if (intent.length < 8 || intent.length > 500) throw new Error("invalid_research_intent");
  if ((constraints?.length || 0) > 1000) throw new Error("invalid_research_constraints");

  return { destination, destinationLanguage, intent, constraints };
}

export function nativeQueryGuidance(language: DestinationLanguage) {
  if (language === "zh-CN") {
    return ["本地人", "周末", "citywalk", "路线", "避雷", "预约", "分店"];
  }
  if (language === "ko-KR") {
    return ["현지인", "주말", "산책 코스", "후기", "예약", "지점"];
  }
  return ["地元", "週末", "散歩コース", "口コミ", "予約", "店舗"];
}
