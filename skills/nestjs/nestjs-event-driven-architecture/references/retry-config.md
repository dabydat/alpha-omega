# Retry Configuration

Transient failures should be retried with a delay. After max retries, messages go to a dead-letter queue.

---

## Retry Config in Consumer

```typescript
private userCreated(): void {
  const maxRetries = this.configService.get<number>('kafka.maxTries')!;
  const retryDelayMs = this.configService.get<number>('kafka.retryDelayMs')!;

  this.queueService.consume(
    TopicConstant.USER_CREATED,
    async (message: UserCreatedMessage): Promise<void> => {
      // Handler
    },
    KafkaGroupsConstant.NOTIFICATION_GROUP,
    maxRetries,      // e.g., 3
    retryDelayMs,    // e.g., 1000ms
  );
}
```

**Why retry**: Transient failures (network, service restart) should be retried. Messages go to dead-letter queue after max retries.

---

## Quality Checklist

```
[ ] Retry with max attempts + delay
[ ] Dead-letter queue after max retries
[ ] Idempotent consumers (safe to retry)
```
