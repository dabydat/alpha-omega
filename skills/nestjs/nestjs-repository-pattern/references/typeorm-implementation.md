# TypeORM Implementation (Infrastructure)

Implementation lives in infrastructure layer, implements domain interface.

---

## Class Structure

```typescript
@Injectable()
export class EntityRepositoryImpl implements EntityRepository {
  constructor(@InjectRepository(EntityPersistence) private readonly repo: Repository<EntityPersistence>) {}

  async save(entity: Entity, manager?: any): Promise<Entity> {
    // Domain to persistence via mapper
    const primitives = entity.toPrimitives();
    const record = EntityMapper.toEntityPersistence(primitives);

    // Use transaction manager if provided
    if (manager) {
      const repo = manager.getRepository(EntityPersistence);
      const saved = await repo.save(record);
      return EntityMapper.toDomain(saved);
    }

    const saved = await this.repo.save(record);
    return EntityMapper.toDomain(saved);
  }

  async findById(id: Uuid): Promise<Entity | null> {
    const entity = await this.repo.findOne({ where: { id: id.getValue }, relations: ['addresses', 'subEntities'] });
    return entity ? EntityMapper.toDomain(entity) : null;
  }

  async findByEmail(email: Email): Promise<Entity | null> {
    const entity = await this.repo.findOne({ where: { email: email.getValue } });
    return entity ? EntityMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: UserId): Promise<Entity | null> {
    const entity = await this.repo.findOne({ where: { userId: userId.getValue } });
    return entity ? EntityMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Entity[]> {
    const entities = await this.repo.find();
    return entities.map(EntityMapper.toDomain);
  }

  async delete(id: Uuid): Promise<void> {
    await this.repo.delete({ id: id.getValue });
  }
}
```

**Why `EntityMapper.toDomain` in every method**: Repository returns domain objects, not persistence entities. Mapper translates.

**Why `relations` in `findById`**: Aggregate may have sub-entities/addresses. Load them with main entity to avoid N+1.

---

## Quality Checklist

```
[ ] Implements domain interface
[ ] Returns domain, not persistence
[ ] Relations eager-loaded
```
