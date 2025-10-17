#!/bin/bash

# DXC247 Monorepo App Manager

echo "🚀 DXC247 Monorepo - Starting Applications"
echo "=========================================="
echo ""

# Check if apps are already running
USER_RUNNING=$(lsof -ti:3001 2>/dev/null)
ADMIN_RUNNING=$(lsof -ti:3002 2>/dev/null)

if [ ! -z "$USER_RUNNING" ]; then
    echo "⚠️  User app already running on port 3001 (PID: $USER_RUNNING)"
    echo "   Run: kill $USER_RUNNING to stop it"
else
    echo "▶️  Starting User app on port 3001..."
    cd /var/www/dxc247-vite/packages/user
    npm run dev > /tmp/user-app.log 2>&1 &
    USER_PID=$!
    echo "   User app started (PID: $USER_PID)"
fi

echo ""

if [ ! -z "$ADMIN_RUNNING" ]; then
    echo "⚠️  Admin app already running on port 3002 (PID: $ADMIN_RUNNING)"
    echo "   Run: kill $ADMIN_RUNNING to stop it"
else
    echo "▶️  Starting Admin app on port 3002..."
    cd /var/www/dxc247-vite/packages/admin
    npm run dev > /tmp/admin-app.log 2>&1 &
    ADMIN_PID=$!
    echo "   Admin app started (PID: $ADMIN_PID)"
fi

echo ""
echo "⏳ Waiting for apps to start..."
sleep 5

echo ""
echo "📊 Status Check:"
echo "=========================================="

# Check user app
if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo "✅ User App:  http://localhost:3001 (Running)"
else
    echo "❌ User App:  http://localhost:3001 (Not responding)"
    echo "   Check logs: tail -f /tmp/user-app.log"
fi

# Check admin app
if curl -s http://localhost:3002 > /dev/null 2>&1; then
    echo "✅ Admin App: http://localhost:3002 (Running)"
else
    echo "❌ Admin App: http://localhost:3002 (Not responding)"
    echo "   Check logs: tail -f /tmp/admin-app.log"
fi

echo ""
echo "📝 Logs:"
echo "   User:  tail -f /tmp/user-app.log"
echo "   Admin: tail -f /tmp/admin-app.log"
echo ""
echo "🛑 To stop apps:"
echo "   pkill -f 'vite.*3001'  # Stop user app"
echo "   pkill -f 'vite.*3002'  # Stop admin app"
echo ""

