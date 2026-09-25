---
name: nestjs-mappers
description: Mapper pattern for NestJS. Covers entity-to-domain mapping, domain-to-DTO transformation, and bidirectional mapping. Use when implementing data mappers, DTO transformations, or object conversion.
---

# NestJS Mappers

Mappers transform data between layers: domain ↔ persistence ↔ DTO. They are the translation layer that keeps layers independent.

**Production patterns for**: Entity-to-domain mapping, domain-to-DTO transformation, bidirectional transformations, static mapper methods

**Agent collaboration**: Backend Dev (clean transformation), Architect (layer isolation)

---

## Core Principle: Unidirectional Transformations

See `references/why-mappers.md` for the three directions, the ❌ BAD direct-coupling example, and the ✅ GOOD explicit-transformation example.

---

## Mapper Architecture

See `references/mapper-architecture.md` for the three transformations (`toEntityPersistence`, `toDomain`, `toResponse`).

---

## Implementation Details

### Domain to Persistence / Persistence to Domain

See `references/domain-persistence.md`.

---

## Response DTO Transformation

See `references/response-dto.md` (`toResponse` and `toDetailDto`).

---

## Nested Entity Mapping

See `references/nested-entity.md` (`toDomainWithRelations`).

---

## Enum Mapping

See `references/enum-mapping.md`.

---

## Mapper Index Pattern

See `references/mapper-index.md`.

---

## DTO Interfaces (Application Layer)

See `references/dto-interfaces.md`.

---

## Anti-Patterns to Avoid

See `references/anti-patterns.md` for the four ❌ examples (business logic, infra deps, domain return, duplicate mapping).

---

## Summary: Mapper Responsibilities

| Transformation | When | What Changes |
|----------------|------|-------------|
| Domain → Persistence | Saving to DB | VOs become primitives, dates become Date objects |
| Persistence → Domain | Loading from DB | Primitives become VOs, reconstruct nested objects |
| Domain → Response | API response | Flatten structure, only expose needed fields |
| Domain → Detail DTO | Single entity view | Full structure, nested objects, all metadata |

**Golden rule**: Mappers translate, they don't validate or compute. Business logic lives in domain, not in mapper.
