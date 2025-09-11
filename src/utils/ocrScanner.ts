import Tesseract from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
  extractedData: {
    companyName?: string;
    clientName?: string;
    address?: string;
    phone?: string;
    email?: string;
    amount?: number;
    date?: string;
    invoiceNumber?: string;
    tax?: string;
    paymentTerms?: string;
    description?: string;
    [key: string]: any; // Allow for additional extracted fields
  };
}

export const scanDocument = async (file: File): Promise<OCRResult> => {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File too large. Please use files smaller than 10MB.');
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Unsupported file type. Please use JPG, PNG, GIF, BMP, WebP, or PDF files.');
    }

    console.log('Starting OCR for file:', file.name, 'Type:', file.type, 'Size:', file.size);

    // Show loading message
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'fixed top-20 right-4 bg-blue-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
    loadingMsg.innerHTML = '🔍 Scanning document... This may take a moment.';
    document.body.appendChild(loadingMsg);

    // Perform OCR
    const { data: { text, confidence } } = await Tesseract.recognize(
      file,
      'eng',
      {
        logger: m => {
          console.log('Tesseract progress:', m);
          if (m.status === 'recognizing text') {
            loadingMsg.innerHTML = `🔍 Scanning document... ${Math.round(m.progress * 100)}%`;
          }
        }
      }
    );

    // Remove loading message
    if (document.body.contains(loadingMsg)) {
      document.body.removeChild(loadingMsg);
    }

    // Extract structured data from the text
    const extractedData = extractStructuredData(text);

    return {
      text,
      confidence,
      extractedData
    };

  } catch (error) {
    console.error('OCR Error:', error);
    
    // Remove loading message if it exists
    const loadingMsg = document.querySelector('.fixed.top-20.right-4');
    if (loadingMsg && document.body.contains(loadingMsg)) {
      document.body.removeChild(loadingMsg);
    }

    // Show error message
    const errorMsg = document.createElement('div');
    errorMsg.className = 'fixed top-20 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all';
    errorMsg.innerHTML = '❌ Failed to scan document. Please try again.';
    document.body.appendChild(errorMsg);

    setTimeout(() => {
      if (document.body.contains(errorMsg)) {
        document.body.removeChild(errorMsg);
      }
    }, 3000);

    throw error;
  }
};

