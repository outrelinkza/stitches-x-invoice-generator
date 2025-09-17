import React from 'react';
import { createOneTimePayment, createSubscription, PRICING_PLANS } from '@/utils/paymentService';
import { showLoading, showError } from '@/utils/notifications';

interface PaymentGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  isGuest: boolean;
  remainingFreeInvoices: number;
}

export const PaymentGateModal: React.FC<PaymentGateModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  isGuest,
  remainingFreeInvoices,
}) => {
  if (!isOpen) return null;

  const handlePerInvoicePayment = async () => {
    try {
      showLoading('Processing payment...');
      const success = await createOneTimePayment(PRICING_PLANS.basic.priceId, undefined, window.location.href);
      
      if (success) {
        onPaymentSuccess();
        onClose();
      } else {
        showError('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      showError('Payment processing failed. Please try again.');
    }
  };

  const handleSubscriptionPayment = async () => {
    try {
      showLoading('Setting up subscription...');
      const success = await createSubscription({
        priceId: PRICING_PLANS.pro.priceId,
        metadata: { plan: 'pro' },
      }, window.location.href);
      
      if (success) {
        onPaymentSuccess();
        onClose();
      } else {
        showError('Subscription setup failed. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      showError('Subscription setup failed. Please try again.');
    }
  };

  return (
    <>
      <style jsx>{`
        .payment-modal-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 10000 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background-color: rgba(0, 0, 0, 0.7) !important;
          padding: 16px !important;
        }
        
        .payment-modal-content {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 20px !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
          width: 100% !important;
          max-width: 500px !important;
          padding: 32px !important;
          position: relative !important;
          max-height: 90vh !important;
          overflow-y: auto !important;
          margin: auto !important;
        }
      `}</style>
      
      <div 
        className="payment-modal-overlay"
        onClick={(e) => { if (e.target === e.currentTarget) { onClose(); } }}
      >
        <div 
          className="payment-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 16px',
              boxShadow: '0 8px 32px rgba(124, 58, 237, 0.3)'
            }}>
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h2 style={{ 
              color: 'white', 
              fontSize: '24px', 
              fontWeight: 'bold', 
              margin: '0 0 8px 0' 
            }}>
              {remainingFreeInvoices > 0 ? 'Free Invoice Used' : 'Upgrade Required'}
            </h2>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '16px', 
              margin: '0',
              lineHeight: '1.5'
            }}>
              {isGuest 
                ? remainingFreeInvoices > 0 
                  ? `You've used your free invoice. Sign up for unlimited access or pay per invoice.`
                  : `You've used your free invoice. Continue with a paid plan.`
                : `You've used your free invoices. Upgrade for unlimited access.`
              }
            </p>
          </div>

          {/* Payment Options */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              color: 'white', 
              fontSize: '18px', 
              fontWeight: '600', 
              margin: '0 0 16px 0',
              textAlign: 'center'
            }}>
              Choose Your Plan
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Per Invoice Option */}
              <button
                onClick={handlePerInvoicePayment}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Pay Per Invoice</div>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>£1.50 per download</div>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>£1.50</div>
              </button>

              {/* Subscription Option */}
              <button
                onClick={handleSubscriptionPayment}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #6D28D9, #9333EA)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #7C3AED, #A78BFA)';
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Pro Monthly</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Unlimited invoices</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>£12</div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>/month</div>
                </div>
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '12px',
                  background: '#10B981',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  textTransform: 'uppercase'
                }}>
                  Popular
                </div>
              </button>
            </div>
          </div>

          {/* Features */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ 
              color: 'white', 
              fontSize: '16px', 
              fontWeight: '600', 
              margin: '0 0 12px 0' 
            }}>
              What you get:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Professional PDF invoices',
                '20+ premium templates',
                'Custom branding options',
                'Mobile-friendly design',
                'Email support'
              ].map((feature, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px'
                }}>
                  <svg width="16" height="16" fill="#10B981" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Close Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
