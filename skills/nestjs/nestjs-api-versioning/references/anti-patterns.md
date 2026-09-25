# API Versioning Anti-Patterns

These are the common mistakes that make versioning a maintenance burden.

---

## ❌ Versioning everything

```typescript
// BAD: Every field change = new version
// v1: { name }
// v2: { firstName }  // New version just for splitting name
// v3: { firstName, lastName }  // Another version
```

**Why it's bad**: Proliferation of versions. Hard to maintain.

**Fix**: Version for breaking changes, not every change. Additive changes (new optional fields) don't need new version.

---

## ❌ No deprecation communication

```typescript
// BAD: Just remove old version without notice
```

**Why it's bad**: Clients break without warning.

**Fix**: Always deprecate before removal. Sunset headers, changelog, migration guides.

---

## ❌ Breaking changes in minor version

```typescript
// BAD: v1.5 with breaking changes
// Version numbers should only increment for major changes
// v1.x → backward compatible additions
// v2.x → breaking changes
```

**Why it's bad**: Version numbers should only increment for major changes.

---

## ❌ No documentation for version differences

```typescript
// BAD: No changelog
// What changed between v1 and v2?
```

**Fix**: Always document what changed and how to migrate.

---

## Quality Checklist

```
[ ] Versions only for breaking changes
[ ] Deprecation communicated before removal
[ ] Breaking changes in major version (v2.x)
[ ] Changelog documents version differences
```
