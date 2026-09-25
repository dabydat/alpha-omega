# Collaboration Rules

> How the team communicates, plans, and decides. Followed by every agent, every time.

## Pre-Development Phase (ENFORCED)

**Rule:** Every new project or feature starts with analysis. Writing code before use cases exist is a protocol violation.

```
TRIGGER: New project OR new feature with 3+ user-facing behaviors

SEQUENCE:
  1. /create-docs [name]       ← scaffold docs/ folder
  2. systems-analyst           ← elicitation → actors → use cases → user stories
  3. dba                       ← ERD → schema → data dictionary
  4. architect                 ← C4 → ADRs → system design
  5. product-manager           ← MoSCoW prioritization → sprint backlog

GATE: No dev agent starts until docs/02-analysis/USE_CASES.md exists.
```

---

## The Golden Protocol: PLAN → BRAINSTORM → EXECUTE

### When to trigger
- Starting any feature that touches > 1 file
- Proposing an architectural change
- Resolving a conflict between two agents' outputs
- Any task estimate > 2 hours

### Step 1: PLAN
```markdown
## Plan: [Task Name]
**Scope:** [What changes and what doesn't]
**Current State:** [Brief description]
**Desired State:** [What success looks like]
**Approach:** 1. [Step 1] 2. [Step 2]
```

### Step 2: BRAINSTORM
Tag every agent who owns affected areas:
```
@architect — if touching system design
@backend-dev — if touching server code
@frontend-dev — if touching UI
@qa — if touching test strategy
@pm — if touching scope/requirements
```

**Decision rule:**
- All agree → proceed
- One concern → address before proceeding
- Split opinions → Orchestrator makes final call (document in ADR)

### Step 3: EXECUTE
Only after consensus.

---

## Communication Standards

### Channel per topic
- **Architecture decisions** → tag @architect + @pm
- **Code questions** → tag @backend-dev or @frontend-dev
- **Blockers** → tag @project-manager immediately
- **Scope questions** → tag @pm

### Message Format for Task Handoffs
```
TO: @[agent]
FROM: @[agent]
TASK: [specific deliverable]
NEEDS BY: [date/sprint day]
WAITING ON: [dependency] OR READY NOW
```

---

## Meeting/Standup Rules

### Daily Standup (async, max 5 min)
```
DONE: [what completed since last]
DOING: [current focus]
BLOCKED: [blocker] OR NONE
```

### Sprint Planning (1 hour max)
- PM presents sprint goal
- Architect confirms technical approach (15 min)
- Agents estimate tasks (15 min)
- PM maps dependencies and assigns (15 min)
- Risks + open questions (15 min)

---

## Improvement Proposal Process

1. **STOP** — Do not implement without team alignment
2. **WRITE** a one-page proposal:
   - Current approach + limitations
   - Proposed approach + benefits
   - Cost to switch (migration effort, risk)
   - Recommendation: now / next sprint / backlog
3. **TAG** affected agents for async review (48-hour window)
4. **DECIDE** — consensus or Orchestrator arbitration
5. **RECORD** — Document in ADR if architectural

**The rule:** Better ideas make the product better. But unilateral changes create chaos.