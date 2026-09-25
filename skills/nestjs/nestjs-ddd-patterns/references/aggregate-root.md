# Aggregate Root

The aggregate is the transaction boundary. Everything inside can be changed atomically. Nothing outside can directly modify it.

---

## Every Aggregate Root MUST have

1. **Factory method** (`static create(...)`) - only way to create new instance
2. **`toPrimitives()`** - serialization for infrastructure layer
3. **State transition methods** - only way to change state
4. **Domain events** - raise on significant state changes

---

## Aggregate Structure

```typescript
export class Account extends AggregateRoot {
  private balance: Amount;
  private status: AccountStatus;

  constructor(
    private readonly id: Uuid,
    private readonly userId: Uuid,
    balance: Amount,
    status: AccountStatus,
  ) {
    super();
  }

  public static create(params: { id: Uuid; userId: Uuid; balance: Amount }): Account {
    const account = new Account(params.id, params.userId, params.balance, AccountStatus.ACTIVE);
    account.emit(new AccountCreatedEvent(params.id.getValue));
    return account;
  }

  public chargeBalance(amount: Amount): void {
    if (amount.isNegative() || this.balance.isLessThan(amount)) {
      throw new InsufficientBalanceException();
    }
    this.balance = this.balance.subtract(amount);
    this.emit(new AccountBalanceChargedEvent(this.id.getValue, amount.getValue()));
  }

  public toPrimitives(): AccountPrimitives {
    return { id: this.id.getValue, userId: this.userId.getValue, balance: this.balance.getValue(), status: this.status.getValue() };
  }
}
```

---

## CORRECT vs INCORRECT

```typescript
// INCORRECT: Direct instantiation bypasses invariants
const account = new Account(id, userId, balance, status);
account.balance = new Amount(-100);  // Invalid state allowed!

// CORRECT: Factory method enforces rules
const account = Account.create({ id, userId, balance });
account.chargeBalance(new Amount(1000));  // Invariants enforced
```

---

## Quality Checklist

```
[ ] Factory method (static create)
[ ] toPrimitives() for serialization
[ ] Private fields (no direct access)
[ ] State transitions through methods only
[ ] Domain events raised on significant changes
[ ] Method length: max 30 lines
```
