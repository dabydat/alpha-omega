# alpha-omega — Agent Harness

## What is this? (in plain words)

Think of it as a **standard operating procedure (SOP) for an AI coding tool.**

Run `install.sh` in a project — it **references** the harness (it doesn't copy it).
When you open the project with an AI coding tool (opencode, Claude Code, Cursor,
Copilot, Gemini), the AI reads the gate and **stops improvising**. Instead of just
doing whatever you type, it follows a disciplined process: read the config →
understand your request → decompose it → plan it → ask you to approve → execute in
the right order → verify only if you asked.

**The result:** more consistent, higher-quality code, and fewer wasted tokens
(it picks the right model/tier per task, and never reads more than it needs).

**Who it's for:** developers who use AI coding tools (opencode, Claude Code, Cursor,
Copilot, Gemini) and want consistent, quality code without burning tokens.

**What it does:** turns a coding AI into a disciplined, token-efficient team that
follows a clear loop. **What it does NOT do:** it is not a model, not a framework
you code against, not a CI/CD system, and not a replacement for your project.

> Each project holds a **thin gate** (`AGENTS.md` / `.claude/CLAUDE.md` /
> `.cursor/rules/nsp-rev.mdc` / …) that reads `.alpha-omega/config.json`, then goes
> to the **harness source** (where `install.sh` ran) and follows the loop. The
> harness is **referenced, not copied**.

### TL;DR — quick setup (full steps below)

```bash
# 1. edit config.json in the harness folder   (set ai_org, stacks, actions, budget)
# 2. run install.sh into your project
./install.sh /path/to/my-project
# 3. open the project with your AI tool → it reads the gate → follows the harness
```

---

## The 3 things that make it work

1. **`config.json`** — the control panel. The AI reads this first.
2. **The instructions** (`.claude/CLAUDE.md`, `protocol.md`, `GUIDE.md`, `rules/`, `skills/`) — the process it follows.
3. **The gates** — one thin entry per AI tool that points to the generic content (no duplication, no auto-registration).

### `config.json` — the control panel (explained, dummy-level)

| Key | What it does | Example |
|-----|-------------|---------|
| `ai_org` | **which ONE AI tool to read.** Only that folder is read. | `"opencode"` |
| `language_policy` | `follow_user` = answer in the user's language. `force_config` = always use `language`. | `"follow_user"` |
| `switch.stacks` | **the active stacks** (array). Each stack's knowledge lives at `skills/<stack>/`. | `["nestjs", "react"]` |
| `switch.components` | which content folders are on (`core`, `rules`, `skills`, `evals`). | `["core","rules","skills","evals"]` |
| `switch.meta_prompting` | `true` = AI asks context once + shows a plan to approve. `false` = acts directly. | `true` |
| `switch.feature_registry` | `true` = AI tracks every task in `features.json` (status + metrics). | `true` |
| `mcp` | **MCP servers to use.** `servers` = list; `message` = what the AI must do when one is **not** connected (tell you how to connect it, then wait). | `{"servers":["pulsar"],"message":"..."}` |
| `blocked_files` | **file patterns the AI must NEVER read** (secrets, .env, keys). | `[".env","*.pem","*.key"]` |
| `scripts` | **which scripts the AI may run** (on/off). Sole gate — independent of `actions`. | `{"lint":true,"test":true}` |
| `budget` | token limits per session. | `{"session_tokens":24000}` |
| `actions` | **what the AI may do**, by power (git, files, execution, network, deploy). `true`/`false`. | `{"power_git":{"commit":false}}` |

