# Saga Testing

Test that a saga dispatches the right commands for each event.

---

## Test: PaymentLinkCreatedEventSaga

```typescript
import { of } from 'rxjs';
import { Test } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';

describe('PaymentLinkCreatedEventSaga', () => {
  let saga: PaymentLinkCreatedEventSaga;
  let commandBus: jest.Mocked<CommandBus>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PaymentLinkCreatedEventSaga,
        { provide: CommandBus, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    saga = module.get(PaymentLinkCreatedEventSaga);
    commandBus = module.get(CommandBus);
  });

  it('should dispatch PaymentLinkCreatedEventCommand when event received', async () => {
    const event = new PaymentLinkCreatedEvent('link-123', 'CREATED', null, 'user-456');
    const result$ = saga.paymentLinkCreatedEvent(of(event));
    let dispatchedCommand: any;
    result$.subscribe((cmd) => { dispatchedCommand = cmd; });

    expect(dispatchedCommand).toBeInstanceOf(PaymentLinkCreatedEventCommand);
    expect(dispatchedCommand.paymentLinkId).toBe('link-123');
  });

  it('should dispatch multiple commands for PaymentLinkSendedEvent', async () => {
    const event = new PaymentLinkSendedEvent(
      'link-123', 'SENDED', 'EMAIL', 'user@example.com', undefined, 'https://link.example.com/123', 'user-456',
    );
    const result$ = saga.sendLinkByShippingMethod(of(event));
    const commands: ICommand[] = [];
    result$.subscribe((cmd) => { commands.push(cmd); });

    expect(commands).toHaveLength(2);
    expect(commands[0]).toBeInstanceOf(PaymentLinkCreatedEventCommand);
    expect(commands[1]).toBeInstanceOf(PublishPaymentLinkShippingMethodCommand);
  });

  it('should handle event with null oldStatus', async () => {
    const event = new PaymentLinkCreatedEvent('link-123', 'CREATED', null, 'user-456');
    let dispatchedCommand: any;
    saga.paymentLinkCreatedEvent(of(event)).subscribe((cmd) => { dispatchedCommand = cmd; });

    expect(dispatchedCommand.oldStatus).toBeNull();
  });
});
```

---

## Test: AuthenticationSaga

```typescript
describe('AuthenticationSaga', () => {
  let saga: AuthenticationSaga;
  let queueService: jest.Mocked<QueueService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthenticationSaga,
        { provide: QUEUE_SERVICE, useValue: { send: jest.fn() } },
      ],
    }).compile();

    saga = module.get(AuthenticationSaga);
    queueService = module.get(QUEUE_SERVICE);
  });

  it('should dispatch UserAuthenticatedCommand with EMAIL delivery method', async () => {
    const event = new UserAuthenticatedEvent('user-123', 'email@example.com', 'jwt-token');
    let dispatchedCommand: any;
    saga.userAuthenticated(of(event)).subscribe((cmd) => { dispatchedCommand = cmd; });

    expect(dispatchedCommand).toBeInstanceOf(UserAuthenticatedCommand);
    expect(dispatchedCommand.userId).toBe('user-123');
    expect(dispatchedCommand.deliveryMethod).toBe(OtpDeliveryMethodEnum.EMAIL);
  });
});
```

---

## Test: Anti-pattern (documenting the rule)

```typescript
describe('Saga anti-pattern tests', () => {
  it('should NOT allow business logic in saga', () => {
    // Sagas should only map events to commands, not execute business logic
    // Anti-pattern: saga doing work instead of dispatching commands
    // Correct approach: map to ReserveInventoryCommand
  });
});
```

---

## Quality Checklist

```
[ ] Each @Saga() handler tested
[ ] Assert dispatched command type + payload
[ ] Multi-command mergeMap tested for count
```
