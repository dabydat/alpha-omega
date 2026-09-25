# Why Hexagonal Architecture

Hexagonal architecture (also called Ports and Adapters) isolates domain logic from external dependencies. Ports are interfaces; adapters are implementations.

---

## Core Principle: Domain Independence

```
External Systems → Adapters → Ports → Domain
                        ↑
                   Your code owns this
```

**Why this matters**: Domain logic should be testable without external systems (databases, message queues, email services). Ports define what domain needs; adapters provide it.

---

## Problem Without Hexagonal

```typescript
// ❌ BAD: Domain depends directly on infrastructure
export class EntityService {
  constructor(
    private emailService: SMTPEmailService,  // Concrete implementation
    private db: PostgresDatabase,
  ) {}

  async createEntity(data: CreateEntityDTO): Promise<Entity> {
    const entity = Entity.create(/* ... */);
    await this.db.save(entity);  // Domain coupled to Postgres
    await this.emailService.send(entity.email, 'Welcome!');  // Coupled to SMTP
    return entity;
  }
}
```

**Why it's bad**:
1. Can't test without real database and email server
2. Change email provider = change domain
3. Two concrete dependencies in domain

---

## Solution with Hexagonal

```typescript
// ✅ GOOD: Domain depends on abstract ports
export class EntityService {
  constructor(
    private repository: EntityRepository,    // Port interface
    private publisher: PublisherPort,         // Port interface
    private emailPort: EmailPort,            // Port interface
  ) {}

  async createEntity(data: CreateEntityDTO): Promise<Entity> {
    const entity = Entity.create(/* ... */);
    await this.repository.save(entity);        // Implementation injected
    await this.emailPort.send(entity.email, 'Welcome!');  // Implementation injected
    return entity;
  }
}
```

**Why it's good**:
1. Test domain with mock implementations
2. Change database provider = new adapter, same port
3. Domain doesn't know about infrastructure

---

## Quality Checklist

```
[ ] Domain depends on interfaces (ports), not concrete implementations
[ ] No infrastructure imports in domain
[ ] Testable without real external systems
```
