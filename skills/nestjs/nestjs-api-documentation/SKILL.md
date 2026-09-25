---
name: nestjs-api-documentation
description: OpenAPI/Swagger documentation patterns for NestJS. Covers decorator-based documentation, schema generation, and client code generation. Use when documenting APIs, generating clients, or setting up API documentation.
---

# NestJS API Documentation (OpenAPI/Swagger)

OpenAPI (formerly Swagger) provides machine-readable API documentation. Good documentation helps clients integrate faster and reduces support burden.

## Why Documentation

See `references/why-documentation.md` for the INCORRECT vs CORRECT comparison and the full rationale.

---

## NestJS Swagger Setup

### Module Configuration

See `references/swagger-setup.md` (main.ts bootstrap with `DocumentBuilder`) and the interactive docs URLs.

---

## Decorator Reference

See `references/decorator-reference.md` for the complete decorator toolkit (controller, request body, parameters, grouping, enums, nested types, class-validator schema).

---

## Custom Response Decorators

See `references/custom-response-decorators.md` for the paginated response decorator and the typed error DTO.

---

## Authentication Documentation

See `references/auth-documentation.md` for bearer setup, protecting endpoints, and role-based auth.

---

## Anti-Patterns to Avoid

See `references/anti-patterns.md` for the four ❌ examples (no error docs, generic descriptions, missing examples, inconsistent docs) with fixes.

---

## Summary: Documentation Responsibilities

| Decorator | Purpose |
|-----------|---------|
| `@ApiTags()` | Group endpoints |
| `@ApiOperation()` | Describe operation |
| `@ApiBody()` | Request body schema |
| `@ApiResponse()` | Response schema |
| `@ApiBearerAuth()` | Auth requirements |
| `@ApiParam()` | Path parameter |
| `@ApiQuery()` | Query parameter |

**Golden rule**: If it's not documented, it doesn't exist for clients. Document everything public.
