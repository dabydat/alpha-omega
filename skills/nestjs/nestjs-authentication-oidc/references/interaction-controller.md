# Interaction Controller

The interaction controller handles user-facing screens - login forms, OTP verification, and consent screens.

---

## Interaction Flow

```
User clicks login
  -> /authorize endpoint (OIDC)
  -> interaction/details shows prompt (login/consent)
  -> InteractionController renders screen
  -> User submits form
  -> OIDC interactionFinished called
  -> Token issued to client
```

---

## Interaction Controller Implementation

```typescript
@Controller('interaction')
export class InteractionController {
  @Get(':uid')
  async renderInteraction(@Req() req: Request, @Res() res: Response): Promise<void> {
    const details = await this.oidcProviderService.oidc.interactionDetails(req, res);

    switch (details.prompt.name) {
      case 'login':
        return this.renderTemplate(res, 'login', { uid: req.params.uid });
      case 'consent':
        await this.oidcProviderService.oidc.interactionFinished(req, res,
          { consent: {} }, { mergeWithLastSubmission: true });
        return;
      default:
        return this.renderErrorTemplate(res, 'Unknown prompt type.');
    }
  }

  @Post(':uid/login')
  async login(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const user = await this.commandBus.execute(new AuthenticationCommand(req.body.email, req.body.password));
      return this.renderTemplate(res, 'otp', {
        uid: req.params.uid,
        params: { userId: user.id, phone: user.phone },
      });
    } catch (err) {
      return this.renderTemplate(res, 'login', { uid: req.params.uid, flash: err.message });
    }
  }

  @Post(':uid/otp')
  async otp(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const user = await this.commandBus.execute(new ValidateOtpCommand(req.body.otp, req.body.userId));
      await this.oidcProviderService.oidc.interactionFinished(req, res,
        { login: { accountId: user.id }, consent: { grantId: req.params.uid } },
        { mergeWithLastSubmission: false });
    } catch (err) {
      return this.renderTemplate(res, 'otp', { uid: req.params.uid, flash: err.message });
    }
  }
}
```

---

## Prompt Types

| Prompt | When | Action |
|--------|------|--------|
| `login` | No active session | Show login form |
| `consent` | Token needs approval | Show permissions list |
| `select_account` | Multiple sessions | Account picker |

---

## Interaction Details

```typescript
const details = await this.oidcProviderService.oidc.interactionDetails(req, res);

// details.prompt.name - which prompt to show
// details.prompt.mode - 'login' | 'consent' | 'select_account'
// details.params - original auth request parameters
// details.session - current user session (if any)
// detailsGrantId - unique interaction ID
```

---

## Template Rendering

```typescript
private renderTemplate(res: Response, template: string, data: Record<string, any>): void {
  res.render(template, {
    ...data,
    layout: false,
  });
}

private renderErrorTemplate(res: Response, message: string): void {
  res.status(400).render('error', { message });
}
```

---

## Session Management

After successful login:

```typescript
await this.oidcProviderService.oidc.interactionFinished(req, res,
  { login: { accountId: user.id } },
  { mergeWithLastSubmission: false }
);
```

The `login` object with `accountId` creates the session. Subsequent interactions use this session.

---

## Quality Checklist

```
[ ] /interaction/:uid renders correct screen based on prompt
[ ] Login form validates email/password
[ ] OTP verification validates against user's phone
[ ] interactionFinished called after successful verification
[ ] Error messages flash on failed attempts
[ ] Consent screen shows requested scopes
```