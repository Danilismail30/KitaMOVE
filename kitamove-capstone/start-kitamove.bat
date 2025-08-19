@echo off
echo Starting KitaMOVE Application with API proxy...

start cmd /k "cd /d %~dp0 && npm run dev"
start cmd /k "cd /d %~dp0 && node malaysia-proxy.js"

echo Both servers started successfully!
echo React app: http://localhost:5173
echo API proxy: http://localhost:5000