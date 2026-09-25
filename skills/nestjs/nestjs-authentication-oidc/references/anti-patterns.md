# OIDC Authentication Anti-Patterns

These are the common security mistakes in auth flows. Each shows the INCORRECT pattern and the fix.

---

## ❌ Storing tokens in localStorage

```typescript
// BAD: XSS vulnerability
localStorage.setItem('access_token', token);
```

**Fix**: Use httpOnly cookies or secure storage (iOS Keychain, Android Keystore).

---

## ❌ No PKCE for public clients

```typescript
// BAD: Implicit flow (deprecated)
window.location.href = `${authUrl}?client_id=...&redirect_uri=...`;
```

**Fix**: Always use PKCE with `S256` method.

---

## ❌ Not revoking tokens on logout

```typescript
// BAD: Token still valid server-side
logout() { localStorage.removeItem('token'); }
```

**Fix**: Call revoke endpoint to invalidate token server-side.

---

## ❌ Timing attacks on hash comparison

```typescript
// BAD: Non-constant time comparison
if (hash1 === hash2) { ... }
```

**Fix**: Use `crypto.timingSafeEqual()` for hash comparison.

---

## Quality Checklist

```
[ ] Tokens in httpOnly cookies / secure storage
[ ] PKCE with S256 for public clients
[ ] Logout revokes token server-side
[ ] Hash comparison uses timingSafeEqual
```
