---
name: nestjs-ddd-patterns
description: Domain-Driven Design patterns for NestJS microservices. Covers aggregates, value objects, entities, domain events, and bounded contexts. Use when creating domain models, implementing DDD patterns, designing bounded contexts, or working with DDD aggregates.
---

# NestJS DDD Patterns

Domain-Driven Design models business reality accurately in code. The code should reflect the business language that domain experts use.

**Production patterns for**: Aggregates, value objects, entities, domain events, bounded contexts

**Quality gate (Backend Dev)**: Functions max 30 lines, files max 200 lines.

---

## Core Principle: Domain First

See `references/why-ddd.md` for the INCORRECT (data-first) vs CORRECT (domain-first) comparison.

---

## Aggregate Root

See `references/aggregate-root.md` for the aggregate structure (factory, `toPrimitives`, state transitions, events) and the CORRECT vs INCORRECT comparison.

---

## Value Objects

See `references/value-object.md` for the base class, and the `Amount`, `Clabe`, `Rfc`/`Curp` examples.

---

## Domain Events

See `references/domain-events.md` for the event structure, publishing, and naming (CORRECT vs INCORRECT).

---

## Domain Exceptions

See `references/domain-exceptions.md` for the `DomainException` hierarchy and the global exception filter.

---

## Bounded Contexts

See `references/bounded-contexts.md` for the microservices architecture example.

---

## Anti-Patterns

See `references/anti-patterns.md` for the three ❌ examples (anemic domain model, primitive obsession, god aggregate).

**Rule of thumb**: If you can't fit all invariants in your head, the aggregate is too big.

---

## Quality Checklist

```
Aggregate Root
  [ ] Factory method (static create)
  [ ] toPrimitives() for serialization
  [ ] Private fields (no direct access)
  [ ] State transitions through methods only
  [ ] Domain events raised on significant changes
  [ ] Method length: max 30 lines

Value Objects
  [ ] Immutable props (Object.freeze)
  [ ] Factory method with validation
  [ ] Structural equality (equals method)

Domain Events
  [ ] Named with domain language (not technical)
  [ ] Contains relevant context (not just ID)
  [ ] Events published via mergeObjectContext

Domain Exceptions
  [ ] Hierarchy: DomainException base
  [ ] Machine-readable code + human-readable message
  [ ] Global filter normalizes all exceptions
```

---

## Related Skills

- `nestjs-cqrs-commands` - Command handlers that use aggregates
- `nestjs-cqrs-queries` - Query handlers that read aggregates
- `nestjs-repository-pattern` - Persisting aggregates
- `nestjs-guards-filters` - Exception filters for error handling
- `nestjs-event-driven-architecture` - Kafka event publishing
- `nestjs-mappers` - Converting between domain and DTOs
