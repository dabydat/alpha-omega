# EDA Anti-Patterns

These are the common mistakes in event-driven design.

---

## ❌ Events that describe implementation

```typescript
// BAD: Implementation detail in event name
export class DatabaseRecordInsertedEvent extends DomainEvent {
  constructor(recordId: string) {
    super('db.record.inserted');  // Technical, not domain
  }
}

// Good
export class MerchantOnboardedEvent extends DomainEvent { ... }
```

**Why it's bad**: Event should describe domain fact, not implementation action.

**Fix**: Domain-focused events.

---

## ❌ Synchronous event publishing blocking handler

```typescript
// BAD: Wait for all handlers before returning
async createOrder(order: OrderDTO) {
  const created = await this.orderRepo.save(order);
  // This blocks until all event handlers complete!
  await this.eventPublisher.publish('order.created', created.id, event);
  return created;
}

// Good: Async publish, handle errors
async createOrder(order: OrderDTO) {
  const created = await this.orderRepo.save(order);
  this.eventPublisher.publish('order.created', created.id, event).catch(err => {
    this.logger.error('Failed to publish event', err);
  });
  return created;
}
```

**Why it's bad**: Event publishing should be async. Handler shouldn't block main flow.

**Fix**: Fire-and-forget with proper error handling.

---

## ❌ Events with too much data

```typescript
// BAD: Entire entity in event
export class UserUpdatedEvent {
  constructor(
    public readonly user: User,  // Full object! Could be huge
  ) { }
}

// Good: Just what consumers need
export class UserUpdatedEvent {
  constructor(
    public readonly userId: string,
    public readonly changedFields: string[],
  ) { }
}
```

**Why it's bad**: Events serialized/deserialized. Large objects increase latency and memory.

**Fix**: Just ID references.

---

## ❌ No versioning strategy for events

```typescript
// BAD: Event changes without version
// v1: { userId, email }
// v2: { userId, email, phone } // Breaking change!
```

**Why it's bad**: Consumers break when event schema changes.

**Fix**: Schema versioning or additive changes only.

---

## Quality Checklist

```
[ ] Event names are domain facts
[ ] Event publishing is async (fire-and-forget)
[ ] Events carry IDs, not full entities
[ ] Event schema versioned
```