const extractStructuredData = (text: string) => {
  const extractedData: OCRResult['extractedData'] = {};
  
  console.log('🔍 Starting intelligent data extraction from:', text);

  // Extract email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = text.match(emailRegex);
  if (emails && emails.length > 0) {
    extractedData.email = emails[0];
    console.log('📧 Extracted email:', extractedData.email);
  }

  // Extract phone numbers (multiple formats)
  const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})|(\+\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
  const phones = text.match(phoneRegex);
  if (phones && phones.length > 0) {
    extractedData.phone = phones[0];
    console.log('📞 Extracted phone:', extractedData.phone);
  }

  // Extract ALL monetary amounts and find the total
  const amountRegex = /\$?([\d,]+\.?\d*)/g;
  const allAmounts = text.match(amountRegex) || [];
  const amounts = allAmounts.map(amount => parseFloat(amount.replace(/[$,]/g, ''))).filter(amount => !isNaN(amount));
  
  if (amounts.length > 0) {
    // Look for "TOTAL" specifically
    const totalRegex = /(?:total|amount|sum|grand\s*total|final\s*amount)\s*:?\s*\$?([\d,]+\.?\d*)/gi;
    const totalMatch = text.match(totalRegex);
    if (totalMatch) {
      const totalStr = totalMatch[0].replace(/[$,]/g, '').replace(/[^\d.]/g, '');
      extractedData.amount = parseFloat(totalStr);
      console.log('💰 Extracted total amount:', extractedData.amount);
    } else {
      // Use the largest amount as total
      extractedData.amount = Math.max(...amounts);
      console.log('💰 Extracted amount (largest found):', extractedData.amount);
    }
  }

  // Extract dates (multiple formats)
  const dateRegex = /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})/gi;
  const dates = text.match(dateRegex);
  if (dates && dates.length > 0) {
    extractedData.date = dates[0];
    console.log('📅 Extracted date:', extractedData.date);
  }

  // Extract invoice/receipt numbers (multiple patterns)
  const invoiceRegex = /(?:invoice|inv|receipt|bill|order|ref|reference|no|number|#)\s*:?\s*([A-Z0-9\-_]+)/gi;
  const invoiceMatch = text.match(invoiceRegex);
  if (invoiceMatch) {
    extractedData.invoiceNumber = invoiceMatch[0].replace(/^(?:invoice|inv|receipt|bill|order|ref|reference|no|number|#)\s*:?\s*/gi, '');
    console.log('📄 Extracted invoice number:', extractedData.invoiceNumber);
  }

  // Intelligent name extraction
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  // Look for client/customer patterns
  const clientPatterns = [
    /(?:issued\s*to|bill\s*to|client|customer|sold\s*to|buyer)\s*:?\s*([^\n]+)/gi,
    /(?:to|for)\s*:?\s*([A-Za-z\s]+(?:Inc|LLC|Corp|Company|Ltd|Limited|LLP|LP|Co\.?))/gi
  ];
  
  for (const pattern of clientPatterns) {
    const match = text.match(pattern);
    if (match) {
      const clientInfo = match[0].replace(/^(?:issued\s*to|bill\s*to|client|customer|sold\s*to|buyer|to|for)\s*:?\s*/gi, '').trim();
      const clientLines = clientInfo.split('\n').filter(line => line.trim().length > 0);
      if (clientLines.length > 0) {
        extractedData.clientName = clientLines[0].trim();
        console.log('👤 Extracted client name:', extractedData.clientName);
        break;
      }
    }
  }

  // Look for company/business patterns
  const companyPatterns = [
    /(?:pay\s*to|from|company|business|vendor|merchant|store|shop)\s*:?\s*([^\n]+)/gi,
    /^([A-Za-z\s]+(?:Inc|LLC|Corp|Company|Ltd|Limited|LLP|LP|Co\.?|Bank|Store|Shop|Restaurant|Cafe|Hotel|Motel))/gm
  ];
  
  for (const pattern of companyPatterns) {
    const match = text.match(pattern);
    if (match) {
      const companyInfo = match[0].replace(/^(?:pay\s*to|from|company|business|vendor|merchant|store|shop)\s*:?\s*/gi, '').trim();
      const companyLines = companyInfo.split('\n').filter(line => line.trim().length > 0);
      if (companyLines.length > 0) {
        extractedData.companyName = companyLines[0].trim();
        console.log('🏢 Extracted company name:', extractedData.companyName);
        break;
      }
    }
  }

  // Fallback: Look for any business-like names
  if (!extractedData.companyName) {
    for (const line of lines.slice(0, 15)) {
      const trimmedLine = line.trim();
      if (trimmedLine.length > 3 && trimmedLine.length < 60) {
        if (/\b(Inc|LLC|Corp|Company|Ltd|Limited|Bank|Unlimited|Store|Shop|Restaurant|Cafe|Hotel|Motel|Services|Solutions|Group|Associates)\b/i.test(trimmedLine)) {
          extractedData.companyName = trimmedLine;
          console.log('🏢 Extracted company name (fallback):', extractedData.companyName);
          break;
        }
      }
    }
  }

  // Extract addresses (comprehensive patterns)
  const addressPatterns = [
    /\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Circle|Cir|Court|Ct|Place|Pl|Square|Sq)/gi,
    /\d+\s+[A-Za-z\s]+,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}/gi,
    /(?:Address|Addr)\s*:?\s*([^\n]+)/gi
  ];
  
  for (const pattern of addressPatterns) {
    const match = text.match(pattern);
    if (match) {
      extractedData.address = match[0].replace(/^(?:Address|Addr)\s*:?\s*/gi, '').trim();
      console.log('📍 Extracted address:', extractedData.address);
      break;
    }
  }

  // Extract additional useful information
  const additionalData: any = {};

  // Extract tax information
  const taxRegex = /(?:tax|vat|gst|sales\s*tax)\s*:?\s*(\d+\.?\d*%?|\$?[\d,]+\.?\d*)/gi;
  const taxMatch = text.match(taxRegex);
  if (taxMatch) {
    additionalData.tax = taxMatch[0];
    console.log('🧾 Extracted tax info:', additionalData.tax);
  }

  // Extract payment terms
  const paymentTermsRegex = /(?:payment\s*terms|terms|due\s*date)\s*:?\s*([^\n]+)/gi;
  const paymentTermsMatch = text.match(paymentTermsRegex);
  if (paymentTermsMatch) {
    additionalData.paymentTerms = paymentTermsMatch[0];
    console.log('💳 Extracted payment terms:', additionalData.paymentTerms);
  }

  // Extract description/notes
  const descriptionRegex = /(?:description|notes|memo|details|items?)\s*:?\s*([^\n]+)/gi;
  const descriptionMatch = text.match(descriptionRegex);
  if (descriptionMatch) {
    additionalData.description = descriptionMatch[0];
    console.log('📝 Extracted description:', additionalData.description);
  }

  // Store additional data
  Object.assign(extractedData, additionalData);

  console.log('✅ Final extracted data:', extractedData);
  return extractedData;
};

