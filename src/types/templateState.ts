export interface Field {
  id: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'number' | 'url' | 'textarea' | 'select';
  label: string;
  value: string | number;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  section: 'header' | 'company' | 'client' | 'items' | 'totals' | 'notes' | 'footer';
  visible?: boolean;
}

export interface InvoiceItem {
  id: number;
  description: string;
  details?: string;
  sku?: string;
  quantity: number;
  rate: number;
  amount: number;
  visible?: boolean;
}

export interface TemplateState {
  // Company Information
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyWebsite?: string;
  
  // Client Information
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  
  // Invoice Details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  
  // Visual elements
  logoVisible: boolean;
  logoUrl?: string;
  thankYouNoteVisible: boolean;
  thankYouNote: string;
  termsAndConditionsVisible: boolean;
  termsAndConditions: string;
  signatureVisible: boolean;
  signatureUrl?: string;
  signaturePosition?: 'left' | 'center' | 'right';
  watermarkVisible: boolean;
  watermarkText?: string;
  watermarkPosition?: 'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right';
  
  // Custom fields
  customFields: Field[];
  
  // Invoice items
  items: InvoiceItem[];
  
  // Styling
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  
  // Accent Line
  showAccentLine?: boolean;
  accentLineColor?: string;
  accentLineWidth?: 'thin' | 'medium' | 'thick';
  textColor: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  
  // Layout
  layout: 'standard' | 'minimal' | 'detailed' | 'modern';
  headerStyle: 'full-width' | 'centered' | 'minimal';
  logoPosition: 'left' | 'center' | 'right';
  tableStyle: 'bordered' | 'striped' | 'minimal' | 'modern';
  cornerRadius: 'none' | 'small' | 'medium' | 'large';
  
  // Display options
  showPageNumbers: boolean;
  showInvoiceDate: boolean;
  showDueDate: boolean;
  showInvoiceNumber: boolean;
  showClientAddress: boolean;
  showCompanyAddress: boolean;
  showCompanyEmail: boolean;
  showCompanyPhone: boolean;
  showTaxBreakdown: boolean;
  showDiscounts: boolean;
  showPaymentInfo: boolean;
  showNotes: boolean;
  showTax: boolean;
  showDiscount: boolean;
  showShipping: boolean;
  
  // Calculations
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  discountLabel?: string;
  shippingCost: number;
  total: number;
  
  // Advanced calculations
  additionalTaxRate?: number;
  serviceFeeRate?: number;
  fixedFee?: number;
  
  // Payment Information
  paymentInfo?: string;
  bankDetails?: string;
  paypalEmail?: string;
  notes?: string;
  
  // Healthcare-specific fields
  practiceTagline?: string;
  providerId?: string;
  patientInfoLabel?: string;
  medicalServiceLabel?: string;
  cptCodeLabel?: string;
  insuranceInfoLabel?: string;
  insuranceInfo?: string;
  paymentMethodsLabel?: string;
  paymentMethods?: string;
  
  // Payment Information fields
  paymentInformationLabel?: string;
  paymentMethod?: string;
  accountDetails?: string;
  paymentInstructions?: string;
  showPaymentInformation?: boolean;
  transactionId?: string;
  
  // Receipt-specific fields
  showPaidBadge?: boolean;
  paidBadgeText?: string;
  showPaymentConfirmation?: boolean;
  paymentConfirmationTitle?: string;
  paymentConfirmationMessage?: string;
  showThankYouMessage?: boolean;
  thankYouMessage?: string;
  showReceiptFooter?: boolean;
  receiptFooterMessage?: string;
  showContactInfo?: boolean;
  
  // Terms & Conditions fields
  termsAndConditionsLabel?: string;
  
  // Minimalist Dark specific fields
  paymentTermsMessage?: string;
  hipaaComplianceText?: string;
  providerSignatureLabel?: string;
  
  // Healthcare visibility toggles
  showPracticeTagline?: boolean;
  showProviderId?: boolean;
  showInsuranceInfo?: boolean;
  showPaymentMethods?: boolean;
  showHipaaCompliance?: boolean;
  
  // Consulting-specific fields
  consultingTagline?: string;
  projectCode?: string;
  projectSummaryLabel?: string;
  projectSummary?: string;
  professionalFooterText?: string;
  consultantSignatureLabel?: string;
  
  // Consulting visibility toggles
  showConsultingTagline?: boolean;
  showProjectCode?: boolean;
  showProjectSummary?: boolean;
  showProfessionalFooter?: boolean;
  
  // Legal-specific fields
  legalTagline?: string;
  matterNumber?: string;
  legalServiceLabel?: string;
  legalNoticeLabel?: string;
  legalNotice?: string;
  legalFooterText?: string;
  attorneySignatureLabel?: string;
  
  // Legal visibility toggles
  showLegalTagline?: boolean;
  showMatterNumber?: boolean;
  showLegalNotice?: boolean;
  showLegalFooter?: boolean;
  
  // Restaurant-specific fields
  restaurantTagline?: string;
  guestCount?: string;
  eventInfoLabel?: string;
  menuItemLabel?: string;
  serviceChargeLabel?: string;
  serviceChargeRate?: number;
  eventDetailsLabel?: string;
  eventDetails?: string;
  restaurantFooterText?: string;
  restaurantContactInfo?: string;
  
