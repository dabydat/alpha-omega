# Module Registration

Register sagas in the module where CqrsModule is imported.

---

## AppModule

```typescript
@Module({
  imports: [CqrsModule],
  providers: [PaymentLinkCreatedEventSaga, AuthenticationSaga],
})
export class AppModule {}
```

**Why in CqrsModule**: Sagas use `@nestjs/cqrs` decorators. They must be registered where CqrsModule is imported.

---

## Quality Checklist

```
[ ] Sagas registered in module
[ ] CqrsModule imported
```
