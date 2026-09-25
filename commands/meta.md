---
name: meta
description: Forces the meta-prompt flow manually. The flow activates with switch.meta_prompting (boolean in config.json); this command exists only to force it.
argument-hint: "[the user's task]"
---

# /meta — alpha-omega

Instantiates the META-PROMPT. It fires automatically with EVERY task the
user writes. It is the entry contract: without a meta-prompt, the loop does not start.

## Steps

1. Receive the user's task (the ACT).
2. Read memory/STATE.md. If there are NO project facts (empty memory or first use),
   ask the context questions TO THE USER (only once, all together):
   - What problem does this project solve and for whom?
   - What is the stack (language, framework, DB)? (if there is a switch, read it from there)
   - What must the system NOT do? (out of scope)
   - How is success measured? (measurable criterion)
   - Constraints? (budget, time, regulation)
   If the memory already has context: do NOT ask, use it.
3. Build the META-PROMPT with the fixed format and launch it as the canonical
   prompt of the act (it is the normalized "original prompt"):
   ```
   ACT: <user's task> | CONTEXT: <project+stack+memory> |
   REQUIREMENTS: <measurable> | AGENTS: <roles> | EXPECTED OUTPUT: <criterion>
   ```
4. Pass to the loop: 1. PERCEIVE -> 2. ROUTE -> 3. PLAN.

## EDD

Criterion: the meta-prompt is complete (no empty fields) BEFORE perceiving.
If the user does not answer the questions: mark "CONTEXT: to be confirmed" and
operate with safe defaults — NEVER invent context.

## Consolidation

The user's answers are saved as facts in memory/STATE.md (never ask them again).
