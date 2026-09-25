---
name: create-docs
description: Scaffolds complete documentation (docs/) and launches systems-analyst + DBA IN PARALLEL for use cases, ERD, and schema.
argument-hint: "[project-name]"
---

# /create-docs — alpha-omega

Scaffolds the project documentation and expands it with two agents in parallel.

## Steps
1. Read `memory/STATE.md`; use `$ARGUMENTS` as the name or ask.
2. Ask all at once: product type, users, 3 key actions, multi-tenant, entities.
3. Create the `docs/` structure (requirements, analysis, database, architecture, flows, team).
4. Launch IN PARALLEL: `systems-analyst` (use cases + user stories) and `dba` (ERD + schema + dictionary).
5. Wait for both and emit a summary with next steps.

## EDD
Verify that the docs/ files exist and that the schema respects the rules in rules/ (alpha-omega);
mark each agent's deliverables with a checklist.

## Consolidation
Write to memory/STATE.md: phase "analysis", docs created, and next action (architecture).
