# Event Handlers (CQRS Event Handlers)

Event handlers react to events — typically by publishing another event or updating state.

---

## @EventsHandler Pattern

```typescript
// apps/merchant/src/merchant/application/event-handlers/user-updated.handler.ts
@EventsHandler(UserUpdatedEvent)
export class UserUpdatedHandler implements IEventHandler<UserUpdatedEvent> {
  constructor(
    @Inject(EVENT_PUBLISHER_PORT)
    private readonly publisher: EventPublisherPort,
  ) {}

  async handle(event: UserUpdatedEvent): Promise<void> {
    // React to event - typically publish another event or update state
    await this.publisher.publish(
      TopicConstant.USER_UPDATED,
      event.userId,
      event,
    );
  }
}
```

**Why separate event handler**: Business logic that reacts to events. Could send email, update another aggregate, etc.

---

## Quality Checklist

```
[ ] Event handler reacts to events via @EventsHandler
[ ] Publishes downstream events or updates state
[ ] No business logic that belongs to domain
```
