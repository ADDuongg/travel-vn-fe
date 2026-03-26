#!/bin/sh
set -e

# Only substitute DOMAIN — leave nginx variables ($host, $uri, etc.) untouched
envsubst '${DOMAIN}' < /etc/nginx/conf.d/default.conf.template \
                     > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
