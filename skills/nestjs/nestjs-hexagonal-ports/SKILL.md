---
name: nestjs-hexagonal-ports
description: Hexagonal (ports and adapters) architecture patterns for NestJS. Covers port interfaces, adapter implementations, and dependency injection. Use when implementing hexagonal architecture, port interfaces, or adapter patterns.
---

# NestJS Hexagonal Ports

Hexagonal architecture (also called Ports and Adapters) isolates domain logic from external dependencies. Ports are interfaces; adapters are implementations.

**Production patterns for**: Port interfaces, adapter implementations, dependency injection, domain isolation from infrastructure

**Agent collaboration**: Architect (hexagonal pattern selection), Backend Dev (dependency inversion, domain isolation)

---

## Core Principle: Domain Independence

See `references/why-hexagonal.md` for the `External Systems → Adapters → Ports → Domain` diagram, the ❌ BAD example, and the ✅ GOOD example.

---

## Ports (Interfaces)

See `references/ports.md` for the five ports (Logger, Cache, Publisher, Configuration, Email) with their "why" and `Symbol` tokens.

---

## Adapters (Implementations)

See `references/adapters.md` for the Console, Redis, and Kafka adapters.

---

## Module Registration

See `references/module-registration.md` for binding port→adapter and exporting ports.

---

## Usage in Command Handler

See `references/usage-in-handler.md` for injecting ports via constructor.

---

## Port/Adapter Naming Convention

| Port | Adapter | Purpose |
|------|---------|---------|
| `LOGGER_PORT` | `LoggerAdapter` | Logging |
| `CACHE_PROVIDER_PORT` | `CacheProviderAdapter` | Redis/Memcached |
| `PUBLISHER_PORT` | `KafkaPublisherAdapter` | Event publishing |
| `CONFIGURATION_PORT` | `ConfigurationAdapter` | Config management |
| `EMAIL_PORT` | `SMTPEmailAdapter` | Email sending |

**Pattern**: Port name = Capability + `PORT`. Adapter name = Capability + `Adapter`.

---

## Anti-Patterns to Avoid

See `references/anti-patterns.md` for the four ❌ examples (port implementation details, adapter business logic, concrete deps, god adapter).

---

## Summary: Hexagonal Architecture Benefits

| Benefit | How |
|---------|-----|
| Testability | Mock adapters, test domain without infrastructure |
| Flexibility | Swap adapters (Postgres→MySQL) without changing domain |
| Clarity | Domain defines needs, infrastructure provides |
| Isolation | External changes don't ripple into domain |

**Golden rule**: Domain declares what it needs (ports). Infrastructure provides implementations (adapters). Domain never imports infrastructure.
