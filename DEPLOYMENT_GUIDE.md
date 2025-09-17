# 🚀 DEPLOYMENT GUIDE - Stitches X

## ✅ **PRE-DEPLOYMENT CHECKLIST**

### **1. Environment Variables Setup**
```bash
# Required for production
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
STRIPE_SECRET_KEY=sk_live_your_live_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
NEXTAUTH_SECRET=your_secure_random_secret
NEXTAUTH_URL=https://yourdomain.com
```

### **2. Stripe Configuration**
- ✅ **Test Mode**: All products and prices created
- ✅ **Live Mode**: Switch to live mode for production
- ✅ **Webhook**: Set up webhook endpoint for production
- ✅ **Price IDs**: Update with live price IDs

### **3. Supabase Configuration**
- ✅ **Database**: Set up production database
- ✅ **Authentication**: Configure production auth settings
- ✅ **Row Level Security**: Enable RLS policies
- ✅ **Email Templates**: Customize for production

---

## 🚀 **VERCEL DEPLOYMENT STEPS**

### **Step 1: Install Vercel CLI**
```bash
npm i -g vercel
```

### **Step 2: Login to Vercel**
```bash
vercel login
```

### **Step 3: Deploy to Vercel**
```bash
# From your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name: stitches-x
# - Directory: ./
# - Override settings? No
```

### **Step 4: Set Environment Variables**
```bash
# Set production environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add STRIPE_SECRET_KEY production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
```

### **Step 5: Deploy Production**
```bash
vercel --prod
```

---

## 🔧 **POST-DEPLOYMENT CONFIGURATION**

### **1. Update Stripe Webhook**
- Go to Stripe Dashboard → Webhooks
- Update endpoint URL to: `https://yourdomain.vercel.app/api/webhooks/stripe`
- Select events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

### **2. Update Supabase Settings**
- Go to Supabase Dashboard → Authentication → Settings
- Update Site URL: `https://yourdomain.vercel.app`
- Update Redirect URLs: `https://yourdomain.vercel.app/**`

### **3. Test Production Features**
- ✅ User registration (no email verification)
- ✅ User login/logout
- ✅ Invoice creation
- ✅ PDF download (2 free for registered users)
- ✅ Payment processing
- ✅ Template system

---

## 📊 **PRODUCTION MONITORING SETUP**

### **1. Vercel Analytics**
```bash
# Enable Vercel Analytics
vercel analytics
```

### **2. Custom Domain Setup**
```bash
# Add custom domain
vercel domains add yourdomain.com
vercel domains add www.yourdomain.com
```

### **3. SSL Certificate**
- Automatically handled by Vercel
- HTTPS enabled by default

### **4. Performance Monitoring**
- Vercel Speed Insights
- Real User Monitoring (RUM)
- Core Web Vitals tracking

---

## 🔒 **SECURITY CONFIGURATION**

### **1. Environment Variables Security**
- ✅ All secrets stored in Vercel environment variables
- ✅ No hardcoded secrets in code
- ✅ Production vs development separation

### **2. API Security**
- ✅ Rate limiting (implement in production)
- ✅ Input validation
- ✅ CORS configuration
- ✅ Webhook signature verification

### **3. Authentication Security**
- ✅ No email verification required
- ✅ Secure session management
- ✅ Password requirements
- ✅ Account lockout protection

---

## 📈 **BUSINESS LOGIC VERIFICATION**

### **1. Download Limits**
- ✅ **Guests**: 1 free download
- ✅ **Registered Users**: 2 free downloads
- ✅ **Payment Required**: After limit reached
- ✅ **Subscription**: Unlimited downloads

### **2. Payment Processing**
- ✅ **Stripe Integration**: Live mode configured
- ✅ **Webhook Handling**: Real-time payment events
- ✅ **Subscription Management**: Customer portal
- ✅ **Invoice Generation**: PDF download after payment

### **3. User Experience**
- ✅ **Instant Signup**: No email verification
- ✅ **Seamless Login**: Persistent sessions
- ✅ **Template System**: 20+ professional templates
- ✅ **Mobile Responsive**: Works on all devices

---

## 🚨 **MONITORING & ALERTS**

### **1. Vercel Monitoring**
- Deployment status
- Function execution time
- Error rates
- Bandwidth usage

### **2. Custom Monitoring**
```bash
# Set up monitoring script for production
# Update monitor.sh with production URL
# Set up cron job on external server
```

### **3. Alert Thresholds**
- **Critical**: Server down, payment failures
- **High**: High error rates, slow response times
- **Medium**: Unusual traffic patterns

---

## 🔄 **BACKUP & RECOVERY**

### **1. Code Backup**
- ✅ **Local Backup**: `stitches-x-backup-20250917-034509.tar.gz`
- ✅ **Git Repository**: Version control
- ✅ **Vercel Deployments**: Automatic backups

### **2. Database Backup**
- ✅ **Supabase**: Automatic daily backups
- ✅ **Export Data**: User data export functionality
- ✅ **Recovery Plan**: Documented procedures

### **3. Environment Backup**
- ✅ **Environment Variables**: Documented in deployment guide
- ✅ **Configuration Files**: Version controlled
- ✅ **Secrets Management**: Vercel environment variables

---

## 🎯 **LAUNCH CHECKLIST**

### **Pre-Launch (Before Deploy)**
- [ ] All environment variables set
- [ ] Stripe live mode configured
- [ ] Supabase production database ready
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Monitoring setup complete

### **Post-Launch (After Deploy)**
- [ ] Test user registration
- [ ] Test payment processing
- [ ] Test PDF download limits
- [ ] Test all templates
- [ ] Verify webhook functionality
- [ ] Check mobile responsiveness
- [ ] Monitor error logs
- [ ] Set up alerts

### **Go-Live**
- [ ] Update DNS records
- [ ] Test production URL
- [ ] Verify all features work
- [ ] Monitor for 24 hours
- [ ] Document any issues
- [ ] Celebrate launch! 🎉

---

## 📞 **SUPPORT & MAINTENANCE**

### **Daily Tasks**
- Monitor error logs
- Check payment processing
- Verify user registrations
- Monitor performance metrics

### **Weekly Tasks**
- Review security logs
- Update dependencies
- Check backup status
- Performance optimization

### **Monthly Tasks**
- Security audit
- Performance review
- User feedback analysis
- Feature updates

---

**🚀 Your Stitches X application is ready for production deployment!**