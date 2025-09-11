'use client';

export default function Support() {
  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden" style={{'--primary-color': '#1380ec'}}>
      {/* Header */}
      <header className="sticky top-0 z-20 w-full flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200/60 bg-white/60 px-10 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-4 text-gray-900">
          <div className="size-6 text-blue-600">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-[-0.015em]">Stitches X</h2>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a className="text-gray-600 hover:text-gray-900 text-sm font-medium leading-normal transition-colors" href="/dashboard">Dashboard</a>
          <a className="text-gray-600 hover:text-gray-900 text-sm font-medium leading-normal transition-colors" href="/invoices">Invoices</a>
          <a className="text-gray-600 hover:text-gray-900 text-sm font-medium leading-normal transition-colors" href="/templates">Templates</a>
          <a className="text-gray-600 hover:text-gray-900 text-sm font-medium leading-normal transition-colors" href="/settings">Settings</a>
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
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Left Column - Contact Info */}
            <div className="flex flex-col">
              <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Contact Support</h1>
                <p className="mt-4 text-lg text-gray-600">We're here to help you with any questions or issues. Fill out the form below, and we'll get back to you as soon as possible.</p>
              </div>
              
              <div className="space-y-6">
                <a className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-100 transition-colors" href="mailto:stitchesx.service@gmail.com">
                  <div className="flex-shrink-0 size-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-600 text-2xl"> mail </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Us</h3>
                    <p className="text-gray-600 text-sm">Our support team is available 24/7.</p>
                    <p className="text-blue-600 font-medium text-sm mt-1">stitchesx.service@gmail.com</p>
                  </div>
                </a>
                
                <a 
                  href="/contacts"
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer w-full text-left"
                >
                  <div className="flex-shrink-0 size-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-600 text-2xl"> description </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Help Center</h3>
                    <p className="text-gray-600 text-sm">Find answers and tutorials in our knowledge base.</p>
                    <p className="text-blue-600 font-medium text-sm mt-1">Visit Help Center</p>
                  </div>
                </a>
                
                <a 
                  href="/contacts"
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer w-full text-left"
                >
                  <div className="flex-shrink-0 size-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-600 text-2xl"> help_center </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">FAQs</h3>
                    <p className="text-gray-600 text-sm">Browse frequently asked questions.</p>
                    <p className="text-blue-600 font-medium text-sm mt-1">Check out our FAQs</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="p-8 rounded-2xl border border-gray-200/80 bg-white/60 shadow-lg shadow-gray-200/30 glassmorphism">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 pb-1.5" htmlFor="name">Your Name</label>
                  <input className="form-input block w-full rounded-lg border-gray-300 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-12 px-4 transition" id="name" placeholder="Enter your name" type="text"/>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 pb-1.5" htmlFor="email">Your Email</label>
                  <input className="form-input block w-full rounded-lg border-gray-300 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-12 px-4 transition" id="email" placeholder="Enter your email" type="email"/>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 pb-1.5" htmlFor="subject">Subject</label>
                  <input className="form-input block w-full rounded-lg border-gray-300 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-12 px-4 transition" id="subject" placeholder="How can we help?" type="text"/>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 pb-1.5" htmlFor="message">Message</label>
                  <textarea className="form-textarea block w-full rounded-lg border-gray-300 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-4 transition" id="message" placeholder="Enter your message" rows={5}></textarea>
                </div>
                
                <div>
                  <button className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors" type="submit">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
