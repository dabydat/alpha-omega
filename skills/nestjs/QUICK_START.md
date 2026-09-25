# NestJS Best Practices - Quick Start Guide

A simple example workflow for building a new module feature.

---

## Scenario: Add "Create Merchant" to Merchant Service

You need to add a new feature: create merchant accounts.

---

## Step 1: Analyze with Meta-Prompt

```
REQUEST: Add CreateMerchant feature to merchant service

MODULE: merchant

BOUNDED CONTEXT: merchant (KYB onboarding)

REQUIREMENTS:
- Create merchant with business name, tax ID, owner email
- Validate tax ID format (RFC/CURP)
- Emit MerchantCreatedEvent on success
- Idempotent operation

AGENT(S) TO ACTIVATE:
- Backend Dev (CQRS command pattern)
- DBA (merchant table migration)

EXPECTED OUTPUTS:
- CreateMerchantCommand + Handler
- Merchant aggregate with factory
- Migration for merchants table
```

---

## Step 2: Activate Backend Dev

User says:
```
Act as Backend Dev. Module: merchant. Feature: CreateMerchantCommand.
Use nestjs-cqrs-commands pattern. Follow nestjs-ddd-patterns for aggregate.
Produce: Command, Handler, Merchant aggregate, DTOs.
```

Backend Dev reads:
- `nestjs-cqrs-commands/SKILL.md`
- `nestjs-ddd-patterns/SKILL.md`
- `nestjs-controllers/SKILL.md`

Backend Dev produces:
- `CreateMerchantCommand.ts`
- `CreateMerchantHandler.ts`
- `Merchant.ts` (aggregate with factory method)
- `CreateMerchantRequest.dto.ts`

---

## Step 3: Activate DBA

User says:
```
Act as DBA. Module: merchant. Domain: merchant.
Entities: Merchant (id, business_name, tax_id, owner_email, status, created_at, updated_at).
Produce: Migration for merchants table.
```

DBA reads:
- `config.json → switch.stacks`
- `nestjs-migrations/SKILL.md`

DBA produces:
- `YYYYMMDDHHMMSS_create_merchants_table.ts`

---

## Step 4: Verify with QA

User says:
```
Act as QA Engineer. Module: merchant. Feature: CreateMerchant.
Architecture: TCP microservice.
Test pyramid: unit tests for handler, integration test for command flow.
Launch criteria: idempotency test, validation tests pass.
```

QA Engineer reads:
- `rules/testing.md`
- Generated command/handler files

QA Engineer produces:
- `create-merchant.handler.spec.ts`
- `create-merchant.integration.spec.ts`

---

## Step 5: Run Quality Gates

After implementation, verify:

```
Functions:     max 30 lines     [ ] Handler under limit
Files:         max 200 lines    [ ] All files under limit
Parameters:    max 3            [ ] Command uses object if >3
Magic numbers: named constants  [ ] No magic numbers
DB access:     repository only [ ] Handler uses repository
Error handling: typed errors   [ ] DomainException hierarchy
Parallel exec: Promise.all     [ ] Independent ops use Promise.all
```

---

## Common Workflows

### Workflow: Add Query Endpoint

1. **Meta-prompt**: "Add GetMerchantById query to merchant service"
2. **Activate QA**: "Act as QA Engineer. Module: merchant. Feature: GetMerchantByIdQuery"
3. **QA provides**: Query handler test, pagination test
4. **Verify**: Handler returns DTO not Entity

### Workflow: Add External Integration

1. **Meta-prompt**: "Add AWS S3 document storage to merchant service"
2. **Activate Architect**: "Act as Architect. Module: merchant. Bounded context: merchant. External: AWS S3"
3. **Architect provides**: Port interface design, adapter structure
4. **Activate Backend Dev**: "Follow nestjs-third-party-packages pattern"
5. **Verify**: Integration behind port, typed errors

### Workflow: Add Saga (Multi-Step)

1. **Meta-prompt**: "Add merchant onboarding saga with KYC verification step"
2. **Activate Systems Analyst**: "Document process flow for merchant onboarding"
3. **Activate Architect**: "Design saga orchestration"
4. **Backend Dev implements**: "Follow nestjs-saga-pattern"
5. **QA adds**: "Compensation test, timeout test"

---

## Files to Read Before Starting

For any NestJS feature work:

1. `diagrams/code-graph.mermaid` - existing structure
2. `config.json → switch.stacks` - current stack versions
3. `nestjs/SKILL.md` - architecture overview
4. `rules/coding.md` - quality gate rules

---

## Skill Activation Quick Reference

| Need | Skill | When |
|------|-------|------|
| Domain model | nestjs-ddd-patterns | First - understand aggregate structure |
| Write operation | nestjs-cqrs-commands | Creating/updating entities |
| Read operation | nestjs-cqrs-queries | Listing/getting entities |
| Database | nestjs-repository-pattern | Data access layer |
| External service | nestjs-hexagonal-ports | AWS, cache, queue |
| API entry | nestjs-controllers | TCP/REST endpoints |
| Security | nestjs-guards-filters | Auth, guards, errors |
| Async flow | nestjs-event-driven-architecture | Kafka events |
| Multi-step | nestjs-saga-pattern | Compensation logic |
| Schema | nestjs-migrations | Database changes |

---

## Example File Structure Produced

```
src/merchant/
├── domain/
│   ├── models/
│   │   └── merchant.ts              # AggregateRoot
│   ├── value-objects/
│   │   └── tax-id.ts                 # ValueObject
│   ├── events/
│   │   └── merchant-created.event.ts
│   ├── ports/
│   │   └── merchant.repository.port.ts
│   └── exceptions/
│       └── merchant.exception.ts
├── application/
│   ├── commands/
│   │   ├── create-merchant/
│   │   │   ├── create-merchant.command.ts
│   │   │   └── create-merchant.handler.ts
│   │   └── index.ts
│   └── queries/
│       ├── get-merchant/
│       │   ├── get-merchant.query.ts
│       │   └── get-merchant.handler.ts
│       └── index.ts
├── infrastructure/
│   ├── persistence/
│   │   ├── entities/
│   │   │   └── merchant.entity.ts
│   │   └── repositories/
│   │       └── merchant.repository.impl.ts
│   ├── mappers/
│   │   └── merchant.mapper.ts
│   ├── adapters/
│   │   └── storage-s3.adapter.ts
│   ├── queue/
│   │   └── kafka.service.ts
│   └── tcp/
│       ├── merchant.controller.ts     # @MessagePattern handlers
│       ├── merchant.controller-map.ts # Message patterns + routes
│       └── dto/
│           ├── create-merchant.request.ts
│           └── merchant.response.ts
└── merchant.module.ts
```
