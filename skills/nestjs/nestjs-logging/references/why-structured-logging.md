# Why Structured Logging

Production logging is not console.log with extra metadata. It is correlation IDs that stitch across services, log levels that adapt per environment, and transports that go beyond stdout.

---

## Core Principle

console.log is not enough.

```
INCORRECT:  console.log('User created', user);
             console.log('Processing order', orderId);

CORRECT:    logger.info('User created', { userId: user.id, email: user.email });
             logger.info('Processing order', { orderId, correlationId, handler: 'CreateOrderHandler' });
```

**Why structured matters**: Logs go to centralized systems (Datadog, Elasticsearch, CloudWatch). Fields must be searchable, not string-parsed.

**Why correlation ID matters**: A single user action generates logs across 5 services. Without correlation ID, you cannot trace the full flow.

---

## Quality Checklist

```
[ ] Logs structured (fields, not string concat)
[ ] Correlation ID in every log
[ ] Searchable fields for centralized systems
```
