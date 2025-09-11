'use client';

export default function Auth() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-[var(--primary-color)]/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-[var(--primary-color)]/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 sm:px-10">
          <a className="flex items-center gap-2 text-[var(--foreground-color)]" href="/">
            <svg className="text-black" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              <path d="M3 7L12 12L21 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              <path d="M12 12V22" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
            <h1 className="text-xl font-bold tracking-tight">Stitches X</h1>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a className="text-[var(--secondary-foreground-color)] transition-colors hover:text-[var(--foreground-color)]" href="#">Product</a>
            <a className="text-[var(--secondary-foreground-color)] transition-colors hover:text-[var(--foreground-color)]" href="#">Pricing</a>
            <a className="text-[var(--secondary-foreground-color)] transition-colors hover:text-[var(--foreground-color)]" href="#">Resources</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-[var(--foreground-color)] transition-colors hover:bg-gray-100 sm:block">Log In</button>
            <button className="rounded-lg bg-[var(--primary-color)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105">Get Started</button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-white/60 p-8 shadow-2xl shadow-gray-500/10 backdrop-blur-xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground-color)]">Welcome</h2>
              <p className="mt-2 text-sm text-[var(--secondary-foreground-color)]">Enter your credentials to access your account.</p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="sr-only" htmlFor="email">Email or Username</label>
                  <input 
                    autoComplete="email" 
                    className="w-full rounded-lg border-[var(--border-color)] bg-white/80 px-4 py-3 text-sm text-[var(--foreground-color)] placeholder:text-[var(--secondary-foreground-color)] focus:border-[var(--primary-color)] focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)]" 
                    id="email" 
                    name="email" 
                    placeholder="Email or Username" 
                    required 
                    type="email"
                  />
                </div>
                <div>
                  <label className="sr-only" htmlFor="password">Password</label>
                  <input 
                    autoComplete="current-password" 
                    className="w-full rounded-lg border-[var(--border-color)] bg-white/80 px-4 py-3 text-sm text-[var(--foreground-color)] placeholder:text-[var(--secondary-foreground-color)] focus:border-[var(--primary-color)] focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)]" 
                    id="password" 
                    name="password" 
                    placeholder="Password" 
                    required 
                    type="password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <a className="text-xs font-medium text-[var(--secondary-foreground-color)] transition-colors hover:text-[var(--primary-color)]" href="/forgot-password">Forgot Password?</a>
              </div>

              <button className="w-full rounded-lg bg-[var(--primary-color)] py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-100" type="submit">
                Log In
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border-color)]"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white/60 px-2 text-[var(--secondary-foreground-color)]">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border-color)] bg-white/80 py-2.5 text-sm font-medium text-[var(--foreground-color)] shadow-sm transition-all hover:bg-gray-50 hover:shadow-md">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                    <path d="M1 1h22v22H1z" fill="none"></path>
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border-color)] bg-white/80 py-2.5 text-sm font-medium text-[var(--foreground-color)] shadow-sm transition-all hover:bg-gray-50 hover:shadow-md">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.22 6.53a4.77 4.77 0 00-3.8-2.12c-2.43.08-4.72 2.3-4.72 5.61 0 2.27 1.25 4.76 3.05 4.76 1.05 0 1.74-.53 2.58-.53.78 0 1.34.48 2.5.48 2.22 0 3.53-2.11 3.53-4.58 0-2.2-1.39-3.4-2.64-3.7zM13.2 2.1a6.76 6.76 0 014.51 2.23 6.54 6.54 0 012.18 5.11c0 4.13-2.92 6.44-5.26 6.44-1.2 0-2.08-.8-3.3-.8s-1.84.8-3.3.8c-2.62 0-5.74-2.7-5.74-7.55a7.87 7.87 0 013-6.28 7.33 7.33 0 015.41-2.45z"></path>
                  </svg>
                  Apple
                </button>
              </div>

              <p className="text-center text-xs text-[var(--secondary-foreground-color)]">
                Don't have an account?
                <a className="font-medium text-[var(--primary-color)] transition-colors hover:underline" href="#">Sign up</a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
