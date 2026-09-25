---
name: nestjs-handlebars-templates
description: Handlebars template patterns for NestJS. Covers email templates, server-side rendering, and template organization. Use when creating email templates, password reset flows, or server-side HTML rendering.
---

# NestJS Handlebars Templates

Handlebars templates enable server-side rendering for email templates, password reset flows, and interactive OIDC screens. They provide logic-less templates that are secure and maintainable.

## Why Handlebars

See `references/why-handlebars.md` for the INCORRECT (string concat) vs CORRECT (template) comparison.

---

## Template Engine Implementation

See `references/template-engine.md` (`TemplateEngine` with partials + render).

---

## Helpers

See `references/helpers.md` (`registerHandlebarsHelpers`).

---

## Template Structure

See `references/template-structure.md` for the `views/` folder layout and key patterns.

---

## Key Template Patterns

See `references/key-template-patterns.md` for OTP, email, error templates and partials.

**Full templates** (assets): `references/otp-template.hbs`, `references/email-template.hbs`, `references/error-template.hbs`.

---

## Usage in Controller

See `references/usage-in-controller.md` (`InteractionController` rendering templates).

---

## Anti-Patterns to Avoid

See `references/anti-patterns.md` for the four ❌ examples (logic in templates, unescaped output, deep nesting, no error handling).

---

## Summary: Template Responsibilities

| Component | Responsibility |
|-----------|----------------|
| TemplateEngine | Load, compile, render templates |
| helpers.ts | Register helpers (comparison, formatting, i18n) |
| views/*.hbs | Template files |
| views/partials/*.hbs | Reusable template components |

**Golden rule**: Templates are for presentation. Business logic stays in controllers/services. Helpers are for formatting, not business rules.
