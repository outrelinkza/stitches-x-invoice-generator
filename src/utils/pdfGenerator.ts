import jsPDF from 'jspdf';

export interface InvoiceData {
  // Company Info
  companyName: string;
  companyAddress: string;
  companyContact: string;
  logo?: string;
  
  // Client Info
  clientName: string;
  clientAddress: string;
  clientContact: string;
  
  // Invoice Details
  invoiceNumber: string;
  date: string;
  dueDate: string;
  paymentTerms: string;
  
  // Items
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  
  // Totals
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  
  // Additional Info
  additionalNotes?: string;
  template: string;
  watermark?: string;
  
  // Custom Template Options
  customTemplate?: {
    name: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    layout: string;
    headerStyle: string;
    logoPosition: string;
    showLogo: boolean;
    showWatermark: boolean;
    showSignature: boolean;
    showTerms: boolean;
    spacing: string;
    borderStyle: string;
    sectionOrder: string[];
    headerHeight: string;
    footerHeight: string;
    showPageNumbers: boolean;
    showInvoiceDate: boolean;
    showDueDate: boolean;
    showInvoiceNumber: boolean;
    showClientAddress: boolean;
    showCompanyAddress: boolean;
    showTaxBreakdown: boolean;
    showDiscounts: boolean;
    showPaymentInfo: boolean;
    showNotes: boolean;
    showThankYouMessage: boolean;
    tableStyle: string;
    headerBackground: string;
    footerBackground: string;
    accentStyle: string;
    shadowStyle: string;
    cornerRadius: string;
  };
}

