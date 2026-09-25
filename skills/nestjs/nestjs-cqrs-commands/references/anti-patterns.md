# Command Anti-Patterns

These are the common mistakes in command handlers.

---

## ❌ Business logic outside aggregate

```typescript
// INCORRECT
@CommandHandler(CreateEntityCommand)
async execute(command: CreateEntityCommand): Promise<Entity> {
  const entity = new Entity();
  entity.name = command.name;

  if (command.name.length < 3) {
    throw new InvalidNameException();
  }

  return this.repo.save(entity);
}

// CORRECT
export class Entity extends AggregateRoot {
  public static create(props: CreateProps): Entity {
    if (props.name.length < 3) {
      throw new InvalidNameException();
    }
  }
}
```

**Fix**: Move validation to aggregate factory.

---

## ❌ Calling repository in constructor

```typescript
// INCORRECT
@CommandHandler(CreateEntityCommand)
async execute(command: CreateEntityCommand): Promise<Entity> {
  const user = await this.userRepo.findById(command.userId);
  const entity = Entity.create(user, /* ... */);
  return this.repo.save(entity);
}
```

**Fix**: Pre-validate with query handler or sagas for complex flows.

---

## ❌ Swallowing exceptions

```typescript
// INCORRECT - silently failing
async execute(command: SomeCommand): Promise<void> {
  try {
    await this.process(command);
  } catch (error) {
    // Nothing - error disappears
  }
}
```

**Fix**: Always either propagate (throw) or log+recover.

---

## Quality Checklist

```
[ ] Business logic in aggregate, not handler
[ ] No repository calls in constructor
[ ] Exceptions propagate or log+recover (never swallowed)
```
