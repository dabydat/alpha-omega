---
name: build-graph
description: Builds or updates the code knowledge graphs (graphs/) for token-efficient context.
argument-hint: "[path]"
---

# /build-graph — alpha-omega

Generates the project's 3 graphs in `graphs/` (alpha-omega convention, graph-thinking rule;
canonical format: examples/graph.mermaid).

## Steps
1. Scan `src/` and `tests/` (or only `$ARGUMENTS` if provided).
2. Generate `graphs/code-graph.mermaid`: modules, public functions/classes, and
   edges (CALLS, IMPORTS, INHERITS, TESTED_BY). Max ~50 nodes.
3. Generate `graphs/code-deps.mermaid`: which file imports which.
4. Generate `graphs/code-tests.mermaid`: coverage — covered vs not covered.
5. On incremental updates: read the previous graph and touch only changed nodes/edges.

## EDD
- Report % of functions with tests.
- Every node without a TESTED_BY edge must be explicitly marked as "no coverage".

## Consolidation
Write to memory/STATE.md: nodes/edges generated and measured coverage %.
