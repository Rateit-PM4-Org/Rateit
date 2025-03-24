#!/bin/sh

# Ensure API_URL is set
if [ -z "$API_URL" ]; then
    echo "API_URL is not set! Exiting."
    exit 1
fi

# Replace placeholders in compiled Angular files
for file in /usr/share/nginx/html/*.js; do
    sed -i "s#API_URL#$API_URL#" $file
    echo "Replaced API_URL in $file with (if present): $API_URL"
done

echo "Environment variables injected successfully."
