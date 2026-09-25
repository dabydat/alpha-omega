# Exception Handling

Classified exceptions for the storage library.

---

## StorageException Hierarchy

```typescript
// libs/storage_cdn/src/exceptions/storage.exception.ts
export class StorageException extends Error {
  constructor(message: string, code: string = 'STORAGE_ERROR') {
    super(message);
    this.name = 'StorageException';
  }
}

// libs/storage_cdn/src/exceptions/storage-s3.exception.ts
export class StorageS3Exception extends StorageException {
  constructor(message: string, awsErrorCode?: string) {
    super(message, `S3_${awsErrorCode || 'UNKNOWN'}`);
  }
}

// libs/storage_cdn/src/exceptions/not-found.exception.ts
export class StorageFileNotFoundException extends StorageException {
  constructor(fileKey: string) {
    super(`File not found: ${fileKey}`, 'FILE_NOT_FOUND');
  }
}
```

---

## Quality Checklist

```
[ ] Base exception class
[ ] Specific exceptions extend base
[ ] Machine-readable codes
```
