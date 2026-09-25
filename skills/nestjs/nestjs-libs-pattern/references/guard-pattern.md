# Guard Pattern

## Auth Guard

```typescript
// libs/oauth/src/guards/auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { OAuthService } from '../services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly oauthService: OAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    try {
      const token = authHeader.slice(7);
      request.user = await this.oauthService.validateToken(token);
      return true;
    } catch (error) { throw new UnauthorizedException('Invalid token'); }
  }
}
```

---

## Quality Checklist

```
[ ] Guard validates token via service
[ ] Attaches user to request
[ ] Throws UnauthorizedException on failure
```
