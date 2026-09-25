# Library Structure

Each library follows a consistent structure.

---

## Folder Tree

```
libs/
├── oauth/
│   └── src/
│       ├── index.ts                    # Public API barrel export
│       ├── oauth.module.ts            # Main module (public)
│       ├── oauth-core.module.ts       # Core module (internal)
│       ├── constants/
│       │   ├── index.ts
│       │   ├── oauth-token.constant.ts     # DI token
│       │   └── oauth-module-token.constant.ts
│       ├── interfaces/
│       │   ├── index.ts
│       │   ├── oauth-options.ts             # Module options interface
│       │   ├── oauth-options-factory.ts    # Options factory interface
│       │   └── oauth-async-options.ts      # Async options interface
│       ├── services/
│       │   ├── index.ts
│       │   ├── authentication.service.ts
│       │   └── api.services.ts
│       ├── guards/
│       │   ├── index.ts
│       │   ├── auth.guard.ts
│       │   └── roles.guard.ts
│       ├── decorators/
│       │   ├── index.ts
│       │   └── user-details.decorator.ts
│       ├── exceptions/
│       │   ├── index.ts
│       │   └── oauth.exception.ts
│       └── (other domain-specific code)
```

---

## Quality Checklist

```
[ ] index.ts barrel export
[ ] {name}.module.ts public + {name}-core.module.ts internal
[ ] Folders by concern (constants, interfaces, services, guards, decorators, exceptions)
```
