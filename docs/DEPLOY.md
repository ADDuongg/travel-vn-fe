# Deploy Guide — Docker + Nginx + SSL on Ubuntu VPS

## Architecture

```
Internet ──▶ :443 (HTTPS) ──▶ Nginx container
                                  ├── / ──────────▶ React static files (SPA)
                                  ├── /api/ ──────▶ Backend container :9001
                                  └── /socket.io/ ▶ Backend container :9001 (WebSocket)
```

- **web** — Nginx serving the React build + reverse-proxying API / WebSocket
- **backend** — Your NestJS (or other) API server
- **certbot** — Let's Encrypt certificate issuance and auto-renewal

---

## 1. VPS Prerequisites

### 1.1 Update the system

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Docker & Docker Compose

```bash
# Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
docker compose version
```

### 1.3 Open firewall ports

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 1.4 Point your domain to the VPS

Create an **A record** in your DNS provider:

| Type | Name | Value          |
|------|------|----------------|
| A    | @    | YOUR_VPS_IP    |
| A    | www  | YOUR_VPS_IP    |

Wait for DNS propagation (usually 5-30 minutes).

---

## 2. Clone and Configure

```bash
# Clone
git clone <your-repo-url> ~/react-vite
cd ~/react-vite

# Configure environment
cp .env.production .env.production.local
nano .env.production
```

Edit `.env.production` with your actual values:

```env
DOMAIN=yourdomain.com
CERTBOT_EMAIL=you@example.com

VITE_API_BASE_URL=https://yourdomain.com/api
VITE_SOCKET_URL=https://yourdomain.com
VITE_APP_API_URL=https://yourdomain.com/api
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_DROP_CONSOLE=true

# Backend vars
# DATABASE_URL=mongodb://...
# JWT_SECRET=...
# PORT=9001
```

---

## 3. Configure the Backend Service

Open `docker-compose.yml` and update the `backend` service.

**Option A** — Build from local source (recommended if backend is in a sibling directory):

```yaml
backend:
  build:
    context: ../nest-api
    dockerfile: Dockerfile
  container_name: react-vite-backend
  restart: unless-stopped
  expose:
    - "9001"
  env_file:
    - .env.production
  networks:
    - app-network
```

**Option B** — Use a pre-built Docker image:

```yaml
backend:
  image: your-registry.com/nest-api:latest
  container_name: react-vite-backend
  restart: unless-stopped
  expose:
    - "9001"
  env_file:
    - .env.production
  networks:
    - app-network
```

---

## 4. Deploy

### 4.1 First-time deploy (includes SSL setup)

```bash
chmod +x deploy.sh
./deploy.sh
```

The script will:
1. Start a temporary HTTP-only nginx to handle the ACME challenge
2. Request an SSL certificate from Let's Encrypt
3. Build and start all services with full HTTPS config
4. Set up a cron job for automatic certificate renewal

### 4.2 Verify

```bash
# Check running containers
docker compose --env-file .env.production ps

# Check logs
docker compose --env-file .env.production logs -f web
docker compose --env-file .env.production logs -f backend

# Test HTTPS
curl -I https://yourdomain.com
```

---

## 5. Common Operations

### Update after code changes

```bash
cd ~/react-vite
git pull origin main
./deploy.sh --update
```

### Restart a single service

```bash
docker compose --env-file .env.production restart web
docker compose --env-file .env.production restart backend
```

### View logs

```bash
# All services
docker compose --env-file .env.production logs -f

# Single service
docker compose --env-file .env.production logs -f web
```

### Stop everything

```bash
docker compose --env-file .env.production down
```

### Rebuild without cache

```bash
docker compose --env-file .env.production build --no-cache
docker compose --env-file .env.production up -d
```

### Manual SSL renewal

```bash
docker compose --env-file .env.production run --rm certbot renew
docker compose --env-file .env.production exec web nginx -s reload
```

### Check SSL certificate expiry

```bash
docker compose --env-file .env.production run --rm certbot certificates
```

---

## 6. Troubleshooting

### "Nginx fails to start" after first deploy

The SSL certificate may not exist yet. Run the init flow:

```bash
./deploy.sh
```

### "502 Bad Gateway" on /api/ routes

The backend container is not running or not reachable:

```bash
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs backend
```

Make sure the backend is listening on port **9001** and is on the `app-network`.

### "Too many redirects"

Check that your `VITE_API_BASE_URL` uses `https://` and that your app is not doing double redirects.

### Certbot rate limits

Let's Encrypt has a rate limit of **5 certificates per domain per week**. For testing, add `--staging` to the certbot command in `deploy.sh`:

```bash
certbot certonly --staging --webroot ...
```

Remove `--staging` when ready for production.

---

## 7. File Overview

```
.
├── Dockerfile                     # Multi-stage: build React → nginx
├── docker-compose.yml             # Orchestrates web, backend, certbot
├── deploy.sh                      # Automated SSL bootstrap + deploy
├── .env.production                # Production environment variables
├── .dockerignore                  # Files excluded from Docker build
└── nginx/
    ├── default.conf.template      # Nginx config (HTTPS + SPA + API proxy)
    ├── default-init.conf          # Temporary HTTP-only config for SSL init
    └── docker-entrypoint.sh       # Entrypoint: envsubst DOMAIN → start nginx
```
