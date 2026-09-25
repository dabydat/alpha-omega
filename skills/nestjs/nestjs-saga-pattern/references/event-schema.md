# Event Schema for Sagas

Events that trigger sagas should carry all necessary context.

---

## PaymentLink Events

```typescript
export class PaymentLinkCreatedEvent extends DomainEvent {
  constructor(
    public readonly paymentLinkId: string,
    public readonly status: string,
    public readonly oldStatus: string | null,
    public readonly modifiedBy: string,
    public readonly timestamp: Date = new Date(),
  ) {
    super('payment_link.created');
  }
}

export class PaymentLinkSendedEvent extends DomainEvent {
  constructor(
    public readonly paymentLinkId: string,
    public readonly status: string,
    public readonly shippingType: 'EMAIL' | 'SMS' | 'BOTH',
    public readonly email?: string,
    public readonly phoneNumber?: string,
    public readonly link?: string,
    public readonly modifiedBy: string,
    public readonly timestamp: Date = new Date(),
  ) {
    super('payment_link.sended');
  }
}
```

**Why rich events**: Saga needs context to create commands. Events carry necessary data.

---

## Quality Checklist

```
[ ] Events carry all context the saga needs
[ ] Events named as domain facts
[ ] Versioned / additive changes
```
