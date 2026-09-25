# Query Anti-Patterns

These are the common mistakes in query handlers.

---

## ❌ Query returning domain model

```typescript
// BAD — returns domain entity with VOs
@QueryHandler(GetEntityByIdQuery)
async execute(query: GetEntityByIdQuery): Promise<Entity> {
  return this.repository.findById(Uuid.create(query.entityId));
}
```

**Fix**: Return DTO with mapper:

```typescript
async execute(query: GetEntityByIdQuery): Promise<EntityDetailDto> {
  const entity = await this.repository.findById(Uuid.create(query.entityId));
  return EntityMapper.toDetailDto(entity);
}
```

---

## ❌ Business logic in query handler

```typescript
// BAD — handler doing domain logic
async execute(query: GetEntityByIdQuery): Promise<EntityDto> {
  const entity = this.repository.findById(query.entityId);
  if (entity.status === 'SUSPENDED') { entity.activate(); }
  return entity;
}
```

**Why it's bad**: Query shouldn't have side effects. Modifying entity during read is wrong.

**Fix**: Query is read-only. Business logic in command/aggregate.

---

## ❌ No pagination on list queries

```typescript
// BAD — returns all entities
@QueryHandler(GetAllEntitiesQuery)
async execute(query: GetAllEntitiesQuery): Promise<Entity[]> {
  return this.repository.findAll();
}
```

**Why it's bad**: Can return millions of rows. Memory exhaustion, timeout, network flood.

**Fix**: Always paginate.

---

## Quality Checklist

```
[ ] Queries return DTOs
[ ] No side effects in queries
[ ] List queries paginated
```
