---
name: lint
description: Runs the deterministic pattern linter (scripts/lint-patterns.js) over the codebase to catch quality-gate violations. Use before declaring a feature done, or as a quality gate on changed code. ~0 tokens (pure script, no model reasoning).
---

# /lint — alpha-omega

Deterministic quality gate. Verifies the actual code against the harness rules
(`rules/coding.md`): file length, console.log, long functions, too many params,
thin controllers, query DTO returns, and ValueObject immutability.

## Steps
1. Decide scope:
   - `node scripts/lint-patterns.js` — lint the whole project (or `--dir <path>`).
   - `node scripts/lint-patterns.js --dir apps/some-service/src` — lint one service.
2. Read the output. Violations are `file:line  [rule]  note`.
3. If violations: fix them (extract method, use LoggerPort, delegate to CQRS,
   return DTO, add Object.freeze), then re-run until clean.
4. If a rule is intentionally not applicable, disable it with `--no <rule>`.

## Output modes
- Default: human table + summary.
- `--json`: machine-readable (for CI / automation).
- `--quiet`: only the violation count (exit 1 if any).

## Rules checked
`file-too-long` · `console-log` · `long-function` · `too-many-params` ·
`controller-repo` · `query-returns-entity` · `vo-not-frozen`

## Consolidation
Report the result (PASS/FAIL) in the task outcome; fix any FAIL before done.
