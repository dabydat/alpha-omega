# Event Publishing

Events are published from the aggregate, through a port (hexagonal) implemented by an adapter. Publishing should be async and non-blocking.

---

## Publishing from Aggregate

```typescript
// Aggregate publishes event on state change
export class User extends AggregateRoot {
  public create(): void {
    this.status = UserStatus.ACTIVE;
    // Publish domain event
    this.apply(new UserCreatedEvent(
      this.id.getValue(),
      this.email.getValue(),
      this.name.getValue(),
    ));
  }
}
```

---

## Event Publisher Port (Hexagonal)

```typescript
// apps/account/src/account/domain/ports/event-publisher.port.ts
export const EVENT_PUBLISHER_PORT = Symbol('EVENT_PUBLISHER_PORT');

export interface EventPublisherPort {
  publish(topic: string, key: string, event: DomainEvent): Promise<void>;
}
```

---

## Adapter Implementation

```typescript
// apps/account/src/account/infrastructure/adapters/event-publisher.adapter.ts
@Injectable()
export class EventPublisherAdapter implements EventPublisherPort {
  constructor(
    @Inject(QUEUE_SERVICE)
    private readonly queueService: QueueService,
  ) {}

  async publish(topic: string, key: string, event: DomainEvent): Promise<void> {
    await this.queueService.publish(
      topic,
      key,
      this.serializeEvent(event),
    );
  }
}
```

---

## Quality Checklist

```
[ ] Publisher behind a port (hexagonal)
[ ] Adapter serializes the event
[ ] publish is async/fire-and-forget
```
