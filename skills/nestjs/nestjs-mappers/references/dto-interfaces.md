# DTO Interfaces (Application Layer)

DTOs are defined as interfaces, not classes. Interfaces are pure type declarations.

---

## DTO Interfaces

```typescript
// Application DTOs (interfaces, not classes)

// For type safety in handlers and mappers
export interface EntityResponse {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
}

export interface EntityDetailDto {
  id: string;
  name: string;
  email: string;
  phone: { country: string; number: string };
  type?: string;
  status: string;
  addresses: AddressDto[];
  createdAt: string;
  updatedAt: string;
}

export interface AddressDto {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  type: string;
}
```

**Why interfaces not classes**: DTOs are pure data containers. No behavior. No need for instantiation.

---

## Quality Checklist

```
[ ] DTOs are interfaces, not classes
[ ] Pure data containers
```
