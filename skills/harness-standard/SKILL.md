---
name: agent-harness-standard
description: >
  Standard for an agent harness with objective evaluation (ground truth) and
  verifiable reinforcement (routes.jsonl). ACTIVATE this skill when you are
  going to: (1) define, review or fix an eval, (2) write or audit a case in
  evaluations/, (3) route a task by complexity to a model tier (T1-T4), (4)
  create a new skill and package its objective evals, (5) measure a skill's value
  against a baseline (pass_rate + tokens), or (6) review routes.jsonl or its
  aggregation script. Do NOT activate it for trivial code without evaluation or
  routing.
---

# Agent Harness Standard

## Identity

This harness turns a coding agent's work into a measurable, improvable system.
Its purpose is that every routing decision, every action and every result can be
verified with a fact, not an impression. It is the skeleton that wraps opencode,
Claude Code, Cursor, Copilot or Gemini so they behave the same: same protocol,
same evaluation, same reward.

This is NOT a framework that replaces the agent's judgment, nor a "magic memory"
system that scores itself, nor a list of aesthetic rules. It is a verification
contract: if something cannot be measured with a stable value and compared with a
string, it does not enter the reward.

## The 7-step loop

Each cycle walks the **7-step loop** (perceive → route → plan → fire →
evaluate → reinforce → consolidate), preceded by the meta-prompt. The phases
below explain the WHY behind each part (they map onto the 7 steps, not replace
them).

1. **Activate (ACT + meta-prompt).** The trigger (a goal, a pattern, a change)
   activates the harness, which injects itself as context.
   Why: the agent must know the rules BEFORE acting, not after. If the standard
   is injected late, the agent already made decisions without rules.

2. **Orient (perceive + decompose + route).** Read the state
   (`MEMORY/STATE.md`), the relevant skill, `routes.jsonl` and the stack. Then
   **decompose the ACT into atomic sub-acts** (see "Multi-intent decomposition")
   and route EACH sub-act by its own complexity.
   Why: decisions are based on evidence, not the model's memory. And a prompt
   rarely carries a single question: if it is not split, everything is routed
   with one tier — either frontier is burned on the trivial or the expert is
   under-served.

3. **Decide (plan + approval).** Write an explicit plan and pass an approval gate
   when the cost justifies it.
   Why: spending a frontier model must be justified in advance. If the plan is
   not approved, the agent does not run anything expensive on its own.

4. **Act (execute).** Fulfill the plan. In this step you do not decide; you
   execute.
   Why: separating deciding from executing prevents the agent from changing
   course mid-way and hiding a bad plan with improvised execution.

5. **Measure (evaluate).** Compare the result against the ground truth.
   Why: the reward is a verifiable fact, not an opinion. If the reward is
   subjective, the agent learns to "sound good", not to solve.

6. **Learn (reinforce + consolidate).** Write the run to `routes.jsonl` and
   consolidate state. Why: learning persists as an aggregated record, not as a
   note the model edits by hand. The pheromone is not opined; it is measured.

## Multi-intent decomposition

A person's prompt almost never carries ONE question. It carries several. If the
ACT is treated as a single unit, one tier is chosen for everything — and that is
the most common token error. The rule is to split BEFORE routing, not after.

**PERCEIVE decomposes the ACT into N atomic sub-acts.** Each sub-act is
autonomous: one intent, one deliverable, one success criterion.

Rules:
- **Split on coordination**: "and", "also", "then", semicolon, or a distinct
  object (a file, an endpoint, a question).
- **Each sub-act gets its OWN** `(complexity, intent, tier, budget, neuron,
  success_criterion)`. The routing table applies per sub-act, not per ACT.
- **Discard no-ops**: "please", "thanks", greetings — not sub-acts.
- **Regroup dependents**: if a sub-act consumes another's output, they go in the
  same route (sequential), not parallel.

