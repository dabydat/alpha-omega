# Saga Patterns

The three common saga patterns: simple event→command, event→multiple commands, and chained commands.

---

## 1. Simple Event -> Command

```typescript
@Saga()
paymentCreated(event$: Observable<PaymentCreatedEvent>): Observable<ICommand> {
  return event$.pipe(
    ofType(PaymentCreatedEvent),
    map((event) => new SendPaymentConfirmationCommand(event.paymentId)),
  );
}
```

**When**: One event triggers one command. Used for simple notification or recording.

---

## 2. Event -> Multiple Commands

```typescript
@Saga()
orderFulfilled(event$: Observable<OrderFulfilledEvent>): Observable<ICommand> {
  return event$.pipe(
    ofType(OrderFulfilledEvent),
    mergeMap((event) => [
      new DeductInventoryCommand(event.orderId),
      new ChargeCustomerCommand(event.orderId),
      new NotifyWarehouseCommand(event.orderId),
    ]),
  );
}
```

**When**: One event triggers multiple parallel actions. Used for fan-out scenarios.

---

## 3. Chained Commands

```typescript
@Saga()
orderPlaced(event$: Observable<OrderPlacedEvent>): Observable<ICommand> {
  return event$.pipe(
    ofType(OrderPlacedEvent),
    mergeMap((event) =>
      from(this.validateInventoryCommand.execute(event.orderId)).pipe(
        mergeMap(() => [new ReserveInventoryCommand(event.orderId)]),
      ),
    ),
  );
}
```

**When**: Steps must execute in sequence. Use `mergeMap` to chain observables.

---

## Quality Checklist

```
[ ] Simple event→command for one action
[ ] mergeMap for fan-out
[ ] mergeMap chaining for sequential steps
```
