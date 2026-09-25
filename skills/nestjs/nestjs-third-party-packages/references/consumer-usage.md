# Consumer Usage

How a service consumes the storage library.

---

## Module Registration

```typescript
// apps/some-service/src/some-service.module.ts
import { Module } from '@nestjs/common';
import { StorageCdnModule } from '@app/storage_cdn';

@Module({
  imports: [
    StorageCdnModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        bucket: configService.get('AWS_S3_BUCKET'),
        region: configService.get('AWS_REGION'),
        accessKey: configService.get('AWS_ACCESS_KEY_ID'),
        secretKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class SomeServiceModule {}
```

---

## Usage in Service

```typescript
// Usage in service
@Injectable()
export class DocumentService {
  constructor(@InjectStorage() private readonly storageService: StorageServicePort) {}

  async uploadDocument(file: Buffer): Promise<string> {
    const result = await this.storageService.uploadFile({
      fileName: file.originalname,
      content: file.buffer,
      mimeType: file.mimetype,
      path: 'documents',
    });
    return result.url;
  }
}
```

---

## Quality Checklist

```
[ ] Consumer registers lib module with config
[ ] Uses port via decorator
```
