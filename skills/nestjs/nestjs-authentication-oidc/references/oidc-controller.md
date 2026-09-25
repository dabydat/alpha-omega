# OIDC Controller

The OIDC controller handles the provider endpoints (logout, callback) that the OIDC provider serves. It mounts the provider and exposes logout.

---

## OIDC Controller

```typescript
@Controller('oidc')
export class OidcController {
  @Post('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
    if (token) await this.oidcProviderService.logout(token);
    res.status(200).json({ message: 'Session termination processed.' });
  }

  @All('/*')
  async mountedOidc(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.oidcProviderService.oidc.callback()(req, res);
  }
}
```

**Why `All('/*')`**: OIDC provider handles standard endpoints automatically.

**Why logout revokes server-side**: The token must be invalidated in the provider, not just removed client-side.

---

## Quality Checklist

```
[ ] Logout revokes the token server-side
[ ] mountedOidc delegates to oidc.callback()
[ ] OIDC provider handles standard endpoints automatically
```
