# Stripe Integration Setup

## 🚀 Quick Setup

### 1. Get Your Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account or log in
3. Go to **Developers** → **API Keys**
4. Copy your **Publishable key** and **Secret key**

### 2. Set Environment Variables
Create a `.env.local` file in your project root:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Next.js Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### 3. Test the Integration
1. Start your development server: `npm run dev`
2. Go to the main page and scroll down to the Pricing section
3. Click "Start Pro Trial" or "Contact Sales"
4. You'll be redirected to Stripe's secure checkout

## 💳 Pricing Plans

- **Free**: $0/month - 2 invoices, basic templates
- **Pro**: $10/month - Unlimited invoices, premium templates, smart auto-fill
- **Enterprise**: $29/month - Everything in Pro + team features, custom branding, API access

## 🔧 Features Included

✅ **Stripe Checkout Integration**
- Secure payment processing
- Subscription management
- Success/cancel handling
- Professional notifications

✅ **Pricing Section**
- Three-tier pricing structure
- Clear feature comparison
- Call-to-action buttons
- Responsive design

✅ **About Us Section**
- Company introduction
- Key features highlight
- Professional presentation

## 🎯 Next Steps

1. **Add your Stripe keys** to `.env.local`
2. **Test the checkout flow** with Stripe's test cards
3. **Customize pricing** in `/src/app/api/create-checkout-session/route.ts`
4. **Add webhook handling** for subscription events (optional)

## 🧪 Test Cards

Use these test card numbers in Stripe's test mode:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

## 📞 Support

If you need help with Stripe integration, check out:
- [Stripe Documentation](https://stripe.com/docs)
- [Next.js + Stripe Guide](https://stripe.com/docs/checkout/quickstart)
