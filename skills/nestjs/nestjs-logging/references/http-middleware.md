# HTTP Gateway — Correlation ID Middleware

Middleware extracts or generates the correlation ID before the handler runs.

---

## CorrelationIdMiddleware

```typescript
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const correlationId = (req.headers['x-correlation-id'] as string) || uuid();
    req['correlationId'] = correlationId;
    res.setHeader('x-correlation-id', correlationId);
    next();
  }
}
```

**Why set response header**: Propagates the correlation ID back to the client.

---

## Quality Checklist

```
[ ] HTTP requests have x-correlation-id header (generated or passed)
[ ] Response includes correlationId header
[ ] ID attached to request context
```
