# NestJS Best Practices - Prompt System

Reference for invoking NestJS agents and skills.

---

## 1. META-PROMPT TEMPLATE

```
REQUEST: [what to build]
MODULE: [name]
BOUNDED CONTEXT: [context]
REQUIREMENTS: [list]
AGENT(S) TO ACTIVATE: [Architect / Backend Dev / QA / DBA]
EXPECTED OUTPUTS: [deliverables]
```

**Example: Create Payment Module**
```
REQUEST: Payment module with card storage and charge capability
MODULE: payment_processor
BOUNDED CONTEXT: payment_processor
REQUIREMENTS:
- Store card tokens (not raw PANs)
- Idempotent charge operations
- Emit PaymentChargedEvent on success
AGENT(S) TO ACTIVATE: Architect, Backend Dev, DBA
EXPECTED OUTPUTS: C4 diagram, OpenAPI contract, Command/Handler, Migration
```

---

## 2. SKILL TRIGGER PROMPTS

| Skill | When to Use | Context Needed | Output |
|-------|-------------|---------------|--------|
| `nestjs-ddd-patterns` | Domain models, aggregates | Business invariants, ubiquitous language | AggregateRoot, VOs, DomainEvents |
| `nestjs-cqrs-commands` | Create/update/delete | Command name, parameters, preconditions | Command + Handler, Promise.all |
| `nestjs-cqrs-queries` | Read operations | Query params, pagination, filters | Query + Handler returning DTO |
| `nestjs-repository-pattern` | Database access | Entity, query conditions | Repository interface + TypeORM impl |
| `nestjs-hexagonal-ports` | External deps (cache, AWS) | Service name, operations | Port interface + Adapter |
| `nestjs-controllers` | API entry points | Transport (TCP/REST), auth type | Thin controller + DTOs |
| `nestjs-mappers` | Layer conversions | Source/target types | toPrimitives/toDomain/toDto |
| `nestjs-guards-filters` | Security, error handling | Auth type, roles, exceptions | AuthGuard, RolesGuard, Filter |
| `nestjs-saga-pattern` | Multi-step with rollback | Steps, compensation logic | SagaOrchestrator |
| `nestjs-event-driven-architecture` | Async between services | Event name, payload, consumer | DomainEvent + Kafka consumer |
| `nestjs-constants` | Service communication | Service name, message patterns | ClientConstant, ControllerMap |
| `nestjs-libs-pattern` | Shared modules | Purpose, dependencies | libs/[name]/ structure |
| `nestjs-migrations` | Schema changes | Table, columns, indexes | Migration file |
| `nestjs-handlebars-templates` | Email, server rendering | Template name, variables | Template .hbs + renderer |
| `nestjs-third-party-packages` | AWS, Stripe, APIs | Service, operations | Adapter with typed errors |
| `nestjs-api-versioning` | Multiple API versions | Breaking vs non-breaking | Versioned routes + headers |
| `nestjs-api-documentation` | OpenAPI/Swagger | Endpoints, DTOs, auth | Swagger decorators |
| `nestjs-authentication-oidc` | OAuth2/OIDC | Flow type, scopes, JWKS | OIDC guard + JWKS validation |

### Quality Checklists Per Skill

**nestjs-ddd-patterns**:
```
[ ] Aggregate has static create() factory
[ ] State transitions through methods only
[ ] Domain events raised on state changes
[ ] VO immutable (Object.freeze)
[ ] Method max 30 lines
```

**nestjs-cqrs-commands**:
```
[ ] Command implements ICommand
[ ] Fields public readonly
[ ] Handler max 30 lines
[ ] mergeObjectContext + commit()
[ ] Promise.all for independent ops
[ ] Idempotency key checked
```

**nestjs-cqrs-queries**:
```
[ ] Query implements IQuery
[ ] Returns DTO (not domain model)
[ ] No side effects
[ ] Pagination on lists
[ ] Relations via repository
```

**nestjs-repository-pattern**:
```
[ ] Interface in domain (no ORM imports)
[ ] TypeORM impl in infrastructure
[ ] findById throws EntityNotFoundException
[ ] Pagination: { data[], total }
```

**nestjs-hexagonal-ports**:
```
[ ] Port interface in domain
[ ] Adapter implements port
[ ] Typed exceptions
[ ] Retry with exponential backoff
[ ] No magic numbers
```

**nestjs-controllers**:
```
[ ] Thin (max 30 lines per method)
[ ] Request DTO with class-validator
[ ] Response DTO separate from domain
[ ] @UseGuards for auth
[ ] Exception filter applied
```

**nestjs-guards-filters**:
```
[ ] WebhookSignatureGuard checks signature FIRST
[ ] Idempotency check AFTER signature
[ ] AuthGuard attaches user to request
[ ] Filter handles all 7 exception cases
[ ] DomainException -> 409
```

