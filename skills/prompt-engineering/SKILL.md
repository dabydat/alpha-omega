---
name: prompt-engineering
description: Techniques for clear and structured prompts. Use when writing or auditing a prompt for an agent.
---

# neuron: prompt-engineering

- triggers_when: a prompt is written or audited and must be precise and unambiguous
- tier: T1
- budget: 400 tokens
- eval: number of role+context+task+format elements present -> threshold 4
- reward: pheromone +1 if eval >= threshold

## Procedure
1. Be clear and direct (avoid vagueness).
2. Give context with file references (not "remember yesterday's").
3. Use XML for complex structure (task, spec, patterns, output).
4. Specify the output format and give examples when it matters.
5. Include role, context, task and quality criterion.

## Checklist
- [ ] No emojis or redundant instructions
- [ ] Role/identity defined
- [ ] Concrete task (not vague)
- [ ] Output format specified

## Pitfalls
- Asking for explanation + code (ask for code only)
- Vague references instead of file paths
- One huge multi-task prompt instead of 3 specific ones
