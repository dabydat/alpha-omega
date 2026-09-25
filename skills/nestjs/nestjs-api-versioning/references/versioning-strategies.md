# Versioning Strategies

Choose the right strategy per situation. URL path is the most common; header keeps URLs clean; query is quick but pollutes the URL.

---

## 1. URL Path Versioning (Most Common)

```
GET /v1/users
GET /v2/users
```

**Why**: Visible in URL, easy to test, most widely supported.

---

## 2. Header Versioning

```
GET /users
Accept: application/vnd.api.v1+json
```

**Why**: URL stays clean, content negotiation.

---

## 3. Query Parameter Versioning

```
GET /users?version=2
```

**Why**: Simple but pollutes URL.

---

## Quality Checklist

```
[ ] Strategy chosen consciously per API
[ ] Version visible to clients
[ ] Consistent across all endpoints
```