**The two most important for control:** `blocked_files` (secrets it must never read)
and `actions` (what it's allowed to do). Both are checked on EVERY prompt.

**Multiple stacks & skills (your point 5) — it's simple:**
A skill's stack is just **the folder it lives in** (`skills/<stack>/`). To use a
frontend + a backend stack, list both:

```json
"switch": { "stacks": ["nestjs", "react"] }
```
- `skills/nestjs/` → the backend stack (its skills).
- `skills/react/` → the frontend stack (its skills).

Each skill belongs to a stack by being inside that stack's folder. That's it.

---

## What happens on the first prompt

### Do you need to do something before? **Just install + configure.** Everything else the AI does itself.

```mermaid
flowchart TD
    subgraph ACTIVATION["① ACTIVATION — the 2 human steps"]
        direction TB
        A1[1 · Install the harness into the project<br/>./install.sh /path/to/project] --> A2[2 · Edit config.json<br/>set the knobs: ai_org · switch.* · mcp · blocked_files · scripts · actions]
    end
    subgraph PROMPT["② THE FIRST PROMPT — the AI runs this. Each step is governed by a config key (shown in [brackets])"]
        direction TB
        P0[User writes a prompt] --> P1["Read config.json FIRST<br/>[ai_org] which folder to read"]
        P1 --> P1b["Check blocked_files<br/>[blocked_files] NEVER read those files"]
        P1b --> P1c["Check mcp<br/>[mcp] which servers to use"]
        P1c --> P2["Read the gate entry (CLAUDE.md / AGENTS.md)<br/>[switch.components] then your adapter state"]
        P2 --> P2b{adapter state exists?}
        P2b -->|no| P2c[AI CREATES its adapter state<br/>from memory/ templates — by itself]
        P2b -->|yes| P3{"[switch.meta_prompting]?"}
        P2c --> P3
        P3 -->|yes| P4[Normalize to META-PROMPT<br/>ask context once if empty]
        P3 -->|no| P5[Operate directly]
        P4 --> P6[Decompose into sub-acts<br/>multi-intent: 1 prompt = several questions]
        P5 --> P6
        P6 --> P7[Route each sub-act<br/>ROUTING.md §11 synapse<br/>complexity+intent → neuron → tier T1-T4]
        P7 --> P8["Check budget<br/>[budget] Σ budget_i ≤ session_tokens"]
        P8 --> P9["Load active stack knowledge<br/>[switch.stacks] skills/stack/ just-in-time"]
        P9 --> P10[Plan + APPROVAL GATE]
        P10 -->|A Approve| P11["Execute T1→T4, cheap first<br/>[actions] only what's allowed"]
        P10 -->|C Change| P9
        P10 -->|X Cancel| P14[Cancel]
        P11 --> P12["Verify ONLY if you asked<br/>[scripts] or a script is enabled"]
        P12 --> P13[Reinforce<br/>write routes.jsonl]
        P13 --> P14[Consolidate<br/>your adapter state]
        P14 --> P14b{"[switch.feature_registry] on?"}
        P14b -->|yes| P14c["Update features.json<br/>[switch.feature_registry] status + metrics"]
        P14b -->|no| P15[Deliver result + evidence]
        P14c --> P15
    end
    A2 --> P0
```

**Which config key governs each step?**

| Config key | Governs | Where in the flow |
|-----------|---------|-------------------|
| `ai_org` | which gate is read (opencode→`AGENTS.md`, claude→`.claude/CLAUDE.md`, etc.) | P1 — reading config |
| `switch.stacks` | which stacks are active → `skills/<stack>/` | P9 — loading knowledge |
| `switch.components` | which content folders are on (`core`/`rules`/`skills`/`evals`) | P2 — what's available to read |
| `switch.meta_prompting` | ask context once + show a plan to approve, or act directly | P3/P4 — the meta-prompt gate |
| `switch.feature_registry` | track every task in `features.json` | P14b/P14c — consolidate |
| `mcp` | which MCP servers to use | P1c — before reading files |
| `blocked_files` | files the AI must NEVER read | P1b — before reading files |
| `scripts` | which scripts the AI may run (lint/test/build…) | P12 — verify step |
| `budget` | token limits per session | P8 — budget check |
| `actions` | what the AI may do, by power (git/files/execution/network/deploy) | P11 — execute (and everywhere it acts) |

**Key points:**
- **You only do 2 things before** (install + edit config). No manual state setup.
- **The AI self-initializes**: if its adapter state is missing, the AI creates it
  (from the `memory/` templates — the format) so it can keep control over time.
- **Verification is on-demand** (your point 6): lint/tests run only when **you ask**
  or when the script is **enabled** in `config.json → scripts`.
- **Once configured, it's on from the first read of `config.json`** — no mid-session activation.

---

## The map (where everything is)

| Need | File |
|------|------|
| The law (loop, tiers, contracts) | `protocol.md` |
| The agent manual (how to operate, what NOT to do) | `GUIDE.md` |
| Master entry (the model reads this first) | `.claude/CLAUDE.md` |
| The control panel (ai_org, stacks, scripts, actions) | `config.json` |
| Routing (single source: situation → agent + complexity → tier) | `ROUTING.md` |
| Action control by powers | `actions.md` |
| State — **the live one, written by the AI** | your adapter folder (e.g. `.claude/memory/STATE.md`) |
| State — **the template, never written** | `<harness>/memory/STATE.md` |
| Generic agent roster (all adapters) | `agents/` |
| Generic rules (never omit) | `rules/` |
| Generic commands (what you can run) | `commands/` |
| Universal skills | `skills/<name>/` |
| **Active stack knowledge** (`skills/<stack>/` per stack) | `skills/nestjs/` |
| The pattern linter (deterministic quality gate) | `scripts/lint-patterns.js` |
| Honest pheromone + budget allocation | `scripts/routes.js` · `scripts/budget.js` |
| The gates — **one thin entry per tool** (points to generic, no auto-registration) | `AGENTS.md` (opencode) · `.claude/CLAUDE.md` (claude) · `.cursor/rules/nsp-rev.mdc` · `.github/copilot-instructions.md` · `.gemini/GEMINI.md` |

> **Gates are thin, not copies.** The generic content (agents, rules, commands,
> skills, neurons, config) lives at the root and is loaded **just-in-time**. Each
> gate is ONE file that reads `config.json` and points to the generic content.
> Nothing is auto-registered, so there is no token leakage.

---

## Feature tracking (when features.json / features.schema.json activate)

These two files are **one feature tracker** (NOT "for Anthropic" or "for GPT" — they
work together as data + schema):

- **`features.json`** — the state of your features (id, status, tier, tokens, score, time).
- **`features.schema.json`** — the contract that validates `features.json` (JSON Schema).
- `scripts/features.js` validates the data against the schema.

**When do they activate?** Only when `config.json → switch.feature_registry` is `true`
(default). When on, **every task** the AI does registers/updates a feature entry and
moves it through its lifecycle:

```
proposed → planned → in_progress → blocked → done | rejected
```

It records real metrics per feature (time_actual_ms, tokens_actual, score, retries).
**If you don't want feature tracking**, set `switch.feature_registry: false` (and you can
delete `features.json` + `features.schema.json`).

