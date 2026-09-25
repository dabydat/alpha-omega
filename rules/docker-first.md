# Docker-First Development Rule

> Every service the project depends on MUST run locally in Docker before any cloud deployment.
> No exceptions.

## What "Docker-First" Means

Every project gets (Sprint 0):
```
docker-compose.yml          ← All dev services
docker-compose.test.yml    ← Isolated test environment
Dockerfile                  ← Multi-stage production image
.dockerignore               ← Exclude node_modules, .env, build artifacts
scripts/docker-dev.sh       ← Start/stop/reset helper
diagrams/infra.mermaid      ← Infrastructure diagram
```

## Standard Services per Stack

| Need | Local Docker Solution | Do NOT use |
|------|-----------------------|------------|
| PostgreSQL | postgres:16-alpine | Neon, Supabase (dev only) |
| MySQL | mysql:8 | PlanetScale (dev only) |
| Redis | redis:7-alpine | Upstash (dev only) |
| Email | axllent/mailpit | SendGrid, Resend (dev only) |
| Object storage | minio/minio | S3, R2 (dev only) |

## docker-compose.yml Template

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: appname
      POSTGRES_USER: appname
      POSTGRES_PASSWORD: appname
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appname"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

## Dockerfile Template (Multi-stage, production)

```dockerfile
# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Run
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

## When to Deploy to Cloud

Only deploy when:
- [ ] Feature works end-to-end locally with Docker
- [ ] npm test passes
- [ ] tsc --noEmit passes
- [ ] docker compose up starts cleanly from scratch
- [ ] Smoke test passes locally

Cloud = production mirror. Local Docker = development environment.