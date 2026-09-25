# Logging Anti-Patterns

These are the common mistakes in logging.

---

## ❌ console.log in handlers

```typescript
// INCORRECT
async createOrder(@Body() command: CreateOrderCommand) {
  console.log('Creating order:', command.orderId);
  const order = await this.orderRepository.save(command);
  console.log('Order created:', order.id);
  return order;
}

// CORRECT
async createOrder(@Body() command: CreateOrderCommand) {
  this.logger.info('Creating order', { orderId: command.orderId });
  const order = await this.orderRepository.save(command);
  this.logger.info('Order created', { orderId: order.id });
  return order;
}
```

**Fix**: Use `logger.info` with structured context.

---

## ❌ Logging after throw

```typescript
// INCORRECT
catch(exception: Error) {
  this.logger.error(exception.message, { stack: exception.stack });
  throw exception;
}

// CORRECT - log first, then throw
catch(exception: Error) {
  this.logger.error(exception.message, { stack: exception.stack });
  throw new InternalServerErrorException(exception.message);
}
```

**Fix**: Log first, then throw.

---

## ❌ Sensitive data in logs

```typescript
// INCORRECT
this.logger.info('User login', { email, password: rawPassword });

// CORRECT
this.logger.info('User login', { email, password: '***MASKED***' });
```

**Fix**: Mask sensitive fields.

---

## Quality Checklist

```
[ ] No console.log in handlers
[ ] Log before throw
[ ] Sensitive fields masked
```
