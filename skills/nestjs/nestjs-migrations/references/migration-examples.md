# Migration Examples

Full migration examples covering create tables, foreign keys, data migrations with conditions, and multi-step column migrations.

---

## Example 1: Complete create table migration

```typescript
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex, TableColumn } from 'typeorm';

export class CreateUsersTable1743108973078 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'email', type: 'varchar', length: '255', isUnique: true },
          { name: 'password_hash', type: 'varchar', length: '255' },
          { name: 'status', type: 'varchar', length: '50', default: "'ACTIVE'" },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

---

## Example 2: Create table with foreign keys

```typescript
export class CreateUserRolesTable1744087462450 implements MigrationInterface {
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
        name: 'FK_user_roles_user_id',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'user_roles',
      new TableForeignKey({
        name: 'FK_user_roles_role_id',
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_roles');
  }
}
```

---

## Example 3: Data migration with conditions

```typescript
export class MigrateUserDepartments1749511924184 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query(`
      SELECT id, email FROM users
      WHERE migrated = false AND email LIKE '%@company.com'
    `);

    for (const user of users) {
      await queryRunner.query(`
        UPDATE users
        SET department = 'CORPORATE',
            migrated = true,
            migrated_at = now()
        WHERE id = $1
      `, [user.id]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE users
      SET department = NULL, migrated = false, migrated_at = NULL
      WHERE migrated = true
    `);
  }
}
```

---

## Example 4: Multi-step column migration

```typescript
// Step 1: Add nullable column
export class AddPhoneColumn1749520000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({ name: 'new_phone', type: 'varchar', length: '30', isNullable: true }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'new_phone');
  }
}

// Step 2: Migrate data (separate migration)
// Step 3: Add NOT NULL constraint
```

---

## Quality Checklist

```
[ ] up()/down() symmetric
[ ] Foreign keys named
[ ] Data migrations reversible
[ ] Multi-step split into separate migrations
```
