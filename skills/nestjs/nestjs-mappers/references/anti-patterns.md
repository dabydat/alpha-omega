# Mapper Anti-Patterns

These are the common mistakes in mappers.

---

## ❌ Mapper doing business logic

```typescript
// BAD — mapper shouldn't validate or transform business rules
public static toDomain(entity: EntityPersistence): Entity {
  if (entity.name.length < 3) { throw new InvalidNameException(); }
}
```

**Why it's bad**: Mapper should only translate, not validate. Validation belongs in domain VOs.

---

## ❌ Mappers depending on infrastructure

```typescript
// BAD — mapper imports TypeORM
import { EntityPersistence } from 'typeorm';
```

**Why it's bad**: Mapper is in domain/infrastructure boundary. Dependency on ORM couples domain to infrastructure.

---

## ❌ Returning domain objects from repository

```typescript
// BAD — repository returns domain directly
async findById(id: Uuid): Promise<Entity> {
  return this.repo.findOne({ where: { id: id.getValue } });  // Returns EntityPersistence!
}

// Good — repository returns persistence, caller maps
async findById(id: Uuid): Promise<Entity | null> {
  const entity = await this.repo.findOne({ where: { id: id.getValue } });
  return entity ? EntityMapper.toDomain(entity) : null;
}
```

**Why it's bad**: Repository leaks infrastructure types. Caller must know about persistence format.

---

## ❌ Duplicate mapping logic

```typescript
// BAD — same mapping in multiple places
public toResponse(): EntityResponse { /* mapping */ }
public toDetailDto(): EntityDto { /* different mapping, same fields */ }

// Good — share primitive extraction
public toDetailDto(): EntityDto {
  const primitives = this.toPrimitives();
  return { /* use primitives */ };
}
```

**Why it's bad**: Duplication leads to inconsistency. Change one, forget the other.

---

## Quality Checklist

```
[ ] Mappers translate, don't validate
[ ] No infra imports in mapper
[ ] Repository returns persistence, caller maps
[ ] No duplicate mapping
```
