# memory/STATE.md — Single state file
> **TEMPLATE (format) — DO NOT MODIFY.** This defines the FORMAT only. Create your state in your adapter folder (e.g. `.opencode/memory/`) and read it THERE first — never in `memory/`.


> The agent reads this on start and writes it on consolidation. All transient
> state goes here. No transcripts.

## Phase
- phase: setup
- last_session: null
- next_action: start

## Stack
- stack: nestjs
- language: en

## Facts (max 20, 3 lines each)
- h1: -

## Decisions (max 20)
- D1: -

## Next steps
1. Verify `config.json` has the active stack (`switch.stacks`) on.
2. Run `node scripts/routes.js` to confirm the pheromone works.
3. Run the first task to validate the full loop.
