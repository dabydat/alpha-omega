# Compensation (Rollback) Patterns

When a step fails, the saga compensates by dispatching rollback commands.

---

## Simple Compensation

```typescript
@Saga()
paymentFailed(event$: Observable<PaymentFailedEvent>): Observable<ICommand> {
  return event$.pipe(
    ofType(PaymentFailedEvent),
    map((event) => new RefundReservationCommand(event.orderId)),
  );
}
```

---

## Saga with State Machine

For complex processes, use a state machine to track saga state:

```typescript
// Saga state
interface PaymentSagaState {
  orderId: string;
  inventoryReserved: boolean;
  paymentProcessed: boolean;
  compensationExecuted: boolean;
}

@Saga()
paymentSaga(events$: Observable<InventoryReservedEvent | PaymentSucceededEvent | PaymentFailedEvent>): Observable<ICommand> {
  return events$.pipe(
    ofType(InventoryReservedEvent, PaymentSucceededEvent, PaymentFailedEvent),
    mergeMap((event) => {
      if (event instanceof PaymentFailedEvent && this.state.inventoryReserved) {
        return [new ReleaseInventoryCommand(event.orderId)];
      }
      return [];
    }),
  );
}
```

---

## Quality Checklist

```
[ ] Failure triggers compensation commands
[ ] State tracked for complex flows
[ ] Rollback releases what was reserved
```
