# Idempotent Commands

Commands that can be safely retried without changing state twice.

---

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
    await this.paymentsRepo.save(payment, { idempotencyKey: command.idempotencyKey });
  }
}
```

**Why idempotency matters**: Networks fail, clients retry. Without idempotency, you get duplicate charges.

---

## Quality Checklist

```
[ ] Idempotency key checked before processing
[ ] Duplicate returns success without reprocessing
```
