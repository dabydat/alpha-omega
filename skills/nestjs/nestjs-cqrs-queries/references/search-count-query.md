# Search and Count Queries

Search returns a paginated list; count returns a single number. Keep count separate from list for efficiency.

---

## Search Query Handler

```typescript
export class SearchEntitiesQuery implements IQuery {
  constructor(
    public readonly searchTerm: string,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}

@QueryHandler(SearchEntitiesQuery)
export class SearchEntitiesHandler implements IQueryHandler<SearchEntitiesQuery, EntityListResponse> {
  async execute(query: SearchEntitiesQuery): Promise<EntityListResponse> {
    const results = await this.entityRepository.search({ term: query.searchTerm, page: query.page, limit: query.limit });
    return { data: results.data.map(EntityMapper.toResponse), meta: results.meta };
  }
}
```

---

## Count Query Handler

```typescript
export class CountEntitiesQuery implements IQuery {
  constructor(
    public readonly filters?: { status?: string; type?: string },
  ) {}
}

@QueryHandler(CountEntitiesQuery)
export class CountEntitiesHandler implements IQueryHandler<CountEntitiesQuery, number> {
  async execute(query: CountEntitiesQuery): Promise<number> {
    return this.entityRepository.count(query.filters);
  }
}
```

**Why count separate from list**: Efficient count query without fetching data. `SELECT COUNT(*) WHERE ...`

---

## Quality Checklist

```
[ ] Search paginated
[ ] Count returns a number, not data
```
