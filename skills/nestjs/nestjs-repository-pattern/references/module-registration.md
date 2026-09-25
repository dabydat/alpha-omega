# Module Registration

Register repository in module, provide implementation.

---

## EntityModule

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([EntityPersistence]), CqrsModule],
  providers: [{ provide: ENTITY_REPOSITORY, useClass: EntityRepositoryImpl }],
  exports: [ENTITY_REPOSITORY, CqrsModule],
})
export class EntityModule {}
```

**Why `TypeOrmModule.forFeature([EntityPersistence])`**: Repository impl needs EntityPersistence entity registered with TypeORM.

**Why export `ENTITY_REPOSITORY`**: Other modules may inject EntityRepository.

---

## Quality Checklist

```
[ ] Interface bound to implementation
[ ] Entity registered with TypeORM
[ ] Repository exported
```
