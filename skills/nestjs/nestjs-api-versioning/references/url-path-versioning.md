# URL Path Versioning Implementation

Versioned routes and message patterns live in constants as a single source of truth. The controller map ties the REST route to the TCP message pattern for each version.

---

## Controller Map with Version

```typescript
// libs/common_core/src/domain/constants/user.constant.ts
export const UserControllerName = 'users';

export const UserRoutesV1 = {
  GET_USERS: '/v1/users',
  GET_USER_BY_ID: '/v1/users/:id',
  CREATE_USER: '/v1/users',
} as const;

export const UserRoutesV2 = {
  GET_USERS: '/v2/users',
  GET_USER_BY_ID: '/v2/users/:id',
  CREATE_USER: '/v2/users',
} as const;

export const UserMessagePatternsV1 = {
  GET_USERS: 'v1.users.get.all',
  GET_USER_BY_ID: 'v1.users.get.by.id',
  CREATE_USER: 'v1.users.create',
} as const;

export const UserMessagePatternsV2 = {
  GET_USERS: 'v2.users.get.all',
  GET_USER_BY_ID: 'v2.users.get.by.id',
  CREATE_USER: 'v2.users.create',
} as const;
```

**Why separate V1/V2**: Message patterns shouldn't conflict between versions. v1 consumer shouldn't accidentally receive v2 messages.

---

## Quality Checklist

```
[ ] Routes versioned by URL path
[ ] Message patterns versioned per version
[ ] Constants are single source of truth (as const)
```
