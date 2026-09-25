---
name: code-quality
description: Non-negotiable code quality standards. Use when writing or reviewing any code in any language.
---

# neuron: code-quality

- triggers_when: code is written or reviewed and must meet quality standards
- tier: T2
- budget: 500 tokens
- eval: number of violations of universal rules -> threshold 0
- reward: pheromone +1 if eval >= threshold

## Procedure
1. Apply strict typing (parameters and returns, 0 public methods without type).
2. Keep functions <=30 lines (Extract Method) and files <=300 (Extract Class).
3. Remove magic numbers, dead code and debug code.
4. Write actionable errors and tests (>=80% business logic).
5. Verify the pre-delivery checklist.

## Checklist
- [ ] Functions <=30 and files <=300 lines
- [ ] No magic numbers or debug code (console.log/dd/dump)
- [ ] Actionable errors
- [ ] SOLID + tests

## Pitfalls
- Default exports (use named exports)
- >3 parameters without a Parameter Object
- Skipping business logic tests
