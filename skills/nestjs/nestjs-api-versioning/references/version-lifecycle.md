# Version Lifecycle

A version moves through a predictable lifecycle: active → deprecated → sunset.

---

## Lifecycle

```
v3 (current) → Active, supported
v2 → Deprecated, sunset date announced
v1 → Sunset, removed after sunset date
```

---

## Version Migration Guide

```typescript
// When client uses v1, but v2 is available
@Controller()
export class UsersController {
  @Get('/v1/users')
  @Redirect('https://api.example.com/v2/users', 301)
  async redirectV1() {
    // Deprecated, redirect to v2
  }
}
```

**Why `@Redirect(..., 301)`**: Permanent redirect tells clients (and search engines) the resource moved.

---

## Quality Checklist

```
[ ] Lifecycle states defined (active/deprecated/sunset)
[ ] Sunset date communicated
[ ] Migration guide provided
```
