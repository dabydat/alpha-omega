---
name: nestjs-migrations
description: Database migration patterns for NestJS. Covers TypeORM migrations, schema-per-bounded-context, soft-delete patterns, and index design. Use when creating database migrations, modifying schema, or managing database versioning.
---

# NestJS Migrations

Database migrations provide versioned, reversible schema changes. TypeORM migrations ensure database schema evolves consistently across environments.

## Why Migrations

See `references/why-migrations.md` for the INCORRECT vs CORRECT comparison and the timestamped filename convention.

---

## Migration Anatomy

See `references/migration-anatomy.md` for a full migration (`up`/`down`).

**Full examples**: See `references/migration-examples.md`.

---

## Creating Tables

See `references/create-tables.md` (basic table, foreign keys, indexes).

---

## Altering Tables

See `references/alter-tables.md` for all five operations (add column, remove column, add multiple, rename, change type).

---

## Data Migrations

See `references/data-migrations.md` (insert default data, transform existing data).

---

## Rolling Back Migrations

See `references/rollback.md` (reversible `down()`).

---

## Multi-Step Migrations

See `references/multi-step-migrations.md` (add nullable → migrate → add constraint).

---

## Migration Best Practices

See `references/best-practices.md` (transaction, no manual prod edits, `ifNotExists`).

---

## Running Migrations

See `references/running-migrations.md`.

---

## Migration Structure Per Bounded Context

See `references/structure-per-context.md`.

---

## Anti-Patterns to Avoid

See `references/anti-patterns.md` for the three ❌ examples (no rollback, destructive without backup, long-running).

---

## Summary: Migration Responsibilities

| Method | Purpose |
|--------|---------|
| `up()` | Apply migration (create table, add column, insert data) |
| `down()` | Rollback migration (drop table, remove column, delete data) |

**Golden rule**: Every schema change goes through migration. No manual database edits in any environment.
