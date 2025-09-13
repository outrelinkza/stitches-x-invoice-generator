// Simple test script to check Supabase connection and user_usage table
// Run this in your browser console on the app to debug the 406 error

console.log('Testing Supabase connection...');

// Check if supabase is available
if (typeof window !== 'undefined' && window.supabase) {
  console.log('Supabase client found');
  
  // Test basic connection
  window.supabase.from('user_usage').select('count').then(result => {
    console.log('Basic query result:', result);
  }).catch(error => {
    console.error('Basic query error:', error);
  });
  
  // Test with authentication
  window.supabase.auth.getUser().then(user => {
    console.log('Current user:', user);
    
    if (user.data.user) {
      // Test authenticated query
      window.supabase.from('user_usage')
        .select('*')
        .eq('user_id', user.data.user.id)
        .then(result => {
          console.log('Authenticated query result:', result);
        })
        .catch(error => {
          console.error('Authenticated query error:', error);
        });
    } else {
      console.log('No authenticated user');
    }
  });
} else {
  console.log('Supabase client not found');
}
