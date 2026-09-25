---
name: nestjs-guards-filters
description: Guards, filters, interceptors, and decorators for NestJS. Covers AuthGuard, RolesGuard, ExceptionFilters, logging interceptors, and webhook signature verification. Use when implementing authentication, authorization, error handling, or request/response preprocessing.
---

# NestJS Guards, Filters, and Decorators

Cross-cutting concerns - security, error handling, logging - should be centralized and declarative.

**Production patterns for**: OAuth guards, webhook signature verification, exception handling, guards/filters/interceptors

**Agent collaboration**: Backend Dev (webhook security, typed errors), QA Engineer (security tests)

---

## Core Principle: Security at the Seam

See `references/security-at-the-seam.md` for the INCORRECT (scattered) vs CORRECT (declarative) comparison.

---

## Guards (Authentication and Authorization)

See `references/guards.md` for `AuthGuard`, `RolesGuard`, and `ScopesGuard`.

---

## Webhook Security

See `references/webhook-security.md` for full HMAC implementation and verification flow.

**Every webhook handler MUST verify signature FIRST, then check idempotency, then process.**

---

## Custom Decorators

See `references/custom-decorators.md` for full decorator patterns (`UserDetails`, `CurrentUserId`).

---

## Exception Filters

See `references/exception-filters.md` for the global 7-case filter, the domain filter, and the validation filter.

---

## Interceptors

See `references/interceptors.md` for the logging interceptor and the transform interceptor.

---

## Module Registration (Global)

See `references/module-registration.md` for `APP_GUARD`/`APP_FILTER`/`APP_INTERCEPTOR`.

---

## Execution Order

```
Request -> Guard[Auth] -> Guard[WebhookSig] -> Guard[Roles] -> Interceptor[Logging]
        -> Handler -> Interceptor[Transform] -> Filter[Domain] -> Filter[All] -> Response
```

1. **Guards**: Run first, authenticate, authorize. Webhook guard verifies signature.
2. **Interceptors (before)**: Request preprocessing, logging.
3. **Handler**: Business logic.
4. **Interceptors (after)**: Response transformation.
5. **Filters**: Exception handling, only runs if exception thrown.

---

## Anti-Patterns

See `references/anti-patterns.md` for the three ❌ examples.

---

## Quality Checklist

```
Guards
  [ ] AuthGuard verifies JWT and attaches user to request
  [ ] RolesGuard checks role decorator metadata
  [ ] WebhookSignatureGuard verifies HMAC signature FIRST
  [ ] Idempotency check after signature verification

Filters
  [ ] RpcGlobalExceptionFilter handles all 7 exception cases
  [ ] DomainException -> 409 (conflict)
  [ ] HttpException -> preserves status
  [ ] Unknown -> 500 with logged stack trace

Interceptors
  [ ] LoggingInterceptor logs method, URL, status, duration
  [ ] TransformInterceptor wraps responses in { success, data, timestamp }

Module Registration
  [ ] Global guards via APP_GUARD
  [ ] Global filters via APP_FILTER
  [ ] Global interceptors via APP_INTERCEPTOR
```

---

## Related Skills

- `nestjs-ddd-patterns` - DomainException base class
- `nestjs-repository-pattern` - Error handling in data access
- `nestjs-cqrs-commands` - Exception handling in command handlers
