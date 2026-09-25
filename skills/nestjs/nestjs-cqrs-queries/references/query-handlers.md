# Query Handler Implementation

Query handlers execute queries and return DTOs. See `references/query-handlers.md` for full patterns.

---

## Basic Query Handler

```typescript
@QueryHandler(GetEntityByIdQuery)
export class GetEntityByIdHandler implements IQueryHandler<GetEntityByIdQuery, EntityDto> {
  constructor(
    @Inject(ENTITY_REPOSITORY)
    private readonly entityRepository: EntityRepository,
  ) {}

  async execute(query: GetEntityByIdQuery): Promise<EntityDto> {
    const entity = await this.entityRepository.findById(Uuid.create(query.entityId));
    if (!entity) throw new EntityNotFoundException(query.entityId);
    return EntityMapper.toDetailDto(entity);
  }
}
```

**Why throw not return null**: Query handler fails with exception if entity not found. Caller gets 404.

---

## Paginated Query Handler

```typescript
@QueryHandler(GetEntitiesPaginatedQuery)
export class GetEntitiesPaginatedHandler implements IQueryHandler<GetEntitiesPaginatedQuery, EntityListResponse> {
  async execute(query: GetEntitiesPaginatedQuery): Promise<EntityListResponse> {
    const result = await this.entityRepository.findPaginated({
      page: query.page,
      limit: query.limit,
      status: query.status,
      search: query.search,
    });

    return {
      data: result.data.map(EntityMapper.toResponse),
      meta: {
        total: result.total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(result.total / query.limit),
      },
    };
  }
}
```

**Why separate meta**: Pagination metadata helps client render pagination UI.

---

## Query Handler with Relations

```typescript
async execute(query: GetEntityByIdQuery): Promise<EntityDetailDto> {
  const entity = await this.entityRepository.findByIdWithRelations(
    Uuid.create(query.entityId),
    ['addresses', 'subEntities', 'documents'],
  );
  if (!entity) throw new EntityNotFoundException(query.entityId);
  return EntityMapper.toDetailDto(entity);
}
```

**Why relations parameter**: Not all queries need all relations. Detail view needs more than list view.

---

## Module Registration

```typescript
export const QueryHandlers = [
  GetEntityByIdHandler,
  GetEntitiesPaginatedHandler,
  GetEntitiesFilteredHandler,
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
[ ] Handlers are thin delegation to repository + mapper
[ ] EntityNotFoundException thrown when entity missing
[ ] Pagination returns { data, meta } structure
[ ] Relations loaded only when needed for view
[ ] Functions stay under 30 lines
```