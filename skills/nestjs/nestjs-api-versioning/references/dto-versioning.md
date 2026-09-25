# DTO Versioning

Version-specific DTOs let the API evolve independently of the domain. v2 splits a field, renames another and adds a new one — without breaking v1 clients.

---

## Request DTO V1 vs V2

```typescript
// V1
export class CreateUserRequestV1 {
  @ApiProperty()
  @IsString()
  name: string;  // Single name field

  @ApiProperty()
  @IsEmail()
  emailAddress: string;  // v1 name
}

// V2
export class CreateUserRequestV2 {
  @ApiProperty()
  @IsString()
  firstName: string;  // Split name

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;  // Renamed
}
```

---

## Response DTO V1 vs V2

```typescript
// V1
export class UserResponseV1 {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  emailAddress: string;
}

// V2
export class UserResponseV2 {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  phone?: string;  // New field
}
```

---

## Quality Checklist

```
[ ] Version-specific DTOs (V1, V2)
[ ] Breaking changes go in a new version
[ ] Additive changes (new optional field) don't need a new version
```
