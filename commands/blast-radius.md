---
name: blast-radius
description: Traces what a change affects by reading the code graph diagrams (direct dependents, indirect dependents, and tests).
argument-hint: "[file-or-function]"
---

# /blast-radius — alpha-omega

Analyzes the blast radius of a change using diagrams, without scanning the whole repo.

## Steps
1. Read `graphs/code-graph.mermaid`, `graphs/code-deps.mermaid`, and `graphs/code-tests.mermaid`.
2. Locate the target node (`$ARGUMENTS`).
3. Trace edges outward (max. 2 hops): direct dependents → indirect → tests.
4. Emit a report: direct impact, indirect impact, test coverage, risk (LOW/MEDIUM/HIGH), and recommendation.
5. If the graph does not exist or is stale → suggest `/build-graph` first.

## EDD
Verify that every dependent without test coverage is marked as a risk (❌)
and that the risk level is computed by node count, not by intuition.

## Consolidation
Write to memory/STATE.md: target analyzed, risk level, and dependents without tests.
