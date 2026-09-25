---
name: end
description: Saves all session state to memory/STATE.md and closes. MANDATORY at the end.
---

# /end — alpha-omega

Consolidates the session into memory/STATE.md and closes. Mandatory, cannot be skipped.

## Steps
1. Mark completed sprint tasks (status DONE).
2. Update `memory/STATE.md`: phase, last session, next action, facts, and decisions.
3. Update the pheromone table (successes/failures/score) with the measured loop.
4. Emit a 2-line confirmation: saved and next step.

## EDD
Verify that memory/STATE.md was updated; a session without consolidation is a failure
and the next start begins blind.

## Consolidation
Write to memory/STATE.md: facts, decisions, and session pheromone.
