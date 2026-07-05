#!/usr/bin/env python3
"""Normalize Agent-Reach exports into CrowdListen-style content seeds.

This script is intentionally file-in/file-out. Agent-Reach handles platform
access in an operator environment; the static site consumes reviewed artifacts.

Usage:
    python3 pipeline/agent_reach_to_crowdlisten.py exports.jsonl
    python3 pipeline/agent_reach_to_crowdlisten.py exports.json --out output.json
"""

from __future__ import annotations

import argparse
import json
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "pipeline" / "agent-reach-normalized-seeds.json"
MAX_EVIDENCE_PER_SEED = 6

DESTINATION_KEYWORDS = {
    "hong-kong": ["hong kong", "香港"],
    "taiwan": ["taiwan", "taipei", "tainan", "台湾", "台北", "台南"],
    "shanghai": ["shanghai", "上海"],
    "beijing": ["beijing", "北京", "hutong", "great wall"],
    "tianjin": ["tianjin", "天津"],
    "chongqing": ["chongqing", "重庆"],
    "anhui": ["anhui", "huangshan", "宏村", "黄山", "安徽"],
    "fujian": ["fujian", "xiamen", "gulangyu", "tulou", "福建", "厦门", "鼓浪屿", "土楼"],
    "gansu": ["gansu", "dunhuang", "zhangye", "甘肃", "敦煌", "张掖"],
    "guangdong": ["guangdong", "guangzhou", "shenzhen", "广东", "广州", "深圳"],
    "guizhou": ["guizhou", "guiyang", "贵州", "贵阳"],
    "hainan": ["hainan", "sanya", "haikou", "海南", "三亚", "海口"],
    "hebei": ["hebei", "chengde", "shanhaiguan", "河北", "承德", "山海关"],
    "heilongjiang": ["heilongjiang", "harbin", "黑龙江", "哈尔滨"],
    "henan": ["henan", "luoyang", "kaifeng", "河南", "洛阳", "开封"],
    "hubei": ["hubei", "wuhan", "湖北", "武汉"],
    "hunan": ["hunan", "changsha", "zhangjiajie", "湖南", "长沙", "张家界"],
    "jiangsu": ["jiangsu", "suzhou", "nanjing", "yangzhou", "江苏", "苏州", "南京", "扬州"],
    "jiangxi": ["jiangxi", "jingdezhen", "wuyuan", "江西", "景德镇", "婺源"],
    "jilin": ["jilin", "yanji", "changbai", "吉林", "延吉", "长白山"],
    "liaoning": ["liaoning", "dalian", "shenyang", "dandong", "辽宁", "大连", "沈阳", "丹东"],
    "qinghai": ["qinghai", "xining", "青海", "西宁"],
    "shaanxi": ["shaanxi", "xi'an", "xian", "陕西", "西安"],
    "shandong": ["shandong", "qingdao", "taishan", "山东", "青岛", "泰山"],
    "shanxi": ["shanxi", "pingyao", "datong", "山西", "平遥", "大同"],
    "sichuan": ["sichuan", "chengdu", "leshan", "四川", "成都", "乐山"],
    "yunnan": ["yunnan", "dali", "lijiang", "kunming", "云南", "大理", "丽江", "昆明"],
    "zhejiang": ["zhejiang", "hangzhou", "shaoxing", "浙江", "杭州", "绍兴"],
    "guangxi": ["guangxi", "guilin", "yangshuo", "广西", "桂林", "阳朔"],
    "inner-mongolia": ["inner mongolia", "hohhot", "内蒙古", "呼和浩特"],
    "ningxia": ["ningxia", "yinchuan", "宁夏", "银川"],
    "tibet": ["tibet", "lhasa", "西藏", "拉萨"],
    "xinjiang": ["xinjiang", "kashgar", "urumqi", "新疆", "喀什", "乌鲁木齐"],
    "macau": ["macau", "macao", "澳门"],
}

CATEGORY_RULES = [
    ("Eating", ["food", "restaurant", "street food", "snack", "cafe", "noodle", "hotpot", "吃", "美食", "餐厅", "小吃"]),
    ("Places", ["where", "place", "itinerary", "citywalk", "route", "neighborhood", "景点", "路线", "city walk"]),
    ("Transport", ["train", "metro", "didi", "taxi", "bus", "rail", "高铁", "地铁", "打车"]),
    ("Money & Payments", ["budget", "cheap", "cost", "alipay", "wechat pay", "省钱", "便宜", "预算", "支付宝", "微信"]),
    ("Phone & Internet", ["esim", "vpn", "blocked", "internet", "google", "whatsapp", "小红书", "网络"]),
    ("Hospitality", ["hotel", "hostel", "passport", "stay", "住宿", "酒店", "青旅", "护照"]),
    ("Visas & Entry", ["visa", "transit", "entry", "immigration", "签证", "入境", "过境"]),
]


def read_rows(path: Path) -> list[dict[str, Any]]:
    raw = path.read_text(encoding="utf-8").strip()
    if not raw:
        return []
    if path.suffix.lower() == ".jsonl":
        return [json.loads(line) for line in raw.splitlines() if line.strip()]
    parsed = json.loads(raw)
    if isinstance(parsed, list):
        return [row for row in parsed if isinstance(row, dict)]
    if isinstance(parsed, dict):
        for key in ("rows", "items", "data", "results"):
            value = parsed.get(key)
            if isinstance(value, list):
                return [row for row in value if isinstance(row, dict)]
        return [parsed]
    return []


