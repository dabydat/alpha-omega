# Enum Mapping

Domain enums and persistence enums may differ. Mapper translates between them.

---

## Enum Mapping

```typescript
// Domain enum
export enum EntityType { INDIVIDUAL = 'INDIVIDUAL', LEGAL_ENTITY = 'LEGAL_ENTITY' }

// Persistence enum (database stores strings)
export enum EntityTypeEnum { INDIVIDUAL = 'INDIVIDUAL', LEGAL_ENTITY = 'LEGAL_ENTITY' }

// Mapper handles conversion
public static toEntityPersistence(model: Entity): EntityPersistence {
  const typeMap = {
    [EntityType.INDIVIDUAL]: EntityTypeEnum.INDIVIDUAL,
    [EntityType.LEGAL_ENTITY]: EntityTypeEnum.LEGAL_ENTITY,
  };
  return new EntityPersistence({ type: typeMap[model.type] ?? undefined });
}
```

**Why map manually**: Explicit is better than implicit. You see exactly which enums map to which.

**Why `?? undefined`**: Handle null case gracefully.

---

## Quality Checklist

```
[ ] Enums mapped explicitly
[ ] typeMap for domain↔persistence
[ ] ?? undefined for null cases
```
