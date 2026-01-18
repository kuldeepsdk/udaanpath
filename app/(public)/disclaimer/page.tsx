export const metadata = {
  title: "Disclaimer | UdaanPath",
  description:
    "Official disclaimer of UdaanPath clarifying information accuracy, government affiliation, tools usage, and user responsibility.",
};

export default function DisclaimerPage() {
  return (
    <div className="bg-slate-50/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-8">

        {/* ================= Header ================= */}
        <div className="bg-white border rounded-3xl p-6 sm:p-8 shadow-sm text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            ⚠️ Disclaimer <span className="text-slate-400">|</span> अस्वीकरण
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            This page explains the limitations of information, tools, and services
            provided on UdaanPath.
          </p>
        </div>

        {/* ================= General ================= */}
        <Section title="📌 General Disclaimer | सामान्य अस्वीकरण">
          <p>
            UdaanPath is an independent informational and tools platform created to
            help students and job aspirants access simplified government job and
            education-related information.
          </p>
          <p className="text-slate-500">
            UdaanPath एक स्वतंत्र जानकारी और टूल्स प्लेटफ़ॉर्म है, जो छात्रों और
            नौकरी की तैयारी करने वालों की सहायता के लिए बनाया गया है।
          </p>
        </Section>

        {/* ================= No Affiliation ================= */}
        <Section title="🏛️ No Government Affiliation | सरकारी संबद्धता नहीं">
          <p>
            UdaanPath is <strong>NOT affiliated</strong> with any government
            department, ministry, recruitment board, university, or examination
            authority.
          </p>
          <p className="text-slate-500">
            हमारा किसी भी सरकारी संस्था से कोई प्रत्यक्ष या अप्रत्यक्ष संबंध नहीं है।
          </p>
          <p>
            All logos, names, and trademarks belong to their respective owners.
          </p>
        </Section>

        {/* ================= Information Accuracy ================= */}
        <Section title="📄 Information Accuracy | जानकारी की शुद्धता">
          <p>
            While we make every effort to ensure accuracy, UdaanPath does not
            guarantee that all information published is complete, current, or
            error-free.
          </p>
          <p className="text-slate-500">
            हम जानकारी को सही रखने का प्रयास करते हैं, लेकिन 100% शुद्धता की
            गारंटी नहीं देते।
          </p>

          <div className="mt-3 rounded-2xl border bg-amber-50 p-4 text-sm">
            Users are strongly advised to verify details from official government
            websites before applying or taking decisions.
          </div>
        </Section>

        {/* ================= External Links ================= */}
        <Section title="🔗 External Links | बाहरी लिंक">
          <p>
            UdaanPath may contain links to official or external websites for
            reference and verification. We do not control these websites and are
            not responsible for their content or policies.
          </p>
        </Section>

        {/* ================= Tools Disclaimer ================= */}
        <Section title="🛠️ Tools Usage Disclaimer | टूल्स अस्वीकरण">
          <p>
            All tools provided on UdaanPath (photo resize, signature resize, crop
            tools, etc.) work locally in your browser. Files are never uploaded to
            our servers.
          </p>
          <p className="text-slate-500">
            टूल्स का उपयोग आपके अपने जोखिम पर होता है। हम किसी भी टूल के
            परिणामों की गारंटी नहीं देते।
          </p>
        </Section>

        {/* ================= No Professional Advice ================= */}
        <Section title="📚 No Professional Advice | पेशेवर सलाह नहीं">
          <p>
            Content on UdaanPath should not be considered legal, financial, or
            professional advice. Users must rely on official notifications and
            authorities for final decisions.
          </p>
        </Section>

        {/* ================= Limitation ================= */}
        <Section title="⚖️ Limitation of Liability | दायित्व की सीमा">
          <p>
            UdaanPath and its team shall not be liable for any loss, damage,
            missed opportunity, or inconvenience caused by the use of this
            website or its tools.
          </p>
        </Section>

        {/* ================= Consent ================= */}
        <Section title="✅ Consent | सहमति">
          <p>
            By using UdaanPath, you hereby consent to this disclaimer and agree
            to its terms.
          </p>
        </Section>

        {/* ================= Contact ================= */}
        <Section title="📬 Contact Us | संपर्क करें">
          <p>
            If you have questions regarding this disclaimer, please contact us:
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

/* ================= UI Helper ================= */

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
