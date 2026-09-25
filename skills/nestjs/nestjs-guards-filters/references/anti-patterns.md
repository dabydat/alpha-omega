# Guards/Filters Anti-Patterns

These are the common mistakes in guards and filters.

---

## ❌ Business logic in guards

```typescript
// INCORRECT
canActivate(context: ExecutionContext): boolean {
  const entity = this.entityRepo.findById(id);
  if (!entity.hasPermission(user)) throw new Forbidden();
  return true;
}
```

**Fix**: Guard only checks credentials. Domain enforces permissions.

---

## ❌ Catching all exceptions in handler

```typescript
// INCORRECT - try/catch in handler
async createEntity(@Body() body) {
  try {
    return await this.commandBus.execute(new CreateEntityCommand(body));
  } catch (e) {
    if (e instanceof EntityNotFoundException) throw new NotFoundException(e.message);
  }
}
```

**Fix**: Exception filter handles it globally.

---

## ❌ No error logging

```typescript
// INCORRECT - silent failure
catch(exception: unknown) {
  throw new HttpException('Error', 500);
}
```

**Fix**: Always log errors with context (request URL, user ID, stack trace for 5xx).

---

## Quality Checklist

```
[ ] Guards only check credentials
[ ] Exceptions handled by filters, not try/catch in handler
[ ] Errors logged with context
```
