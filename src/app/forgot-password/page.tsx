'use client';

export default function ForgotPassword() {
  return (
    <div className="relative flex size-full min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom_1px_center" style={{maskImage: 'linear-gradient(to bottom, transparent, black, transparent)'}}></div>
      
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-gray-800">
            <svg className="h-8 w-8 text-[var(--primary-color)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
            <h1 className="text-3xl font-bold tracking-tight">StitchInvoice</h1>
          </div>
        </div>

        {/* Form Card */}
        <div className="relative w-full rounded-2xl border border-solid border-[var(--glass-border)] bg-[var(--glass-bg)] p-8 shadow-2xl shadow-gray-300/20 backdrop-blur-xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Forgot Your Password?</h2>
            <p className="mt-2 text-sm text-gray-600">
              No problem. Enter your email below and we'll send you a link to reset it.
            </p>
          </div>

          <form className="mt-8 space-y-6">
            <div>
              <label className="sr-only" htmlFor="email">Email address</label>
              <input 
                autoComplete="email" 
                className="relative block w-full appearance-none rounded-lg border border-gray-300 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:z-10 focus:border-[var(--primary-color)] focus:outline-none focus:ring-[var(--primary-color)] sm:text-sm" 
                id="email" 
                name="email" 
                placeholder="stitchesx.service@gmail.com" 
                required 
                type="email"
              />
            </div>
            <div>
              <button className="group relative flex w-full justify-center rounded-lg border border-transparent bg-[var(--primary-color)] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 transition-all duration-300 ease-in-out" type="submit">
                Send Reset Link
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <a className="text-sm font-medium text-gray-600 hover:text-[var(--primary-color)]" href="/auth">
              ← Back to Log In
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          © 2025 StitchInvoice. All rights reserved.
        </p>
      </div>
    </div>
  );
}
