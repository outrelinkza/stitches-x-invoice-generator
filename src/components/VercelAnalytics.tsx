'use client';

import Script from 'next/script';

export default function VercelAnalytics() {
  return (
    <>
      <Script
        src="https://cdn.vercel-insights.com/v1/script.debug.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://va.vercel-scripts.com/v1/script.debug.js"
        strategy="afterInteractive"
      />
    </>
  );
}
