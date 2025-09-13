// Clear usage tracking cache - run this in browser console
// This will clear any cached data that might be causing the 406 error

console.log('Clearing usage tracking cache...');

// Clear LocalStorage
localStorage.removeItem('invoicepro_usage');
localStorage.removeItem('invoicepro_monthly_reset');
localStorage.removeItem('customTemplate');

console.log('LocalStorage cleared');

// Clear session storage
sessionStorage.clear();

console.log('SessionStorage cleared');

// Reload the page to reset everything
console.log('Reloading page...');
window.location.reload();
