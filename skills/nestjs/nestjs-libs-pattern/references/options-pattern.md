# Options Pattern (Configuration)

Libraries need configuration. Use the options pattern for type-safe configuration.

---

## Options Interface

```typescript
// libs/oauth/src/interfaces/oauth-options.ts
export interface OAuthOptions {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}
```

---

## Options Factory Interface

```typescript
// libs/oauth/src/interfaces/oauth-options-factory.ts
import { ModuleMetadata } from '@nestjs/common';
import { OAuthOptions } from './oauth-options';

export interface OAuthOptionsFactory {
  createOAuthOptions(): Promise<OAuthOptions> | OAuthOptions;
}
```

---

## Async Options

```typescript
// libs/oauth/src/interfaces/oauth-async-options.ts
import { ModuleMetadata } from '@nestjs/common';
import { OAuthOptions } from './oauth-options';
import { OAuthOptionsFactory } from './oauth-options-factory';

export interface OAuthAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<OAuthOptions> | OAuthOptions;
  inject?: any[];
  useClass?: new (...args: any[]) => OAuthOptionsFactory;
}
```

---

## Module with Async Options

```typescript
// libs/oauth/src/oauth-core.module.ts (with async config)
@Module({ imports: [ConfigModule.forRoot()] })
export class OAuthCoreModule {
  static registerAsync(options: OAuthAsyncOptions): DynamicModule {
    return {
      module: OAuthCoreModule,
      imports: options.imports || [],
      providers: [
        {
          provide: OAUTH_OPTIONS,
          useFactory: async (...args) => {
            const config = await options.useFactory(...args);
            return config;
          },
          inject: options.inject || [],
        },
      ],
    };
  }
}

// Usage in app module
OAuthModule.registerAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    baseUrl: configService.get('OAUTH_BASE_URL'),
    clientId: configService.get('OAUTH_CLIENT_ID'),
    clientSecret: configService.get('OAUTH_CLIENT_SECRET'),
  }),
  inject: [ConfigService],
})
```

---

## Quality Checklist

```
[ ] Options interface defined
[ ] OptionsFactory interface
[ ] Async options via registerAsync
```
