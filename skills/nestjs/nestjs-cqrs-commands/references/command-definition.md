# Command Definition

A command is a data class implementing `ICommand`. It carries the intent to change state.

---

## Anatomy of a Command

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

**Why `public readonly`**: Makes fields immutable. Commands are facts about what happened.

**Why no methods on commands**: Commands are data carriers, not behavior. Behavior lives in the aggregate.

---

## Quality Checklist

```
[ ] Command implements ICommand
[ ] Immutable fields (public readonly)
[ ] No behavior (data carrier only)
[ ] Named with verb (Create, Update, Delete, Process)
```
