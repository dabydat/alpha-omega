---
name: setup-stack
description: Generates stack-specific agents, skills, and configs, creating the active stack (config.json) without touching the universal configuration.
argument-hint: "[stack-description]"
---

# /setup-stack — alpha-omega

Auto-generates the development configuration for a given stack.

## Steps
1. Receive the stack description (e.g. "TypeScript + Node + Express + PostgreSQL").
2. Create the active stack (config.json) with REAL code patterns and examples (not pseudocode).
3. Add it to `config.json → switch.stacks` and put its knowledge at `skills/<stack>/` for reuse.
4. Create new agents/skills only if the stack requires it; if not, the existing ones adapt.
5. Do not touch universal configuration (AGENTS.md, rules, base skills, memory/STATE.md, commands).

## EDD
Verify that existing agents read the active stack (config.json) and that skills are not duplicated;
emit a checklist of created vs reused.

## Consolidation
Write to memory/STATE.md: stack configured, new agents/skills, and next step.
