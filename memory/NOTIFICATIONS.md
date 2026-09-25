# Event Notifications Log
> ⚠️ **TEMPLATE (format) — DO NOT MODIFY.** This defines the FORMAT only. Create your state in your adapter folder (e.g. `.opencode/memory/`) and read it THERE first — never in `memory/`.


> Track all events, context status, and next actions.
> Updated by AI at every significant event.

---

## Current Session Events

### Active Context Monitor

```
Context Budget: ~70,000 tokens (70%)
Current Usage:  [████░░░░░░░░░░░░░░░░░] 35%
Status: HEALTHY — Normal operations
Next Check: Every 10 messages or 5 minutes
```

### Event Log

| Timestamp | Event | Context % | Action Taken | Next Action |
|-----------|-------|-----------|--------------|-------------|
| — | SESSION_START | — | Read STATE.md | Awaiting user input |

---

## Context Status Thresholds

```
95% ────────────────────────────────── OVERFLOW DANGER
     │  STOP all non-essential operations
     │  Run /end immediately
     │
80% ────────────────────────────────── CRITICAL
     │  MUST compact before continuing
     │  User must decide: compact or close
     │
60% ────────────────────────────────── WARNING
     │  Consider compacting
     │  Can continue but monitor closely
     │
40% ────────────────────────────────── HEALTHY
     │  Normal operations
     │
 0% ────────────────────────────────── SESSION START
```

---

## Pending Actions

| Priority | Action | Status | Owner |
|----------|--------|--------|-------|
| — | None | — | — |

---

## Agent Handoffs Pending

| From | To | Task | Status |
|------|----|------|--------|
| — | — | None | — |

---

## Recent Decisions (This Session)

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| — | — | — |

---

## Blocker Log

| Blocker | Agent | Since | Status |
|---------|-------|-------|--------|
| None | — | — | — |

---

## Session Transfer (For Next Session)

```markdown
# Transfer: Session N → N+1

## In Progress
- [What was being worked on]

## Last Action
- [What happened]

## Next Step
- [What to do next]

## Critical Context
- [Don't lose this]

## Files Changed
- [List]
```

---

**Last Updated:** YYYY-MM-DD HH:MM