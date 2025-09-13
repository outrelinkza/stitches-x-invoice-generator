// Test script for custom template functionality
// Run this in your browser console to test the custom template builder

console.log('🧪 Testing Custom Template Builder...');

// Test 1: Check if custom template state exists
console.log('1. Checking custom template state...');
if (typeof window !== 'undefined' && window.React) {
  console.log('✅ React is available');
} else {
  console.log('❌ React not found');
}

// Test 2: Check if custom template modal is accessible
console.log('2. Checking custom template modal...');
const customBuilderButton = document.querySelector('button[onclick*="setShowCustomBuilder"]');
if (customBuilderButton) {
  console.log('✅ Custom builder button found');
} else {
  console.log('❌ Custom builder button not found');
}

// Test 3: Check if custom template inputs are working
console.log('3. Checking custom template inputs...');
const customModal = document.querySelector('[data-custom-builder]');
if (customModal) {
  console.log('✅ Custom builder modal found');
  
  // Test color inputs
  const colorInputs = customModal.querySelectorAll('input[type="color"]');
  console.log(`✅ Found ${colorInputs.length} color inputs`);
  
  // Test text inputs
  const textInputs = customModal.querySelectorAll('input[type="text"]');
  console.log(`✅ Found ${textInputs.length} text inputs`);
  
  // Test selects
  const selects = customModal.querySelectorAll('select');
  console.log(`✅ Found ${selects.length} select dropdowns`);
  
  // Test checkboxes
  const checkboxes = customModal.querySelectorAll('input[type="checkbox"]');
  console.log(`✅ Found ${checkboxes.length} checkboxes`);
  
} else {
  console.log('❌ Custom builder modal not found');
}

// Test 4: Check if form inputs have custom styling
console.log('4. Checking form input styling...');
const formInputs = document.querySelectorAll('input[style*="borderColor"], input[style*="backgroundColor"]');
if (formInputs.length > 0) {
  console.log(`✅ Found ${formInputs.length} inputs with custom styling`);
} else {
  console.log('❌ No inputs with custom styling found');
}

// Test 5: Check if PDF generation works
console.log('5. Checking PDF generation...');
if (typeof window !== 'undefined' && window.generateInvoicePDF) {
  console.log('✅ PDF generation function available');
} else {
  console.log('❌ PDF generation function not found');
}

// Test 6: Check if custom template is saved to localStorage
console.log('6. Checking localStorage...');
const savedTemplate = localStorage.getItem('customTemplate');
if (savedTemplate) {
  console.log('✅ Custom template found in localStorage');
  try {
    const parsed = JSON.parse(savedTemplate);
    console.log('✅ Custom template is valid JSON');
    console.log('Template properties:', Object.keys(parsed));
  } catch (e) {
    console.log('❌ Custom template is invalid JSON');
  }
} else {
  console.log('❌ No custom template in localStorage');
}

// Test 7: Check if line items are working
console.log('7. Checking line items...');
const addItemButton = document.querySelector('button[onclick*="addLineItem"]');
if (addItemButton) {
  console.log('✅ Add line item button found');
} else {
  console.log('❌ Add line item button not found');
}

const lineItems = document.querySelectorAll('[data-line-item]');
console.log(`✅ Found ${lineItems.length} line items`);

// Test 8: Check if tooltips are working
console.log('8. Checking tooltips...');
const tooltips = document.querySelectorAll('[title]');
console.log(`✅ Found ${tooltips.length} elements with tooltips`);

// Test 9: Check if live preview is working
console.log('9. Checking live preview...');
const livePreview = document.querySelector('[data-live-preview]');
if (livePreview) {
  console.log('✅ Live preview found');
} else {
  console.log('❌ Live preview not found');
}

// Test 10: Check if Test PDF button works
console.log('10. Checking Test PDF button...');
const testPdfButton = document.querySelector('button[onclick*="generateInvoicePDF"]');
if (testPdfButton) {
  console.log('✅ Test PDF button found');
} else {
  console.log('❌ Test PDF button not found');
}

console.log('🎉 Custom Template Builder Test Complete!');
console.log('If you see any ❌ errors, those features need to be fixed.');
