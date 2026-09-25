# Library Structure

The integration library follows a consistent structure.

---

## Folder Tree

```
libs/storage_cdn/
├── src/
│   ├── index.ts                        # Barrel export
│   ├── storage_cdn.module.ts           # Main module
│   ├── storage-core.module.ts         # Core module
│   ├── constants/
│   │   ├── index.ts
│   │   ├── storage-token.constant.ts  # DI token
│   │   └── storage-provider-token.constant.ts
│   ├── interfaces/
│   │   ├── index.ts
│   │   ├── storage-options.ts
│   │   ├── storage-options-factory.ts
│   │   ├── storage-async-options.ts
│   │   └── models/
│   │       ├── storage-s3-upload-file.request.ts
│   │       ├── storage-s3-upload-file.response.ts
│   │       ├── storage-s3-file-url.request.ts
│   │       └── storage-s3-file-url.response.ts
│   ├── services/
│   │   ├── index.ts
│   │   ├── storage.service.ts          # Main service
│   │   ├── storage-s3.provider.ts     # S3 provider
│   │   └── aws.service.ts             # AWS SDK wrapper
│   ├── providers/
│   │   ├── index.ts
│   │   └── get-s3-aws-client.ts       # Client factory
│   ├── exceptions/
│   │   ├── index.ts
│   │   ├── storage.exception.ts
│   │   ├── storage-s3.exception.ts
│   │   └── not-found.exception.ts
│   └── decorators/
│       ├── index.ts
│       └── inject-storage-aws.ts       # DI decorator
```

---

## Quality Checklist

```
[ ] index.ts barrel
[ ] Module + core module
[ ] Folders by concern
```
