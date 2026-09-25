# Correlation ID Pattern

Correlation ID links logs across services. A single user action generates logs in multiple services; correlation ID lets you trace the full flow.

---

## Core Concept

```
Request A (correlationId: abc-123)
  -> Service B logs: { message: "Order created", correlationId: "abc-123" }
    -> Service C logs: { message: "Payment processed", correlationId: "abc-123" }
      -> Service D logs: { message: "Notification sent", correlationId: "abc-123" }
```

**Rules**:
1. Incoming request has `x-correlation-id` header? Use it. Otherwise generate UUID.
2. Attach to request context (request object for HTTP, message payload for TCP).
3. All log calls include it automatically via AsyncLocalStorage or manual propagation.
4. Propagate to outgoing requests (HTTP headers, message headers).

---

## CorrelationIdPort Interface

```typescript
export const CORRELATION_ID_PORT = Symbol('CORRELATION_ID_PORT');

export interface CorrelationIdPort {
  get(): string;
  set(id: string): void;
  generate(): string;
  getOrGenerate(): string;
}
```

---

## CorrelationIdService Implementation

```typescript
@Injectable()
export class CorrelationIdService implements CorrelationIdPort {
  private correlationId: string;

  static readonly HEADER_NAME = 'x-correlation-id';

  constructor() {}

  get(): string {
    return this.correlationId;
  }

  set(id: string): void {
    this.correlationId = id;
  }

  generate(): string {
    return uuidv4();
  }

  getOrGenerate(): string {
    return this.correlationId || this.generate();
  }
}
```

---

## HTTP Middleware Pattern

```typescript
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private readonly correlationIdService: CorrelationIdService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const incomingId = req.headers[CorrelationIdService.HEADER_NAME] as string;
    const correlationId = incomingId || this.correlationIdService.generate();

    this.correlationIdService.set(correlationId);
    (req as any).correlationId = correlationId;
    res.setHeader(CorrelationIdService.HEADER_NAME, correlationId);

    next();
  }
}
```

**Usage**:
```typescript
// In your HTTP controller
const correlationId = req.correlationId;
// or via decorator
@CurrentCorrelationId() correlationId: string
```

---

## TCP Interceptor Pattern

```typescript
@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  constructor(private readonly correlationIdService: CorrelationIdService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcContext = context.switchToRpc();
    const data = rpcContext.getData();
    const headers = rpcContext.getContext();

    const incomingId = headers?.correlationId || data?.correlationId;
    const correlationId = incomingId || this.correlationIdService.generate();

    this.correlationIdService.set(correlationId);

    if (data && typeof data === 'object') {
      (data as any).correlationId = correlationId;
    }

    return next.handle().pipe(
      tap({
        next: (response) => {
          if (response && typeof response === 'object') {
            (response as any).correlationId = correlationId;
          }
        },
      }),
    );
  }
}
```

---

## Decorator for Extraction

```typescript
export const CurrentCorrelationId = createParamDecorator(
  (data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.correlationId || null;
  },
);

export const CurrentUserId = createParamDecorator(
  (data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.userId || null;
  },
);
```

---

## Propagation to Downstream Services

### HTTP Client

```typescript
@Injectable()
export class HttpClientService {
  constructor(
    private readonly httpService: HttpService,
    private readonly correlationIdService: CorrelationIdService,
  ) {}

  async get<T>(url: string): Promise<T> {
    const correlationId = this.correlationIdService.get();

    return this.httpService.get(url, {
      headers: {
        [CorrelationIdService.HEADER_NAME]: correlationId,
      },
    }).toPromise();
  }
}
```

### Message Broker (Kafka/RabbitMQ)

```typescript
@Injectable()
export class MessageProducer {
  constructor(
    private readonly client: ClientKafka,
    private readonly correlationIdService: CorrelationIdService,
  ) {}

  async emit(topic: string, message: any): Promise<void> {
    const correlationId = this.correlationIdService.get();

    this.client.emit(topic, {
      ...message,
      correlationId,
      timestamp: new Date().toISOString(),
    });
  }
}
```

---

## AsyncLocalStorage Pattern (Optional Advanced)

For automatic propagation without explicit passing:

```typescript
import { AsyncLocalStorage } from 'async_hooks';

const correlationIdStorage = new AsyncLocalStorage<string>();

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const correlationId = (req.headers['x-correlation-id'] as string) || uuid();

    correlationIdStorage.run(correlationId, () => {
      (req as any).correlationId = correlationId;
      res.setHeader('x-correlation-id', correlationId);
      next();
    });
  }
}

// In any service, get current correlation ID
const correlationId = correlationIdStorage.getStore();
```

---

## Module Registration

```typescript
@Module({
  providers: [
    CorrelationIdService,
    CorrelationIdMiddleware,
    CorrelationIdInterceptor,
  ],
  exports: [CorrelationIdService],
})
export class CorrelationIdModule {}
```

---

## HTTP vs TCP Comparison

| Aspect | HTTP | TCP |
|--------|------|-----|
| Correlation ID source | Header `x-correlation-id` | Message payload field `correlationId` |
| Generation | Middleware (before handler) | Interceptor (around handler) |
| Propagation via | Response header | Reply payload |
| Access in handler | `req.correlationId` | `context.getArgByIndex(0).correlationId` |

---

## Quality Checklist

```
[ ] HTTP middleware generates correlation ID if not present in request
[ ] HTTP middleware propagates correlation ID in response header
[ ] TCP interceptor extracts correlation ID from message payload
[ ] TCP interceptor attaches correlation ID to response payload
[ ] All log statements include correlationId field
[ ] Downstream HTTP calls propagate correlation ID via header
[ ] Message producers attach correlation ID to outgoing messages
```