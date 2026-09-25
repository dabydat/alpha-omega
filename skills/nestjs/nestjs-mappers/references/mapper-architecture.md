# Mapper Architecture

The mapper has three transformations: domain → persistence, persistence → domain, domain → response DTO.

---

## The Three Transformations

```typescript
// 1. Domain → Persistence (for saving)
public static toEntityPersistence(model: Entity): EntityPersistence {
  const primitives = model.toPrimitives();
  return new EntityPersistence({
    id: primitives.id,        // Domain VO → primitive
    userId: primitives.userId,
    name: primitives.name,
    email: primitives.email,  // Value objects become strings
    phoneCountry: primitives.phoneCountry,
    phoneNumber: primitives.phoneNumber,
    // ...
  });
}

// 2. Persistence → Domain (for loading)
public static toDomain(entity: EntityPersistence): Entity {
  // Primitives → VOs
  const id = Uuid.create(entity.id);
  const email = Email.create(entity.email);
  return Entity.create(
    id,
    entity.userId,
    Name.create(entity.name),
    email,
    FullPhoneNumber.create(entity.phoneCountry, entity.phoneNumber),
  );
}

// 3. Domain → Response DTO (for API)
public static toResponse(model: Entity): EntityResponse {
  const primitives = model.toPrimitives();
  return {
    id: primitives.id,
    name: primitives.name,
    // Only expose what client needs
  };
}
```

**Why three methods**: Different directions, different transformations. `toDomain` reconstructs VOs; `toResponse` flattens for API.

---

## Quality Checklist

```
[ ] toEntityPersistence (domain → persistence)
[ ] toDomain (persistence → domain)
[ ] toResponse/toDetailDto (domain → DTO)
```
