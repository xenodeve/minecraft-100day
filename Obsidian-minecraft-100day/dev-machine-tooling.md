---
name: dev-machine-tooling
description: What is and is not installed on the development machine, and the exact gh path (gh is installed but not on the shell PATH)
type: reference
---

Measured 2026-08-25 on the developer's Windows 11 machine.

| Tool | State |
|---|---|
| `git` | 2.54.0.windows.1 — on PATH |
| `node` / `npm` | v22.23.1 / 10.9.8 — on PATH; this is what `scripts/validate/verify.mjs` runs under |
| `gh` | **installed but NOT on the shell PATH** — `C:\Program Files\GitHub CLI\gh.exe`, v2.95.0, authenticated as `xenodeve`, scopes `repo`, `workflow`, `gist`, `read:org`, `admin:org_hook` |
| `packwiz` | not installed |
| `java` | not on PATH |
| `bun` | not installed — and not needed; this repo has no JS package manifest |

**Why:** `command -v gh` returns nothing, so an agent will conclude gh is missing and either try
to install it or fall back to a worse plan. It is there; it just needs the full path.

**How to apply:** call gh as `"/c/Program Files/GitHub CLI/gh.exe"` from the Bash tool. Verify
the rest of this table before relying on it — tooling changes and this note will not.
Related: [[developer-profile]].
