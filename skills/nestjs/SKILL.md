---
name: nestjs
description: NestJS implementation guide for production-grade microservices. Covers DDD+CQRS+Hexagonal+EDA architecture with patterns for building scalable, maintainable NestJS applications. Use when building NestJS microservices, creating decorators/routes/validations, implementing DDD patterns, or setting up database queries. For specific patterns, use the specialized sub-skills listed below.
---

# NestJS Best Practices (Master Index)

This is the master skill for NestJS microservices architecture. It provides the complete picture; sub-skills provide depth.

> **Read rule (no token leak):** Search here for what you need. When you find it,
> read ONLY that sub-skill/directory — nothing more. You do NOT have to read
> everything. Read this index + the SINGLE sub-skill that fires. Never read the
> whole stack "just in case".

## Sub-Skills (Detailed Patterns)

### Architecture and Patterns (9 skills)

| Sub-Skill | Purpose | When to Use |
|-----------|---------|-------------|
| `nestjs-ddd-patterns` | Domain models, aggregates, value objects, domain events | Creating domain logic, bounded contexts |
| `nestjs-cqrs-commands` | Write operations, command handlers | Create/update/delete operations |
| `nestjs-cqrs-queries` | Read operations, query handlers | List, get, search operations |
| `nestjs-repository-pattern` | Data access, persistence | Database queries, transactions |
| `nestjs-hexagonal-ports` | Port interfaces, adapter implementations | External dependencies (cache, queue, email) |
| `nestjs-controllers` | TCP/REST controllers, DTOs | Entry points to bounded context |
| `nestjs-mappers` | Entity-DTO transformations | Converting between layers |
| `nestjs-guards-filters` | Auth, guards, exception filters | Security, error handling |
| `nestjs-saga-pattern` | Orchestration of complex flows | Multi-step processes, compensation |
| `nestjs-event-driven-architecture` | Async communication, event publishing | Cross-service communication |

### Infrastructure and Operations (9 skills)

| Sub-Skill | Purpose | When to Use |
|-----------|---------|-------------|
| `nestjs-constants` | DI tokens, controller maps, topic constants | Service communication, single source of truth |
| `nestjs-libs-pattern` | Shared library structure | Creating reusable modules |
| `nestjs-migrations` | Database schema versioning | Adding tables, columns, constraints |
| `nestjs-handlebars-templates` | Server-side HTML rendering | Email templates, password reset flows |
| `nestjs-third-party-packages` | External service integration | AWS S3, SNS, payment processors |
| `nestjs-api-versioning` | API evolution | Supporting multiple API versions |
| `nestjs-api-documentation` | OpenAPI/Swagger | API documentation, client generation |
| `nestjs-authentication-oidc` | OIDC/PKCE/JWKS | OAuth authentication flows |
| `nestjs-testing` | Test patterns and strategies | Writing unit, integration, e2e tests |

---

## Architecture Overview

### Pattern: DDD + CQRS + Hexagonal + Event-Driven

```
External Clients
       │
       ▼
BFF Gateway (REST) ──TCP──► Domain Service (TCP @MessagePattern)
       │                         │
       │                    ┌────┴────┐
       │                    │ Application Layer
       │                    │ CommandBus / QueryBus
       │                    └────┬────┘
       │                         │
┌──────┴──────┐              ┌───┴───┐
│   Ports     │◄─────────────►│ Domain│
│ (Adapters)  │              │ Aggregates, VOs, Events
└─────────────┘              └───────┘
       │                         │
       ▼                         ▼
 Infrastructure              Infrastructure
 (TypeORM, Kafka, AWS)       (Repositories, Publishers)
```

### Bounded Contexts Example

```
Microservices Architecture:
├── account           → Master accounts, sub-accounts, envelopes
├── authentication    → User auth, OAuth
├── merchant          → KYB onboarding, merchant management
├── notification      → Email, SMS, push
├── payment_processor → Payment processing
└── {domain}_core     → External system integrations

Shared Libraries (libs/):
├── common_core/          → ValueObjects, DomainException, filters
├── oauth/                → Auth guards, decorators (Roles, Scopes)
├── storage_cdn/          → AWS S3 integration
├── sms_notification/     → AWS SNS integration
└── email_notification/   → AWS SES integration
```

---

## Agent Collaboration Map

When building features, these agents provide context:

| Agent | File | What They Provide |
|-------|------|-------------------|
| Architect | `agents/01-architect.md` | ADR format, design pattern selection, parallel by default |
| Backend Dev | `agents/02-backend-dev.md` | Non-negotiables: webhook security, typed errors, max 30-line functions |
| QA Engineer | `agents/04-qa-engineer.md` | Test pyramid, coverage requirements, security tests |
| DevOps | `agents/05-devops.md` | CI/CD, docker-compose, deployment patterns |
| Systems Analyst | `agents/13-systems-analyst.md` | Use cases, business rules, process flows |
| DBA | `agents/14-dba.md` | ERD, migrations, data dictionary |
| Prompt Architect | `agents/17-prompt-architect.md` | Communication standards, skill structure |

