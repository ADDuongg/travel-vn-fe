---
name: deployment-patterns
description: Deployment workflows, CI/CD pipeline patterns, Docker for React (static) apps, health checks for SPAs, rollback strategies, and production readiness checklists for React frontends.
origin: ECC
---

# Deployment Patterns (React / SPA)

Production deployment workflows and CI/CD best practices for **React** apps (e.g. **Vite**, Create React App) shipped as **static assets** — not a long-running Node HTTP server in production.

## When to Activate

- Setting up CI/CD for a React SPA
- Dockerizing a static build (build with Node, **serve** with nginx/Caddy or object storage + CDN)
- Planning deployment strategy (blue-green, canary, rolling) for edge/CDN or container hosts
- Health checks and probes for **static hosting** (HTML/HTTP 200, synthetic checks)
- Preparing for a production release (cache busting, env at build time)
- Configuring environment-specific settings (`VITE_*`, feature flags)

## Deployment Strategies

### Rolling Deployment (Default)

Replace instances or CDN origins gradually — old and new asset versions may coexist (hashed filenames help).

```
Edge 1: v1 → v2  (update first)
Edge 2: v1        (still serving v1)
Edge 3: v1        (still serving v1)

Edge 1: v2
Edge 2: v1 → v2  (update second)
Edge 3: v1

Edge 1: v2
Edge 2: v2
Edge 3: v1 → v2  (update last)
```

**Pros:** Zero downtime for users if routing and caching are correct  
**Cons:** Two UI versions briefly — API contracts should stay backward compatible  
**Use when:** Standard SPA releases, backward-compatible API changes

### Blue-Green Deployment

Run two identical environments. Switch traffic atomically (DNS, load balancer, or platform “promote”).

```
Blue  (v1) ← traffic
Green (v2)   idle, new build deployed

# After verification:
Blue  (v1)   idle (standby)
Green (v2) ← traffic
```

**Pros:** Instant rollback (flip traffic back), clean cutover  
**Cons:** May require 2x hosting capacity during switch  
**Use when:** Critical releases, zero-tolerance cutovers

### Canary Deployment

Route a small percentage of traffic to the new deployment (edge rules, feature flags, or staged rollout).

```
v1: 95% of traffic
v2:  5% of traffic  (canary)

# If metrics look good:
v1: 50% of traffic
v2: 50% of traffic

# Final:
v2: 100% of traffic
```

**Pros:** Validates real-user behavior before full rollout  
**Cons:** Needs traffic splitting or flag infrastructure + monitoring  
**Use when:** High-traffic sites, risky UI changes

## Docker

### Multi-Stage Dockerfile (React + nginx)

Build the SPA with Node; **serve static files** with nginx (no `node dist/server.js` in production for a pure SPA).

```dockerfile
# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
  else npm install; fi

# Stage 2: Build (Vite → dist/)
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time public env (CI should inject real values)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# Stage 3: Static server
FROM nginx:1.27-alpine AS runner
WORKDIR /usr/share/nginx/html

# Remove default site
RUN rm -rf ./*

COPY --from=builder /app/dist ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN addgroup -g 1001 -S appgroup && adduser -S nginx -u 1001 -G appgroup || true

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

**Example `nginx.conf` (SPA fallback + caching):**

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

### Docker Best Practices (React static)

```
# GOOD practices
- Use specific image tags (node:22-alpine, nginx:1.27-alpine — not :latest)
- Multi-stage: only `dist/` in the final image (small attack surface)
- Run nginx as non-root where supported; minimal base images
- Copy lockfiles first for dependency layer caching
- Use .dockerignore: node_modules, .git, coverage, dist
- HEALTHCHECK against GET / (or /health.html)
- Set resource limits in compose/k8s; tune worker_connections for traffic

# BAD practices
- Running `vite preview` or `serve` in production without hardening (prefer nginx/Caddy or PaaS)
- Baking secrets into the client bundle (anything in VITE_* is public)
- Serving without `try_files` → SPA client routes 404 on refresh
- Disabling cache for all assets (hurts performance); hash main + lazy chunks instead
```

## CI/CD Pipeline

### GitHub Actions (React SPA — test, build artifact, optional image)

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --coverage
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage
          path: coverage/

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - name: Build SPA
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
        run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  # Optional: container for k8s/VM
  docker:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}
          build-args: |
            VITE_API_BASE_URL=${{ secrets.VITE_API_BASE_URL }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: [build]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Deploy to production
        run: |
          # Pick one:
          # Static: aws s3 sync dist/ s3://bucket --delete && aws cloudfront create-invalidation ...
          # Vercel/Netlify: platform CLI or Git integration
          # K8s: deploy image from docker job, or sync ConfigMap + static mount
          echo "Deploying ${{ github.sha }}"
```