---

## Setup (do this once per project)

> **BEFORE you install, edit the harness's `config.json`** (the one in the
> alpha-omega folder, where `install.sh` lives). `install.sh` copies that config
> into the new project — so set it once and every project starts already configured.

### Step 0 — Set the harness config (in the alpha-omega folder)

Edit `config.json`:

```json
{
  "ai_org": "opencode",                    // your AI tool: opencode | claude | cursor | copilot | gemini
  "switch": { "stacks": ["nestjs"] },       // your stack(s) → knowledge at skills/<stack>/
  "actions": { "power_files": { "write": true } },  // what the AI may do
  "budget": { "session_tokens": 24000 }     // token limit per session
}
```

### Step 1 — Install into a project (references the harness, doesn't copy it)

```bash
cd /path/to/alpha-omega      # the folder where install.sh is
./install.sh /path/to/my-project
```

It creates in `my-project`:
- `.alpha-omega/config.json` — this project's config (copy of step 0).
- `AGENTS.md` — a thin gate: reads `.alpha-omega/config.json`, then
  *"goes to the harness"* at the source (where `install.sh` ran).
- `.opencode/` (or your `ai_org`) with `memory/` — the project's traceability.
- It also **appends** these created paths to the project's `.gitignore`
  (so they are **not** committed to GitHub).

### Step 2 — Open the project with your AI tool

Open `my-project` with opencode / Claude Code / Cursor / etc. It **auto-reads the
gate** (`AGENTS.md` / `CLAUDE.md` / `.cursor/rules/nsp-rev.mdc`) — you don't invoke
the harness manually. The gate points to `.alpha-omega/config.json` and the source
harness, and the AI follows the loop.

### Step 3 — Write your first task

> *"Add a GET /users/:id endpoint. EDD: spec, implement, evaluate."*

