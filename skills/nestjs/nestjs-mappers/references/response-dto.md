# Response DTO Transformation

## toResponse — lightweight for lists

```typescript
public static toResponse(model: Entity): EntityResponse {
  return {
    id: primitives.id,
    name: primitives.name,
    email: primitives.email,
    status: primitives.status,
    createdAt: primitives.createdAt,
  };
}
```

## toDetailDto — rich for single entity view

```typescript
public static toDetailDto(model: Entity): EntityDetailDto {
  return {
    id: primitives.id,
    name: primitives.name,
    email: primitives.email,
    // Transformed fields
    phone: {
      country: primitives.phoneCountry,
      number: primitives.phoneNumber,
    },
    // Nested arrays
    addresses: primitives.addresses?.map(addr => ({
      id: addr.id,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      country: addr.country,
      zipCode: addr.zipCode,
      type: addr.type,
    })),
    // Metadata
    createdAt: primitives.createdAt,
    updatedAt: primitives.updatedAt,
  };
}
```

**Why two methods**:
- `toResponse`: Lightweight, for list endpoints. Client doesn't need all fields.
- `toDetailDto`: Rich, for single entity view. Full details needed.

**Why transform nested structures**: API response structure often differs from internal structure. Phone as `{country, number}` instead of separate fields.

---

## Quality Checklist

```
[ ] toResponse lightweight for lists
[ ] toDetailDto rich for detail
[ ] Nested structures transformed for API
```
