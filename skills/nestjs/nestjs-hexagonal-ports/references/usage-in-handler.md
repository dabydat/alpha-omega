# Usage in Command Handler

Inject ports via constructor. Domain uses them without knowing implementation.

---

## CreateEntityHandler

```typescript
@CommandHandler(CreateEntityCommand)
export class CreateEntityHandler
  implements ICommandHandler<CreateEntityCommand> {

  constructor(
    @Inject(ENTITY_REPOSITORY)
    private readonly entityRepository: EntityRepository,
    @Inject(LOGGER_PORT)
    private readonly logger: LoggerPort,
    @Inject(CACHE_PROVIDER_PORT)
    private readonly cache: CacheProviderPort,
    @Inject(PUBLISHER_PORT)
    private readonly publisher: PublisherPort,
  ) {}

  async execute(command: CreateEntityCommand): Promise<Entity> {
    this.logger.info(`Creating entity: ${command.name}`);

    const entity = Entity.create(/* ... */);
    await this.entityRepository.save(entity);

    // Invalidate cache
    await this.cache.delete(`entity:${entity.id.getValue}`);

    // Publish event
    await this.publisher.publish(
      'entity.created',
      entity.id.getValue,
      { entityId: entity.id.getValue, name: entity.name.getValue },
    );

    return entity;
  }
}
```

**Why logger first**: Log intent before action. Provides audit trail.

**Why invalidate cache after save**: Cache should reflect database state. After save, stale cache entry is invalid.

**Why publish event**: Notify other services. They may need to update their caches, send notifications, etc.

---

## Quality Checklist

```
[ ] Ports injected via constructor @Inject
[ ] Log intent before action
[ ] Invalidate cache after save
[ ] Publish event after state change
```
