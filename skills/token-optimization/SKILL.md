---
name: token-optimization
description: Token economy and context optimization. Use when seeking to minimize token consumption or the context exceeds 60%.
---

# neuron: token-optimization

- triggers_when: seeking to save tokens or the context exceeds 60% of the limit
- tier: T1
- budget: 300 tokens
- eval: context <=60% and no repeated context -> threshold 1
- reward: pheromone +1 if eval >= threshold

## Procedure
1. Never repeat context: use memory/STATE.md, AGENTS.md and diagrams.
2. Prefer diagrams over text (5x fewer tokens).
3. Use short prompts with file references.
4. Always update memory/STATE.md when finishing.
5. Compact when exceeding 60% or changing phase.

## Checklist
- [ ] Context in files, not repeated in the prompt
- [ ] Diagrams for complex flows
- [ ] One task per prompt
- [ ] Explicit response format; memory/STATE.md updated

## Pitfalls
- Pasting complete files when one section suffices
- Re-explaining context already in memory/STATE.md
- Not compacting on multi-day tasks
