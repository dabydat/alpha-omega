# Multi-Step Migrations

For complex changes, split into multiple migrations.

---

## Three-Step Migration

```typescript
// migration 1: Add new column (nullable)
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.addColumn('users', new TableColumn({ name: 'new_phone', type: 'varchar', length: '30', isNullable: true }));
}

// migration 2: Migrate data
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`UPDATE users SET new_phone = phone WHERE phone IS NOT NULL`);
}

// migration 3: Add NOT NULL constraint
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.changeColumn('users', 'new_phone', new TableColumn({ name: 'new_phone', type: 'varchar', length: '30', isNullable: false }));
}
```

**Why split**: Adding nullable column first, migrating data, then adding constraint avoids downtime and data loss.

---

## Quality Checklist

```
[ ] Add nullable → migrate data → add constraint
[ ] Avoid downtime and data loss
```
