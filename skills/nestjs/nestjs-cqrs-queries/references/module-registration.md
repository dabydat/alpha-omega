# Module Registration

Register all query handlers in the module and bind the repository to its implementation.

---

## QueryHandlers + EntityModule

```typescript
export const QueryHandlers = [
  GetEntityByIdHandler,
  GetEntitiesPaginatedHandler,
  GetEntitiesFilteredHandler,
  GetEntityByEmailHandler,
  CountEntitiesHandler,
];

@Module({
  imports: [CqrsModule],
  providers: [
    ...QueryHandlers,
    { provide: ENTITY_REPOSITORY, useClass: EntityRepositoryImpl },
  ],
  exports: [CqrsModule],
})
export class EntityModule {}
```

---

## Quality Checklist

```
[ ] All query handlers registered
[ ] CqrsModule imported
[ ] Repository bound to implementation
```
