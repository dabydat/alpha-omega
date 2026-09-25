# Interceptors

Interceptors wrap the handler. They can transform request before it reaches handler, or response after handler completes.

---

## Logging Interceptor

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject(LOGGER_PORT) private readonly logger: LoggerPort) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const duration = Date.now() - now;
        this.logger.info(`${method} ${url} ${statusCode} - ${duration}ms`, { method, url, statusCode, duration });
      }),
    );
  }
}
```

**Why tap not map**: Logging happens on both success and error. tap observes but doesn't modify.

---

## Transform Interceptor

```typescript
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, SuccessResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResponse<T>> {
    return next.handle().pipe(
      map((data) => ({ success: true, data, timestamp: new Date().toISOString() })),
    );
  }
}
```

---

## Quality Checklist

```
[ ] LoggingInterceptor logs method, URL, status, duration
[ ] TransformInterceptor wraps responses in { success, data, timestamp }
```
