---
name: nestjs-cqrs-commands
description: CQRS Command patterns for NestJS. Covers command definitions, command handlers, transaction execution, parallel operations, and write operation patterns. Use when implementing create/update/delete operations, command handlers, or any write-side CQRS patterns.
---

# NestJS CQRS Commands

Commands represent **intent to change state**. They are the write side of CQRS. A command says "do something" - creating, updating, or deleting an aggregate.

**Production patterns for**: Command handlers, transaction execution, parallel operations, write-side CQRS

**Agent collaboration**: Backend Dev (parallel execution, repository pattern, max 30-line functions), Architect (CQRS pattern selection)

---

## Core Principle: Commands are Intent, Not Data

See `references/why-commands.md` for the INCORRECT (carries state like a DTO) vs CORRECT (represents business intent) comparison.

---

## Command Definition

### Anatomy of a Command

See `references/command-definition.md`.

**Full examples**: See `references/command-examples.md` (create, update, process, delete commands).

---

## Command Handler

### Handler Structure

See `references/command-handler.md`.

**Full examples**: See `references/handler-examples.md` (transaction, domain events, transactional, idempotent handlers).

---

## Parallel Execution (Backend Dev Non-Negotiable)

See `references/parallel-execution.md` for the `Promise.all` pattern and the parallel-queries example.

---

## Idempotent Commands

See `references/idempotent-command.md` for the `ProcessPaymentHandler`.

---

## Anti-Patterns

See `references/anti-patterns.md` for the three ❌ examples (business logic outside aggregate, repo in constructor, swallowing exceptions).

---

## Handler Responsibilities

| Responsibility | Location |
|---------------|----------|
| Validate preconditions | Handler (check if aggregate exists) |
| Create value objects | Handler (translate primitives to VOs) |
| Create/load aggregate | Handler (factory or repository) |
| Enforce invariants | Aggregate (domain logic) |
| Persist aggregate | Handler -> Repository |
| Emit domain events | Aggregate -> EventPublisher |
| Parallel execution | Handler (Promise.all for independent ops) |

**Golden rule**: If it could be a domain invariant, it belongs in the aggregate. Handler orchestrates, aggregate decides.

---

## Quality Checklist

```
Commands
  [ ] Implements ICommand
  [ ] Immutable fields (public readonly)
  [ ] No behavior (data carrier only)
  [ ] Named with verb (Create, Update, Delete, Process)

Handlers
  [ ] Implements ICommandHandler
  [ ] async execute() returns Promise
  [ ] Max 30 lines (split if longer)
  [ ] Uses mergeObjectContext for event publishing
  [ ] Uses commit() after domain operations
  [ ] Parallel Promise.all for independent operations
  [ ] Transaction wrapper for multi-aggregate operations

Idempotency
  [ ] Idempotency key checked before processing
  [ ] Duplicate returns success without reprocessing
```

---

## Related Skills

- `nestjs-ddd-patterns` - AggregateRoot and domain events
- `nestjs-cqrs-queries` - Query handlers for read operations
- `nestjs-repository-pattern` - Data persistence
- `nestjs-guards-filters` - Exception handling
- `nestjs-event-driven-architecture` - Async event handling

---

## Commands vs Queries

| Aspect | Command | Query |
|--------|---------|-------|
| Intent | Change state | Read state |
| Returns | Entity or void | DTO or paginated result |
| Side effects | Yes | No |
| Concurrency | Optimistic locking | Read consistency |
| Failures | Domain exceptions | Not found exceptions |

**Why separate**: Commands and queries have different consistency requirements, different optimization paths, different scaling characteristics. CQRS allows optimizing each side independently.
