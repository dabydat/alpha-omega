# Deprecation Strategy

Before removing an old version, communicate deprecation clearly. Use `Deprecation`, `Sunset` and `Link` headers so clients know when and where to migrate.

---

## Sunset Headers

```typescript
@Get(UserRoutesV1.GET_USERS)
@ApiOperation({ summary: 'Get all users (v1 - deprecated)' })
@ApiHeader({ name: 'X-API-Version', description: 'API version' })
async getUsers(@Res() res: Response): Promise<void> {
  // Add deprecation header
  res.setHeader('Deprecation', 'true');
  res.setHeader('Sunset', 'Sat, 31 Dec 2025 23:59:59 GMT');
  res.setHeader('X-API-Version', 'v1');

  // Return v1 response
}
```

---

## Response with Deprecation Warning

```typescript
async getUsers(@Res() res: Response): Promise<UserResponseV1[]> {
  const users = await this.queryBus.execute(new GetUsersQuery());

  res.setHeader('Deprecation', 'true');
  res.setHeader('Sunset', 'Sat, 31 Dec 2025 23:59:59 GMT');
  res.setHeader(
    'Link',
    '<https://api.example.com/v2/users>; rel="successor version"',
  );

  return res.json(users);
}
```

**Why `Link` header**: Points clients to the successor version.

---

## Quality Checklist

```
[ ] Deprecation header sent on old versions
[ ] Sunset date announced
[ ] Link header points to the successor version
```
