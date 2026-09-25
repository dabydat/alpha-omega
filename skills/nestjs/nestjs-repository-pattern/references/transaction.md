# Transaction Support

Multiple operations in single transaction must all succeed or all fail.

---

## Transaction via Manager

```typescript
async saveWithTransaction(entity: Entity): Promise<Entity> {
  return this.dataSource.transaction(async manager => {
    const repo = manager.getRepository(EntityPersistence);
    const record = EntityMapper.toEntityPersistence(entity.toPrimitives());
    const saved = await repo.save(record);
    return EntityMapper.toDomain(saved);
  });
}
```

---

## Usage in Command Handler

```typescript
@CommandHandler(CreateEntityCommand)
export class CreateEntityHandler implements ICommandHandler<CreateEntityCommand> {
  constructor(
    @Inject(ENTITY_REPOSITORY) private readonly entityRepository: EntityRepository,
    @Inject(DATA_SOURCE) private readonly dataSource: DataSource,
  ) {}

  async execute(command: CreateEntityCommand): Promise<Entity> {
    return this.dataSource.transaction(async manager => {
      const entity = Entity.create(/* ... */);
      return this.entityRepository.save(entity, manager);
    });
  }
}
```

**Why pass manager to repository**: Repository's `save(entity, manager)` uses manager if provided, otherwise uses default connection.

**Why transaction at handler level**: Command may create multiple aggregates. All should be atomic.

---

## Quality Checklist

```
[ ] Multi-aggregate in transaction
[ ] Repository accepts manager
[ ] All-or-nothing semantics
```
