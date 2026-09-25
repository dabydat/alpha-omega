# Resource Server Token Validation

Resource servers (REST APIs) validate tokens issued by the auth service using JWKS or introspection.

---

## JWT Validation with JWKS

```typescript
// Resource server validates using shared JWKS
import * as jose from 'jose';

@Injectable()
export class TokenValidationService {
  private jwks: jose.JWTVerifyGetKey;

  async onModuleInit() {
    // Fetch JWKS from auth service
    const jwksUri = 'https://auth.example.com/.well-known/jwks.json';
    this.jwks = jose.createRemoteJWKSet(new URL(jwksUri));
  }

  async validateToken(token: string): Promise<UserPayload> {
    const { payload } = await jose.jwtVerify(token, this.jwks, {
      issuer: 'https://auth.example.com',
      audience: 'resource-server-id',
    });
    return payload as UserPayload;
  }
}
```

---

## Auth Guard for Resource Servers

```typescript
// Resource server guard
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private tokenValidationService: TokenValidationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.slice(7);

    if (!token) throw new UnauthorizedException('Missing token');

    try {
      const payload = await this.tokenValidationService.validateToken(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
```

---

## Token Introspection (Alternative)

For opaque tokens or when JWKS is not available:

```typescript
// Resource server calls auth service to introspect token
@Injectable()
export class TokenIntrospectionService {
  constructor(private httpService: HttpService) {}

  async introspect(token: string): Promise<IntrospectionResult> {
    const response = await this.httpService.post('/oauth/introspect', null, {
      headers: { Authorization: `Bearer ${token}` },
      data: { token },
    }).toPromise();
    return response.data;
  }
}
```

---

## JWT vs Introspection Comparison

| Approach | Use Case | Tradeoff |
|---------|---------|----------|
| **JWT validation** | Stateless, high throughput | Token contents visible, no revocation |
| **Introspection** | Revocable tokens, admin operations | Extra network call, auth service bottleneck |

---

## Validation in Auth Service (Self)

```typescript
// In AuthGuard - validates tokens at the auth service itself
async canActivate(context: ExecutionContext): Promise<boolean> {
  const token = context.switchToHttp().getRequest().headers.authorization?.slice(7);

  if (!token) throw new UnauthorizedException('Missing Authorization header');

  try {
    const { payload } = await jose.jwtVerify(token, jwks, {
      issuer: 'https://auth.example.com',
      audience: 'my-app',
    });
    context.switchToHttp().getRequest().user = payload;
    return true;
  } catch {
    throw new UnauthorizedException('Invalid token');
  }
}
```

---

## Correlation ID with Token Validation

When auth service validates on behalf of resource servers:

```typescript
// Correlation ID middleware
@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const correlationId = request.headers['x-correlation-id'] || uuid();

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`[${correlationId}] Request completed`);
      }),
      header('x-correlation-id', correlationId)
    );
  }
}
```

**Flow**: Client -> Resource Server (with correlation ID) -> Auth Service (reads correlation ID) -> Resource Server (propagates back).

---

## Quality Checklist

```
[ ] JWKS fetched on module init
[ ] Issuer and audience validated
[ ] Expired tokens rejected
[ ] Invalid signatures rejected
[ ] Correlation ID propagated to auth service
[ ] /introspect endpoint available for opaque tokens
```