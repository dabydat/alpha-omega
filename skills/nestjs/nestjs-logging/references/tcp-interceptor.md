# TCP Microservice — Correlation ID Interceptor

Interceptor extracts or generates the correlation ID from the message payload.

---

## CorrelationIdInterceptor (TCP)

```typescript
@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const packet = context.getArgByIndex(0);
    const correlationId = packet.correlationId || uuid();

    packet.correlationId = correlationId;

    return next.handle().pipe(
      tap({
        next: (response) => {
          this.logger.info('RPC handled', { correlationId });
          if (response) response.correlationId = correlationId;
        },
        error: (error) => {
          this.logger.error('RPC failed', { correlationId, error: error.message });
        },
      }),
    );
  }
}
```

---

## HTTP vs TCP comparison

| Aspect | HTTP | TCP |
|--------|------|-----|
| Correlation ID source | Header `x-correlation-id` | Message payload field |
| Generation | Middleware | Interceptor |
| Propagation via | Response header | Reply payload |

---

## Quality Checklist

```
[ ] TCP messages have correlationId field in payload
[ ] ID attached before handler runs
[ ] Reply payload carries correlationId
```
