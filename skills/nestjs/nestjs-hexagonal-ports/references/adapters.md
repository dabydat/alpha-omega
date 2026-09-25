# Adapters (Implementations)

Adapter implements a port. Lives in infrastructure layer. Each external dependency gets an adapter.

---

## Logger Adapter (Console)

**Why console adapter**: Simple for development. Can swap for Winston/Pino in production.

```typescript
@Injectable()
export class LoggerAdapter implements LoggerPort {
  private readonly logger = console;

  info(message: string, meta?: object): void { this.logger.log(`[INFO] ${message}`, meta || {}); }
  error(message: string, meta?: object): void { this.logger.error(`[ERROR] ${message}`, meta || {}); }
  warn(message: string, meta?: object): void { this.logger.warn(`[WARN] ${message}`, meta || {}); }
  debug(message: string, meta?: object): void { this.logger.debug(`[DEBUG] ${message}`, meta || {}); }
  verbose(message: string, meta?: object): void { this.logger.log(`[VERBOSE] ${message}`, meta || {}); }
}
```

**Why add prefixes**: Distinguish log levels in console output. Makes parsing easier.

---

## Cache Adapter (Redis)

**Why Redis**: Fast, persistent cache. Key-value with TTL support.

```typescript
@Injectable()
export class CacheProviderAdapter implements CacheProviderPort {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });
  }

  async get<T>(key: string): Promise<T | null> { const value = await this.redis.get(key); return value ? JSON.parse(value) : null; }
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttl) { await this.redis.setex(key, ttl, serialized); } else { await this.redis.set(key, serialized); }
  }
  async delete(key: string): Promise<void> { await this.redis.del(key); }
  async deletePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) { await this.redis.del(...keys); }
  }
}
```

**Why JSON serialize**: Redis stores strings. Objects must be serialized.

---

## Kafka Publisher Adapter

**Why Kafka**: Event streaming, durable, multiple consumers per topic.

```typescript
@Injectable()
export class KafkaPublisherAdapter implements PublisherPort {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({ clientId: 'entity-service', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });
    this.producer = this.kafka.producer();
    this.producer.connect();
  }

  async publish(topic: string, key: string, message: object): Promise<void> {
    await this.producer.send({ topic, messages: [{ key, value: JSON.stringify(message) }] });
  }

  async publishBatch(topic: string, messages: Array<{ key: string; value: object }>): Promise<void> {
    await this.producer.send({ topic, messages: messages.map(m => ({ key: m.key, value: JSON.stringify(m.value) })) });
  }
}
```

**Why JSON stringify**: Kafka messages are bytes. JSON serialization converts objects.

---

## Quality Checklist

```
[ ] Adapter in infrastructure layer
[ ] One adapter per port
[ ] Adapter translates, doesn't decide
```
