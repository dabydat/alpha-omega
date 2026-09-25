# Query Response DTOs

DTOs define what clients receive. Separate from domain models. See `references/response-dtos.md` for full patterns.

---

## Response Types

```typescript
// Simple response — for list endpoints
export interface EntityResponse {
  id: string;
  name: string;
  email: string;
  status: string;
}

// Detail response — for single entity view
export interface EntityDetailDto {
  id: string;
  name: string;
  email: string;
  phone: { country: string; number: string };
  addresses: AddressDto[];
  subEntities: SubEntityDto[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Paginated response — for list endpoints with pagination
export interface EntityListResponse {
  data: EntityResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

**Why three types**: Different views need different data. List doesn't need addresses; detail does.

---

## Why Flattened Structures

```typescript
// API structure differs from internal structure
phone: { country: string; number: string }  // Client expects this
// vs internal
Phone { country: Country; number: PhoneNumber }  // Domain VO
```

Client structure flattened for JSON serialization. Mapper handles transformation.

---

## Mapper Pattern

```typescript
export class EntityMapper {
  static toResponse(entity: Entity): EntityResponse {
    return {
      id: entity.id.value,
      name: entity.name.value,
      email: entity.email.value,
      status: entity.status,
    };
  }

  static toDetailDto(entity: Entity): EntityDetailDto {
    return {
      id: entity.id.value,
      name: entity.name.value,
      email: entity.email.value,
      phone: { country: entity.phone.country, number: entity.phone.number },
      addresses: entity.addresses.map(a => ({ street: a.street, city: a.city })),
      subEntities: entity.subEntities.map(s => ({ id: s.id.value, name: s.name.value })),
      status: entity.status,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
```

**Why mapper in handler**: Query handler transforms domain to DTO. Response shape is query responsibility.

---

## Search and Count Responses

```typescript
// Search response
export class SearchEntitiesHandler implements IQueryHandler<SearchEntitiesQuery, EntityListResponse> {
  async execute(query: SearchEntitiesQuery): Promise<EntityListResponse> {
    const results = await this.entityRepository.search({ term: query.searchTerm, page: query.page, limit: query.limit });
    return { data: results.data.map(EntityMapper.toResponse), meta: results.meta };
  }
}

// Count response
export class CountEntitiesHandler implements IQueryHandler<CountEntitiesQuery, number> {
  async execute(query: CountEntitiesQuery): Promise<number> {
    return this.entityRepository.count(query.filters);
  }
}
```

**Why count separate from list**: Efficient count without fetching data.

---

## Quality Checklist

```
[ ] EntityResponse for list endpoints (lightweight)
[ ] EntityDetailDto for single entity view (rich)
[ ] EntityListResponse includes meta pagination data
[ ] Mappers handle domain-to-DTO transformation
[ ] Internal VOs flattened for JSON serialization
```