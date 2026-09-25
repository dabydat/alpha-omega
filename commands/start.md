---
name: start
description: Starts a session with minimal token usage by reading memory/STATE.md. Emits a 5-line status summary.
argument-hint: "[project-folder]"
---

# /start — alpha-omega

Starts a session with minimal token spend by reading only memory/STATE.md.

## Steps
1. Read `memory/STATE.md` — current context, phase, and pheromone.
2. Emit exactly 5 lines: phase/project, last fact, next action, likely files, and blockers.
3. Do not read AGENTS.md or skills unless there is code work; do not re-explain structure.

## EDD
The summary must come from real memory/STATE.md (not invented); an empty state is reported
as "no measured data" and `/end` of the previous session is suggested.

## Consolidation
Does not write yet; only reads memory/STATE.md and waits for the task.
