# Log Levels Configuration

Configure log levels per environment, understand when to use each level, and implement sampling for high-volume scenarios.

---

## Log Level Decision Table

| Level | When to Use | Example |
|-------|-------------|---------|
| debug | Development only, tracing execution flow | Entering handler, args received, result returned |
| info | Significant business events | Order created, payment processed, user logged in |
| warn | Unexpected but handled situations | Retry attempted, cache miss, fallback triggered |
| error | Operation failed but service continues | External API timeout, validation failure, DB connection error |
| critical | Service cannot continue | Out of memory, disk full, fatal initialization failure |

---

## Per-Environment Configuration

### Development

```bash
LOG_LEVEL=debug
LOG_SAMPLE_RATE=1.0
```

```typescript
const config = { level: 'debug', sampling: false, prettyPrint: true };
```

**Goal**: Maximum detail for local debugging.

### Staging

```bash
LOG_LEVEL=info
LOG_SAMPLE_RATE=0.5
```

```typescript
const config = { level: 'info', sampling: true, prettyPrint: false, format: 'json' };
```

**Goal**: Significant events, 50% sampling for high-volume operations.

### Production

```bash
LOG_LEVEL=warn
LOG_SAMPLE_RATE=0.1
```

```typescript
const config = { level: 'warn', sampling: true, format: 'json', transports: ['cloudwatch', 'datadog'] };
```

**Goal**: Only warnings and errors. 10% sampling for info messages to reduce volume.

---

## Sampling Strategy

High-volume services (order processing, event handlers) can sample to reduce log volume while keeping statistical visibility.

### Token Bucket Sampling

```typescript
@Injectable()
export class SamplingLoggerService implements LoggerPort {
  private sampleRate: number;
  private tokens: number;
  private maxTokens: number;
  private refillRate: number;
  private lastRefill: number;

  constructor(
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
  ) {
    this.sampleRate = parseFloat(process.env.LOG_SAMPLE_RATE || '1.0');
    this.maxTokens = 100;
    this.tokens = this.maxTokens;
    this.refillRate = 10;
    this.lastRefill = Date.now();
  }

  private consumeToken(): boolean {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
    if (this.tokens >= 1) { this.tokens--; return true; }
    return false;
  }

  info(message: string, context?: Record<string, any>): void {
    if (this.sampleRate >= 1.0 || Math.random() < this.sampleRate) {
      this.logger.info(message, { sampled: this.sampleRate < 1.0, ...context });
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    if (process.env.NODE_ENV === 'development') { this.logger.debug(message, context); }
  }

  warn(message: string, context?: Record<string, any>): void {
    this.logger.warn(message, { sampled: false, ...context });
  }

  error(message: string, context?: Record<string, any>): void {
    this.logger.error(message, { sampled: false, ...context });
  }
}
```

**Why token bucket**: Prevents burst of logs while maintaining minimum sampling rate.

---

## Environment Variables

```bash
# .env.development
LOG_LEVEL=debug
LOG_SAMPLE_RATE=1.0
NODE_ENV=development

# .env.staging
LOG_LEVEL=info
LOG_SAMPLE_RATE=0.5
NODE_ENV=staging

# .env.production
LOG_LEVEL=warn
LOG_SAMPLE_RATE=0.1
NODE_ENV=production
```

---

## Performance Considerations

| Scenario | Log Level | Volume Impact |
|----------|-----------|---------------|
| Request/response | info | High |
| Command handling | debug | Medium |
| Query execution | debug | High |
| External API calls | debug | Medium |
| Domain events | debug | High |
| Exceptions | error | Low |

---

## Quick Reference

| Environment | Level | Sampling | Format |
|-------------|-------|----------|--------|
| development | debug | none | pretty |
| staging | info | 50% | json |
| production | warn | 10% | json |

**Never sample error and critical**: Always log these levels regardless of sample rate.

---

## Quality Checklist

```
[ ] Level set per environment (debug/info/warn)
[ ] Production uses warn + JSON
[ ] Sampling only for info, never for error/critical
[ ] Sensitive fields masked
```
