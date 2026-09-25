# Client Constants (BFF Service References)

Injection tokens for `ClientProxy` to other microservices.

```typescript
// libs/common_core/src/infrastructure/constants/client.constant.ts
export const ClientConstant = {
  MERCHANT_CLIENT: Symbol('MERCHANT_CLIENT'),
  ACCOUNT_SERVICE: Symbol('ACCOUNT_SERVICE'),
  AUTHENTICATION_CLIENT: Symbol('AUTHENTICATION_CLIENT'),
  STORAGE_CLIENT: Symbol('STORAGE_CLIENT'),
};
```

**Why in infrastructure layer**: These are infrastructure concerns (service communication), not domain logic.

---

## Quality Checklist

```
[ ] Client tokens in infrastructure layer
[ ] One Symbol per microservice
[ ] Injected via @Inject(ClientConstant.X)
```
