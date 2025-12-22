import "@/app/globals.css";

import Navbar from "@/ui/components/Navbar";
import Footer from "@/ui/components/Footer";
import WhatsappCTA from "@/ui/components/sections/WhatsappCTA";
import RotatingAds from "@/ui/components/sections/RotatingAds";

import Script from "next/script";
import { Metadata } from "next";

import Analytics from "@/ui/components/analytics/Analytics";
import GTMNoScript from "@/ui/components/analytics/GTMNoScript";

import { SITE_CONFIG } from "@/config/site";

import { GeistSans, GeistMono } from "geist/font";
import AdSenseAuto from "@/ui/components/ads/AdSenseAuto";


/* =====================================================
   GLOBAL METADATA (WhatsApp / Social Preview Ready)
===================================================== */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.seo.siteUrl),

  title: {
    default: SITE_CONFIG.seo.defaultTitle,
    template: SITE_CONFIG.seo.titleTemplate,
  },

  description: SITE_CONFIG.seo.defaultDescription,

  keywords: [...SITE_CONFIG.seo.keywords],


  robots: SITE_CONFIG.seo.robots,
   /* 🔥 FAVICON / TAB ICON FIX */
  icons: {
    icon: SITE_CONFIG.branding.favicon || "/images/udaanpath_logo_v1.png",
    shortcut: SITE_CONFIG.branding.favicon || "/images/udaanpath_logo_v1.png",
    apple: "/images/udaanpath_logo_v1.png",
  },

  openGraph: {
    type: "website",
    locale: SITE_CONFIG.seo.openGraph.locale,
    siteName: SITE_CONFIG.seo.siteName,
    url: SITE_CONFIG.seo.siteUrl,
    title: SITE_CONFIG.seo.defaultTitle,
    description: SITE_CONFIG.seo.defaultDescription,
    images: [
      {
        url: SITE_CONFIG.seo.openGraph.defaultImage,
        width: SITE_CONFIG.seo.openGraph.imageWidth,
        height: SITE_CONFIG.seo.openGraph.imageHeight,
        alt: "UdaanPath – Jobs, Results, Courses",
      },
    ],
  },

  twitter: {
    card: SITE_CONFIG.seo.twitter.card,
    site: SITE_CONFIG.seo.twitter.site,
    creator: SITE_CONFIG.seo.twitter.creator,
    title: SITE_CONFIG.seo.defaultTitle,
    description: SITE_CONFIG.seo.defaultDescription,
    images: [SITE_CONFIG.seo.twitter.defaultImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        {/* Google Search Console verification */}
        {SITE_CONFIG.analytics.googleSearchConsole.enabled && (
          <meta
            name="google-site-verification"
            content={
              SITE_CONFIG.analytics.googleSearchConsole.verificationCode
            }
          />
        )}

        {/* Google AdSense account verification */}
        {SITE_CONFIG.ads.googleAdsense.enabled && (
          <meta
            name="google-adsense-account"
            content={SITE_CONFIG.ads.googleAdsense.clientId}
          />
        )}

        {/* Google AdSense Script */}
        {SITE_CONFIG.ads.googleAdsense.enabled && (
          <Script
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE_CONFIG.ads.googleAdsense.clientId}`}
            crossOrigin="anonymous"
          />
        )}


        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5566458360910453"
          crossOrigin="anonymous"
        />
        {/* Analytics / GTM */}
        <Analytics />
      </head>

      <body className="bg-slate-50 text-slate-900 antialiased" suppressHydrationWarning>
        {/* GTM noscript (required inside body) */}
        {SITE_CONFIG.analytics.googleTagManager.enabled && <GTMNoScript />}

        <Navbar />

        <main className="min-h-[75vh]">
          {children}
        </main>

        {/* Global CTAs & Ads */}
        <WhatsappCTA />
        <AdSenseAuto />

        <RotatingAds />

        <Footer />
      </body>
    </html>
  );
}
