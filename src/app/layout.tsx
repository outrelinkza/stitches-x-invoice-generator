import type { Metadata } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import AuroraBackground from "@/components/AuroraBackground";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Stitches X - AI Invoice Generator",
  description: "AI Invoice Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} ${notoSans.variable} min-h-screen text-gray-300 antialiased selection:bg-blue-600/40`}
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        <AuroraBackground />
        <AuthProvider>
          <UserProfileProvider>
            <div className="relative z-10">
              {children}
            </div>
          </UserProfileProvider>
        </AuthProvider>
        <Script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
