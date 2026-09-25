# Value Objects

Value objects are immutable, identity-less types that describe qualities. Two VOs with same values are equal.

---

## When to Use

- Email, Phone, Address - identity from value, not ID
- Money (Amount + Currency) - operations respect currency
- Dates, Ranges - comparison and containment logic

---

## Base Class

```typescript
export default abstract class ValueObject<T extends ValueObjectProps> {
  public readonly props: T;

  protected constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public equals(vo?: ValueObject<T>): boolean {
    return vo !== null && vo !== undefined && shallowEqual(this.props, vo.props);
  }
}
```

**Why `Object.freeze`**: Prevents mutation after construction. VO guaranteed valid after creation.

---

## Common Examples

### Amount with arithmetic

```typescript
export class Amount extends ValueObject<{ value: number; currency: string }> {
  public static create(value: number, currency: string): Amount {
    if (value < 0) throw new NegativeAmountException();
    return new Amount({ value, currency });
  }

  public getValue(): number { return this.props.value; }
  public getCurrency(): string { return this.props.currency; }

  public add(other: Amount): Amount {
    if (other.currency !== this.currency) {
      throw new CurrencyMismatchException(this.currency, other.currency);
    }
    return new Amount({ value: this.value + other.value, currency: this.currency });
  }

  public subtract(other: Amount): Amount {
    if (other.currency !== this.currency) {
      throw new CurrencyMismatchException(this.currency, other.currency);
    }
    if (this.value < other.value) {
      throw new InsufficientBalanceException();
    }
    return new Amount({ value: this.value - other.value, currency: this.currency });
  }

  public isLessThan(other: Amount): boolean {
    if (other.currency !== this.currency) {
      throw new CurrencyMismatchException(this.currency, other.currency);
    }
    return this.value < other.value;
  }

  public isNegative(): boolean { return this.value < 0; }
}
```

### CLABE validator (Mexican bank account number)

```typescript
export class Clabe extends ValueObject<{ value: string }> {
  private static readonly CLABE_LENGTH = 18;
  private static readonly CLABE_BANKS: Record<string, string> = {
    '002': 'Banamex', '012': 'Bancomer', '014': 'Santander', '021': 'HSBC',
  };

  public static create(value: string): Clabe {
    const cleaned = value.replace(/\s/g, '');
    if (cleaned.length !== Clabe.CLABE_LENGTH) throw new InvalidClabeException('CLABE must be 18 digits');
    if (!/^\d+$/.test(cleaned)) throw new InvalidClabeException('CLABE must contain only digits');
    const bankCode = cleaned.substring(0, 3);
    if (!Clabe.CLABE_BANKS[bankCode]) throw new InvalidClabeException('Invalid bank code');
    if (!Clabe.validateChecksum(cleaned)) throw new InvalidClabeException('Invalid CLABE checksum');
    return new Clabe({ value: cleaned });
  }

  private static validateChecksum(value: string): boolean {
    const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
    let sum = 0;
    for (let i = 0; i < 17; i++) sum += (parseInt(value[i]) * weights[i]) % 10;
    return (10 - (sum % 10)) % 10 === parseInt(value[17]);
  }

  public getBankCode(): string { return this.props.value.substring(0, 3); }
  public getValue(): string { return this.props.value; }
}
```

### RFC/CURP validators (Mexican tax IDs)

```typescript
export class Rfc extends ValueObject<{ value: string }> {
  private static readonly RFC_REGEX = /^[A-Z&Ñ]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A-Z]$/;
  public static create(value: string): Rfc {
    const normalized = value.toUpperCase();
    if (!Rfc.RFC_REGEX.test(normalized)) throw new InvalidRfcException(value);
    return new Rfc({ value: normalized });
  }
}

export class Curp extends ValueObject<{ value: string }> {
  private static readonly CURP_REGEX = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d$/;
  public static create(value: string): Curp {
    const normalized = value.toUpperCase();
    if (!Curp.CURP_REGEX.test(normalized)) throw new InvalidCurpException(value);
    return new Curp({ value: normalized });
  }
}
```

---

## Quality Checklist

```
[ ] Immutable props (Object.freeze)
[ ] Factory method with validation
[ ] Structural equality (equals method)
```
