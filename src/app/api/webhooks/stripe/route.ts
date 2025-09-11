import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);
  
  // Here you would typically:
  // 1. Update user's subscription status in your database
  // 2. Send confirmation email
  // 3. Grant access to premium features
  // 4. Log the successful payment
  
  const customerEmail = session.customer_email;
  const customerId = session.customer as string;
  const mode = session.mode;
  
  console.log(`Payment successful for customer: ${customerEmail} (${customerId})`);
  console.log(`Payment mode: ${mode}`);
  
  // Store payment success in localStorage for demo purposes
  if (typeof window !== 'undefined') {
    const paymentHistory = JSON.parse(localStorage.getItem('paymentHistory') || '[]');
    paymentHistory.push({
      sessionId: session.id,
      customerEmail,
      customerId,
      mode,
      amount: session.amount_total,
      currency: session.currency,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('paymentHistory', JSON.stringify(paymentHistory));
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);
  
  const customerId = subscription.customer as string;
  const status = subscription.status;
  
  console.log(`New subscription for customer: ${customerId}, status: ${status}`);
  
  // Update user's subscription status in your database
  // Grant access to premium features
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  
  const customerId = subscription.customer as string;
  const status = subscription.status;
  
  console.log(`Subscription updated for customer: ${customerId}, status: ${status}`);
  
  // Update user's subscription status in your database
  // Modify access to features based on new status
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  const customerId = subscription.customer as string;
  
  console.log(`Subscription cancelled for customer: ${customerId}`);
  
  // Update user's subscription status in your database
  // Revoke access to premium features
  // Send cancellation confirmation email
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Invoice payment succeeded:', invoice.id);
  
  const customerId = invoice.customer as string;
  const amount = invoice.amount_paid;
  
  console.log(`Payment succeeded for customer: ${customerId}, amount: ${amount}`);
  
  // Update payment status in your database
  // Send payment confirmation email
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id);
  
  const customerId = invoice.customer as string;
  
  console.log(`Payment failed for customer: ${customerId}`);
  
  // Update payment status in your database
  // Send payment failure notification
  // Handle failed payment (retry, suspend service, etc.)
}
