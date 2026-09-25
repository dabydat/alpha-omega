# Barrel Export (Public API)

Export all public members from one place for clean imports.

---

## index.ts

```typescript
// libs/oauth/src/index.ts
// Modules
export * from './oauth.module';
export * from './oauth-core.module';

// Services
export * from './services/authentication.service';
export * from './services/api.services';

// Guards
export * from './guards/auth.guard';
export * from './guards/roles.guard';

// Decorators
export * from './decorators/user-details.decorator';

// Exceptions
export * from './exceptions/oauth.exception';
export * from './exceptions/invalid-credentials.exception';
export * from './exceptions/access-denied.exception';

// Interfaces
export * from './interfaces/oauth-options';
export * from './interfaces/oauth-options-factory';
export * from './interfaces/oauth-async-options';
```

**Why barrel export**: Consumer imports from one place. Internal file structure can change without affecting consumers.

---

## Quality Checklist

```
[ ] index.ts exports public API
[ ] Consumers import from one place
```
