// Payment gating utility for PDF downloads
export interface PaymentStatus {
  hasAccess: boolean;
  isGuest: boolean;
  isSubscribed: boolean;
  hasPaidForInvoice: boolean;
  remainingFreeInvoices: number;
  lastPaymentDate?: string;
}

// Download limitations
const GUEST_FREE_INVOICE_LIMIT = 1; // Only 1 free invoice for guests
const REGISTERED_FREE_INVOICE_LIMIT = 2; // Exactly 2 free invoices for registered users

// Check if user has access to download PDF
export const checkPaymentStatus = (): PaymentStatus => {
  if (typeof window === 'undefined') {
    return {
      hasAccess: false,
      isGuest: true,
      isSubscribed: false,
      hasPaidForInvoice: false,
      remainingFreeInvoices: 0,
    };
  }

  // Check if user is logged in (you'll need to import useAuth or pass user as parameter)
  const user = null; // This should be passed from the component or context
  
  // Get stored data
  const guestInvoiceCount = parseInt(localStorage.getItem('guestInvoiceCount') || '0');
  const registeredInvoiceCount = parseInt(localStorage.getItem('registeredInvoiceCount') || '0');
  const hasActiveSubscription = localStorage.getItem('hasActiveSubscription') === 'true';
  const lastPaymentDate = localStorage.getItem('lastPaymentDate');
  const hasPaidForCurrentInvoice = localStorage.getItem('hasPaidForCurrentInvoice') === 'true';

  const isGuest = !user;
  const isSubscribed = hasActiveSubscription;
  const hasPaidForInvoice = hasPaidForCurrentInvoice;

  // Calculate remaining free invoices
  let remainingFreeInvoices = 0;
  if (isGuest) {
    remainingFreeInvoices = Math.max(0, GUEST_FREE_INVOICE_LIMIT - guestInvoiceCount);
  } else {
    remainingFreeInvoices = Math.max(0, REGISTERED_FREE_INVOICE_LIMIT - registeredInvoiceCount);
  }

  // Determine if user has access
  const hasAccess = isSubscribed || hasPaidForInvoice || remainingFreeInvoices > 0;

  return {
    hasAccess,
    isGuest,
    isSubscribed,
    hasPaidForInvoice,
    remainingFreeInvoices,
    lastPaymentDate: lastPaymentDate || undefined,
  };
};

// Increment invoice count after successful download
export const incrementInvoiceCount = (isGuest: boolean = true): void => {
  if (typeof window === 'undefined') return;

  if (isGuest) {
    const currentCount = parseInt(localStorage.getItem('guestInvoiceCount') || '0');
    localStorage.setItem('guestInvoiceCount', (currentCount + 1).toString());
  } else {
    const currentCount = parseInt(localStorage.getItem('registeredInvoiceCount') || '0');
    localStorage.setItem('registeredInvoiceCount', (currentCount + 1).toString());
  }
};

// Mark current invoice as paid
export const markInvoiceAsPaid = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('hasPaidForCurrentInvoice', 'true');
  localStorage.setItem('lastPaymentDate', new Date().toISOString());
};

// Mark subscription as active
export const markSubscriptionActive = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('hasActiveSubscription', 'true');
  localStorage.setItem('lastPaymentDate', new Date().toISOString());
};

// Reset payment status (for testing)
export const resetPaymentStatus = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('guestInvoiceCount');
  localStorage.removeItem('registeredInvoiceCount');
  localStorage.removeItem('hasActiveSubscription');
  localStorage.removeItem('hasPaidForCurrentInvoice');
  localStorage.removeItem('lastPaymentDate');
};

// Get payment gate message
export const getPaymentGateMessage = (status: PaymentStatus): string => {
  if (status.hasAccess) {
    return '';
  }

  if (status.isGuest) {
    return `You've used your free invoice. Sign up for unlimited access or pay £1.50 per invoice.`;
  } else {
    return `You've used your free invoices. Upgrade to Pro for unlimited access or pay £1.50 per invoice.`;
  }
};

// Check if user can download PDF
export const canDownloadPDF = (user: any = null): { canDownload: boolean; message: string; requiresPayment: boolean } => {
  const status = checkPaymentStatus();
  
  // Override with actual user status if provided
  if (user) {
    status.isGuest = false;
  }

  if (status.hasAccess) {
    return {
      canDownload: true,
      message: '',
      requiresPayment: false,
    };
  }

  const message = getPaymentGateMessage(status);
  return {
    canDownload: false,
    message,
    requiresPayment: true,
  };
};
