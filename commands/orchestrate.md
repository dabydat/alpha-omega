---
name: orchestrate
description: Generates agent orchestration files for exhaustive analysis of a project.
---

# /orchestrate — alpha-omega

Generates reusable orchestration files to analyze with multiple agents.

## Steps
1. Ask for: task to analyze, prompt file, orchestrator file, and output file.
2. Generate the analysis prompt (objectives, agent assignment, output format, checkpoints).
3. Generate the orchestrator with exact Task tool parameters per agent.
4. Flow: Phase 1 PARALLEL (explore + architect) → Phase 2 sequential (backend-dev) → Phase 3 compile outputs into the final file.

## EDD
Verify that each agent output ends with its marker ("---END OF [AGENT] ANALYSIS---")
and that the final file compiles all sections.

## Consolidation
Write to memory/STATE.md: analysis generated, agents used, and output files.
