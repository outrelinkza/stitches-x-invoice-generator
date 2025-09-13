// Debug script for 404 error
// Run this in your browser console

console.log('🔍 DEBUGGING 404 ERROR...');

// Check if new code is running
console.log('1. Checking if new code is running...');
console.log('Look for: "🎉 NEW CODE RUNNING - USAGE TRACKING REMOVED - VERSION 3.0"');

// Clear all caches
console.log('2. Clearing all caches...');
if ('caches' in window) {
  caches.keys().then(function(names) {
    for (let name of names) {
      caches.delete(name);
    }
    console.log('✅ All caches cleared');
  });
}

// Clear LocalStorage
console.log('3. Clearing LocalStorage...');
localStorage.clear();
console.log('✅ LocalStorage cleared');

// Clear SessionStorage
console.log('4. Clearing SessionStorage...');
sessionStorage.clear();
console.log('✅ SessionStorage cleared');

// Check for any remaining usage tracking code
console.log('5. Checking for usage tracking code...');
const scripts = document.querySelectorAll('script');
let foundUsageCode = false;
scripts.forEach(script => {
  if (script.src && script.src.includes('usage')) {
    console.log('❌ Found usage tracking script:', script.src);
    foundUsageCode = true;
  }
});

if (!foundUsageCode) {
  console.log('✅ No usage tracking scripts found');
}

// Check for any remaining Supabase calls
console.log('6. Checking for Supabase calls...');
const networkRequests = performance.getEntriesByType('resource');
const supabaseRequests = networkRequests.filter(req => 
  req.name.includes('supabase') && req.name.includes('user_usage')
);

if (supabaseRequests.length > 0) {
  console.log('❌ Found Supabase user_usage requests:', supabaseRequests);
} else {
  console.log('✅ No Supabase user_usage requests found');
}

// Force reload without cache
console.log('7. Reloading page without cache...');
console.log('After reload, check console for VERSION 3.0 message');
window.location.reload(true);