def text_of(row: dict[str, Any]) -> str:
    pieces = [
        row.get("title"),
        row.get("text"),
        row.get("desc"),
        row.get("content"),
        row.get("selftext"),
        row.get("body"),
        row.get("query"),
        " ".join(row.get("tags") or []) if isinstance(row.get("tags"), list) else row.get("tags"),
    ]
    return " ".join(str(piece) for piece in pieces if piece).strip()


def platform_of(row: dict[str, Any]) -> str:
    platform = str(row.get("platform") or row.get("source") or "").lower()
    url = str(row.get("url") or row.get("permalink") or "").lower()
    if "xiaohongshu" in platform or "xiaohongshu" in url or "xhslink" in url:
        return "xiaohongshu"
    if "reddit" in platform or "reddit.com" in url or row.get("subreddit"):
        return "reddit"
    return platform or "agent-reach"


def engagement(row: dict[str, Any]) -> int:
    total = 0
    for key in ("score", "liked_count", "like_count", "collected_count", "comment_count", "num_comments", "share_count"):
        try:
            total += int(row.get(key) or 0)
        except (TypeError, ValueError):
            continue
    return total


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")[:72] or "agent-reach-seed"


def classify_category(text: str) -> str:
    lowered = text.lower()
    for category, tokens in CATEGORY_RULES:
        if any(token.lower() in lowered for token in tokens):
            return category
    return "Trip Planning"


def destinations_for(text: str) -> list[str]:
    lowered = text.lower()
    matches = []
    for slug, tokens in DESTINATION_KEYWORDS.items():
        if any(token.lower() in lowered for token in tokens):
            matches.append(slug)
    return matches[:4]


def cluster_key(row: dict[str, Any]) -> str:
    text = text_of(row).lower()
    destinations = destinations_for(text)
    destination = destinations[0] if destinations else "china"
    return f"{destination}:{classify_category(text)}"


def question_for(category: str, destinations: list[str], sample: dict[str, Any]) -> str:
    destination = destinations[0].replace("-", " ").title() if destinations else "China"
    if category == "Eating":
        return f"Where should budget travelers eat in {destination}?"
    if category == "Places":
        return f"Where should backpackers go in {destination} for authentic, good-value experiences?"
    if category == "Transport":
        return f"How should backpackers get around {destination} without overpaying?"
    if category == "Money & Payments":
        return f"How can travelers save money while planning {destination}?"
    if category == "Hospitality":
        return f"Where should foreign visitors stay in {destination} without passport surprises?"
    if category == "Phone & Internet":
        return f"What phone and app setup do travelers need for {destination}?"
    if category == "Visas & Entry":
        return f"What entry or transit rules matter before visiting {destination}?"
    title = sample.get("title") or sample.get("query")
    return str(title).strip().rstrip("?") + "?" if title else f"What should travelers know before visiting {destination}?"


def normalize(rows: list[dict[str, Any]]) -> dict[str, Any]:
    clusters: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in rows:
        if text_of(row):
            clusters[cluster_key(row)].append(row)

    seeds = []
    for key, cluster_rows in sorted(clusters.items(), key=lambda item: sum(engagement(row) for row in item[1]), reverse=True):
        sample = max(cluster_rows, key=engagement)
        combined = " ".join(text_of(row) for row in cluster_rows[:8])
        category = classify_category(combined)
        destination_matches = destinations_for(combined)
        source_mix = sorted({platform_of(row) for row in cluster_rows})
        priority = min(100, 40 + len(cluster_rows) * 6 + min(30, sum(engagement(row) for row in cluster_rows) // 20))
        question = question_for(category, destination_matches, sample)
        seeds.append(
            {
                "id": slugify(question),
                "source": "agent-reach",
                "kind": "recommendation" if category in {"Places", "Eating"} else "question",
                "category": category,
                "priority": priority,
                "question": question,
                "concern": f"Agent-Reach cluster from {len(cluster_rows)} row(s) across {', '.join(source_mix)}.",
                "destinations": destination_matches,
                "recommended_places": [],
                "evidence_summary": f"{len(cluster_rows)} Agent-Reach row(s), total engagement {sum(engagement(row) for row in cluster_rows)}.",
                "evidence_count": len(cluster_rows),
                "source_mix": source_mix,
                "evidence": [
                    {
                        "platform": platform_of(row),
                        "query": row.get("query"),
                        "title": row.get("title") or row.get("name"),
                        "quote": text_of(row)[:280],
                        "url": row.get("url") or row.get("permalink"),
                        "engagement": engagement(row),
                    }
                    for row in sorted(cluster_rows, key=engagement, reverse=True)[:MAX_EVIDENCE_PER_SEED]
                ],
                "codex_brief": "Review sources, merge with CrowdListen clusters, then update destination places, guide FAQs, or content seeds.",
                "status": "needs_crowdlisten_review",
            }
        )

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source": "agent-reach-export",
        "note": "Normalized from Agent-Reach platform exports. Review before publishing.",
        "seeds": seeds,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path, help="Agent-Reach JSON or JSONL export")
    parser.add_argument("--out", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    payload = normalize(read_rows(args.input))
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(payload['seeds'])} normalized seed(s) to {args.out}")


if __name__ == "__main__":
    main()
