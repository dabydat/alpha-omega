# Altering Tables

## Add Column

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.addColumn(
    'users',
    new TableColumn({ name: 'phone_number', type: 'varchar', length: '20', isNullable: true }),
  );
}
```

## Remove Column

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.dropColumn('users', 'phone_number');
}
```

## Add Multiple Columns

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.addColumns('merchants', [
    new TableColumn({ name: 'tax_id', type: 'varchar', length: '50', isNullable: true }),
    new TableColumn({ name: 'legal_name', type: 'varchar', length: '255', isNullable: true }),
  ]);
}
```

## Rename Column

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.renameColumn('users', 'old_name', 'new_name');
}
```

## Change Column Type

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.changeColumn(
    'users',
    'phone',
    new TableColumn({ name: 'phone', type: 'varchar', length: '30' }),
  );
}
```

---

## Quality Checklist

```
[ ] Add/drop columns reversible
[ ] Multi-column adds in one call
[ ] Change column type reversible
```
