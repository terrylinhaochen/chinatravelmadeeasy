#!/usr/bin/env python3
"""Import a CrowdListen handoff into app-local editorial queue artifacts.

This does not publish guides. It materializes the context-pack action queue and
next recommendations so the Astro app or a coding agent can safely review what
CrowdListen recommends before changing public content.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
WORKSPACE_ROOT = ROOT.parents[1]
DEFAULT_INPUT = (
    WORKSPACE_ROOT
    / "knowledge"
    / "prototypes"
    / "outcome_loop_packs"
    / "out"
    / "app_handoffs"
    / "china_travel_made_easy"
    / "crowdlisten_handoff.json"
)
QUEUE_OUTPUT = ROOT / "pipeline" / "crowdlisten-handoff-queue.json"
DATA_OUTPUT = ROOT / "src" / "data" / "crowdlistenHandoffQueue.json"
SIGNAL_OUTPUT = ROOT / "pipeline" / "crowdlisten-signal-opportunity.json"
SUPPLY_OUTPUT = ROOT / "pipeline" / "crowdlisten-social-supply-ledger.json"


def action_to_seed(action: dict[str, Any]) -> dict[str, Any]:
    context = (action.get("required_context") or [{}])[0]
    payload = action.get("execution_payload") or {}
    body = payload.get("body") or {}
    return {
        "id": action["action_id"],
        "action_type": action["action_type"],
        "title": action["title"],
        "target_asset": action["target_asset"],
        "category": context.get("category") or body.get("category"),
        "priority": context.get("priority"),
        "question": context.get("title") or body.get("question") or action["title"],
        "concern": context.get("concern") or action["why_now"],
        "related_guides": context.get("related_guides") or body.get("related_guides"),
        "evidence_count": context.get("evidence_count", 0),
        "evidence": context.get("evidence", []),
        "source_roles": context.get("source_roles", []),
        "required_fields": body.get("required_fields", []),
        "output_contract": action.get("output_contract", {}),
        "quality_gate": action.get("quality_gate", []),
        "writeback_required": action.get("writeback_required", []),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    args = parser.parse_args()

    handoff = json.loads(args.input.read_text())
    if handoff.get("vertical") != "china_travel_made_easy":
        raise SystemExit(f"Expected china_travel_made_easy handoff, got {handoff.get('vertical')}")

    guide_actions = [
        action_to_seed(action)
        for action in handoff.get("action_queue", [])
        if action.get("action_type") == "update_or_create_guide"
    ]
    place_card_actions = [
        action_to_seed(action)
        for action in handoff.get("action_queue", [])
        if action.get("action_type") == "create_place_card"
    ]
    queue = {
        "generated_at": handoff.get("generated_at"),
        "source": str(args.input),
        "context_pack_id": handoff["context_pack"]["id"],
        "signal_opportunity": handoff.get("signal_opportunity", {}),
        "supply_ledger": handoff.get("supply_ledger"),
        "guide_actions": guide_actions,
        "place_card_actions": place_card_actions,
        "next_recommendations": handoff.get("next_recommendations", []),
        "writeback_contract": handoff.get("writeback_contract", {}),
    }

    QUEUE_OUTPUT.write_text(json.dumps(queue, indent=2, ensure_ascii=False) + "\n")
    SIGNAL_OUTPUT.write_text(
        json.dumps(
            {
                "generated_at": handoff.get("generated_at"),
                "source": str(args.input),
                "signal_opportunity": handoff.get("signal_opportunity", {}),
            },
            indent=2,
            ensure_ascii=False,
        )
        + "\n"
    )
    SUPPLY_OUTPUT.write_text(
        json.dumps(
            {
                "generated_at": handoff.get("generated_at"),
                "source": str(args.input),
                "supply_ledger": handoff.get("supply_ledger"),
            },
            indent=2,
            ensure_ascii=False,
        )
        + "\n"
    )
    DATA_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    DATA_OUTPUT.write_text(json.dumps(queue, indent=2, ensure_ascii=False) + "\n")
    print(
        json.dumps(
            {
                "guide_actions": len(guide_actions),
                "place_card_actions": len(place_card_actions),
                "source_evidence_strength": (handoff.get("signal_opportunity") or {}).get("source_evidence_strength"),
                "social_supply_entries": ((handoff.get("supply_ledger") or {}).get("entry_count")),
                "queue_output": str(QUEUE_OUTPUT),
                "data_output": str(DATA_OUTPUT),
                "signal_output": str(SIGNAL_OUTPUT),
                "supply_output": str(SUPPLY_OUTPUT),
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
