# Migration Anatomy

A migration implements `MigrationInterface` with `up()` (forward) and `down()` (rollback).

---

## Full Migration

```typescript
// apps/authentication/src/user/infrastructure/persistence/migrations/1744086855494-create-roles-table.ts
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRolesTable1744086855494 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'name', type: 'varchar', length: '100', isUnique: true },
          { name: 'description', type: 'varchar', length: '255', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('roles');
  }
}
```

**Why `up` and `down`**: Forward (up) and backward (down) migrations. `down` is rollback.

---

## Quality Checklist

```
[ ] Implements MigrationInterface
[ ] up() and down() symmetric
[ ] Timestamped filename
```
