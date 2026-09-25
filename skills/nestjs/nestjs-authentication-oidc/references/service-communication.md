# Service Communication Patterns

Auth services communicate with resource servers via TCP or REST, with correlation ID propagation for distributed tracing.

---

## TCP vs REST for Auth Services

### TCP (Message-based)

```typescript
// Auth service publishes events, resource servers subscribe
@MessagePattern('auth.token.validated')
async handleTokenValidation(data: TokenValidationDto) {
  // Process token validation request
  return { userId: data.userId, valid: true };
}
```

### REST (HTTP)

```typescript
// Resource server calls auth service
@Injectable()
export class AuthClient {
  async validateToken(token: string): Promise<boolean> {
    const response = await this.httpService.get('/auth/validate', {
      headers: { Authorization: `Bearer ${token}` },
    }).toPromise();
    return response.data.valid;
  }
}
```

---

## Communication Pattern Comparison

| Aspect | TCP | REST |
|--------|-----|------|
| Latency | Lower | Higher |
| Client support | NestJS microservices only | Any HTTP client |
| Type safety | MessagePattern decorators | DTOs |
| Retry logic | Built-in via broker | Manual |

---

## Correlation ID Propagation

When auth service validates tokens on behalf of resource servers, correlation ID maintains context:

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

---

## Full Distributed Flow

```
Client Request
  | (with x-correlation-id: abc-123)
  v
Resource Server (BFF)
  | (correlation ID in header)
  v
Auth Service (TCP call)
  | (correlation ID in message payload)
  v
  Log: [abc-123] Token validated for user xyz
  |
  v (correlation ID in response payload)
Resource Server
  |
  v (correlation ID in response header)
Client Response
  | (with x-correlation-id: abc-123)
```

---

## Service-to-Service Authentication

### Client Credentials Flow (Service -> Service)

```typescript
// Service authenticates as itself
async getServiceToken(): Promise<string> {
  const response = await this.httpService.post('/oauth/token', null, {
    data: {
      grant_type: 'client_credentials',
      client_id: process.env.SERVICE_CLIENT_ID,
      client_secret: process.env.SERVICE_CLIENT_SECRET,
    },
  }).toPromise();
  return response.data.access_token;
}
```

### mTLS (Mutual TLS)

For high-security service communication:

```typescript
// Both sides verify certificates
https://auth.example.com
  - Server certificate verified by client
  - Client certificate verified by server
```

---

## Token Propagation

When resource server calls auth service:

```typescript
// Resource server forwards original token
@Injectable()
export class AuthClient {
  async validateToken(token: string): Promise<boolean> {
    const response = await this.httpService.post('/auth/validate', null, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-correlation-id': getCorrelationId(),
      },
      data: { token },
    }).toPromise();
    return response.data.valid;
  }
}
```

---

## Quality Checklist

```
[ ] TCP uses @MessagePattern for type safety
[ ] REST uses ClientProxy or HttpService
[ ] Correlation ID propagated through all calls
[ ] Service credentials use client_credentials flow
[ ] Tokens forwarded to auth service when validating
[ ] Timeout configured for service calls (5s default)
```