# Why Sagas

Sagas orchestrate long-running, multi-step business processes across multiple services. Unlike simple event handlers, sagas coordinate multiple steps and handle compensation for failures.

---

## Core Principle

```
INCORRECT:  Direct synchronous calls across services
            createPaymentLink() -> sendEmail() -> trackAnalytics()
            No compensation if step fails

CORRECT:    Event-driven saga with compensation
            Event triggers saga, saga dispatches commands
            Compensation possible on failure
```

**Why it's good**:
- Events trigger saga (decoupled)
- Multiple commands from single event
- Compensation possible
- Process visibility

---

## Quality Checklist

```
[ ] Saga triggers on events, not direct calls
[ ] Dispatches commands (doesn't do the work)
[ ] Compensation on failure
```
