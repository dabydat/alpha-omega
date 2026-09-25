# Creating Tables

## Basic Table

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.createTable(
    new Table({
      name: 'users',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true },
        { name: 'email', type: 'varchar', length: '255', isUnique: true },
        { name: 'password_hash', type: 'varchar', length: '255' },
        { name: 'status', type: 'varchar', length: '50', default: "'ACTIVE'" },
        { name: 'created_at', type: 'timestamp', default: 'now()' },
        { name: 'updated_at', type: 'timestamp', default: 'now()' },
      ],
    }),
  );
}
```

---

## Table with Foreign Keys

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.createTable(
    new Table({
      name: 'user_roles',
      columns: [
        { name: 'user_id', type: 'uuid' },
        { name: 'role_id', type: 'uuid' },
        { name: 'created_at', type: 'timestamp', default: 'now()' },
      ],
    }),
  );

  await queryRunner.createForeignKey(
    'user_roles',
    new TableForeignKey({
      columnNames: ['user_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'CASCADE',
    }),
  );
}
```

---

## Table with Indexes

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.createTable(
    new Table({
      name: 'transactions',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true },
        { name: 'user_id', type: 'uuid' },
        { name: 'amount', type: 'decimal', precision: 15, scale: 2 },
        { name: 'status', type: 'varchar', length: '50' },
        { name: 'created_at', type: 'timestamp', default: 'now()' },
      ],
    }),
  );

  await queryRunner.createIndex('transactions', new TableIndex({ name: 'IDX_TRANSACTIONS_USER_ID', columnNames: ['user_id'] }));
  await queryRunner.createIndex('transactions', new TableIndex({ name: 'IDX_TRANSACTIONS_STATUS', columnNames: ['status'] }));
}
```

---

## Quality Checklist

```
[ ] Table with primary key
[ ] Foreign keys with onDelete
[ ] Indexes on query columns
```
