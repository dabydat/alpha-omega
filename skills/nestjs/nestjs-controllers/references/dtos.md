# Request and Response DTOs

DTOs separate API contracts from internal models. See `references/dtos.md` for full patterns.

---

## Request DTOs

**Why separate DTOs**:
1. **Validation at boundary**: class-validator runs before handler executes
2. **Documentation**: Swagger decorators generate OpenAPI spec automatically
3. **Isolation**: Internal model changes don't leak to API contract
4. **Clear contract**: Frontend devs know exactly what to send

---

## Request DTO with Validation

```typescript
export class CreateEntityRequest {
  @ApiProperty({ description: 'Unique identifier for the entity' })
  @IsString()
  @IsUUID()
  aggregateId: string;

  @ApiProperty({ description: 'Entity name' })
  @IsString()
  @Min(1)
  @Max(255)
  name: string;

  @ApiProperty({ description: 'Contact email' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string;
}

export class GetEntitiesRequest {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
```

**Why `@IsOptional()` with defaults**: Makes validation predictable, clients can send partial payloads.

---

## Response DTOs

```typescript
export class EntityResponse {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() email: string;
  @ApiProperty() status: string;
  @ApiProperty() createdAt: string;
}

export class EntityListResponse {
  @ApiProperty({ type: [EntityResponse] })
  data: EntityResponse[];

  @ApiProperty()
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

**Why separate response DTOs**:
1. Hide internal structure from clients
2. API can evolve independently from domain
3. Response DTOs can exclude heavy fields

---

## Controller Constants

```typescript
export const EntityControllerMap = {
  CREATE_ENTITY: {
    MESSAGE_PATTERN: 'entity.create',
    ROUTE: '/entity',
  },
  GET_ENTITY_BY_ID: {
    MESSAGE_PATTERN: 'entity.get.by.id',
    ROUTE: '/entity/:id',
  },
} as const;

export const EntityControllerTag = 'Entity';
```

**Why use `as const`**: Makes object fully readonly at TypeScript level.

---

## Quality Checklist

```
[ ] Request DTOs use class-validator decorators
[ ] Swagger @ApiProperty decorators on all fields
[ ] Response DTOs separate from domain models
[ ] Controller constants use as const
[ ] Pagination capped at 100 to prevent abuse
```