---
name: code-review
description: Systematic code quality audit. Use when reviewing a file or PR before merging.
---

# neuron: code-review

- triggers_when: code must be reviewed and a merge verdict issued
- tier: T3
- budget: 2000 tokens
- eval: number of undocumented critical issues -> threshold 0
- reward: pheromone +1 if eval >= threshold

## Procedure
1. Read the complete code before opining.
2. Classify findings: critical, warnings, suggestions.
3. Document each issue with location, type, problem and fix.
4. Review the SOLID, quality, security and tests checklist.
5. Issue the verdict: Approve / Request Changes / Block.

## Checklist
- [ ] SOLID (5 principles)
- [ ] Quality (length, magic numbers, dead code)
- [ ] Security (input validation, injection, secrets)
- [ ] Tests (unit, feature, E2E on critical paths)

## Pitfalls
- Approving with critical issues pending
- Not locating the issue with file:line
- Ignoring input validation and secrets
