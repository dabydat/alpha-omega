# Helpers

Helpers provide reusable logic inside templates (comparison, formatting, i18n). They are for formatting, not business rules.

---

## registerHandlebarsHelpers

```typescript
// libs/common_core/src/infrastructure/handlebars/helpers.ts
import * as Handlebars from 'handlebars';

export function registerHandlebarsHelpers(i18nService?: any): void {
  Handlebars.registerHelper('range', (count: number) => [...Array(count).keys()]);
  Handlebars.registerHelper('array', (...args: any[]) => args.slice(0, -1));
  Handlebars.registerHelper('eq', (a: any, b: any) => a === b);
  Handlebars.registerHelper('ne', (a: any, b: any) => a !== b);
  Handlebars.registerHelper('and', (...args: any[]) => args.slice(0, -1).every(Boolean));
  Handlebars.registerHelper('or', (...args: any[]) => args.slice(0, -1).some(Boolean));
  Handlebars.registerHelper('not', (value: any) => !value);

  Handlebars.registerHelper('formatDate', (date: string | Date) => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')} de ${months[d.getMonth()]} del ${d.getFullYear()}`;
  });

  if (i18nService) {
    Handlebars.registerHelper('i18n', (key: string) => i18nService.translate(key));
  }
}
```

**Why helpers for formatting**: Helpers are for formatting (dates, comparisons, i18n), never business rules.

---

## Quality Checklist

```
[ ] Helpers are for formatting, not business rules
[ ] Comparison helpers (eq/ne/and/or/not) registered
[ ] i18n helper registered when i18n service present
```
