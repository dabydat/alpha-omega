# Usage in Controller

The controller renders templates via the `TemplateEngine`, passing the context the template needs.

---

## InteractionController

```typescript
// apps/authentication/src/oauth/infrastructure/rest/interaction.controller.ts
@Controller('interaction')
export class InteractionController {
  private readonly templateEngine: TemplateEngine;

  constructor() {
    const templateDir = path.resolve(__dirname, 'src/oauth/infrastructure/views');
    this.templateEngine = new TemplateEngine(templateDir);
  }

  private async renderTemplate(res: Response, template: string, context: Record<string, any>): Promise<void> {
    const html = await this.templateEngine.renderTemplate(template, context);
    res.send(html);
  }

  @Get(':uid')
  async renderLogin(@Req() req: Request, @Res() res: Response): Promise<void> {
    const details = await this.oidcProviderService.oidc.interactionDetails(req, res);
    return this.renderTemplate(res, 'login', { uid: req.params.uid, frontUrl: details?.params?.redirect_uri });
  }

  @Post(':uid/login')
  async login(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const user = await this.commandBus.execute(new AuthenticationCommand(req.body.email, req.body.password));
      const { id, phoneCountry, phoneNumber } = user.toPrimitives();

      return this.renderTemplate(res, 'otp', {
        uid: req.params.uid,
        params: { userId: id, phone: `${phoneCountry ?? ''} ${phoneNumber ?? ''}`, seconds: 300 },
      });
    } catch (err) {
      return this.renderTemplate(res, 'login', { uid: req.params.uid, flash: err.message });
    }
  }
}
```

---

## Quality Checklist

```
[ ] Controller renders via TemplateEngine
[ ] Context passed to template includes uid + params
[ ] Error path re-renders with a flash message
```
