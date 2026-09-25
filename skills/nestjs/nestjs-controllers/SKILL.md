---
name: nestjs-controllers
description: NestJS controller patterns for TCP microservices and REST gateways. Covers @MessagePattern for TCP, @Controller for REST, Swagger decorators, DTOs, and ClientProxy patterns. Use when creating controllers, API endpoints, or microservice message handlers.
---

# NestJS Controllers

Controllers are the entry point to your bounded context. They receive incoming requests and delegate to the application layer (CQRS). **Controllers should be thin** — they parse input, call handlers, and return output. All business logic lives in handlers, aggregates, or domain services.

**Production patterns for**: TCP microservices, REST gateways, ClientProxy patterns, DTOs

**Agent collaboration**: Architect (TCP vs REST decision, BFF pattern), Backend Dev (thin controllers, proper delegation), QA Engineer (integration tests for controllers)

---

## Core Principle: Thin Controllers

See `references/thin-controller.md` for the BAD (thick) vs GOOD (thin, delegating to CQRS) comparison.

---

## Two Types of Controllers

### TCP Controllers (Internal Microservices)

**When to use**: Communication between internal microservices inside your architecture.

**Why TCP over HTTP**:
- Lower latency (no HTTP overhead)
- Type-safe message patterns (compile-time checking)
- Natural fit for request-response over message broker
- Better integration with NestJS microservices package

See `references/tcp-controllers.md` for full implementation patterns.

### REST Controllers (BFF Gateway)

**When to use**: External clients (web, mobile) accessing your system via REST API.

**Why the BFF (Backend-For-Frontend) pattern**:
- External clients cannot use TCP (they speak HTTP)
- Gateway translates HTTP requests to TCP messages to internal services
- Gateway handles cross-cutting concerns (auth, rate limiting, response transformation)

See `references/rest-controllers.md` for full BFF gateway patterns.

---

## Request DTOs

See `references/dtos.md` for the full `CreateEntityRequest` example, validation patterns, and Swagger decorators.

**Why separate DTOs**:
1. **Validation at boundary**: class-validator runs before handler executes, failing fast on bad input
2. **Documentation**: Swagger decorators generate OpenAPI spec automatically
3. **Isolation**: Changes to internal models don't leak to API contract
4. **Clear contract**: Frontend devs know exactly what to send

---

## Response DTOs

See `references/dtos.md` for `EntityResponse` and `EntityListResponse` (with pagination `meta`).

**Why separate response DTOs from domain models**:
1. **Hide internal structure**: Clients don't need to know about your aggregates, VOs, etc.
2. **Versioning**: API can evolve independently from domain
3. **Performance**: Response DTOs can exclude heavy fields not needed by clients

---

## Controller Constants

See `references/dtos.md` for the `EntityControllerMap` example.

**Why constants for routes and message patterns**:
1. **Single source of truth**: One place to change, all references update
2. **Type safety**: Compile-time checking if you miss a constant
3. **Discoverability**: Constants are colocated, easy to find

**Why use `as const`**: Makes the object fully readonly at TypeScript level, enabling autocompletion and preventing accidental mutation.

---

## Anti-Patterns to Avoid

See `references/anti-patterns.md` for the four ❌ examples (business logic, direct repo, missing user context, returning domain models).

---

## Summary: Controller Responsibilities

| Responsibility | Who handles it |
|---------------|----------------|
| Parse HTTP/TCP message | Controller |
| Validate input | Request DTO (class-validator) |
| Authenticate user | Guard (AuthGuard) |
| Authorize action | Guard or domain |
| Execute business logic | Command/Query Handler |
| Enforce invariants | Aggregate |
| Persist data | Repository |
| Transform output | Response DTO + Mapper |
| Handle errors | Exception Filter |

**Golden rule**: If it's not parsing input or transforming output, it shouldn't be in the controller.

---

## Related Skills

- `nestjs-guards-filters` - Guards, filters, and decorators
- `nestjs-cqrs-commands` - Command handlers and write operations
- `nestjs-cqrs-queries` - Query handlers and read operations
