# Repository Anti-Patterns

These are the common mistakes in repositories.

---

## ❌ Returning persistence entity from repository

```typescript
// BAD — leaks infrastructure
async findById(id: Uuid): Promise<EntityPersistence> {
  return this.repo.findOne({ where: { id: id.getValue } });
}

// Fix: Always return domain
async findById(id: Uuid): Promise<Entity | null> {
  const entity = await this.repo.findOne({ where: { id: id.getValue } });
  return entity ? EntityMapper.toDomain(entity) : null;
}
```

**Why it's bad**: Caller gets TypeORM entity, not domain aggregate. Couples caller to infrastructure.

---

## ❌ Repository with business logic

```typescript
// BAD — business logic in repository
async createEntity(data: any): Promise<Entity> {
  const existing = await this.findByEmail(data.email);
  if (existing) throw new EntityAlreadyExistsException();
}
```

**Why it's bad**: Repository shouldn't enforce business rules. Validation belongs in domain/aggregate.

---

## ❌ findAll without pagination

```typescript
// BAD — can return millions of rows
async findAll(): Promise<Entity[]> {
  return this.repo.find();  // SELECT * FROM entities
}
```

**Why it's bad**: Memory explosion, timeout, network flooding.

**Fix**: Always paginate. If caller needs all, implement cursor-based pagination or streaming.

---

## ❌ Direct query in service

```typescript
// BAD — service doing SQL
async getUsersByRole(role: string) {
  return this.dataSource.query('SELECT * FROM users WHERE role = $1', [role]);
}
```

**Why it's bad**: Service should use repository, not raw queries. Raw queries bypass mapper, entity tracking.

---

## Quality Checklist

```
[ ] Repository returns domain
[ ] No business logic in repository
[ ] List queries paginated
[ ] No raw queries in service
```
