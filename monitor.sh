#!/bin/bash

# Security Monitoring Script for Stitches X
# Run this every hour via cron: 0 * * * * /path/to/monitor.sh

LOG_FILE="./security-monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')
ALERT_EMAIL="admin@yourdomain.com"  # Change this to your email

echo "[$DATE] Starting security check..." >> $LOG_FILE

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to send alert
send_alert() {
    local message="$1"
    local severity="$2"
    
    echo "[$DATE] $severity: $message" >> $LOG_FILE
    
    # Send email alert for critical issues
    if [ "$severity" = "CRITICAL" ]; then
        echo "$message" | mail -s "CRITICAL ALERT: Stitches X Security Issue" "$ALERT_EMAIL" 2>/dev/null || true
    fi
    
    # Print to console with colors
    if [ "$severity" = "CRITICAL" ]; then
        echo -e "${RED}[$DATE] CRITICAL: $message${NC}"
    elif [ "$severity" = "WARNING" ]; then
        echo -e "${YELLOW}[$DATE] WARNING: $message${NC}"
    else
        echo -e "${GREEN}[$DATE] OK: $message${NC}"
    fi
}

# 1. Server Health Check
echo "Checking server health..."
SERVER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null)
if [ "$SERVER_STATUS" = "200" ]; then
    send_alert "Server is running normally" "OK"
else
    send_alert "Server is down! Status: $SERVER_STATUS" "CRITICAL"
fi

# 2. API Endpoints Health Check
echo "Checking API endpoints..."
APIS=(
    "http://localhost:3000/api/contact:405"
    "http://localhost:3000/api/create-checkout-session:405"
    "http://localhost:3000/api/webhooks/stripe:405"
    "http://localhost:3000/api/feedback:405"
    "http://localhost:3000/api/export-data:405"
    "http://localhost:3000/api/delete-user-data:405"
)

for api in "${APIS[@]}"; do
    url=$(echo $api | cut -d: -f1-2)
    expected_status=$(echo $api | cut -d: -f3)
    
    actual_status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    if [ "$actual_status" = "$expected_status" ]; then
        send_alert "API $url responding correctly (Status: $actual_status)" "OK"
    else
        send_alert "API $url issue! Expected: $expected_status, Got: $actual_status" "WARNING"
    fi
done

# 3. Authentication System Check
echo "Checking authentication system..."
AUTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/dashboard 2>/dev/null)
if [ "$AUTH_STATUS" = "200" ]; then
    send_alert "Dashboard accessible (Status: $AUTH_STATUS)" "OK"
else
    send_alert "Dashboard access issue! Status: $AUTH_STATUS" "WARNING"
fi

# 4. Templates Page Check
echo "Checking templates page..."
TEMPLATES_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/templates 2>/dev/null)
if [ "$TEMPLATES_STATUS" = "200" ]; then
    send_alert "Templates page accessible (Status: $TEMPLATES_STATUS)" "OK"
else
    send_alert "Templates page issue! Status: $TEMPLATES_STATUS" "WARNING"
fi

# 5. Security Audit
echo "Running security audit..."
if command -v npm &> /dev/null; then
    npm audit --audit-level=high > /tmp/audit.log 2>&1
    if grep -q "found [1-9]" /tmp/audit.log; then
        send_alert "High severity vulnerabilities found! Check /tmp/audit.log" "CRITICAL"
    else
        send_alert "No high severity vulnerabilities found" "OK"
    fi
else
    send_alert "npm not found, skipping security audit" "WARNING"
fi

# 6. Environment Variables Check
echo "Checking environment variables..."
if [ -f ".env.local" ]; then
    send_alert "Environment file exists" "OK"
    
    # Check for critical variables
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local && grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        send_alert "Supabase environment variables configured" "OK"
    else
        send_alert "Missing Supabase environment variables" "CRITICAL"
    fi
    
    if grep -q "STRIPE_SECRET_KEY" .env.local && grep -q "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" .env.local; then
        send_alert "Stripe environment variables configured" "OK"
    else
        send_alert "Missing Stripe environment variables" "WARNING"
    fi
else
    send_alert "No .env.local file found - CRITICAL SECURITY ISSUE!" "CRITICAL"
fi

# 7. Build Health Check
echo "Checking build health..."
if command -v npm &> /dev/null; then
    npm run build > /tmp/build.log 2>&1
    if [ $? -eq 0 ]; then
        send_alert "Application builds successfully" "OK"
    else
        send_alert "Build failed! Check /tmp/build.log" "CRITICAL"
    fi
else
    send_alert "npm not found, skipping build check" "WARNING"
fi

# 8. Disk Space Check
echo "Checking disk space..."
DISK_USAGE=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    send_alert "Disk usage is normal ($DISK_USAGE%)" "OK"
elif [ "$DISK_USAGE" -lt 90 ]; then
    send_alert "Disk usage is high ($DISK_USAGE%)" "WARNING"
else
    send_alert "Disk usage is critical ($DISK_USAGE%)" "CRITICAL"
fi

# 9. Memory Usage Check
echo "Checking memory usage..."
if command -v free &> /dev/null; then
    MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    if [ "$MEMORY_USAGE" -lt 80 ]; then
        send_alert "Memory usage is normal ($MEMORY_USAGE%)" "OK"
    elif [ "$MEMORY_USAGE" -lt 90 ]; then
        send_alert "Memory usage is high ($MEMORY_USAGE%)" "WARNING"
    else
        send_alert "Memory usage is critical ($MEMORY_USAGE%)" "CRITICAL"
    fi
else
    send_alert "free command not available, skipping memory check" "WARNING"
fi

# 10. Process Check
echo "Checking Node.js process..."
if pgrep -f "npm run dev" > /dev/null; then
    send_alert "Development server is running" "OK"
else
    send_alert "Development server is not running" "WARNING"
fi

# Summary
echo ""
echo "=========================================="
echo "Security monitoring completed at $DATE"
echo "Check $LOG_FILE for detailed logs"
echo "=========================================="

# Clean up old logs (keep last 7 days)
find . -name "security-monitor.log" -mtime +7 -delete 2>/dev/null || true
find /tmp -name "audit.log" -mtime +1 -delete 2>/dev/null || true
find /tmp -name "build.log" -mtime +1 -delete 2>/dev/null || true
