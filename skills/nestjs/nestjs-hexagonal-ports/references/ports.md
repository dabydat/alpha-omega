# Ports (Interfaces)

Port is an interface that defines what domain needs. Defined in domain layer, no infrastructure imports.

---

## Logger Port

**Why it exists**: Domain needs to log. Without port, domain depends on specific logger (Winston, Pino, console).

```typescript
// Domain layer defines what it needs
export const LOGGER_PORT = Symbol('LOGGER_PORT');

// Interface - domain declares capability it needs
export interface LoggerPort {
  info(message: string, meta?: object): void;
  error(message: string, meta?: object): void;
  warn(message: string, meta?: object): void;
  debug(message: string, meta?: object): void;
  verbose(message: string, meta?: object): void;
}
```

**Why separate methods**: Not all environments support all levels. Keep common set.

**Why `meta?: object`**: Structured logging. Attach context (userId, requestId) as object, not string concatenation.

---

## Cache Port

**Why it exists**: Domain may want caching without knowing Redis/Memcached/etc.

```typescript
export const CACHE_PROVIDER_PORT = Symbol('CACHE_PROVIDER_PORT');

export interface CacheProviderPort {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  deletePattern(pattern: string): Promise<void>;  // For cache invalidation
}
```

**Why `deletePattern`**: Cache invalidation by pattern. When entity updated, invalidate all `entity:*` keys.

---

## Publisher Port (Events)

**Why it exists**: Domain publishes events without knowing Kafka/RabbitMQ/Redis.

```typescript
export const PUBLISHER_PORT = Symbol('PUBLISHER_PORT');

export interface PublisherPort {
  publish(topic: string, key: string, message: object): Promise<void>;
  publishBatch(topic: string, messages: Array<{ key: string; value: object }>): Promise<void>;
}
```

**Why `publishBatch`**: Efficient for bulk publishing. Reduces network round trips.

---

## Configuration Port

**Why it exists**: Domain needs configuration without reading env vars directly.

```typescript
export const CONFIGURATION_PORT = Symbol('CONFIGURATION_PORT');

export interface ConfigurationPort {
  get<T>(key: string): T | undefined;        // Returns undefined if missing
  getOrThrow<T>(key: string): T;             // Throws if missing
  getAll(): Record<string, unknown>;
}
```

**Why `getOrThrow`**: Required config should fail fast if missing. Better than undefined at runtime.

---

## Email Port

**Why it exists**: Domain sends emails without knowing SMTP/SendGrid/SES.

```typescript
export const EMAIL_PORT = Symbol('EMAIL_PORT');

export interface EmailPort {
  send(to: string, subject: string, body: string): Promise<void>;
  sendTemplate(to: string, templateId: string, data: object): Promise<void>;
}
```

**Why templates**: Email content often managed externally (SendGrid templates, etc.). Port supports both raw and template.

---

## Quality Checklist

```
[ ] Port in domain layer, no infra imports
[ ] Port name = Capability + PORT
[ ] Port describes capability, not mechanism
```
