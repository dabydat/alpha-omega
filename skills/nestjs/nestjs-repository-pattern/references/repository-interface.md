# Repository Interface (Domain Layer)

Interface in domain, implementation in infrastructure. This is hexagonal architecture.

---

## Interface Definition

```typescript
import { Uuid } from '@app/common_core/domain/value-objects';
import { Entity } from '../models/entity';
import { Email } from '../value-objects/email';

export const ENTITY_REPOSITORY = Symbol('ENTITY_REPOSITORY');

export interface EntityRepository {
  save(entity: Entity, manager?: any): Promise<Entity>;
  findById(id: Uuid): Promise<Entity | null>;
  findByUserId(userId: Uuid): Promise<Entity | null>;
  findByEmail(email: Email): Promise<Entity | null>;
  findAll(): Promise<Entity[]>;
  delete(id: Uuid): Promise<void>;
}
```

**Why in domain layer**: Domain owns the interface. Infrastructure implements it. Domain is the stable part.

**Why Symbol for DI**: Use Symbol, not string, to avoid collisions. `ENTITY_REPOSITORY` is unique token.

**Why return `Entity | null`**: Finder methods return null if not found. Caller decides what to do.

**Why `save(entity, manager?)`**: Optional manager for transaction support. Passed from command handler.

---

## Common Methods

```typescript
interface EntityRepository {
  // Create or update
  save(entity: Entity, manager?: any): Promise<Entity>;
  // Find by identity
  findById(id: Uuid): Promise<Entity | null>;
  // Find by attribute
  findByEmail(email: Email): Promise<Entity | null>;
  findByUserId(userId: Uuid): Promise<Entity | null>;
  // List all (use sparingly — no pagination)
  findAll(): Promise<Entity[]>;
  // Delete
  delete(id: Uuid): Promise<void>;
}
```

**Why `findAll()` without pagination**: Shouldn't exist in practice. Use `findPaginated()` instead.

---

## Quality Checklist

```
[ ] Interface in domain, no TypeORM
[ ] Symbol for DI
[ ] save accepts optional manager
```