**Budget as a hard constraint.** After routing each sub-act, verify:
`Σ(budget_i) <= session_budget`. If it exceeds, sequence (not parallel) or
compress the plan. No sub-act exceeds its own budget.

**Execute cheapest first (T1 → T4).** Process trivial first to fail fast and
cheap; only escalate what truly needs it.

**The synapse is a REAL table, not a model decision.** The mapping
`(complexity, intent) -> neuron` must be enumerated explicitly (in `ROUTING.md`
§11), not left to the LLM's interpretation. If the model picks the neuron name,
routing is not deterministic.

## Deterministic routing (T1–T4 ladder)

Complexity decides tier and budget. No negotiation. The ladder climbs one way:
trivial → T1; if it fails, climb one rung (retry DIFFERENTLY, max 3, then
escalate). Never repeat the same attempt — change the tier.

| Complexity | Tier | Token budget |
|------------|------|--------------|
| trivial    | T1   | 512 |
| simple     | T2   | 2,048 |
| moderate   | T3   | 8,192 |
| complex    | T3+  | 16,384 |
| expert     | T4   | 32,768 |

**Tie-break by empirical score.** When two routes are viable and the cost is
similar, decide by the best `success_rate` in `routes.jsonl`; if tied, by higher
efficiency (`score / tokens * 1000`). The pheromone is the evidence aggregated by
the script, never the model's taste.

## Objective evaluation

An eval is a question whose answer is ONE SINGLE VALUE. Rules:

- **Single value.** The answer is a string, boolean, number or date. If it is a
  list or object, it does not work: order and format cannot be verified.
- **Stable.** It relies on "closed" or historical concepts that do not change
  over time. A past fact does not mutate; a quality judgment does.
- **Independent.** It does not depend on another eval, on order, or on context.
- **Comparable.** Compared by direct string comparison.
- **Prefer aggregates.** Counts, superlatives, sums. A count verifies in one
  shot and does not depend on format.

LLM-as-judge is used ONLY as a secondary signal for qualitative aspects that
cannot be a single value: style, safety, tone. Never as the main reward.

**Well formed:**

```json
{
  "id": "controllers-003",
  "category": "controllers",
  "question": "How many @MessagePattern() does users.controller.ts declare",
  "answer": "3",
  "type": "count",
  "notes": "Fixed file; the count does not change over time"
}
```

**Poorly formed:**

```json
{
  "id": "controllers-004",
  "category": "controllers",
  "question": "Does the controller handle authentication and errors well?",
  "answer": "yes, robustly",
  "type": "judgment"
}
```

The second fails for four reasons: not a single value, subjective, not stable
(depends on who answers and when), and mixes two questions into one.

## Golden set

Each pattern category has a blocking set of evaluations:

- **Minimum 10 cases** per category.
- Each case has state: `green` (passes) or `red` (fails).
- **A failing eval blocks the merge, no negotiation.** If a case that should pass
  fails, the delivery does not advance. The case is not "disabled" nor is the
  answer rewritten to pass: the code is fixed.

Why: the objective evals are the safety net. Allowing reds is signing that the pattern
can break without consequences.

## Reinforcement (honest pheromone)

The pheromone is not a table the model edits; it is a record the script
aggregates.

- On **consolidation**, write a line to `routes.jsonl`: route, wins/failures,
  tokens, latency, score, efficiency.
- `scripts/routes.js` aggregates per route the **success rate** and **mean
  efficiency** (`score / tokens * 1000`).
- Deterministic routing uses that empirical score to tie-break.
- **Never self-score the pheromone by hand.** If the number did not come from
  the record, it is not a number.

## Measuring value (baseline)

No skill enters the standard without proving it contributes. Run the A/B loop:

1. **Baseline:** run the task WITHOUT the harness (no skill, no routing).
2. **With harness:** run the same task WITH the harness.
3. **Compare and report** `pass_rate` (percentage of green evals over the golden
   set) and `tokens` (cost per task).

