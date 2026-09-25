# Domain Exceptions

Domain exceptions represent business rule violations, not technical errors.

---

## Exception Hierarchy

```typescript
export abstract class DomainException extends Error {
  constructor(
    public readonly message: string,
    public readonly exceptionName: string,
    public readonly details?: any,
  ) {
    super(message);
  }
}

export class EntityNotFoundException extends DomainException {
  constructor(entityName: string, entityId: string) {
    super(`${entityName} with ID ${entityId} not found`, 'ENTITY_NOT_FOUND', { entityId });
  }
}

export class InsufficientBalanceException extends DomainException {
  constructor() {
    super('Account balance is insufficient for this operation', 'INSUFFICIENT_BALANCE');
  }
}

export class DuplicateEntityException extends DomainException {
  constructor(entityName: string, field: string, value: string) {
    super(`${entityName} with ${field} '${value}' already exists`, 'DUPLICATE_ENTITY', { field, value });
  }
}
```

---

## Global Exception Filter

```typescript
@Catch()
export class RpcGlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToRpc();
    let response: RpcExceptionResponse;

    if (exception instanceof DomainException) {
      response = { message: exception.message, exceptionName: exception.exceptionName, status: 409, details: exception.details };
    } else if (exception instanceof HttpException) {
      response = { message: exception.message, exceptionName: exception.name, status: exception.getStatus() };
    } else {
      response = { message: 'Internal server error', exceptionName: 'INTERNAL_ERROR', status: 500 };
    }

    ctx.setResponse(response);
  }
}
```

---

## Quality Checklist

```
[ ] Hierarchy: DomainException base
[ ] Machine-readable code + human-readable message
[ ] Global filter normalizes all exceptions
```
