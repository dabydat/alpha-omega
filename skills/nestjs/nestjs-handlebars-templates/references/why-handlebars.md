# Why Handlebars

Handlebars templates enable server-side rendering for email templates, password reset flows, and interactive OIDC screens. They provide logic-less templates that are secure and maintainable.

---

## Core Principle: Template separated from logic

```
INCORRECT:  HTML as string concatenation
            const html = '<html><body><h1>Hello ' + userName + '</h1></body></html>';

CORRECT:    Template separated from logic
            views/otp.hbs: <h1>Hola {{userName}}</h1>
            renderTemplate('otp', { userName: user.name });
```

**Why it's good**:
- Templates are separate files
- Designers can edit templates without touching code
- Helpers provide logic where needed
- Partials for reuse
- Automatic escaping prevents XSS

---

## Quality Checklist

```
[ ] Templates are separate .hbs files, not string concat
[ ] Automatic escaping (double braces) for user data
[ ] Partials for reuse
[ ] Business logic stays in controllers/services
```
