# Testing Rules

> All code must be tested before merging. Tests are first-class citizens, not afterthoughts.

## Test Pyramid

```
         [E2E: 5-10%]          ← few, slow, critical user paths
        [Integration: 20-30%]  ← moderate, real dependencies
       [Unit: 60-70%]          ← many, fast, pure functions
```

## What to Test at Each Level

### Unit Tests
**Test:** Pure functions, business logic, data transformations
**Don't test:** Framework internals, third-party libraries, simple getters
**Rules:**
- No network calls, no DB calls, no file system
- One assertion concept per test
- Test behavior, not implementation

### Integration Tests
**Test:** Database access, external API calls (sandbox), queue processing
**Rules:**
- Use real test database (not mocks) — mocks hide migration bugs
- Use sandbox/test credentials for external APIs
- Reset state between tests
- Test both success path AND error paths

### E2E Tests
**Test:** Full user journeys from browser to DB and back
**Critical paths:**
- Happy path: landing → form → payment → delivery
- Payment failure: card declined → error → retry
- Mobile viewport: all E2E must pass at 375px width

## Security Tests (mandatory before launch)

```typescript
// 1. Webhook signature verification
test('rejects webhook with invalid signature', async () => {
  const response = await post('/api/webhook', payload, { 'X-Signature': 'invalid' });
  expect(response.status).toBe(400);
});

// 2. Idempotency check
test('processes duplicate webhook only once', async () => {
  await post('/api/webhook', validPayload, headers);
  await post('/api/webhook', validPayload, headers);
  expect(await orderCount()).toBe(1);
});

// 3. Auth protection
test('returns 401 for protected endpoint without token', async () => {
  const response = await get('/api/admin/orders');
  expect(response.status).toBe(401);
});
```

## Test File Organization
```
tests/
  Unit/
    Services/
      PriceCalculatorTest.ts
    Models/
      UserTest.ts
  Integration/
    Api/
      OrdersApiTest.ts
  E2E/
    CheckoutFlowTest.ts
```

## Coverage Requirements

| Type | Minimum |
|------|---------|
| Business logic | 90% |
| API handlers | 80% |
| Overall | 80% |

## Launch Sign-off Checklist
```
✅ All P0/P1 bugs resolved
✅ E2E passing (payment happy path)
✅ Security tests passing
✅ Performance within budget
✅ Error handling: graceful at every step
```

## Test Naming Convention
```
test_[expected_behavior]_when_[condition]
```

## Anti-Patterns
- Never skip tests for business logic
- Never use mocks when real DB would catch bugs
- Never approve PR with coverage < 80%
- Never leave failed tests in suite