# Skill Improvement Plan

## Skills Analyzed

| Skill | Lines | References | Status |
|-------|-------|-------------|--------|
| nestjs-api-documentation | 406 | No | OK |
| nestjs-api-versioning | 439 | No | OK |
| nestjs-authentication-oidc | 517 | No | NEEDS_WORK |
| nestjs-constants | 367 | No | OK |
| nestjs-controllers | 440 | No | OK |
| nestjs-cqrs-commands | 312 | Yes | OK |
| nestjs-cqrs-queries | 495 | No | OK |
| nestjs-ddd-patterns | 343 | Yes | OK |
| nestjs-event-driven-architecture | 478 | No | OK |
| nestjs-guards-filters | 498 | No | OK |
| nestjs-handlebars-templates | 357 | Yes | OK |
| nestjs-hexagonal-ports | 480 | No | OK |
| nestjs-libs-pattern | 487 | No | OK |
| nestjs-logging | 392 | Yes | OK |
| nestjs-mappers | 443 | No | OK |
| nestjs-migrations | 420 | Yes | OK |
| nestjs-repository-pattern | 452 | No | OK |
| nestjs-saga-pattern | 338 | Yes | OK |
| nestjs-third-party-packages | 492 | No | OK |

## Issues Found

### nestjs-authentication-oidc (517 lines)
- Exceeds 500 line limit by 17 lines
- No progressive disclosure via references/ folder despite containing multiple distinct topics (OIDC, PKCE, JWKS, password hashing)

### 12 skills missing references/ folders
These skills have detailed code examples inline that should be moved to references/:
- nestjs-api-documentation - large inline code blocks (Swagger decorators)
- nestjs-api-versioning - versioning strategy examples
- nestjs-constants - DI token and topic constant patterns
- nestjs-controllers - TCP and REST controller patterns
- nestjs-cqrs-queries - query handler patterns with pagination
- nestjs-event-driven-architecture - Kafka/Redis integration patterns
- nestjs-guards-filters - OAuth guard and filter implementations
- nestjs-hexagonal-ports - adapter implementations
- nestjs-libs-pattern - shared module structure examples
- nestjs-mappers - bidirectional mapping implementations
- nestjs-repository-pattern - TypeORM query patterns
- nestjs-third-party-packages - AWS SDK abstraction patterns

### All descriptions pass validation
- All under 1024 chars
- All include "Use when..." clause
- All use forward slashes
- Zero emojis found

## Proposed Changes

### Priority: High

#### nestjs-authentication-oidc
- Split into two skills: `nestjs-authentication-oidc` (OIDC/PKCE/JWKS) and `nestjs-authentication-password` (password hashing only)
- OR move password hashing section to references/ and trim main SKILL.md under 500 lines

#### Add references/ folders to high-impact skills with inline code

**nestjs-guards-filters** (498 lines)
- Move OAuth guard implementation to references/oauth-guard.ts
- Move webhook signature verification to references/webhook-verification.ts
- Move exception filter examples to references/exception-filters.ts

**nestjs-controllers** (440 lines)
- Move TCP controller full implementation to references/tcp-controller.ts
- Move REST controller full implementation to references/rest-controller.ts

**nestjs-cqrs-queries** (495 lines)
- Move pagination implementation to references/pagination.ts

### Priority: Medium

**nestjs-api-documentation**
- Move schema generation patterns to references/schema-generation.ts

**nestjs-hexagonal-ports**
- Move adapter implementation examples to references/adapter-examples.ts

**nestjs-mappers**
- Move bidirectional mapping to references/mapper-examples.ts

**nestjs-repository-pattern**
- Move TypeORM patterns to references/typeorm-queries.ts

**nestjs-third-party-packages**
- Move AWS SDK abstraction to references/aws-adapter.ts

### Priority: Low

**nestjs-api-versioning**, **nestjs-constants**, **nestjs-event-driven-architecture**, **nestjs-libs-pattern** - Consider adding references/ folders if skills grow beyond 500 lines

## Priority
- **High**: Fix nestjs-authentication-oidc (517 lines - exceeds limit)
- **High**: Add references/ to nestjs-guards-filters, nestjs-controllers, nestjs-cqrs-queries (high token usage with inline code)
- **Medium**: Add references/ to remaining 8 skills
- **Low**: Monitor remaining 7 skills
