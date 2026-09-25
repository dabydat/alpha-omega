# JWKS Key Generation

JWKS (JSON Web Key Set) provides public keys for JWT verification. Key rotation is supported by adding new keys while keeping old ones for validating existing tokens.

---

## Key Generation Script

```typescript
// apps/authentication/src/oauth/infrastructure/scripts/jwks-generator.ts
import * as jose from 'jose';
import * as fs from 'fs';

async function generateJWKS() {
  const rsaKey = await jose.generateKeyPair('RS256', { modulusLength: 2048 });
  const ecKey = await jose.generateKeyPair('ES256');

  const jwks = {
    keys: [
      await jose.exportJWK(rsaKey.publicKey),
      await jose.exportJWK(ecKey.publicKey),
    ],
  };

  fs.writeFileSync('apps/authentication/jwks.json', JSON.stringify(jwks, null, 2));
}

generateJWKS().catch(console.error);
```

---

## Key Types

| Algorithm | Use Case | Compatibility |
|-----------|----------|---------------|
| **RS256** | Most compatible | Wide library support |
| **ES256** | Better performance | Modern libraries |
| **EdDSA** | Modern | Newer libraries only |

---

## Key Rotation Strategy

1. Generate new key pair
2. Add new public key to JWKS endpoint
3. Old tokens still valid using old private key signing
4. After all old tokens expire, remove old key from JWKS

```
Timeline:
t0: JWKS has [Key_v1]
t1: Add Key_v2 to JWKS, start issuing new tokens with Key_v2
t2: Old tokens expired, remove Key_v1 from JWKS
```

---

## Loading JWKS at Startup

```typescript
// Fetch on module init
async onModuleInit() {
  const jwksUri = 'https://auth.example.com/.well-known/jwks.json';
  this.jwks = jose.createRemoteJWKSet(new URL(jwksUri));
}
```

---

## Local JWKS vs Remote JWKS

| Approach | Use Case | Tradeoff |
|---------|---------|----------|
| **Local file** | Static keys, simple deployment | Manual rotation required |
| **Remote URL** | Auto-updated, managed keys | Network dependency |
| **jwks-endpoint** | Your own OIDC provider | Simplest for same-service auth |

---

## Quality Checklist

```
[ ] RS256 or ES256 key pair generated
[ ] Private key stored securely (env var or secrets manager)
[ ] Public key exposed via JWKS endpoint
[ ] Key rotation plan documented
[ ] Old key retired after token expiry
```