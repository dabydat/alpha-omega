# Parallel Execution

Independent async operations MUST run in parallel, never sequential. This is a Backend Dev non-negotiable.

---

## Promise.all Pattern

```typescript
async execute(command: SaveDocumentsCommand): Promise<MerchantDocument[]> {
  // INCORRECT: Sequential (slow)
  // const doc1 = await this.storageService.saveDocuments(merchantId, [file1]);
  // const doc2 = await this.storageService.saveDocuments(merchantId, [file2]);

  // CORRECT: Parallel (fast)
  const results = await Promise.all(
    matchedFiles.map(async (match) => {
      const urls = await this.storageService.saveDocuments(merchantId, [match]);
      if (urls && urls.length > 0) {
        return MerchantDocument.create({ merchantId, url: urls[0], type: match.type });
      }
      return null;
    }),
  );

  return results.filter((r): r is MerchantDocument => r !== null);
}
```

**When to use `Promise.all`**: All operations must succeed. If any fails, entire operation fails.

---

## Parallel Independent Queries

```typescript
// Example: Parallel independent queries
async getDashboard(userId: string): Promise<DashboardData> {
  const [user, orders, notifications] = await Promise.all([
    this.userQueryBus.execute(new GetUserQuery(userId)),
    this.queryBus.execute(new GetRecentOrdersQuery(userId)),
    this.queryBus.execute(new GetUnreadNotificationsQuery(userId)),
  ]);

  return { user, orders, notifications };
}
```

**When to use `Promise.allSettled`**: Partial failures acceptable. Collect all results, handle each individually.

---

## Quality Checklist

```
[ ] Independent async ops use Promise.all
[ ] No sequential awaits for independent work
[ ] Promise.allSettled for partial-failure tolerant work
```
