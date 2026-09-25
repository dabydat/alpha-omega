# Event Anatomy

Events represent something significant that happened in the domain. They carry the context consumers need and a message format for queue consumption.

---

## Domain Events

```typescript
// apps/authentication/src/user/domain/events/user-created.event.ts
export class UserCreatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly fullName: string,
    public readonly timestamp: Date = new Date(),
  ) {
    super('user.created');  // Event type
  }
}

// apps/merchant/src/merchant/domain/events/merchant-admin-user-created.event.ts
export class MerchantAdminUserCreatedEvent extends DomainEvent {
  constructor(
    public readonly merchantId: string,
    public readonly userId: string,
    public readonly email: string,
    public readonly timestamp: Date = new Date(),
  ) {
    super('merchant.admin.user.created');
  }
}
```

**Why separate event per domain**: Events belong to the bounded context that owns them. Merchant doesn't publish `user.created` - authentication does.

---

## Event Message Format

```typescript
// For queue consumption, events need a message format
export interface UserCreatedMessage {
  userId: string;
  email: string;
  fullName: string;
  code?: string;  // For email verification
}
```

---

## Quality Checklist

```
[ ] Event names are domain facts (not technical)
[ ] Events carry relevant context
[ ] Message format defined for queue consumption
```
