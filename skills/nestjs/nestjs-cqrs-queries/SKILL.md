---
name: nestjs-cqrs-queries
description: CQRS Query patterns for NestJS. Covers query definitions, query handlers, pagination, parallel execution, and read operation patterns. Use when implementing read operations, query handlers, list endpoints, or any read-side CQRS patterns.
---

# NestJS CQRS Queries

Queries are read operations in CQRS. They don't modify state; they return data. Unlike commands, queries are side-effect free and can be optimized separately from writes.

**Production patterns for**: Query handlers, pagination, read optimization, parallel data fetching

**Agent collaboration**: Backend Dev (no side effects, return DTOs), DBA (index design, query optimization)

---

## Core Principle: Queries Don't Change State

See `references/why-queries.md` for the commands-vs-queries rule, the ❌ BAD same-model example, and the ✅ GOOD separate read/write example.

---

## Query Definition

See `references/query-definition.md` for `GetEntityByIdQuery` and `GetEntitiesPaginatedQuery`.

---

## Query Response DTOs

See `references/response-dtos.md` for the three response types (simple, detail, paginated).

---

## Search and Count Query

See `references/search-count-query.md` for the `SearchEntitiesHandler` and `CountEntitiesHandler`.

---

## Module Registration

See `references/module-registration.md` for the `QueryHandlers` array and `EntityModule`.

---

## Anti-Patterns to Avoid

See `references/anti-patterns.md` for the three ❌ examples (domain model return, business logic in query, no pagination).

---

## Summary: Query vs Command

| Aspect | Query | Command |
|--------|-------|---------|
| Intent | read_file state | Change state |
| Returns | DTO | Entity or void |
| Side effects | None | Domain events, cache, etc. |
| Consistency | Eventually consistent fine | Transactional |
| Optimization | Read replicas, caching | Write optimization |
| Failures | NotFoundException | DomainException |

**Golden rule**: Queries are side-effect free. They read data and return DTOs. Any modification should be a command.

---

## Related Skills

- `nestjs-cqrs-commands` - Command patterns and write operations
- `nestjs-repository-pattern` - Data access and query optimization
- `nestjs-ddd-patterns` - Domain-driven design with CQRS
