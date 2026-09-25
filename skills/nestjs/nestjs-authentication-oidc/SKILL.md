---
name: nestjs-authentication-oidc
description: OIDC/PKCE/JWKS authentication patterns for NestJS. Covers OAuth2 flows, token validation, password hashing, and identity provider integration. Use when implementing OAuth authentication, OIDC flows, password hashing, or identity integration.
---

# NestJS OIDC/PKCE Authentication

## Why OIDC + PKCE

See `references/why-oidc.md` for the ❌ BAD custom-token-auth example, the ✅ OIDC + PKCE solution, and the flow overview diagram.

---

## JWKS Key Generation

See `references/jwks-generation.md` for key types, rotation strategy, loading patterns, and the generator.

---

## OIDC Provider Service

See `references/oidc-provider.md` for the full provider implementation, endpoint handling, and the custom `/me` endpoint.

**OIDC handles**: `/authorize`, `/token`, `/userinfo`, `/.well-known/openid-configuration`, `/logout`.

---

## OIDC Controller

See `references/oidc-controller.md` for the logout + mounted OIDC endpoints.

---

## Authorization Code Flow

### Interaction Controller (Login/OTP Screens)

See `references/interaction-controller.md` for the full prompt handling (login/consent/OTP).

---

## Custom UserInfo Endpoint

See `references/oidc-provider.md` for the `/me` handler implementation.

---

## Password Hashing

See `references/password-hashing.md` for PBKDF2 implementation, migration patterns, and the `HASHING_SERVICE` port.

### When to Use Which Algorithm

| Algorithm | Use Case | Notes |
|-----------|----------|-------|
| **PBKDF2** | Enterprise migration, compliance | 15000+ iterations |
| **bcrypt** | General purpose | Auto salt, work factor tuning |
| **argon2** | New systems, high security | Memory-hard |

**Recommendation**: For new systems, prefer argon2. For migration or compliance, PBKDF2.

---

## Token Validation in Resource Servers

See `references/resource-server-validation.md` for JWKS validation, introspection, and the `JwtAuthGuard`.

---

## Service Communication Patterns

See `references/service-communication.md` for TCP vs REST patterns and correlation ID propagation.

### TCP vs REST for Auth Services

| Aspect | TCP | REST |
|--------|-----|------|
| Latency | Lower | Higher |
| Client support | NestJS only | Any HTTP client |
| Type safety | MessagePattern | DTOs |

---

## Anti-Patterns to Avoid

See `references/anti-patterns.md` for the four ❌ examples (localStorage, no PKCE, no revoke, timing attacks) with fixes.

---

## Summary: Auth Flow Responsibilities

| Component | Responsibility |
|-----------|----------------|
| JWKS Generator | Create RSA/ECDSA/EdDSA key pairs for signing |
| OIDC Provider | Handle auth endpoint, token exchange, discovery |
| Hashing Service | PBKDF2/bcrypt/argon2 password hashing |
| Interaction Controller | Login form, consent screen, OTP verification |
| Token Repository | Store access/refresh tokens with rotation |
| Auth Guard | Validate JWTs using JWKS |
| /me Endpoint | Return user claims |

**Golden rules**:
- Never store tokens insecurely. Use httpOnly cookies or secure storage.
- Always use PKCE for public clients.
- Use timing-safe comparison for hash verification.
- Resource servers validate tokens using shared JWKS or introspection.

---

## Related Skills

- `nestjs-guards-filters` - Guards and exception filters for auth handling
- `nestjs-controllers` - Controller patterns for API gateways
- `nestjs-ddd-patterns` - DomainException base class
