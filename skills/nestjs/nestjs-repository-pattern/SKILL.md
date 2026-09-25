---
name: nestjs-repository-pattern
description: Repository pattern implementation for NestJS. Covers repository interfaces (ports) in domain layer, TypeORM implementations in infrastructure, and DI configuration. Use when implementing data access, repository pattern, or database queries.
---

# NestJS Repository Pattern

Repository is the collection-like interface for accessing aggregates. It abstracts data persistence, keeping domain independent of database implementation.

**Production patterns for**: Data access, repository interfaces, TypeORM implementations, DI configuration

**Agent collaboration**: Backend Dev (repository pattern, no raw queries), DBA (index design, query optimization)

---

## Core Principle: Repository is a Collection

See `references/why-repository.md` for the collection metaphor, the ❌ BAD SQL-in-domain example, and the ✅ GOOD interface example.

---

## Repository Interface (Domain Layer)

See `references/repository-interface.md` for the `ENTITY_REPOSITORY` symbol, the interface, and common methods.

---

## TypeORM Implementation (Infrastructure)

See `references/typeorm-implementation.md` for the `EntityRepositoryImpl`.

---

## Paginated Queries

See `references/paginated-queries.md` for `findPaginated` (`findAndCount`).

---

## Transaction Support

See `references/transaction.md` for transaction via manager and usage in a command handler.

---

## Complex Queries (Query Builder)

See `references/query-builder.md` for `findByCriteria`.

---

## Module Registration

See `references/module-registration.md` for binding interface→implementation.

---

## Anti-Patterns to Avoid

See `references/anti-patterns.md` for the four ❌ examples (persistence return, business logic, no pagination, raw query in service).

---

## Summary: Repository Responsibilities

| Operation | Purpose | Returns |
|-----------|---------|---------|
| `save` | Create or update entity | Domain |
| `findById` | Get by ID | Domain or null |
| `findByEmail` | Get by email | Domain or null |
| `findByUserId` | Get by user ID | Domain or null |
| `findPaginated` | List with pagination | Paginated result |
| `delete` | Remove entity | void |

**Golden rule**: Repository is the gate to persistence. Domain never talks directly to database. Only through repository.
