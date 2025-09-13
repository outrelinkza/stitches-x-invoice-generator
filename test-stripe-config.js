// Test script to check Stripe configuration
// Run this in your browser console

console.log('🧪 Testing Stripe Configuration...');

// Test 1: Check if Stripe is loaded
console.log('1. Checking Stripe configuration...');
if (typeof window !== 'undefined' && window.Stripe) {
  console.log('✅ Stripe is loaded');
} else {
  console.log('❌ Stripe not loaded');
}

// Test 2: Check if payment buttons exist
console.log('2. Checking payment buttons...');
const paymentButtons = document.querySelectorAll('button[onclick*="createOneTimePayment"], button[onclick*="createSubscription"]');
console.log(`Found ${paymentButtons.length} payment buttons`);

paymentButtons.forEach((button, index) => {
  console.log(`Button ${index + 1}:`, button.textContent);
  console.log(`Button onclick:`, button.onclick);
});

// Test 3: Check if API endpoint exists
console.log('3. Testing API endpoint...');
fetch('/api/create-checkout-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    priceId: 'test',
    mode: 'payment',
    successUrl: 'http://localhost:3001/?payment=success',
    cancelUrl: 'http://localhost:3001/?payment=cancelled'
  })
})
.then(response => {
  console.log('API Response Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('API Response Data:', data);
  if (data.error) {
    console.log('❌ API Error:', data.error);
  } else {
    console.log('✅ API is working');
  }
})
.catch(error => {
  console.log('❌ API Request Failed:', error);
});

// Test 4: Check environment variables
console.log('4. Checking environment variables...');
console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Not set');

// Test 5: Check if payment functions are available
console.log('5. Checking payment functions...');
if (typeof window !== 'undefined' && window.createOneTimePayment) {
  console.log('✅ createOneTimePayment function available');
} else {
  console.log('❌ createOneTimePayment function not available');
}

if (typeof window !== 'undefined' && window.createSubscription) {
  console.log('✅ createSubscription function available');
} else {
  console.log('❌ createSubscription function not available');
}

// Test 6: Check for console errors
console.log('6. Checking for console errors...');
const originalError = console.error;
let errorCount = 0;
console.error = function(...args) {
  errorCount++;
  console.log('❌ Console error:', args);
  originalError.apply(console, args);
};

// Test 7: Check if Stripe elements are in DOM
console.log('7. Checking Stripe elements...');
const stripeElements = document.querySelectorAll('[data-stripe], .stripe-element');
console.log(`Found ${stripeElements.length} Stripe elements`);

console.log('🎉 Stripe Configuration Test Complete!');
console.log('If you see any ❌ errors, those need to be fixed.');
