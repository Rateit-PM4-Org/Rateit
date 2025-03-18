#!/bin/sh

# Set default stage if not provided
STAGE=${STAGE:-"base"}

# Load the correct environment file from /env
if [ -f "/env/environment.$STAGE.env" ]; then
    export $(grep -v '^#' /env/environment.$STAGE.env | xargs)
else
    echo "Error: No environment file found for stage: $STAGE"
    exit 1
fi

# Ensure API_URL is set
if [ -z "$API_URL" ]; then
    echo "API_URL is not set! Exiting."
    exit 1
fi

echo "Deploying to $STAGE environment with API URL: $API_URL"

# Replace placeholders in compiled Angular files
find /usr/share/nginx/html -type f -name "main.*.js" -exec sed -i "s|MY_APP_API_URL|$API_URL|g" {} \;
find /usr/share/nginx/html -type f -name "main.*.js" -exec sed -i "s|MY_APP_STAGE|$STAGE|g" {} \;

echo "Environment variables injected successfully."

# Start Nginx
nginx -g "daemon off;"
