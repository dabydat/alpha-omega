# Controller Maps (Route + Message Pattern)

The ControllerMap ties each action to its REST route and its TCP message pattern. It is the single source of truth used by both the BFF gateway and the microservice.

---

## Controller Map with Version

```typescript
// libs/common_core/src/domain/constants/authentication.constant.ts

// Controller identity
export const AuthenticationControllerName: string = 'auth';
export const AuthenticationControllerTag: string = 'AUTHENTICATION';

// Routes enum
export const AuthenticationRoutes = {
  FORGOT_PASSWORD_RESET: '/forgot-password/reset',
  SET_PASSWORD: '/set-password/:code',
  CREATE_USER: '/users',
  // ...
} as const;

// Message patterns enum
export enum AuthenticationMessagePatterns {
  FORGOT_PASSWORD_RESET = 'FORGOT_PASSWORD_RESET',
  SET_PASSWORD = 'SET_PASSWORD',
  CREATE_USER = 'CREATE_USER',
  // ...
}

// Combined map: single source for route + pattern
export const AuthenticationControllerMap: Record<
  keyof typeof AuthenticationRoutes,
  ControllerAction<AuthenticationMessagePatterns>
> = {
  FORGOT_PASSWORD_RESET: {
    ROUTE: AuthenticationRoutes.FORGOT_PASSWORD_RESET,
    MESSAGE_PATTERN: AuthenticationMessagePatterns.FORGOT_PASSWORD_RESET,
  },
  // ...
};
```

**Why separate Routes from Patterns**:
- Routes used by REST (BFF gateway)
- Patterns used by TCP (microservices)
- Same action has both

---

## ControllerAction Type (Deep Dive)

```typescript
export type ControllerAction<T extends string> = {
  ROUTE: string;
  MESSAGE_PATTERN: T;
};

export const AuthenticationControllerMap: Record<
  keyof typeof AuthenticationRoutes,
  ControllerAction<AuthenticationMessagePatterns>
> = {
  FORGOT_PASSWORD_RESET: {
    ROUTE: AuthenticationRoutes.FORGOT_PASSWORD_RESET,  // '/forgot-password/reset'
    MESSAGE_PATTERN: AuthenticationMessagePatterns.FORGOT_PASSWORD_RESET,  // 'FORGOT_PASSWORD_RESET'
  },
  // ...
};
```

**Why this structure**:
- Single source of truth for each action
- Type-safe (can't have route without pattern)
- IntelliSense for available actions
- Refactoring easy (change in one place)

---

## Quality Checklist

```
[ ] Controller map ties ROUTE + MESSAGE_PATTERN
[ ] Routes used by REST, patterns by TCP
[ ] Type-safe ControllerAction<T>
```
