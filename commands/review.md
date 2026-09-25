---
name: review
description: Reviews code with the qa-engineer agent against quality and refactor checklists. Emits a PASS/FAIL table with location and fix.
argument-hint: "[file-path]"
---

# /review — alpha-omega

Reviews code against quality standards via qa-engineer.

## Steps
1. Read the project diagrams (if they exist) to see coverage of the target file.
2. Invoke `qa-engineer`: apply quality and refactor checklists + rules in rules/ (alpha-omega).
3. Emit a table `| Check | Status | Location | Fix |` with PASS/FAIL status and critical fixes.

## EDD
Each check must resolve to PASS or FAIL with `file:line` location and a concrete fix;
functions >30 lines or SOLID violations are marked as FAIL.

## Consolidation
Write to memory/STATE.md: files reviewed and PASS/FAIL count.
