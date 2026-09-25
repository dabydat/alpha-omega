# Commands are Intent, Not Data

Commands represent **intent to change state**. They are the write side of CQRS. A command says "do something" — creating, updating, or deleting an aggregate.

---

## Core Principle: Intent vs Data

```
INCORRECT:  Command carries state like a DTO
            CreateUserCommand { userId, name, email, password, address, phone, ... }

CORRECT:    Command represents business intent
            CreateEntityCommand { aggregateId, name, email }
```

Commands express *intent*, not *data*. `CreateEntityCommand` tells you something is being created.

**Quality gate (Backend Dev)**: Functions max 30 lines. If handler exceeds 30 lines, split orchestration from domain logic.

---

## Quality Checklist

```
[ ] Command implements ICommand
[ ] Immutable fields (public readonly)
[ ] No behavior (data carrier only)
[ ] Named with verb (Create, Update, Delete, Process)
```
