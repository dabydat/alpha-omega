# Webhook Security Patterns

Every webhook handler MUST verify signature FIRST, then check idempotency, then process. See `references/webhook-security.md` for full implementation.

---

## Digital Signature Verification

```typescript
export class DigitalSignatureVerificationService {
  checkSignature(endpoint: string, timestamp: string, receivedSignature: string, apiKey: string, data: string): boolean {
    if (!receivedSignature.startsWith(DigitalSignatureVerificationService.HMAC_PREFIX)) return false;
    const signature = receivedSignature.replace(DigitalSignatureVerificationService.HMAC_PREFIX, '').trim();
    const secret = this.getSecretForApiKey(apiKey);
    if (!secret) return false;
    const expectedSignature = this.calculateHmacSignature(secret, timestamp, endpoint, data);
    try {
      return crypto.timingSafeEqual(Buffer.from(expectedSignature, 'base64'), Buffer.from(signature, 'base64'));
    } catch { return false; }
  }

  private calculateHmacSignature(secret: string, timestamp: string, endpoint: string, data: string): string {
    return crypto.createHmac('sha256', secret).update(`${timestamp}.${endpoint}.${data}`).digest('base64');
  }
}
```

**Why prefix check first**: Reject obviously malformed signatures before doing expensive crypto.

**Why timing-safe comparison**: Prevents timing attacks.

---

## Webhook Guard Pattern

```typescript
@Injectable()
export class WebhookSignatureGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const signature = req.headers['x-webhook-signature'] as string;
    const timestamp = req.headers['x-webhook-timestamp'] as string;
    const apiKey = req.headers['x-api-key'] as string;

    const isValid = this.signatureService.checkSignature(req.path, timestamp, signature, apiKey, req.body);
    if (!isValid) throw new UnauthorizedException('Invalid webhook signature');

    const idempotencyKey = req.headers['x-idempotency-key'] as string;
    if (idempotencyKey) {
      const alreadyProcessed = await this.idempotencyService.exists(idempotencyKey);
      if (alreadyProcessed) throw new ConflictException('Webhook already processed');
    }
    return true;
  }
}
```

**Why signature FIRST**: If signature is invalid, reject immediately without checking idempotency.

---

## HMAC Signature Calculation

```
payload = timestamp + "." + endpoint + "." + body
signature = HMAC-SHA256(secret, payload).base64()
header = "hmac-sha256 " + signature
```

---

## Quality Checklist

```
[ ] Signature verified BEFORE idempotency check
[ ] Timing-safe comparison (crypto.timingSafeEqual)
[ ] Replay protection via timestamp validation (reject >5min old)
[ ] API key lookup before signature calculation
[ ] Idempotency key prevents duplicate processing
```