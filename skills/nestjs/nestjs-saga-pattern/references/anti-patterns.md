# Saga Anti-Patterns

These are the common mistakes in sagas.

---

## ❌ Saga doing actual work

```typescript
// INCORRECT: Saga with business logic
@Saga()
orderPlaced(event$: Observable<OrderPlacedEvent>): Observable<ICommand> {
  return event$.pipe(
    ofType(OrderPlacedEvent),
    map((event) => {
      // BAD: Business logic in saga!
      const inventory = this.inventoryService.reserve(event.orderId);
      return new NotifyCustomerCommand(event.orderId);
    }),
  );
}
```

**Fix**: Map to commands, handlers do the work.

---

## ❌ Too many commands per event

```typescript
// INCORRECT: Saga dispatching 20 commands
mergeMap((event) => [
  new Cmd1(), new Cmd2(), new Cmd3(), new Cmd4(), new Cmd5(),
  // ... too many!
])
```

**Fix**: Split into smaller sagas or use choreography instead.

---

## ❌ No timeout for long-running sagas

```typescript
// INCORRECT: If Step 3 never completes, saga hangs forever
```

**Fix**: Implement timeout and compensation. Track saga state in database.

---

## ❌ Coupling saga to specific handler implementations

```typescript
// INCORRECT: Saga imports specific handler
import { PaymentHandler } from '../handlers/payment.handler';
```

**Fix**: Saga dispatches commands via CommandBus, doesn't know handler details.

---

## Quality Checklist

```
[ ] Sagas orchestrate, handlers do work
[ ] Not too many commands per event
[ ] Timeout + compensation for long-running
[ ] No coupling to specific handlers
```
