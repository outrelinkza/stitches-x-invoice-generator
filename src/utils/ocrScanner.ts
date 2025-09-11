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

  // Extract email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = text.match(emailRegex);
  if (emails && emails.length > 0) {
    extractedData.email = emails[0];
  }

  // Extract phone numbers
  const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  const phones = text.match(phoneRegex);
  if (phones && phones.length > 0) {
    extractedData.phone = phones[0];
  }

  // Extract monetary amounts
  const amountRegex = /\$[\d,]+\.?\d*/g;
  const amounts = text.match(amountRegex);
  if (amounts && amounts.length > 0) {
    const amountStr = amounts[amounts.length - 1].replace(/[$,]/g, '');
    extractedData.amount = parseFloat(amountStr);
  }

  // Extract dates (various formats)
  const dateRegex = /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})\b/g;
  const dates = text.match(dateRegex);
  if (dates && dates.length > 0) {
    extractedData.date = dates[0];
  }

  // Extract invoice numbers
  const invoiceRegex = /(?:invoice|inv|receipt|receipt\s*#?)\s*:?\s*([A-Z0-9\-]+)/gi;
  const invoiceMatch = text.match(invoiceRegex);
  if (invoiceMatch) {
    extractedData.invoiceNumber = invoiceMatch[0].replace(/^(?:invoice|inv|receipt|receipt\s*#?)\s*:?\s*/gi, '');
  }

  // Extract company/client names (look for common patterns)
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  // Look for company names (usually at the top, in caps, or with "Inc", "LLC", etc.)
  for (const line of lines.slice(0, 5)) {
    const trimmedLine = line.trim();
    if (trimmedLine.length > 2 && trimmedLine.length < 50) {
      if (/[A-Z]{2,}/.test(trimmedLine) || 
          /\b(Inc|LLC|Corp|Company|Ltd|Limited)\b/i.test(trimmedLine)) {
        if (!extractedData.companyName) {
          extractedData.companyName = trimmedLine;
        }
      }
    }
  }

  // Extract addresses (look for street patterns)
  const addressRegex = /\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Circle|Cir|Court|Ct)/gi;
  const addressMatch = text.match(addressRegex);
  if (addressMatch && addressMatch.length > 0) {
    extractedData.address = addressMatch[0];
  }

  return extractedData;
};

export const autoFillForm = (extractedData: OCRResult['extractedData'], formRef: React.RefObject<HTMLFormElement | null>) => {
  if (!formRef.current) return;

  const form = formRef.current;
  
  // Auto-fill company information
  if (extractedData.companyName) {
    const companyNameField = form.querySelector('input[name="companyName"]') as HTMLInputElement;
    if (companyNameField && !companyNameField.value) {
      companyNameField.value = extractedData.companyName;
      companyNameField.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  // Auto-fill client information
  if (extractedData.clientName) {
    const clientNameField = form.querySelector('input[name="clientName"]') as HTMLInputElement;
    if (clientNameField && !clientNameField.value) {
      clientNameField.value = extractedData.clientName;
      clientNameField.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  // Auto-fill contact information
  if (extractedData.email) {
    const emailField = form.querySelector('input[name="companyContact"]') as HTMLInputElement;
    if (emailField && !emailField.value) {
      emailField.value = extractedData.email;
      emailField.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  if (extractedData.phone) {
    const phoneField = form.querySelector('input[name="clientContact"]') as HTMLInputElement;
    if (phoneField && !phoneField.value) {
      phoneField.value = extractedData.phone;
      phoneField.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  // Auto-fill address
  if (extractedData.address) {
    const addressField = form.querySelector('input[name="companyAddress"]') as HTMLInputElement;
    if (addressField && !addressField.value) {
      addressField.value = extractedData.address;
      addressField.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  // Auto-fill amounts
  if (extractedData.amount) {
    const rateField = form.querySelector('input[name="rate"]') as HTMLInputElement;
    if (rateField && !rateField.value) {
      rateField.value = extractedData.amount.toString();
      rateField.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  // Auto-fill date
  if (extractedData.date) {
    const dateField = form.querySelector('input[name="date"]') as HTMLInputElement;
    if (dateField && !dateField.value) {
      // Convert date format if needed
      const formattedDate = formatDate(extractedData.date);
      if (formattedDate) {
        dateField.value = formattedDate;
        dateField.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }

  // Auto-fill invoice number
  if (extractedData.invoiceNumber) {
    const invoiceNumberField = form.querySelector('input[name="invoiceNumber"]') as HTMLInputElement;
    if (invoiceNumberField && !invoiceNumberField.value) {
      invoiceNumberField.value = extractedData.invoiceNumber;
      invoiceNumberField.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
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
