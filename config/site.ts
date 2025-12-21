// config/site.ts

export const SITE_CONFIG = {
  /* =====================================================
     CORE IDENTITY
  ===================================================== */
  name: "UdaanPath",
  shortName: "UdaanPath",
  tagline: "Empowering students & youth through technology and awareness",
  tagline_1: "Career • Jobs • Blogs • Courses",
  description:
    "UdaanPath भारत की एक प्रमुख हिंदी वेबसाइट है जहाँ आपको सरकारी नौकरी, रिजल्ट, एडमिट कार्ड, आंसर की, सिलेबस और फ्री कोर्सेस की लेटेस्ट जानकारी मिलती है।",

  domain: "udaanpath.com",
  baseUrl:
    process.env.NODE_ENV === "production"
      ? "https://udaanpath.com"
      : "http://localhost:3000",

  /* =====================================================
     BRANDING & UI
  ===================================================== */
  branding: {
    logo: "/images/udaanpath_logo_v1.png",
    logoDark: "/images/udaanpath_logo_v1.png",
    favicon: "/images/udaanpath_logo_v1.png",
    appIcon: "/images/udaanpath_logo_v1.png",

    theme: {
      primaryColor: "#2563EB", // blue-600
      secondaryColor: "#1E40AF", // blue-800
      accentColor: "#16A34A", // green-600
      backgroundLight: "#FFFFFF",
      backgroundDark: "#0F172A",
      textPrimary: "#111827",
      textSecondary: "#6B7280",
    },
  },

  /* =====================================================
     SEO, OPEN GRAPH & SOCIAL PREVIEW (UPDATED)
  ===================================================== */
  seo: {
    siteName: "UdaanPath",
    siteUrl:
      process.env.NODE_ENV === "production"
        ? "https://udaanpath.com"
        : "http://localhost:3000",

    titleTemplate: "%s | UdaanPath",
    defaultTitle:
      "UdaanPath – Sarkari Job, Result, Admit Card, Answer Key",
    defaultDescription:
      "लेटेस्ट सरकारी नौकरी, रिजल्ट, एडमिट कार्ड, आंसर की, सिलेबस और फ्री कोर्सेस – सब कुछ हिंदी में।",

    keywords: [
      "sarkari job",
      "sarkari result",
      "admit card",
      "answer key",
      "rojgar samachar",
      "government job hindi",
      "free online course hindi",
    ],

    robots: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },

    /* 🔥 WhatsApp / Facebook / LinkedIn Preview */
    openGraph: {
      type: "website",
      locale: "hi_IN",
      siteName: "UdaanPath",

      defaultImage: "/og/udaan_og_1.png", // 1200x630
      imageWidth: 1200,
      imageHeight: 630,
    },

    /* 🔥 Twitter / X Preview */
    twitter: {
      card: "summary_large_image",
      site: "@udaanpath",
      creator: "@udaanpath",
      defaultImage: "/og/udaan_og_1.png",
    },
  },

  /* =====================================================
     ANALYTICS & TRACKING
  ===================================================== */
  analytics: {
    googleAnalytics: {
      enabled: true,
      measurementId: "G-XXXXXXXXXX",
    },

    googleTagManager: {
      enabled: true,
      containerId: "GTM-XXXXXXX",
      noscript: true,
    },

    googleSearchConsole: {
      enabled: true,
      verificationCode: "google-site-verification=XXXX",
    },

    clarity: {
      enabled: false,
      projectId: "",
    },
  },

  /* =====================================================
     ADS & MONETIZATION
  ===================================================== */
  ads: {
    enabled: true,

    googleAdsense: {
      enabled: true,
      clientId: "ca-pub-XXXXXXXXXXXXXXXX",
      autoAds: true,
      pageLevelAds: true,

      adSlots: {
        header: "1234567890",
        sidebar: "2345678901",
        inArticle: "3456789012",
        footer: "4567890123",
        sticky: "5678901234",
      },

      lazyLoad: true,
      adLabel: "Advertisement",
    },

    directAds: {
      enabled: false,
      contactEmail: "ads@udaanpath.com",
    },
  },

  /* =====================================================
     AFFILIATE & DISCLAIMER
  ===================================================== */
  affiliate: {
    enabled: true,
    disclosureText:
      "इस वेबसाइट पर दिए गए कुछ लिंक एफिलिएट लिंक हो सकते हैं। इससे हमें आपको बिना किसी अतिरिक्त लागत के सहायता मिलती है।",

    allowedNetworks: ["amazon", "flipkart", "coursera"],
  },

  /* =====================================================
     FEATURES FLAGS
  ===================================================== */
  features: {
    jobs: true,
    results: true,
    admitCards: true,
    answerKeys: true,
    syllabus: true,
    courses: true,
    quizzes: false,
    exams: false,
    comments: false,
    notifications: true,
  },

  /* =====================================================
     PERFORMANCE & SCALE
  ===================================================== */
  performance: {
    enableISR: true,
    defaultRevalidate: 60,
    enableEdgeRuntime: false,
    enableCDNCache: true,
    imageOptimization: true,
  },

  /* =====================================================
     LOCALIZATION
  ===================================================== */
  locale: {
    default: "hi",
    supported: ["hi", "en"],
    fallback: "hi",
    direction: "ltr",
    dateFormat: "DD MMM YYYY",
  },

  /* =====================================================
     COMPLIANCE & LEGAL
  ===================================================== */
  legal: {
    copyright: `© ${new Date().getFullYear()} UdaanPath`,
    privacyPolicyUrl: "/privacy-policy",
    termsUrl: "/terms-and-conditions",
    disclaimerUrl: "/disclaimer",
    dmcaEmail: "dmca@udaanpath.com",
    grievanceEmail: "support@udaanpath.com",
  },

  /* =====================================================
     SYSTEM FLAGS
  ===================================================== */
  system: {
    maintenanceMode: false,
    showBetaBadge: false,
    version: "1.0.0",
  },

  /* =====================================================
     HERO SECTION
  ===================================================== */
  hero: {
    badgeText: "India's Trusted Platform",
    titleLine1: "Your Journey to",
    titleLine2: "Growth & Freedom 🇮🇳",
    description:
      "India’s youth-first platform for Jobs, Sarkari Results, Blogs & Courses — fast, reliable and always up-to-date.",
    primaryCTA: "Explore Updates",
    secondaryCTA: "Browse Courses",
    image: "/images/hero-illustration.jpg",
  },
} as const;