### Pipeline Stages

```
PR opened:
  lint → typecheck → unit tests → (E2E) → preview URL (Vercel/Netlify/Cloudflare Pages)

Merged to main:
  lint → typecheck → unit tests → build dist/ → upload artifact or image →
  staging smoke (loads app, critical paths) → production
```

## Health Checks

### Static / SPA hosting

A React SPA has **no app server health endpoint** unless you add a tiny file or use the CDN/platform probe.

**Simple:** ensure `GET /` returns **200** and `index.html` (nginx `try_files`).

**Optional:** add `public/health.txt` or `public/health.json` for explicit probes:

```text
# public/health.txt
ok
```

**Synthetic checks (recommended):** ping `/`, login flow, or critical API from **outside** the cluster (Datadog, Pingdom, etc.) — validates DNS, TLS, and routing.

### Kubernetes Probes (nginx serving SPA)

Point probes at `/` or `/health.txt` on port **80** (not 3000 unless you use a dev server in prod — avoid).

```yaml
livenessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 10
  periodSeconds: 30
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 5
  periodSeconds: 10
  failureThreshold: 2

startupProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 0
  periodSeconds: 5
  failureThreshold: 12
```

## Environment Configuration

### Build-time vs runtime (Vite)

```bash
# Vite: only VITE_* is exposed to client code — treat as PUBLIC
VITE_API_BASE_URL=https://api.example.com
VITE_APP_ENV=production

# Never put secrets in VITE_* — they are embedded in the JS bundle
# Server secrets belong on the backend or in serverless env, not in React env

# NODE_ENV is set by the build tool during vite build (production optimizations)
```

**Runtime config (optional):** load `config.json` from `/config.json` at app startup for values that must change without rebuild (advanced; requires hosting support).

### Configuration validation (build or bootstrap)

```typescript
import { z } from 'zod';

const publicEnvSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('production'),
});

// Vite: import.meta.env
export const publicEnv = publicEnvSchema.parse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
});
```

Validate in `main.tsx` before `createRoot` so misconfiguration fails fast in CI or first load.

## Rollback Strategy

### Instant Rollback

```bash
# Kubernetes: previous image for static container
kubectl rollout undo deployment/frontend

# Vercel / Netlify / Cloudflare Pages: promote or revert to prior deployment in UI/CLI

# S3 + CloudFront: redeploy previous dist artifact; invalidate CloudFront

# No DB migrate on frontend-only rollback — coordinate with API version if needed
```

### Rollback Checklist

- [ ] Previous **dist** artifact or **image tag** is retained (immutable tags per commit)
- [ ] API remains compatible with previous UI (versioned endpoints or feature flags)
- [ ] CDN cache invalidation or versioned asset URLs understood (hashed files reduce risk)
- [ ] Synthetic / RUM alerts for error spikes after deploy
- [ ] Rollback rehearsed on staging

## Production Readiness Checklist

Before any production deployment:

### Application (React)

- [ ] All tests pass (unit, integration, E2E on critical paths)
- [ ] No secrets in `VITE_*` or client code; API keys only on server
- [ ] Error boundaries and user-visible error states for failed API calls
- [ ] Route refresh works (`try_files` / platform SPA fallback)
- [ ] Lazy routes and code splitting where appropriate; bundle size reviewed

### Infrastructure

- [ ] **Reproducible build**: lockfile committed, Node version pinned in CI
- [ ] **Public env** documented; validated at build or app bootstrap
- [ ] TLS everywhere; HSTS where applicable
- [ ] CDN or edge caching: long cache for hashed assets, short/`no-cache` for `index.html` as needed
- [ ] Resource limits for container/nginx if self-hosted

### Monitoring

- [ ] Real user monitoring (optional) or error tracking (e.g. Sentry) for client errors
- [ ] Synthetic uptime on `/` or key flows
- [ ] Core Web Vitals / performance budgets if product cares about SEO/UX

### Security

- [ ] `npm audit` / Dependabot; lockfile updates
- [ ] API CORS and auth handled on **backend**; React only sends tokens per policy
- [ ] Security headers at CDN/reverse proxy (CSP, HSTS, X-Frame-Options)
- [ ] Subresource Integrity if loading third-party scripts (when applicable)

### Operations

- [ ] Rollback path documented (platform revert vs image tag vs S3 version)
- [ ] Runbook for “blank screen” (wrong API URL, failed chunk load, stale CDN)
- [ ] On-call / escalation if applicable
