# Topic & Consumer Group Constants

Topic names and consumer group IDs as a single source of truth.

---

## Topic Constants

```typescript
// libs/common_core/src/infrastructure/constants/topic.constant.ts
export const TopicConstant = {
  PASSWORD_CHANGED: 'password_changed',
  USER_AUTHENTICATED: 'user_authenticated',
  USER_CREATED: 'user_created',
  USER_ACTIVATED: 'user_activated',
  USER_DELETED: 'user_deleted',
  USER_UPDATED: 'user_updated',
  ROLE_UPDATED: 'role_updated',
  SEND_OTP_CODE_BY_PHONE_NUMBER: 'send_otp_code_by_phone_number',
  FORGOT_PASSWORD_IDENTITY: 'forgot_password_identity',
  ACCOUNT_NOTIFICATION: 'account_notification',
  MERCHANT_ADMIN_USER_CREATED: 'merchant_admin_user_created',
  MERCHANT_COMMERCIAL_PROPOSAL: 'merchant_commercial_proposal',
  BRANCH_UPDATED: 'branch_updated',
};
```

**Why lowercase with underscores**: Standard for Kafka topic naming.

---

## Consumer Groups

```typescript
// libs/common_core/src/infrastructure/constants/kafka-groups.constant.ts
export const KafkaGroupsConstant = {
  NOTIFICATION: 'notification-consumer-group',
  MERCHANT: 'merchant-consumer-group',
  AUTHENTICATION: 'authentication-consumer-group',
  ACCOUNT: 'account-consumer-group',
};
```

**Why separate consumer groups**: Each service is a separate consumer group. Events are broadcast to all groups.

---

## Quality Checklist

```
[ ] Topics lowercase with underscores
[ ] One consumer group per service
[ ] Single source of truth for names
```
