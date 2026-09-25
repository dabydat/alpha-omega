# alpha-omega OPERATIONAL GUIDE (for AI agents)

> If you are an AI agent operating in a project with this harness, this guide is
> your manual. Read this BEFORE any task. It is short: 2 minutes.

---

## 1. On receiving each task (per switch.meta_prompting)

**Language:** ALL your communication (questions, plans, outputs, memory/STATE.md) is
done in the language declared in `config.json` (`language`). No exceptions.

**If `switch.meta_prompting = true`** (default), with EACH user prompt:

0. **Automatic META-PROMPT**: if memory/STATE.md is empty, you ask the context
   questions (once, all together); if it already has context, you do not ask.
   You build the META-PROMPT and launch it as the canonical prompt of the act:
   ```
   ACT: <user prompt> | CONTEXT: <project+stack+memory> |
   REQUIREMENTS: <measurable> | AGENTS: <roles> | EXPECTED OUTPUT: <criterion>
   ```
1. **Read the switch** `config.json`. Operate only with what is active.
   What is disabled is NOT read even if it exists. (Law 0)
2. **Run the loop** (section 2): perceive -> route -> **plan**.
3. **TRANSPARENCY + APPROVAL GATE**: you present the user the full META-PROMPT
   AND the PLAN (what will be done, with which agents, with what budget).
   The user must be clear and aware of what will be done BEFORE it is
   done. Wait for: `[A] Approve and execute | [C] Change something | [X] Cancel`.
   Only with approval do you execute (fire -> evaluate -> reinforce).
4. **Consolidate** into memory on finishing (section 3).

**If `switch.meta_prompting = false`:** you operate directly, without meta-prompt or
formal plan (fast mode, no gate).

**Metrics (`switch.metrics`):** if true, you measure at each step of the loop:
1. Mark t_start/t_end per step (perceive, route, plan, fire, evaluate).
2. Count characters read and generated -> tokens = (reads + output) / 4.
3. Record the judge score, retries and escalations.
4. Each fired plugin records its own line (tokens + score).
5. In step 6 you write the `## Metrics` section of memory/STATE.md (exact format and
   formulas in protocol.md; canonical example: examples/metrics.md).
6. Validate with `node scripts/metrics.js` — demonstrated, not assumed.
If false: you measure nothing.

**Feature registry (`features.json`):** if `switch.feature_registry` is true
(default), EVERY task you receive creates an entry (proposed at /meta). The
entry follows the formal schema `features.schema.json` (the contract all
models share). The registry is updated EXCLUSIVELY BY YOU (the agent) — the
human never edits it, they only approve at the gate. Status updates at the
bound loop step only: /meta -> proposed, 3 -> planned + plan reference, gate
A -> in_progress, gate X -> rejected, 5 -> blocked after 3 failures, 6 -> done
when judge >= threshold. At step 6 also record the metrics:
time_actual_ms (real duration, even if it overran the estimate), tokens_actual,
score, retries. Validate with `node scripts/features.js`; render the chart
with `node scripts/features.js --chart`. If false: no registry.

---

## 2. The loop (meta-prompt + plan + 7 steps, without skipping any)

> **This is the section the gate points to. Read THIS and stop — the rest of the
> file is reference (memory, what-NOT-to-do, concepts, errors) and is read only
> if you actually need it.**

```
ACT -> META-PROMPT -> 1. PERCEIVE -> 2. ROUTE -> 3. PLAN -> 4. FIRE
     -> 5. EVALUATE -> 6. REINFORCE -> 7. CONSOLIDATE
```

1. PERCEIVE — classify complexity + intent. When in doubt between two
   levels, choose the LOWER: escalating costs less than over-spending.
2. ROUTE — deterministic table:
   trivial->T1 512 tok | simple->T2 2,048 | moderate->T3 8,192 |
   complex->T3+ 16,384 | expert->T4 32,768 (frontier: Astra/Fable/Opus)
   Choose the exact neuron/agent: agents/ by role, the active stack (config.json → skills/<stack>)/
   by NestJS pattern (read ONLY the file of the neuron that fires).
3. PLAN — MANDATORY before acting: decompose the act into subtasks
   with dependencies, mark the parallel ones (lanes), assign agent and budget
   per subtask. Format: plan in <=5 steps or phases. Command: /plan.
   No plan, no fire. APPROVAL GATE: [A] Approve | [C] Change | [X] Cancel.
4. FIRE — execute the plan: read before writing, verify each step
   against the environment (tests, build, lint, real output).
   Graph rule: if `graphs/code-graph.mermaid` exists, read it BEFORE
   exploring files (one node = ~5 tokens vs one paragraph = ~100).
