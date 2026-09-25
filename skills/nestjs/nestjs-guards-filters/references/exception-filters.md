# Exception Filters

Filters catch exceptions and transform them into HTTP responses.

---

## Global Exception Filter (7-Case Normalization)

```typescript
@Catch()
export class RpcGlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToRpc();
    let response: RpcExceptionResponse;

    if (exception instanceof DomainException) {
      response = { message: exception.message, status: 409, details: exception.details };
    } else if (exception instanceof ValueObjectException) {
      response = { message: exception.message, status: 400 };
    } else if (exception instanceof HttpException) {
      const httpResponse = exception.getResponse();
      response = { message: typeof httpResponse === 'string' ? httpResponse : httpResponse.message, status: exception.getStatus() };
    } else if (exception instanceof AxiosError) {
      response = { message: 'External service error', status: 502, details: exception.response?.data };
    } else if (typeof exception === 'string') {
      response = { message: exception, status: 500 };
    } else if (exception instanceof Error) {
      response = { message: exception.message, status: 500 };
    } else {
      response = { message: 'Internal server error', status: 500 };
    }

    ctx.setResponse(response);
  }
}
```

**Why 7 cases**: All exception types must be handled. Unknown exceptions become 500, not unhandled crashes.

**Why DomainException = 409**: Business rule violation is a conflict, not bad request.

---

## Domain Exception Filter (REST)

```typescript
@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  constructor(@Inject(LOGGER_PORT) private readonly logger: LoggerPort) {}

  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    this.logger.warn(`Domain exception: ${exception.message}`, { code: exception.code, path: request.url });

    response.status(422).json({
      statusCode: 422, error: 'Unprocessable Entity', code: exception.code,
      message: exception.message, timestamp: new Date().toISOString(), path: request.url,
    });
  }
}
```

**Why 422, not 400**: 422 = "I understood your request, but the data is semantically invalid."

---

## Validation Exception Filter

```typescript
@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST, error: 'Bad Request', code: 'VALIDATION_ERROR',
      message: 'Validation failed', errors: exception.errors, timestamp: new Date().toISOString(),
    });
  }
}
```

---

## Quality Checklist

```
[ ] RpcGlobalExceptionFilter handles all 7 exception cases
[ ] DomainException -> 409 (conflict)
[ ] HttpException -> preserves status
[ ] Unknown -> 500 with logged stack trace
```
