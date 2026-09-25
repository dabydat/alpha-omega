# Queries Don't Change State

Queries are read operations in CQRS. They don't modify state; they return data. Unlike commands, queries are side-effect free and can be optimized separately from writes.

---

## Core Principle

```
Commands: Write -> Modify state -> Return entity or void
Queries: Read -> No state change -> Return DTO
```

---

## Problem Without CQRS

```typescript
// BAD: Same model for read and write
class EntityService {
  async createEntity(data: CreateEntityDTO): Promise<Entity> { /* write side */ }
  async getEntity(id: string): Promise<Entity> { /* read side - returns same Entity */ }
  async listEntities(): Promise<Entity[]> { /* read side - returns full Entity */ }
}
```

**Why it's bad**:
- Entity has all fields (VOs, relations) even when client needs only id/name
- Read queries are constrained by write model structure
- Can't optimize read path (indexes, caching) separately

---

## Solution With CQRS

```typescript
// GOOD: Separate read and write
@CommandHandler(CreateEntityCommand)
async execute(command: CreateEntityCommand): Promise<Entity> {
  const entity = Entity.create(/* ... */);
  return this.repository.save(entity);
}

@QueryHandler(GetEntityByIdQuery)
async execute(query: GetEntityByIdQuery): Promise<EntityDetailDto> {
  const entity = await this.repository.findById(Uuid.create(query.entityId));
  return EntityMapper.toDetailDto(entity);
}

@QueryHandler(GetEntitiesPaginatedQuery)
async execute(query: GetEntitiesPaginatedQuery): Promise<EntityListResponse> {
  const result = await this.repository.findPaginated(query);
  return {
    data: result.data.map(EntityMapper.toResponse),
    meta: { total: result.total, page: query.page, limit: query.limit },
  };
}
```

---

## Quality Checklist

```
[ ] Queries return DTOs, not domain entities
[ ] Queries are side-effect free
[ ] List queries paginated
```
