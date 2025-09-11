'use client';

export default function ResetPassword() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      {/* Background Blur Effects */}
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
      
      <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-500 text-white rounded-full mb-4">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Set a new password</h1>
            <p className="text-slate-500 mt-2">Your new password must be different from previous used passwords.</p>
          </div>

          {/* Form Card */}
          <div className="glassmorphism p-8 rounded-2xl shadow-lg">
            <form className="space-y-6">
              <div>
                <label className="sr-only" htmlFor="new-password">New Password</label>
                <div className="relative">
                  <input 
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-0 focus:ring-2 focus:ring-primary-500/50 border border-slate-300/50 bg-white/80 h-12 placeholder:text-slate-400 p-3 text-base font-normal leading-normal transition-all duration-300" 
                    id="new-password" 
                    name="new-password" 
                    placeholder="New password" 
                    type="password"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">visibility_off</span>
                </div>
              </div>
              <div>
                <label className="sr-only" htmlFor="confirm-password">Confirm New Password</label>
                <div className="relative">
                  <input 
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 focus:outline-0 focus:ring-2 focus:ring-primary-500/50 border border-slate-300/50 bg-white/80 h-12 placeholder:text-slate-400 p-3 text-base font-normal leading-normal transition-all duration-300" 
                    id="confirm-password" 
                    name="confirm-password" 
                    placeholder="Confirm new password" 
                    type="password"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-wide shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-all duration-300" type="submit">
                  <span className="truncate">Set New Password</span>
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <a className="text-sm text-slate-500 hover:text-primary-500 transition-colors duration-300" href="/auth">
                <span className="material-symbols-outlined align-middle text-base">arrow_back</span>
                Back to log in
              </a>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-slate-400">
            <p>© 2025 Stitches X. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
