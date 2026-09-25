# Constants Anti-Patterns

These are the common mistakes that make constants a maintenance burden instead of a source of truth.

---

## ❌ String literals instead of constants

```typescript
// BAD
@MessagePattern('entity.create')
async createEntity(payload: any) { ... }

// GOOD
@MessagePattern(EntityControllerMap.CREATE_ENTITY.MESSAGE_PATTERN)
async createEntity(payload: any) { ... }
```

---

## ❌ Constants not exported from index

```typescript
// BAD: Constants scattered
import { AUTHENTICATION_TOKEN } from './oauth-token';  // One file
import { AUTHENTICATION_MODULE_TOKEN } from './oauth-module-token';  // Another

// GOOD: Single barrel export
import { OAUTH_TOKEN, OAUTH_MODULE_TOKEN } from './constants';
```

---

## ❌ No separation between domain and infrastructure constants

```typescript
// BAD: Everything in one folder
constants/
  ├── auth.constant.ts  # Contains both domain (routes) and infra (topics)

// GOOD: Separate by layer
domain/constants/
  └── authentication.constant.ts  # Routes, patterns
infrastructure/constants/
  └── topic.constant.ts  # Kafka topics, client tokens
```

---

## ❌ Mutable constants

```typescript
// BAD: Not readonly
export const EntityRoutes = {
  CREATE: '/entity',  // Can be reassigned
};

// GOOD: Frozen
export const EntityRoutes = {
  CREATE: '/entity',
} as const;
```

---

## ❌ Inconsistent naming

```typescript
// BAD: Mixed conventions
export const AuthenticationRoutes = { ... }
export enum merchantMessagePatterns { ... }  // lowercase enum
export const client_constants = { ... }  // snake_case

// GOOD: Consistent
export const AuthenticationRoutes = { ... }
export enum AuthenticationMessagePatterns { ... }
export const ClientConstant = { ... }
```

---

## Quality Checklist

```
[ ] No string literals for cross-service values
[ ] Barrel export for constants
[ ] Domain/infra constants separated
[ ] Constants frozen (as const)
[ ] Consistent naming
```
