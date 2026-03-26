# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_SOCKET_URL
ARG VITE_APP_API_URL
ARG VITE_STRIPE_PUBLIC_KEY
ARG VITE_DROP_CONSOLE=true

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_SOCKET_URL=$VITE_SOCKET_URL \
    VITE_APP_API_URL=$VITE_APP_API_URL \
    VITE_STRIPE_PUBLIC_KEY=$VITE_STRIPE_PUBLIC_KEY \
    VITE_DROP_CONSOLE=$VITE_DROP_CONSOLE

RUN yarn build

# Stage 2: Production
FROM nginx:1.27-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/default.conf.template /etc/nginx/conf.d/default.conf.template
COPY nginx/docker-entrypoint.sh  /docker-entrypoint-custom.sh
RUN chmod +x /docker-entrypoint-custom.sh

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80 443

ENTRYPOINT ["/docker-entrypoint-custom.sh"]
