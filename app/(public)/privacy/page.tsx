// app/(public)/privacy/page.tsx

export const metadata = {
  title: "Privacy Policy | UdaanPath",
  description:
    "Privacy policy explaining how UdaanPath collects, uses, and protects user data in compliance with Google AdSense and data protection guidelines.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-8">

        {/* ================= Header ================= */}
        <div className="bg-white border rounded-3xl p-6 sm:p-8 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            🔒 Privacy Policy <span className="text-slate-400">|</span> गोपनीयता नीति
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            This page explains how UdaanPath collects, uses, and protects your
            information when you visit or use our services.
          </p>
        </div>

        {/* ================= Intro ================= */}
        <Section title="📌 Overview | संक्षेप में">
          <p>
            UdaanPath is an independent informational and tools platform for
            government job aspirants and students. We respect your privacy and
            are committed to protecting it.
          </p>
          <p className="text-slate-500">
            हम आपकी गोपनीयता का सम्मान करते हैं और आपकी जानकारी को सुरक्षित
            रखने के लिए प्रतिबद्ध हैं।
          </p>
        </Section>

        {/* ================= Information ================= */}
        <Section title="📥 Information We Collect | हम क्या जानकारी एकत्र करते हैं">
          <ul className="list-disc pl-5 space-y-2">
            <li>Name & email (only if you contact us or subscribe)</li>
            <li>Device, browser, pages visited (via analytics)</li>
            <li>Anonymous interaction data (polls, tools usage)</li>
          </ul>

          <div className="mt-4 rounded-xl bg-green-50 border p-4 text-sm">
            <strong>We do NOT collect:</strong> Aadhaar, PAN, bank details,
            card numbers, passwords, or OTPs.
          </div>
        </Section>

        {/* ================= Local Processing ================= */}
        <Section title="🛠️ Local Tools Processing | ब्राउज़र पर ही प्रोसेसिंग">
          <p>
            All photo, signature, and document tools work locally in your
            browser. Your files are never uploaded to our servers.
          </p>
          <p className="text-slate-500">
            आपकी फ़ाइलें आपके डिवाइस पर ही प्रोसेस होती हैं, सर्वर पर अपलोड नहीं होतीं।
          </p>
        </Section>

        {/* ================= Cookies ================= */}
        <Section title="🍪 Cookies & Tracking | कुकीज़">
          <p>
            UdaanPath uses cookies to improve experience, measure traffic, and
            display relevant advertisements.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Google Analytics (traffic & performance)</li>
            <li>Google AdSense (ads personalization & measurement)</li>
            <li>Session cookies (navigation stability)</li>
          </ul>
        </Section>

        {/* ================= Ads ================= */}
        <Section title="📢 Advertising (Google AdSense)">
          <p>
            We use Google AdSense to display ads. Google may use cookies (such
            as DoubleClick cookie) to show ads based on your visits.
          </p>

          <p className="text-sm text-slate-500">
            Users may opt out of personalized advertising by visiting
            <a
              className="text-blue-600 underline ml-1"
              href="https://adssettings.google.com"
              target="_blank"
            >
              Google Ads Settings
            </a>.
          </p>
        </Section>

        {/* ================= Third Party ================= */}
        <Section title="👥 Third-Party Services | तृतीय-पक्ष सेवाएं">
          <p>
            We use trusted third-party services such as Google Analytics,
            Google AdSense, and social sharing tools. Their data use is governed
            by their own policies.
          </p>
        </Section>

        {/* ================= External Links ================= */}
        <Section title="🔗 External Links Disclaimer">
          <p>
            UdaanPath links to official websites (gov.in, nic.in, ac.in, etc.)
            for verification. We are not responsible for external site content
            or privacy practices.
          </p>
        </Section>

        {/* ================= Children ================= */}
        <Section title="👶 Children Information">
          <p>
            UdaanPath does not knowingly collect personal information from
            children under 13. If you believe a child has provided data, please
            contact us for removal.
          </p>
        </Section>

        {/* ================= Rights ================= */}
        <Section title="⚖️ Your Rights | आपके अधिकार">
          <ul className="list-disc pl-5 space-y-1">
            <li>Request access or deletion of your data</li>
            <li>Unsubscribe from communications</li>
            <li>Contact us for privacy concerns</li>
          </ul>
        </Section>

        {/* ================= Updates ================= */}
        <Section title="📅 Policy Updates">
          <p>
            This Privacy Policy may be updated from time to time. Updates will
            be posted on this page with a revised date.
          </p>
          <div className="text-sm text-slate-500 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </Section>

        {/* ================= Contact ================= */}
        <Section title="📬 Contact Us">
          <p>
            For any privacy-related questions, contact us at:
          </p>
          <a
            href="mailto:support@udaanpath.com"
            className="inline-block mt-2 text-blue-600 underline"
          >
            support@udaanpath.com
          </a>
        </Section>

      </div>
    </div>
  );
}

/* ================= UI Helpers ================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
})  {
  return (
    <section className="bg-white border rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
        {title}
      </h2>
      <div className="text-sm sm:text-[15px] text-slate-600 space-y-2">
        {children}
      </div>
    </section>
  );
}
