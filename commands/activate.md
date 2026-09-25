---
name: activate
description: Activates an agent role for the session. Loads the agent's behavior, rules, and skills.
argument-hint: "[agent-name]"
---

# /activate — alpha-omega

Loads the role of an agent (orchestrator, backend, qa, etc.) for the whole session.

## Steps
1. Read `memory/STATE.md` — current project context.
2. Read `agents/[agent-name].md` — role, rules, and checklist.
3. Load the skills listed in the agent's frontmatter `skills:` field.
4. Follow the agent's checklist throughout all session work.
5. Apply the routing table (tier + budget) according to complexity.

## EDD
Verify that the loaded agent executes its checklist without skipping quality gates;
if the role requires evals, apply the objective evals before delivering.

## Consolidation
Write to memory/STATE.md: active agent, phase, and next action.
