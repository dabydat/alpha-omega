---
name: brainstorm
description: Generates multi-perspective ideation sessions with trade-off analysis for technical decisions.
---

# /brainstorm — alpha-omega

Explores multiple options from different roles before choosing a single answer.

## Steps
1. Take the problem described by the user.
2. Simulate 3 perspectives: architect (system), backend-dev (implementation), product-manager (business/user).
3. For each one: approach, pros, cons, and "best when".
4. Synthesize with a trade-off matrix (speed, maintainability, UX, cost, reversibility).
5. Recommend one option with reasoning, change condition, and next step.

## EDD
Confirm the recommendation with the user; if it is an architectural decision, record it
as a measurable fact/decision before proceeding to `/plan`.

## Consolidation
Write to memory/STATE.md the decision made and its reversal condition.
