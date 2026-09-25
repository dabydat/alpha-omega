# Mapper Index Pattern

Export all mappers from one place for clean imports.

---

## index.ts

```typescript
// infrastructure/mappers/index.ts
export * from './entity.mapper';
export * from './address.mapper';
export * from './branch.mapper';
export * from './sub-entity.mapper';
export * from './document.mapper';

// Usage
import { EntityMapper, AddressMapper } from '../../mappers';
```

**Why index file**: Single import point. Add new mapper = add one line to index.

---

## Quality Checklist

```
[ ] All mappers exported from index
[ ] Single import point
```
