# Command Handler Examples

Full examples of command handlers covering the common patterns: transaction, domain events, transactional multi-aggregate, and idempotency.

---

## Basic Handler with Transaction

```typescript
import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

@CommandHandler(CreateEntityCommand)
export class CreateEntityHandler
  implements ICommandHandler<CreateEntityCommand> {

  constructor(
    @Inject(ENTITY_REPOSITORY)
    private readonly entityRepository: EntityRepository,
    @Inject(LOGGER_PORT)
    private readonly logger: LoggerPort,
  ) {}

  async execute(command: CreateEntityCommand): Promise<Entity> {
    this.logger.info(`Creating entity: ${JSON.stringify(command)}`);

    const aggregateId = Uuid.create(command.aggregateId);
    const exists = await this.entityRepository.findById(aggregateId);

    if (exists) {
      throw new EntityAlreadyExistsException(command.email);
    }

    const id = Uuid.create(command.aggregateId);
    const userId = Uuid.create(command.userId);
    const name = Name.create(command.name);
    const email = Email.create(command.email);
    const phone = FullPhoneNumber.create(command.phoneCountry, command.phoneNumber);

    const entity = Entity.create(id, userId, name, email, phone);

    return this.entityRepository.save(entity);
  }
}
```

## Handler with Domain Events

```typescript
@CommandHandler(CreateEntityCommand)
export class CreateEntityWithEventsHandler
  implements ICommandHandler<CreateEntityCommand> {

  constructor(
    @Inject(ENTITY_REPOSITORY)
    private readonly entityRepository: EntityRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateEntityCommand): Promise<Entity> {
    const entity = this.eventPublisher.mergeObjectContext(
      Entity.create(/* ... */),
    );

    entity.create();

    entity.commit();

    await this.entityRepository.save(entity);

    return entity;
  }
}
```

## Transactional Handler

```typescript
@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand> {

  async execute(command: CreateAccountCommand): Promise<Account> {
    return this.db.transaction(async (manager) => {
      const account = await this.accountRepository.save(
        new Account(/* ... */),
        manager,
      );

      await this.ledgerRepository.save(
        new LedgerEntry(account.id, /* ... */),
        manager,
      );

      return account;
    });
  }
}
```

## Idempotent Handler

```typescript
@CommandHandler(ProcessPaymentCommand)
export class ProcessPaymentHandler
  implements ICommandHandler<ProcessPaymentCommand> {

  async execute(command: ProcessPaymentCommand): Promise<void> {
    const existing = await this.paymentsRepo.findByIdempotencyKey(
      command.idempotencyKey,
    );

    if (existing) {
      this.logger.info(`Payment already processed: ${command.idempotencyKey}`);
      return;
    }

    const payment = await this.processPayment(command);

    await this.paymentsRepo.save(payment, {
      idempotencyKey: command.idempotencyKey,
    });
  }
}
```

---

## Quality Checklist

```
[ ] Handler orchestrates, aggregate decides
[ ] Events published via mergeObjectContext + commit
[ ] Multi-aggregate wrapped in transaction
[ ] Idempotency key checked first
```
