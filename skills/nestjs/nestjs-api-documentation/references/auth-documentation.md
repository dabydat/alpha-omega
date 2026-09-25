# Authentication Documentation

Protected endpoints must be documented so clients know what to send and what auth is required. Document the bearer scheme, the protected endpoints, and role-based access.

---

## Bearer Auth Setup

```typescript
const config = new DocumentBuilder()
  .setTitle('API')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter your JWT token',
    },
    'access-token',
  )
  .build();
```

**Why the second argument (`'access-token'`)**: Names the security scheme so `@ApiBearerAuth('access-token')` can reference it.

---

## Protecting Endpoints

```typescript
@Post()
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
async createPayment(@Body() body: CreatePaymentDto) { ... }
```

**Why `@ApiBearerAuth` + `@ApiUnauthorizedResponse`**: Marks the endpoint as protected and documents the 401 case.

---

## Role-Based Auth

```typescript
@Post(':id/approve')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Not authorized to approve payments' })
@ApiRoles('ADMIN', 'APPROVER')
async approvePayment(@Param('id') id: string) { ... }
```

**Why `@ApiForbiddenResponse`**: Documents the 403 when the user lacks the required role.

---

## Quality Checklist

```
[ ] DocumentBuilder.addBearerAuth() registers the scheme
[ ] Protected endpoints annotated with @ApiBearerAuth
[ ] @ApiUnauthorizedResponse on auth-protected endpoints
[ ] @ApiForbiddenResponse on role-protected endpoints
[ ] @ApiRoles documents the required roles
```
