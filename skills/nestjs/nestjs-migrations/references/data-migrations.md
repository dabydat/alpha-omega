# Data Migrations

Migrations aren't just schema changes - they can also seed or transform data.

---

## Insert Default Data

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    INSERT INTO roles (id, name, description, created_at, updated_at)
    VALUES
      (uuid_generate_v4(), 'ADMIN', 'Administrator role', now(), now()),
      (uuid_generate_v4(), 'USER', 'Regular user role', now(), now()),
      (uuid_generate_v4(), 'MERCHANT', 'Merchant user role', now(), now())
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`DELETE FROM roles WHERE name IN ('ADMIN', 'USER', 'MERCHANT')`);
}
```

---

## Transform Existing Data

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`UPDATE users SET status = 'ACTIVE' WHERE status = 'ENABLED'`);
  await queryRunner.query(`UPDATE users SET status = 'INACTIVE' WHERE status = 'DISABLED'`);
}
```

---

## Quality Checklist

```
[ ] Seed data has reversible down()
[ ] Data transforms idempotent/safe
```