export const autoFillForm = (extractedData: OCRResult['extractedData'], formRef: React.RefObject<HTMLFormElement | null>) => {
  if (!formRef.current) {
    console.log('❌ No form reference found');
    return;
  }

  const form = formRef.current;
  console.log('🚀 Starting intelligent auto-fill with data:', extractedData);
  
  // Helper function to find and fill field
  const fillField = (selector: string, value: string, fieldName: string, force = false) => {
    const field = form.querySelector(selector) as HTMLInputElement;
    if (field) {
      if (!field.value || force) {
        field.value = value;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        console.log(`✅ Filled ${fieldName}:`, value);
        return true;
      } else {
        console.log(`⚠️ ${fieldName} already has value:`, field.value);
        return false;
      }
    } else {
      console.log(`❌ Field not found: ${selector} (${fieldName})`);
      return false;
    }
  };

  // Helper function to add new item row
  const addNewItem = () => {
    const addButton = form.querySelector('button[type="button"]') as HTMLButtonElement;
    if (addButton && addButton.textContent?.includes('Add Item')) {
      addButton.click();
      return true;
    }
    return false;
  };

  // Helper function to fill item fields
  const fillItemFields = (index: number, description: string, rate: string, quantity = '1') => {
    const itemContainer = form.querySelector(`[data-item-index="${index}"]`) || 
                         form.querySelectorAll('.item-row')[index] ||
                         form.querySelectorAll('[class*="item"]')[index];
    
    if (itemContainer) {
      const descField = itemContainer.querySelector('input[name*="description"], input[name*="item"]') as HTMLInputElement;
      const rateField = itemContainer.querySelector('input[name*="rate"], input[name*="price"]') as HTMLInputElement;
      const qtyField = itemContainer.querySelector('input[name*="quantity"], input[name*="qty"]') as HTMLInputElement;
      
      if (descField) descField.value = description;
      if (rateField) rateField.value = rate;
      if (qtyField) qtyField.value = quantity;
      
      console.log(`✅ Filled item ${index + 1}: ${description} - $${rate}`);
      return true;
    }
    return false;
  };

  let fieldsFilled = 0;

  // Auto-fill client information (highest priority)
  if (extractedData.clientName) {
    if (fillField('input[name="clientName"]', extractedData.clientName, 'Client Name')) fieldsFilled++;
  }

  // Auto-fill company information
  if (extractedData.companyName) {
    if (fillField('input[name="companyName"]', extractedData.companyName, 'Company Name')) fieldsFilled++;
  }

  // Auto-fill contact information
  if (extractedData.email) {
    if (fillField('input[name="companyContact"]', extractedData.email, 'Company Contact')) fieldsFilled++;
    if (fillField('input[name="clientContact"]', extractedData.email, 'Client Contact')) fieldsFilled++;
  }

  if (extractedData.phone) {
    if (fillField('input[name="clientContact"]', extractedData.phone, 'Client Contact')) fieldsFilled++;
    if (fillField('input[name="companyContact"]', extractedData.phone, 'Company Contact')) fieldsFilled++;
  }

  // Auto-fill address
  if (extractedData.address) {
    if (fillField('input[name="companyAddress"]', extractedData.address, 'Company Address')) fieldsFilled++;
    if (fillField('input[name="clientAddress"]', extractedData.address, 'Client Address')) fieldsFilled++;
  }

  // Auto-fill amounts
  if (extractedData.amount) {
    if (fillField('input[name="rate"]', extractedData.amount.toString(), 'Rate/Amount')) fieldsFilled++;
  }

  // Auto-fill date
  if (extractedData.date) {
    const formattedDate = formatDate(extractedData.date);
    if (formattedDate) {
      if (fillField('input[name="date"]', formattedDate, 'Date')) fieldsFilled++;
    }
  }

  // Auto-fill invoice number
  if (extractedData.invoiceNumber) {
    if (fillField('input[name="invoiceNumber"]', extractedData.invoiceNumber, 'Invoice Number')) fieldsFilled++;
  }

  // Auto-fill tax information
  if ((extractedData as any).tax) {
    const taxValue = (extractedData as any).tax.replace(/[^\d.]/g, '');
    if (taxValue) {
      if (fillField('input[name="taxRate"]', taxValue, 'Tax Rate')) fieldsFilled++;
    }
  }

  // Auto-fill payment terms
  if ((extractedData as any).paymentTerms) {
    if (fillField('input[name="paymentTerms"]', (extractedData as any).paymentTerms, 'Payment Terms')) fieldsFilled++;
  }

  // Intelligent service/item detection and filling
  if (extractedData.description || extractedData.companyName) {
    const description = (extractedData as any).description || `Services for ${extractedData.companyName || 'Client'}`;
    if (fillField('input[name="description"]', description, 'Description')) fieldsFilled++;
  }

  // Try to detect and add multiple items from the original text
  // This would require the original OCR text, so we'll add a basic item
  if (extractedData.amount && extractedData.companyName) {
    // Add a basic service item
    if (addNewItem()) {
      setTimeout(() => {
        fillItemFields(0, `Services for ${extractedData.companyName}`, extractedData.amount.toString());
      }, 100);
    }
  }

  // Try to fill any remaining empty fields with available data
  const emptyFields = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
  emptyFields.forEach((field: any) => {
    if (!field.value && field.name) {
      const fieldName = field.name.toLowerCase();
      
      // Smart field matching
      if (fieldName.includes('client') && extractedData.clientName) {
        field.value = extractedData.clientName;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        fieldsFilled++;
        console.log(`✅ Auto-filled ${fieldName}:`, extractedData.clientName);
      } else if (fieldName.includes('company') && extractedData.companyName) {
        field.value = extractedData.companyName;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        fieldsFilled++;
        console.log(`✅ Auto-filled ${fieldName}:`, extractedData.companyName);
      } else if (fieldName.includes('email') && extractedData.email) {
        field.value = extractedData.email;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        fieldsFilled++;
        console.log(`✅ Auto-filled ${fieldName}:`, extractedData.email);
      } else if (fieldName.includes('phone') && extractedData.phone) {
        field.value = extractedData.phone;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        fieldsFilled++;
        console.log(`✅ Auto-filled ${fieldName}:`, extractedData.phone);
      }
    }
  });

  console.log(`🎉 Auto-fill completed! Filled ${fieldsFilled} fields`);
};

const formatDate = (dateStr: string): string | null => {
  try {
    // Try to parse various date formats
    const formats = [
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/, // MM/DD/YYYY or MM-DD-YYYY
      /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/, // YYYY/MM/DD or YYYY-MM-DD
    ];

    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        let year, month, day;
        
        if (format.source.includes('\\d{4}')) {
          // YYYY/MM/DD format
          [, year, month, day] = match;
        } else {
          // MM/DD/YYYY format
          [, month, day, year] = match;
          if (year.length === 2) {
            year = '20' + year;
          }
        }

        // Ensure month and day are 2 digits
        month = month.padStart(2, '0');
        day = day.padStart(2, '0');

        return `${year}-${month}-${day}`;
      }
    }

    return null;
  } catch (error) {
    console.error('Date formatting error:', error);
    return null;
  }
};
