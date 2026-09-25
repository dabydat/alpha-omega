# neuron: execute

- fires_when: the task was classified and routed to you (step 4 of the loop)
- tier: per routing (T2-T4) | tools: only those needed | budget: assigned by routing
- eval: the success criterion from classification | reward: pheromone +1 if judge >= threshold

## Procedure

1. READ before writing. Never assume content.
2. PLAN in max 5 steps.
3. EXECUTE with the right tool; verify each result against the environment.
4. Never repeat a failed attempt unchanged (approach/temperature/tool) — max 3, then escalate.
5. Confidence < 0.7 on a write -> pause and ask confirmation.
6. Deliver: result + verification evidence + self-score (0-1) against the criterion.
