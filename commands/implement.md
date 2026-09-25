---
name: implement
description: Implements features from specs. Reads graphs and launches architect + backend-dev + frontend-dev IN PARALLEL, then qa-engineer.
argument-hint: "[spec-name]"
---

# /implement — alpha-omega

Implements a feature from its spec with parallel agent execution.

## Steps
1. Read `memory/STATE.md`, `specs/[spec-name]-spec.md`, its diagram (if it exists); run `/blast-radius` per file.
2. Launch IN PARALLEL: `architect` (approves design), `backend-dev`, and `frontend-dev` (implement, typecheck per file).
3. Wait for the three; then `qa-engineer` reviews and runs tests (quality gate).
4. Update graphs with `/build-graph` and verify the spec's acceptance criteria.
5. If there is a conflict between agents: `/brainstorm` and record the decision.

## EDD
Run the test suite and the quality checklist; explicit PASS/FAIL, and the spec
must meet its objective evals before being considered done.

## Consolidation
Write to memory/STATE.md: files changed, gate result, and decisions.
