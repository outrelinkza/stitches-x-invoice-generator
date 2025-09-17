# StitchInvoice - Professional Invoice Generator

A modern, professional invoice generation platform built with Next.js, featuring 20+ industry-specific templates, real-time preview, and seamless payment integration.

## 🚀 Live Demo

**Production URL:** https://stitches-x-invoice-generatorx-hget9jb62-outrelinkxx.vercel.app

## ✨ Features

### 🎨 Professional Templates
- **20+ Industry-Specific Templates** - Business Professional, Legal Services, Creative Agency, Restaurant, Healthcare, and more
- **Custom Builder** - Create completely custom invoice designs
- **Real-time Preview** - See changes instantly as you edit
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

### 💼 Complete Invoice Management
- **Save & Load** - Save invoices as drafts, load them later
- **Status Tracking** - Track invoice status (Draft → Sent → Paid)
- **Search & Filter** - Find invoices by name, client, or status
- **Dashboard Analytics** - Real business insights and revenue tracking

### 💳 Payment Integration
- **Stripe Integration** - Secure payment processing
- **PDF Generation** - High-quality PDF downloads
- **Payment Gating** - 1 free download for guests, 2 for registered users
- **Subscription Plans** - Monthly and pay-per-invoice options

### 🔐 User Management
- **Guest Mode** - Create invoices without signing up
- **User Accounts** - Save invoices across devices
- **Authentication** - Secure sign-in/sign-up with Supabase
- **Data Sync** - All data synced to cloud database

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React, TypeScript
- **Styling:** Tailwind CSS, Styled JSX
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Payments:** Stripe
- **Deployment:** Vercel
- **Icons:** Material Symbols

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/outrelinkza/stitches-x-invoice-generator.git
   cd stitches-x-invoice-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # User dashboard
│   ├── invoices/          # Invoice management
│   ├── templates/         # Template pages
│   └── api/              # API routes
├── components/            # React components
│   ├── templates/        # Invoice template components
│   ├── AuthModal.tsx     # Authentication modal
│   └── NavHeader.tsx     # Navigation header
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── contexts/             # React contexts
```

## 🎯 Key Features Explained

### Logical Invoice Workflow
1. **Create Invoice** → Fill out company, client, and invoice details
2. **Save Invoice** → Saves as 'draft' in database (no payment required)
3. **Download PDF** → Pay £1.50 to download high-quality PDF
4. **Send to Client** → Invoice status becomes 'sent'
5. **Track Payment** → Manually mark as 'paid' when client pays
6. **Dashboard Updates** → Shows real business revenue and analytics

### Template System
- **Standard Templates** - Pre-designed for specific industries
- **Custom Builder** - Drag-and-drop interface for custom designs
- **Live Preview** - Real-time preview with all settings
- **Save/Load** - Save custom templates for reuse

### Payment System
- **Guest Users** - 1 free PDF download
- **Registered Users** - 2 free PDF downloads
- **Payment Gating** - Stripe integration for additional downloads
- **Subscription Plans** - Monthly unlimited access

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Set up the database schema (invoices table)
3. Configure Row Level Security (RLS)
4. Add your Supabase URL and keys to environment variables

### Stripe Setup
1. Create a Stripe account
2. Set up products and prices
3. Configure webhooks
4. Add your Stripe keys to environment variables

## 📊 Database Schema

### Invoices Table
```sql
CREATE TABLE invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  invoice_number TEXT NOT NULL,
  company_name TEXT,
  company_address TEXT,
  company_contact TEXT,
  client_name TEXT,
  client_address TEXT,
  client_contact TEXT,
  date DATE,
  due_date DATE,
  payment_terms TEXT,
  items JSONB,
  subtotal DECIMAL,
  tax_rate DECIMAL,
  tax_amount DECIMAL,
  total DECIMAL,
  additional_notes TEXT,
  template TEXT,
  status TEXT DEFAULT 'draft',
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Deployment

### Vercel Deployment
1. **Connect to Vercel**
   ```bash
   vercel --prod
   ```

2. **Set Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Configure Supabase and Stripe keys

3. **Deploy**
   - Automatic deployments on git push
   - Preview deployments for pull requests

### Manual Deployment
```bash
npm run build
npm start
```

## 🔒 Security

- **Row Level Security** - Database access controlled by user
- **Environment Variables** - Sensitive data stored securely
- **Input Validation** - All user inputs validated
- **CORS Configuration** - Proper cross-origin settings
- **Authentication** - Secure user authentication with Supabase

## 📈 Monitoring

- **Health Checks** - Automated monitoring scripts
- **Error Tracking** - Comprehensive error logging
- **Performance Monitoring** - Vercel analytics
- **Security Monitoring** - Automated security checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation** - Check the `/docs` folder
- **Issues** - Report bugs via GitHub Issues
- **Discussions** - Join GitHub Discussions for questions

## 🎉 Acknowledgments

- Built with ❤️ using Next.js and React
- Powered by Supabase and Stripe
- Deployed on Vercel
- Icons by Material Symbols

---

**StitchInvoice** - Create professional invoices in seconds! 🚀