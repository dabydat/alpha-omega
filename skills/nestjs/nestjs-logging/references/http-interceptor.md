# HTTP Gateway — Logging Interceptor

Interceptor logs method, URL, status, and duration after the handler completes.

---

## LoggingInterceptor

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, correlationId } = request;
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const duration = Date.now() - start;
          this.logger.info(`${method} ${url} ${response.statusCode} - ${duration}ms`, {
            correlationId, method, url, duration, statusCode: response.statusCode,
          });
        },
        error: (error) => {
          this.logger.error(`${method} ${url} - ${error.message}`, {
            correlationId, method, url, stack: error.stack,
          });
        },
      }),
    );
  }
}
```

**Why tap not map**: Logging happens on both success and error. tap observes but doesn't modify.

---

## Quality Checklist

```
[ ] LoggingInterceptor logs method, URL, status, duration
[ ] CorrelationIdInterceptor sets ID before handler runs
```
