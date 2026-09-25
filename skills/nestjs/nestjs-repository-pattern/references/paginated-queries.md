# Paginated Queries

Lists should always be paginated. Never return all records.

---

## Paginated Find

```typescript
interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

interface FindPaginatedParams {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}

async findPaginated(params: FindPaginatedParams): Promise<PaginatedResult<Entity>> {
  const { page, limit, status, search } = params;
  const skip = (page - 1) * limit;  // Calculate offset

  const whereCondition: any = {};
  if (status) whereCondition.status = status;
  if (search) whereCondition.name = Like(`%${search}%`);  // Partial match

  const [entities, total] = await this.repo.findAndCount({
    where: whereCondition,
    skip,
    take: limit,
    order: { createdAt: 'DESC' },
    relations: ['addresses'],
  });

  return { data: entities.map(EntityMapper.toDomain), total, page, limit };
}
```

**Why `findAndCount`**: Gets data and total count in one query. Efficient for pagination.

**Why `Like('%search%')`**: Search is partial match. `search = 'john'` matches `'John Doe'`.

**Why `skip/take`**: Standard pagination. Page 1 = skip 0, take limit. Page 2 = skip limit, take limit.

---

## Quality Checklist

```
[ ] List queries paginated (findAndCount)
[ ] Search via LIKE
[ ] skip/take pagination
```
