# Why Shared Libraries

Shared libraries reduce duplication across services. Each lib is a self-contained NestJS module with its own structure, providing consistent functionality to multiple microservices.

---

## Problem Without Shared Libraries

```typescript
// ❌ BAD: Duplicated code across services
// service-a/src/services/auth.service.ts
export class AuthService { async validateToken(token: string) { ... } }

// service-b/src/services/auth.service.ts
export class AuthService {  // Duplicate!
  async validateToken(token: string) { ... }
}
```

**Why it's bad**:
- Code duplication across services
- Bug fixes require changing multiple places
- Inconsistent behavior between services
- No single source of truth

---

## Solution With Shared Libraries

```typescript
// ✅ GOOD: Single library used by all services
// libs/oauth/src/services/auth.service.ts
@Injectable()
export class OAuthService { async validateToken(token: string) { ... } }

// Both services import from shared lib
import { OAuthService } from '@app/oauth';
```

**Why it's good**:
- Single source of truth
- Bug fix in one place propagates everywhere
- Consistent behavior
- Easier testing (mock one lib, not duplicated code)

---

## Quality Checklist

```
[ ] Code shared via libs, not duplicated
[ ] Bug fix in one place propagates
[ ] Consistent behavior across services
```
