#!/bin/bash

# DXC247 Monorepo App Stopper

echo "🛑 DXC247 Monorepo - Stopping Applications"
echo "=========================================="
echo ""

# Stop user app
USER_PID=$(lsof -ti:3001 2>/dev/null)
if [ ! -z "$USER_PID" ]; then
    echo "⏹️  Stopping User app (PID: $USER_PID)..."
    kill $USER_PID 2>/dev/null
    sleep 1
    if lsof -ti:3001 > /dev/null 2>&1; then
        echo "   Force killing..."
        kill -9 $USER_PID 2>/dev/null
    fi
    echo "   ✅ User app stopped"
else
    echo "ℹ️  User app not running"
fi

echo ""

# Stop admin app
ADMIN_PID=$(lsof -ti:3002 2>/dev/null)
if [ ! -z "$ADMIN_PID" ]; then
    echo "⏹️  Stopping Admin app (PID: $ADMIN_PID)..."
    kill $ADMIN_PID 2>/dev/null
    sleep 1
    if lsof -ti:3002 > /dev/null 2>&1; then
        echo "   Force killing..."
        kill -9 $ADMIN_PID 2>/dev/null
    fi
    echo "   ✅ Admin app stopped"
else
    echo "ℹ️  Admin app not running"
fi

echo ""
echo "✅ All apps stopped"
echo ""

