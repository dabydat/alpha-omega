# Nested Entity Mapping

When an aggregate has related entities (1:1 or 1:N), mapper handles the full graph.

---

## toDomainWithRelations

```typescript
public static toDomainWithRelations(entity: EntityPersistence): Entity {
  const domain = EntityMapper.toDomain(entity);

  // Load individual entity if exists
  if (entity.individual) {
    domain.setIndividual(IndividualMapper.toDomain(entity.individual));
  }

  // Load legal entity if exists
  if (entity.legalEntity) {
    domain.setLegalEntity(LegalEntityMapper.toDomain(entity.legalEntity));
  }

  return domain;
}
```

**Why separate method**: `toDomain` might be called without relations (performance). `toDomainWithRelations` when you need the full graph.

**Why `setIndividual()` on domain**: Aggregate controls its own state. Mapper tells aggregate to set related entity.

---

## Quality Checklist

```
[ ] Relations loaded via toDomainWithRelations
[ ] Aggregate controls its own state
[ ] Separate method for full graph
```
