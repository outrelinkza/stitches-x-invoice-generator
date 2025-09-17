#!/bin/bash

# Production Monitoring Script for Stitches X
# Run this every hour via cron for production monitoring

PRODUCTION_URL="https://yourdomain.vercel.app"  # Update this with your actual domain
LOG_FILE="./production-monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')
ALERT_EMAIL="admin@yourdomain.com"  # Change this to your email

echo "[$DATE] Starting production security check..." >> $LOG_FILE

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
        echo "$message" | mail -s "CRITICAL ALERT: Stitches X Production Issue" "$ALERT_EMAIL" 2>/dev/null || true
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

# 1. Production Server Health Check
echo "Checking production server health..."
SERVER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PRODUCTION_URL" 2>/dev/null)
if [ "$SERVER_STATUS" = "200" ]; then
    send_alert "Production server is running normally" "OK"
else
    send_alert "Production server is down! Status: $SERVER_STATUS" "CRITICAL"
fi

# 2. API Endpoints Health Check
echo "Checking production API endpoints..."
APIS=(
    "$PRODUCTION_URL/api/contact:405"
    "$PRODUCTION_URL/api/create-checkout-session:405"
    "$PRODUCTION_URL/api/webhooks/stripe:405"
    "$PRODUCTION_URL/api/feedback:405"
    "$PRODUCTION_URL/api/export-data:405"
    "$PRODUCTION_URL/api/delete-user-data:405"
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
echo "Checking production authentication system..."
AUTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PRODUCTION_URL/dashboard" 2>/dev/null)
if [ "$AUTH_STATUS" = "200" ]; then
    send_alert "Dashboard accessible (Status: $AUTH_STATUS)" "OK"
else
    send_alert "Dashboard access issue! Status: $AUTH_STATUS" "WARNING"
fi

# 4. Templates Page Check
echo "Checking production templates page..."
TEMPLATES_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PRODUCTION_URL/templates" 2>/dev/null)
if [ "$TEMPLATES_STATUS" = "200" ]; then
    send_alert "Templates page accessible (Status: $TEMPLATES_STATUS)" "OK"
else
    send_alert "Templates page issue! Status: $TEMPLATES_STATUS" "WARNING"
fi

# 5. Response Time Check
echo "Checking response times..."
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$PRODUCTION_URL" 2>/dev/null)
RESPONSE_TIME_MS=$(echo "$RESPONSE_TIME * 1000" | bc 2>/dev/null || echo "0")

if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l 2>/dev/null || echo "1") )); then
    send_alert "Response time is good (${RESPONSE_TIME_MS}ms)" "OK"
elif (( $(echo "$RESPONSE_TIME < 5.0" | bc -l 2>/dev/null || echo "1") )); then
    send_alert "Response time is slow (${RESPONSE_TIME_MS}ms)" "WARNING"
else
    send_alert "Response time is critical (${RESPONSE_TIME_MS}ms)" "CRITICAL"
fi

# 6. SSL Certificate Check
echo "Checking SSL certificate..."
SSL_CHECK=$(echo | openssl s_client -servername $(echo $PRODUCTION_URL | sed 's|https://||' | sed 's|/.*||') -connect $(echo $PRODUCTION_URL | sed 's|https://||' | sed 's|/.*||'):443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)

if [ $? -eq 0 ]; then
    send_alert "SSL certificate is valid" "OK"
else
    send_alert "SSL certificate issue detected" "CRITICAL"
fi

# 7. Stripe Webhook Test
echo "Testing Stripe webhook endpoint..."
WEBHOOK_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PRODUCTION_URL/api/webhooks/stripe" 2>/dev/null)
if [ "$WEBHOOK_STATUS" = "405" ]; then
    send_alert "Stripe webhook endpoint accessible" "OK"
else
    send_alert "Stripe webhook endpoint issue! Status: $WEBHOOK_STATUS" "WARNING"
fi

# 8. Database Connection Test (via API)
echo "Testing database connection..."
# This would require a specific health check endpoint
DB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PRODUCTION_URL/api/health" 2>/dev/null)
if [ "$DB_STATUS" = "200" ]; then
    send_alert "Database connection healthy" "OK"
else
    send_alert "Database connection issue! Status: $DB_STATUS" "WARNING"
fi

# 9. Payment Processing Test
echo "Testing payment processing..."
# This would require a test endpoint or Stripe test
PAYMENT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PRODUCTION_URL/api/create-checkout-session" 2>/dev/null)
if [ "$PAYMENT_STATUS" = "405" ]; then
    send_alert "Payment processing endpoint accessible" "OK"
else
    send_alert "Payment processing issue! Status: $PAYMENT_STATUS" "WARNING"
fi

# 10. User Registration Test
echo "Testing user registration flow..."
REG_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PRODUCTION_URL" 2>/dev/null)
if [ "$REG_STATUS" = "200" ]; then
    send_alert "User registration page accessible" "OK"
else
    send_alert "User registration page issue! Status: $REG_STATUS" "WARNING"
fi

# Summary
echo ""
echo "=========================================="
echo "Production monitoring completed at $DATE"
echo "Check $LOG_FILE for detailed logs"
echo "Production URL: $PRODUCTION_URL"
echo "=========================================="

# Clean up old logs (keep last 30 days)
find . -name "production-monitor.log" -mtime +30 -delete 2>/dev/null || true

# Send daily summary (if it's the first run of the day)
if [ $(date +%H) = "00" ]; then
    echo "Daily production summary for $(date +%Y-%m-%d)" | mail -s "Daily Production Summary - Stitches X" "$ALERT_EMAIL" 2>/dev/null || true
fi
