# neuron: perceive

- fires_when: a new task arrives and it must be classified (step 1 of the loop)
- tier: T1 | tools: none (reasoning only) | budget: 512 tokens
- eval: routing accuracy > 85% | reward: pheromone +1 if routing was correct

## Procedure

1. Determine COMPLEXITY: trivial | simple | moderate | complex | expert.
2. Determine INTENT: code | search | refactor | tests | docs | ops | research.
3. Emit EXACTLY: complexity / intent / tier / budget / neuron / success_criterion.

Rule: between two complexities choose the LOWER; escalation (step 6) corrects it.
