# Guards (Authentication and Authorization)

Guards implement `CanActivate` interface. They decide if a request can proceed.

---

## Auth Guard (JWT Bearer Token)

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AUTHENTICATION_SERVICE)
    private readonly authenticationService: AuthenticationService,
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'] as string;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    try {
      const token = authHeader.substring(7);
      req['user'] = await this.authenticationService.me({ token });
      return true;
    } catch (error) {
      if (error instanceof AccessDeniedException) {
        throw new ForbiddenException('Insufficient Permissions');
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
```

---

## Roles Guard

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

**Why check both handler and class**: Roles can be declared at controller level (default) or overridden at handler level.

---

## Scopes Guard (OAuth2)

```typescript
@Injectable()
export class ScopesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredScopes = this.reflector.getAllAndOverride<string[]>(SCOPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredScopes) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredScopes.every((scope) => user.scopes?.includes(scope));
  }
}
```

**Why `every()` for scopes**: OAuth2 spec requires all scopes present. Roles use `some()` (any match).

---

## Quality Checklist

```
[ ] AuthGuard verifies JWT and attaches user to request
[ ] RolesGuard checks role decorator metadata
[ ] ScopesGuard requires all scopes (every)
```
