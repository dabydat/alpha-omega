# Password Hashing

Password hashing protects user credentials. Migration patterns handle legacy systems with existing hashes.

---

## Why Custom Hashing

- **Upgrade path**: Legacy systems with existing hashes need compatible verification
- **Performance control**: Work factor tuning for specific security requirements
- **Compliance**: Some regulations mandate specific algorithms
- **Migration**: Moving between algorithms without forcing password resets

---

## Hashing Service Port

```typescript
// Domain layer - port interface
export const HASHING_SERVICE = Symbol('HASHING_SERVICE');

export interface HashingService {
  hash(password: string | Buffer): Promise<string>;
  compare(password: string | Buffer, hash: string): Promise<boolean>;
}
```

---

## Algorithm Comparison

| Algorithm | Use Case | Notes |
|-----------|----------|-------|
| **PBKDF2** | Enterprise migration, compliance mandates | 15000+ iterations recommended |
| **bcrypt** | General purpose, new systems | Auto salt, work factor 10-12 |
| **argon2** | New systems, high security | Memory-hard, best against GPU |

**Recommendation**: For new systems, prefer argon2. For migration or compliance, PBKDF2.

---

## PBKDF2 Implementation

```typescript
// Infrastructure adapter - PBKDF2 implementation
import * as crypto from 'crypto';

export class Pbkdf2HashingService implements HashingService {
  private readonly iterations: number;
  private readonly keyLength: number;
  private readonly digest: string;

  constructor(iterations = 15000, keyLength = 32, digest = 'sha256') {
    this.iterations = iterations;
    this.keyLength = keyLength;
    this.digest = digest;
  }

  async hash(password: string | Buffer): Promise<string> {
    const salt = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(password, salt, this.iterations, this.keyLength, this.digest);
    const hash = Buffer.concat([salt, key]).toString('base64');
    return `pbkdf2_sha256$${this.iterations}$${salt.toString('base64')}$${hash}`;
  }

  async compare(password: string | Buffer, hash: string): Promise<boolean> {
    const [, iterationsStr, saltBase64] = hash.split('$$');
    const iterations = parseInt(iterationsStr, 10);
    const salt = Buffer.from(saltBase64, 'base64');

    const parts = hash.split('$$');
    const storedHash = parts[2];
    const saltB64 = parts[1];

    const computedHash = crypto.pbkdf2Sync(password, salt, iterations, this.keyLength, this.digest);
    const computedHashB64 = Buffer.concat([salt, computedHash]).toString('base64');

    // Timing-safe comparison prevents timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(computedHashB64),
      Buffer.from(storedHash)
    );
  }
}
```

---

## Hash Format

```
algorithm$iterations$salt$key
pbkdf2_sha256$$15000$$base64_salt$$base64_key
```

Format enables:
- Algorithm identification for migration
- Iterations tuning without breaking existing hashes
- Salt extraction for verification

---

## Timing-Safe Comparison

```typescript
// Timing attack prevention
return crypto.timingSafeEqual(
  Buffer.from(computedHashB64),
  Buffer.from(storedHash)
);
```

Why it matters: String comparison `===` exits early on first mismatch, leaking timing information about where the mismatch occurs.

---

## Migration Pattern

```typescript
@Injectable()
export class MigrationHashingService implements HashingService {
  constructor(
    private readonly newHasher: Pbkdf2HashingService,
    private readonly legacyHasher: LegacyHashingService,
  ) {}

  async compare(password: string | Buffer, hash: string): Promise<boolean> {
    // Try new algorithm first
    if (hash.startsWith('pbkdf2_sha256$$')) {
      return this.newHasher.compare(password, hash);
    }

    // Fall back to legacy, upgrade if valid
    if (await this.legacyHasher.compare(password, hash)) {
      // Upgrade hash to new algorithm
      const newHash = await this.newHasher.hash(password);
      this.userRepo.upgradeHash(userId, newHash);
      return true;
    }

    return false;
  }
}
```

---

## Quality Checklist

```
[ ] PBKDF2 with 15000+ iterations
[ ] Timing-safe comparison (crypto.timingSafeEqual)
[ ] Unique salt per hash (crypto.randomBytes)
[ ] Hash format includes algorithm + iterations for migration
[ ] Migration pattern upgrades legacy hashes
[ ] No plaintext passwords in logs
```