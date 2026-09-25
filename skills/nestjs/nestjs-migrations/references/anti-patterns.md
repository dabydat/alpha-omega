# Migration Anti-Patterns

These are the common mistakes in migrations.

---

## ❌ No rollback plan

```typescript
// INCORRECT: No down() implementation
public async down(queryRunner: QueryRunner): Promise<void> {
  // Nothing!
}
```

**Fix**: Always implement down() for rollback capability.

---

## ❌ Destructive operations without backup

```typescript
// INCORRECT: Drop table without confirmation
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.dropTable('important_data');
}
```

**Fix**: Add data backup step before destructive operations.

---

## ❌ Long-running migrations on large tables

```typescript
// INCORRECT: Alter millions of rows in single statement
await queryRunner.query(`UPDATE users SET new_column = old_column WHERE millions of rows`);
```

**Fix**: Batch updates, run during maintenance window, use online schema change tools.

---

## Quality Checklist

```
[ ] down() implemented
[ ] Backup before destructive ops
[ ] Long migrations batched
```
