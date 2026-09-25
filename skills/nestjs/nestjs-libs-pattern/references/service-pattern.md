# Service Pattern

## Service with Configuration

```typescript
// libs/oauth/src/services/authentication.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { OAuthOptions } from '../interfaces/oauth-options';
import { OAUTH_OPTIONS } from '../constants';

@Injectable()
export class OAuthService {
  constructor(
    @Inject(OAUTH_OPTIONS)
    private readonly options: OAuthOptions,
  ) {}

  async validateToken(token: string): Promise<User> {
    const response = await fetch(`${this.options.baseUrl}/validate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    });

    if (!response.ok) { throw new OAuthException('Token validation failed'); }
    return response.json();
  }
}
```

---

## Quality Checklist

```
[ ] Service injected with options
[ ] Options read from injected config
[ ] Errors wrapped in typed exceptions
```
