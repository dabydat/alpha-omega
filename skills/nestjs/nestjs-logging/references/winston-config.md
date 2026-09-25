# Winston Logger Configuration

Winston is the standard logger for NestJS. This guide covers module setup, service implementation, and transport configuration.

---

## LoggerPort Interface

Define what your application code uses (port pattern from hexagonal architecture).

```typescript
export const LOGGER_PORT = Symbol('LOGGER_PORT');

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export interface LogContext {
  correlationId?: string;
  userId?: string;
  tenantId?: string;
  service: string;
  version?: string;
  environment: string;
}

export interface HttpLogContext extends LogContext {
  method: string;
  url: string;
  statusCode?: number;
  duration?: number;
  userAgent?: string;
  ip?: string;
}

export interface RpcLogContext extends LogContext {
  pattern: string;
  handler: string;
  duration?: number;
}
```

---

## LoggerModule Configuration

```typescript
import { Module, Global } from '@nestjs/common';
import { WinstonModule, WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import { LoggerPort } from '../../ports/logger.port';
import { WinstonLoggerService } from '../services/winston-logger.service';

const WINSTON_MODULE_OPTIONS = 'WINSTON_MODULE_OPTIONS';

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      providers: [
        {
          provide: WINSTON_MODULE_OPTIONS,
          useFactory: (): WinstonModuleOptions => {
            const service = process.env.SERVICE_NAME || 'unknown-service';
            const environment = process.env.NODE_ENV || 'development';

            return {
              transports: [
                new winston.transports.Console({
                  format: winston.format.combine(
                    winston.format.timestamp(),
                    environment === 'production'
                      ? winston.format.json()
                      : winston.format.combine(
                          winston.format.colorize(),
                          winston.format.printf(({ level, message, timestamp, ...meta }) => {
                            const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
                            return `[${timestamp}] ${level}: ${message} ${metaStr}`.trim();
                          }),
                        ),
                  ),
                }),
                ...(process.env.LOG_FILE_PATH
                  ? [
                      new winston.transports.File({
                        filename: process.env.LOG_FILE_PATH,
                        format: winston.format.combine(
                          winston.format.timestamp(),
                          winston.format.json(),
                        ),
                        maxsize: 5242880,
                        maxFiles: 5,
                      }),
                    ]
                  : []),
              ],
              level: process.env.LOG_LEVEL || 'info',
              defaultMeta: {
                service,
                version: process.env.SERVICE_VERSION || '1.0.0',
                environment,
              },
            };
          },
        }),
      ],
    }),
  ],
  providers: [
    { provide: LOGGER_PORT, useClass: WinstonLoggerService },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
  exports: [WINSTON_MODULE_OPTIONS, LOGGER_PORT],
})
export class LoggerModule {}
```

**Why production uses JSON**: Searchable logs in Datadog, CloudWatch, Elasticsearch.

**Why development uses pretty print**: Human-readable for debugging.

---

## WinstonLoggerService Implementation

```typescript
@Injectable()
export class WinstonLoggerService implements LoggerPort {
  private readonly logger: winston.Logger;

  constructor(@Inject(WINSTON_MODULE_OPTIONS) private readonly options: WinstonModuleOptions) {
    this.logger = winston.createLogger(options as winston.LoggerOptions);
  }

  debug(message: string, context?: Record<string, any>): void {
    this.logger.debug(this.format(message), this.mergeContext(context));
  }

  info(message: string, context?: Record<string, any>): void {
    this.logger.info(this.format(message), this.mergeContext(context));
  }

  warn(message: string, context?: Record<string, any>): void {
    this.logger.warn(this.format(message), this.mergeContext(context));
  }

  error(message: string, context?: Record<string, any>): void {
    this.logger.error(this.format(message), this.mergeContext(context));
  }

  critical(message: string, context?: Record<string, any>): void {
    this.logger.log('critical', this.format(message), this.mergeContext(context));
  }

  private format(message: string): string {
    return message;
  }

  private mergeContext(context?: Record<string, any>): Record<string, any> {
    return {
      ...this.options.defaultMeta,
      ...context,
      timestamp: new Date().toISOString(),
    };
  }
}
```

---

## Log Levels by Environment

```typescript
const logLevels: Record<string, string> = {
  development: 'debug',
  staging: 'info',
  production: 'warn',       // Reduce noise, log only important events
  performance: 'error',     // Only errors and critical for high-volume services
};
```

---

## Transport Patterns

### Console Transport (Development)

```typescript
new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
  level: 'debug',
})
```

### File Transport (Staging)

```typescript
new winston.transports.File({
  filename: '/var/log/app.log',
  format: winston.format.json(),
  maxsize: 5242880,   // 5MB
  maxFiles: 10,
  tailable: true,
})
```

### Remote Transport (Production - CloudWatch Example)

