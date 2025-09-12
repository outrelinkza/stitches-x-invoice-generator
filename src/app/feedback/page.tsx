'use client';

import { useState } from 'react';
import NavHeader from '@/components/NavHeader';
import { showSuccess, showError } from '@/utils/notifications';

export default function Feedback() {
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send real feedback email
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          feedback: feedback.trim(),
          rating: rating > 0 ? rating : undefined,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Reset form
        setFeedback('');
        setName('');
        setEmail('');
        setRating(0);
        
        // Show success message
        showSuccess('Thank you for your feedback! We appreciate your input.');
      } else {
        // Show error message
        showError(result.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Feedback form error:', error);
      
      // Show error message
      showError('Network error. Please check your connection and try again.');
    }
    
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setFeedback('');
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      <NavHeader currentPage="/feedback" />
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-200 px-10 py-3 bg-white">
          <div className="flex items-center gap-4 text-gray-800">
            <div className="size-6 text-[var(--primary-color)]">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-gray-800 text-lg font-bold leading-tight tracking-[-0.015em]">Stitches X</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-gray-600 hover:text-gray-900 text-sm font-medium leading-normal" href="/dashboard">Dashboard</a>
            <a className="text-gray-600 hover:text-gray-900 text-sm font-medium leading-normal" href="/invoices">Invoices</a>
            <a className="text-gray-600 hover:text-gray-900 text-sm font-medium leading-normal" href="/templates">Templates</a>
            <a className="text-gray-600 hover:text-gray-900 text-sm font-medium leading-normal" href="/settings">Settings</a>
          </nav>
          <div className="flex flex-1 justify-end items-center gap-4">
            <button className="flex items-center justify-center rounded-full h-10 w-10 bg-gray-100 hover:bg-gray-200 text-gray-600">
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCbGpQRhjj4RmmRsEaaZlzOGg5h6kD-VI03LBCvVHKJSwLIibGKR_5sLNG_l5If1kOeyy93AQZyFdcYfwS43RV3ZqptXnkPp4TbU1l1P33xSx5uJXdhR7Z7-9-4KOzgs4cTEe2CTcVPyp1dXO_WcO-sfXRhF0RzXqJj3wPSh-sgGXq8tAQLhmJ34f4lBN24GiHjHtAw9umZXZ0PBuBlphyIHO7VGw79b0QskYqB9rwnl1F3mwtMpC74Os-29xXDWjPaHaZllR1HBZQ")'}}></div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-2xl mx-auto bg-white/30 backdrop-blur-xl border border-white/50 rounded-2xl shadow-lg p-8 space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Share Your Feedback</h1>
              <p className="mt-2 text-base text-gray-600">Your insights help us build a better experience for everyone.</p>
            </div>


            {/* Feedback Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Your Name</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/70 text-gray-900 placeholder-gray-500"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Your Email</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white/70 text-gray-900 placeholder-gray-500"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="stitchesx.service@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="rating">Rating (Optional)</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-colors ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="feedback">Your Feedback</label>
                <textarea
                  className="form-textarea w-full resize-none rounded-xl border-gray-300 bg-white/70 placeholder-gray-500 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition duration-150 ease-in-out p-4 text-base"
                  id="feedback"
                  name="feedback"
                  placeholder="Tell us what you love or what we can improve..."
                  rows={5}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row-reverse gap-4">
                <button
                  className="flex w-full sm:w-auto justify-center items-center rounded-lg h-12 px-8 bg-[var(--primary-color)] text-white text-base font-semibold shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isSubmitting || !feedback.trim()}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
                <button
                  className="flex w-full sm:w-auto justify-center items-center rounded-lg h-12 px-8 bg-gray-100 text-gray-700 text-base font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all"
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Contact Link */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Have questions?{' '}
                <a className="font-medium text-[var(--primary-color)] hover:underline" href="/contacts" rel="noopener noreferrer">
                  Contact us
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
