# Why Constants Matter

Constants are the connective tissue of a microservices architecture. They provide single sources of truth for routes, message patterns, injection tokens, and topic names. Without consistent constants, services become tightly coupled and difficult to maintain.

---

## Problem Without Constants

```typescript
// ❌ BAD: Hardcoded strings scattered everywhere
@MessagePattern('entity.create')  // What if we change the pattern?
client.send('entity.get.by.id', payload)  // Typo not caught
@Inject('AUTHENTICATION_CLIENT')  // String can be misspelled
```

**Why it's bad**:
- Typos not caught at compile time
- No single source of truth — changing a pattern requires hunting everywhere
- No discoverability — can't find all usages easily
- Coupling across services via string literals

---

## Solution With Constants

```typescript
// ✅ GOOD: Constants as single source of truth
export const EntityControllerMap = {
  CREATE_ENTITY: {
    MESSAGE_PATTERN: 'entity.create',  // One place to change
    ROUTE: '/entity',
  },
};

// Type-safe usage
@MessagePattern(EntityControllerMap.CREATE_ENTITY.MESSAGE_PATTERN)
async createEntity(payload: CreateEntityRequest) { ... }
```

**Why it's good**:
- Compile-time checking
- Change in one place propagates everywhere
- IntelliSense for available patterns
- Refactoring support

---

## Quality Checklist

```
[ ] Every cross-service string is a constant
[ ] No hardcoded message patterns / tokens / routes
[ ] Constants are the single source of truth
```