```typescript
import { CloudWatchTransport } from 'winston-cloudwatch';

new CloudWatchTransport({
  logGroupName: process.env.CLOUDWATCH_GROUP,
  logStreamName: `${process.env.SERVICE_NAME}/${process.env.NODE_ENV}`,
  awsRegion: process.env.AWS_REGION,
  messageFormatter: (level, message, meta) =>
    `[${level}] ${message} ${JSON.stringify(meta)}`,
})
```

---

## Service Metadata

Every log includes default metadata:

```typescript
defaultMeta: {
  service: process.env.SERVICE_NAME,
  version: process.env.SERVICE_VERSION || '1.0.0',
  environment: process.env.NODE_ENV,
  deploymentId: process.env.DEPLOYMENT_ID,
}
```

**Why include version**: Helps identify which version introduced a log line.

---

## Masking Sensitive Data

```typescript
const maskFields = ['password', 'token', 'secret', 'creditCard', 'cvv'];

function maskSensitive(obj: Record<string, any>): Record<string, any> {
  const masked = { ...obj };
  for (const field of maskFields) {
    if (masked[field]) {
      masked[field] = '***MASKED***';
    }
  }
  return masked;
}
```

```typescript
this.logger.info('User login', maskSensitive({ userId, email, password: rawPassword }));
// Output: { userId: '123', email: 'test@example.com', password: '***MASKED***' }
```

---

## Performance Considerations

| Pattern | Impact | Recommendation |
|---------|--------|----------------|
| Logging in tight loops | High | Batch or sample |
| Serializing large objects | CPU intensive | Use depth limit or pick fields |
| Synchronous file writes | I/O blocking | Use async transports |
| JSON in high-volume services | CPU + size | Consider sampling or log sampling |

### Sampling Pattern for High Volume

```typescript
@Injectable()
export class SampledLoggerService implements LoggerPort {
  private sampleRate = parseFloat(process.env.LOG_SAMPLE_RATE || '1.0');

  constructor(private readonly logger: LoggerPort) {}

  info(message: string, context?: Record<string, any>): void {
    if (Math.random() < this.sampleRate) {
      this.logger.info(message, { ...context, sampled: this.sampleRate < 1.0 });
    }
  }
}
```

Set `LOG_SAMPLE_RATE=0.1` to log only 10% of info messages.

---

## Module Registration Pattern

```typescript
@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: () => {
        const isProduction = process.env.NODE_ENV === 'production';
        return {
          transports: isProduction ? productionTransports() : developmentTransports(),
          level: process.env.LOG_LEVEL || 'info',
          defaultMeta: {
            service: process.env.SERVICE_NAME,
            environment: process.env.NODE_ENV,
          },
        };
      },
    }),
  ],
  providers: [
    { provide: LOGGER_PORT, useClass: WinstonLoggerService },
    LoggingInterceptor,
  ],
  exports: [LOGGER_PORT],
})
export class LoggerModule {}
```

---

## Integration with NestJS Exception Filters

```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(@Inject(LOGGER_PORT) private readonly logger: LoggerPort) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const correlationId = request['correlationId'];
    const status = this.getStatus(exception);

    this.logger.error(
      this.getMessage(exception),
      {
        correlationId,
        userId: request.user?.userId, method: request.method, url: request.url,
        stack: exception instanceof Error ? exception.stack : undefined,
      },
    );

    response.status(status).json({ statusCode: status });
  }

  private getStatus(exception: unknown): number {
    if (exception instanceof HttpException) return exception.getStatus();
    return 500;
  }

  private getMessage(exception: unknown): string {
    if (exception instanceof Error) return exception.message;
    if (typeof exception === 'string') return exception;
    return 'Internal server error';
  }
}
```

---

## Complete Module Example

```typescript
import { Module, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LoggerPort } from '../../domain/ports/logger.port';
import { WinstonLoggerService } from './winston-logger.service';
import { LoggingInterceptor } from './logging.interceptor';
import { GlobalExceptionFilter } from './global-exception.filter';

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: () => ({
        transports: [
          new winston.transports.Console({
            format: process.env.NODE_ENV === 'production'
              ? winston.format.json()
              : winston.format.combine(
                  winston.format.colorize(),
                  winston.format.simple(),
                ),
          }),
        ],
        level: process.env.LOG_LEVEL || 'info',
        defaultMeta: {
          service: process.env.SERVICE_NAME || 'unknown',
          version: process.env.SERVICE_VERSION || '1.0.0',
          environment: process.env.NODE_ENV || 'development',
        },
      }),
    }),
  ],
  providers: [
    { provide: LoggerPort, useClass: WinstonLoggerService },
    LoggingInterceptor,
    GlobalExceptionFilter,
  ],
  exports: [LoggerPort],
})
export class LoggerModule {}
```

---

## Quality Checklist

```
[ ] LoggerPort interface decouples app from Winston
[ ] Production uses JSON format, development pretty print
[ ] defaultMeta includes service/version/environment
[ ] Sensitive fields masked
[ ] LoggingInterceptor + GlobalExceptionFilter registered
```
