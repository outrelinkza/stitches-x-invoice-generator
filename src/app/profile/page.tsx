'use client';

export default function Profile() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 px-10 py-4">
          <div className="flex items-center gap-3 text-gray-900">
            <div className="size-6">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-[-0.015em]">
              Stitches X
            </h2>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <a className="hover:text-gray-900" href="/dashboard">Dashboard</a>
            <a className="hover:text-gray-900" href="/invoices">Invoices</a>
            <a className="hover:text-gray-900" href="/templates">Templates</a>
            <a className="hover:text-gray-900" href="/settings">Settings</a>
            <a className="text-gray-900 font-semibold" href="/profile">Settings</a>
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
        <main className="flex-1 bg-gray-50/50">
          <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
              <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Profile Management
                </h1>
                <p className="mt-3 text-lg text-gray-600">
                  Manage your personal information, account settings, and
                  subscription details.
                </p>
              </div>
              
              <div className="space-y-12">
                {/* Personal Information Section */}
                <section>
                  <h2 className="text-xl font-semibold leading-7 text-gray-900 border-b border-gray-200 pb-4">
                    Personal Information
                  </h2>
                  <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="full-name">Full Name</label>
                      <div className="mt-2">
                        <input autoComplete="name" className="block w-full rounded-lg border-0 bg-white py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color)] sm:text-sm sm:leading-6" id="full-name" name="full-name" placeholder="John Doe" type="text"/>
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="email">Email Address</label>
                      <div className="mt-2">
                        <input autoComplete="email" className="block w-full rounded-lg border-0 bg-white py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color)] sm:text-sm sm:leading-6" id="email" name="email" placeholder="john.doe@example.com" type="email"/>
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="phone-number">Phone Number</label>
                      <div className="mt-2">
                        <input autoComplete="tel" className="block w-full rounded-lg border-0 bg-white py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color)] sm:text-sm sm:leading-6" id="phone-number" name="phone-number" placeholder="(123) 456-7890" type="text"/>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Account Settings Section */}
                <section>
                  <h2 className="text-xl font-semibold leading-7 text-gray-900 border-b border-gray-200 pb-4">
                    Account Settings
                  </h2>
                  <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="password">Password</label>
                      <div className="mt-2 relative">
                        <input className="block w-full rounded-lg border-0 bg-white py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color)] sm:text-sm sm:leading-6" id="password" name="password" type="password" defaultValue="••••••••••••"/>
                        <button className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                          <span className="material-symbols-outlined text-xl">visibility_off</span>
                        </button>
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="timezone">Time Zone</label>
                      <div className="mt-2">
                        <select className="block w-full rounded-lg border-0 bg-white py-2.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color)] sm:text-sm sm:leading-6" id="timezone" name="timezone">
                          <option>(UTC-08:00) Pacific Time</option>
                          <option>(UTC-07:00) Mountain Time</option>
                          <option>(UTC-06:00) Central Time</option>
                          <option>(UTC-05:00) Eastern Time</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Subscription Details Section */}
                <section>
                  <h2 className="text-xl font-semibold leading-7 text-gray-900 border-b border-gray-200 pb-4">Subscription Details</h2>
                  <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="plan">Plan</label>
                      <div className="mt-2">
                        <select className="block w-full rounded-lg border-0 bg-white py-2.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color)] sm:text-sm sm:leading-6" id="plan" name="plan">
                          <option>Free</option>
                          <option selected>Pro</option>
                          <option>Enterprise</option>
                        </select>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="billing-cycle">Billing Cycle</label>
                      <div className="mt-2">
                        <select className="block w-full rounded-lg border-0 bg-white py-2.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color)] sm:text-sm sm:leading-6" id="billing-cycle" name="billing-cycle">
                          <option>Monthly</option>
                          <option selected>Yearly</option>
                        </select>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="payment-method">Payment Method</label>
                      <div className="mt-2">
                        <select className="block w-full rounded-lg border-0 bg-white py-2.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color)] sm:text-sm sm:leading-6" id="payment-method" name="payment-method">
                          <option>Credit Card</option>
                          <option>PayPal</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a href="/subscription" className="text-[var(--primary-color)] hover:text-blue-600 text-sm font-medium">
                      Manage subscription settings →
                    </a>
                  </div>
                </section>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-12 flex items-center justify-end gap-x-6 border-t border-gray-200 pt-6">
                <button className="text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md" type="button">Cancel</button>
                <button className="rounded-md bg-[var(--primary-color)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-color)]" type="submit">Save Changes</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
