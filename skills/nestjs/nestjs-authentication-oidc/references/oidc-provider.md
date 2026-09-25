# OIDC Provider Service

OIDC Provider handles the authorization server functionality - token issuance, userinfo endpoints, and discovery documents.

---

## Provider Setup

```typescript
// apps/authentication/src/oauth/infrastructure/oidc/oidc-provider.service.ts
import { Injectable } from '@nestjs/common';
import { Provider } from 'oidc-provider';

@Injectable()
export class OidcProviderService {
  public oidc: Provider;

  constructor() {
    this.oidc = new Provider('https://auth.example.com', {
      pkce: { methods: ['S256'], required: true },
      clients: [{
        client_id: 'my-app',
        client_secret: 'secret',
        redirect_uris: ['https://myapp.com/callback'],
        grant_types: ['authorization_code'],
        response_types: ['code'],
      }],
    });
  }
}
```

---

## OIDC Endpoints

The provider automatically handles:

| Endpoint | Purpose |
|---------|---------|
| `/authorize` | Authorization code flow entry |
| `/token` | Token exchange |
| `/userinfo` | Get user claims |
| `/.well-known/openid-configuration` | Discovery document |
| `/logout` | Session termination |

---

## OIDC Controller

```typescript
@Controller('oidc')
export class OidcController {
  @Post('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null;
    if (token) await this.oidcProviderService.logout(token);
    res.status(200).json({ message: 'Session termination processed.' });
  }

  @All('/*')
  async mountedOidc(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.oidcProviderService.oidc.callback()(req, res);
  }
}
```

**Why `All('/*')`**: OIDC provider handles standard endpoints (/authorize, /token, /.well-known).

---

## Custom UserInfo Endpoint

```typescript
// In OidcController @All('/*')
if (req.url === '/me' && req.method === 'GET') {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;

  if (!token) {
    res.status(401).json({ error: 'invalid_token' });
    return;
  }

  const tokenRecord = await this.oidcProviderService.oidc.AccessToken.adapter.find(token);
  if (!tokenRecord) {
    res.status(401).json({ error: 'invalid_token' });
    return;
  }

  const account = await this.accountDetailService.findAccount({} as any, tokenRecord.accountId);
  res.json(account.claims('userinfo', tokenRecord.scope || '', {}, []));
}
```

---

## Discovery Document

```typescript
@Get('/.well-known/openid-configuration')
async getConfiguration() {
  return this.oidcProviderService.oidc.metadata;
}
```

Clients use discovery to auto-configure without hardcoding endpoints.

---

## Quality Checklist

```
[ ] PKCE required for all clients
[ ] Client redirect_uris whitelist enforced
[ ] JWKS endpoint available at /.well-known/jwks.json
[ ] Discovery document at /.well-known/openid-configuration
[ ] /logout endpoint invalidates tokens
[ ] /me endpoint returns user claims
```