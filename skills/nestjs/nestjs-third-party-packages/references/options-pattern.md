# Options Pattern

Configuration for the library via options interfaces.

---

## Options Interfaces

```typescript
// libs/storage_cdn/src/interfaces/storage-options.ts
export interface StorageOptions {
  bucket: string;
  region: string;
  accessKey: string;
  secretKey: string;
  endpoint?: string;  // For custom S3-compatible services
}

// libs/storage_cdn/src/interfaces/storage-options-factory.ts
export interface StorageOptionsFactory {
  createStorageOptions(): Promise<StorageOptions> | StorageOptions;
}

// libs/storage_cdn/src/interfaces/storage-async-options.ts
export interface StorageAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<StorageOptions> | StorageOptions;
  inject?: any[];
  useClass?: new (...args: any[]) => StorageOptionsFactory;
}
```

---

## Quality Checklist

```
[ ] Options interface
[ ] Factory interface
[ ] Async options
```
