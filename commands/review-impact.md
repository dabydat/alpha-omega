---
name: review-impact
description: Code review with blast-radius analysis. Runs architect (graph trace) + qa-engineer (quality) IN PARALLEL.
argument-hint: "[file-path]"
---

# /review-impact — alpha-omega

Reviews code with impact analysis using the diagrams and two agents in parallel.

## Steps
1. Read the 3 graph diagrams (they are the map of the code); if missing, run `/build-graph`.
2. Launch IN PARALLEL: `architect` (trace blast-radius and risk) and `qa-engineer` (quality vs rules in rules/ (alpha-omega)).
3. Wait for both and emit integrated output: PASS/FAIL table + impact + refactor flags.
4. After applying feedback, update graphs with `/build-graph`.

## EDD
The qa-engineer applies the quality checklist and the architect marks dependents without tests
as CRITICAL; risk by node count (≤5/6-15/>15).

## Consolidation
Write to memory/STATE.md: files reviewed, quality verdict, and risk level.