---

## Quality Gates (from Backend Dev Agent)

Non-negotiable before any PR:
```
Functions:     max 30 lines
Files:         max 200 lines
Parameters:    max 3 (use objects beyond)
Magic numbers: named constants
DB access:     repository pattern only
Error handling: typed exceptions (DomainException hierarchy)
Parallel execution: Promise.all for independent operations
Webhook security: signature verification FIRST, then idempotency, then process
```

---

## When to Use Each Pattern

| Scenario | Pattern | Agent Guidance |
|----------|---------|----------------|
| Create/Update/Delete entity | Command + CommandHandler | Backend Dev: use repository pattern, emit domain events |
| Get single entity | Query + QueryHandler | Backend Dev: return DTO, no side effects |
| List entities with filters | Query + paginated result | DBA: index design, query optimization |
| Domain rule enforcement | Aggregate method | Architect: invariants must be enforced at aggregate boundary |
| Cross-service async communication | Events + Kafka | Architect: parallel by default |
| Multi-step orchestration | Saga | Systems Analyst: document process flow first |
| External service calls (S3, SNS) | Port + Adapter | Backend Dev: typed errors, retry with backoff |
| Database schema changes | Migration | DBA: schema-per-bounded-context, naming conventions |
| Email/password templates | Handlebars | DevOps: environment-specific templates |
| Authentication flows | OIDC/PKCE/JWKS | Architect: security at seam, validate at boundary |
| API evolution | Versioning | Architect: explicit contracts |
| API documentation | OpenAPI/Swagger | Prompt Architect: precise language, no ambiguity |
| Security tests | Webhook signature, idempotency | QA Engineer: mandatory before launch |

---

## Complete Skill Map

```
nestjs/
├── nestjs-ddd-patterns           Domain models, aggregates, VOs
├── nestjs-cqrs-commands         Command handlers
├── nestjs-cqrs-queries          Query handlers
├── nestjs-repository-pattern    Data access
├── nestjs-hexagonal-ports       External dependencies
├── nestjs-controllers           TCP/REST entry points
├── nestjs-mappers               Entity-DTO transformations
├── nestjs-guards-filters        Security, error handling
├── nestjs-saga-pattern          Orchestration
├── nestjs-event-driven-architecture Async events
├── nestjs-constants             DI tokens, routes, topics
├── nestjs-libs-pattern          Shared libraries
├── nestjs-migrations            Database versioning
├── nestjs-handlebars-templates  HTML email rendering
├── nestjs-third-party-packages  AWS, external integrations
├── nestjs-api-versioning        API evolution
├── nestjs-api-documentation     OpenAPI/Swagger
├── nestjs-authentication-oidc   OAuth/OIDC/PKCE/JWKS
└── nestjs-testing               Test patterns
```

---

## Quality Checklist

```
Architecture
- [ ] Bounded context isolated (no cross-context dependencies)
- [ ] CQRS: Commands for writes, Queries for reads
- [ ] Hexagonal: Domain has no infrastructure imports

Domain Layer
- [ ] Aggregate Roots enforce invariants
- [ ] Value Objects are immutable
- [ ] Domain Events raised on significant state changes
- [ ] Domain Exceptions for business rule violations

Application Layer
- [ ] Command handlers orchestrate, don't have business logic
- [ ] Query handlers return DTOs, not domain models
- [ ] No side effects in query handlers

Infrastructure Layer
- [ ] Repository interface in domain, implementation in infrastructure
- [ ] Mappers translate between layers
- [ ] Adapters implement port interfaces

Controllers
- [ ] Thin: only dispatch to CQRS
- [ ] Request DTOs with class-validator decorators
- [ ] Response DTOs separate from domain models

External Integrations
- [ ] Third-party services behind ports/adapters
- [ ] Events published for async communication
- [ ] Sagas orchestrate multi-step processes

API
- [ ] OpenAPI/Swagger documentation
- [ ] Versioning for breaking changes
- [ ] Handlebars templates for email/rendering

Security
- [ ] AuthGuard validates JWT
- [ ] RolesGuard checks role decorator
- [ ] Input validation at boundary
```

---

## Key Dependencies

```json
{
  "@nestjs/core": "^11.0.1",
  "@nestjs/cqrs": "^11.0.3",
  "@nestjs/typeorm": "^11.0.0",
  "@nestjs/microservices": "^11.0.12",
  "@nestjs/swagger": "^11.0.7",
  "@nestjs/throttler": "^6.4.0",
  "@nestjs/config": "^4.0.1",
  "typeorm": "^0.3.22",
  "jose": "^5.0.0",
  "handlebars": "^4.7.8",
  "class-validator": "^0.14.1",
  "class-transformer": "^0.5.1",
  "winston": "^3.17.0"
}
```