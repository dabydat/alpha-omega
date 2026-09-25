---
name: nestjs-logging
description: Structured logging patterns for NestJS microservices. Covers correlation ID propagation, Winston configuration, log levels per environment, HTTP middleware vs TCP interceptor patterns, and centralized logging in common_core. Use when setting up logging infrastructure, debugging request flows, or implementing distributed tracing.
---

# Structured Logging for NestJS Microservices

Production logging is not console.log with extra metadata. It is correlation IDs that stitch across services, log levels that adapt per environment, and transports that go beyond stdout.

**Production patterns for**: HTTP gateways, TCP microservices, event handlers, job processors, and distributed tracing

**Agent collaboration**: Backend Dev (logger implementation), DevOps (centralized log aggregation), QA Engineer (log-based debugging)

---

## Core Principle: Why Structured Logging

See `references/why-structured-logging.md` for the INCORRECT vs CORRECT comparison.

---

## Correlation ID Pattern

See `references/correlation-id.md` for the full implementation and flow.

**Flow**:
1. Incoming request has `x-correlation-id` header? Use it. Otherwise generate UUID.
2. Attach to request context (request object for HTTP, message payload for TCP).
3. Ensure all log calls include it automatically via AsyncLocalStorage.
4. Propagate to outgoing requests (HTTP headers, message headers).

---

## Structured Logging with Winston

See `references/winston-config.md` for full configuration.

**Key components**: See `references/logger-port.md` for the `LoggerPort` interface.

**Transport decision**:

| Environment | Transport | Format |
|-------------|-----------|--------|
| Development | Console | Pretty-printed, colorized |
| Production | JSON (file or remote) | Structured JSON for search/analysis |

---

## Transport-Specific Patterns

### HTTP Gateway (REST Controllers)

- **Middleware** (before handler): see `references/http-middleware.md`.
- **Interceptor** (after handler): see `references/http-interceptor.md`.

### TCP Microservice

See `references/tcp-interceptor.md`.

---

## Exception Filter Logging

See `references/exception-filter-logging.md` (log context before responding).

---

## Module Registration

See `references/module-registration.md` (`APP_INTERCEPTOR`/`APP_FILTER`/`LOGGER_PORT`).

---

## Log Levels

See `references/log-levels.md` for detailed environment configuration.

| Environment | Level | Sampling | Format |
|-------------|-------|----------|--------|
| development | debug | none | pretty |
| staging | info | 50% | json |
| production | warn | 10% | json |

---

## Quality Checklist

```
Correlation ID
  [ ] HTTP requests have x-correlation-id header (generated or passed)
  [ ] TCP messages have correlationId field in payload
  [ ] All logs include correlationId via AsyncLocalStorage
  [ ] Responses include correlationId header

Logger
  [ ] LoggerPort injected, not Winston directly
  [ ] Production uses JSON format
  [ ] Development uses pretty print
  [ ] Sensitive fields masked

Interceptors
  [ ] LoggingInterceptor logs method, URL, status, duration
  [ ] CorrelationIdInterceptor sets ID before handler runs

Exception Filter
  [ ] All exception types handled
  [ ] Logs include stack trace for 5xx
  [ ] Logs include correlationId

Module Registration
  [ ] LoggerModule global
  [ ] APP_INTERCEPTOR for interceptors
  [ ] APP_FILTER for exception filter
```

---

## Anti-Patterns

See `references/anti-patterns.md` for the three ❌ examples (console.log, logging after throw, sensitive data).

---

## Related Skills

- `nestjs-guards-filters` - Exception filters for HTTP error handling
- `nestjs-event-driven-architecture` - Event logging patterns
- `nestjs-cqrs-commands` - Command and query logging
- `nestjs-ddd-patterns` - Domain event logging
