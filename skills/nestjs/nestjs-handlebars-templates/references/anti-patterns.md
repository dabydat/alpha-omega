# Handlebars Anti-Patterns

These are the common mistakes in templates.

---

## ❌ Logic in templates (business rules)

```html
{{! INCORRECT: Business logic in template }}
{{#if (and (eq user.role 'ADMIN') (not user.disabled))}}
  <button>Delete Everything</button>
{{/if}}
```

**Fix**: Controller checks permissions, template only renders.

---

## ❌ Unescaped output with user data

```html
{{! INCORRECT: XSS vulnerability }}
{{{userBio}}}
```

**Fix**: Use double braces `{{userBio}}` unless you absolutely trust the source.

---

## ❌ Deep nesting of conditionals

```html
{{! INCORRECT: Unreadable }}
{{#if a}}{{#if b}}{{#if c}}{{#if d}}Content{{/if}}{{/if}}{{/if}}{{/if}}
```

**Fix**: Extract to partials or simplify logic in controller.

---

## ❌ No error handling for missing templates

```typescript
// INCORRECT: No error handling
const html = handlebars.compile(fs.readFileSync(path));

// CORRECT: Proper error handling
try {
  const template = await this.readTemplateFile(templateName);
  return template(context);
} catch (error) {
  throw new Error(`Unable to render template: ${templateName}`);
}
```

**Fix**: Wrap template load/render in try/catch and throw a clear error.

---

## Quality Checklist

```
[ ] No business logic in templates
[ ] Double braces (escaped) for user data
[ ] No deep nesting — use partials
[ ] Template load/render wrapped in try/catch
```
