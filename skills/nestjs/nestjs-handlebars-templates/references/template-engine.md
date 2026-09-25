# Template Engine Implementation

The `TemplateEngine` loads, compiles and renders templates. It registers partials at startup and reads template files on demand.

---

## TemplateEngine

```typescript
// libs/common_core/src/infrastructure/handlebars/template-engine.ts
import * as path from 'path';
import * as fs from 'fs';
import handlebars from 'handlebars';

import { registerHandlebarsHelpers } from './helpers';

export class TemplateEngine {
  constructor(
    private readonly templateDir: string,
    private readonly i18nService?: any,
  ) {
    registerHandlebarsHelpers(this.i18nService);
    this.registerPartials();
  }

  private registerPartials(): void {
    try {
      const partialsDir = path.join(this.templateDir, 'partials');
      if (!fs.existsSync(partialsDir)) return;

      const partialFiles = fs.readdirSync(partialsDir);
      for (const file of partialFiles) {
        if (file.endsWith('.hbs')) {
          const partialName = path.basename(file, '.hbs');
          const partialPath = path.join(partialsDir, file);
          const partialContent = fs.readFileSync(partialPath, 'utf-8');
          handlebars.registerPartial(partialName, partialContent);
        }
      }
    } catch (error) {
      console.error('Error registering partials:', error);
    }
  }

  private async readTemplateFile(templateName: string): Promise<HandlebarsTemplateDelegate<any>> {
    const pathname = path.resolve(this.templateDir, `${templateName}.hbs`);
    const templateContent = await fs.promises.readFile(pathname, 'utf-8');
    return handlebars.compile(templateContent);
  }

  async renderTemplate(templateName: string, metadata: Record<string, any>): Promise<string> {
    const template = await this.readTemplateFile(templateName);
    return template(metadata);
  }
}
```

**Why register partials at startup**: Partial registration is a one-time setup, not per-render.

---

## Quality Checklist

```
[ ] TemplateEngine loads, compiles, renders
[ ] Partials registered at startup
[ ] Templates read from disk on demand
```
