# DI Decorator

A custom decorator wraps `@Inject(STORAGE_TOKEN)` to reduce boilerplate.

---

## InjectStorage

```typescript
// libs/storage_cdn/src/decorators/inject-storage-aws.ts
import { Inject } from '@nestjs/common';
import { STORAGE_TOKEN } from '../constants/storage-token.constant';

export const InjectStorage = () => Inject(STORAGE_TOKEN);
```

**Why custom decorator**: Reduces boilerplate across services.

---

## Quality Checklist

```
[ ] Custom decorator wraps Inject
[ ] Reduces boilerplate
```
