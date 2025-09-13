#!/bin/bash

# Test script to check Supabase API directly with curl
# Replace YOUR_SUPABASE_ANON_KEY with your actual anon key

SUPABASE_URL="https://yabqnltffeknnanvvxzi.supabase.co"
SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"  # Replace with your actual key
USER_ID="11ffc863-7309-43ae-b0b0-709fae7ad2b8"  # Replace with your actual user ID

echo "Testing Supabase API with curl..."
echo "URL: $SUPABASE_URL"
echo "User ID: $USER_ID"
echo ""

# Test 1: Basic table query
echo "Test 1: Basic table query"
curl -X GET \
  "$SUPABASE_URL/rest/v1/user_usage?select=*" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json"

echo ""
echo ""

# Test 2: Query with user_id filter
echo "Test 2: Query with user_id filter"
curl -X GET \
  "$SUPABASE_URL/rest/v1/user_usage?select=*&user_id=eq.$USER_ID" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json"

echo ""
echo ""

# Test 3: Test with different column name (snake_case)
echo "Test 3: Query with snake_case column name"
curl -X GET \
  "$SUPABASE_URL/rest/v1/user_usage?select=*&user_id=eq.$USER_ID" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json"

echo ""
echo ""

# Test 4: Test table existence
echo "Test 4: Check if table exists"
curl -X GET \
  "$SUPABASE_URL/rest/v1/user_usage" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json"
