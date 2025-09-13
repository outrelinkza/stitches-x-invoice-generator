// Test script to check custom template access
// Run this in your browser console

console.log('🧪 Testing Custom Template Access...');

// Test 1: Check if the custom builder button exists and is clickable
console.log('1. Checking custom builder button...');
const customButton = document.querySelector('button[onclick*="setShowCustomBuilder"]');
if (customButton) {
  console.log('✅ Custom builder button found');
  console.log('Button text:', customButton.textContent);
  console.log('Button onclick:', customButton.onclick);
  
  // Test clicking the button
  console.log('2. Testing button click...');
  try {
    customButton.click();
    console.log('✅ Button click executed');
    
    // Check if modal opened
    setTimeout(() => {
      const modal = document.querySelector('[data-custom-builder]') || 
                   document.querySelector('.fixed.inset-0.bg-black\\/50');
      if (modal) {
        console.log('✅ Custom builder modal opened');
      } else {
        console.log('❌ Custom builder modal did not open');
      }
    }, 100);
    
  } catch (error) {
    console.log('❌ Button click failed:', error);
  }
} else {
  console.log('❌ Custom builder button not found');
}

// Test 2: Check if there are any usage tracking components
console.log('3. Checking for usage tracking components...');
const usageLock = document.querySelector('[data-usage-lock]') || 
                 document.querySelector('.fixed.inset-0.bg-black\\/50');
if (usageLock) {
  console.log('❌ Usage lock modal found - this might be blocking access');
} else {
  console.log('✅ No usage lock modal found');
}

// Test 3: Check if there are any error messages
console.log('4. Checking for error messages...');
const errorMessages = document.querySelectorAll('.text-red-400, .text-red-500, .bg-red-500');
if (errorMessages.length > 0) {
  console.log('❌ Found error messages:', errorMessages.length);
  errorMessages.forEach((msg, index) => {
    console.log(`Error ${index + 1}:`, msg.textContent);
  });
} else {
  console.log('✅ No error messages found');
}

// Test 4: Check if the custom template state is accessible
console.log('5. Checking custom template state...');
if (typeof window !== 'undefined' && window.React) {
  console.log('✅ React is available');
} else {
  console.log('❌ React not found');
}

// Test 5: Check if there are any console errors
console.log('6. Checking for console errors...');
const originalError = console.error;
let errorCount = 0;
console.error = function(...args) {
  errorCount++;
  console.log('❌ Console error:', args);
  originalError.apply(console, args);
};

// Test 6: Check if the modal is in the DOM
console.log('7. Checking modal DOM...');
const modalElements = document.querySelectorAll('.fixed.inset-0');
console.log(`Found ${modalElements.length} fixed overlay elements`);

modalElements.forEach((element, index) => {
  console.log(`Modal ${index + 1}:`, element.className);
});

console.log('🎉 Custom Template Access Test Complete!');
console.log('If you see any ❌ errors, those need to be fixed.');
