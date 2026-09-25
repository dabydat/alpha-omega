# Module Definition Pattern

Separate the public module (entry point) from the internal core module (implementation).

---

## Main Module (Public API)

```typescript
// libs/oauth/src/oauth.module.ts
import { Module, Global } from '@nestjs/common';
import { OAUTH_TOKEN } from './constants';
import { OAuthCoreModule } from './oauth-core.module';

@Global()
@Module({
  imports: [OAuthCoreModule],
  providers: [
    {
      provide: OAUTH_TOKEN,
      useFactory: (coreModule: OAuthCoreModule) => coreModule.service,
      inject: [OAuthCoreModule],
    },
  ],
  exports: [OAUTH_TOKEN],
})
export class OAuthModule {}
```

**Why `@Global()`**: Makes the module available everywhere without importing in each module. Use sparingly — only for truly global dependencies (auth, logging, config).

---

## Core Module (Internal Implementation)

```typescript
// libs/oauth/src/oauth-core.module.ts
import { Module } from '@nestjs/common';
import { OAuthService } from './services/authentication.service';
import { ApiService } from './services/api.services';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  providers: [OAuthService, ApiService, AuthGuard, RolesGuard],
  exports: [OAuthService, ApiService, AuthGuard, RolesGuard],
})
export class OAuthCoreModule {
  constructor(private readonly oauthService: OAuthService) {}
  get service(): OAuthService { return this.oauthService; }
}
```

**Why separate CoreModule**: Core module contains implementation. Main module wraps it and provides the token interface. This allows swapping implementation without changing the interface.

---

## Quality Checklist

```
[ ] Public module + internal core module
[ ] @Global() only for truly cross-cutting
[ ] Main module provides token interface
```
