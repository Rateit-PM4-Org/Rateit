FROM node:23 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY ./public ./public
COPY ./src ./src
COPY ./angular.json ./
COPY ./tsconfig.json ./
COPY ./tsconfig.app.json ./
COPY ./tsconfig.spec.json ./

RUN npm run build -- --output-path=dist/browser

FROM nginx:latest

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist/browser/** .

COPY default.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script
COPY entrypoint.sh /docker-entrypoint.d/entrypoint.sh
RUN chmod +x /docker-entrypoint.d/entrypoint.sh

EXPOSE 80
