#!/bin/sh

pm2 start /app/server/dist/server.js
# node /app/server/dist/server.js &

nginx -g "daemon off;"