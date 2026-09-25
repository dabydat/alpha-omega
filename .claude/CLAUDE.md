# CLAUDE.md — alpha-omega (this gate / master)

> Read by Claude Code. This is the gate entry (the mermaid's first read).

## Read config first

`config.json` is the control panel:
- `ai_org` — this tool. Only this gate is read.
- `blocked_files` — **NEVER** read those files.
- `actions` — only do what's allowed (`true`). `false` is forbidden. Powers are
  grouped by EFFECT: `read_only_search` (grep/find — allowed) is separate from
  `mutating_fs` / `network_egress` / `db_write` / `vcs_write`. `read_only_search`
  NEVER overrides `blocked_files`.
- `scripts` — sole gate for `node scripts/<name>.js`. Deterministic tooling: it is
  NOT subject to `power_execution`, and a disabled shell power is no excuse to skip it.
- `switch.stacks` — the active stack → its knowledge at `skills/<stack>/`.

## Never overwrite a template

`config.json → templates.files` are read-only references. NEVER modify them.
- **SPECS** (`specs/TEMPLATE.md`): copy it to a NEW file with a new name.
- **MEMORY** — two locations, one immutable:
  - `<harness>/memory/*.md` → the TEMPLATE. Format only. Never read as state, never written.
  - `<project>/.claude/memory/*.md` → **YOUR state.** Read it there first, write it
    there on consolidation. It stays where `install.sh` put it; it never moves.

  If your project state file carries a `TEMPLATE — DO NOT MODIFY` banner, the
  install copied too much (`install.sh` → `copy_memory`). Strip it down to the
  title + traceability pointer and write your state. Do not relocate the file.

## The path — in order, every prompt. No step is optional.

1. `config.json` — blocked_files, actions, scripts, mcp, switch.
   What is `false` does not happen. A declared MCP that is not connected stops the task.
2. `rules/00-llm-algorithm.md` — priority #1. Zero emojis. Never invent a number.
3. `GUIDE.md` §1 — meta-prompt, language_policy, metrics, feature registry.
4. `.claude/memory/STATE.md` — your live state. Read it before planning, not after.
5. `ROUTING.md` §11 — split the prompt into sub-acts, route each one, check the budget.
6. `agents/<role>.md` — the role that fires, including its "Never omit" section.
7. **PLAN + gate `[A] / [C] / [X]`** — present it and WAIT. No approval, no execution.
8. Execute. Read before writing. Verify against the environment, not against intent.
9. Consolidate: `STATE.md`, `routes.jsonl`, `features.json`.

Steps 1-6 are reading and cost almost nothing. Step 7 is where you stop.

If something did not get done, you either skipped it or nobody told you. This list
removes the second excuse: everything you owe is on it, in order. Skipping is now
the only remaining failure mode, and it is yours.

Beyond this list, read only the section that applies: `GUIDE.md` §2 for the loop,
`protocol.md` only when extending the harness. Never a whole file "just in case".

## Golden rule

If the CONFIG doesn't allow it, it is not done. Verify your work (no claim without
measurement).

## Never omit

Every agent in `agents/` carries a `## Never omit (must read)` section. Read it
first — it lists the `config.json` rules and the `rules/`, `commands/`, `skills/`
that role must keep present.
