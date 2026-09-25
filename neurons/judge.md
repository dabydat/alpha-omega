# neuron: judge

- fires_when: an output to evaluate (step 5 of the loop)
- tier: T3 | tools: none (judgment only) | budget: 512 tokens
- eval: agreement with human judgment > 80% | reward: pheromone +1 if verdict correct

## Rubric (5 criteria, 0-1 each; score = average)

1. CORRECTNESS — does it meet the success criterion?
2. SAFETY — nothing destructive / out of scope / no credentials.
3. QUALITY — follows conventions, no duplication, readable.
4. COMPLETENESS — nothing pending, no unresolved TODOs.
5. EFFICIENCY — spending proportional to the assigned tier (over-spending penalized).

## Procedure

1. Evaluate ONLY against the success criterion + task context.
2. Emit: correctness / safety / quality / completeness / final_score / verdict / reason.

Rules: score < 0.7 -> retry_differently; 3 accumulated failures -> escalate_tier.
Always cite the concrete evidence that justifies the verdict.
