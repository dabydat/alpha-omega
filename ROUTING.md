# Routing: Which Agent or Command for Each Situation

> **MANDATORY** — Read when uncertain what to do.
> Source: prompt-architect methodology + agent definitions.

---

## Decision Tree: What to Do

```
USER INPUT
    ↓
What type of request?

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  REQUEST TYPE → DETERMINE → ACTION                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. SESSION MANAGEMENT

| Situation | Action | Command |
|-----------|--------|---------|
| Start session | Read STATE.md + NOTIFICATIONS.md | `/start` |
| End session | Save all memory files | `/end` |
| Compact context | Reduce tokens, continue | `/compact` |
| Transfer session | Write TRANSFER.md | `/end` then `/start` |
| Stuck/loop | Read STATE.md, restart | `/compact` |

---

## 2. TASK ROUTING

### Code Tasks

| Situation | Agent | Command |
|-----------|-------|---------|
| New feature, full implementation | orchestrator | `/implement [spec]` |
| API endpoint | backend-dev | `/activate backend-dev` |
| UI component | frontend-dev | `/activate frontend-dev` |
| Database schema | dba | `/activate dba` |
| Database query | backend-dev | Direct task |
| CLI command | dx-engineer | `/activate dx-engineer` |

### Analysis Tasks

| Situation | Agent | Command |
|-----------|-------|---------|
| System design | architect | `/activate architect` |
| Requirements/use cases | systems-analyst | `/activate systems-analyst` |
| Process flow | systems-analyst | Direct task |
| Business logic | business-analyst | `/activate business-analyst` |
| UX wireframes | ux-designer | `/activate ux-designer` |

### Quality Tasks

| Situation | Agent | Command |
|-----------|-------|---------|
| Code review | qa-engineer | `/review [file]` |
| Test planning | qa-engineer | `/activate qa-engineer` |
| Security audit | qa-engineer | `/review [file]` |
| Performance review | architect | `/activate architect` |

### Planning Tasks

| Situation | Agent | Command |
|-----------|-------|---------|
| Sprint planning | project-manager | `/plan-sprint` |
| Feature prioritization | product-manager | `/activate product-manager` |
| Multi-perspective ideation | orchestrator | `/brainstorm` |
| Technical decision | architect | `/brainstorm` or ADR |

---

## 3. COMPLEXITY ROUTING

### Simple Task (1 file, <30 min)
```
DIRECT → Do it now, no planning needed
Example: "Fix typo in README.md"
```

### Medium Task (2-5 files, 30-60 min)
```
PLAN FIRST → Read relevant files, then execute
Example: "Add user authentication to API"
Command: /activate backend-dev
```

### Complex Task (5+ files, >1 hour)
```
PLAN → IMPLEMENT → REVIEW
Example: "Build payment system"
Command: /implement [spec]
Steps:
  1. /create-spec payment-system
  2. /implement payment-spec
  3. /review [files]
```

### Multi-Team Task (affects 2+ teams)
```
ORCHESTRATOR
Example: "Build user portal + API + DB"
Command: /implement [spec]
Launches: backend-dev + frontend-dev + dba in parallel
```

---

## 4. AGENT ACTIVATION FLOW

```
1. Determine agent needed (see tables above)
2. Activate: /activate [agent-name]
3. Provide: TASK + CONTEXT + CONSTRAINTS
4. Agent executes
5. Review output
6. Accept or iterate
```

### Activation Template
```
TO: @[agent]
TASK: [specific deliverable]
NEEDS FROM: [dependencies]
CONSTRAINTS: [budget, deadline, quality]
PARALLEL WITH: [other agents if any]
```

---

## 5. COMMAND QUICK REFERENCE

| Command | When to Use |
|---------|-------------|
| `/start` | Begin session, read STATE.md |
| `/end` | End session, save everything |
| `/compact` | Context > 60%, reduce tokens |
| `/activate [agent]` | Load specific agent role |
| `/implement [spec]` | Full feature implementation |
| `/review [file]` | Quality review of file |
| `/brainstorm` | Multi-perspective decision |
| `/create-spec [name]` | Create feature specification |
| `/create-docs [project]` | Scaffold documentation |
| `/plan-sprint` | Sprint planning |

---

## 6. ESCALATION PATH

```
Task blocked?
    ↓
Tag @orchestrator
    ↓
Within 1 hour: Orchestrator responds
    ↓
If unresolved in 2 hours → Escalate
    ↓
