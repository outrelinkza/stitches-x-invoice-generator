// Test script to check Supabase headers and connection
// Run this in your browser console on the app

console.log('Testing Supabase headers and connection...');

// Check if supabase client is available
if (typeof window !== 'undefined' && window.supabase) {
  console.log('Supabase client found');
  
  // Test 1: Check the client configuration
  console.log('Supabase URL:', window.supabase.supabaseUrl);
  console.log('Supabase Key (first 20 chars):', window.supabase.supabaseKey?.substring(0, 20) + '...');
  
  // Test 2: Check current user
  window.supabase.auth.getUser().then(user => {
    console.log('Current user:', user);
    
    if (user.data.user) {
      console.log('User ID:', user.data.user.id);
      console.log('User Email:', user.data.user.email);
      
      // Test 3: Try a simple query
      console.log('Testing simple query...');
      window.supabase.from('user_usage')
        .select('*')
        .limit(1)
        .then(result => {
          console.log('Simple query result:', result);
        })
        .catch(error => {
          console.error('Simple query error:', error);
        });
        
      // Test 4: Try query with user_id
      console.log('Testing query with user_id...');
      window.supabase.from('user_usage')
        .select('*')
        .eq('user_id', user.data.user.id)
        .then(result => {
          console.log('User query result:', result);
        })
        .catch(error => {
          console.error('User query error:', error);
        });
    } else {
      console.log('No authenticated user - testing as anonymous');
      
      // Test 5: Try anonymous query
      window.supabase.from('user_usage')
        .select('*')
        .limit(1)
        .then(result => {
          console.log('Anonymous query result:', result);
        })
        .catch(error => {
          console.error('Anonymous query error:', error);
        });
    }
  });
} else {
  console.log('Supabase client not found');
}

// Test 6: Check network requests
console.log('Check the Network tab in DevTools for the actual requests being made');
console.log('Look for requests to yabqnltffeknnanvvxzi.supabase.co');
console.log('Check the request headers to see if apikey and Authorization are present');
