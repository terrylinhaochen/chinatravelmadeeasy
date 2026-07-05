#!/usr/bin/env python3
"""Compare Agent-Reach normalized seeds against current CrowdListen seeds."""

from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_AGENT_REACH = ROOT / "pipeline" / "agent-reach-normalized-seeds.json"
DEFAULT_CROWDLISTEN = ROOT / "src" / "data" / "contentSeeds.json"
DEFAULT_OUTPUT = ROOT / "pipeline" / "agent-reach-gap-report.md"
STOPWORDS = {
    "a", "an", "and", "are", "as", "before", "can", "do", "for", "from", "get", "go", "how",
    "i", "in", "is", "it", "of", "on", "or", "should", "the", "to", "travelers", "what",
    "where", "with", "without", "you", "your",
}


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def seed_text(seed: dict[str, Any]) -> str:
    parts = [
        seed.get("question"),
        seed.get("category"),
        seed.get("concern"),
        seed.get("answer_seed"),
        " ".join(seed.get("destinations") or []),
        " ".join(seed.get("source_mix") or []),
    ]
    return " ".join(str(part) for part in parts if part)


def tokens(text: str) -> set[str]:
    return {
        token
        for token in re.findall(r"[a-z0-9\u4e00-\u9fff]+", text.lower())
        if len(token) > 1 and token not in STOPWORDS
    }


def similarity(left: dict[str, Any], right: dict[str, Any]) -> float:
    left_tokens = tokens(seed_text(left))
    right_tokens = tokens(seed_text(right))
    if not left_tokens or not right_tokens:
        return 0.0
    return len(left_tokens & right_tokens) / len(left_tokens | right_tokens)


def best_match(seed: dict[str, Any], crowdlisten_seeds: list[dict[str, Any]]) -> tuple[dict[str, Any] | None, float]:
    best_seed = None
    best_score = 0.0
    for candidate in crowdlisten_seeds:
        score = similarity(seed, candidate)
        if score > best_score:
            best_seed = candidate
            best_score = score
    return best_seed, best_score


def classify(score: float) -> str:
    if score >= 0.28:
        return "reinforces_existing_cluster"
    if score >= 0.16:
        return "adjacent_gap"
    return "net_new_gap"


def report(agent_payload: dict[str, Any], crowdlisten_payload: dict[str, Any]) -> str:
    agent_seeds = agent_payload.get("seeds") or []
    crowdlisten_seeds = crowdlisten_payload.get("seeds") or []
    rows = []
    for seed in agent_seeds:
        match, score = best_match(seed, crowdlisten_seeds)
        rows.append((classify(score), score, seed, match))

    counts: dict[str, int] = {}
    for status, *_ in rows:
        counts[status] = counts.get(status, 0) + 1

    lines = [
        "# Agent-Reach vs CrowdListen Gap Report",
        "",
        f"Generated: {datetime.now(timezone.utc).isoformat()}",
        f"Agent-Reach source: `{agent_payload.get('source', 'unknown')}`",
        f"CrowdListen source: `{crowdlisten_payload.get('source', 'unknown')}`",
        "",
        "## Summary",
        "",
        f"- Agent-Reach seeds: {len(agent_seeds)}",
        f"- CrowdListen seeds: {len(crowdlisten_seeds)}",
        f"- Reinforces existing clusters: {counts.get('reinforces_existing_cluster', 0)}",
        f"- Adjacent gaps: {counts.get('adjacent_gap', 0)}",
        f"- Net-new gaps: {counts.get('net_new_gap', 0)}",
        "",
        "## Findings",
        "",
    ]

    for status, score, seed, match in rows:
        match_question = match.get("question") if match else "None"
        lines.extend(
            [
                f"### {seed.get('question', seed.get('id', 'Untitled seed'))}",
                "",
                f"- **Status:** {status}",
                f"- **Similarity:** {score:.2f}",
                f"- **Category:** {seed.get('category', 'Uncategorized')}",
                f"- **Source mix:** {', '.join(seed.get('source_mix') or []) or 'unknown'}",
                f"- **Closest CrowdListen seed:** {match_question}",
                f"- **Action:** {seed.get('codex_brief', 'Review and merge if useful.')}",
                "",
            ]
        )

    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--agent-reach", type=Path, default=DEFAULT_AGENT_REACH)
    parser.add_argument("--crowdlisten", type=Path, default=DEFAULT_CROWDLISTEN)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    agent_payload = read_json(args.agent_reach)
    crowdlisten_payload = read_json(args.crowdlisten)
    args.out.write_text(report(agent_payload, crowdlisten_payload), encoding="utf-8")
    print(f"Wrote gap report to {args.out}")


if __name__ == "__main__":
    main()
