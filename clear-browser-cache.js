// Clear browser cache and test script
// Run this in your browser console

console.log('Clearing browser cache and testing...');

// Clear all caches
if ('caches' in window) {
  caches.keys().then(function(names) {
    for (let name of names) {
      caches.delete(name);
    }
    console.log('All caches cleared');
  });
}

// Clear LocalStorage
localStorage.clear();
console.log('LocalStorage cleared');

// Clear SessionStorage
sessionStorage.clear();
console.log('SessionStorage cleared');

// Force reload without cache
console.log('Reloading page without cache...');
window.location.reload(true);
