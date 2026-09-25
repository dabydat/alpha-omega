# Consumer Usage

How a service consumes a shared library.

---

## Module Registration

```typescript
// apps/some-service/src/some-service.module.ts
import { Module } from '@nestjs/common';
import { OAuthModule } from '@app/oauth';

@Module({
  imports: [
    OAuthModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        baseUrl: configService.get('OAUTH_BASE_URL'),
        clientId: configService.get('OAUTH_CLIENT_ID'),
        clientSecret: configService.get('OAUTH_CLIENT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class SomeServiceModule {}
```

---

## Quality Checklist

```
[ ] Consumer imports the lib module
[ ] registerAsync with config
```
