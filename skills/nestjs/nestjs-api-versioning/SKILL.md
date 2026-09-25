---
name: nestjs-api-versioning
description: API versioning patterns for NestJS. Covers URL versioning, header versioning, and API evolution strategies. Use when supporting multiple API versions, evolving APIs, or managing breaking changes.
---

# NestJS API Versioning

APIs evolve. Versioning allows API changes without breaking existing clients. Without versioning, any change cascades as breaking change to all consumers.

## Why API Versioning

See `references/why-versioning.md` for the ❌ BAD (breaking change without version) and ✅ GOOD (versioned URLs) examples.

---

## Versioning Strategies

See `references/versioning-strategies.md` for URL Path, Header, and Query Parameter strategies.

---

## URL Path Versioning Implementation

### Controller Map with Version

See `references/url-path-versioning.md` for the `UserRoutesV1`/`V2` and `UserMessagePatternsV1`/`V2` constants.

---

## Versioning Controller Patterns

### Versioned Controller Structure (BFF Gateway)

See `references/versioned-controllers.md` for the folder tree (`v1/`, `v2/` with DTOs) and the V1/V2 controllers.

---

## Internal Message Pattern Versioning

See `references/message-pattern-versioning.md` (BFF sends to microservice with the versioned message pattern).

---

## DTO Versioning

See `references/dto-versioning.md` (splitting `name` into `firstName`/`lastName`, renaming `emailAddress`→`email`, additive `phone?` in V2).

---

## Deprecation Strategy

See `references/deprecation-strategy.md` (`Deprecation`, `Sunset`, `Link` headers).

---

## Version Lifecycle

See `references/version-lifecycle.md` (v3 active → v2 deprecated → v1 sunset) and the migration guide (`@Redirect` 301).

---

## Anti-Patterns to Avoid

See `references/anti-patterns.md` for the four ❌ examples with fixes.

---

## Summary: Versioning Responsibilities

| Strategy | Use Case | Complexity |
|----------|----------|------------|
| URL Path | Most REST APIs | Low |
| Header | Clean URLs, multiple versions | Medium |
| Query Param | Quick versioning | Low |

**Golden rule**: Version your API from the start. Breaking changes should be rare and deliberate. Communicate deprecation clearly and early.
