# Migration Structure Per Bounded Context

```
apps/authentication/src/
├── user/
│   └── infrastructure/
│       └── persistence/
│           ├── entities/
│           │   └── user.entity.ts
│           └── migrations/
│               ├── 1743108973078-create-users-table.ts
│               └── 1749511924184-alter-users-table.ts
```

**Why separate per context**: Each bounded context owns its schema. Migrations live with the context that owns the tables.

---

## Quality Checklist

```
[ ] Migrations colocated with their context
[ ] Each context owns its schema
```
