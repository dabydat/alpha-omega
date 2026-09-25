# Hexagonal Anti-Patterns

These are the common mistakes in ports/adapters.

---

## ❌ Port depending on implementation details

```typescript
// BAD — port interface knows too much
export interface EmailPort {
  sendViaSMTP(host: string, port: number): Promise<void>;  // Implementation detail
}

// Good — capability focused
export interface EmailPort {
  send(to: string, subject: string, body: string): Promise<void>;
}
```

**Why it's bad**: Port should be stable. Implementation details leak into domain.

---

## ❌ Adapter containing business logic

```typescript
// BAD — adapter validates business rules
@Injectable()
export class EntityRepositoryAdapter implements EntityRepository {
  async findById(id: Uuid): Promise<Entity | null> {
    if (!this.cache.isHealthy()) {
      throw new CacheUnavailableException();  // Business logic
    }
  }
}

// Good — adapter translates, doesn't decide
async findById(id: Uuid): Promise<Entity | null> {
  return this.cache.get(`entity:${id.getValue}`)
    ?? this.database.findById(id);  // Try cache first, fallback to DB
}
```

**Why it's bad**: Adapter should only translate and delegate. Business rules belong in domain.

---

## ❌ Concrete dependencies in domain

```typescript
// BAD — domain imports concrete implementation
import { RedisClient } from 'ioredis';

// Good — depends on abstraction
import { CACHE_PROVIDER_PORT, CacheProviderPort } from '../../domain/ports';
```

**Why it's bad**: Domain depends on infrastructure. Impossible to test without real Redis.

---

## ❌ One adapter implementing multiple ports

```typescript
// BAD — god adapter
@Injectable()
export class EverythingAdapter implements LoggerPort, CachePort, EmailPort {
  // One class doing everything
}

// Good — focused adapters
class LoggerAdapter implements LoggerPort { /* ... */ }
class RedisCacheAdapter implements CacheProviderPort { /* ... */ }
class SendGridEmailAdapter implements EmailPort { /* ... */ }
```

**Why it's bad**: Violates single responsibility. Hard to test, hard to swap individual capabilities.

---

## Quality Checklist

```
[ ] Ports are capability-focused, not mechanism
[ ] Adapters translate, don't decide
[ ] Domain imports only ports
[ ] One adapter per port
```
