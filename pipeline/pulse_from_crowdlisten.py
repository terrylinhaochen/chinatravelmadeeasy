#!/usr/bin/env python3
"""Pull traveler insights for an entity from CrowdListen into src/data/pulse.json.

CrowdListen does the heavy lifting (listening, clustering, scoring); this script
only reads the resulting entity_insights rows and reshapes them for the /pulse/
page. Listening itself runs through the existing engines in crowdlisten_files
(crowdlisten_reddit, and the agent's ingest endpoints for other platforms).

Usage:
    python3 pipeline/pulse_from_crowdlisten.py <entity_id>
    python3 pipeline/pulse_from_crowdlisten.py            # uses PULSE_ENTITY_ID

Credentials are read from crowdlisten_local/.env (SUPABASE_URL +
SUPABASE_SERVICE_ROLE_KEY) so nothing secret lives in this public repo.
"""

import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone

CROWDLISTEN_ENV = os.path.expanduser(
    "~/Desktop/crowdlisten_files/crowdlisten_local/.env"
)
OUTPUT_PATH = os.path.join(
    os.path.dirname(__file__), "..", "src", "data", "pulse.json"
)
MAX_INSIGHTS = 12


def load_env(path: str) -> None:
    if not os.path.exists(path):
        return
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                os.environ.setdefault(k.strip(), v.strip().strip('"'))


def sb_get(base: str, key: str, table: str, params: dict) -> list:
    url = f"{base}/rest/v1/{table}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(
        url, headers={"apikey": key, "Authorization": f"Bearer {key}"}
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def main() -> int:
    load_env(CROWDLISTEN_ENV)
    base = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    entity_id = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("PULSE_ENTITY_ID")
    if not (base and key and entity_id):
        print("Need SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and an entity id")
        return 1

    insights = sb_get(
        base,
        key,
        "entity_insights",
        {
            "select": "id,title,description,category,urgency,impact_score,"
            "impact_label,signal_count,affected_segments,sentiment,created_at",
            "entity_id": f"eq.{entity_id}",
            "order": "impact_score.desc,created_at.desc",
            "limit": str(MAX_INSIGHTS),
        },
    )

    evidence_by_insight: dict = {}
    if insights:
        ids = ",".join(i["id"] for i in insights)
        try:
            rows = sb_get(
                base,
                key,
                "insight_evidence",
                {
                    "select": "insight_id,quote,source_url,platform",
                    "insight_id": f"in.({ids})",
                    "limit": "200",
                },
            )
            for r in rows:
                evidence_by_insight.setdefault(r["insight_id"], []).append(r)
        except Exception as e:
            print(f"  (evidence fetch skipped: {e})")

    out = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "entity_id": entity_id,
        "insights": [
            {
                "title": i["title"],
                "description": i["description"],
                "category": i.get("category"),
                "urgency": i.get("urgency"),
                "impact_score": i.get("impact_score"),
                "impact_label": i.get("impact_label"),
                "signal_count": i.get("signal_count"),
                "segments": i.get("affected_segments") or [],
                "sentiment": i.get("sentiment") or {},
                "evidence": [
                    {
                        "quote": (e.get("quote") or "")[:280],
                        "platform": e.get("platform"),
                        "url": e.get("source_url"),
                    }
                    for e in evidence_by_insight.get(i["id"], [])[:3]
                ],
            }
            for i in insights
        ],
    }

    os.makedirs(os.path.dirname(os.path.abspath(OUTPUT_PATH)), exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(out['insights'])} insights to {os.path.abspath(OUTPUT_PATH)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
