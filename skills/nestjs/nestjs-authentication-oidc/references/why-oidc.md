# Why OIDC + PKCE

OIDC with PKCE provides a well-audited, secure authentication flow. This reference explains why custom token auth fails and why OIDC + PKCE is the standard.

---

## Problem Without OIDC

```typescript
// BAD: Custom token-based auth
async login(email: string, password: string) {
  const { token } = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }).then(r => r.json());
  localStorage.setItem('token', token);  // Vulnerable to XSS
}
```

**Issues**: No standard protocol, localStorage XSS risk, no refresh rotation, no key rotation.

---

## Solution With OIDC + PKCE

Standard flow: PKCE challenge -> redirect -> auth code -> token exchange -> secure storage.

**Benefits**: Well-audited protocol, PKCE prevents code interception, JWKS enables key rotation.

---

## OIDC Flow Overview

```
Client                    OIDC Provider              Resource Server
  |                            |                            |
|-- Auth Request (PKCE) ------>|                            |
|<-- Auth Code --------------|                            |
  |                            |                            |
|-- Code + Proof ------------>|                            |
|<-- Access + ID Token --------|                            |
  |                            |                            |
|-- Access Token (JWT) ------->|--------------------------->|
|<-- Protected Resource -------|                            |
```

**PKCE adds**: `code_verifier` (random), `code_challenge` (SHA256 of verifier).

---

## Quality Checklist

```
[ ] No tokens in localStorage (use httpOnly cookies / secure storage)
[ ] PKCE with S256 for public clients
[ ] JWKS used for token validation
[ ] Refresh rotation implemented
```
