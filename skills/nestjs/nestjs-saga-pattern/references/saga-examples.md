# Saga Examples

Full saga implementations: PaymentLink saga with multiple handlers, Authentication saga, and Compensation saga.

---

## Example 1: PaymentLinkCreatedEventSaga with multiple event handlers

```typescript
import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { PaymentLinkCreatedEvent, PaymentLinkUpdatedEvent, PaymentLinkCancelEvent, PaymentLinkSendedEvent } from '../../domain/events';
import { PaymentLinkCreatedEventCommand } from '../commands/payment-link-created-event/payment-link-created-event.command';
import { PublishPaymentLinkShippingMethodCommand } from '../commands/publish-payment-link-shipping-method/publish-payment-link-shipping-method.command';

@Injectable()
export class PaymentLinkCreatedEventSaga {
  @Saga()
  public paymentLinkCreatedEvent(event$: Observable<PaymentLinkCreatedEvent>): Observable<ICommand> {
    return event$.pipe(
      ofType(PaymentLinkCreatedEvent),
      map((event) =>
        new PaymentLinkCreatedEventCommand(event.paymentLinkId, event.status, null, event.modifiedBy),
      ),
    );
  }

  @Saga()
  public paymentLinkUpdatedEvent(event$: Observable<PaymentLinkUpdatedEvent>): Observable<ICommand> {
    return event$.pipe(
      ofType(PaymentLinkUpdatedEvent),
      map((event) =>
        new PaymentLinkCreatedEventCommand(event.paymentLinkId, event.status, event.oldStatus, event.modifiedBy),
      ),
    );
  }

  @Saga()
  public paymentLinkCancelEvent(event$: Observable<PaymentLinkCancelEvent>): Observable<ICommand> {
    return event$.pipe(
      ofType(PaymentLinkCancelEvent),
      map((event) =>
        new PaymentLinkCreatedEventCommand(event.paymentLinkId, event.status, null, event.modifiedBy),
      ),
    );
  }

  @Saga()
  public sendLinkByShippingMethod = (events$: Observable<PaymentLinkSendedEvent>): Observable<ICommand> => {
    return events$.pipe(
      ofType(PaymentLinkSendedEvent),
      mergeMap((event) => [
        new PaymentLinkCreatedEventCommand(event.paymentLinkId, event.status, null, event.modifiedBy),
        new PublishPaymentLinkShippingMethodCommand(event.paymentLinkId, event.shippingType, event.email, event.phoneNumber, event.link),
      ]),
    );
  };
}
```

---

## Example 2: Authentication Saga

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

---

## Example 3: Compensation Saga

```typescript
@Injectable()
export class OrderCompensationSaga {
  @Saga()
  public paymentFailed(event$: Observable<PaymentFailedEvent>): Observable<ICommand> {
    return event$.pipe(
      ofType(PaymentFailedEvent),
      map((event) => new RefundReservationCommand(event.orderId)),
    );
  }

  @Saga()
  public inventoryReservationFailed(event$: Observable<InventoryReservationFailedEvent>): Observable<ICommand> {
    return event$.pipe(
      ofType(InventoryReservationFailedEvent),
      mergeMap((event) => [
        new CancelOrderCommand(event.orderId),
        new RefundPaymentCommand(event.orderId),
      ]),
    );
  }
}
```

---

## Quality Checklist

```
[ ] One @Saga() per event type
[ ] Dispatches commands, not business logic
[ ] Compensation on failure
```
