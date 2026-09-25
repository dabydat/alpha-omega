# Why Repository Pattern

Repository is the collection-like interface for accessing aggregates. It abstracts data persistence, keeping domain independent of database implementation.

---

## Core Principle: Repository is a Collection

```
Domain thinks: "I have a collection of Entities"
Repository provides: find, save, delete operations

Infrastructure provides: actual database implementation (TypeORM, Prisma, etc.)
```

**Why this matters**: Domain doesn't know about tables, columns, or SQL. It just adds/gets entities from a collection.

---

## Problem Without Repository

```typescript
// ❌ BAD: Domain depends on database directly
export class EntityService {
  constructor(private dataSource: DataSource) {}

  async createEntity(data: CreateEntityDTO): Promise<Entity> {
    const entity = new Entity(data);
    await this.dataSource.query('INSERT INTO entities (id, name, email) VALUES ($1, $2, $3)', [entity.id, entity.name, entity.email]);
    return entity;
  }
}
```

**Why it's bad**: Domain is coupled to SQL. Change database = change domain. Can't unit test without actual DB.

---

## Solution with Repository

```typescript
// ✅ GOOD: Domain only knows collection interface
export class EntityService {
  constructor(private repository: EntityRepository) {}

  async createEntity(data: CreateEntityDTO): Promise<Entity> {
    const entity = Entity.create(/* ... */);
    return this.repository.save(entity);  // Domain doesn't know SQL
  }
}
```

**Why it's good**: Domain depends only on repository interface. Infrastructure implements it. Change database = only change adapter.

---

## Quality Checklist

```
[ ] Domain depends on repository interface
[ ] No SQL in domain
[ ] Infrastructure implements repository
```
