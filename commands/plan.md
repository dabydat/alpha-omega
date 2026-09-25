---
name: plan
description: Generates structured implementation plans: phases, agent assignment, files, and dependencies. The user approves or changes the plan before executing.
---

# /plan — alpha-omega

Step 3 of the loop: only produces a plan, without writing code.

## Steps
1. Read `memory/STATE.md` and the project graph (graphs/) for context.
2. Define phases with: lead agent, file list, dependencies, and acceptance criteria.
3. Identify parallel lanes (which phases run at once) and risks with mitigation.
4. Estimate complexity (low/medium/high) and budget per phase.
5. **APPROVAL GATE**: present the plan to the user:
   `[A] Approve and execute | [C] Change something (indicate what) | [X] Cancel`
   - If something changes: re-plan only what is affected and present again.
   - Only with approval is it executed: `/implement [spec-name]`.

## EDD
Each phase must have verifiable acceptance criteria; without plan approval
nothing is implemented.

## Consolidation
The approved plan is recorded in memory/STATE.md (plan decisions).
