# Why Abstraction Matters

Services integrate with external systems (AWS S3, AWS SNS, banks, payment processors). Each integration follows patterns for abstraction, error handling, and retry logic.

---

## Problem Without Abstraction

```typescript
// ❌ BAD: Direct AWS SDK in services
import AWS from 'aws-sdk';

async uploadFile(file: Buffer) {
  const s3 = new AWS.S3({ accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_KEY });
  const result = await s3.upload({ Bucket: 'my-bucket', Key: `files/${Date.now()}`, Body: file }).promise();
  return result.Location;
}
```

**Why it's bad**:
- AWS SDK coupled throughout codebase
- Changing provider (S3 → GCS) requires changing everywhere
- Hard to test without actual AWS
- No consistent error handling

---

## Solution With Port/Adapter

```typescript
// ✅ GOOD: Abstract interface
export interface StorageOptions { bucket: string; region: string; accessKey: string; secretKey: string; }
export interface StorageS3UploadFileRequest { fileName: string; content: Buffer; mimeType: string; path?: string; }
export interface StorageServicePort {
  uploadFile(request: StorageS3UploadFileRequest): Promise<StorageS3UploadFileResponse>;
  getFileUrl(fileName: string): Promise<StorageS3FileUrlResponse>;
  deleteFile(fileName: string): Promise<void>;
}
```

---

## Quality Checklist

```
[ ] SDK behind an interface/port
[ ] Provider swappable without changing services
[ ] Testable without real provider
```
