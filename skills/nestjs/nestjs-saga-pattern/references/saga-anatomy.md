# Saga Anatomy

Sagas react to events via `@Saga()` and dispatch one or more commands.

---

## Event-Driven Saga (Reaction to Events)

```typescript
@Injectable()
export class PaymentLinkCreatedEventSaga {
  @Saga()
  public paymentLinkCreatedEvent(event$: Observable<PaymentLinkCreatedEvent>): Observable<ICommand> {
    return event$.pipe(
      ofType(PaymentLinkCreatedEvent),
      map((event) =>
        new PaymentLinkCreatedEventCommand(
          event.paymentLinkId,
          event.status,
          null,
          event.modifiedBy,
        ),
      ),
    );
  }

  @Saga()
  public sendLinkByShippingMethod = (events$: Observable<PaymentLinkSendedEvent>): Observable<ICommand> => {
    return events$.pipe(
      ofType(PaymentLinkSendedEvent),
      mergeMap((event) => [
        new PaymentLinkCreatedEventCommand(event.paymentLinkId, event.status, null, event.modifiedBy),
        new PublishPaymentLinkShippingMethodCommand(
          event.paymentLinkId, event.shippingType, event.email, event.phoneNumber, event.link,
        ),
      ]),
    );
  };
}
```

**Key decorators**:
- `@Saga()` - marks class as saga
- `ofType(EventClass)` - filters events by type
- `map(event => Command)` - transforms event to command
- `mergeMap(event => [cmd1, cmd2])` - multiple commands from event

---

## Authentication Saga

```typescript
@Injectable()
export class AuthenticationSaga {
  constructor(@Inject(QUEUE_SERVICE) private readonly queueService: QueueService) {}

  @Saga()
  public userAuthenticated(event$: Observable<UserAuthenticatedEvent>): Observable<ICommand> {
    return event$.pipe(
      ofType(UserAuthenticatedEvent),
      map((event: UserAuthenticatedEvent): UserAuthenticatedCommand =>
        new UserAuthenticatedCommand(event.userId, OtpDeliveryMethodEnum.EMAIL),
      ),
    );
  }
}
```

**Why map to command**: Saga reacts to event, dispatches command to handler. Command does actual work.

---

## Quality Checklist

```
[ ] @Saga() decorator
[ ] ofType filters events
[ ] map/mergeMap dispatches commands
[ ] No business logic in saga
```
