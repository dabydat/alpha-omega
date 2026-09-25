---
name: nestjs-constants
description: Constants pattern for NestJS. Covers DI tokens, controller maps, topic constants, and single source of truth for service communication. Use when organizing constants, creating DI tokens, or defining message patterns.
---

# NestJS Constants Strategy

Constants are the connective tissue of a microservices architecture. They provide single sources of truth for routes, message patterns, injection tokens, and topic names. Without consistent constants, services become tightly coupled and difficult to maintain.

## Why Constants Matter

See `references/why-constants.md` for the ❌ BAD hardcoded-strings example and the ✅ GOOD constants example.

---

## Types of Constants

### 1. Module Tokens (Dependency Injection) + Module Module Tokens

See `references/di-tokens.md` for `Symbol`-based tokens, module wiring, injection, and module tokens.

### 2. Controller Maps (Route + Message Pattern)

See `references/controller-map.md` for name, tag, routes, message patterns, the combined map, and the `ControllerAction<T>` type.

### 3. Client Constants (BFF Service References)

See `references/client-constants.md`.

### 4. Topic Constants + Kafka Group Constants

See `references/topic-constants.md`.

---

## File Structure & Naming Conventions

See `references/file-structure.md` for the `domain/constants/` vs `infrastructure/constants/` split and the naming convention table.

---

## Usage in Controllers

See `references/usage.md` for TCP (`@MessagePattern`) and REST BFF (`route + client.send`) usage.

---

## Anti-Patterns to Avoid

See `references/anti-patterns.md` for the five ❌ examples (string literals, no barrel export, no layer separation, mutable constants, inconsistent naming).

---

## Summary

| Constant Type | Purpose | Layer |
|---------------|---------|-------|
| Module Token | DI injection symbol | Library |
| Module Module Token | Module reference | Library |
| Controller Map | Route + Message Pattern mapping | Domain |
| Client Constant | Microservice client injection | Infrastructure |
| Topic Constant | Event topic names | Infrastructure |
| Kafka Groups | Consumer group IDs | Infrastructure |

**Golden rule**: Every string that has meaning across services should be a constant. Hardcoded strings are technical debt.
