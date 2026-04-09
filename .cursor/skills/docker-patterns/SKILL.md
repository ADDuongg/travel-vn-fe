---
name: docker-patterns
description: Docker and Docker Compose patterns for React (Vite) apps — local dev with HMR, static production images, networking to APIs, volumes, and container security.
origin: ECC
---

# Docker Patterns (React / Vite)

Docker and Docker Compose best practices for **React** SPAs built with **Vite**: dev container with hot reload, production image that **serves static `dist/`** (e.g. nginx), optional sidecars for API/DB during local full-stack work.

## When to Activate

- Setting up Docker Compose for **frontend** local development
- Designing multi-container setups (web + API + DB)
- Troubleshooting container networking or volume issues (e.g. `node_modules`, file watchers)
- Reviewing Dockerfiles for **static SPA** builds and image size
- Migrating from local `yarn dev` to a containerized workflow

## Docker Compose for Local Development

### Standard React + Optional Backend Stack

```yaml
# docker-compose.yml
services:
  web:
    build:
      context: .
      target: dev # Vite dev server stage
    ports:
      - "5173:5173" # Vite default (adjust if vite.config uses another port)
    volumes:
      - .:/app
      - /app/node_modules # Anonymous volume — keeps container install intact
    environment:
      - NODE_ENV=development
      # Public build-time vars — exposed to the browser; never put secrets here
      - VITE_API_BASE_URL=http://localhost:3000 # browser calls host; see note below
    # If the API runs in Compose, use host port mapping or proxy — see Networking
    command: yarn dev --host 0.0.0.0 --port 5173

  # Optional: backend API (Nest/Express) for full-stack local dev
  api:
    image: your-registry/api:dev # or build: ../api
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://postgres:postgres@db:5432/app_dev
    depends_on:
      db:
        condition: service_healthy
    profiles:
      - fullstack # docker compose --profile fullstack up

  db:
    image: postgres:16-alpine
    profiles:
      - fullstack
    ports:
      - "127.0.0.1:5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app_dev
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 5

  mailpit: # Local email testing (if auth flows need it)
    image: axllent/mailpit
    ports:
      - "8025:8025"
      - "1025:1025"

volumes:
  pgdata:
```

**Browser vs Docker networking:** The React app runs **in the user’s browser**. `VITE_API_BASE_URL` usually points to **`http://localhost:<api-host-port>`** (mapped port), not `http://api:3000`, unless you use a **Vite dev proxy** so the browser only talks to the Vite origin. Prefer `vite.config.ts` → `server.proxy` for `/api` → `http://api:3000` inside Compose.

### Development vs Production Dockerfile

```dockerfile
# Stage: dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else npm install; fi

# Stage: dev — Vite dev server (HMR)
FROM node:22-alpine AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 5173
ENV NODE_ENV=development
CMD ["yarn", "dev", "--host", "0.0.0.0", "--port", "5173"]

# Stage: build — produces dist/
FROM node:22-alpine AS build
WORKDIR /app
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Stage: production — static files only (nginx)
FROM nginx:1.27-alpine AS production
WORKDIR /usr/share/nginx/html
RUN rm -rf ./* && rm /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist ./
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
```

**Minimal `nginx.conf` for SPA:**

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### Override Files

```yaml
# docker-compose.override.yml (auto-loaded, dev-only)
services:
  web:
    environment:
      - CHOKIDAR_USEPOLLING=true # Helps file watchers on some Docker Desktop setups
    ports:
      - "5173:5173"

# docker-compose.prod.yml — production-like static image (optional local smoke test)
services:
  web:
    build:
      target: production
      args:
        VITE_API_BASE_URL: ${VITE_API_BASE_URL}
    ports:
      - "8080:80"
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 128M
```

```bash
# Development (auto-loads override)
docker compose up web

# Production image locally
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d web
```

## Networking

### Service Discovery

Services on the same Compose network resolve by **service name**. Use these **from server-side or from Vite proxy**, not directly from browser code:

