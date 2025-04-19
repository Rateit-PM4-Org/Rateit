FROM node:23 AS build

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/public ./public
COPY frontend/src ./src
COPY frontend/angular.json ./
COPY frontend/tsconfig.json ./
COPY frontend/tsconfig.app.json ./
COPY frontend/tsconfig.spec.json ./
COPY frontend/git-version.js ./
COPY .git/ .git/

RUN npm run build -- --output-path=dist/browser

FROM nginx:latest

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist/browser/** .

COPY frontend/default.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script
COPY frontend/entrypoint.sh /docker-entrypoint.d/entrypoint.sh
RUN chmod +x /docker-entrypoint.d/entrypoint.sh

EXPOSE 80
