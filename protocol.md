# alpha-omega — Agnostic Protocol (Source of Truth)

> This file is the ONLY source of truth for the harness. Each AI tool reads ONE
> thin gate entry that points to this generic content (loaded just-in-time).
> The gates are: `AGENTS.md` (opencode), `.claude/CLAUDE.md` (claude), `.cursor/rules/nsp-rev.mdc`,
> `.github/copilot-instructions.md`, `.gemini/GEMINI.md`. If something changes,
> change it here.

## Identity

alpha-omega is a harness and framework
for an agentic layer inspired by the brain (neurons, synapses, dopamine,
consolidation) and by Ant Colony Optimization (pheromone). It is not a model:
it is the machinery that wraps any model and extracts its ceiling with the
lowest token spend.

Official foundations (modern sources, with URL):
- Anthropic, "Effective context engineering for AI agents" (sep-2025):
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
  Context = a finite resource; the goal is the minimal set of high-signal tokens.
- Anthropic, "How we built our multi-agent research system" (jun-2025):
  https://www.anthropic.com/engineering/multi-agent-research-system
  Token usage explains 80% of the performance variance; the agentic
  architecture adds +90.2% over the same model.
- OpenAI Agents SDK (context management): context enters the LLM only through
  4 gates. https://openai.github.io/openai-agents-python/context/
- Google ADK: context is treated as source code (every token pays for its
  place). https://google.github.io/adk-docs/

## The CONFIG (operational law — read FIRST)

`config.json` is the operational source of truth (the control panel). The agent
reads it before any task. It declares: `ai_org` (which gate is open), `mcp`
(servers to use), `blocked_files` (never read those), `actions` (allowed by
power), `switch` (active components/stacks), `scripts` (what may run),
`budget` (token limits), `author`.

Rule: if the CONFIG doesn't allow it, it is not done. The CONFIG overrides any
other instruction. See the file itself for the full field list.

## The ACT and the Meta-Prompt (input of EVERYTHING — controlled by the switch)

All work enters as an **ACT**: any prompt the user writes.
Meta-prompting is enabled with the `switch.meta_prompting` boolean of
config.json:

- **true (default):** with each agent prompt:
  1. Reads memory/STATE.md: if it is empty (first use), asks the context questions
     to the user ONCE, all together (problem, stack, out of scope,
     success criteria, constraints). If it already has context: it does not ask.
  2. Builds the META-PROMPT (fixed format) and launches it as the canonical
     prompt of the act — it is the normalized "original prompt":
     ```
     ACT: <the user prompt> | CONTEXT: <project+stack+memory> |
     REQUIREMENTS: <measurable> | AGENTS: <roles> | EXPECTED OUTPUT: <criteria>
     ```
  3. The normalized act enters the loop: perceive -> route -> PLAN.
- **false:** the agent operates directly, with no meta-prompt and no formal plan.

## Communication language (total control)

`language` in config.json declares the language of ALL harness
communication: meta-prompt questions, plans, agent outputs,
memory/STATE.md content and generated documentation. The agent ALWAYS communicates
in that language, with no exceptions — that provides consistency and control.

## Metrics (what, where and how they are calculated)

Controlled by `switch.metrics` of config.json.

### What is measured (6 fields, no exceptions)
1. **Time per step**: perceive / route / plan / fire / evaluate (ms).
2. **Total latency**: from the start of the meta-prompt to the end of consolidate (ms).
3. **Estimated tokens**: (characters read + characters generated) / 4 — standard
   estimation method, declared and consistent.
4. **Judge score**: 0-1 with the 5-criteria rubric.
5. **Retries / escalations**: real counter of step 5.
6. **Efficiency**: score / tokens × 1000 = utility per 1k tokens.

### Where they are recorded
In `memory/STATE.md -> Metrics section` (the only state file), when consolidating
(step 6). Exact format:

```markdown
## Metrics
- session: <id> | date: <YYYY-MM-DD> | goal: <criteria of the act>
- steps_ms: perceive=.. route=.. plan=.. fire=.. evaluate=..
- total_latency_ms: ..
- estimated_tokens: .. (reads .. + output ..)/4
- judge_score: .. | retries: .. | escalations: ..
- efficiency: .. (score per 1k tokens)
- plugins: <name>=tokens:<n>,score:<x> (one line per fired plugin)
```

