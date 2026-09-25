# Migration Best Practices

---

## Always Use Transaction

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  const query = queryRunner.connection.createQueryRunner();
  await query.connect();
  await query.startTransaction();

  try {
    await query.createTable(/* ... */);
    await query.createIndex(/* ... */);
    await query.commitTransaction();
  } catch (error) {
    await query.rollbackTransaction();
    throw error;
  } finally {
    await query.release();
  }
}
```

---

## Never Manually Edit Production

```typescript
// INCORRECT: Manual production change
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

// CORRECT: Migration file
await queryRunner.addColumn('users', new TableColumn({ name: 'phone', type: 'varchar', length: '20' }));
```

---

## Environment-Specific Considerations

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.createTable(
    new Table({ name: 'users', /* ... */ }),
    true,  // ifNotExists: true
  );
}
```

---

## Quality Checklist

```
[ ] Migrations in transactions
[ ] No manual prod edits
[ ] ifNotExists for idempotency
```
