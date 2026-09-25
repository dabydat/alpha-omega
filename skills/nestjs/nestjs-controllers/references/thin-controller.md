# Thin Controllers

Controllers are the entry point to your bounded context. They receive incoming requests and delegate to the application layer (CQRS). **Controllers should be thin** — they parse input, call handlers, and return output. All business logic lives in handlers, aggregates, or domain services.

---

## Core Principle: Thin Controllers

```
BAD:  Thick controller with business logic
      Controller -> Repository (direct) -> Business logic scattered

GOOD: Thin controller delegating to CQRS
      Controller -> CommandBus/QueryBus -> Handler -> Aggregate -> Repository
```

**Why this matters**: Controllers are infrastructure. If business logic lives in controllers, you cannot unit test it, reuse it, or enforce invariants. CQRS forces separation.

**Quality gate (Backend Dev)**: Functions max 30 lines. If controller method exceeds 30 lines, it is doing too much — split or delegate.

---

## Quality Checklist

```
[ ] Controller only parses input + transforms output
[ ] No business logic in controllers
[ ] No direct repository access from controllers
[ ] Delegates to CommandBus/QueryBus
```
