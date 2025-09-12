'use client';

export default function Notifications() {
  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap px-1 sm:px-2 lg:px-3 py-4 sticky top-0 z-10">
          <a href="/" className="flex items-center gap-4 text-white hover:opacity-80 transition-opacity">
            <svg className="h-8 w-8 text-black" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
            <h2 className="text-xl font-bold tracking-tight text-white">Stitches X</h2>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
            <a className="hover:text-[var(--text-primary)] transition-colors" href="/dashboard">Dashboard</a>
            <a className="hover:text-[var(--text-primary)] transition-colors" href="/invoices">Invoices</a>
            <a className="hover:text-[var(--text-primary)] transition-colors" href="/templates">Templates</a>
            <a className="hover:text-[var(--text-primary)] transition-colors" href="/settings">Settings</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-100 text-[var(--text-secondary)] hover:bg-gray-200 transition-colors">
              <span className="material-symbols-outlined text-2xl">notifications</span>
            </button>
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-100 text-[var(--text-secondary)] hover:bg-gray-200 transition-colors">
              <span className="material-symbols-outlined text-2xl">help</span>
            </button>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAYAjCAQZKwG-4K3qOlxW_OaX43vHf4viEO6X4jPr-cM1zyKUFXotTBqJRheXu28LIXYxPt6lIyIOSDBsiTwIivko6CmipImWiBZtAknoHTzPrz5FJitZy2erpwsh5gnv9ej8E--Adym0QgYaLX2Os8vgWhD-Yf_FQeac38Rp09FzB5KS7TAywFkJ2sw_KUB1Y8sxwDgKCFQ2GXTZeosmA78dp4-wN-R2aVc_mTZ_G6ltPiq1US8nI5_B4qrXoyWIK2_x2aMlMVAPo")'}}></div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-3xl">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">Notifications</h1>
              <p className="mt-2 text-[var(--text-secondary)]">Manage your invoice-related alerts and updates.</p>
            </div>

            {/* Notifications List */}
            <div className="glass-effect shadow-lg rounded-xl overflow-hidden">
              <div className="divide-y divide-[var(--border-color)]">
                {/* Overdue Invoice - Unread */}
                <div className="flex items-start gap-4 p-5 hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-center rounded-full bg-red-100 shrink-0 size-10 text-red-600 mt-1">
                    <span className="material-symbols-outlined text-xl">error</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[var(--text-primary)] font-semibold">Invoice #12345 Overdue</p>
                    <p className="text-[var(--text-secondary)] text-sm">This invoice is now 5 days overdue. Please follow up with the client.</p>
                    <p className="text-xs text-gray-400 mt-2">2 hours ago</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[var(--primary-color)] self-center"></div>
                </div>

                {/* Payment Received - Read */}
                <div className="flex items-start gap-4 p-5 hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-center rounded-full bg-green-100 shrink-0 size-10 text-green-600 mt-1">
                    <span className="material-symbols-outlined text-xl">check_circle</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[var(--text-primary)] font-semibold">Payment Received</p>
                    <p className="text-[var(--text-secondary)] text-sm">Payment of $500 received for Invoice #67890 from Acme Inc.</p>
                    <p className="text-xs text-gray-400 mt-2">1 day ago</p>
                  </div>
                </div>

                {/* Invoice Sent - Read */}
                <div className="flex items-start gap-4 p-5 hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-center rounded-full bg-blue-100 shrink-0 size-10 text-blue-600 mt-1">
                    <span className="material-symbols-outlined text-xl">send</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[var(--text-primary)] font-semibold">Invoice Sent</p>
                    <p className="text-[var(--text-secondary)] text-sm">Invoice #101112 has been successfully sent to the client.</p>
                    <p className="text-xs text-gray-400 mt-2">3 days ago</p>
                  </div>
                </div>

                {/* Overdue Invoice - Unread */}
                <div className="flex items-start gap-4 p-5 hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-center rounded-full bg-red-100 shrink-0 size-10 text-red-600 mt-1">
                    <span className="material-symbols-outlined text-xl">error</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[var(--text-primary)] font-semibold">Invoice #131415 Overdue</p>
                    <p className="text-[var(--text-secondary)] text-sm">This invoice is now 2 days overdue.</p>
                    <p className="text-xs text-gray-400 mt-2">5 days ago</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[var(--primary-color)] self-center"></div>
                </div>

                {/* Payment Received - Read */}
                <div className="flex items-start gap-4 p-5 hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-center rounded-full bg-green-100 shrink-0 size-10 text-green-600 mt-1">
                    <span className="material-symbols-outlined text-xl">check_circle</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[var(--text-primary)] font-semibold">Payment Received</p>
                    <p className="text-[var(--text-secondary)] text-sm">Payment of $750 received for Invoice #161718.</p>
                    <p className="text-xs text-gray-400 mt-2">1 week ago</p>
                  </div>
                </div>

                {/* Invoice Sent - Read */}
                <div className="flex items-start gap-4 p-5 hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-center rounded-full bg-blue-100 shrink-0 size-10 text-blue-600 mt-1">
                    <span className="material-symbols-outlined text-xl">send</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[var(--text-primary)] font-semibold">Invoice Sent</p>
                    <p className="text-[var(--text-secondary)] text-sm">Invoice #192021 has been sent to the client.</p>
                    <p className="text-xs text-gray-400 mt-2">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
