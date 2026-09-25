# Security at the Seam

Cross-cutting concerns - security, error handling, logging - should be centralized and declarative.

---

## Core Principle: Security at the Seam

```
INCORRECT:  Security logic scattered across handlers
            async createEntity(@Body() body) {
              const token = extractToken(request);
              const user = await authService.validate(token);
              if (!user.hasRole('ADMIN')) throw new ForbiddenException();
              // ... business logic
            }

CORRECT:    Security declared on controller, handled by guard
            @UseGuards(AuthGuard, RolesGuard)
            @Roles('ADMIN')
            async createEntity(@Body() body) {
              // Security already verified, just business logic
            }
```

Security must fail fast, before business logic runs. Guards execute before handler.

---

## Quality Checklist

```
[ ] Security declared declaratively (guards/decorators)
[ ] Guards run before the handler
[ ] No security logic in business methods
```
