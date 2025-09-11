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
  
  console.log('Extracting data from text:', text);

  // Extract email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = text.match(emailRegex);
  if (emails && emails.length > 0) {
    extractedData.email = emails[0];
    console.log('Extracted email:', extractedData.email);
  }

  // Extract phone numbers
  const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  const phones = text.match(phoneRegex);
  if (phones && phones.length > 0) {
    extractedData.phone = phones[0];
    console.log('Extracted phone:', extractedData.phone);
  }

  // Extract monetary amounts (look for TOTAL amount specifically)
  const totalRegex = /(?:total|amount|sum)\s*:?\s*\$?([\d,]+\.?\d*)/gi;
  const totalMatch = text.match(totalRegex);
  if (totalMatch) {
    const amountStr = totalMatch[0].replace(/[$,]/g, '').replace(/[^\d.]/g, '');
    extractedData.amount = parseFloat(amountStr);
    console.log('Extracted total amount:', extractedData.amount);
  } else {
    // Fallback to any dollar amount
    const amountRegex = /\$([\d,]+\.?\d*)/g;
    const amounts = text.match(amountRegex);
    if (amounts && amounts.length > 0) {
      const amountStr = amounts[amounts.length - 1].replace(/[$,]/g, '');
      extractedData.amount = parseFloat(amountStr);
      console.log('Extracted amount (fallback):', extractedData.amount);
    }
  }

  // Extract dates (various formats)
  const dateRegex = /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})\b/g;
  const dates = text.match(dateRegex);
  if (dates && dates.length > 0) {
    extractedData.date = dates[0];
    console.log('Extracted date:', extractedData.date);
  }

  // Extract invoice numbers (improved pattern)
  const invoiceRegex = /(?:invoice\s*no|invoice\s*number|inv\s*no|inv\s*number|receipt\s*no|receipt\s*number)\s*:?\s*([A-Z0-9\-]+)/gi;
  const invoiceMatch = text.match(invoiceRegex);
  if (invoiceMatch) {
    extractedData.invoiceNumber = invoiceMatch[0].replace(/^(?:invoice\s*no|invoice\s*number|inv\s*no|inv\s*number|receipt\s*no|receipt\s*number)\s*:?\s*/gi, '');
    console.log('Extracted invoice number:', extractedData.invoiceNumber);
  }

  // Extract company/client names (improved patterns)
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  // Look for "ISSUED TO" or "BILL TO" patterns
  const issuedToRegex = /(?:issued\s*to|bill\s*to|client|customer)\s*:?\s*([^\n]+)/gi;
  const issuedToMatch = text.match(issuedToRegex);
  if (issuedToMatch) {
    const clientInfo = issuedToMatch[0].replace(/^(?:issued\s*to|bill\s*to|client|customer)\s*:?\s*/gi, '').trim();
    const clientLines = clientInfo.split('\n').filter(line => line.trim().length > 0);
    if (clientLines.length > 0) {
      extractedData.clientName = clientLines[0].trim();
      console.log('Extracted client name:', extractedData.clientName);
    }
  }

  // Look for "PAY TO" or company name patterns
  const payToRegex = /(?:pay\s*to|company|business)\s*:?\s*([^\n]+)/gi;
  const payToMatch = text.match(payToRegex);
  if (payToMatch) {
    const companyInfo = payToMatch[0].replace(/^(?:pay\s*to|company|business)\s*:?\s*/gi, '').trim();
    const companyLines = companyInfo.split('\n').filter(line => line.trim().length > 0);
    if (companyLines.length > 0) {
      extractedData.companyName = companyLines[0].trim();
      console.log('Extracted company name:', extractedData.companyName);
    }
  }

  // Fallback: Look for company names (usually at the top, in caps, or with "Inc", "LLC", etc.)
  if (!extractedData.companyName) {
    for (const line of lines.slice(0, 10)) {
      const trimmedLine = line.trim();
      if (trimmedLine.length > 2 && trimmedLine.length < 50) {
        if (/[A-Z]{2,}/.test(trimmedLine) || 
            /\b(Inc|LLC|Corp|Company|Ltd|Limited|Bank|Unlimited)\b/i.test(trimmedLine)) {
          extractedData.companyName = trimmedLine;
          console.log('Extracted company name (fallback):', extractedData.companyName);
          break;
        }
      }
    }
  }

  // Extract addresses (improved patterns)
  const addressRegex = /\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Circle|Cir|Court|Ct|City)/gi;
  const addressMatch = text.match(addressRegex);
  if (addressMatch && addressMatch.length > 0) {
    extractedData.address = addressMatch[0];
    console.log('Extracted address:', extractedData.address);
  }

  console.log('Final extracted data:', extractedData);
  return extractedData;
};

export const autoFillForm = (extractedData: OCRResult['extractedData'], formRef: React.RefObject<HTMLFormElement | null>) => {
  if (!formRef.current) {
    console.log('No form reference found');
    return;
  }

  const form = formRef.current;
  console.log('Auto-filling form with data:', extractedData);
  
  // Helper function to find and fill field
  const fillField = (selector: string, value: string, fieldName: string) => {
    const field = form.querySelector(selector) as HTMLInputElement;
    if (field) {
      if (!field.value) {
        field.value = value;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        console.log(`✅ Filled ${fieldName}:`, value);
      } else {
        console.log(`⚠️ ${fieldName} already has value:`, field.value);
      }
    } else {
      console.log(`❌ Field not found: ${selector} (${fieldName})`);
    }
  };

  // Auto-fill client information (this should be the main focus for invoices)
  if (extractedData.clientName) {
    fillField('input[name="clientName"]', extractedData.clientName, 'Client Name');
  }

  // Auto-fill company information
  if (extractedData.companyName) {
    fillField('input[name="companyName"]', extractedData.companyName, 'Company Name');
  }

  // Auto-fill contact information
  if (extractedData.email) {
    fillField('input[name="companyContact"]', extractedData.email, 'Company Contact');
  }

  if (extractedData.phone) {
    fillField('input[name="clientContact"]', extractedData.phone, 'Client Contact');
  }

  // Auto-fill address
  if (extractedData.address) {
    fillField('input[name="companyAddress"]', extractedData.address, 'Company Address');
  }

  // Auto-fill amounts
  if (extractedData.amount) {
    fillField('input[name="rate"]', extractedData.amount.toString(), 'Rate/Amount');
  }

  // Auto-fill date
  if (extractedData.date) {
    const formattedDate = formatDate(extractedData.date);
    if (formattedDate) {
      fillField('input[name="date"]', formattedDate, 'Date');
    }
  }

  // Auto-fill invoice number
  if (extractedData.invoiceNumber) {
    fillField('input[name="invoiceNumber"]', extractedData.invoiceNumber, 'Invoice Number');
  }

  // Try to fill service description if we have company info
  if (extractedData.companyName && !form.querySelector('input[name="description"]')?.value) {
    fillField('input[name="description"]', `Services for ${extractedData.companyName}`, 'Description');
  }

  console.log('Auto-fill completed');
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
