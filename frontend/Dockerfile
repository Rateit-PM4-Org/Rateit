FROM node:22 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build -- --output-path=dist/browser

FROM nginx:latest

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist/browser/** .

# Copy the entire /env folder into the container
COPY env /env/

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

# Run entrypoint script at container startup
CMD ["/entrypoint.sh"]
