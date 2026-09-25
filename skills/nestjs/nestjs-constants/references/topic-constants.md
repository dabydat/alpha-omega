# Topic & Consumer Group Constants

Kafka/RabbitMQ topic names and consumer group IDs as a single source of truth.

---

## Topic Constants (Event Topics)

```typescript
// libs/common_core/src/infrastructure/constants/topic.constant.ts
export const TopicConstant = {
  PASSWORD_CHANGED: 'password_changed',
  USER_CREATED: 'user_created',
  USER_AUTHENTICATED: 'user_authenticated',
  MERCHANT_ADMIN_USER_CREATED: 'merchant_admin_user_created',
  // ...
};
```

**Why lowercase with underscores**: Standard for Kafka topic naming.

---

## Kafka Group Constants (Consumer Groups)

```typescript
// libs/common_core/src/infrastructure/constants/kafka-groups.constant.ts
export const KafkaGroupsConstant = {
  NOTIFICATION: 'notification-consumer-group',
  MERCHANT: 'merchant-consumer-group',
  AUTHENTICATION: 'authentication-consumer-group',
};
```

---

## Quality Checklist

```
[ ] Topics lowercase with underscores
[ ] Consumer groups in constants
[ ] Single source of truth for topic/group names
```
