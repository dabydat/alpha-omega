# Third-Party Anti-Patterns

These are the common mistakes in third-party integration.

---

## ❌ No error classification

```typescript
// BAD: Generic errors
catch (error) { throw new Error('Upload failed'); }

// Good
catch (error) {
  if (error.code === 'ExpiredToken') { throw new StorageRetryableException(error.message); }
  throw new StorageException(error.message);
}
```

**Why it's bad**: No way to distinguish transient vs permanent failures.

**Fix**: Classify errors.

---

## ❌ No retry mechanism

```typescript
// BAD: Single attempt
async uploadFile(file: Buffer) {
  return this.s3.upload({ Bucket: bucket, Key: key, Body: file }).promise();
}
```

**Why it's bad**: Transient failures (network timeout) cause immediate failure.

**Fix**: Implement retry with exponential backoff.

---

## ❌ Hardcoded credentials

```typescript
// BAD
const s3 = new S3({ accessKeyId: 'AKIAIOSFODNN7EXAMPLE' });
```

**Why it's bad**: Credentials in code = exposed in git history.

**Fix**: Environment variables or secrets manager.

---

## ❌ Synchronous operations blocking

```typescript
// BAD: Upload without async handling
async uploadFile(file: Buffer) {
  await this.s3.upload({ Body: file }).promise();
}
```

**Why it's bad**: Large files cause long blocking times.

**Fix**: Use streams or background jobs for large files.

---

## Quality Checklist

```
[ ] Errors classified (transient vs permanent)
[ ] Retry with backoff
[ ] Credentials in env/secrets
[ ] Async/streams for large files
```
