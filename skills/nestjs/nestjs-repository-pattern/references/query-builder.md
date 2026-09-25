# Complex Queries (Query Builder)

For queries with dynamic conditions, use QueryBuilder.

---

## Dynamic Query Building

```typescript
async findByCriteria(criteria: EntityCriteria): Promise<Entity[]> {
  const queryBuilder = this.repo.createQueryBuilder('entity')
    .leftJoinAndSelect('entity.addresses', 'address')
    .leftJoinAndSelect('entity.subEntities', 'subEntity')
    .where('entity.status = :status', { status: criteria.status });

  if (criteria.type) { queryBuilder.andWhere('entity.type = :type', { type: criteria.type }); }
  if (criteria.createdAfter) { queryBuilder.andWhere('entity.createdAt >= :createdAfter', { createdAfter: criteria.createdAfter }); }
  if (criteria.search) { queryBuilder.andWhere('entity.name LIKE :search', { search: `%${criteria.search}%` }); }

  queryBuilder.orderBy('entity.createdAt', 'DESC');

  return queryBuilder.getMany();
}
```

**Why QueryBuilder over repository methods**: Dynamic WHERE clauses, complex joins, conditional logic.

**Why always `.getMany()` not `.getOne()`**: Finder returns list, use `.getOne()` only when looking for single by unique constraint.

---

## Quality Checklist

```
[ ] Dynamic WHERE via QueryBuilder
[ ] Joins for relations
[ ] getMany() for lists
```
