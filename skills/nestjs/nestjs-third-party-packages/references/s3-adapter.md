# AWS S3 Adapter

The S3 provider is built from options and wrapped by a `StorageService` that implements the port.

---

## Provider Configuration

```typescript
// libs/storage_cdn/src/providers/get-s3-aws-client.ts
import S3 from 'aws-sdk/clients/s3';

export function getS3Client(config: { accessKeyId: string; secretAccessKey: string; region: string; }): S3 {
  return new S3({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region,
    s3ForcePathStyle: false,
    signatureVersion: 'v4',
  });
}
```

---

## Storage Service

```typescript
// libs/storage_cdn/src/services/storage.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { StorageServicePort } from '../interfaces/storage-service-port';
import { StorageS3UploadFileRequest } from '../interfaces/models/storage-s3-upload-file.request';
import { StorageS3UploadFileResponse } from '../interfaces/models/storage-s3-upload-file.response';
import { StorageS3FileUrlRequest } from '../interfaces/models/storage-s3-file-url.request';
import { StorageS3FileUrlResponse } from '../interfaces/models/storage-s3-file-url.response';
import { STORAGE_TOKEN } from '../constants/storage-token.constant';

@Injectable()
export class StorageService implements StorageServicePort {
  constructor(@Inject(STORAGE_TOKEN) private readonly provider: S3) {}

  async uploadFile(request: StorageS3UploadFileRequest): Promise<StorageS3UploadFileResponse> {
    const key = `${request.path || 'files'}/${Date.now()}-${request.fileName}`;
    try {
      const result = await this.provider
        .upload({ Bucket: process.env.AWS_S3_BUCKET, Key: key, Body: request.content, ContentType: request.mimeType, ACL: 'public-read' })
        .promise();
      return { key: result.Key, url: result.Location, etag: result.ETag };
    } catch (error) {
      throw new StorageS3Exception(`Failed to upload file: ${error.message}`, error.code);
    }
  }

  async getFileUrl(request: StorageS3FileUrlRequest): Promise<StorageS3FileUrlResponse> {
    try {
      const url = this.provider.getSignedUrlPromise('getObject', { Bucket: process.env.AWS_S3_BUCKET, Key: request.key, Expires: request.expiresIn || 3600 });
      return { url };
    } catch (error) {
      throw new StorageS3Exception(`Failed to generate URL: ${error.message}`, error.code);
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      await this.provider.deleteObject({ Bucket: process.env.AWS_S3_BUCKET, Key: fileName }).promise();
    } catch (error) {
      throw new StorageS3Exception(`Failed to delete file: ${error.message}`, error.code);
    }
  }
}
```

---

## Quality Checklist

```
[ ] SDK wrapped in provider/service
[ ] Errors classified into typed exceptions
[ ] Config via env/secrets, not hardcoded
```
