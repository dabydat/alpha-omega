# Command Definition Examples

Full examples of command definitions covering the common write operations.

---

## Basic Create Command

```typescript
import { ICommand } from '@nestjs/cqrs';

export class CreateEntityCommand implements ICommand {
  constructor(
    public readonly aggregateId: string,
    public readonly name: string,
    public readonly email: string,
    public readonly phoneCountry: string,
    public readonly phoneNumber: string,
    public readonly type?: string,
  ) {}
}
```

## Update Command with Optional Fields

```typescript
export class UpdateEntityCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly email?: string,
  ) {}
}
```

## Process Command with Metadata

```typescript
export class ProcessPaymentCommand implements ICommand {
  constructor(
    public readonly paymentId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly idempotencyKey: string,
    public readonly metadata?: Record<string, string>,
  ) {}
}
```

## Delete Command

```typescript
export class DeleteAccountCommand implements ICommand {
  constructor(
    public readonly accountId: string,
    public readonly reason: string,
    public readonly deletedBy: string,
  ) {}
}
```

---

## Quality Checklist

```
[ ] Every command implements ICommand
[ ] Fields are public readonly
[ ] Commands named with a verb
```
