# Exception Pattern

```typescript
// libs/oauth/src/exceptions/oauth.exception.ts
export class OAuthException extends Error {
  constructor(message: string, code: string = 'OAUTH_ERROR') {
    super(message);
    this.name = 'OAuthException';
  }
}

export class InvalidCredentialsException extends OAuthException {
  constructor() { super('Invalid credentials', 'INVALID_CREDENTIALS'); }
}

export class AccessDeniedException extends OAuthException {
  constructor() { super('Access denied', 'ACCESS_DENIED'); }
}
```

---

## Quality Checklist

```
[ ] Base exception class
[ ] Specific exceptions extend base
[ ] Machine-readable code
```
