# Custom Decorators

Decorators extract or attach data to request/response in a reusable way. See `references/custom-decorators.md` for full patterns.

---

## User Details Decorator

```typescript
export const UserDetails = createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

async createEntity(
  @Body() body: CreateEntityRequest,
  @UserDetails() user: UserPayload,
): Promise<CreateEntityResponse> {
  // user.userId available
}
```

---

## Current User ID Decorator

```typescript
export const CurrentUserId = createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user?.userId || request.user?.sub;
});
```

**Why two fallbacks**: JWT standard uses `sub` claim. Your system might use `userId`.

---

## Common Decorators

| Decorator | Extracts | Use Case |
|-----------|----------|----------|
| `@UserDetails()` | Full user object | User context in handlers |
| `@CurrentUserId()` | User ID only | Simpler when ID needed |
| `@CurrentCorrelationId()` | Correlation ID | Distributed tracing |
| `@Roles('ADMIN')` | Role metadata | Authorization |

---

## Param Decorator Pattern

```typescript
export const CurrentCorrelationId = createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.correlationId || null;
});

export const CurrentTenantId = createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.tenantId || null;
});
```

---

## Quality Checklist

```
[ ] @UserDetails() extracts full user from request
[ ] @CurrentUserId() handles both userId and sub claims
[ ] Decorators handle missing user gracefully (null/undefined)
[ ] Decorators are used in controllers, not raw request.user access
```