### How they are calculated (exact formulas)
- step_ms = end_timestamp − start_timestamp of each step (real agent marks)
- latency = t[consolidate_end] − t[meta_start]
- tokens = (Σ characters of read files + Σ generated characters) / 4
- efficiency = judge_score / estimated_tokens × 1000

### Flow map
```
switch.metrics = true
  -> each loop step records t_start/t_end
  -> what was read and generated is counted (chars/4)
  -> the judge emits a score with the rubric
  -> each fired PLUGIN records its own line (tokens + score)
  -> it is written to memory/STATE.md -> Metrics (in step 6, consolidate)
  -> efficiency feeds the route pheromone (memory -> routing)
```

### Plugins: everything is demonstrated the same way
A fired plugin is one more neuron: it records its own metrics line
(tokens consumed + score obtained) in the same section. A plugin with no
recorded metrics cannot claim value: without measurement, there is no fact.

### Validation tool
`scripts/metrics.js` reads memory/STATE.md, validates the Metrics section and
computes aggregates (sessions, average score, average efficiency, total
tokens). Run: `node scripts/metrics.js` — metrics are demonstrated, not assumed.
aggregates (sessions, mean score, mean efficiency, total tokens).

## Mandatory transparency (the user knows EVERYTHING before executing)

Before executing ANY action, the agent PRESENTS to the user:
1. The complete META-PROMPT (what was understood: act, context, requirements,
   agents, expected output).
2. The PLAN (phases, parallel lanes, agents, budget).
And waits for the APPROVAL GATE:
`[A] Approve and execute | [C] Change something | [X] Cancel`
The user must be clear and aware of what will be done BEFORE it is
done. Only with approval does it execute through the entire harness.
Without a meta-prompt, the loop does not start. Never invent context: if it is
missing, mark "to confirm" and operate with safe defaults.
The `/meta` command exists only to force the flow manually.

## Plugins (extension without spending millions of tokens)

A plugin = a self-contained folder with: manifest (name, fires_when, tier,
budget, eval) + neurons + evals + adapter files if applicable.

Registration and zero-spend guarantee:
1. It is registered in config.json -> `switch.components += "plugins:<name>"`.
2. On startup only the MANIFEST is read (~5 lines) — never the content.
3. The content is loaded JUST-IN-TIME: only when its fires_when condition is met
   (the same proven mechanism as neurons: ~44 lines per pattern).
4. Every plugin must bring at least 1 objective eval (EDD): no evals, no entry.
5. Maximum budget declared in the manifest: the plugin cannot spend more.
6. An inactive plugin costs 0 tokens: it does not inject global instructions,
   only loadable neurons.

Evidence that the pattern works: the harness itself uses it — the minimal
switch (core only) deploys 13 files and 1,608 bootstrap tokens vs 119
files in full mode.

## The 7 Laws

### L0 — THE SWITCH (read only what is active)
Before operating, read `config.json`. Only load the adapters,
components and neurons marked as active. What is disabled is NOT read even if
it exists in the repository. This law is the token-saving mechanism of the
harness: the agent spends attention only on what the switch enables.

### L1 — NEURON (minimal unit of value)
A neuron is a high-value pattern: a skill, a prompt block or a
tool contract. Maximum 30 lines. If it grows more, it is split.
> "The smallest possible set of high-signal tokens" (Anthropic).

### L2 — SYNAPSE (route, don't orchestrate)
There is no negotiation between agents. There is a deterministic table:
`(complexity, intent) -> exact neuron + tier + budget`.
> "If a human engineer can't definitively say which tool should be used,
> an AI agent can't do better" (Anthropic).

### L3 — DOPAMINE (evaluation as the only reward)
Every neuron declares ONE measurable criterion (0-1) and a threshold. Without
eval, the neuron does not exist. What does not pass the threshold is never deployed.
> EDD: evals with small samples from day one; LLM-as-judge with a single
> rubric (Anthropic).

### L4 — PHEROMONE (reinforcement of the winning path)
Each execution with eval >= threshold deposits +1 on the used route. Routes
with more pheromone gain priority; the ones that fail decay. The colony converges
on its own to the optimal path, with no central orchestrator.

### L5 — ATTENTION (context = finite currency)
Budget per task according to tier. Only 4 information entry gates:
(1) instructions, (2) input, (3) on-demand tools, (4) retrieval.
At 80% of the budget: compaction (high-fidelity summary + window restart;
decisions, open bugs and the 5 recent files are preserved).
> OpenAI (4 gates) + Anthropic (compaction, sep-2025).

