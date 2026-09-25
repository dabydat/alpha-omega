# Exception Filter Logging

Errors must log context before responding.

---

## GlobalExceptionFilter

```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const correlationId = request['correlationId'];
    const userId = request.user?.userId;
    const { method, url } = request;

    let status: number;
    let message: string;
    let code: string;
    let stack: string | undefined;

    if (exception instanceof DomainException) {
      status = 409; message = exception.message; code = exception.code;
    } else if (exception instanceof ValidationException) {
      status = 400; message = 'Validation failed'; code = 'VALIDATION_ERROR';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus(); message = exception.getResponse() as string; code = 'HTTP_EXCEPTION';
    } else if (exception instanceof Error) {
      status = 500; message = exception.message; code = 'INTERNAL_ERROR'; stack = exception.stack;
    } else {
      status = 500; message = 'Internal server error'; code = 'UNKNOWN_ERROR'; stack = exception instanceof Error ? exception.stack : String(exception);
    }

    this.logger.error(message, { correlationId, userId, method, url, code, stack });

    response.status(status).json({ statusCode: status, error: code, message, correlationId, timestamp: new Date().toISOString() });
  }
}
```

**Why log before response**: If you throw after logging, log line may not reach remote system.

---

## Quality Checklist

```
[ ] All exception types handled
[ ] Logs include stack trace for 5xx
[ ] Logs include correlationId
```
