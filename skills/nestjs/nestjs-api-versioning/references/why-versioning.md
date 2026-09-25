# Why API Versioning

APIs evolve. Versioning allows API changes without breaking existing clients. Without versioning, any change cascades as breaking change to all consumers.

---

## Problem Without Versioning

```typescript
// ❌ BAD: Breaking change without version
// Client uses /users endpoint
GET /users
Response: { id, name, email }

// Server updates to new format
Response: { id, firstName, lastName, emailAddress }

// All existing clients break!
```

**Why it's bad**:
- No way to support legacy clients
- Breaking changes require coordinated deployment
- Can't iterate quickly

---

## Solution With Versioning

```
GET /v1/users     → { id, name, email }
GET /v2/users     → { id, firstName, lastName, emailAddress }
```

**Why it's good**:
- Legacy clients continue working
- New clients use new format
- Versioned APIs can be supported independently

---

## Quality Checklist

```
[ ] Breaking changes use a new version
[ ] Old versions keep working for legacy clients
[ ] Version communicated clearly (URL/header/query)
```
