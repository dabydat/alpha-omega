---
name: brainstorm
description: Multi-perspective ideation session with trade-off analysis. Use when there are multiple valid approaches or a technical decision with pros/cons.
---

# neuron: brainstorm

- triggers_when: several valid alternatives exist or a decision with trade-offs requires consensus
- tier: T2
- budget: 1500 tokens
- eval: number of perspectives with a trade-off matrix -> threshold 3
- reward: pheromone +1 if eval >= threshold

## Procedure
1. State the problem and simulate brainstorming from roles (architect, backend-dev, product-manager).
2. For each perspective: approach, 2-3 pros, 2-3 cons and best-when.
3. Build the trade-off matrix (speed, maintainability, UX, cost, reversibility).
4. Issue a recommendation with reasoning and a change condition.
5. Confirm with the user; if approved, run /plan and document the ADR.

## Checklist
- [ ] >=3 distinct perspectives
- [ ] Complete trade-off matrix
- [ ] Recommendation with change condition
- [ ] Confirmation before continuing

## Pitfalls
- Choosing the first idea instead of the best one
- Recommending without exploring all options
- Omitting the trade-off analysis
