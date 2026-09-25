# Controller Anti-Patterns

These are the common mistakes that turn controllers into thick, untestable logic. Each shows the INCORRECT pattern and why it's bad.

---

## ❌ Business logic in controllers

```typescript
// BAD — logic should be in handler/aggregate
@Post('/entity')
async createEntity(@Body() body: CreateEntityRequest) {
  const exists = await this.repo.findByEmail(body.email);
  if (exists) throw new BadRequestException();
  const entity = new Entity(body.name, body.email);
  await this.repo.save(entity);
  return entity;
}
```

**Why it's bad**: Cannot test logic in isolation, cannot reuse across controllers, violates single responsibility.

---

## ❌ Direct repository access from controllers

```typescript
// BAD — controller should not access repository
@Post('/entity')
async createEntity(@Body() body: CreateEntityRequest) {
  const repo = this.entityRepository;
}
```

**Why it's bad**: Bypasses CQRS, business logic scattered, no audit trail via events.

---

## ❌ Missing user context on protected endpoints

```typescript
// BAD — user context should be injected
@Post('/entity')
async createEntity(@Body() body: CreateEntityRequest) {
  // No userId — how do you know who created it?
}
```

**Why it's bad**: No audit trail, no authorization, security hole.

---

## ❌ Returning domain models directly

```typescript
// BAD — expose internal structure
@Post('/entity')
async createEntity(@Body() body: CreateEntityRequest): Promise<Entity> {
  return this.entityRepository.save(body);
}
```

**Why it's bad**: Leaks internal structure, clients depend on domain, impossible to refactor domain without breaking API.

---

## Quality Checklist

```
[ ] No business logic in controllers
[ ] No direct repository access
[ ] User context injected on protected endpoints
[ ] Returns DTOs, not domain models
```
