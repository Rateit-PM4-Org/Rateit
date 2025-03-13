FROM node:22 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build -- --output-path=dist/browser

FROM nginx:latest

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist/browser/** .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
