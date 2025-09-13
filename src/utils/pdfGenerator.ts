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
  
  // Header
  doc.setFillColor(colors.primary);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Logo placeholder (if logo exists and showLogo is true)
  if (data.logo && layoutOptions.showLogo) {
    // In a real implementation, you'd convert the logo to base64 and add it
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('LOGO', 20, 25);
  }
  
  // Company name
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text(data.companyName, (data.logo && layoutOptions.showLogo) ? 60 : 20, 25);
  
  // Invoice title
  doc.setFontSize(24);
  doc.setTextColor(colors.primary);
  doc.text('INVOICE', pageWidth - 60, 25);
  
  // Company details
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  let yPos = 50;
  doc.text(data.companyAddress, 20, yPos);
  yPos += 5;
  doc.text(data.companyContact, 20, yPos);
  
  // Invoice details box
  yPos = 50;
  doc.setFillColor(240, 240, 240);
  doc.rect(pageWidth - 80, yPos - 10, 70, 30, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(colors.primary);
  doc.text('Invoice #:', pageWidth - 75, yPos);
  doc.text(data.invoiceNumber, pageWidth - 45, yPos);
  yPos += 5;
  
  doc.text('Date:', pageWidth - 75, yPos);
  doc.text(data.date, pageWidth - 45, yPos);
  yPos += 5;
  
  doc.text('Due Date:', pageWidth - 75, yPos);
  doc.text(data.dueDate, pageWidth - 45, yPos);
  yPos += 5;
  
  doc.text('Terms:', pageWidth - 75, yPos);
  doc.text(data.paymentTerms, pageWidth - 45, yPos);
  
  // Bill to section
  yPos = 90;
  doc.setFontSize(12);
  doc.setTextColor(colors.primary);
  doc.text('Bill To:', 20, yPos);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  yPos += 8;
  doc.text(data.clientName, 20, yPos);
  yPos += 5;
  doc.text(data.clientAddress, 20, yPos);
  yPos += 5;
  doc.text(data.clientContact, 20, yPos);
  
  // Items table header
  yPos = 120;
  doc.setFillColor(colors.secondary);
  doc.rect(20, yPos - 5, pageWidth - 40, 10, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('Description', 25, yPos);
  doc.text('Qty', pageWidth - 100, yPos);
  doc.text('Rate', pageWidth - 80, yPos);
  doc.text('Amount', pageWidth - 40, yPos);
  
  // Items
  yPos += 10;
  data.items.forEach((item, index) => {
    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPos = 20;
    }
    
    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(248, 248, 248);
      doc.rect(20, yPos - 3, pageWidth - 40, 8, 'F');
    }
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(item.description, 25, yPos);
    doc.text(item.quantity.toString(), pageWidth - 100, yPos);
    doc.text(`$${item.rate.toFixed(2)}`, pageWidth - 80, yPos);
    doc.text(`$${item.amount.toFixed(2)}`, pageWidth - 40, yPos);
    yPos += 8;
  });
  
  // Totals
  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Subtotal:', pageWidth - 80, yPos);
  doc.text(`$${data.subtotal.toFixed(2)}`, pageWidth - 40, yPos);
  yPos += 8;
  
  doc.text(`Tax (${data.taxRate}%):`, pageWidth - 80, yPos);
  doc.text(`$${data.taxAmount.toFixed(2)}`, pageWidth - 40, yPos);
  yPos += 8;
  
  doc.setFontSize(12);
  doc.setTextColor(colors.primary);
  doc.text('Total:', pageWidth - 80, yPos);
  doc.text(`$${data.total.toFixed(2)}`, pageWidth - 40, yPos);
  
  // Additional notes
  if (data.additionalNotes) {
    yPos += 20;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Notes:', 20, yPos);
    yPos += 8;
    doc.text(data.additionalNotes, 20, yPos);
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 20, { align: 'center' });
  
  // Add watermark if provided
  if (data.watermark) {
    doc.setGState(new doc.GState({ opacity: 0.1 }));
    doc.setFontSize(16);
    doc.setTextColor(200, 200, 200);
    doc.text(data.watermark, pageWidth / 2, pageHeight / 2, { 
      align: 'center',
      angle: 45 
    });
    doc.setGState(new doc.GState({ opacity: 1 }));
  }
  
  // Save the PDF
  doc.save(`invoice-${data.invoiceNumber}.pdf`);
};
