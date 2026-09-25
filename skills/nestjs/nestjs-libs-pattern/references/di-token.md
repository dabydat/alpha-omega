# DI Token Pattern

```typescript
// libs/oauth/src/constants/oauth-token.constant.ts
export const OAUTH_TOKEN = Symbol('OAUTH_TOKEN');

// Usage
@Injectable()
export class SomeService {
  constructor(
    @Inject(OAUTH_TOKEN)
    private readonly oauthService: OAuthService,
  ) {}
}
```

**Why Symbol**: Unique identifier. Can't be accidentally duplicated. Compare: `Symbol('X') !== Symbol('X')`.

---

## Quality Checklist

```
[ ] DI tokens use Symbol
[ ] Injected via @Inject(token)
```