### L6 — CONSOLIDATION (a single memory file)
All persistence lives in `memory/STATE.md`. Only facts, decisions and pheromone.
Never transcripts. Each entry: maximum 3 lines. Limits: 20 facts,
20 decisions. When exceeded, the oldest are compacted.
> Structured note-taking / agentic memory (Anthropic, sep-2025).

### L7 — LADDER (the right tier by complexity)
The cheapest classifier decides the tier. Spending frontier on a trivial
task is the only token sin. Escalate only when the eval demands it.

## The Loop (complete agentic flow)

```
ACT (from the user)
 -> /meta INSTANTIATES ITSELF (asks context if memory/STATE.md is empty)
 -> META-PROMPT (normalize: act/context/requirements/agents/output)
 -> 1. PERCEIVE   — perceive neuron: complexity (trivial|simple|moderate|complex|expert)
                    + intent (code|search|refactor|tests|docs|ops|research)
 -> 2. ROUTE      — deterministic table -> executing neuron + tier + budget (ROUTING.md §11)
 -> 3. PLAN       — MANDATORY: decompose into subtasks with dependencies, parallel
                    lanes, agent and budget per subtask (<=5 steps/phases).
                    APPROVAL GATE: [A] Approve | [C] Change | [X] Cancel.
                    Without approval there is no firing.
 -> 4. FIRE       — the neuron executes ONLY with its tools, following the plan,
                    verifying each result against the environment
 -> 5. EVALUATE   — judge neuron (model different from the executor) scores 0-1 against the criterion
 -> 6. REINFORCE  — score >= threshold: deliver + pheromone+1
                    score < threshold: retry DIFFERENT (temperature +0.2) — max 3 attempts
                    after 3 failures: escalate one tier — never repeat the same thing
 -> 7. CONSOLIDATE — write to memory/STATE.md: key fact, decision, route, score
```

Golden rule: retry different, never repeat the same (Ramp: retry with
variable temperature; Anthropic: errors are corrected, not repeated).

## Routing (tiers + synapse)

The deterministic routing — complexity → tier → budget → neuron — is defined
**once** in **`ROUTING.md` §11 (The Synapse)**, the single source. The tier
ladder (trivial→T1 … expert→T4), the budget per tier, the classification
criteria and the `(intent, complexity) → neuron` synapse table all live there.
Do not duplicate them here.

## Neuron Contract (universal format)

```markdown
# neuron: <name>
- fires_when: <exact condition>
- tier: T1|T2|T3|T4
- tools: [only the necessary ones]
- budget: <tokens>
- eval: <measurable criterion> -> threshold <0.7>
- prompt: <max 20 lines: identity, tools, constraints, output_format>
- reward: pheromone +1 if eval >= threshold
```

The 3 core neurons (always present):

| Neuron | Function | Eval |
|---------|---------|------|
| perceive | classifies complexity + intent | routing accuracy > 85% |
| execute | executes the task with bounded tools | task's own criterion |
| judge | scores the output (model != executor) | agreement with human judgment > 80% |

## Memory schema (memory/STATE.md)

```markdown
# memory/STATE.md — the only state file of the project
## State
- phase / last_session / next_action   (3 lines)
## Facts (max 20, 3 lines each; when exceeded the oldest are compacted)
- h#: ...
## Decisions (max 20, format: D#: what / why)
## Pheromone
| route | wins | failures | mean_score |
|------|--------|--------|-------------|
## Budget
- tokens last session / compactions executed
```

## Operating rules (mandatory)

1. No claim without measurement. No invented numbers.
2. Never write before reading; never execute before planning.
3. Never repeat a failed attempt without changing something (temperature, prompt, tier).
4. Confidence < 0.7 on a write -> pause and ask for confirmation.
5. Memory is written AT THE END of each task, not during.

## EDD — Eval-Driven Development (mandatory pipeline)

Every feature follows the cycle: SPEC -> EVALS -> IMPLEMENT -> JUDGE.

1. SPEC (`specs/*.md`): what is built, MEDIBLE acceptance criteria,
   failure cases, out-of-series scope. Maximum 1 page.
2. VERIFY: deterministic checks (e.g. scripts/lint-patterns.js) against the stack rules.
   Objective evals: the critical cases that must always pass.
3. IMPLEMENT: the executing neuron produces the output.
4. JUDGE: scores 0-1 with the rubric. Score < threshold -> retry different.
   Failing an objective eval -> blocked, no negotiation.