```
# Inside Vite proxy (vite.config.ts server.proxy) or SSR:
http://api:3000

# From browser (typical): published host port
http://localhost:3000
```

### Custom Networks

```yaml
services:
  web:
    networks:
      - edge-net

  api:
    networks:
      - edge-net
      - data-net

  db:
    networks:
      - data-net # DB not on edge-net — only API reaches it

networks:
  edge-net:
  data-net:
```

### Exposing Only What's Needed

```yaml
services:
  db:
    ports:
      - "127.0.0.1:5432:5432" # Host tools only; not 0.0.0.0 on shared networks
  web:
    ports:
      - "5173:5173"
```

## Volume Strategies

```yaml
volumes:
  # Named volume — persists DB data, etc.
  pgdata:

  # Bind mount — source code into container for HMR
  # - .:/app

  # Anonymous volume — prevents host from overwriting container node_modules
  # - /app/node_modules

  # Optional: preserve Vite cache (optional; can also use anonymous /app/node_modules only)
  # - /app/node_modules/.vite
```

### Common Patterns (React / Vite)

```yaml
services:
  web:
    volumes:
      - .:/app
      - /app/node_modules
      # - /app/node_modules/.vite  # optional: isolate Vite pre-bundle cache

  db:
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
```

## Container Security

### Dockerfile Hardening

```dockerfile
# 1. Pin base images (node + nginx), avoid :latest
FROM node:22.12-alpine3.20 AS build
# ...
FROM nginx:1.27-alpine AS production

# 2. Production stage: nginx official image; drop privileges via nginx config / non-root variants when applicable
# 3. No secrets in layers — VITE_* is public in the client bundle
# 4. .dockerignore — exclude .env with real secrets
```

### Compose Security

```yaml
services:
  web:
    security_opt:
      - no-new-privileges:true
    read_only: true # nginx alpine: may need tmpfs for pid/cache — validate for your image
    tmpfs:
      - /tmp
      - /var/cache/nginx
      - /var/run
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
      - NET_BIND_SERVICE
```

### Secret Management

```yaml
# GOOD: Public config for Vite via build args / CI env (not secret)
services:
  web:
    build:
      args:
        VITE_API_BASE_URL: ${VITE_API_BASE_URL}

# GOOD: Real secrets only on API service / backend — never VITE_*
services:
  api:
    env_file:
      - .env.api # gitignored

# BAD: Embedding private keys in React env
# ENV VITE_STRIPE_SECRET=sk_live_...   # NEVER — exposed in bundle

# BAD: Committing .env with production API keys
```

## .dockerignore

```
node_modules
.git
.env
.env.*
.env.local
dist
coverage
*.log
.vite
.cache
docker-compose*.yml
Dockerfile*
README.md
tests/
```

## Debugging

### Common Commands

```bash
# Logs
docker compose logs -f web
docker compose logs --tail=50 api

# Shell into frontend dev container
docker compose exec web sh

# Inspect
docker compose ps
docker stats

# Rebuild
docker compose up --build
docker compose build --no-cache web

# Clean up
docker compose down
docker compose down -v
docker system prune
```

### Debugging Network Issues

```bash
# DNS inside container
docker compose exec web nslookup api

# Reach API from web container (works if same network)
docker compose exec web wget -qO- http://api:3000/health

# After production image: static server
docker compose exec web wget -qO- http://127.0.0.1/

docker network ls
docker network inspect <project>_default
```

## Anti-Patterns

```
# BAD: Expecting http://api:3000 to work from the browser without a proxy
# Browser is outside Docker — use localhost + mapped port or Vite proxy

# BAD: Putting secrets in VITE_* — they are compiled into client JS

# BAD: Production image running `vite preview` or dev server without hardening
# Prefer nginx (or CDN) serving dist/

# BAD: Storing DB data in a container without a volume

# BAD: Running unnecessary processes as root when the image supports non-root

# BAD: :latest for node/nginx — pin versions for reproducible builds

# BAD: One container running React dev + Postgres + Redis “monolith style”
# One main process per container; compose links services

# BAD: Committing .env with real keys into docker-compose.yml or the repo
```
