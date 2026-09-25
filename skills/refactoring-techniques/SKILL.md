---
name: refactoring-techniques
description: Catalog of code smells and refactoring techniques. Use when a smell is detected in review or before delivering code.
---

# neuron: refactoring-techniques

- triggers_when: a code smell is detected or code is refactored before delivering
- tier: T2
- budget: 500 tokens
- eval: smell detected with correct cure applied -> threshold 1
- reward: pheromone +1 if eval >= threshold

## Procedure
1. Detect the smell by category: bloaters, OO abusers, change preventers, dispensables, couplers.
2. Identify the signal (function >30 lines, 4+ parameters, duplication).
3. Apply the corresponding cure (Extract Method, Extract Class, Move Method).
4. Assign severity (critical/high/medium/low) and prioritize.
5. Refactor and verify tests are green.

## Checklist
- [ ] Smell correctly categorized
- [ ] Correct cure technique applied
- [ ] Severity assigned
- [ ] No remaining duplication or magic numbers

## Pitfalls
- Leaving duplicated code unrefactored
- Using the wrong cure for the smell
- Skipping the refactor when a smell is detected
