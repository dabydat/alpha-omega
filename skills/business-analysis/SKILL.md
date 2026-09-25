---
name: business-analysis
description: Business analysis templates, use cases and user stories. Use when eliciting requirements or creating business documentation.
---

# neuron: business-analysis

- triggers_when: well-specified requirements, use cases or user stories are needed
- tier: T2
- budget: 800 tokens
- eval: use case with alternate flow and 2 acceptance criteria -> threshold 1
- reward: pheromone +1 if eval >= threshold

## Procedure
1. Elicit with the 10 business context questions.
2. Analyze actors (primary, secondary, AI agent, external).
3. Specify use cases: odd steps=actor, even steps=system.
4. Write stories with 2+ binary GIVEN/WHEN/THEN criteria.
5. Produce a handoff summary for the architect.

## Checklist
- [ ] Every actor has at least one goal
- [ ] Main flow alternates actor/system
- [ ] >=2 binary acceptance criteria per story
- [ ] Always-true business rules recorded

## Pitfalls
- Omitting the system response in the steps
- Non-binary acceptance criteria (not verifiable)
- Stories >3 days without splitting
