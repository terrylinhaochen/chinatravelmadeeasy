#!/usr/bin/env python3
"""Materialize review-only China Travel drafts from a CrowdListen handoff queue."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT = ROOT / "pipeline" / "crowdlisten-handoff-queue.json"
OUTPUT_DIR = ROOT / "pipeline" / "generated-drafts" / "crowdlisten"


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")[:96] or "untitled"


def render_evidence(evidence: list[dict[str, Any]]) -> list[str]:
    if not evidence:
        return ["- No source-linked evidence captured yet."]
    return [
        f"- `{row.get('id')}` {row.get('source_role')} via {row.get('platform')}: {row.get('observed_signal')} ({row.get('url')})"
        for row in evidence
    ]


def render_guide_action(action: dict[str, Any], context_pack_id: str) -> str:
    lines = [
        f"# {action['question']}",
        "",
        f"Source action: `{action['id']}`",
        f"Context pack: `{context_pack_id}`",
        "Status: review_only_draft",
        "",
        "## Traveler Problem",
        "",
        action.get("concern") or "No concern captured.",
        "",
        "## Draft Job",
        "",
        "- Put a direct answer at the top.",
        "- Split setup, failure modes, and fallback advice into separate answer blocks when needed.",
        "- Add dated caveats for fast-changing travel/payment/policy claims.",
        "- Preserve source URLs for editorial review.",
        "",
        "## Source Evidence",
        "",
        *render_evidence(action.get("evidence", [])),
        "",
        "## Related Guides",
        "",
        action.get("related_guides") or "No related guides captured.",
        "",
        "## Quality Gate",
        "",
        *[f"- {gate}" for gate in action.get("quality_gate", [])],
        "",
        "## Writeback Required",
        "",
        *[f"- `{field}`" for field in action.get("writeback_required", [])],
        "",
    ]
    return "\n".join(lines)


def render_place_card_action(action: dict[str, Any], context_pack_id: str) -> str:
    lines = [
        f"# {action['question']}",
        "",
        f"Source action: `{action['id']}`",
        f"Context pack: `{context_pack_id}`",
        "Status: review_only_draft",
        "",
        "## Traveler Problem",
        "",
        action.get("concern") or "No concern captured.",
        "",
        "## Required Place Fields",
        "",
        *[f"- `{field}`" for field in action.get("required_fields", [])],
        "",
        "## Source Evidence",
        "",
        *render_evidence(action.get("evidence", [])),
        "",
        "## Draft Job",
        "",
        "- Extract place identity separately from recommendation reason.",
        "- Keep Chinese alias, English name, city, and address hints separate.",
        "- Mark unresolved address data as evidence_needed.",
        "- Generate a map search query only when enough source context exists.",
        "",
        "## Writeback Required",
        "",
        *[f"- `{field}`" for field in action.get("writeback_required", [])],
        "",
    ]
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    args = parser.parse_args()

    queue = json.loads(args.input.read_text())
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    written: list[str] = []
    context_pack_id = queue.get("context_pack_id", "unknown")

    for action in queue.get("guide_actions", []):
        path = OUTPUT_DIR / f"{slugify(action['question'])}.md"
        path.write_text(render_guide_action(action, context_pack_id))
        written.append(str(path))

    for action in queue.get("place_card_actions", []):
        path = OUTPUT_DIR / f"{slugify(action['question'])}.md"
        path.write_text(render_place_card_action(action, context_pack_id))
        written.append(str(path))

    print(json.dumps({"drafts": len(written), "output_dir": str(OUTPUT_DIR)}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
