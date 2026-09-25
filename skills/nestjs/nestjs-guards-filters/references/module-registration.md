# Module Registration (Global)

Register guards, filters, and interceptors globally with `APP_*` tokens.

---

## AppModule with Global Providers

```typescript
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_FILTER, useClass: RpcGlobalExceptionFilter },
    { provide: APP_FILTER, useClass: ValidationExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
```

**Why APP_GUARD, APP_FILTER, APP_INTERCEPTOR**: Token tells NestJS this provider should be applied globally.

---

## Quality Checklist

```
[ ] Global guards via APP_GUARD
[ ] Global filters via APP_FILTER
[ ] Global interceptors via APP_INTERCEPTOR
```
