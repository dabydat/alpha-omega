# Logger Port

The app uses a `LoggerPort` interface, not Winston directly. This keeps the logger swappable.

---

## LoggerPort Interface

```typescript
// LoggerPort interface (what your app uses)
export const LOGGER_PORT = Symbol('LOGGER_PORT');

interface LogContext {
  correlationId?: string;
  userId?: string;
  service: string;
  environment: string;
}
```

**Why a port**: Decouples the app from Winston. Swap the implementation without changing consumers.

---

## Quality Checklist

```
[ ] LoggerPort injected, not Winston directly
[ ] LogContext includes correlationId, userId, service, environment
[ ] Sensitive fields masked
```