EDD rule: a user correction becomes a new eval
(so the system does not make the same mistake twice).

## Feature Registry (features.json — structured state)

**Applied in this harness.** Controlled by `switch.feature_registry`
(boolean, default true). When true: EVERY task the user writes creates or
updates a feature entry in `features.json` — proposed at /meta, then status
advances only at its bound loop step. When false: no registry tracking
(minimal mode, features are not recorded).

JSON for state, text for progress — per Anthropic context engineering:
structured formats (JSON) for state data; unstructured text for progress
notes. Reference links:
- [Anthropic — structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [Anthropic — Agent SDK todo tracking](https://code.claude.com/docs/en/agent-sdk/todo-tracking)
- [OpenAI — structured outputs](https://platform.openai.com/docs/guides/structured-outputs)
- [OpenAI — Agents SDK sessions](https://openai.github.io/openai-agents-python/sessions/)

Every feature lives in `features.json`, validated against the formal schema
`features.schema.json` (JSON Schema draft-07) — the contract every model
consumes to read and update feature status and tasks.

Exact binding to the loop (no gaps):
| Loop step | Registry action |
|-----------|-----------------|
| 0. /meta (auto) | CREATE entry: status `proposed`, id FEAT-XXX, tier, budget, agent, spec path reserved |
| 3. /plan | status `planned` + fill the `plan` field (reference to the plan file) |
| gate [A] | status `in_progress` |
| gate [X] | status `rejected` |
| 5. three failed retries | status `blocked` (before escalation) |
| 6. judge >= threshold | status `done` + `last_update` |

Rules:
- The registry is updated EXCLUSIVELY by the agent. The human never edits
  features.json — the human only approves or rejects at the gate.
- A feature without entry in features.json does not exist.
- Status changes ONLY at its bound loop step — never ad-hoc.
- Metrics are recorded by the agent at consolidation (step 6):
  time_actual_ms (the REAL duration — updated even when it overran the
  estimate), tokens_actual, score, retries. The track holds the complete
  history per feature, never just the plan.
- `scripts/features.js` validates the registry against the schema (GREEN/errors)
  and `--chart` renders features-chart.svg (estimated vs actual time per
  feature + score) — the visible benchmark of the track.
- memory/STATE.md keeps session facts; features.json keeps feature state; the schema
  keeps the contract all models share.

## How to add a new stack (canonical recipe)

The active stack (`config.json → skills/<stack>`) is the canonical example. To create a new stack:
1. `mkdir -p skills/<stack>/` — its knowledge lives there (that is its "stack").
2. `skills/<stack>/SKILL.md` — pattern index (pattern | fires_when | tier | budget | eval).
3. `skills/<stack>/<pattern>/SKILL.md` — trigger, code skeleton, checklist, pitfalls.
4. a deterministic check (e.g. scripts/lint-patterns.js) for the stack.
5. Activate: `config.json -> switch.stacks += "<stack>"` (its knowledge is `skills/<stack>/`).
6. The bridge skill is generic — it reads `switch.stacks` and loads `skills/<stack>/`.

Principle: knowledge is paid for once when condensed; each pattern is
read only when firing. Everything self-contained, zero external references.

## AGENTS.md standard (universal compatibility)

This protocol compiles to `AGENTS.md` (agentsmd standard: read by Codex,
Copilot, opencode, Gemini-as-fallback). The harness is SELF-CONTAINED: all
knowledge lives inside the harness folder:

- `agents/` — 19 alpha-omega agents (orchestrator, architect, devs, QA, DBA...)
- `commands/` — 14 alpha-omega commands (loop, eval, spec, implement...)
- `rules/` — 8 alpha-omega rules (coding, testing, EDD...)
- `skills/` — universal skill-neurons
- `skills/<stack>/` — the active stack's patterns (e.g. skills/nestjs)
- `neurons/` — the loop neurons (perceive, execute, judge, stack)
- `scripts/` — verification (lint-patterns.js)
- `memory/STATE.md` — the only state

Each tool reads ONE thin gate entry (points to the generic content, just-in-time):
- opencode -> `AGENTS.md`
- Claude Code -> `.claude/CLAUDE.md`
- Copilot -> `.github/copilot-instructions.md`
- Gemini -> `.gemini/GEMINI.md`
- Cursor -> `.cursor/rules/nsp-rev.mdc`
