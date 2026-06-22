#!/usr/bin/env python3
"""Create AI-indexable China travel content seeds from CrowdListen insights.

CrowdListen should collect and cluster the raw social/review/forum evidence.
This script turns those clusters into an editorial seed file that Codex can use
to draft or update public guides without publishing raw, unreviewed social data.

Usage:
    python3 pipeline/content_seeds_from_crowdlisten.py <entity_id>
    python3 pipeline/content_seeds_from_crowdlisten.py

Entity lookup order:
    CLI arg -> CONTENT_SEEDS_ENTITY_ID -> PULSE_ENTITY_ID

Credentials are read from crowdlisten_local/.env or platform/crowdlisten_local/.env.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
ENV_PATHS = [
    Path("~/Desktop/crowdlisten_files/crowdlisten_local/.env").expanduser(),
    Path("~/Desktop/crowdlisten_files/platform/crowdlisten_local/.env").expanduser(),
]
SRC_OUTPUT = ROOT / "src" / "data" / "contentSeeds.json"
PUBLIC_OUTPUT = ROOT / "public" / "content-seeds.json"
EDITORIAL_QUEUE_OUTPUT = ROOT / "content-seed-queue.md"
MAX_INSIGHTS = 40
MAX_EVIDENCE_PER_SEED = 4
MIN_EVIDENCE_COUNT = 3
MIN_SOURCE_TYPES = 2


GUIDE_MAP = [
    ("payment", "Alipay & WeChat Pay With a Foreign Card", "/guides/alipay-wechat-pay-foreign-cards/"),
    ("alipay", "Alipay & WeChat Pay With a Foreign Card", "/guides/alipay-wechat-pay-foreign-cards/"),
    ("wechat", "Alipay & WeChat Pay With a Foreign Card", "/guides/alipay-wechat-pay-foreign-cards/"),
    ("visa", "China Visa-Free Entry & 240-Hour Transit", "/guides/china-visa-free-2026/"),
    ("transit", "China Visa-Free Entry & 240-Hour Transit", "/guides/china-visa-free-2026/"),
    ("train", "China's High-Speed Trains", "/guides/china-high-speed-trains/"),
    ("rail", "China's High-Speed Trains", "/guides/china-high-speed-trains/"),
    ("hotel", "Hotels That Accept Foreigners", "/guides/hotels-foreigners-china/"),
    ("food", "Food: QR Menus and Dietary Needs", "/guides/food-ordering-dietary/"),
    ("restaurant", "Food: QR Menus and Dietary Needs", "/guides/food-ordering-dietary/"),
    ("street food", "Street Food & Night Markets", "/guides/street-food-night-markets/"),
    ("menu", "Food: QR Menus and Dietary Needs", "/guides/food-ordering-dietary/"),
    ("translation", "Translation & Language Survival", "/guides/translation-language-survival/"),
    ("language", "Translation & Language Survival", "/guides/translation-language-survival/"),
    ("esim", "Internet, eSIMs, VPNs and Blocked Apps", "/guides/internet-esim-vpn-blocked-apps/"),
    ("vpn", "Internet, eSIMs, VPNs and Blocked Apps", "/guides/internet-esim-vpn-blocked-apps/"),
    ("internet", "Internet, eSIMs, VPNs and Blocked Apps", "/guides/internet-esim-vpn-blocked-apps/"),
    ("didi", "Didi, Metro QR Codes, Getting Around", "/guides/didi-metro-getting-around/"),
    ("metro", "Didi, Metro QR Codes, Getting Around", "/guides/didi-metro-getting-around/"),
    ("taxi", "Didi, Metro QR Codes, Getting Around", "/guides/didi-metro-getting-around/"),
    ("itinerary", "A First-Timer's 7-Day China Itinerary", "/guides/7-day-china-itinerary/"),
    ("route", "A First-Timer's 7-Day China Itinerary", "/guides/7-day-china-itinerary/"),
    ("tea", "Tea in China for Visitors", "/guides/tea-houses-and-rituals/"),
    ("hutong", "Beyond the Landmarks", "/guides/neighborhoods-beyond-landmarks/"),
    ("neighborhood", "Beyond the Landmarks", "/guides/neighborhoods-beyond-landmarks/"),
]


def load_env() -> None:
    for path in ENV_PATHS:
        if not path.exists():
            continue
        with path.open() as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, _, value = line.partition("=")
                    os.environ.setdefault(key.strip(), value.strip().strip('"'))


def sb_get(base: str, key: str, table: str, params: dict[str, str]) -> list[dict[str, Any]]:
    url = f"{base}/rest/v1/{table}?{urllib.parse.urlencode(params)}"
    request = urllib.request.Request(
        url,
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Accept": "application/json",
        },
    )
    with urllib.request.urlopen(request, timeout=45) as response:
        return json.loads(response.read())


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug[:72] or "content-seed"


def normalize_question(title: str, description: str) -> str:
    text = (title or description or "").strip()
    if text.endswith("?"):
        return text
    lowered = text.lower()
    if any(token in lowered for token in ("where", "place", "restaurant", "hotel", "neighborhood", "visit")):
        return f"Where should travelers go for {text[0].lower() + text[1:]}?"
    if any(token in lowered for token in ("how", "setup", "book", "pay", "use", "save")):
        return f"How should travelers handle {text[0].lower() + text[1:]}?"
    return f"What should travelers know about {text[0].lower() + text[1:]}?"


def classify_kind(text: str) -> str:
    lowered = text.lower()
    recommendation_tokens = ("where", "restaurant", "hotel", "place", "neighborhood", "tea house", "market", "route", "itinerary")
    return "recommendation" if any(token in lowered for token in recommendation_tokens) else "question"


def infer_category(text: str, fallback: str | None) -> str:
    lowered = text.lower()
    rules = [
        ("payment", "Money & Payments"),
        ("alipay", "Money & Payments"),
        ("wechat", "Money & Payments"),
        ("visa", "Visas & Entry"),
        ("transit", "Visas & Entry"),
        ("train", "Transport"),
        ("rail", "Transport"),
        ("metro", "Transport"),
        ("didi", "Transport"),
        ("taxi", "Transport"),
        ("hotel", "Hospitality"),
        ("passport", "Hospitality"),
        ("food", "Eating"),
        ("restaurant", "Eating"),
        ("menu", "Eating"),
        ("tea", "Eating"),
        ("esim", "Phone & Internet"),
        ("vpn", "Phone & Internet"),
        ("internet", "Phone & Internet"),
        ("language", "Language"),
        ("translation", "Language"),
        ("route", "Trip Planning"),
        ("itinerary", "Trip Planning"),
        ("place", "Places"),
        ("neighborhood", "Places"),
    ]
    for token, category in rules:
        if token in lowered:
            return category
    return fallback or "Trip Planning"


def related_guides(text: str) -> list[dict[str, str]]:
    lowered = text.lower()
    guides: list[dict[str, str]] = []
    seen: set[str] = set()
    for token, title, href in GUIDE_MAP:
        if token in lowered and href not in seen:
            guides.append({"title": title, "href": href})
            seen.add(href)
        if len(guides) >= 3:
            break
    if not guides:
        guides.append({"title": "All China travel guides", "href": "/guides/"})
    return guides


def source_mix(evidence: list[dict[str, Any]]) -> list[str]:
    sources = []
    for row in evidence:
        platform = (row.get("platform") or row.get("source_type") or "source").strip()
        if platform and platform not in sources:
            sources.append(platform)
    return sources


def answer_seed(insight: dict[str, Any]) -> str:
    title = insight.get("title") or "this planning concern"
    description = insight.get("description") or ""
    if description:
        return description.strip()
    return f"Draft a short answer for travelers asking about {title.lower()}, then route readers to the most specific guide and mark any time-sensitive details for source verification."


def make_seed(insight: dict[str, Any], evidence: list[dict[str, Any]]) -> dict[str, Any]:
    title = insight.get("title") or "China travel planning concern"
    description = insight.get("description") or ""
    combined = f"{title} {description}"
    evidence_count = int(insight.get("signal_count") or len(evidence) or 0)
    platforms = source_mix(evidence)
    source_type_count = len(platforms)
    review_status = (
        "ready_for_editorial_draft"
        if evidence_count >= MIN_EVIDENCE_COUNT and source_type_count >= MIN_SOURCE_TYPES
        else "needs_more_evidence"
    )

    return {
        "id": slugify(title),
        "kind": classify_kind(combined),
        "category": infer_category(combined, insight.get("category")),
        "priority": int(insight.get("impact_score") or 50),
        "question": normalize_question(title, description),
        "concern": description or title,
        "answer_seed": answer_seed(insight),
        "audience": insight.get("affected_segments") or [],
        "related_guides": related_guides(combined),
        "recommended_places": [],
        "evidence_summary": f"CrowdListen cluster with {evidence_count} signal(s) across {source_type_count} source type(s).",
        "evidence_count": evidence_count,
        "source_mix": platforms,
        "evidence": [
            {
                "quote": (row.get("quote") or "")[:240],
                "platform": row.get("platform"),
                "url": row.get("source_url"),
            }
            for row in evidence[:MAX_EVIDENCE_PER_SEED]
            if row.get("quote") or row.get("source_url")
        ],
        "search_phrases": [
            normalize_question(title, description).lower().rstrip("?"),
            title.lower(),
        ],
        "codex_brief": "Draft or update the linked guide with a direct answer, concrete traveler decisions, source caveats, and FAQ schema.",
        "status": review_status,
    }


def write_editorial_queue(payload: dict[str, Any]) -> None:
    lines = [
        "# CrowdListen Content Seed Queue",
        "",
        f"Generated: {payload['generated_at']}",
        f"Source: {payload['source']}",
        "",
        "Use this as the Codex editorial queue. Do not publish direct quotes unless the public source URL is retained.",
        "",
    ]
    for seed in payload["seeds"]:
        lines.extend(
            [
                f"## {seed['question']}",
                "",
                f"- **Status:** {seed['status']}",
                f"- **Priority:** {seed['priority']}",
                f"- **Category:** {seed['category']}",
                f"- **Evidence count:** {seed['evidence_count']}",
                f"- **Concern:** {seed['concern']}",
                f"- **Codex action:** {seed['codex_brief']}",
                "- **Related guides:** "
                + ", ".join(f"[{guide['title']}]({guide['href']})" for guide in seed["related_guides"]),
                "",
            ]
        )
    EDITORIAL_QUEUE_OUTPUT.write_text("\n".join(lines), encoding="utf-8")


def refresh_from_existing(reason: str) -> int:
    if not SRC_OUTPUT.exists():
        print(reason)
        print(f"No starter seed file found at {SRC_OUTPUT}")
        return 1
    payload = json.loads(SRC_OUTPUT.read_text(encoding="utf-8"))
    PUBLIC_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_OUTPUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    write_editorial_queue(payload)
    print(reason)
    print(f"Refreshed public seed data from {SRC_OUTPUT}")
    print(f"Wrote Codex editorial queue to {EDITORIAL_QUEUE_OUTPUT}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("entity_id", nargs="?")
    parser.add_argument("--limit", type=int, default=MAX_INSIGHTS)
    args = parser.parse_args()

    load_env()
    base = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    entity_id = args.entity_id or os.environ.get("CONTENT_SEEDS_ENTITY_ID") or os.environ.get("PULSE_ENTITY_ID")
    if not (base and key and entity_id):
        return refresh_from_existing(
            "CrowdListen credentials/entity not fully configured; using the existing starter seed corpus."
        )

    insights = sb_get(
        base,
        key,
        "entity_insights",
        {
            "select": "id,title,description,category,urgency,impact_score,impact_label,signal_count,affected_segments,sentiment,created_at",
            "entity_id": f"eq.{entity_id}",
            "order": "impact_score.desc,created_at.desc",
            "limit": str(args.limit),
        },
    )

    evidence_by_insight: dict[str, list[dict[str, Any]]] = {}
    if insights:
        ids = ",".join(row["id"] for row in insights)
        rows = sb_get(
            base,
            key,
            "insight_evidence",
            {
                "select": "insight_id,quote,source_url,platform",
                "insight_id": f"in.({ids})",
                "limit": str(args.limit * 8),
            },
        )
        for row in rows:
            evidence_by_insight.setdefault(row["insight_id"], []).append(row)

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source": "crowdlisten_entity_insights",
        "entity_id": entity_id,
        "loop_version": 1,
        "quality_thresholds": {
            "min_evidence_count": MIN_EVIDENCE_COUNT,
            "min_source_types": MIN_SOURCE_TYPES,
            "require_editor_review": True,
        },
        "seeds": [
            make_seed(insight, evidence_by_insight.get(insight["id"], []))
            for insight in insights
        ],
    }

    SRC_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    SRC_OUTPUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    PUBLIC_OUTPUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    write_editorial_queue(payload)
    print(f"Wrote {len(payload['seeds'])} content seeds to {SRC_OUTPUT}")
    print(f"Wrote public seed data to {PUBLIC_OUTPUT}")
    print(f"Wrote Codex editorial queue to {EDITORIAL_QUEUE_OUTPUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
