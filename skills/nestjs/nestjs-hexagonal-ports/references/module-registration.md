# Module Registration

Register ports and adapters in module. Adapter replaces port in DI container.

---

## PortsModule

```typescript
@Module({
  providers: [
    // Bind port to adapter
    { provide: LOGGER_PORT, useClass: LoggerAdapter },
    { provide: CACHE_PROVIDER_PORT, useClass: CacheProviderAdapter },
    { provide: PUBLISHER_PORT, useClass: KafkaPublisherAdapter },
  ],
  exports: [LOGGER_PORT, CACHE_PROVIDER_PORT, PUBLISHER_PORT],
})
export class PortsModule {}
```

**Why export ports, not adapters**: Consumers inject port (interface), not adapter (implementation).

---

## Quality Checklist

```
[ ] Port bound to adapter via useClass
[ ] Ports exported (not adapters)
[ ] One provider per port
```
