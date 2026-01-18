export const metadata = {
  title: "Terms of Service | UdaanPath",
  description:
    "Terms of Service governing the use of UdaanPath – an independent informational and tools platform for government jobs and education in India.",
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-slate-50/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-8">

        {/* ================= Header ================= */}
        <div className="bg-white border rounded-3xl p-6 sm:p-8 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            📜 Terms of Service <span className="text-slate-400">|</span> सेवा की शर्तें
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            By accessing or using UdaanPath, you agree to be bound by these Terms of Service.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border">
              Transparent
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border">
              Fair Usage
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-700 border">
              User Responsibility
            </span>
          </div>
        </div>

        {/* ================= Acceptance ================= */}
        <Section title="📌 Acceptance of Terms | शर्तों की स्वीकृति">
          <p>
            These Terms apply to all visitors, users, and others who access UdaanPath.
            If you do not agree with these Terms, you must stop using the website immediately.
          </p>
        </Section>

        {/* ================= Platform Nature ================= */}
        <Section title="🏷️ Nature of Platform | प्लेटफ़ॉर्म का स्वरूप">
          <p>
            UdaanPath is an independent informational and tools platform. We are not affiliated
            with any government body, recruitment board, university, or examination authority.
          </p>
          <p className="text-slate-500">
            यह एक स्वतंत्र जानकारी और टूल्स प्लेटफ़ॉर्म है, किसी भी सरकारी संस्था से संबद्ध नहीं है।
          </p>
        </Section>

        {/* ================= Content Usage ================= */}
        <Section title="1️⃣ Use of Content | सामग्री का उपयोग">
          <ul className="list-disc pl-5 space-y-2">
            <li>Content is for informational and educational purposes only</li>
            <li>No copying, scraping, or redistribution without permission</li>
            <li>No commercial use of tools or data without written consent</li>
          </ul>
        </Section>

        {/* ================= Tools Disclaimer ================= */}
        <Section title="2️⃣ Tools Usage Disclaimer | टूल्स अस्वीकरण">
          <p>
            All tools (photo resize, signature tools, etc.) run locally in your browser.
            UdaanPath does not store, upload, or guarantee results of any tool.
          </p>
          <p className="text-slate-500">
            टूल्स का उपयोग आपके अपने जोखिम पर है।
          </p>
        </Section>

        {/* ================= Accuracy ================= */}
        <Section title="3️⃣ Accuracy of Information | जानकारी की शुद्धता">
          <p>
            While we strive to keep content updated, UdaanPath does not guarantee the accuracy,
            completeness, or reliability of any information.
          </p>
          <div className="mt-3 rounded-xl border bg-amber-50 p-4 text-sm">
            Always verify information from official government websites before applying or acting.
          </div>
        </Section>

        {/* ================= User Responsibility ================= */}
        <Section title="4️⃣ User Responsibilities | उपयोगकर्ता की जिम्मेदारी">
          <ul className="list-disc pl-5 space-y-2">
            <li>Use the website lawfully and responsibly</li>
            <li>Do not misuse tools or attempt to harm systems</li>
            <li>Do not post false or misleading information</li>
          </ul>
        </Section>

        {/* ================= Third Party ================= */}
        <Section title="5️⃣ Third-Party Links | तृतीय-पक्ष लिंक">
          <p>
            External links are provided for reference only. UdaanPath does not control
            third-party websites or their content.
          </p>
        </Section>

        {/* ================= Limitation ================= */}
        <Section title="6️⃣ Limitation of Liability | दायित्व की सीमा">
          <p>
            UdaanPath shall not be liable for any direct or indirect damages resulting from the
            use of this platform, including data loss, exam errors, or missed deadlines.
          </p>
        </Section>

        {/* ================= Termination ================= */}
        <Section title="7️⃣ Termination | सेवा समाप्ति">
          <p>
            We reserve the right to suspend or terminate access if these terms are violated
            or the platform is misused.
          </p>
        </Section>

        {/* ================= Jurisdiction ================= */}
        <Section title="8️⃣ Governing Law | लागू कानून">
          <p>
            These terms are governed by the laws of India. Any disputes shall be resolved
            under Indian jurisdiction.
          </p>
        </Section>

        {/* ================= Updates ================= */}
        <Section title="9️⃣ Changes to Terms | शर्तों में परिवर्तन">
          <p>
            We may update these terms at any time. Continued use of the website means
            acceptance of the updated terms.
          </p>
          <div className="mt-2 text-sm text-slate-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </Section>

        {/* ================= Contact ================= */}
        <Section title="📬 Contact Us | संपर्क करें">
          <p>
            If you have any questions regarding these Terms, please contact us:
          </p>
          <a
            href="mailto:support@udaanpath.com"
            className="text-blue-600 underline"
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
}) {
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
