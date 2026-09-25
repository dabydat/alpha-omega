# Template Structure

Templates live under `views/` with partials in `views/partials/`.

---

## Views Folder Layout

```
apps/authentication/src/oauth/infrastructure/
└── views/
    ├── login.hbs                    # Login form
    ├── otp.hbs                      # OTP verification
    ├── forgot-password.hbs          # Password reset request
    ├── forgot-password-otp.hbs     # OTP verification for reset
    ├── reset-password.hbs          # New password form
    ├── error.hbs                    # Error page
    ├── registration/
    │   ├── merchant-otp.hbs
    │   ├── merchant-password-form.hbs
    │   └── merchant-confirmation.hbs
    └── partials/
        ├── header.hbs
        └── footer.hbs
```

---

## Key Patterns

- `{{> partialName}}` - include partial
- `{{#if condition}}...{{/if}}` - conditional
- `{{variable}}` - output with escaping
- `{{{unescaped}}}` - output without escaping (use carefully)

---

## Quality Checklist

```
[ ] Templates in views/, partials in views/partials/
[ ] Escaping by default ({{var}})
[ ] Unescaped ({{{var}}}) only for trusted HTML
```
