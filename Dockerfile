# =============================================================================
# DOCKERFILE -- Multi-stage build cho React Vite SPA
# =============================================================================
#
# Dockerfile nay dung chung cho ca staging va production.
# Su khac nhau giua 2 moi truong nam o cac ARG (VITE_*) truyen vao khi build.
#
# Gom 3 stage:
#   1. deps    -- Cai dat dependencies (layer cache, chi re-install khi lockfile doi)
#   2. builder -- Build SPA thanh static files (dist/)
#   3. runner  -- Nginx serve static files (image cuoi ~30MB, khong co Node)
#
# Cach build:
#   docker build \
#     --build-arg VITE_API_BASE_URL=https://yourdomain.com/api \
#     --build-arg VITE_SOCKET_URL=https://yourdomain.com \
#     --build-arg VITE_APP_API_URL=https://yourdomain.com/api \
#     --build-arg VITE_STRIPE_PUBLIC_KEY=pk_live_xxx \
#     --build-arg VITE_DROP_CONSOLE=true \
#     -t frontend:latest .
#
# =============================================================================


# -----------------------------------------------------------------------------
# Stage 1: DEPS -- Cai dat dependencies
# -----------------------------------------------------------------------------
# Muc dich: Tach rieng buoc install dependencies de tan dung Docker layer cache.
# Khi code thay doi nhung package.json/yarn.lock khong doi, Docker se dung cache
# cua layer nay thay vi install lai tu dau (tiet kiem thoi gian build).
# -----------------------------------------------------------------------------
FROM node:20-alpine AS deps

WORKDIR /app

# Chi copy file lien quan den dependencies truoc (cache strategy)
COPY package.json yarn.lock ./

# --frozen-lockfile: dam bao install dung version trong lockfile, khong update
# Neu yarn.lock khong khop voi package.json se bao loi (an toan cho CI)
RUN yarn install --frozen-lockfile


# -----------------------------------------------------------------------------
# Stage 2: BUILDER -- Build SPA ra static files (dist/)
# -----------------------------------------------------------------------------
# Muc dich: Copy source code + node_modules, inject env vars, chay build.
# Cac bien VITE_* duoc truyen qua ARG → ENV → Vite doc tai build time.
# Ket qua: thu muc dist/ chua HTML/JS/CSS da optimize.
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy node_modules tu stage deps (da install xong)
COPY --from=deps /app/node_modules ./node_modules

# Copy toan bo source code
COPY . .

# -- Build-time arguments --
# Moi bien VITE_* duoc truyen vao bang --build-arg khi chay docker build.
# Vite chi inject cac bien bat dau bang VITE_ vao bundle (PUBLIC, user nhin thay duoc).
# KHONG BAO GIO dat secret (API secret key, DB password, ...) vao VITE_* variables.
ARG VITE_API_BASE_URL
ARG VITE_SOCKET_URL
ARG VITE_APP_API_URL
ARG VITE_STRIPE_PUBLIC_KEY
ARG VITE_DROP_CONSOLE

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}
ENV VITE_APP_API_URL=${VITE_APP_API_URL}
ENV VITE_STRIPE_PUBLIC_KEY=${VITE_STRIPE_PUBLIC_KEY}
ENV VITE_DROP_CONSOLE=${VITE_DROP_CONSOLE}

# Build SPA: tsc check types truoc, sau do Vite bundle ra dist/
# Output: /app/dist/ chua index.html + assets/ (JS/CSS voi hash filenames)
RUN yarn build


# -----------------------------------------------------------------------------
# Stage 3: RUNNER -- Nginx serve static files
# -----------------------------------------------------------------------------
# Muc dich: Image cuoi cung chi chua nginx + static files (dist/).
# Khong co Node.js, khong co source code, khong co node_modules.
# Image size ~30MB, bao mat (attack surface nho).
#
# Nginx doc config tu nginx.conf (COPY o duoi).
# Config nay xu ly: SPA routing, caching, gzip, security headers.
# -----------------------------------------------------------------------------
FROM nginx:1.27-alpine AS runner

WORKDIR /usr/share/nginx/html

# Xoa default nginx site va welcome page
RUN rm -rf ./* && rm -f /etc/nginx/conf.d/default.conf

# Copy static files tu builder stage
COPY --from=builder /app/dist ./

# Copy nginx config (SPA fallback, caching, gzip, security headers)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx listen port 80 ben trong container.
# Tren host: staging 127.0.0.1:8080, production 127.0.0.1:9080 (xem docker-compose).
EXPOSE 80

# HEALTHCHECK: Docker tu dong kiem tra container con song khong
# - interval=30s: kiem tra moi 30 giay
# - timeout=3s: neu khong tra loi trong 3 giay thi coi la fail
# - start-period=5s: cho 5 giay sau khi start truoc khi bat dau check
# - retries=3: fail 3 lan lien tiep thi danh dau container "unhealthy"
# wget trang chu (/) -- neu tra ve HTTP 200 thi healthy
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/ || exit 1

# Chay nginx ở foreground (khong daemonize)
# Docker yeu cau process chinh chay o foreground, khong phai background
CMD ["nginx", "-g", "daemon off;"]