The harness decomposes → routes → plans (asks you to approve `[A/C/X]`) → executes →
verifies → consolidates.

### Step 4 — Verify it worked

```bash
cd /path/to/alpha-omega                # the harness — scripts live here, not in the project
node scripts/lint-patterns.js          # quality gate (0 violations = OK)
```

Check the traceability in `.claude/memory/STATE.md` (or your `ai_org`). That file
arrives holding only its title and a pointer back to the harness — the AI fills in
the rest. The format it follows lives in `<harness>/memory/STATE.md`, which stays
untouched.

---

## How the flow works (the mental model)

```
1. Read .alpha-omega/config.json       ← this project's control panel
2. Go to the harness (source)          ← the pwd where install.sh ran
3. Execute the rules it declares       ← loop, routing, agents, skills
4. Deliver in the project
5. Leave traceability in <ai_org>/memory/
```

> The harness is **referenced, not copied** — it lives in one place (where
> `install.sh` runs). Each project only holds a thin pointer. If the gate already
> exists, the installer **prepends** alpha-omega (so it takes precedence over any
> other flow/harness).

---

## Quality gate (on demand)

`scripts/lint-patterns.js` checks real code against `rules/coding.md`:
`file-too-long` · `console-log` · `long-function` · `too-many-params` ·
`controller-repo` · `query-returns-entity` · `vo-not-frozen`.

It's deterministic (~0 tokens) and exits `1` on violations. Run it **only when you
ask**: `node scripts/lint-patterns.js` or `/lint`. It only runs if
`config.json → scripts.lint` is `true`.

---

## Actions (powers)

`config.json → actions` controls what the AI may do. `true` = allowed, `false` = forbidden.

```
power_git:         create_branch ✓  switch_branch ✓  commit ✗  push ✗
power_files:       read ✓  write ✓  edit ✓  delete ✗
power_execution:   read_only_search ✓  tests ✓  build ✓  install ✓
                   mutating_fs ✗  network_egress ✗  db_write ✗  vcs_write ✗
power_network:     fetch ✗  web_search ✗
power_deploy:      staging ✗  production ✗  rollback ✗
```

**Golden rule:** the CONFIG rules. If an action is `false`, the AI does not do it.

### Powers are grouped by EFFECT, not by tool

`bash: true|false` used to be one switch for two very different things: *looking at
your code* and *destroying it*. Turning it off to prevent `rm -rf` also blocked
`grep`, which made the harness unusable and — predictably — got ignored. So it split:

| Power | Covers | Default |
|---|---|---|
| `read_only_search` | `grep` `glob` `find` `ls` `cat` `head` `wc` `jq` | ✓ allowed |
| `run_tests` / `build` / `install_dependencies` | project tooling | ✓ allowed |
| `mutating_fs` | `rm` `mv` `dd` `truncate` `chmod -R` | ✗ |
| `network_egress` | `curl` `wget` `nc` `scp` `ssh` | ✗ |
| `db_write` | `DROP` `TRUNCATE` `DELETE FROM` | ✗ |
| `vcs_write` | `commit` `push` `reset --hard` `clean` | ✗ |

Plus a `denylist` that is refused **regardless of any power above**, even if you ask.

> **`read_only_search` never overrides `blocked_files`.** A search is harmless
> until you point it at a secret: `grep KEY .env` exfiltrates exactly as much as
> `cat .env`. Search freely — never at a blocked path.

### Scripts are not shell access

`node scripts/<name>.js` is gated by `scripts.<name>` **and nothing else**. These are
deterministic (~0 tokens, fixed output), so they are never subject to
`power_execution` — a locked-down execution power does not disable them.

**Invariant:** `switch.metrics: true` ⇒ `scripts.metrics: true` (same for
`feature_registry`/`features`). Breaking it is a config error the AI must report,
not silently skip.

---

## Copy to a new project

```bash
./install.sh /path/to/new-project/
```

It reads `ai_org` from `.alpha-omega/config.json` and creates only the **pointer**
(`.alpha-omega/config.json` + the gate + `<ai_org>/memory/`). It does **not** copy
the harness — it references it from where `install.sh` runs. Edit
`.alpha-omega/config.json` in the new project to set its own stack/actions/budget.
