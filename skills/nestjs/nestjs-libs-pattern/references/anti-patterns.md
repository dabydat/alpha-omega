# Libs Anti-Patterns

These are the common mistakes in shared libraries.

---

## ❌ Circular dependencies between libs

```typescript
// BAD: lib-a imports from lib-b, lib-b imports from lib-a
// libs/a/src/services/a.service.ts
import { something } from '@app/lib-b';
// libs/b/src/services/b.service.ts
import { something } from '@app/lib-a';
```

**Why it's bad**: Circular deps break DI, cause runtime errors, impossible to test.

**Fix**: Create a third lib with shared interfaces. Or restructure to avoid circular dependency.

---

## ❌ Global modules for everything

```typescript
// BAD: Everything is global
@Global()
@Module({ providers: [ServiceA, ServiceB, ServiceC, ServiceD], exports: [ServiceA, ServiceB, ServiceC, ServiceD] })
export class AllTheThingsModule {}
```

**Why it's bad**: Pollutes global namespace. Hard to track what's available. Implicit dependencies.

**Fix**: Only use `@Global()` for truly cross-cutting concerns (auth, logging). Others should be imported explicitly.

---

## ❌ No interface for library public API

```typescript
// BAD: Public API is concrete class
export class OAuthService { ... }
// GOOD: Public API is interface
export interface OAuthServicePort { ... }
export class OAuthServiceImpl implements OAuthServicePort { ... }
```

**Why it's good**: Consumers depend on abstraction. Can swap implementation without changing consumer code.

---

## ❌ Changing lib API without versioning

```typescript
// BAD: Breaking change with no version bump
// GOOD: Semantic versioning
// v1.x: stable API
// v2.x: breaking changes
```

**Why it's good**: Consumers can pin to version. Breaking changes are predictable.

---

## Quality Checklist

```
[ ] No circular deps between libs
[ ] @Global() only for cross-cutting
[ ] Public API is interface
[ ] Semantic versioning
```
