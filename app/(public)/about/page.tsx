export const metadata = {
  title: "About Us | UdaanPath",
  description:
    "Learn about UdaanPath – a trusted Indian platform for government jobs, results, admissions, education, and AI-powered career resources.",
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-10">

        {/* ================= Header ================= */}
        <div className="bg-white border rounded-3xl p-6 sm:p-8 shadow-sm text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            📘 About Us <span className="text-slate-400">|</span> हमारे बारे में
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            Empowering students, job aspirants & learners across India
            with verified and simplified information.
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 text-xs rounded-full bg-green-50 text-green-700 border border-green-100">
              Trusted Platform
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              Govt Updates
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-purple-50 text-purple-700 border border-purple-100">
              AI-Powered Learning
            </span>
          </div>
        </div>

        {/* ================= Who We Are ================= */}
        <Section title="🌟 Who We Are | हम कौन हैं">
          <p>
            <strong>UdaanPath</strong> is a modern Indian digital platform built to
            help students, job aspirants, and learners stay informed about
            Government Jobs, Results, Admit Cards, Admissions, and career opportunities.
          </p>

          <p className="text-slate-500">
            <strong>UdaanPath</strong> एक आधुनिक भारतीय डिजिटल प्लेटफ़ॉर्म है,
            जो छात्रों, नौकरी की तैयारी करने वाले अभ्यर्थियों और सीखने वालों को
            सरकारी नौकरियों, रिजल्ट, एडमिट कार्ड, एडमिशन और करियर अवसरों की
            विश्वसनीय जानकारी प्रदान करता है।
          </p>

          <p>
            We focus on <strong>accuracy, clarity, and accessibility</strong> —
            ensuring that complex official notifications are presented in a
            simple and understandable format.
          </p>
        </Section>

        {/* ================= What We Offer ================= */}
        <Section title="💡 What We Offer | हम क्या प्रदान करते हैं">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <OfferBox
              title="For Job Aspirants"
              items={[
                "Latest Sarkari Job notifications",
                "Admit Card & Result updates",
                "Admission alerts for colleges & universities",
                "Vacancy details, dates & official links",
              ]}
            />

            <OfferBox
              title="For Learners & Students"
              items={[
                "Educational blogs & exam strategies",
                "AI-powered learning tools",
                "Exam-specific guidance (SSC, Banking, Railways, etc.)",
                "Career awareness & planning resources",
              ]}
            />

            <OfferBox
              title="For Rural & General Public"
              items={[
                "Daily Mandi Bhav updates",
                "Government scheme awareness",
                "Simplified public information",
              ]}
            />

            <OfferBox
              title="Community Features"
              items={[
                "Public opinion polls",
                "Trend analysis & insights",
                "WhatsApp & social media updates",
              ]}
            />

          </div>
        </Section>

        {/* ================= Vision & Mission ================= */}
        <Section title="🚀 Vision & Mission | हमारा उद्देश्य">
          <div className="space-y-4">
            <p>
              🌟 <strong>Our Vision</strong> is to become one of India’s most trusted
              digital destinations for verified government and education-related information.
            </p>

            <p className="text-slate-500">
              🌟 हमारा विज़न है भारत का सबसे भरोसेमंद डिजिटल प्लेटफ़ॉर्म बनना,
              जहाँ सरकारी और शिक्षा से जुड़ी प्रमाणिक जानकारी उपलब्ध हो।
            </p>

            <p>
              🎯 <strong>Our Mission</strong> is to reduce confusion, save time,
              and empower users with correct information — especially for those
              coming from small towns and rural areas.
            </p>

            <p className="text-slate-500">
              🎯 हमारा मिशन है भ्रम को कम करना, समय बचाना और
              खासकर छोटे शहरों व ग्रामीण क्षेत्रों के छात्रों को
              सही जानकारी से सशक्त बनाना।
            </p>
          </div>
        </Section>

        {/* ================= Trust & Disclaimer ================= */}
        <Section title="🔐 Trust & Transparency | भरोसा और पारदर्शिता">
          <p>
            UdaanPath is an <strong>informational platform</strong>.
            We are not affiliated with any government organization.
          </p>

          <p className="text-slate-500">
            UdaanPath एक जानकारी प्रदान करने वाला प्लेटफ़ॉर्म है।
            हमारा किसी भी सरकारी संस्था से प्रत्यक्ष संबंध नहीं है।
          </p>

          <p>
            Users are always encouraged to verify details from
            <strong> official government websites</strong>.
          </p>
        </Section>

        {/* ================= Connect ================= */}
        <Section title="🤝 Connect With Us | हमसे जुड़ें">
          <p>
            Have feedback, suggestions, or collaboration ideas?
            We’d love to hear from you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium hover:bg-slate-50"
            >
              📬 Contact Us
            </a>

            <a
              href="https://whatsapp.com/channel/0029VbBG8135PO0sX5HVPZ1p"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 text-white px-5 py-3 text-sm font-medium hover:bg-green-700"
            >
              📲 Join WhatsApp Channel
            </a>

            <a
              href="https://www.facebook.com/people/Udaanpath/61578611136906/"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white px-5 py-3 text-sm font-medium hover:bg-blue-700"
            >
              👍 Follow on Facebook
            </a>
          </div>
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
}) {
  return (
    <section className="bg-white border rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
        {title}
      </h2>
      <div className="text-sm sm:text-[15px] text-slate-600 space-y-3">
        {children}
      </div>
    </section>
  );
}

function OfferBox({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border bg-slate-50/60 p-4">
      <div className="text-sm font-semibold text-slate-900 mb-2">
        {title}
      </div>
      <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
        {items.map((it, idx) => (
          <li key={`${title}-${idx}`}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
