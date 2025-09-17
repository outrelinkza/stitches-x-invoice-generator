'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { TemplateState, Field, InvoiceItem } from '@/types/templateState';
import { InvoiceData } from '@/utils/pdfGenerator';

// Default template states
const getDefaultTemplateState = (templateId: string): TemplateState => {
  const baseState: TemplateState = {
    // Company Information
    companyName: 'Your Company Name',
    companyEmail: 'info@yourcompany.com',
    companyPhone: '+1 (555) 123-4567',
    companyAddress: '123 Business Street, City, State 12345',
    
    // Client Information
    clientName: 'Client Name',
    clientEmail: 'client@example.com',
    clientPhone: '+1 (555) 987-6543',
    clientAddress: '456 Client Ave, City, State 67890',
    
    // Invoice Details
    invoiceNumber: 'INV-001',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    
    // Visual elements
    logoVisible: true,
    logoUrl: '',
    thankYouNoteVisible: true,
    thankYouNote: 'Thank you for your business!',
    termsAndConditionsVisible: true,
    termsAndConditions: 'Payment is due within 30 days of invoice date.',
    signatureVisible: false,
    signatureUrl: '',
    watermarkVisible: false,
    watermarkText: '',
    
    // Custom fields
    customFields: [],
    
    // Invoice items
    items: [
      { id: 1, description: '', quantity: 1, rate: 0, amount: 0, visible: true }
    ],
    
    // Styling
    primaryColor: '#7C3AED',
    secondaryColor: '#8B5CF6',
    accentColor: '#A78BFA',
    backgroundColor: '#0f172a',
    textColor: '#1a1a2e',
    fontFamily: 'Inter',
    fontSize: '14px',
    fontWeight: '400',
    
    // Layout
    layout: 'standard',
    headerStyle: 'full-width',
    logoPosition: 'left',
    tableStyle: 'bordered',
    cornerRadius: 'medium',
    
    // Display options
    showPageNumbers: true,
    showInvoiceDate: true,
    showDueDate: true,
    showInvoiceNumber: true,
    showClientAddress: true,
    showCompanyAddress: true,
    showCompanyEmail: true,
    showCompanyPhone: true,
    billToLabel: 'Bill To:',
    showTaxBreakdown: true,
    showDiscounts: true,
    showPaymentInfo: true,
    showNotes: true,
    showPaymentInformation: false,
    termsAndConditionsLabel: 'Terms & Conditions:',
    showFooterLinks: true,
    showThankYouMessage: true,
    showFooterMessage: true,
    currencyLabel: 'Currency:',
    currency: 'USD',
    currencySymbol: '$',
    invoiceDateLabel: 'Invoice Date:',
    internationalPaymentLabel: 'International Payment:',
    bankDetailsLabel: 'Bank Details:',
    bankName: 'International Bank Ltd.',
    swiftCode: 'INTLUS33',
    ibanCode: 'US64SVBKUS6S3300958879',
    accountNumber: '1234567890',
    internationalTermsLabel: 'Terms & Conditions:',
    internationalTermsContent: '• Payment due within 30 days\n• All amounts in USD\n• VAT/GST included where applicable\n• International wire transfer preferred',
    internationalThankYouMessage: 'Thank you for your international business partnership.',
    internationalFooterMessage: 'This invoice represents international services rendered in accordance with global standards.\nFor questions about this invoice, please contact our international billing team.',
    internationalBillingEmail: 'billing@globalsolutions.com',
    internationalBillingPhone: '+1 (555) 123-GLOBAL',
    internationalWebsite: 'www.globalsolutions.com',
    showInternationalThankYouMessage: true,
    showInternationalFooterMessage: true,
    showInternationalContactInfo: true,
    showTax: true,
    showDiscount: false,
    showShipping: false,
    
    // Template-specific fields with defaults
    freelancerName: 'Your Name',
    showFreelancerName: true,
    
    // Common labels
    serviceDescriptionLabel: 'Service Description',
    hoursLabel: 'Hours',
    rateLabel: 'Rate',
    amountLabel: 'Amount',
    subtotalLabel: 'Subtotal',
    taxLabel: 'Tax',
    totalLabel: 'Total',
    clientInformationLabel: 'Client Information',
    billingPeriodLabel: 'Billing Period:',
    
    // Calculations
    subtotal: 0,
    taxRate: 10,
    taxAmount: 0,
    discountAmount: 0,
    shippingCost: 0,
    total: 0
  };

  // Template-specific customizations
  switch (templateId) {
    case 'standard':
      return {
        ...baseState,
        primaryColor: '#7C3AED',
        textColor: '#1a1a2e',
        // Standard-specific fields
        invoiceTitle: 'INVOICE',
        descriptionLabel: 'Description',
        quantityLabel: 'Qty',
        rateLabel: 'Rate',
        amountLabel: 'Amount',
        subtotalLabel: 'Subtotal:',
        taxLabel: 'Tax:',
        totalLabel: 'Total:',
        billToLabel: 'Bill To:',
        companyTagline: 'Professional Services & Solutions',
        thankYouMessage: 'Thank you for your business!',
        footerMessage: 'Questions? Contact us at info@company.com',
        // Standard visibility toggles
        showCompanyTagline: false,
        showThankYouMessage: true,
        showFooterMessage: false,
        showTax: true,
        // Payment Information
        paymentInformationLabel: 'Payment Information:',
        paymentMethod: 'Bank Transfer',
        accountDetails: 'Account: 1234567890, Routing: 987654321',
        paymentInstructions: 'Please include invoice number in payment reference',
        showPaymentInformation: false,
      };
    case 'minimalist-dark':
      return {
        ...baseState,
        primaryColor: '#ffffff',
        textColor: '#ffffff',
        backgroundColor: '#1a1a1a',
        accentColor: '#ffffff',
        // Minimalist Dark specific fields
        invoiceTitle: 'Invoice',
        descriptionLabel: 'Description',
        quantityLabel: 'Qty',
        rateLabel: 'Rate',
        amountLabel: 'Amount',
        subtotalLabel: 'Subtotal',
        taxLabel: 'Tax',
        totalLabel: 'Total',
        billToLabel: 'Bill To',
        thankYouMessage: 'Thank you for your business',
        paymentTermsMessage: 'Payment due within 30 days',
        showTax: true,
      };
        case 'elegant-luxury':
          return {
            ...baseState,
            primaryColor: '#d97706',
            textColor: '#000000',
            backgroundColor: '#ffffff',
            accentColor: '#f59e0b',
            // Elegant Luxury specific fields
            invoiceTitle: 'INVOICE',
            serviceLabel: 'Premium Service',
            durationLabel: 'Duration',
            investmentLabel: 'Investment',
            subtotalLabel: 'Subtotal',
            taxLabel: 'Tax',
            totalLabel: 'Total Investment',
            clientLabel: 'Distinguished Client',
            invoiceNumberLabel: 'Invoice Number',
            serviceDateLabel: 'Service Date',
            paymentDueLabel: 'Payment Due',
            thankYouMessage: 'Thank you for choosing our luxury services',
            footerMessage: 'We are honored to serve you and look forward to exceeding your expectations',
            serviceExcellenceTitle: 'Service Excellence',
            serviceExcellenceDescription: 'Our premium services are delivered with the highest standards of excellence. Each service is tailored to meet your unique requirements and exceed your expectations.',
            paymentTermsTitle: 'Payment Terms',
            paymentTermsDescription: 'Payment is due within 30 days of service completion. We accept all major credit cards, wire transfers, and other premium payment methods.',
            // Payment Information
            paymentInformationLabel: 'Payment Information',
            paymentMethod: 'Bank Transfer',
            accountDetails: 'Account: 1234567890, Routing: 987654321',
            paymentInstructions: 'Please include invoice number in payment reference',
            showPaymentInformation: false,
            showTax: true,
          };
        case 'business-professional':
          return {
            ...baseState,
            primaryColor: '#4f46e5',
            textColor: '#000000',
            backgroundColor: '#ffffff',
            accentColor: '#6366f1',
            // Business Professional specific fields
            invoiceTitle: 'CORPORATE INVOICE',
            serviceDescriptionLabel: 'Service Description',
            hoursLabel: 'Hours',
            rateLabel: 'Rate',
            amountLabel: 'Amount',
            subtotalLabel: 'Subtotal:',
            taxLabel: 'Tax',
            totalLabel: 'Total Amount Due:',
            clientLabel: 'Corporate Client:',
            invoiceNumberLabel: 'Invoice #:',
            servicePeriodLabel: 'Service Period:',
            dueDateLabel: 'Due Date:',
            accountManagerLabel: 'Account Manager:',
            accountManagerName: 'Sarah Johnson',
            thankYouMessage: 'Thank you for your continued business partnership.',
            footerMessage: 'This invoice represents professional corporate services rendered.\nFor questions about this invoice, please contact your account manager.',
            projectSummaryTitle: 'Project Summary:',
            projectSummaryDescription: 'Strategic business process optimization services delivered as per project scope. All deliverables completed within agreed timeline and budget parameters.\nNext phase: Implementation and monitoring',
            paymentTermsTitle: 'Corporate Payment Terms:',
            paymentTermsDescription: '• Net 30 days from invoice date\n• Corporate purchase order required\n• Wire transfer preferred for large amounts\n• Late payment: 1.5% monthly interest',
            // Payment Information
            paymentInformationLabel: 'Payment Information:',
            paymentMethod: 'Bank Transfer',
            accountDetails: 'Account: 1234567890, Routing: 987654321',
            paymentInstructions: 'Please include invoice number in payment reference',
            showPaymentInformation: false,
            showTax: true,
          };
         case 'creative-agency':
           return {
             ...baseState,
             primaryColor: '#db2777',
             textColor: '#000000',
             backgroundColor: '#ffffff',
             accentColor: '#ec4899',
             // Creative Agency specific fields
             invoiceTitle: 'CREATIVE INVOICE',
             creativeServiceLabel: 'Creative Service',
             hoursLabel: 'Hours',
             rateLabel: 'Rate',
             amountLabel: 'Amount',
             subtotalLabel: 'Subtotal:',
             taxLabel: 'Tax',
             totalLabel: 'Total Amount Due:',
             clientLabel: 'Client Information:',
             projectNumberLabel: 'Project #:',
             projectDateLabel: 'Project Date:',
             dueDateLabel: 'Due Date:',
             creativeDirectorLabel: 'Creative Director:',
             creativeDirectorName: 'Alex Creative',
             thankYouMessage: 'Thank you for choosing our creative services!',
             footerMessage: "We're excited to bring your vision to life.\nFor questions about this project, contact our creative team.",
             projectDeliverablesTitle: 'Project Deliverables:',
             projectDeliverablesDescription: '• Logo design in multiple formats\n• Brand guidelines document\n• Color palette and typography\n• All source files included',
             creativeProcessTitle: 'Creative Process:',
             creativeProcessDescription: '• Initial concept presentation\n• 2 rounds of revisions included\n• Final delivery within 2 weeks\n• Ongoing support available',
             // Payment Information
             paymentInformationLabel: 'Payment Information:',
             paymentMethod: 'Bank Transfer',
             accountDetails: 'Account: 1234567890, Routing: 987654321',
             paymentInstructions: 'Please include project number in payment reference',
             showPaymentInformation: false,
             showTax: true,
           };

         case 'modern-gradient':
           return {
             ...baseState,
             primaryColor: '#9333ea',
             textColor: '#000000',
             backgroundColor: '#ffffff',
             accentColor: '#ec4899',
             // Modern Gradient specific fields
             invoiceTitle: 'INVOICE',
             companyTagline: 'Trendy Design • Pastel Aesthetics • Modern Creativity',
             creativeServiceLabel: 'Creative Service',
             quantityLabel: 'Qty',
             rateLabel: 'Rate',
             amountLabel: 'Amount',
             subtotalLabel: 'Subtotal:',
             taxLabel: 'Tax',
             totalLabel: 'Total:',
             clientLabel: 'Client Information:',
             invoiceNumberLabel: 'Invoice #:',
             dateLabel: 'Date:',
             dueDateLabel: 'Due Date:',
             designFeaturesTitle: 'Design Features:',
             designFeaturesDescription: '• Modern gradient backgrounds\n• Pastel color schemes\n• Trendy typography\n• Instagram-worthy aesthetics',
             creativeTermsTitle: 'Creative Terms:',
             creativeTermsDescription: '• Payment due within 30 days\n• 3 rounds of revisions included\n• All modern file formats\n• Social media ready assets',
             thankYouMessage: '',
             footerMessage: '',
             websiteUrl: '',
             socialMediaHandle: '',
             // Payment Information
             paymentInformationLabel: 'Payment Information:',
             paymentMethod: 'Bank Transfer',
             accountDetails: 'Account: 1234567890, Routing: 987654321',
             paymentInstructions: 'Please include invoice number in payment reference',
             showPaymentInformation: false,
             showTax: true,
           };
         case 'retail':
           return {
             ...baseState,
             primaryColor: '#16a34a',
             textColor: '#000000',
             backgroundColor: '#ffffff',
             // Retail specific fields
             invoiceTitle: 'SALES INVOICE',
             companyTagline: 'Quality Products • Fast Shipping • Customer Satisfaction',
             productDescriptionLabel: 'Product Description',
             skuLabel: 'SKU',
             quantityLabel: 'Qty',
             unitPriceLabel: 'Unit Price',
             totalLabel: 'Total',
             subtotalLabel: 'Subtotal:',
             shippingLabel: 'Shipping:',
             taxLabel: 'Tax',
             totalAmountLabel: 'Total Amount:',
             customerInformationLabel: 'Customer Information:',
             orderNumberLabel: 'Order #:',
             orderDateLabel: 'Order Date:',
             paymentDueLabel: 'Payment Due:',
             salesRepLabel: 'Sales Rep:',
             salesRepName: 'Sarah Johnson',
             shippingInformationTitle: 'Shipping Information:',
             shippingInformationDescription: 'Standard shipping: 3-5 business days\nExpress shipping available\nFree shipping on orders over $100\nTracking number will be provided',
             returnPolicyTitle: 'Return Policy:',
             returnPolicyDescription: '• 30-day return policy\n• Items must be in original condition\n• Free return shipping\n• Refund processed within 5-7 days',
             thankYouMessage: 'Thank you for your purchase!',
             footerMessage: "We appreciate your business and look forward to serving you again.\nFor questions about this order, please contact our customer service team.",
             supportEmail: 'support@premiumretail.com',
             supportPhone: '(555) 123-SHOP',
             websiteUrl: 'www.premiumretail.com',
             // Retail optional display toggles
             showCompanyTagline: true,
             showSalesRep: true,
             showShippingInformation: true,
             showReturnPolicy: true,
             showContactInfo: true,
             // Payment Information
             paymentInformationLabel: 'Payment Information:',
             paymentMethod: 'Credit Card',
             accountDetails: 'Visa, MasterCard, American Express accepted',
             paymentInstructions: 'Payment due upon receipt',
             showPaymentInformation: false,
             showTax: true,
             showShipping: true,
             // Layout and Design
             layout: 'standard',
             logoPosition: 'right',
             tableStyle: 'striped',
             cornerRadius: 'medium',
           };
    case 'subscription-invoice':
      return {
        ...baseState,
        primaryColor: '#7c3aed',
        textColor: '#000000',
        backgroundColor: '#ffffff',
        // Subscription specific fields
        invoiceTitle: 'SUBSCRIPTION INVOICE',
        companyTagline: 'Monthly Subscription • Auto-Renewal • SaaS Platform',
        subscriptionId: 'SUB-2024-001',
        subscriptionIdLabel: 'Subscription ID:',
        billingCycleLabel: 'Billing Cycle',
        planFeaturesLabel: 'Plan Features',
        subscriptionDetailsLabel: 'Subscription Details:',
        subscriptionDetailsDescription: '• Billing cycle: Monthly<br />• Next billing date: ' + new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() + '<br />• Auto-renewal: Enabled<br />• <strong>Cancel anytime from your account</strong>',
        paymentInformationLabel: 'Payment Information:',
        paymentInformationDescription: '• Auto-pay enabled<br />• Payment method: Credit Card ending in 4242<br />• Payment due: 15 days from invoice date<br />• Late payment: Service may be suspended',
        manageSubscriptionText: '🔗 Manage Subscription',
        updatePaymentText: 'Update Payment',
        supportEmail: 'support@subscriptionservice.com',
        thankYouMessage: 'Thank you for your subscription!',
        footerMessage: 'This is a recurring invoice for your subscription services.<br />To manage your subscription or update payment methods, visit your account portal.',
        layout: 'standard',
        logoPosition: 'right',
        tableStyle: 'striped',
        cornerRadius: 'medium',
      };
    case 'international-invoice':
      return {
        ...baseState,
        primaryColor: '#2563eb',
        textColor: '#1a1a2e',
        backgroundColor: '#ffffff',
        invoiceTitle: 'INTERNATIONAL INVOICE',
        companyTagline: 'International Services • Multi-Currency • Global Operations',
        clientInformationLabel: 'International Client:',
        invoiceNumberLabel: 'Invoice #:',
        invoiceDateLabel: 'Invoice Date:',
        dueDateLabel: 'Due Date:',
        currencyLabel: 'Currency:',
        currency: 'USD',
        serviceDescriptionLabel: 'Service Description',
        quantityLabel: 'Qty',
        unitPriceLabel: 'Unit Price (USD)',
        amountLabel: 'Amount (USD)',
        internationalPaymentLabel: 'International Payment:',
        bankDetailsLabel: 'Bank Details:',
        bankName: 'International Bank Ltd.',
        swiftCode: 'INTLUS33',
        ibanCode: 'US64SVBKUS6S3300958879',
        accountNumber: '1234567890',
        internationalTermsLabel: 'Terms & Conditions:',
        internationalTermsContent: '• Payment due within 30 days\n• All amounts in USD\n• VAT/GST included where applicable\n• International wire transfer preferred',
        internationalThankYouMessage: 'Thank you for your international business partnership.',
        internationalFooterMessage: 'This invoice represents international services rendered in accordance with global standards.\nFor questions about this invoice, please contact our international billing team.',
        internationalBillingEmail: 'billing@globalsolutions.com',
        internationalBillingPhone: '+1 (555) 123-GLOBAL',
        internationalWebsite: 'www.globalsolutions.com',
        layout: 'standard',
        logoPosition: 'right',
        tableStyle: 'striped',
        cornerRadius: 'medium'
      };
    case 'recurring-clients':
      return {
        ...baseState,
        primaryColor: '#3b82f6',
        textColor: '#000000',
        backgroundColor: '#ffffff',
        // Recurring Clients specific fields
        invoiceTitle: 'RECURRING INVOICE',
        companyTagline: 'Recurring Services • Subscription Management',
        clientInformationLabel: 'Subscriber Information:',
        invoiceNumberLabel: 'Invoice #:',
        billingPeriodLabel: 'Billing Period:',
        dueDateLabel: 'Due Date:',
        subscriptionIdLabel: 'Subscription ID:',
        serviceDescriptionLabel: 'Service Description',
        billingCycleLabel: 'Billing Cycle',
        rateLabel: 'Rate',
        amountLabel: 'Amount',
        subscriptionDetailsLabel: 'Subscription Details:',
        subscriptionDetailsDescription: '• Billing cycle: Monthly<br />• Next billing date: ' + new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() + '<br />• Auto-renewal: Enabled<br />• <strong>Cancel anytime with 30 days notice</strong>',
        thankYouMessage: 'Thank you for your continued subscription!',
        footerMessage: 'This is a recurring invoice for your subscription services.<br />To manage your subscription or update payment methods, visit your account portal.',
        manageSubscriptionText: '🔗 Manage Subscription',
        updatePaymentText: 'Update Payment',
        supportEmail: 'support@serviceprovider.com',
        showSubscriptionDetails: true,
        showThankYouMessage: true,
        showFooterMessage: true,
        showFooterLinks: true,
        showCompanyTagline: true,
        showTax: true,
        showDiscount: false,
        showShipping: false,
        layout: 'standard',
        logoPosition: 'right',
        tableStyle: 'striped',
        cornerRadius: 'medium',
      };
    case 'freelancer-creative':
      return {
        ...baseState,
        primaryColor: '#0d9488',
        textColor: '#000000',
        backgroundColor: '#ffffff',
        // Freelancer Creative specific fields
        invoiceTitle: 'CREATIVE PROJECT INVOICE',
        companyTagline: 'Independent Creative • Portfolio: creativestudio.com • Available for Projects',
        creativeWorkLabel: 'Creative Work',
        hoursLabel: 'Hours',
        rateLabel: 'Rate',
        amountLabel: 'Amount',
        subtotalLabel: 'Subtotal:',
        taxLabel: 'Tax',
        totalAmountLabel: 'Total Amount Due:',
        clientInformationLabel: 'Client Information:',
        projectNumberLabel: 'Project #:',
        projectDateLabel: 'Project Date:',
        dueDateLabel: 'Due Date:',
        hourlyRateLabel: 'Hourly Rate:',
        defaultHourlyRate: '$75/hr',
        projectDeliverablesTitle: 'Project Deliverables:',
        projectDeliverablesDescription: '• Logo design in multiple formats\n• Business card design\n• Brand guidelines document\n• All source files included',
        freelancerTermsTitle: 'Freelancer Terms:',
        freelancerTermsDescription: '• Payment due within 15 days\n• 2 rounds of revisions included\n• PayPal, Venmo, or bank transfer\n• Portfolio: creativestudio.com',
        thankYouMessage: 'Thank you for choosing my creative services!',
        footerMessage: "I'm excited to bring your vision to life. For questions about this project, feel free to reach out anytime.",
        portfolioUrl: 'creativestudio.com',
        socialMediaHandle: '@creativefreelancer',
        freelancerName: 'Your Name',
        // Freelancer Creative optional display toggles
        showCompanyTagline: true,
        showProjectDeliverables: true,
        showFreelancerTerms: true,
        showContactInfo: true,
        showTax: true,
        // Payment Information
        paymentInformationLabel: 'Payment Information:',
        paymentMethod: 'PayPal, Venmo, or Bank Transfer',
        accountDetails: 'Multiple payment options available',
        paymentInstructions: 'Payment due within 15 days',
        showPaymentInformation: false,
        // Layout and Design
        layout: 'standard',
        logoPosition: 'right',
        tableStyle: 'striped',
        cornerRadius: 'medium',
      };
    case 'custom':
      return {
        ...baseState,
        primaryColor: '#8B5CF6',
        customFields: [
          { id: 'company-name', type: 'text', label: 'Company Name', value: baseState.companyName, section: 'company', required: true },
          { id: 'client-name', type: 'text', label: 'Client Name', value: baseState.clientName, section: 'client', required: true },
          { id: 'invoice-number', type: 'text', label: 'Invoice Number', value: baseState.invoiceNumber, section: 'header', required: true },
          { id: 'invoice-date', type: 'date', label: 'Invoice Date', value: baseState.invoiceDate, section: 'header', required: true },
        ],
      };
    case 'tech':
      return {
        ...baseState,
        primaryColor: '#9333ea',
        textColor: '#1a1a2e',
        companyName: 'TechSolutions Inc.',
        companyEmail: 'billing@techsolutions.com',
        companyPhone: '(555) 123-TECH',
        companyAddress: '123 Innovation Drive, Tech City, TC 12345',
        clientName: 'StartupXYZ',
        clientEmail: 'finance@startupxyz.com',
        clientPhone: '+1 (555) 987-6543',
        clientAddress: '456 Tech Boulevard, Innovation City, IC 67890',
        invoiceNumber: 'TECH-2024-001',
        // Tech-specific fields
        invoiceTitle: 'SOFTWARE SERVICES INVOICE',
        companyTagline: 'Software Development • Cloud Solutions • Digital Innovation',
        projectId: 'PRJ-APP-2024-001',
        clientInfoLabel: 'Client Information:',
        projectDeliverablesLabel: 'Project Deliverables:',
        paymentTermsLabel: 'Payment Terms:',
        projectDeliverables: '• Responsive web application\n• Database design and implementation\n• API development and integration\n• Cloud deployment and configuration\n• Source code and documentation provided',
        paymentTerms: '• Net 15 days from invoice date\n• Bank transfer preferred\n• Cryptocurrency accepted\n• Late payment: 2% monthly fee',
        thankYouMessage: 'Thank you for choosing our tech solutions.',
        footerMessage: 'This invoice covers professional software development services. For technical support or billing questions, contact our team.',
        githubUrl: 'GitHub: @techsolutions',
        developerEmail: 'dev@techsolutions.com',
        companyWebsite: 'www.techsolutions.com',
        developerName: 'Lead Developer Name',
        developerTitle: 'Full-Stack Engineer',
        // Tech-specific visibility toggles (all enabled by default)
        showCompanyTagline: true,
        showProjectId: true,
        showProjectDeliverables: true,
        showPaymentTerms: true,
        showThankYouMessage: true,
        showFooterMessage: true,
        showGitHubUrl: true,
        showDeveloperEmail: true,
        showCompanyWebsite: true,
        showDeveloperInfo: true,
        signatureVisible: true,
        items: [{ id: 1, description: 'Full-Stack Web Development', details: 'React.js • Node.js • MongoDB • AWS Deployment', quantity: 40, rate: 125, amount: 5000, visible: true }],
        subtotal: 5000,
        total: 5000,
      };
    case 'modern-tech':
      return {
        ...baseState,
        primaryColor: '#06B6D4',
        customFields: [
          { id: 'projectName', type: 'text', label: 'Project Name', value: '', section: 'header' },
          { id: 'clientName', type: 'text', label: 'Client Name', value: '', section: 'client' },
          { id: 'projectType', type: 'select', label: 'Project Type', value: '', section: 'header', options: [{ value: 'web-development', label: 'Web Development' }, { value: 'mobile-app', label: 'Mobile App Development' }] },
          { id: 'techLead', type: 'text', label: 'Tech Lead', value: '', section: 'header' },
          { id: 'projectStartDate', type: 'date', label: 'Project Start Date', value: '', section: 'header' },
          { id: 'projectEndDate', type: 'date', label: 'Project End Date', value: '', section: 'header' },
          { id: 'hourlyRate', type: 'number', label: 'Hourly Rate ($)', value: 175, section: 'header' },
          { id: 'projectPhase', type: 'select', label: 'Project Phase', value: '', section: 'header', options: [{ value: 'planning', label: 'Planning' }, { value: 'development', label: 'Development' }] },
          { id: 'technologyStack', type: 'text', label: 'Technology Stack', value: '', section: 'header' },
          { id: 'repositoryUrl', type: 'url', label: 'Repository URL', value: '', section: 'header' },
          { id: 'deploymentUrl', type: 'url', label: 'Deployment URL', value: '', section: 'header' },
          { id: 'projectDescription', type: 'textarea', label: 'Project Description', value: '', section: 'notes' },
        ],
        items: [{ id: 1, description: 'Frontend Development', quantity: 40, rate: 175, amount: 7000, visible: true }],
      };
    case 'product-invoice':
      return {
        ...baseState,
        primaryColor: '#10B981',
        customFields: [
          { id: 'customerName', type: 'text', label: 'Customer Name', value: '', section: 'client' },
          { id: 'customerEmail', type: 'email', label: 'Customer Email', value: '', section: 'client' },
          { id: 'orderNumber', type: 'text', label: 'Order Number', value: '', section: 'header' },
          { id: 'orderDate', type: 'date', label: 'Order Date', value: '', section: 'header' },
          { id: 'shippingAddress', type: 'textarea', label: 'Shipping Address', value: '', section: 'client' },
          { id: 'billingAddress', type: 'textarea', label: 'Billing Address', value: '', section: 'client' },
          { id: 'shippingMethod', type: 'select', label: 'Shipping Method', value: '', section: 'header', options: [{ value: 'standard', label: 'Standard' }, { value: 'expedited', label: 'Expedited' }] },
          { id: 'shippingCost', type: 'number', label: 'Shipping Cost ($)', value: 9.99, section: 'totals' },
          { id: 'discountCode', type: 'text', label: 'Discount Code', value: '', section: 'totals' },
        ],
        items: [{ id: 1, description: 'Product A', quantity: 2, rate: 29.99, amount: 59.98, visible: true }],
      };
    case 'healthcare':
      return {
        ...baseState,
        primaryColor: '#dc2626',
        secondaryColor: '#ef4444',
        accentColor: '#f87171',
        backgroundColor: '#ffffff',
        textColor: '#1a1a2e',
        companyName: 'MedCare Clinic',
        companyEmail: 'info@medcare.com',
        companyPhone: '(555) 123-HEAL',
        companyAddress: '123 Medical Plaza, Health City, HC 12345',
        clientName: 'John Doe',
        clientEmail: 'patient@example.com',
        clientPhone: '+1 (555) 987-6543',
        clientAddress: '456 Patient St, City, State 67890',
        invoiceNumber: 'MED-2024-001',
        // Healthcare-specific fields
        invoiceTitle: 'MEDICAL INVOICE',
        practiceTagline: 'Licensed Medical Practice • HIPAA Compliant',
        providerId: 'MD-12345',
        patientInfoLabel: 'Patient Information:',
        medicalServiceLabel: 'Medical Service',
        cptCodeLabel: 'CPT Code',
        quantityLabel: 'Qty',
        rateLabel: 'Rate',
        amountLabel: 'Amount',
        insuranceInfoLabel: 'Insurance Information:',
        insuranceInfo: 'Please submit this invoice to your insurance provider.\nPatient responsibility: $150.00\nPayment due within 30 days of service.',
        paymentMethodsLabel: 'Payment Methods:',
        paymentMethods: '• Cash or Check\n• Credit/Debit Card\n• HSA/FSA Cards\n• Online Payment Portal',
        thankYouMessage: 'Thank you for choosing our medical services.',
        hipaaComplianceText: 'This invoice is HIPAA compliant and contains protected health information.\nFor questions about this invoice, please contact our billing department.',
        providerSignatureLabel: 'Dr. [Provider Name], MD',
        // Healthcare visibility toggles
        showPracticeTagline: true,
        showProviderId: true,
        showInsuranceInfo: true,
        showPaymentMethods: true,
        showThankYouMessage: true,
        showHipaaCompliance: true,
        signatureVisible: true,
        customFields: [
          { id: 'patient-id', type: 'text', label: 'Patient ID', value: 'PAT-2024-001', section: 'header', required: true },
          { id: 'insurance-provider', type: 'text', label: 'Insurance Provider', value: '', section: 'client', required: true },
          { id: 'policy-number', type: 'text', label: 'Policy Number', value: '', section: 'client', required: true },
          { id: 'diagnosis-code', type: 'text', label: 'Diagnosis Code (ICD-10)', value: '', section: 'header', required: false },
        ],
        items: [{ id: 1, description: 'Medical Consultation', quantity: 1, rate: 150, amount: 150, visible: true }],
      };
    case 'consulting':
      return {
        ...baseState,
        primaryColor: '#2563eb',
        secondaryColor: '#3b82f6',
        accentColor: '#60a5fa',
        backgroundColor: '#ffffff',
        textColor: '#1a1a2e',
        companyName: 'Strategic Consulting Group',
        companyEmail: 'consulting@strategicgroup.com',
        companyPhone: '(555) 123-STRATEGY',
        companyAddress: '123 Business District, Corporate City, CC 12345',
        clientName: 'ABC Corporation',
        clientEmail: 'finance@abccorp.com',
        clientPhone: '+1 (555) 987-6543',
        clientAddress: '456 Corporate Blvd, Business City, BC 67890',
        invoiceNumber: 'CON-2024-001',
        // Consulting-specific fields
        invoiceTitle: 'PROFESSIONAL SERVICES INVOICE',
        consultingTagline: 'Professional Consulting Services • Strategic Advisory',
        projectCode: 'PRJ-2024-001',
        serviceDescriptionLabel: 'Service Description',
        hoursLabel: 'Hours',
        projectSummaryLabel: 'Project Summary:',
        projectSummary: 'Strategic planning and advisory services delivered as per project scope.\nAll deliverables completed within agreed timeline.\nNext milestone: Implementation phase',
        professionalFooterText: 'This invoice represents professional consulting services rendered.\nFor questions about this invoice, please contact our accounts team.',
        consultantSignatureLabel: '[Senior Consultant Name], MBA',
        // Consulting visibility toggles
        showConsultingTagline: true,
        showProjectCode: true,
        showProjectSummary: true,
        showProfessionalFooter: true,
        signatureVisible: true,
        customFields: [
          { id: 'project-type', type: 'select', label: 'Project Type', value: '', section: 'header', options: [{ value: 'strategic-planning', label: 'Strategic Planning' }, { value: 'business-advisory', label: 'Business Advisory' }] },
          { id: 'consultant-level', type: 'select', label: 'Consultant Level', value: '', section: 'header', options: [{ value: 'senior', label: 'Senior Consultant' }, { value: 'principal', label: 'Principal Consultant' }] },
          { id: 'project-phase', type: 'text', label: 'Project Phase', value: '', section: 'header' },
          { id: 'engagement-duration', type: 'text', label: 'Engagement Duration', value: '', section: 'header' },
        ],
        items: [{ id: 1, description: 'Strategic Planning Consultation', quantity: 8, rate: 200, amount: 1600, visible: true }],
      };
    case 'legal':
      return {
        ...baseState,
        primaryColor: '#475569',
        secondaryColor: '#64748b',
        accentColor: '#94a3b8',
        backgroundColor: '#ffffff',
        textColor: '#1a1a2e',
        companyName: 'Law & Associates',
        companyEmail: 'billing@lawassociates.com',
        companyPhone: '(555) 123-LEGAL',
        companyAddress: '123 Legal Plaza, Justice City, JC 12345',
        clientName: 'Client Name',
        clientEmail: 'client@example.com',
        clientPhone: '+1 (555) 987-6543',
        clientAddress: '456 Client Street, City, State 67890',
        invoiceNumber: 'LEG-2024-001',
        // Legal-specific fields
        invoiceTitle: 'LEGAL SERVICES INVOICE',
        legalTagline: 'Licensed Attorneys • Professional Legal Services • Confidential',
        matterNumber: 'MAT-2024-001',
        clientInfoLabel: 'Client Information:',
        legalServiceLabel: 'Legal Service',
        hoursLabel: 'Hours',
        rateLabel: 'Rate',
        amountLabel: 'Amount',
        legalNoticeLabel: 'Legal Notice:',
        legalNotice: 'This invoice represents professional legal services rendered. All communications are protected by attorney-client privilege. Payment is due within 30 days.',
        paymentTermsLabel: 'Payment Terms:',
        paymentTerms: '• Payment due within 30 days\n• Late payment: 1.5% monthly interest\n• Retainer required for new matters\n• Wire transfer preferred for large amounts',
        thankYouMessage: 'Thank you for your trust in our legal services.',
        legalFooterText: 'This invoice contains confidential information protected by attorney-client privilege.\nFor questions about this invoice, please contact our billing department.',
        attorneySignatureLabel: 'John Smith, Esq. • Bar #12345',
        // Legal visibility toggles
        showLegalTagline: true,
        showMatterNumber: true,
        showLegalNotice: true,
        showPaymentTerms: true,
        showThankYouMessage: true,
        showLegalFooter: true,
        signatureVisible: true,
        customFields: [
          { id: 'matter-type', type: 'select', label: 'Matter Type', value: '', section: 'header', options: [{ value: 'litigation', label: 'Litigation' }, { value: 'corporate', label: 'Corporate' }, { value: 'real-estate', label: 'Real Estate' }] },
          { id: 'attorney-name', type: 'text', label: 'Attorney Name', value: '', section: 'header' },
          { id: 'bar-number', type: 'text', label: 'Bar Number', value: '', section: 'header' },
          { id: 'court-jurisdiction', type: 'text', label: 'Court/Jurisdiction', value: '', section: 'header' },
        ],
        items: [{ id: 1, description: 'Legal Consultation', quantity: 3.5, rate: 250, amount: 875, visible: true }],
      };
    case 'restaurant':
      return {
        ...baseState,
        primaryColor: '#ea580c',
        secondaryColor: '#f97316',
        accentColor: '#fb923c',
        backgroundColor: '#ffffff',
        textColor: '#1a1a2e',
        companyName: 'Bella Vista Restaurant',
        companyEmail: 'catering@bellavista.com',
        companyPhone: '(555) 123-DINE',
        companyAddress: '123 Culinary Street, Food City, FC 12345',
        clientName: 'Corporate Event',
        clientEmail: 'events@company.com',
        clientPhone: '+1 (555) 987-6543',
        clientAddress: '456 Event Center, City, State 67890',
        invoiceNumber: 'CAT-2024-001',
        // Restaurant-specific fields
        invoiceTitle: 'CATERING INVOICE',
        restaurantTagline: 'Fine Dining • Catering Services • Private Events',
        guestCount: '50 Guests',
        eventInfoLabel: 'Event Information:',
        menuItemLabel: 'Menu Item',
        quantityLabel: 'Quantity',
        unitPriceLabel: 'Unit Price',
        totalLabel: 'Total',
        serviceChargeLabel: 'Service Charge',
        serviceChargeRate: 18,
        eventDetailsLabel: 'Event Details:',
        eventDetails: '• Event setup and breakdown included\n• Professional serving staff provided\n• Linens and tableware included\n• Gratuity included in service charge',
        paymentTermsLabel: 'Payment Terms:',
        paymentTerms: '• 50% deposit required to confirm\n• Final payment due 7 days before event\n• Cancellation policy: 48 hours notice\n• All major credit cards accepted',
        thankYouMessage: 'Thank you for choosing Bella Vista for your event!',
        restaurantFooterText: 'We look forward to creating a memorable dining experience for you and your guests.\nFor questions about this invoice, please contact our events team.',
        restaurantContactInfo: 'catering@bellavista.com • (555) 123-DINE • www.bellavista.com',
        // Restaurant visibility toggles
        showRestaurantTagline: true,
        showGuestCount: true,
        showServiceCharge: true,
        showEventDetails: true,
        showPaymentTerms: true,
        showThankYouMessage: true,
        showRestaurantFooter: true,
        customFields: [
          { id: 'event-type', type: 'select', label: 'Event Type', value: '', section: 'header', options: [{ value: 'corporate', label: 'Corporate Event' }, { value: 'wedding', label: 'Wedding' }, { value: 'birthday', label: 'Birthday Party' }] },
          { id: 'venue-location', type: 'text', label: 'Venue Location', value: '', section: 'header' },
          { id: 'event-time', type: 'text', label: 'Event Time', value: '', section: 'header' },
          { id: 'dietary-requirements', type: 'text', label: 'Dietary Requirements', value: '', section: 'client' },
        ],
        items: [{ id: 1, description: 'Gourmet Buffet Package', details: 'Includes: Appetizers, Main Course, Desserts, Beverages', quantity: 50, rate: 45, amount: 2250, visible: true }],
      };
    case 'receipt-paid':
      return {
        ...baseState,
        // Receipt-specific styling
        primaryColor: '#16a34a',
        secondaryColor: '#22c55e',
        accentColor: '#4ade80',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        
        // Receipt-specific content
        companyName: 'Your Business Name',
        companyEmail: 'receipts@yourbusiness.com',
        companyPhone: '(555) 123-BUSINESS',
        companyAddress: '123 Business Street, City, State 12345',
        companyWebsite: 'www.business.com',
        
        clientName: 'Customer Name',
        clientEmail: 'customer@example.com',
        clientPhone: '+1 (555) 987-6543',
        clientAddress: '456 Customer Avenue, City, State 67890',
        
        invoiceNumber: 'RCP-2024-001',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date().toISOString().split('T')[0],
        
        // Payment Information
        showPaymentInformation: true,
        paymentInformationLabel: 'Payment Information:',
        paymentMethod: 'Credit Card',
        accountDetails: 'Visa, MasterCard, American Express accepted',
        paymentInstructions: 'Payment due upon receipt',
        transactionId: 'TXN-123456789',
        
        // Terms & Conditions
        termsAndConditionsVisible: true,
        termsAndConditions: 'This receipt confirms payment has been received and processed. All transactions are subject to our standard terms and conditions.',
        
        // Receipt-specific elements
        showPaidBadge: true,
        paidBadgeText: 'PAID',
        showPaymentConfirmation: true,
        paymentConfirmationTitle: 'Payment Confirmed',
        paymentConfirmationMessage: 'Your payment has been successfully processed and received. This receipt serves as confirmation of your payment and can be used for your records.',
        showThankYouMessage: true,
        thankYouMessage: 'Thank you for your payment!',
        showReceiptFooter: true,
        receiptFooterMessage: 'This receipt confirms your payment has been received and processed.\nPlease keep this receipt for your records.',
        showContactInfo: true,
        
        // Receipt-specific items
        items: [{ id: 1, description: 'Service Provided', quantity: 1, rate: 100, amount: 100, visible: true }],
        subtotal: 100,
        taxRate: 0,
        taxAmount: 0,
        total: 100,
        
        // Layout settings
        layout: 'standard',
        cornerRadius: 'medium',
        tableStyle: 'bordered',
      };
    default:
      return baseState;
  }
};

