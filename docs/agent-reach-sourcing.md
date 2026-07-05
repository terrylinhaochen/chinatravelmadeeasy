# Agent-Reach Sourcing Bridge

Agent-Reach is useful for China Travel Made Easy as a collection adapter, not as the source of truth.

CrowdListen should stay responsible for deduping, clustering, ranking, and deciding what becomes public content. Agent-Reach can help fill the raw supply side when we need Reddit questions or Xiaohongshu travel notes that are hard to fetch with normal APIs.

## Where It Helps

| Source | What to collect | Why it matters |
| --- | --- | --- |
| Xiaohongshu | Place notes, saved itineraries, comment objections, budget tips | Strong local supply for where Chinese travelers actually go, eat, save, and complain |
| Reddit | Repeated tourist questions, planning fears, transit confusion, trip reports | Strong English-language demand from first-time visitors and backpackers |
| CrowdListen | Clusters, evidence scoring, editorial handoff, publishing decisions | Keeps the system from becoming a pile of raw scraped posts |

## Reality Check

Agent-Reach routes each platform to the currently usable backend. Its current README describes Reddit and Xiaohongshu as login-state channels, not anonymous free APIs. That means collection should be run locally or in a controlled operator environment, then exported as JSONL.

Do not make the public site build depend on live Reddit or Xiaohongshu access. The website should consume reviewed seed files only.

## Suggested Workflow

1. Install Agent-Reach and the optional Reddit/Xiaohongshu backends in an operator environment.
2. Confirm access:

```bash
~/.agent-reach-venv/bin/agent-reach doctor --json
opencli doctor
rdt status --json
xhs status
```

3. If OpenCLI is used, its Chrome browser bridge extension must be connected. If `rdt` or `xhs` is used, the CLI must have valid login state. Do not paste raw cookies into repo files.
4. Capture source rows:

```bash
PATH="$HOME/.agent-reach/npm/bin:$HOME/.agent-reach-venv/bin:$PATH" \
  npm run capture:agent-reach -- --preflight --backend auto
```

For a quick backend smoke test, limit the query count:

```bash
PATH="$HOME/.agent-reach/npm/bin:$HOME/.agent-reach-venv/bin:$PATH" \
  npm run capture:agent-reach -- --preflight --backend auto --max-queries-per-platform 1 --timeout 8
```

5. Normalize the exported rows:

```bash
npm run import:agent-reach -- pipeline/agent-reach-exports/china-backpacker.jsonl
```

6. Compare against current CrowdListen seeds:

```bash
npm run report:agent-reach-gap
```

7. Review `pipeline/agent-reach-normalized-seeds.json` and `pipeline/agent-reach-gap-report.md`.
8. Import useful clusters into CrowdListen or merge them into the existing content seed queue.

## Current Local Probe

This repo now has the bridge, query file, and normalizer. On this machine, `~/.agent-reach-venv/bin/agent-reach doctor --json` confirms that GitHub, web reading, RSS, YouTube, Bilibili search, and V2EX are available, but the two sources we want for this product are not live yet:

- Reddit status is `off`: Agent-Reach reports no active Reddit backend. It recommends OpenCLI with Chrome login state or `rdt-cli` with a valid cookie/login.
- Xiaohongshu status is `off`: Agent-Reach reports no active Xiaohongshu backend. It recommends OpenCLI with Chrome login state or `xiaohongshu-mcp` with QR login.
- The bounded local capture probe wrote zero rows, with Reddit and Xiaohongshu timing out or lacking configured login state.

So the gap is not the site pipeline anymore. The remaining operational step is connecting browser/login state, then running `npm run capture:agent-reach`.

## JSONL Shape

The normalizer accepts loose rows. These fields are preferred:

```json
{
  "platform": "xiaohongshu",
  "query": "上海 背包客 省钱",
  "title": "上海Citywalk路线",
  "text": "Walkable route with cheap noodle shops...",
  "url": "https://www.xiaohongshu.com/explore/...",
  "author": "nickname",
  "liked_count": 120,
  "comment_count": 18,
  "collected_count": 44,
  "tags": ["上海", "Citywalk"]
}
```

Reddit rows can use `score`, `num_comments`, `subreddit`, `selftext`, and `permalink`; the normalizer maps those too.

## Decision Rule

Use Agent-Reach when the question is: "Can we see more of the internet?"

Use CrowdListen when the question is: "What should the site learn, rank, and publish next?"

## Smoke Test

The importer can be tested without platform access:

```bash
npm run test:agent-reach-import
npm run sample:agent-reach
npm run report:agent-reach-gap
```

The first command writes a normalized seed file to `/tmp/china-agent-reach-normalized.json`.
The second writes `pipeline/agent-reach-normalized-seeds.json`, and the third compares it with the current CrowdListen seed file.
