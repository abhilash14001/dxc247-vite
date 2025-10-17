#!/bin/bash

# DXC247 Monorepo App Status Checker

echo "📊 DXC247 Monorepo - Application Status"
echo "=========================================="
echo ""

# Check user app
echo "User App (port 3001):"
USER_PID=$(lsof -ti:3001 2>/dev/null)
if [ ! -z "$USER_PID" ]; then
    echo "  Status: 🟢 Running (PID: $USER_PID)"
    if curl -s http://localhost:3001 > /dev/null 2>&1; then
        echo "  HTTP:   ✅ Responding (200 OK)"
        echo "  URL:    http://localhost:3001"
    else
        echo "  HTTP:   ⚠️  Not responding"
    fi
else
    echo "  Status: 🔴 Not running"
fi

echo ""

# Check admin app
echo "Admin App (port 3002):"
ADMIN_PID=$(lsof -ti:3002 2>/dev/null)
if [ ! -z "$ADMIN_PID" ]; then
    echo "  Status: 🟢 Running (PID: $ADMIN_PID)"
    if curl -s http://localhost:3002 > /dev/null 2>&1; then
        echo "  HTTP:   ✅ Responding (200 OK)"
        echo "  URL:    http://localhost:3002"
    else
        echo "  HTTP:   ⚠️  Not responding"
    fi
else
    echo "  Status: 🔴 Not running"
fi

echo ""
echo "📝 Logs:"
echo "  User:  tail -f /tmp/user-app.log"
echo "  Admin: tail -f /tmp/admin-app.log"
echo ""

# Show running processes
echo "🔄 Running Processes:"
ps aux | grep -E "vite.*(3001|3002)" | grep -v grep | awk '{print "  PID " $2 ": " $11 " " $12 " " $13 " " $14}' || echo "  No Vite processes found"
echo ""

