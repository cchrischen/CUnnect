#!/bin/sh

pm2 start /app/server/dist/server.js
# node /app/backend/dist/server.js &

nginx -g "daemon off;"