export const metadata = {
  title: "About Us | UdaanPath – Trusted Government Job & Education Platform",
  description:
    "UdaanPath is an independent Indian platform providing verified government job updates, exam tools, results, admissions and education resources for students and job aspirants.",
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-10">

        {/* ================= Header ================= */}
        <div className="bg-white border rounded-3xl p-6 sm:p-8 shadow-sm text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            About UdaanPath <span className="text-slate-400">|</span> हमारे बारे में
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            A transparent, independent, and student-first digital platform
            built to simplify government job & education information in India.
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 text-xs rounded-full bg-green-50 text-green-700 border">
              Independent Platform
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border">
              Verified Information
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-purple-50 text-purple-700 border">
              Free Student Tools
            </span>
          </div>
        </div>

        {/* ================= Who We Are ================= */}
        <Section title="🌟 Who We Are | हम कौन हैं">
          <p>
            <strong>UdaanPath</strong> is an independent Indian digital platform
            created to help students, job aspirants, and learners easily access
            verified information related to government jobs, exams, results,
            admissions, and education resources.
          </p>

          <p className="text-slate-500">
            UdaanPath एक स्वतंत्र भारतीय डिजिटल प्लेटफ़ॉर्म है जो छात्रों और
            नौकरी की तैयारी करने वाले युवाओं को सरकारी नौकरियों, परीक्षाओं,
            रिज़ल्ट, एडमिशन और शिक्षा से जुड़ी जानकारी सरल भाषा में उपलब्ध कराता है।
          </p>

          <p>
            We are not a coaching institute, agency, or government body. We work
            purely as an <strong>information and tools platform</strong>.
          </p>
        </Section>

        {/* ================= What We Do ================= */}
        <Section title="💡 What We Do | हम क्या करते हैं">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OfferBox
              title="Verified Government Updates"
              items={[
                "Latest government job notifications",
                "Result, admit card & exam date updates",
                "Official links to gov.in, nic.in, ac.in sources",
                "Clear and simplified explanations",
              ]}
            />

            <OfferBox
              title="Free Exam Form Tools"
              items={[
                "Photo resize & crop tools",
                "Signature resize tools",
                "Passport photo tools",
                "Mobile-friendly, no upload tools",
              ]}
            />

            <OfferBox
              title="Education & Career Guidance"
              items={[
                "Exam preparation blogs",
                "Career awareness content",
                "Course & skill guidance",
                "Student-friendly resources",
              ]}
            />

            <OfferBox
              title="Public Information"
              items={[
                "Daily mandi bhav updates",
                "Government scheme awareness",
                "General information services",
              ]}
            />
          </div>
        </Section>

        {/* ================= Vision ================= */}
        <Section title="🚀 Our Vision & Mission | उद्देश्य">
          <p>
            🌟 <strong>Vision:</strong> To become one of India’s most trusted
            digital platforms for government job & education information.
          </p>

          <p>
            🎯 <strong>Mission:</strong> To reduce confusion, save time, and
            empower students and job aspirants—especially from small towns and
            rural areas—with accurate and easy-to-understand information.
          </p>
        </Section>

        {/* ================= Transparency ================= */}
        <Section title="🔐 Transparency & Disclaimer | पारदर्शिता">
          <p>
            UdaanPath is an <strong>independent informational platform</strong>.
            We are not affiliated with any government organization, board, or
            recruitment agency.
          </p>

          <p className="text-slate-500">
            हम किसी भी सरकारी संस्था से संबद्ध नहीं हैं। सभी उपयोगकर्ताओं को
            आधिकारिक वेबसाइटों से जानकारी की पुष्टि करने की सलाह दी जाती है।
          </p>

          <p>
            All information is collected from official sources and presented in
            simplified form for educational and informational purposes only.
          </p>
        </Section>

        {/* ================= Who Runs ================= */}
        <Section title="👤 Who Runs UdaanPath | प्लेटफ़ॉर्म संचालक">
          <p>
            UdaanPath is managed by an independent Indian development team
            focused on building digital tools and information platforms for
            students and job seekers.
          </p>

          <p className="text-slate-500">
            Our team has experience in software development, education content,
            and public information systems. We believe in transparency,
            accuracy, and user trust.
          </p>
        </Section>

        {/* ================= Contact ================= */}
        <Section title="🤝 Contact & Communication | संपर्क">
          <p>
            For feedback, corrections, or suggestions, feel free to contact us.
            We respond to all genuine queries.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium hover:bg-slate-50"
            >
              📬 Contact Us
            </a>

            <a
              href="mailto:support@udaanpath.com"
              className="inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium hover:bg-slate-50"
            >
              ✉️ support@udaanpath.com
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
})  {
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

function OfferBox({ title, items }: { title: string; items: string[] }) {
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