export const generateInvoicePDF = (data: InvoiceData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Set up colors based on template
  const getTemplateColors = (template: string) => {
    // Use custom colors if available
    if (template === 'custom' && data.customTemplate) {
      return {
        primary: data.customTemplate.primaryColor,
        secondary: data.customTemplate.secondaryColor,
        accent: data.customTemplate.accentColor
      };
    }
    
    switch (template) {
      case 'minimalist-dark':
        return { primary: '#374151', secondary: '#6B7280', accent: '#9CA3AF' };
      case 'recurring-clients':
        return { primary: '#1E40AF', secondary: '#3B82F6', accent: '#60A5FA' };
      case 'creative-agency':
        return { primary: '#BE185D', secondary: '#EC4899', accent: '#F472B6' };
      case 'consulting':
        return { primary: '#374151', secondary: '#6B7280', accent: '#9CA3AF' };
      case 'custom':
        return { primary: '#7C3AED', secondary: '#8B5CF6', accent: '#A78BFA' };
      default:
        return { primary: '#1E40AF', secondary: '#3B82F6', accent: '#60A5FA' };
    }
  };
  
  const colors = getTemplateColors(data.template);
  
  // Set up typography based on custom template
  const getTypography = () => {
    if (data.template === 'custom' && data.customTemplate) {
      return {
        fontFamily: data.customTemplate.fontFamily,
        fontSize: parseInt(data.customTemplate.fontSize.replace('px', '')),
        fontWeight: data.customTemplate.fontWeight
      };
    }
    return {
      fontFamily: 'helvetica',
      fontSize: 12,
      fontWeight: 'normal'
    };
  };
  
  const typography = getTypography();
  
  // Set up layout options
  const getLayoutOptions = () => {
    if (data.template === 'custom' && data.customTemplate) {
      return {
        showLogo: data.customTemplate.showLogo,
        showInvoiceNumber: data.customTemplate.showInvoiceNumber,
        showInvoiceDate: data.customTemplate.showInvoiceDate,
        showDueDate: data.customTemplate.showDueDate,
        showClientAddress: data.customTemplate.showClientAddress,
        showCompanyAddress: data.customTemplate.showCompanyAddress,
        showTaxBreakdown: data.customTemplate.showTaxBreakdown,
        showNotes: data.customTemplate.showNotes,
        showThankYouMessage: data.customTemplate.showThankYouMessage,
        showPageNumbers: data.customTemplate.showPageNumbers,
        spacing: data.customTemplate.spacing,
        tableStyle: data.customTemplate.tableStyle
      };
    }
    return {
      showLogo: true,
      showInvoiceNumber: true,
      showInvoiceDate: true,
      showDueDate: true,
      showClientAddress: true,
      showCompanyAddress: true,
      showTaxBreakdown: true,
      showNotes: true,
      showThankYouMessage: true,
      showPageNumbers: true,
      spacing: 'normal',
      tableStyle: 'bordered'
    };
  };
  
  const layoutOptions = getLayoutOptions();
  
  // Helper function to convert hex color to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };
  
  // Helper function to set font based on typography
  const setCustomFont = (size?: number, weight?: string) => {
    const fontSize = size || typography.fontSize;
    const fontWeight = weight || typography.fontWeight;
    
    // Map font families to jsPDF supported fonts
    let fontFamily = 'helvetica';
    if (typography.fontFamily.toLowerCase().includes('times')) {
      fontFamily = 'times';
    } else if (typography.fontFamily.toLowerCase().includes('courier')) {
      fontFamily = 'courier';
    }
    
    // Set font style based on weight
    let fontStyle = 'normal';
    if (fontWeight === 'bold' || fontWeight === '700' || fontWeight === '900') {
      fontStyle = 'bold';
    } else if (fontWeight === 'italic') {
      fontStyle = 'italic';
    }
    
    doc.setFont(fontFamily, fontStyle);
    doc.setFontSize(fontSize);
  };
  
  // Helper function to set text color
  const setTextColor = (color: string) => {
    const rgb = hexToRgb(color);
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
  };
  
  // Helper function to set fill color
  const setFillColor = (color: string) => {
    const rgb = hexToRgb(color);
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
  };
  
  // Header
  const headerHeight = data.customTemplate?.headerHeight === 'large' ? 50 : 
                      data.customTemplate?.headerHeight === 'small' ? 30 : 40;
  
  setFillColor(colors.primary);
  doc.rect(0, 0, pageWidth, headerHeight, 'F');
  
  // Logo placeholder (if logo exists and showLogo is true)
  if (data.logo && layoutOptions.showLogo) {
    setCustomFont(16);
    setTextColor('#FFFFFF');
    doc.text('LOGO', 20, headerHeight / 2 + 5);
  }
  
  // Company name
  setCustomFont(20, 'bold');
  setTextColor('#FFFFFF');
  doc.text(data.companyName, (data.logo && layoutOptions.showLogo) ? 60 : 20, headerHeight / 2 + 5);
  
  // Invoice title
  setCustomFont(24, 'bold');
  setTextColor('#FFFFFF');
  doc.text('INVOICE', pageWidth - 60, headerHeight / 2 + 5);
  
  let yPosition = headerHeight + 20;
  
  // Company details (if showCompanyAddress is true)
  if (layoutOptions.showCompanyAddress) {
    setCustomFont(typography.fontSize);
    setTextColor(colors.secondary);
    doc.text(data.companyAddress, 20, yPosition);
    yPosition += 10;
    doc.text(data.companyContact, 20, yPosition);
    yPosition += 20;
  }
  
  // Invoice details section
  const invoiceDetailsX = pageWidth - 80;
  let invoiceY = headerHeight + 20;
  
  if (layoutOptions.showInvoiceNumber) {
    setCustomFont(typography.fontSize, 'bold');
    setTextColor(colors.primary);
    doc.text('Invoice #:', invoiceDetailsX, invoiceY);
    setCustomFont(typography.fontSize);
    setTextColor(colors.textColor || '#000000');
    doc.text(data.invoiceNumber, invoiceDetailsX + 30, invoiceY);
    invoiceY += 10;
  }
  
  if (layoutOptions.showInvoiceDate) {
    setCustomFont(typography.fontSize, 'bold');
    setTextColor(colors.primary);
    doc.text('Date:', invoiceDetailsX, invoiceY);
    setCustomFont(typography.fontSize);
    setTextColor(colors.textColor || '#000000');
    doc.text(data.date, invoiceDetailsX + 30, invoiceY);
    invoiceY += 10;
  }
  
  if (layoutOptions.showDueDate) {
    setCustomFont(typography.fontSize, 'bold');
    setTextColor(colors.primary);
    doc.text('Due Date:', invoiceDetailsX, invoiceY);
    setCustomFont(typography.fontSize);
    setTextColor(colors.textColor || '#000000');
    doc.text(data.dueDate, invoiceDetailsX + 30, invoiceY);
    invoiceY += 10;
  }
  
  doc.text('Payment Terms:', invoiceDetailsX, invoiceY);
  setCustomFont(typography.fontSize);
  setTextColor(colors.textColor || '#000000');
  doc.text(data.paymentTerms, invoiceDetailsX + 30, invoiceY);
  invoiceY += 20;
  
  // Client details (if showClientAddress is true)
  if (layoutOptions.showClientAddress) {
    setCustomFont(typography.fontSize + 2, 'bold');
    setTextColor(colors.primary);
    doc.text('Bill To:', 20, yPosition);
    yPosition += 15;
    
    setCustomFont(typography.fontSize);
    setTextColor(colors.textColor || '#000000');
    doc.text(data.clientName, 20, yPosition);
    yPosition += 10;
    doc.text(data.clientAddress, 20, yPosition);
    yPosition += 10;
    doc.text(data.clientContact, 20, yPosition);
    yPosition += 20;
  }
  
  // Items table
  setCustomFont(typography.fontSize + 2, 'bold');
  setTextColor(colors.primary);
  doc.text('Items', 20, yPosition);
  yPosition += 15;
  
  // Table headers
  const tableStartY = yPosition;
  const colWidths = [80, 30, 30, 30];
  const colPositions = [20, 100, 130, 160];
  
  setCustomFont(typography.fontSize, 'bold');
  setTextColor('#FFFFFF');
  setFillColor(colors.primary);
  
  // Header row
  doc.rect(20, yPosition - 5, 170, 15, 'F');
  doc.text('Description', colPositions[0], yPosition);
  doc.text('Qty', colPositions[1], yPosition);
  doc.text('Rate', colPositions[2], yPosition);
  doc.text('Amount', colPositions[3], yPosition);
  yPosition += 15;
  
  // Items rows
  setCustomFont(typography.fontSize);
  setTextColor(colors.textColor || '#000000');
  
  data.items.forEach((item, index) => {
    // Alternate row colors
    if (index % 2 === 0) {
      setFillColor('#F8F9FA');
      doc.rect(20, yPosition - 5, 170, 15, 'F');
    }
    
    doc.text(item.description, colPositions[0], yPosition);
    doc.text(item.quantity.toString(), colPositions[1], yPosition);
    doc.text(`$${item.rate.toFixed(2)}`, colPositions[2], yPosition);
    doc.text(`$${item.amount.toFixed(2)}`, colPositions[3], yPosition);
    yPosition += 15;
  });
  
  // Totals section
  yPosition += 10;
  const totalsX = pageWidth - 80;
  
  setCustomFont(typography.fontSize);
  setTextColor(colors.textColor || '#000000');
  doc.text('Subtotal:', totalsX, yPosition);
  doc.text(`$${data.subtotal.toFixed(2)}`, totalsX + 30, yPosition);
  yPosition += 10;
  
  if (layoutOptions.showTaxBreakdown && data.taxRate > 0) {
    doc.text(`Tax (${data.taxRate}%):`, totalsX, yPosition);
    doc.text(`$${data.taxAmount.toFixed(2)}`, totalsX + 30, yPosition);
    yPosition += 10;
  }
  
  // Total line
  setCustomFont(typography.fontSize + 2, 'bold');
  setTextColor(colors.primary);
  doc.text('Total:', totalsX, yPosition);
  doc.text(`$${data.total.toFixed(2)}`, totalsX + 30, yPosition);
  
  // Additional notes (if showNotes is true)
  if (layoutOptions.showNotes && data.additionalNotes) {
    yPosition += 30;
    setCustomFont(typography.fontSize, 'bold');
    setTextColor(colors.primary);
    doc.text('Notes:', 20, yPosition);
    yPosition += 10;
    
    setCustomFont(typography.fontSize);
    setTextColor(colors.textColor || '#000000');
    const splitNotes = doc.splitTextToSize(data.additionalNotes, 150);
    doc.text(splitNotes, 20, yPosition);
  }
  
  // Thank you message (if showThankYouMessage is true)
  if (layoutOptions.showThankYouMessage) {
    yPosition += 40;
    setCustomFont(typography.fontSize + 2, 'bold');
    setTextColor(colors.primary);
    doc.text('Thank you for your business!', 20, yPosition);
  }
  
  // Page numbers (if showPageNumbers is true)
  if (layoutOptions.showPageNumbers) {
    setCustomFont(typography.fontSize - 2);
    setTextColor(colors.secondary);
    doc.text('Page 1', pageWidth - 30, pageHeight - 10);
  }
  
  // Watermark (if showWatermark is true and watermark exists)
  if (data.customTemplate?.showWatermark && data.watermark) {
    doc.setGState(new doc.GState({opacity: 0.1}));
    setCustomFont(48, 'bold');
    setTextColor(colors.secondary);
    doc.text(data.watermark, pageWidth / 2, pageHeight / 2, { angle: 45, align: 'center' });
    doc.setGState(new doc.GState({opacity: 1}));
  }
  
  // Download the PDF
  doc.save(`invoice-${data.invoiceNumber}.pdf`);
};