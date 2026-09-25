# Module Registration with Async Options

The core module builds the provider from options via `registerAsync`.

---

## StorageCoreModule

```typescript
// libs/storage_cdn/src/storage-core.module.ts
@Module({
  providers: [
    {
      provide: STORAGE_OPTIONS,
      useFactory: (configService: ConfigService) => ({
        bucket: configService.get('AWS_S3_BUCKET'),
        region: configService.get('AWS_REGION'),
        accessKey: configService.get('AWS_ACCESS_KEY_ID'),
        secretKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      }),
      inject: [ConfigService],
    },
    {
      provide: STORAGE_TOKEN,
      useFactory: (options: StorageOptions) => getS3Client({ accessKeyId: options.accessKey, secretAccessKey: options.secretKey, region: options.region }),
      inject: [STORAGE_OPTIONS],
    },
    StorageService,
  ],
  exports: [StorageService],
})
export class StorageCoreModule {
  static registerAsync(options: StorageAsyncOptions): DynamicModule {
    return {
      module: StorageCoreModule,
      imports: options.imports || [],
      providers: [{ provide: STORAGE_OPTIONS, useFactory: async (...args) => await options.useFactory(...args), inject: options.inject || [] }],
    };
  }
}
```

---

## Quality Checklist

```
[ ] Config via registerAsync
[ ] Options bound to factory
[ ] Provider built from options
```
