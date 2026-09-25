# Why Event-Driven Architecture

EDA is a communication pattern where services communicate via asynchronous events rather than synchronous calls. Events enable loose coupling, scalability, and resilience.

---

## Problem With Synchronous Communication

```typescript
// ❌ BAD: Direct synchronous call
async function createOrder(order: OrderDTO) {
  // Create order
  const created = await this.orderRepo.save(order);

  // Notify user - but what if notification service is down?
  await this.notificationService.sendEmail(created.userEmail, 'Order confirmed');

  // Update inventory - but what if inventory service is slow?
  await this.inventoryService.reserve(order.items);

  return created;
}
```

**Why it's bad**:
- Tight coupling (order service knows about notification, inventory)
- If notification fails, user never notified
- If inventory slow, order creation slow
- If any service down, entire operation fails

---

## Solution With Events

```typescript
// ✅ GOOD: Event-driven
async function createOrder(order: OrderDTO) {
  const created = await this.orderRepo.save(order);

  // Publish event - immediate return
  await this.eventPublisher.publish(
    'order.created',
    created.id,
    { orderId: created.id, userEmail: created.userEmail, items: order.items },
  );

  return created;  // Fast response
}
```

**Why it's good**:
- Order service doesn't know about notification/inventory
- Fast response (publish and return)
- Notification/inventory subscribe to events independently
- If notification down, event queued, retried later

---

## Quality Checklist

```
[ ] Services communicate via events, not direct calls
[ ] Event publishing is async (non-blocking)
[ ] Loose coupling between services
```
