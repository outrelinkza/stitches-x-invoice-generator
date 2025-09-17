'use client';

import { useState } from 'react';
import NavHeader from '@/components/NavHeader';
import FloatingCalculator from '@/components/FloatingCalculator';

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState('basic');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$15',
      period: '/month',
      description: 'Perfect for freelancers and small businesses',
      features: [
        '5 Premium Templates',
        'PDF Export',
        'Basic Customization',
        'Email Support'
      ],
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'Ideal for growing businesses',
      features: [
        'All Premium Templates',
        'Advanced Customization',
        'Brand Kit Integration',
        'Priority Support',
        'API Access'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$75',
      period: '/month',
      description: 'For large organizations',
      features: [
        'Everything in Professional',
        'White-label Solution',
        'Custom Templates',
        'Dedicated Support',
        'Advanced Analytics'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <NavHeader currentPage="/pricing" />
      
      <main className="w-full pt-24">
        <div className="max-w-6xl mx-auto p-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Unlock premium templates and advanced features to create professional invoices
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white/5 rounded-2xl border p-8 ${
                  plan.popular 
                    ? 'border-white/30 bg-white/10' 
                    : 'border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/70 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-white/70 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white/5 rounded-lg p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-2">Can I change plans anytime?</h3>
                <p className="text-white/70">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div className="bg-white/5 rounded-lg p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-2">Is there a free trial?</h3>
                <p className="text-white/70">Yes, all plans come with a 14-day free trial. No credit card required.</p>
              </div>
              <div className="bg-white/5 rounded-lg p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-2">What payment methods do you accept?</h3>
                <p className="text-white/70">We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <FloatingCalculator />
    </div>
  );
}