Final decision: @architect or @pm
```

---

## 7. DECISION MAKING

| Decision Type | Who Decides | How |
|---------------|-------------|-----|
| Architecture | architect | ADR process |
| Scope | product-manager | MoSCoW |
| Timeline | project-manager | Sprint planning |
| Code quality | qa-engineer | Review checklist |
| Multi-agent conflict | orchestrator | /brainstorm then decide |

---

## 8. ERROR ROUTING

| Error | Response |
|-------|----------|
| "I don't understand" | Provide more context, use simpler language |
| "I don't have that info" | Read relevant files, provide references |
| "That's ambiguous" | Ask for specificity |
| "I need more files" | Read specific files, don't paste everything |
| Context overflow | Refuse new tasks until compact/end |

---

## 9. PRIORITY ORDER

When multiple things apply, priority is:

```
1. MANDATORY rules (llm-algorithm.md)
2. SESSION MANAGEMENT (/end, /compact)
3. CRITICAL EVENTS (CONTEXT_95, BLOCKER)
4. ACTIVE TASK (what user asked)
5. QUALITY (code review)
6. DEBT (documentation, refactoring)
```

---

## 10. COMMON SCENARIOS

### Scenario: User says "Help me build auth"
```
1. /activate product-manager
2. Clarify: What type? (JWT, OAuth, session)
3. /create-spec auth
4. /implement auth-spec
5. /review [files]
```

### Scenario: User says "I have a bug"
```
1. /activate backend-dev
2. Read relevant code
3. Identify cause
4. Fix with test
5. /review [fix]
```

### Scenario: User says "What should we build next?"
```
1. /activate product-manager
2. /activate architect
3. /brainstorm with both
4. Create priority list
5. /plan-sprint
```

### Scenario: User says "Review my code"
```
1. /review [file]
2. If issues found: /activate qa-engineer
3. Create bug fixes
4. /review [fixes]
```

---

## Audit Checklist

- [x] All situations mapped
- [x] Agent/command per situation
- [x] Priority order defined
- [x] Escalation path clear
- [x] Error routing specified
- [x] Common scenarios documented

---

## 11. THE SYNAPSE — Deterministic routing (single source)

> **This is the section the gate points to. Read THIS and stop — sections 1-10
> are reference (session, task routing, escalation, scenarios) and are read only
> if you actually need them.**

> This file is THE ONLY routing source. The model does NOT decide where a task
> goes: it consults these tables and obeys. `synapses.md` was merged here.

### Tier ladder (complexity → tier → budget)

This is the token-economy layer of the method (alpha-omega): each sub-act runs
with the budget its complexity deserves. Trivial does not pay frontier; expert
does not use a cheap budget. **The model is the user's choice (in the platform),
not the config — the harness only sets the tier and the token budget.**

| Complexity | Tier | Token budget |
|------------|------|--------------|
| trivial    | T1   | 512 |
| simple     | T2   | 2,048 |
| moderate   | T3   | 8,192 |
| complex    | T3+  | 16,384 |
| expert     | T4   | 32,768 |

The ladder only climbs one way: trivial → T1; if it fails, it climbs one rung
(retry DIFFERENTLY, max 3, then escalate). Never repeat the same attempt.

### Synapse (intent × complexity → neuron → tier)

> The **Neuron** column is the generic skill name. Two kinds:
> - **Universal** skills live once at `skills/<name>/` (apply to any stack).
> - **Stack** skills resolve at runtime as `skills/<stack>/<stack>-<name>`, where
>   `<stack>` comes from `config.json → switch.stacks`. Never hardcode a stack name.

| Intent | Complexity | Neuron | Tier |
|--------|-----------|---------|------|
| code | trivial | perceive | T1 |
| code | simple | controllers | T2 |
| code | moderate | ddd-patterns | T3 |
| code | complex | saga-pattern | T3+ |
| code | expert | orchestrator | T4 |
| search | trivial | perceive | T1 |
| search | simple | code-quality | T2 |
| search | moderate | design-patterns | T3 |
| refactor | simple | refactoring-techniques | T2 |
| refactor | moderate | refactoring-techniques | T3 |
| refactor | complex | orchestrator | T3+ |
| tests | simple | run-tests | T2 |
| tests | moderate | run-tests | T2 |
| tests | complex | run-tests | T3 |
| docs | simple | business-analysis | T2 |
| docs | moderate | prompt-engineering | T2 |
| ops | moderate | deploy | T3 |
| ops | complex | deploy | T3+ |
| research | moderate | plan | T3 |

### Routing rules

1. **Decompose first.** A prompt carries several questions → split it into atomic
   sub-acts (multi-intent). Each sub-act is routed separately.
2. **Each sub-act gets its own tier and budget.** Never one global tier for the
   whole prompt.
3. **Verify the budget.** `Σ(budget_i) <= session_tokens` (validated by
   `scripts/budget.js`). If it exceeds, sequence or compress.
4. **Run the cheap ones first (T1 → T4).** Fail fast and cheap; escalate only what
   actually fails.
5. **Tie-break with the pheromone.** Between two viable routes, choose the one
   with the best `success_rate × efficiency` in `scripts/routes.js` (not the
   model's taste).
6. **The synapse is completed here.** If a new combination appears, add it to this
   table BEFORE using it — never invent it on the spot.