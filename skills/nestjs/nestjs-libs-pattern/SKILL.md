---
name: nestjs-libs-pattern
description: Shared library pattern for NestJS. Covers common_core structure, domain-specific libraries, and reusable module organization. Use when creating shared libraries, organizing common code, or building domain integrations.
---

# NestJS Libs / Shared Libraries Pattern

Shared libraries reduce duplication across services. Each lib is a self-contained NestJS module with its own structure, providing consistent functionality to multiple microservices.

## Why Shared Libraries

See `references/why-libs.md` for the ❌ BAD duplicated-code example and the ✅ GOOD single-library example.

---

## Library Structure

See `references/library-structure.md` for the folder tree of a lib.

---

## Module Definition Pattern

See `references/module-definition.md` for the public main module + internal core module.

---

## Options Pattern (Configuration)

See `references/options-pattern.md` for `OAuthOptions`, `OAuthOptionsFactory`, `OAuthAsyncOptions`, and `registerAsync`.

---

## Service Pattern

See `references/service-pattern.md` (`OAuthService` with configuration).

---

## Guard Pattern

See `references/guard-pattern.md` (`AuthGuard`).

---

## Exception Pattern

See `references/exception-pattern.md` (`OAuthException` hierarchy).

---

## Barrel Export (Public API)

See `references/barrel-export.md`.

---

## DI Token Pattern

See `references/di-token.md`.

---

## Consumer Usage

See `references/consumer-usage.md`.

---

## Anti-Patterns to Avoid

See `references/anti-patterns.md` for the four ❌ examples (circular deps, global everything, no interface, no versioning).

---

## Summary: Library Responsibilities

| Component | Responsibility |
|-----------|----------------|
| `index.ts` | Public API (barrel export) |
| `{name}.module.ts` | Public module (entry point) |
| `{name}-core.module.ts` | Internal implementation module |
| `constants/` | DI tokens and module tokens |
| `interfaces/` | Options and configuration types |
| `services/` | Business logic |
| `guards/` | Auth/authz implementations |
| `decorators/` | Parameter decorators |
| `exceptions/` | Domain-specific exceptions |

**Golden rule**: Libraries are modules. Modules have single responsibility. Don't bundle everything into one lib — split by domain (oauth, storage, notifications, stp_core).
