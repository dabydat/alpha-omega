# Domain ↔ Persistence Mapping

## Domain to Persistence

```typescript
public static toEntityPersistence(model: Entity): EntityPersistence {
  const primitives: EntityPrimitives = model.toPrimitives();

  return new EntityPersistence({
    id: primitives.id,
    userId: primitives.userId,
    name: primitives.name,
    email: primitives.email,
    phoneCountry: primitives.phoneCountry,
    phoneNumber: primitives.phoneNumber,
    type: primitives.type,
    status: primitives.status,
    // Date conversion for database
    createdAt: primitives.createdAt ? new Date(primitives.createdAt) : undefined,
    updatedAt: primitives.updatedAt ? new Date(primitives.updatedAt) : undefined,
    // Nested objects need their own mapper
    addresses: primitives.addresses?.map(addr =>
      new AddressPersistence({
        id: addr.id,
        entityId: addr.entityId,
        street: addr.street,
        city: addr.city,
        state: addr.state,
        country: addr.country,
        zipCode: addr.zipCode,
        type: addr.type,
      })
    ),
  });
}
```

**Why `new Date(primitives.createdAt)`**: Domain uses string ISO format; database needs Date object. Mapper translates.

**Why nested mappers**: Each nested object needs its own transformation. `AddressPersistence` cannot be constructed by `EntityMapper` alone.

---

## Persistence to Domain

```typescript
public static toDomain(entity: EntityPersistence): Entity {
  const id = Uuid.create(entity.id);
  const userId = Uuid.create(entity.userId);

  // Reconstruct nested objects
  const addresses = entity.addresses?.map(addr =>
    Address.create(
      Uuid.create(addr.id),
      Uuid.create(addr.entityId),
      addr.street,
      addr.city,
      addr.state,
      addr.country,
      addr.zipCode,
      addr.type,
    )
  ) || [];

  return Entity.create(
    id,
    userId,
    Name.create(entity.name),
    Email.create(entity.email),
    FullPhoneNumber.create(entity.phoneCountry, entity.phoneNumber),
    entity.type,
    entity.status,
    addresses,
  );
}
```

**Why `create()` factory methods**: VOs validate on creation. `Email.create(entity.email)` will throw if invalid.

**Why `|| []` for arrays**: Handle null/undefined gracefully. No addresses = empty array, not null.

---

## Quality Checklist

```
[ ] Domain → persistence converts VOs to primitives + dates
[ ] Persistence → domain reconstructs VOs via factories
[ ] Nested objects have their own mapper
```