---

## 3. AGENT ACTIVATION GUIDE

### Agent Selection

| Task | Agent | Activation Template |
|------|-------|---------------------|
| System design, API contracts, DB schema | Architect | "Act as Architect. Module: [name]. Bounded context: [context]. Requirements: [list]. Produce: [C4/ADR/API]" |
| CQRS, repository, typed errors | Backend Dev | "Act as Backend Dev. Module: [name]. Feature: [what]. Use [pattern]. Follow [skill]. Produce: [files]" |
| Tests, coverage, security | QA Engineer | "Act as QA Engineer. Module: [name]. Feature: [feature]. Architecture: [TCP/REST]. Required: [tests]. Launch: [criteria]" |
| ERD, migrations, indexes | DBA | "Act as DBA. Module: [name]. Domain: [domain]. Entities: [list]. Produce: [ERD/migration]" |

### Agent Inputs/Outputs

| Agent | Reads | Produces |
|-------|-------|----------|
| Architect | decision-tree.mermaid, context-map.mermaid, config.json → switch.stacks | C4 diagrams, API contracts, ERD, ADRs |
| Backend Dev | code-graph.mermaid, domain files, nestjs-ddd-patterns/SKILL.md | Command/Query handlers, repository, DTOs |
| QA Engineer | testing.md, code-tests.mermaid, feature requirements | Unit tests, integration tests, security tests |

---

## 4. COMMUNICATION STANDARDS

### Request Phrasing

**CORRECT**:
- "Create entity command for Account with id, name, email fields"
- "Add pagination to list query with page/limit/search params"
- "Implement webhook signature verification guard"

**INCORRECT**:
- "Can you maybe create some kind of command?" (vague)
- "We need to do something with entities" (no context)
- "It would be great if we could add a feature" (passive)

### Requirement Description

**CORRECT**:
- "Command must check idempotency key before processing"
- "Query handler must return EntityListDto not Entity"
- "Guard must verify HMAC before any processing"

**INCORRECT**:
- "Make sure it handles edge cases" (which cases?)
- "Don't forget about security" (which security?)
- "Should work with the existing stuff" (which stuff?)

### Code References

**CORRECT**:
- "Follow pattern in `src/domain/entities/Account.ts:45`"
- "Use repository from `interfaces/AccountRepository.ts`"
- "Match error handling in `guards/DomainExceptionFilter.ts`"

**INCORRECT**:
- "Like we discussed before" (no reference)
- "The same approach as other modules" (which modules?)
- "Standard entity pattern" (which standard?)

### Improvement Requests

**CORRECT**:
- "Refactor aggregate to use factory method"
- "Add typed errors instead of generic Exception"
- "Extract webhook signature to separate guard"

**INCORRECT**:
- "Make it more production-ready" (what's missing?)
- "Clean up the code a bit" (what to clean?)
- "Could we make this better?" (always yes, no specifics)

### Prompt Anti-Patterns

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| "Do the thing" | No specifics | "Create X using Y pattern" |
| "Should be self-explanatory" | Nothing is | Include example/reference |
| "You know what I mean" | Mind reading | Be explicit |
| "Just" (minimizes complexity) | Underestimates | Acknowledge complexity |
| Questions ending in "?" | Unclear action | State what you want |
| "I think" or "Maybe" | Hedge language | State decision |

### Quality Gates (Backend Dev Non-Negotiables)

| Rule | Limit |
|------|-------|
| Function length | max 30 lines |
| File length | max 200 lines |
| Parameters | max 3 (use objects beyond) |
| Magic numbers | named constants |
| DB access | repository pattern only |
| Error handling | typed exceptions only |
| Parallel ops | Promise.all |

---

## Bounded Contexts Reference

```
account           → Master accounts, sub-accounts, envelopes
authentication    → User auth, OAuth
merchant          → KYB onboarding, merchant management
payment_processor → Payment processing
card_management   → Physical/virtual cards
notification      → Email, SMS, push
{domain}_core     → External system integrations
```

## Skill -> Pattern Quick Reference

| Skill | Pattern |
|-------|---------|
| nestjs-ddd-patterns | AggregateRoot, ValueObject, DomainEvent |
| nestjs-cqrs-commands | Command + CommandHandler |
| nestjs-cqrs-queries | Query + QueryHandler |
| nestjs-repository-pattern | Repository interface + TypeORM impl |
| nestjs-hexagonal-ports | Port + Adapter |
| nestjs-controllers | Thin controller + DTOs |
| nestjs-guards-filters | AuthGuard, RolesGuard, ExceptionFilter |
| nestjs-saga-pattern | SagaOrchestrator |
| nestjs-event-driven-architecture | DomainEvent + Kafka |