// Derive InvoiceData from TemplateState
const deriveInvoiceDataFromTemplate = (templateState: TemplateState, selectedTemplate: string): InvoiceData => {
  // Handle null/undefined templateState
  if (!templateState) {
    const defaultState = getDefaultTemplateState(selectedTemplate);
    templateState = defaultState;
  }
  
  // Calculate totals
  const subtotal = (templateState.items || []).reduce((sum, item) => sum + (item.amount || 0), 0);
  const discountAmount = templateState.discountAmount || 0;
  const taxAmount = (subtotal - discountAmount) * ((templateState.taxRate || 0) / 100);
  const shippingCost = templateState.shippingCost || 0;
  const total = subtotal - discountAmount + taxAmount + shippingCost;

  return {
    // Company Info
    companyName: templateState.companyName,
    companyAddress: templateState.companyAddress,
    companyContact: templateState.companyEmail,
    logo: templateState.logoUrl,
    
    // Client Info
    clientName: templateState.clientName,
    clientAddress: templateState.clientAddress,
    clientContact: templateState.clientEmail,
    
    // Invoice Details
    invoiceNumber: templateState.invoiceNumber,
    date: templateState.invoiceDate,
    dueDate: templateState.dueDate,
    paymentTerms: 'Net 30',
    
    // Items
    items: (templateState.items || []).map(item => ({
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.amount
    })),
    
    // Totals
    subtotal,
    taxRate: templateState.taxRate,
    taxAmount,
    total,
    
    // Additional Info
    additionalNotes: templateState.thankYouNote,
    template: selectedTemplate,
    watermark: templateState.watermarkVisible ? templateState.watermarkText : undefined,
    
    // Custom Template Options
    customTemplate: selectedTemplate === 'custom' ? {
      name: 'My Custom Template',
      primaryColor: templateState.primaryColor,
      secondaryColor: templateState.secondaryColor,
      accentColor: templateState.accentColor,
      backgroundColor: templateState.backgroundColor,
      textColor: templateState.textColor,
      fontFamily: templateState.fontFamily,
      fontSize: templateState.fontSize,
      fontWeight: templateState.fontWeight,
      layout: templateState.layout,
      headerStyle: templateState.headerStyle,
      logoPosition: templateState.logoPosition,
      showLogo: templateState.logoVisible,
      showWatermark: templateState.watermarkVisible,
      showSignature: templateState.signatureVisible,
      showTerms: templateState.termsAndConditionsVisible,
      spacing: 'medium',
      borderStyle: 'solid',
      sectionOrder: ['header', 'company', 'client', 'items', 'totals', 'notes', 'footer'],
      headerHeight: 'medium',
      footerHeight: 'medium',
      showPageNumbers: templateState.showPageNumbers,
      showInvoiceDate: templateState.showInvoiceDate,
      showDueDate: templateState.showDueDate,
      showInvoiceNumber: templateState.showInvoiceNumber,
      showClientAddress: templateState.showClientAddress,
      showCompanyAddress: templateState.showCompanyAddress,
      showTaxBreakdown: templateState.showTaxBreakdown,
      showDiscounts: templateState.showDiscounts,
      showPaymentInfo: templateState.showPaymentInfo,
      showNotes: templateState.showNotes,
      showThankYouMessage: templateState.thankYouNoteVisible,
      tableStyle: templateState.tableStyle,
      headerBackground: templateState.primaryColor,
      footerBackground: templateState.secondaryColor,
      accentStyle: 'subtle',
      shadowStyle: 'none',
      cornerRadius: templateState.cornerRadius
    } : undefined
  };
};

