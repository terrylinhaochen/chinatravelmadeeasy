#!/usr/bin/env python3
"""Capture Reddit/Xiaohongshu rows through Agent-Reach-compatible CLIs.

This is an operator-side script. It does not perform login or cookie extraction.
Run it only after OpenCLI/rdt/xhs are configured in the local environment.

Usage:
    python3 pipeline/capture_agent_reach_exports.py
    python3 pipeline/capture_agent_reach_exports.py --platform reddit --limit 10
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
QUERY_FILE = ROOT / "pipeline" / "agent-reach-queries.json"
DEFAULT_OUTPUT = ROOT / "pipeline" / "agent-reach-exports" / "china-backpacker.jsonl"
DEFAULT_TIMEOUT_SECONDS = 35
LOCAL_BIN_DIRS = [
    Path.home() / ".agent-reach" / "npm" / "bin",
    Path.home() / ".agent-reach-venv" / "bin",
    Path.home() / ".nvm" / "versions" / "node" / "v22.12.0" / "bin",
]


def load_queries() -> dict[str, list[str]]:
    return json.loads(QUERY_FILE.read_text(encoding="utf-8"))


def tool_path(name: str) -> str | None:
    for directory in LOCAL_BIN_DIRS:
        candidate = directory / name
        if candidate.exists() and os.access(candidate, os.X_OK):
            return str(candidate)
    return shutil.which(name)


def command_env() -> dict[str, str]:
    env = os.environ.copy()
    local_paths = [str(path) for path in LOCAL_BIN_DIRS if path.exists()]
    env["PATH"] = os.pathsep.join([*local_paths, env.get("PATH", "")])
    return env


def run_json(command: list[str], timeout: int) -> tuple[list[dict[str, Any]], str | None]:
    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=timeout,
            check=False,
            env=command_env(),
        )
    except subprocess.TimeoutExpired:
        return [], "timeout"
    if result.returncode != 0:
        return [], (result.stderr or result.stdout or f"exit {result.returncode}").strip()
    raw = (result.stdout or "").strip()
    if not raw:
        return [], "empty output"
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError as exc:
        return [], f"invalid json: {exc}"
    if isinstance(parsed, list):
        return [row for row in parsed if isinstance(row, dict)], None
    if isinstance(parsed, dict):
        for key in ("items", "results", "data", "posts", "notes"):
            value = parsed.get(key)
            if isinstance(value, list):
                return [row for row in value if isinstance(row, dict)], None
        return [parsed], None
    return [], "unsupported json shape"


def run_text(command: list[str], timeout: int) -> tuple[str, str | None]:
    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=timeout,
            check=False,
            env=command_env(),
        )
    except subprocess.TimeoutExpired:
        return "", "timeout"
    output = (result.stdout or result.stderr or "").strip()
    if result.returncode != 0:
        return output, output or f"exit {result.returncode}"
    return output, None


def mark_rows(rows: list[dict[str, Any]], platform: str, query: str, backend: str) -> list[dict[str, Any]]:
    for row in rows:
        row.setdefault("platform", platform)
        row.setdefault("query", query)
        row.setdefault("backend", backend)
    return rows


def opencli_search(site: str, query: str, limit: int, timeout: int) -> tuple[list[dict[str, Any]], str | None]:
    opencli = tool_path("opencli")
    if not opencli:
        return [], "opencli command not found"
    command = [opencli, site, "search", query, "--limit", str(limit), "-f", "json"]
    rows, error = run_json(command, timeout)
    return rows[:limit], error


def capture_reddit(query: str, limit: int, timeout: int, backend: str) -> tuple[list[dict[str, Any]], str | None]:
    if backend in {"auto", "opencli"}:
        rows, error = opencli_search("reddit", query, limit, timeout)
        if rows or backend == "opencli":
            return mark_rows(rows, "reddit", query, "opencli"), error

    rdt = tool_path("rdt")
    if not rdt:
        return [], "rdt command not found"
    rows, error = run_json([rdt, "search", query, "-n", str(limit), "--json"], timeout)
    return mark_rows(rows, "reddit", query, "rdt"), error


def capture_xiaohongshu(query: str, limit: int, timeout: int, backend: str) -> tuple[list[dict[str, Any]], str | None]:
    if backend in {"auto", "opencli"}:
        rows, error = opencli_search("xiaohongshu", query, limit, timeout)
        if rows or backend == "opencli":
            return mark_rows(rows, "xiaohongshu", query, "opencli"), error

    xhs = tool_path("xhs")
    if not xhs:
        return [], "xhs command not found"
    rows, error = run_json([xhs, "search", query, "--json"], timeout)
    return mark_rows(rows[:limit], "xiaohongshu", query, "xhs"), error


def preflight(timeout: int) -> dict[str, Any]:
    status: dict[str, Any] = {
        "tools": {
            "opencli": tool_path("opencli"),
            "rdt": tool_path("rdt"),
            "xhs": tool_path("xhs"),
            "agent-reach": tool_path("agent-reach"),
        },
        "checks": {},
    }
    if status["tools"]["opencli"]:
        output, error = run_text([status["tools"]["opencli"], "doctor"], timeout)
        status["checks"]["opencli_doctor"] = {"ok": error is None, "output": output[-800:]}
    if status["tools"]["rdt"]:
        output, error = run_text([status["tools"]["rdt"], "status", "--json"], timeout)
        status["checks"]["rdt_status"] = {"ok": error is None and '"authenticated": true' in output, "output": output[-800:]}
    if status["tools"]["xhs"]:
        output, error = run_text([status["tools"]["xhs"], "status"], timeout)
        status["checks"]["xhs_status"] = {"ok": error is None and bool(output), "output": output[-800:] if output else error}
    return status


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--platform", choices=["all", "reddit", "xiaohongshu"], default="all")
    parser.add_argument("--backend", choices=["auto", "opencli", "native"], default="auto")
    parser.add_argument("--limit", type=int, default=12)
    parser.add_argument("--timeout", type=int, default=DEFAULT_TIMEOUT_SECONDS)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--preflight", action="store_true", help="Print tool/session status before capture")
    parser.add_argument("--max-queries-per-platform", type=int, default=0, help="Limit queries per platform; 0 means all")
    args = parser.parse_args()

    queries = load_queries()
    platforms = ["reddit", "xiaohongshu"] if args.platform == "all" else [args.platform]
    args.out.parent.mkdir(parents=True, exist_ok=True)

    rows_written = 0
    errors = []
    preflight_status = preflight(min(args.timeout, 12)) if args.preflight else None
    with args.out.open("w", encoding="utf-8") as output:
        for platform in platforms:
            platform_queries = queries.get(platform, [])
            if args.max_queries_per_platform > 0:
                platform_queries = platform_queries[: args.max_queries_per_platform]
            for query in platform_queries:
                if platform == "reddit":
                    rows, error = capture_reddit(query, args.limit, args.timeout, args.backend)
                else:
                    rows, error = capture_xiaohongshu(query, args.limit, args.timeout, args.backend)
                if error:
                    errors.append({"platform": platform, "query": query, "error": error})
                for row in rows:
                    row.setdefault("captured_at", datetime.now(timezone.utc).isoformat())
                    output.write(json.dumps(row, ensure_ascii=False) + "\n")
                    rows_written += 1

    print(json.dumps({
        "output": str(args.out),
        "backend": args.backend,
        "rows_written": rows_written,
        "preflight": preflight_status,
        "errors": errors,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
