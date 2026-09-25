# Key Template Patterns

The common template patterns: OTP verification, email notification, error page, and reusable partials.

---

## OTP Verification Template

```html
{{> header}}

<div class="container">
  <h1>Account verification</h1>

  {{#if flash}}
    <div class="alert alert-error">{{flash}}</div>
  {{/if}}

  <p>A verification code has been sent to the number: <strong>{{params.phone}}</strong></p>
  <p>The code expires in <strong>{{params.seconds}}</strong> seconds.</p>

  <form method="POST" action="/interaction/{{uid}}/otp">
    <input type="hidden" name="userId" value="{{params.userId}}">
    <div class="form-group">
      <label for="otp">Verification code:</label>
      <input type="text" id="otp" name="otp" required pattern="[0-9]{6}" maxlength="6">
    </div>
    <button type="submit">Verify</button>
  </form>

  <form method="POST" action="/interaction/{{uid}}/otp/resend">
    <input type="hidden" name="userId" value="{{params.userId}}">
    <input type="hidden" name="method" value="sms">
    <button type="submit" class="link-button">Resend code</button>
  </form>
</div>

{{> footer}}
```

**Full template**: see `references/otp-template.hbs`.

---

## Email Notification Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #007bff; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>{{title}}</h1></div>
    <div class="content">{{{body}}}</div>
  </div>
</body>
</html>
```

**Why triple braces `{{{body}}}`**: Email body may contain HTML formatting that should not be escaped.

**Full template**: see `references/email-template.hbs`.

---

## Error Template

```html
<!DOCTYPE html>
<html>
<head>
  <title>Error</title>
  <style>
    body { font-family: Arial; padding: 40px; text-align: center; }
    .error-container { border: 1px solid #dc3545; padding: 20px; border-radius: 5px; }
    .error-message { color: #dc3545; font-size: 18px; }
  </style>
</head>
<body>
  <div class="error-container">
    <h1>Error</h1>
    <p class="error-message">{{message}}</p>
    <a href="/">Back to home</a>
  </div>
</body>
</html>
```

**Full template**: see `references/error-template.hbs`.

---

## Partials for Reuse

```html
{{! views/partials/header.hbs }}
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>{{title}}</title></head>
<body>
  <header><nav><a href="/">Home</a><a href="/help">Help</a></nav></header>
  <main>
```

```html
{{! views/partials/footer.hbs }}
  </main>
  <footer><p>&copy; {{year}} Your Company.</p></footer>
</body>
</html>
```

```typescript
Handlebars.registerHelper('year', () => new Date().getFullYear());
```

---

## Quality Checklist

```
[ ] Templates use escaping by default
[ ] Partials for header/footer reuse
[ ] Triple braces only for trusted HTML
```
