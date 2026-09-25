# Why Mappers

Mappers transform data between layers: domain ↔ persistence ↔ DTO. They are the translation layer that keeps layers independent.

---

## Core Principle: Unidirectional Transformations

```
Domain → Persistence (toEntityPersistence)
Domain → Response DTO (toResponse, toDetailDto)
Persistence → Domain (toDomain)
```

**Why separate methods**: Each direction has different needs. Domain → Persistence needs to handle database-specific types (dates, enums). Persistence → Domain needs to reconstruct VOs from primitives.

**Why static methods**: Mappers are stateless. No need to instantiate. `EntityMapper.toDomain(entity)` reads naturally.

---

## Problem Without Mappers

```typescript
// ❌ BAD: Direct coupling between layers
const entity = await this.repo.findOne({ where: { id } });
// entity is EntityPersistence (database format)

const name = entity.name;  // Works but what's the type?
const created = entity.createdAt instanceof Date;  // What format?
```

**Why it's bad**: Infrastructure leaks everywhere. Database format (column names, date types) couples to business logic. Change table column = break everywhere.

---

## Solution With Mappers

```typescript
// ✅ GOOD: Explicit transformation
const entity = await this.repo.findOne({ where: { id } });
const domain = EntityMapper.toDomain(entity);
// Now you have Domain Entity with VOs
```

**Why it's good**: One place transforms. Change database schema = only change mapper. Domain never knows about column names.

---

## Quality Checklist

```
[ ] Mappers translate, don't validate
[ ] Static, stateless methods
[ ] One place transforms between layers
```
