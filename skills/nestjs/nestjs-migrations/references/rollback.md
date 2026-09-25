# Rolling Back Migrations

Always ensure `down()` properly reverses `up()`.

---

## down() Example

```typescript
public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.dropTable('merchant_onboarding_steps');
  await queryRunner.dropColumn('users', 'onboarding_completed');
  await queryRunner.query(`DELETE FROM roles WHERE name = 'DEFAULT_ROLE'`);
}
```

**Why test down()**: Before deploying, test rollback in staging. Reversibility is critical.

---

## Quality Checklist

```
[ ] down() reverses up() fully
[ ] Rollback tested in staging
```
