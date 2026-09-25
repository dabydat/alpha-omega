# Why Migrations

Database migrations provide versioned, reversible schema changes. TypeORM migrations ensure database schema evolves consistently across environments.

---

## Core Principle

```
INCORRECT:  Schema changes applied directly
            ALTER TABLE users ADD COLUMN phone VARCHAR(20);
            -- No version tracking, no rollback plan

CORRECT:    Migration files version control schema
            Migration files in git, consistent across environments
            Rollback capability, team visibility
```

---

## Migration File Naming

Timestamp format: `{timestamp}-{description}.ts`

```
migrations/
├── 1743108973078-create-users-table.ts
├── 1743304847729-create-clients-table.ts
├── 1744086855494-create-roles-table.ts
└── 1744087462450-create-user-roles-table.ts
```

**Why timestamp**: Ensures unique ordering. Migrations run in timestamp order.

---

## Quality Checklist

```
[ ] Schema changes via migration files
[ ] Timestamped naming for ordering
[ ] Rollback capability (down)
```
