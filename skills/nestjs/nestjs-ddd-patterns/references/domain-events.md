# Domain Events

Events represent something significant that happened. Other parts react without tight coupling.

---

## When to Use

- Entity creation/deletion
- Status transitions
- Significant value changes
- Business process milestones

---

## Event Structure

```typescript
export class AccountCreatedEvent extends DomainEvent {
  constructor(
    public readonly accountId: string,
    public readonly userId: string,
    public readonly balance: number,
  ) {
    super('account.created');
  }
}
```

---

## Publishing Events

```typescript
const accountWithEvents = this.publisher.mergeObjectContext(account);
await this.accountRepository.save(accountWithEvents);
accountWithEvents.commit();
```

**Why `mergeObjectContext`**: Allows aggregate to raise events via `this.emit()` while being managed by publisher for transaction consistency.

---

## CORRECT vs INCORRECT Event Naming

```typescript
// INCORRECT: Technical implementation detail
super('entity.saved');

// CORRECT: Domain fact
super('merchant.onboarded');
```

Events are for domain experts. "Entity saved" is technical; "Merchant onboarded" is business.

---

## Quality Checklist

```
[ ] Named with domain language (not technical)
[ ] Contains relevant context (not just ID)
[ ] Events published via mergeObjectContext
```
