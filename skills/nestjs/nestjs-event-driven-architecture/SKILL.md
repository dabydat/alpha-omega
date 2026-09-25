---
name: nestjs-event-driven-architecture
description: Event-driven architecture for NestJS. Covers domain event publishing, event handlers, Kafka integration, and asynchronous communication patterns. Use when implementing event publishing, queue consumers, or cross-service communication.
---

# NestJS Event-Driven Architecture (EDA)

EDA is a communication pattern where services communicate via asynchronous events rather than synchronous calls. Events enable loose coupling, scalability, and resilience.

## Why Event-Driven Architecture

See `references/why-eda.md` for the ❌ BAD synchronous-call example and the ✅ GOOD event-driven example.

---

## Event Anatomy

### Domain Events

See `references/domain-events.md` for `UserCreatedEvent` and `MerchantAdminUserCreatedEvent`.

### Event Message Format

See `references/domain-events.md` for `UserCreatedMessage`.

---

## Event Publishing

### Publishing from Aggregate

See `references/event-publishing.md` (aggregate calls `this.apply(...)`).

### Event Publisher Port (Hexagonal)

See `references/event-publishing.md` (`EVENT_PUBLISHER_PORT` interface).

### Adapter Implementation

See `references/event-publishing.md` (`EventPublisherAdapter`).

---

## Event Consumers

### Consumer Service Pattern

See `references/event-consumers.md` (`UserEventConsumerService`).

### Cross-Service Event Consumption

See `references/event-consumers.md` (`AuthenticationEventConsumerService`).

---

## Event Handlers (CQRS Event Handlers)

### @EventsHandler Pattern

See `references/event-handlers.md` (`UserUpdatedHandler`).

---

## Topic Constants

See `references/topic-constants.md` (`TopicConstant`).

## Consumer Groups

See `references/topic-constants.md` (`KafkaGroupsConstant`).

---

## Event Flow Example

See `references/event-flow.md` for the user-service → Kafka → merchant-service sequence.

---

## Retry Configuration

See `references/retry-config.md`.

---

## Anti-Patterns to Avoid

See `references/anti-patterns.md` for the four ❌ examples (with fixes).

---

## Summary: EDA Responsibilities

| Component | Responsibility |
|-----------|----------------|
| Domain Event | Represents domain fact |
| Event Publisher Port | Abstraction for publishing |
| Event Publisher Adapter | Kafka implementation |
| Event Consumer | Subscribes to topics |
| Event Handler | Reacts to events |
| Topic Constants | Topic name single source of truth |
| Consumer Group Constants | Consumer group IDs |

**Golden rule**: Services communicate via events, not direct calls. Events are contracts — design them carefully and version them.
