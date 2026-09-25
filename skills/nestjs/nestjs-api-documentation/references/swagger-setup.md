# NestJS Swagger Setup

Configuring the Swagger module is the foundation of API documentation. It wires the `DocumentBuilder` into your app so the OpenAPI spec is generated and served.

---

## Module Configuration (main.ts)

```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Payment API')
    .setDescription('Payment processing API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('payments', 'Payment operations')
    .addTag('users', 'User management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
```

**Why `.setTitle()`/`.setVersion()`**: Identifies the API in Swagger UI and the generated spec.

**Why `.addBearerAuth()`**: Registers the JWT scheme so `@ApiBearerAuth()` works on protected endpoints.

**Why `.addTag()`**: Groups endpoints by resource in the docs UI.

---

## Interactive Documentation

- **Swagger UI Access**:
  ```
  Development: http://localhost:3000/api/docs
  Production: https://api.example.com/docs
  ```
- **Swagger JSON**:
  ```
  GET /api-docs/json
  ```

---

## Quality Checklist

```
[ ] DocumentBuilder configured with title, description, version
[ ] addBearerAuth() present for JWT-protected APIs
[ ] addTag() groups endpoints by resource
[ ] SwaggerModule.setup() exposes the docs route
[ ] Swagger JSON endpoint reachable
```
