'use client';

import NavHeader from '@/components/NavHeader';

export default function Subscription() {
  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      <NavHeader currentPage="/subscription" />
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 px-10 py-3">
          <div className="flex items-center gap-4 text-gray-800">
            <div className="size-6">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em]">Stitches X</h2>
          </div>
          <div className="flex items-center gap-4">
            <a className="text-gray-600 hover:text-gray-900 text-sm font-medium leading-normal" href="/dashboard">Dashboard</a>
            <a className="text-gray-600 hover:text-gray-900 text-sm font-medium leading-normal" href="/invoices">Invoices</a>
            <a className="text-gray-600 hover:text-gray-900 text-sm font-medium leading-normal" href="/templates">Templates</a>
            <a className="text-gray-600 hover:text-gray-900 text-sm font-medium leading-normal" href="/settings">Settings</a>
            <a className="text-gray-900 text-sm font-semibold leading-normal" href="/profile">Settings</a>
          </div>
          <div className="flex flex-1 justify-end gap-4">
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-gray-100 hover:bg-gray-200 text-gray-700">
              <span className="material-symbols-outlined text-xl">help</span>
            </button>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDp-Mi812tctyeSjHYi8qrswNLo_QP0h-eacu5z1Vc6IZPBOzUpfFWhEJo66N_kqUgefI4tz-8cXUFQWvBOeHySmvAWxmbMqZCel_EvgR0_Q1XA6XBDkfgfxDnu5aw-uNGoXOSwZh7tgN9cyyidNoYk3GXaz1mG1Zk01ZswTiS-nEBg4fwm9FdXJVcx0iuaXc--2ZxUzE1shPTqubwD5wr7-zZx2QN3KMvlj8m-bbbaTAHx6ABL-G0uwBoJaTeS2O6mKeuZL-vycQE")'}}></div>
          </div>
        </header>

        {/* Main Content */}
        <div className="px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8">
          <div className="layout-content-container flex flex-col max-w-5xl flex-1 gap-8">
            {/* Page Header */}
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h1 className="text-gray-900 text-4xl font-bold leading-tight tracking-tighter">Subscription</h1>
              <div className="flex items-center gap-2">
                <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium">Cancel Subscription</button>
                <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium">Change Plan</button>
              </div>
            </div>

            {/* Current Plan */}
            <div className="bg-glass border border-gray-200/50 rounded-2xl p-8">
              <h2 className="text-gray-900 text-2xl font-bold leading-tight tracking-tight mb-6">Current Plan</h2>
              <div className="flex items-start justify-between gap-8">
                <div className="flex flex-col gap-2">
                  <p className="text-gray-500 text-sm font-normal leading-normal">Your plan</p>
                  <p className="text-gray-900 text-lg font-semibold leading-tight">Pro Plan</p>
                  <p className="text-gray-500 text-sm font-normal leading-normal">Billed annually on May 1, 2025</p>
                  <a className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2" href="/invoices">View invoice history</a>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-gray-900 text-4xl font-bold tracking-tighter">$120</p>
                    <p className="text-gray-500 text-sm">per year</p>
                  </div>
                  <div className="w-32 h-20 bg-center bg-no-repeat bg-contain rounded-lg" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAjKFXiOKaclc-JT9TL2ccyRhcA6nl_PrPu_a1D0TuhQ6RBjtnxKalAv6FyeFqd2qcyt4MfFuIv6SFWJqiVgPnT9T3Gq5xDX19xuIvx-3pthrvftsm696i4Mu31N4iWomuIt7Ul-PjkTWoKpqVVV0Wqv4lNfGj8O8RrE9ShJP2XTgEOGTc83DQiAUWUFBuZYg5rTRIAzlQZ8UxUqyq65F-hcq4Bkr_-JoeEqHBCXa5ZWZxdKveFNDyZncmdfE_-omPxuGeT3Iu8hq8")'}}></div>
                </div>
              </div>
            </div>

            {/* Upgrade or Downgrade */}
            <div className="space-y-6">
              <h2 className="text-gray-900 text-2xl font-bold leading-tight tracking-tight">Upgrade or Downgrade</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Free Plan */}
                <div className="flex flex-col gap-6 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex-grow space-y-4">
                    <h3 className="text-gray-900 text-lg font-semibold leading-tight">Free</h3>
                    <p className="flex items-baseline gap-1 text-gray-900">
                      <span className="text-gray-900 text-4xl font-bold leading-tight tracking-tighter">$0</span>
                      <span className="text-gray-500 text-sm font-medium">/month</span>
                    </p>
                    <div className="space-y-2">
                      <div className="flex gap-3 text-sm text-gray-700 items-center">
                        <span className="material-symbols-outlined text-primary-600 text-xl">check_circle</span>
                        Unlimited invoices
                      </div>
                      <div className="flex gap-3 text-sm text-gray-700 items-center">
                        <span className="material-symbols-outlined text-primary-600 text-xl">check_circle</span>
                        Basic reporting
                      </div>
                      <div className="flex gap-3 text-sm text-gray-700 items-center">
                        <span className="material-symbols-outlined text-primary-600 text-xl">check_circle</span>
                        1 user
                      </div>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium">Select Plan</button>
                </div>

                {/* Pro Plan - Current */}
                <div className="flex flex-col gap-6 rounded-2xl border border-primary-500 bg-primary-50 p-6 shadow-lg">
                  <div className="flex-grow space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-primary-800 text-lg font-semibold leading-tight">Pro</h3>
                      <p className="text-primary-700 text-xs font-semibold leading-normal tracking-wide rounded-full bg-primary-200 px-3 py-1">Recommended</p>
                    </div>
                    <p className="flex items-baseline gap-1 text-gray-900">
                      <span className="text-gray-900 text-4xl font-bold leading-tight tracking-tighter">$10</span>
                      <span className="text-gray-500 text-sm font-medium">/month</span>
                    </p>
                    <div className="space-y-2">
                      <div className="flex gap-3 text-sm text-gray-700 items-center">
                        <span className="material-symbols-outlined text-primary-600 text-xl">check_circle</span>
                        Unlimited invoices
                      </div>
                      <div className="flex gap-3 text-sm text-gray-700 items-center">
                        <span className="material-symbols-outlined text-primary-600 text-xl">check_circle</span>
                        Advanced reporting
                      </div>
                      <div className="flex gap-3 text-sm text-gray-700 items-center">
                        <span className="material-symbols-outlined text-primary-600 text-xl">check_circle</span>
                        5 users
                      </div>
                      <div className="flex gap-3 text-sm text-gray-700 items-center">
                        <span className="material-symbols-outlined text-primary-600 text-xl">check_circle</span>
                        Priority support
                      </div>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium">Current Plan</button>
                </div>

                {/* Premium Plan */}
                <div className="flex flex-col gap-6 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex-grow space-y-4">
                    <h3 className="text-gray-900 text-lg font-semibold leading-tight">Premium</h3>
                    <p className="flex items-baseline gap-1 text-gray-900">
                      <span className="text-gray-900 text-4xl font-bold leading-tight tracking-tighter">$25</span>
                      <span className="text-gray-500 text-sm font-medium">/month</span>
                    </p>
                    <div className="space-y-2">
                      <div className="flex gap-3 text-sm text-gray-700 items-center">
                        <span className="material-symbols-outlined text-primary-600 text-xl">check_circle</span>
                        Unlimited invoices
                      </div>
                      <div className="flex gap-3 text-sm text-gray-700 items-center">
                        <span className="material-symbols-outlined text-primary-600 text-xl">check_circle</span>
                        Advanced reporting
                      </div>
                      <div className="flex gap-3 text-sm text-gray-700 items-center">
                        <span className="material-symbols-outlined text-primary-600 text-xl">check_circle</span>
                        Unlimited users
                      </div>
                      <div className="flex gap-3 text-sm text-gray-700 items-center">
                        <span className="material-symbols-outlined text-primary-600 text-xl">check_circle</span>
                        Dedicated support
                      </div>
                      <div className="flex gap-3 text-sm text-gray-700 items-center">
                        <span className="material-symbols-outlined text-primary-600 text-xl">check_circle</span>
                        Custom branding
                      </div>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium">Select Plan</button>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-8 shadow-sm">
              <h2 className="text-gray-900 text-2xl font-bold leading-tight tracking-tight mb-6">Payment Information</h2>
              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium pb-2" htmlFor="card-number">Card Number</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">credit_card</span>
                    <input className="form-input w-full rounded-lg border-gray-300 bg-gray-50 focus:border-primary-500 focus:ring-primary-500 h-12 pl-10 placeholder:text-gray-400 text-sm" id="card-number" placeholder="•••• •••• •••• 1234" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium pb-2" htmlFor="expiry-date">Expiry Date</label>
                    <input className="form-input w-full rounded-lg border-gray-300 bg-gray-50 focus:border-primary-500 focus:ring-primary-500 h-12 placeholder:text-gray-400 text-sm" id="expiry-date" placeholder="MM / YY" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium pb-2" htmlFor="cvc">CVC</label>
                    <input className="form-input w-full rounded-lg border-gray-300 bg-gray-50 focus:border-primary-500 focus:ring-primary-500 h-12 placeholder:text-gray-400 text-sm" id="cvc" placeholder="•••" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium pb-2" htmlFor="name-on-card">Name on Card</label>
                  <input className="form-input w-full rounded-lg border-gray-300 bg-gray-50 focus:border-primary-500 focus:ring-primary-500 h-12 placeholder:text-gray-400 text-sm" id="name-on-card" placeholder="John Doe" />
                </div>
                <div className="flex justify-end pt-2">
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium">
                    <span className="truncate">Update Payment</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