  // Restaurant visibility toggles
  showRestaurantTagline?: boolean;
  showGuestCount?: boolean;
  showServiceCharge?: boolean;
  showEventDetails?: boolean;
  showRestaurantFooter?: boolean;

  // Standard template fields
  invoiceTitle?: string;
  descriptionLabel?: string;
  quantityLabel?: string;
  rateLabel?: string;
  amountLabel?: string;
  subtotalLabel?: string;
  taxLabel?: string;
  totalLabel?: string;
  billToLabel?: string;
  companyTagline?: string;
  footerMessage?: string;
  paymentTerms?: string;
  
  // Standard visibility toggles
  
  // International specific fields
  currencyLabel?: string;
  currency?: string;
  currencySymbol?: string;
  invoiceDateLabel?: string;
  paymentInformation?: string;
  internationalPaymentLabel?: string;
  bankDetailsLabel?: string;
  bankName?: string;
  swiftCode?: string;
  ibanCode?: string;
  accountNumber?: string;
  internationalTermsLabel?: string;
  internationalTermsContent?: string;
  internationalThankYouMessage?: string;
  internationalFooterMessage?: string;
  internationalBillingEmail?: string;
  internationalBillingPhone?: string;
  internationalWebsite?: string;
  showInternationalThankYouMessage?: boolean;
  showInternationalFooterMessage?: boolean;
  showInternationalContactInfo?: boolean;
  
  // Recurring Clients-specific fields
  subscriptionIdLabel?: string;
  billingCycleLabel?: string;
  subscriptionDetailsLabel?: string;
  subscriptionDetailsDescription?: string;
  manageSubscriptionText?: string;
  updatePaymentText?: string;
  supportEmail?: string;
  showSubscriptionDetails?: boolean;
  showFooterMessage?: boolean;
  showFooterLinks?: boolean;
  
  // Tech-specific fields
  projectId?: string;
  projectDeliverables?: string;
  githubUrl?: string;
  developerEmail?: string;
  developerName?: string;
  developerTitle?: string;
  clientInfoLabel?: string;
  projectDeliverablesLabel?: string;
  paymentTermsLabel?: string;
  
  // Tech-specific visibility toggles
  showProjectId?: boolean;
  showPaymentTerms?: boolean;
  showGitHubUrl?: boolean;
  showDeveloperEmail?: boolean;
  showCompanyWebsite?: boolean;
  showDeveloperInfo?: boolean;

  // Elegant Luxury specific fields
  serviceLabel?: string;
  durationLabel?: string;
  investmentLabel?: string;
  clientLabel?: string;
  invoiceNumberLabel?: string;
  serviceDateLabel?: string;
  serviceExcellenceTitle?: string;
  serviceExcellenceDescription?: string;
  paymentTermsTitle?: string;
  paymentTermsDescription?: string;

  // Business Professional specific fields
  servicePeriodLabel?: string;
  accountManagerLabel?: string;
  accountManagerName?: string;
  showAccountManager?: boolean;
  projectSummaryTitle?: string;
  projectSummaryDescription?: string;

  // Creative Agency specific fields
  creativeServiceLabel?: string;
  creativeDirectorLabel?: string;
  creativeDirectorName?: string;
  creativeProcessTitle?: string;
  creativeProcessDescription?: string;

  // Modern Gradient specific fields
  dateLabel?: string;
  designFeaturesTitle?: string;
  designFeaturesDescription?: string;
  creativeTermsTitle?: string;
  creativeTermsDescription?: string;
  websiteUrl?: string;
  socialMediaHandle?: string;

  // Retail specific fields
  productDescriptionLabel?: string;
  skuLabel?: string;
  unitPriceLabel?: string;
  totalAmountLabel?: string;
  customerInformationLabel?: string;
  orderNumberLabel?: string;
  orderDateLabel?: string;
  paymentDueLabel?: string;
  salesRepLabel?: string;
  salesRepName?: string;
  shippingLabel?: string;
  shippingInformationTitle?: string;
  shippingInformationDescription?: string;
  returnPolicyTitle?: string;
  returnPolicyDescription?: string;
  supportPhone?: string;
  
  // Retail optional display toggles
  showCompanyTagline?: boolean;
  showSalesRep?: boolean;
  showShippingInformation?: boolean;
  showReturnPolicy?: boolean;
  
  // Retail-specific fields
  orderNumber?: string;
  salesRep?: string;
  
  // Layout and Design fields (layout is already defined above)
  
  // Subscription specific fields
  subscriptionId?: string;
  planFeaturesLabel?: string;
  paymentInformationDescription?: string;

  // Freelancer Creative specific fields
  creativeWorkLabel?: string;
  projectNumberLabel?: string;
  projectDateLabel?: string;
  dueDateLabel?: string;
  hourlyRateLabel?: string;
  defaultHourlyRate?: string;
  projectDeliverablesTitle?: string;
  projectDeliverablesDescription?: string;
  freelancerTermsTitle?: string;
  freelancerTermsDescription?: string;
  portfolioUrl?: string;
  freelancerName?: string;
  clientInformationLabel?: string;
  hoursLabel?: string;
  serviceDescriptionLabel?: string;
  billingPeriodLabel?: string;
  
  // Freelancer Creative optional display toggles
  showProjectDeliverables?: boolean;
  showFreelancerTerms?: boolean;
  showFreelancerName?: boolean;
  
}

export interface TemplatesState {
  [templateId: string]: TemplateState;
}
