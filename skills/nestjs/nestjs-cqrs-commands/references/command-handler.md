# Command Handler

The handler executes the command. It orchestrates: validate -> create -> persist -> emit event.

---

## Handler Structure

```typescript
@CommandHandler(CreateMasterAccountCommand)
export class CreateMasterAccountHandler
  implements ICommandHandler<CreateMasterAccountCommand, Account> {

  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
    @Inject(TRANSACTION_EXECUTION_PORT)
    private readonly transactionExecutionPort: TransactionExecutionPort,
    @Inject(EVENT_PUBLISHER)
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateMasterAccountCommand): Promise<Account> {
    const account = Account.create({
      id: Uuid.create(command.accountId),
      userId: Uuid.create(command.userId),
      balance: Amount.create(command.balance, command.currency),
    });

    const accountWithEvents = this.publisher.mergeObjectContext(account);

    return this.transactionExecutionPort.execute(async (manager) => {
      await this.accountRepository.save(accountWithEvents, manager);
      accountWithEvents.commit();
      return account;
    });
  }
}
```

**Why `mergeObjectContext`**: Links aggregate to event publisher. When aggregate calls `this.apply(event)`, event is captured for raising.

**Why `commit()`**: Explicit commit finalizes events. Without it, events remain in memory and won't be raised.

**Transaction wrapper**: Ensures save + event publishing is atomic.

---

## Quality Checklist

```
[ ] Handler implements ICommandHandler
[ ] async execute() returns Promise
[ ] Max 30 lines (split if longer)
[ ] Uses mergeObjectContext for event publishing
[ ] Uses commit() after domain operations
[ ] Parallel Promise.all for independent operations
[ ] Transaction wrapper for multi-aggregate operations
```
