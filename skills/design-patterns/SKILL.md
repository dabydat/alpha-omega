---
name: design-patterns
description: Design pattern recommendations (creational, structural, behavioral). Use when designing an abstraction and a pattern must be chosen.
---

# neuron: design-patterns

- triggers_when: a design pattern must be chosen before implementing
- tier: T2
- budget: 400 tokens
- eval: pattern chosen with correct justification -> threshold 1
- reward: pheromone +1 if eval >= threshold

## Procedure
1. Identify the need: create, compose or communicate objects.
2. Walk the decision tree (runtime type? incompatible interfaces? algorithm selection?).
3. Choose the pattern that solves the concrete need.
4. Discard anti-patterns (no Singleton if multiple instances, no Factory if `new` suffices).

## Checklist
- [ ] Need classified (creational/structural/behavioral)
- [ ] First-choice pattern considered
- [ ] Alternative evaluated if it applies
- [ ] Anti-patterns discarded

## Pitfalls
- Singleton for multi-instance services
- Adapter when simple delegation suffices
- State when a simple if/else is enough
