---
name: nestjs-saga-pattern
description: Saga pattern for NestJS. Covers choreography vs orchestration, saga steps, compensation logic, and multi-step process coordination. Use when implementing multi-step processes, compensation logic, or saga orchestration.
---

# NestJS Saga Pattern

Sagas orchestrate long-running, multi-step business processes across multiple services. Unlike simple event handlers, sagas coordinate multiple steps and handle compensation for failures.

## Why Sagas

See `references/why-sagas.md` for the INCORRECT (sync calls) vs CORRECT (event-driven saga with compensation) comparison.

---

## Saga Anatomy

See `references/saga-anatomy.md` for the `PaymentLinkCreatedEventSaga` and `AuthenticationSaga`.

---

## Saga vs Event Handler

| Aspect | Event Handler | Saga |
|--------|--------------|------|
| Trigger | Single event | Single or multiple events |
| Output | Side effect | One or more commands |
| Use case | Notify, sync | Orchestrate multi-step process |
| Coupling | Decoupled | Coordinates multiple handlers |
| Compensation | Not built-in | Can implement rollback logic |

---

## Saga Patterns

See `references/saga-patterns.md` for the three patterns (simple, multiple, chained).

---

## Compensation (Rollback) Patterns

See `references/compensation.md` for simple compensation and the state machine pattern.

---

## Event Schema for Sagas

See `references/event-schema.md` (`PaymentLinkCreatedEvent`, `PaymentLinkSendedEvent`).

---

## Module Registration

See `references/module-registration.md`.

---

## Anti-Patterns to Avoid

See `references/anti-patterns.md` for the four ❌ examples.

---

## Summary: Saga Responsibilities

| Pattern | Use When |
|---------|----------|
| Event -> Command | Simple reaction to event |
| Event -> Multiple Commands | Fan-out to parallel handlers |
| Chained Commands | Sequential steps |
| Compensation Saga | Rollback on failure |

**Golden rule**: Sagas orchestrate. Handlers do the work. Keep business logic out of sagas.

---

## Reference Files

- `references/saga-examples.md` - Full saga implementations including PaymentLinkCreatedEventSaga
- `references/saga-testing.md` - Testing patterns for sagas
