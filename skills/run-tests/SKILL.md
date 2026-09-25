---
name: run-tests
description: Execution of the test suite with a structured report by severity. Use when tests must be run and results reported.
---

# neuron: run-tests

- triggers_when: the test suite must be run and a report produced
- tier: T2
- budget: 600 tokens
- eval: report with total/pass/fail/coverage and next steps -> threshold 1
- reward: pheromone +1 if eval >= threshold

## Procedure
1. Run the suite (bun/npm test, pytest, php artisan test).
2. Categorize results: PASS / FAIL / SKIP.
3. Classify failures by severity (CRITICAL/WARNING/INFO).
4. Report total, pass, fail, skip and coverage with file:line.
5. Recommend: block the merge if there are CRITICAL failures or coverage <80%.

## Checklist
- [ ] Complete suite executed (without skipping tests)
- [ ] Failures with file:line and error
- [ ] Skipped verified; coverage reported
- [ ] Next steps prioritized

## Pitfalls
- Approving the merge with CRITICAL failures
- Skipping failing tests
- Merge without running the suite
