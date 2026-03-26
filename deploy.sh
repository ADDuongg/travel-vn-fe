#!/usr/bin/env bash
#
# deploy.sh — Bootstrap SSL and deploy the application.
#
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh              # first-time deploy (SSL init + build + start)
#   ./deploy.sh --update     # rebuild and restart after code changes
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

ENV_FILE=".env.production"

# --------------- Helpers ---------------

log()  { printf "\n\033[1;32m>>> %s\033[0m\n" "$1"; }
err()  { printf "\n\033[1;31m!!! %s\033[0m\n" "$1" >&2; exit 1; }

load_env() {
  if [ ! -f "$ENV_FILE" ]; then
    err "$ENV_FILE not found. Copy .env.production and fill in your values."
  fi
  set -a; source "$ENV_FILE"; set +a
  [ -z "${DOMAIN:-}" ]        && err "DOMAIN is not set in $ENV_FILE"
  [ -z "${CERTBOT_EMAIL:-}" ] && err "CERTBOT_EMAIL is not set in $ENV_FILE"
}

# --------------- SSL Init ---------------

init_ssl() {
  log "Phase 1: Starting temporary HTTP-only server for ACME challenge"

  # Swap in the init config (HTTP-only, no SSL references)
  docker compose -f docker-compose.yml --env-file "$ENV_FILE" \
    run --rm -d --name web-init \
    -v "$(pwd)/nginx/default-init.conf:/etc/nginx/conf.d/default.conf:ro" \
    -v "certbot-www:/var/www/certbot" \
    -p 80:80 \
    web nginx -g 'daemon off;' 2>/dev/null || true

  # Give nginx a moment to start
  sleep 3

  log "Phase 2: Requesting certificate from Let's Encrypt for $DOMAIN"

  docker compose --env-file "$ENV_FILE" run --rm certbot \
    certonly --webroot \
    --webroot-path=/var/www/certbot \
    --email "$CERTBOT_EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

  log "Phase 3: Stopping temporary server"
  docker stop web-init 2>/dev/null || true
  docker rm   web-init 2>/dev/null || true
}

# --------------- Deploy ---------------

deploy() {
  log "Building and starting all services"
  docker compose --env-file "$ENV_FILE" up -d --build

  log "Setting up SSL auto-renewal cron job"
  CRON_CMD="0 3 * * * cd $SCRIPT_DIR && docker compose --env-file $ENV_FILE run --rm certbot renew && docker compose --env-file $ENV_FILE exec web nginx -s reload"
  (crontab -l 2>/dev/null | grep -v "certbot renew" ; echo "$CRON_CMD") | crontab -

  log "Deploy complete!"
  echo ""
  echo "  Frontend:  https://$DOMAIN"
  echo "  API:       https://$DOMAIN/api/"
  echo ""
  echo "  Useful commands:"
  echo "    docker compose --env-file $ENV_FILE logs -f          # view logs"
  echo "    docker compose --env-file $ENV_FILE restart web      # restart nginx"
  echo "    docker compose --env-file $ENV_FILE down             # stop all"
  echo ""
}

# --------------- Main ---------------

load_env

case "${1:-}" in
  --update)
    log "Pulling latest changes and rebuilding"
    git pull origin main 2>/dev/null || true
    deploy
    ;;
  *)
    CERT_DIR="/var/lib/docker/volumes/react-vite_certbot-conf/_data/live/$DOMAIN"
    if [ ! -d "$CERT_DIR" ] 2>/dev/null; then
      init_ssl
    else
      log "SSL certificates already exist — skipping init"
    fi
    deploy
    ;;
esac
