# DDD Anti-Patterns

These are the common mistakes that break domain modeling.

---

## ❌ Anemic Domain Model

```typescript
// INCORRECT - no behavior, just data
class User { id: string; name: string; setName(name: string) { this.name = name; } }

// CORRECT - behavior in domain
class User {
  private name: Name;
  public rename(newName: Name): void {
    if (newName.equals(this.name)) return;
    this.name = newName;
    this.emit(new UserRenamedEvent(this.id.getValue, newName.getValue()));
  }
}
```

---

## ❌ Primitive Obsession

```typescript
// INCORRECT - primitives everywhere
class Order { items: string; total: number; customerEmail: string; }

// CORRECT - domain types
class Order { items: OrderItem[]; total: Amount; customerEmail: Email; }
```

---

## ❌ God Aggregate

```typescript
// INCORRECT - impossible to reason about invariants
class Order extends AggregateRoot {
  items: OrderItem[]; shipping: Shipping; billing: Billing; customer: Customer; payments: Payment[]; // 50 more fields...
}

// CORRECT - focused aggregates
class Order extends AggregateRoot { items: OrderItem[]; status: OrderStatus; }
class Customer extends AggregateRoot { /* Customer-level invariants */ }
```

**Rule of thumb**: If you can't fit all invariants in your head, the aggregate is too big.

---

## Quality Checklist

```
[ ] Domain has behavior (not anemic)
[ ] VOs used instead of primitives
[ ] Aggregates focused (no god aggregate)
```
