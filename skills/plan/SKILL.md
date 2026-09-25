---
name: plan
description: Structured implementation plans by phases. Use when the task touches >1 file, is architectural or is estimated at >2 hours.
---

# neuron: plan

- triggers_when: the task is non-trivial (>1 file, architectural or >2 hours)
- tier: T3
- budget: 1200 tokens
- eval: plan with phases, dependencies and acceptance criteria -> threshold 1
- reward: pheromone +1 if eval >= threshold

## Procedure
1. Read memory/STATE.md and existing diagrams (without writing code).
2. Divide into phases with agent, files, dependencies and acceptance criteria.
3. Identify parallel lanes and risks with mitigation.
4. Estimate complexity (Low/Medium/High) and token budget.
5. Get approval and launch /implement.

## Checklist
- [ ] Phases with files and assigned agent
- [ ] Dependencies and parallel lanes identified
- [ ] Testable acceptance criteria
- [ ] Risks with mitigation

## Pitfalls
- Planning trivial tasks (<1 file)
- Writing code during planning
- Omitting dependencies between phases
