# Query Definition

Query is a data class implementing `IQuery`. Contains parameters for read operation.

---

## Query Classes

```typescript
import { IQuery } from '@nestjs/cqrs';

export class GetEntityByIdQuery implements IQuery {
  constructor(
    public readonly entityId: string,
    public readonly userId?: string,
  ) {}
}

export class GetEntitiesPaginatedQuery implements IQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly status?: string,
    public readonly search?: string,
  ) {}
}
```

**Why `IQuery` marker**: CommandBus/QueryBus dispatch based on this interface.

---

## Quality Checklist

```
[ ] Query implements IQuery
[ ] Params for read operation only
[ ] Defaults for pagination
```
