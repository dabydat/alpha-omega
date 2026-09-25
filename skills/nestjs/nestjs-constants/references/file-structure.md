# File Structure & Naming Conventions

Constants are split by layer: domain (routes, patterns) vs infrastructure (clients, topics).

---

## File Structure

```
libs/common_core/src/
├── domain/
│   └── constants/
│       ├── index.ts                    # Barrel export
│       ├── authentication.constant.ts  # Authentication controller map
│       ├── merchant.constant.ts        # Merchant controller map
│       ├── account.constant.ts        # Account controller map
│       └── ...
└── infrastructure/
    └── constants/
        ├── index.ts                    # Barrel export
        ├── client.constant.ts          # Client injection tokens
        ├── topic.constant.ts           # Kafka topics
        ├── kafka-groups.constant.ts    # Consumer groups
        ├── regex.constant.ts           # Validation regex patterns
        └── exceptions.constant.ts      # Exception codes
```

---

## Constants Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Module Token | `{NAME}_TOKEN = Symbol('...')` | `OAUTH_TOKEN` |
| Module Module Token | `{NAME}_MODULE_TOKEN = Symbol('...')` | `OAUTH_MODULE_TOKEN` |
| Controller Name | `{Name}ControllerName: string` | `AuthenticationControllerName` |
| Controller Tag | `{Name}ControllerTag: string` | `AuthenticationControllerTag` |
| Routes | `{Name}Routes = { ... } as const` | `AuthenticationRoutes` |
| Message Patterns | `{Name}MessagePatterns = enum` | `AuthenticationMessagePatterns` |
| Controller Map | `{Name}ControllerMap = { ... }` | `AuthenticationControllerMap` |
| Client Constant | `ClientConstant = { ... }` | `ClientConstant.MERCHANT_CLIENT` |
| Topic Constant | `TopicConstant = { ... }` | `TopicConstant.USER_CREATED` |

---

## Quality Checklist

```
[ ] Domain constants separated from infrastructure constants
[ ] Barrel export (index.ts) per folder
[ ] Naming follows the convention table
```
