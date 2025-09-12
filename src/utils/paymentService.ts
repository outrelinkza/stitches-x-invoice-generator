import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export interface PaymentData {
  priceId: string;
  mode: 'payment' | 'subscription';
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

export interface SubscriptionData {
  priceId: string;
  customerEmail?: string;
  trialPeriodDays?: number;
  metadata?: Record<string, string>;
}

export const createCheckoutSession = async (paymentData: PaymentData): Promise<string | null> => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const session = await response.json();

    if (session.error) {
      console.error('Checkout session error:', session.error);
      return null;
    }

    return session.sessionId;
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    return null;
  }
};

export const redirectToCheckout = async (sessionId: string): Promise<boolean> => {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      console.error('Stripe failed to load');
      return false;
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      console.error('Stripe checkout error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to redirect to checkout:', error);
    return false;
  }
};

export const processPayment = async (paymentData: PaymentData): Promise<boolean> => {
  try {
    const sessionId = await createCheckoutSession(paymentData);
    if (!sessionId) {
      return false;
    }

    return await redirectToCheckout(sessionId);
  } catch (error) {
    console.error('Payment processing failed:', error);
    return false;
  }
};

export const createSubscription = async (subscriptionData: SubscriptionData): Promise<boolean> => {
  try {
    const paymentData: PaymentData = {
      priceId: subscriptionData.priceId,
      mode: 'subscription',
      successUrl: `${window.location.origin}/?subscription=success`,
      cancelUrl: `${window.location.origin}/?subscription=cancelled`,
      customerEmail: subscriptionData.customerEmail,
      metadata: subscriptionData.metadata,
    };

    return await processPayment(paymentData);
  } catch (error) {
    console.error('Subscription creation failed:', error);
    return false;
  }
};

export const createOneTimePayment = async (priceId: string, customerEmail?: string): Promise<boolean> => {
  try {
    const paymentData: PaymentData = {
      priceId,
      mode: 'payment',
      successUrl: `${window.location.origin}/?payment=success`,
      cancelUrl: `${window.location.origin}/?payment=cancelled`,
      customerEmail,
    };

    return await processPayment(paymentData);
  } catch (error) {
    console.error('One-time payment failed:', error);
    return false;
  }
};

export const getStripeCustomerPortal = async (customerId: string): Promise<string | null> => {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId }),
    });

    const session = await response.json();

    if (session.error) {
      console.error('Portal session error:', session.error);
      return null;
    }

    return session.url;
  } catch (error) {
    console.error('Failed to create portal session:', error);
    return null;
  }
};

export const redirectToCustomerPortal = async (customerId: string): Promise<boolean> => {
  try {
    const portalUrl = await getStripeCustomerPortal(customerId);
    if (!portalUrl) {
      return false;
    }

    window.location.href = portalUrl;
    return true;
  } catch (error) {
    console.error('Failed to redirect to customer portal:', error);
    return false;
  }
};

// Pricing configuration using your actual Stripe Price IDs
export const PRICING_PLANS = {
  basic: {
    name: 'Basic Per Invoice',
    price: 1.50,
    currency: 'gbp',
    interval: 'one-time',
    priceId: process.env.STRIPE_BASIC_PER_INVOICE_PRICE_ID || 'price_1S5zEjL3DcLmHFw9IffjgNLA',
    features: [
      'Basic invoice templates',
      'PDF generation',
      'Email support',
      'Perfect for small businesses',
    ],
  },
  premium: {
    name: 'Premium Per Invoice',
    price: 3.50,
    currency: 'gbp',
    interval: 'one-time',
    priceId: process.env.STRIPE_PREMIUM_PER_INVOICE_PRICE_ID || 'price_1S5zEjL3DcLmHFw94kuW31Bs',
    features: [
      'Premium templates',
      'Advanced features',
      'Priority support',
      'Custom branding',
    ],
  },
  enterprise: {
    name: 'Enterprise Per Invoice',
    price: 7.50,
    currency: 'gbp',
    interval: 'one-time',
    priceId: process.env.STRIPE_ENTERPRISE_PER_INVOICE_PRICE_ID || 'price_1S5zEkL3DcLmHFw9ZcS6Fik2',
    features: [
      'All premium features',
      'Dedicated support',
      'API access',
      'Custom integrations',
    ],
  },
  pro: {
    name: 'Pro Subscription',
    price: 29.99,
    currency: 'gbp',
    interval: 'month',
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_1S5zElL3DcLmHFw9ponmDFdT',
    features: [
      'Unlimited invoices',
      'All premium templates',
      'Advanced analytics',
      'Priority support',
      'Custom branding',
      'API access',
    ],
  },
  enterpriseSub: {
    name: 'Enterprise Subscription',
    price: 99.99,
    currency: 'gbp',
    interval: 'month',
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_1S5zEmL3DcLmHFw9YzB7CbKu',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom integrations',
      'White-label options',
      'Team management',
    ],
  },
};

export const getPlanByPriceId = (priceId: string) => {
  return Object.values(PRICING_PLANS).find(plan => plan.priceId === priceId);
};

export const formatPrice = (price: number, currency: string = 'gbp') => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(price);
};