export const useUnifiedInvoiceState = (initialTemplate: string = 'standard') => {
  // Initialize template states from localStorage or defaults
  const [templateStates, setTemplateStates] = useState<Record<string, TemplateState>>(() => {
    if (typeof window === 'undefined') {
      return {
        standard: getDefaultTemplateState('standard'),
        custom: getDefaultTemplateState('custom'),
        tech: getDefaultTemplateState('tech'),
        'modern-tech': getDefaultTemplateState('modern-tech'),
        'product-invoice': getDefaultTemplateState('product-invoice'),
        healthcare: getDefaultTemplateState('healthcare'),
        consulting: getDefaultTemplateState('consulting'),
        legal: getDefaultTemplateState('legal'),
        restaurant: getDefaultTemplateState('restaurant'),
        'creative-agency': getDefaultTemplateState('creative-agency'),
        'minimalist-dark': getDefaultTemplateState('minimalist-dark'),
        'elegant-luxury': getDefaultTemplateState('elegant-luxury'),
        'business-professional': getDefaultTemplateState('business-professional'),
        'freelancer-creative': getDefaultTemplateState('freelancer-creative'),
        'modern-gradient': getDefaultTemplateState('modern-gradient'),
        'international-invoice': getDefaultTemplateState('international-invoice'),
        'receipt-paid': getDefaultTemplateState('receipt-paid'),
        'subscription-invoice': getDefaultTemplateState('subscription-invoice'),
        'recurring-clients': getDefaultTemplateState('recurring-clients'),
      };
    }

    const stored = localStorage.getItem('unifiedInvoiceTemplates');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Ensure all templates have items array
        Object.keys(parsed).forEach(templateId => {
          if (!parsed[templateId].items) {
            parsed[templateId].items = [
              { id: 1, description: '', quantity: 1, rate: 0, amount: 0, visible: true }
            ];
          }
        });
        return parsed;
      } catch {
        // Fallback to defaults if parsing fails
      }
    }

    return {
      standard: getDefaultTemplateState('standard'),
      custom: getDefaultTemplateState('custom'),
      tech: getDefaultTemplateState('tech'),
      'modern-tech': getDefaultTemplateState('modern-tech'),
      'product-invoice': getDefaultTemplateState('product-invoice'),
      healthcare: getDefaultTemplateState('healthcare'),
      consulting: getDefaultTemplateState('consulting'),
      legal: getDefaultTemplateState('legal'),
      restaurant: getDefaultTemplateState('restaurant'),
      'creative-agency': getDefaultTemplateState('creative-agency'),
      'minimalist-dark': getDefaultTemplateState('minimalist-dark'),
      'elegant-luxury': getDefaultTemplateState('elegant-luxury'),
      'business-professional': getDefaultTemplateState('business-professional'),
      'freelancer-creative': getDefaultTemplateState('freelancer-creative'),
      'modern-gradient': getDefaultTemplateState('modern-gradient'),
      'international-invoice': getDefaultTemplateState('international-invoice'),
      'receipt-paid': getDefaultTemplateState('receipt-paid'),
      'subscription-invoice': getDefaultTemplateState('subscription-invoice'),
      'recurring-clients': getDefaultTemplateState('recurring-clients'),
    };
  });

  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);
  const [isFormValid, setIsFormValid] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync selectedTemplate with initialTemplate when it changes
  useEffect(() => {
    setSelectedTemplate(initialTemplate);
  }, [initialTemplate]);

  // Persist template states to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('unifiedInvoiceTemplates', JSON.stringify(templateStates));
    }
  }, [templateStates]);

  // Initialize template state if it doesn't exist
  useEffect(() => {
    if (!templateStates[selectedTemplate]) {
      const defaultState = getDefaultTemplateState(selectedTemplate);
      setTemplateStates(prev => ({
        ...prev,
        [selectedTemplate]: defaultState
      }));
    }
  }, [selectedTemplate, templateStates]);

  // Get current template state - only use the state from templateStates
  const currentTemplateState = templateStates[selectedTemplate] || getDefaultTemplateState(selectedTemplate);
  
  // Ensure items array exists
  if (currentTemplateState && !currentTemplateState.items) {
    currentTemplateState.items = [
      { id: 1, description: '', quantity: 1, rate: 0, amount: 0, visible: true }
    ];
  }

  // Derive current invoice data from template state
  const currentInvoiceData = useMemo(() => {
    if (!currentTemplateState) {
      const defaultState = getDefaultTemplateState(selectedTemplate);
      return deriveInvoiceDataFromTemplate(defaultState, selectedTemplate);
    }
    return deriveInvoiceDataFromTemplate(currentTemplateState, selectedTemplate);
  }, [currentTemplateState, selectedTemplate]);

  // Update form validity when data changes
  useEffect(() => {
    const isValid = !!(
      currentTemplateState.companyName?.trim() &&
      currentTemplateState.clientName?.trim() &&
      currentTemplateState.invoiceNumber?.trim()
    );
    setIsFormValid(isValid);
  }, [currentTemplateState]);

  // Template state management functions
  const updateTemplateState = useCallback((updates: Partial<TemplateState>) => {
    setTemplateStates(prev => ({
      ...prev,
      [selectedTemplate]: {
        ...prev[selectedTemplate],
        ...updates,
      }
    }));
    setHasUnsavedChanges(true);
  }, [selectedTemplate]);

  const switchTemplate = useCallback((templateId: string) => {
    setSelectedTemplate(templateId);
    setHasUnsavedChanges(false);
  }, []);

  // Element toggle functions
  const toggleElement = useCallback((element: keyof Pick<TemplateState, 'logoVisible' | 'thankYouNoteVisible' | 'termsAndConditionsVisible' | 'signatureVisible' | 'watermarkVisible'>) => {
    updateTemplateState({ [element]: !currentTemplateState[element] } as Partial<TemplateState>);
  }, [currentTemplateState, updateTemplateState]);

  // Custom field management
  const updateCustomField = useCallback((fieldId: string, updates: Partial<Field>) => {
    updateTemplateState({
      customFields: currentTemplateState.customFields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
    });
  }, [currentTemplateState, updateTemplateState]);

  const addCustomField = useCallback((field: Omit<Field, 'id'>) => {
    const newField: Field = { id: `custom-field-${Date.now()}`, ...field };
    updateTemplateState({ customFields: [...currentTemplateState.customFields, newField] });
  }, [currentTemplateState, updateTemplateState]);

  const removeCustomField = useCallback((fieldId: string) => {
    updateTemplateState({ customFields: currentTemplateState.customFields.filter(field => field.id !== fieldId) });
  }, [currentTemplateState, updateTemplateState]);

  // Invoice item management
  const updateInvoiceItem = useCallback((itemId: number, updates: Partial<InvoiceItem>) => {
    const updatedItems = (currentTemplateState.items || []).map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, ...updates };
        if (updates.quantity !== undefined || updates.rate !== undefined) {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    });

    // Calculate new totals
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    const discountAmount = currentTemplateState.discountAmount || 0;
    const taxAmount = (subtotal - discountAmount) * ((currentTemplateState.taxRate || 0) / 100);
    const shippingCost = currentTemplateState.shippingCost || 0;
    const total = subtotal - discountAmount + taxAmount + shippingCost;

    updateTemplateState({
      items: updatedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
    });
  }, [currentTemplateState, updateTemplateState]);

  const addInvoiceItem = useCallback(() => {
    const items = currentTemplateState.items || [];
    const newId = Math.max(...items.map(item => item.id), 0) + 1;
    const newItem: InvoiceItem = { id: newId, description: '', quantity: 1, rate: 0, amount: 0, visible: true };
    const updatedItems = [...items, newItem];
    
    // Calculate new totals
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    const discountAmount = currentTemplateState.discountAmount || 0;
    const taxAmount = (subtotal - discountAmount) * ((currentTemplateState.taxRate || 0) / 100);
    const shippingCost = currentTemplateState.shippingCost || 0;
    const total = subtotal - discountAmount + taxAmount + shippingCost;

    updateTemplateState({ 
      items: updatedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
    });
  }, [currentTemplateState, updateTemplateState]);

  const removeInvoiceItem = useCallback((itemId: number) => {
    const updatedItems = (currentTemplateState.items || []).filter(item => item.id !== itemId);
    
    // Calculate new totals
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    const discountAmount = currentTemplateState.discountAmount || 0;
    const taxAmount = (subtotal - discountAmount) * ((currentTemplateState.taxRate || 0) / 100);
    const shippingCost = currentTemplateState.shippingCost || 0;
    const total = subtotal - discountAmount + taxAmount + shippingCost;

    updateTemplateState({ 
      items: updatedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
    });
  }, [currentTemplateState, updateTemplateState]);

  // Calculate totals
  const calculateTotals = useCallback(() => {
    const subtotal = (currentTemplateState.items || []).reduce((sum, item) => sum + (item.amount || 0), 0);
    const discountAmount = currentTemplateState.discountAmount || 0;
    const taxAmount = (subtotal - discountAmount) * (currentTemplateState.taxRate / 100);
    const shippingCost = currentTemplateState.shippingCost || 0;
    const total = subtotal - discountAmount + taxAmount + shippingCost;
    return { subtotal, taxAmount, total };
  }, [currentTemplateState]);

  // Reset template to default
  const resetTemplate = useCallback((templateId?: string) => {
    const targetTemplate = templateId || selectedTemplate;
    setTemplateStates(prev => ({
      ...prev,
      [targetTemplate]: getDefaultTemplateState(targetTemplate)
    }));
    setHasUnsavedChanges(false);
  }, [selectedTemplate]);

  // Save changes
  const saveChanges = useCallback(() => {
    setHasUnsavedChanges(false);
    // Additional save logic can be added here (API calls, etc.)
  }, []);

  return {
    // State
    selectedTemplate,
    currentTemplateState,
    currentInvoiceData,
    templateStates,
    isFormValid,
    hasUnsavedChanges,
    
    // Actions
    switchTemplate,
    updateTemplateState,
    toggleElement,
    updateCustomField,
    addCustomField,
    removeCustomField,
    updateInvoiceItem,
    addInvoiceItem,
    removeInvoiceItem,
    calculateTotals,
    resetTemplate,
    saveChanges,
  };
};
