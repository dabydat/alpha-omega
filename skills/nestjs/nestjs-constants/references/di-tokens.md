# Dependency Injection Tokens

Use `Symbol` for DI tokens so they cannot be accidentally duplicated. Module tokens reference the module itself (for async options factories).

---

## Module Tokens (Dependency Injection)

```typescript
// libs/oauth/src/constants/oauth-token.constant.ts
export const OAUTH_TOKEN = Symbol('OAUTH_TOKEN');

// libs/storage_cdn/src/constants/storage-token.constant.ts
export const STORAGE_TOKEN = Symbol('STORAGE_TOKEN');
```

**Why Symbol over string**: Symbols are unique. `Symbol('TOKEN') !== Symbol('TOKEN')`. Prevents accidental collisions.

---

## Usage

```typescript
// Module definition
@Module({
  providers: [
    { provide: OAUTH_TOKEN, useClass: OAuthService },
  ],
})
export class OAuthModule {}

// Injection
constructor(@Inject(OAUTH_TOKEN) private readonly oauthService: OAuthService) {}
```

---

## Module Module Tokens (Inner Module Reference)

```typescript
// libs/oauth/src/constants/oauth-module-token.constant.ts
export const OAUTH_MODULE_TOKEN = Symbol('OAUTH_MODULE_TOKEN');
```

---

## Quality Checklist

```
[ ] DI tokens use Symbol, not string
[ ] Token names end with _TOKEN
[ ] Module tokens for async options factories
```
