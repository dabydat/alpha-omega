# Module Registration

Register globally with APP_INTERCEPTOR and APP_FILTER.

---

## AppModule

```typescript
@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: CorrelationIdInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: LOGGER_PORT, useClass: WinstonLoggerService },
  ],
})
export class AppModule {}
```

**Why APP_* tokens**: These special providers are automatically applied globally by NestJS.

---

## Quality Checklist

```
[ ] LoggerModule global
[ ] APP_INTERCEPTOR for interceptors
[ ] APP_FILTER for exception filter
```