The skill is accepted if it improves `pass_rate` without a disproportionate
increase in tokens. A skill that does not improve the result is cost without
benefit.

## What NOT to do

- **Do not invent numbers.** Not scores, not tokens, not eval results.
- **Do not self-score the pheromone.** The script aggregates; the model records
  and stays quiet.
- **Do not read disabled components.** If the switch turns off a stack or a
  skill, that content does not exist for the agent.
- **Do not repeat a failed attempt without changing something.** Retrying the
  same thing with the same route is burning tokens on a known result.
- **Do not spend frontier on trivial.** The routing table exists so T1 does not
  solve a rename.
- **Do not route a multi-question prompt as a single unit.** Decompose into
  sub-acts; each with its tier. One tier for everything = burned tokens or
  under-served work.
- **Do not let the model pick the neuron.** The synapse is an explicit table
  `(complexity, intent) -> neuron`; if the model invents it, routing is not
  deterministic.

## Neuron contract

A neuron is the smallest unit of knowledge the harness can evaluate and
reinforce. Universal format:

- `id` — unique identifier.
- `fires_when` — exact conditions that activate it (unambiguous).
- `tier` — model to use (T1-T4).
- `budget` — token budget.
- `eval_objetivo` — the verifiable case (single value, stable).
- `reward` — what the neuron gains: aggregated success rate and efficiency.
- `stack` — the pattern/stack it belongs to.

**Full example (NestJS controllers pattern):**

```yaml
id: controllers-get-by-id
fires_when: "A GET /:id endpoint is created or modified in a NestJS REST controller"
tier: T3
budget: 8192
eval_objetivo:
  question: "How many @Get(':id') are there in users.controller.ts"
  answer: "1"
  type: "count"
reward: "success rate of the eval + efficiency (score / tokens * 1000)"
stack: controllers
```

## Standard structure

```
protocol.md        -> the laws and contracts (what the harness is)
GUIDE.md           -> contribution guide and Good vs Bad criteria
config.json        -> switch on/off per stack
routes.jsonl       -> reinforcement record (one line per run)
scripts/routes.js  -> aggregates success rate and efficiency per route
agents/            -> agent configs (one agent per tier/stack)
skills/            -> skill package (SKILL.md + config + evaluations/)
skills/<stack>/     -> the active stack's patterns (e.g. skills/nestjs: 19 patterns)
scripts/          -> deterministic verification (lint-patterns.js)
specs/             -> reference specifications (depth)
```

**Read order:**

1. `protocol.md` — understand the harness.
2. `config.json` — verify the stack is active.
3. `GUIDE.md` — how to contribute and what is Good vs Bad.
4. `skills/` of the domain — `SKILL.md` → config → `evaluations/README` →
   `evaluations/*.json`.
5. `skills/<stack>/` of the active stack — its applicable patterns.
6. `routes.jsonl` — the empirical state of the routes.
7. `specs/` — depth, only if the problem requires it.
8. `scripts/routes.js` — to audit or aggregate routes.

Each `evaluations/` folder includes a `README` defining **Good vs Bad** criteria:
a criterion is "Good" when specific and testable, "Bad" when vague and
untestable.

## Quality checklist (before publishing)

- [ ] Each skill has at least one objective eval (single value, stable, string-comparable).
- [ ] Each pattern has **10+ objective eval cases**.
- [ ] Each case has green/red state, and a failing eval blocks the merge.
- [ ] `scripts/routes.js` exists and aggregates success rate and efficiency per route.
- [ ] `routes.jsonl` is updated only on consolidation (never by hand).
- [ ] There is a baseline benchmark: `pass_rate` + `tokens` (with vs without harness).
- [ ] The `description` is a nudge that triggers on concrete contexts.
- [ ] No emojis, no ALL-CAPS "MUST", each rule explains why.
- [ ] The skill proves it improves `pass_rate` without spiking token cost.
