---
name: dev-machine-tooling
description: What is and is not installed on the development machine, and the exact gh path (gh is installed but not on the shell PATH)
type: reference
---

Measured 2026-08-25 on the developer's Windows 11 machine.

| Tool | State |
|---|---|
| `git` | 2.54.0.windows.1 — on PATH |
| `node` / `npm` | v22.23.1 / 10.9.8 under the agent's bash. **A `pwsh` terminal on this machine reports v26.3.1**, so the two shells do not agree — check which one a script will run under before blaming its output |
| `gh` | **installed but NOT on the shell PATH** — `C:\Program Files\GitHub CLI\gh.exe`, v2.95.0, authenticated as `xenodeve`, scopes `repo`, `workflow`, `gist`, `read:org`, `admin:org_hook` |
| `packwiz` | **installed, NOT on PATH** — `C:\Users\xenod\go\bin\packwiz.exe`. This note said "not installed" until 2026-08-28 and `CLAUDE.md` repeated it; both were wrong, and the cost was a session that believed it could not re-export the pack |
| `java` | **not installed** — not on PATH and not under the CurseForge runtime directory. Nothing can be boot-tested or benchmarked from an agent session; every launch is the developer's |
| `PresentMon` | `tools/PresentMon-2.5.1-x64.exe`, gitignored. **2.x takes double-dash flags** and has no `-no_top`; it needs an **elevated shell** or its CSV comes out empty |
| `bun` | not installed — and not needed; this repo has no JS package manifest |

**Why:** `command -v gh` returns nothing, so an agent will conclude gh is missing and either try
to install it or fall back to a worse plan. It is there; it just needs the full path.

**How to apply:** call gh as `"/c/Program Files/GitHub CLI/gh.exe"` from the Bash tool. Verify
the rest of this table before relying on it — tooling changes and this note will not.
Related: [[developer-profile]].