5. EVALUATE — score your output 0-1 against the success criterion, with the rubric
   of 5 criteria: correctness, safety, quality, completeness, efficiency.
6. REINFORCE — score >= 0.7: deliver + pheromone +1 on that route.
   Score < 0.7: retry DIFFERENTLY (change approach/temperature/tool),
   maximum 3 attempts. After 3 failures: escalate one tier. NEVER repeat the same.
7. CONSOLIDATE — write to memory/STATE.md (section 3).
```

---

## 3. Where and how to store memory (mandatory)

**A single file: `memory/STATE.md`.** Nothing more. It is written AT THE END of each task,
never during. Format:

```markdown
## Status
- phase / last_session / next_action
## Facts (max 20, 3 lines each)
- h#: learned fact
## Decisions (max 20)
- D#: what / why
## Pheromone (reinforced routes)
| route | successes | failures | avg_score |
## Budget
- session tokens / compactions
```

Memory rules:
- Only FACTS, DECISIONS and PHEROMONE. Never transcripts.
- Each user correction becomes a new eval (never fail
  the same way twice).
- If it exceeds 20 facts/decisions: compact the oldest.

---

## 4. What NOT to do (non-negotiable rules)

1. Do NOT read components disabled in the switch.
2. Do NOT write before reading; do NOT execute before planning.
3. Do NOT repeat a failed attempt without changing something.
4. Do NOT write to disk with confidence < 0.7 without asking for confirmation.
5. Do NOT invent performance numbers (every claim requires measurement).
6. Do NOT spend a frontier model on trivial tasks (use the ladder).
7. Do NOT create more memory files: memory/STATE.md is the only one.
8. Do NOT skip verification: every deliverable is checked against a measurable criterion.
9. Do NOT negotiate between agents: routing is deterministic.
10. Do NOT load knowledge that did not fire: read the exact neuron, just-in-time.
11. Do NOT overwrite a template (`config.json → templates.files`). SPECS → copy
    it to a new file. MEMORY → defines the FORMAT only: create your state in your
    adapter folder (e.g. `.opencode/memory/`) and read it THERE first, never in `memory/`.

---

## 5. Concepts (in one line)

- **Neuron** — minimum unit of knowledge: pattern/skill with trigger,
  tier, budget and eval. Read ONLY when its task fires.
- **Synapse** — the deterministic routing table (complexity+intent
  -> exact neuron).
- **Dopamine** — evaluation as the only reward (score 0-1 per neuron).
- **Pheromone** — +1 deposited by each successful route; winning routes gain
  priority, failing ones decay. The swarm converges on its own.
- **Switch** — config.json: what is active. What is disabled is not read.
- **Loop** — the universal 7-step flow (section 2).
- **Tier** — model level: T1 (flash) to T4 (frontier). Ladder by complexity.
- **Budget** — maximum tokens per task by tier. At 80%: compaction.
- **EDD** — cycle spec -> evals -> implement -> judge.
- **Golden set** — critical evals that can never fail: red = block.
- **Compaction** — at 80% of context: high-fidelity summary + restart,
  preserving decisions, open bugs and the 5 recent files.
- **Harness** — the machinery that wraps the model to extract its ceiling:
  it does not create intelligence, it multiplies it.

## 6. Where everything is (your operational context)

| You need | Go to |
|-----------|------|
| The loop, memory and what NOT to do | this file (GUIDE.md) |
| A concept | section 5 of this file |
| The full law (when extending) | protocol.md |
| Which agent to use by role | agents/ (18 agents with fire_when) |
| Which command orchestrates which flow | commands/ |
| Quality rules | rules/ |
| Explore the codebase cheaply | graphs/*.mermaid (via /build-graph; graph before files) |
| Technology pattern (the active stack) | skills/<stack>/ (only the one that fires) |
| Create a new stack | protocol.md (canonical recipe) |
| When to create a spec | specs/ (triggers in README.md) |
| When to run the linter | scripts/lint-patterns.js (on demand) |
| The exact shape of an artifact | examples/ |
| Project status | memory/STATE.md |

---

## 7. Common errors (and their correction)

| Error | Correction |
|-------|------------|
| Read the full stack "just in case" | Read only the neuron that fires (just-in-time) |
| Retry with the same prompt | Change something ALWAYS before retrying |
| Keep context in the conversation | Write it to memory/STATE.md at the end |
| Use the most powerful model by default | Complexity rules: ladder T1-T4 |
| Deliver without evidence | Verify against environment and report the score |
