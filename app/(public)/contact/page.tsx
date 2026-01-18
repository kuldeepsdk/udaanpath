export const metadata = {
  title: "Contact Us | UdaanPath",
  description:
    "Contact UdaanPath for support, corrections, feedback, collaborations, or advertising inquiries. We usually respond within 24–48 hours.",
};

export default function ContactPage() {
  return (
    <div className="bg-slate-50/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-10">

        {/* ================= Header ================= */}
        <div className="bg-white border rounded-3xl p-6 sm:p-8 shadow-sm text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            📞 Contact UdaanPath <span className="text-slate-400">|</span> संपर्क करें
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            We’re here to help you with corrections, feedback, and general support.
            <br />
            <span className="text-slate-500">
              हम सुधार, सुझाव और सामान्य सहायता के लिए उपलब्ध हैं।
            </span>
          </p>
        </div>

        {/* ================= Trust ================= */}
        <Section title="🏷️ Platform Information | प्लेटफ़ॉर्म जानकारी">
          <p>
            <strong>UdaanPath</strong> is an independent informational and tools platform
            operated from India. We provide verified government job updates,
            exam tools, and educational resources.
          </p>
          <p className="text-slate-500">
            यह एक स्वतंत्र भारतीय प्लेटफ़ॉर्म है जो सरकारी नौकरियों और शिक्षा से जुड़ी जानकारी देता है।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <MiniStat label="Operating Country" value="India 🇮🇳" />
            <MiniStat label="Response Time" value="24–48 hrs" />
            <MiniStat label="Support Type" value="Email Support" />
          </div>
        </Section>

        {/* ================= What We Handle ================= */}
        <Section title="💬 How We Can Help | हम कैसे मदद कर सकते हैं">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoBox
              title="You can contact us for"
              subtitle="आप इन विषयों पर संपर्क कर सकते हैं"
              items={[
                "Wrong or outdated job information",
                "Website errors or broken links",
                "Feedback or suggestions",
                "Business or advertising inquiries",
              ]}
            />

            <InfoBox
              title="We cannot help with"
              subtitle="हम इनमें सहायता नहीं कर सकते"
              items={[
                "Government form filling",
                "Exam application status",
                "Personal result disputes",
                "Official authority decisions",
              ]}
            />
          </div>
        </Section>

        {/* ================= Contact Channels ================= */}
        <Section title="📌 Official Contact Channels | आधिकारिक संपर्क">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <ContactCard
              icon="📧"
              title="Email Support"
              value="support@udaanpath.com"
              link="mailto:support@udaanpath.com"
              note="For support, corrections & feedback"
            />

            <ContactCard
              icon="📢"
              title="Advertising / Collaboration"
              value="support@udaanpath.com"
              link="mailto:support@udaanpath.com"
              note="For partnerships & promotions"
            />

            <ContactCard
              icon="🌐"
              title="Official Website"
              value="https://udaanpath.com"
              link="https://udaanpath.com"
              note="Verified platform"
            />

            <ContactCard
              icon="📲"
              title="WhatsApp Channel"
              value="Join for daily updates"
              link="https://whatsapp.com/channel/0029VbBG8135PO0sX5HVPZ1p"
              note="Jobs • Admit Cards • Results"
            />
          </div>
        </Section>

        {/* ================= Working Hours ================= */}
        <Section title="⏱️ Support Hours | सहायता समय">
          <div className="rounded-2xl border bg-emerald-50/60 p-5">
            <p className="text-sm text-emerald-900 font-medium">
              🕒 Support Hours: Monday – Saturday (10:00 AM – 6:00 PM IST)
            </p>
            <p className="text-sm text-emerald-800 mt-1">
              सामान्यतः 24–48 घंटों में उत्तर दिया जाता है।
            </p>
          </div>
        </Section>

        {/* ================= Legal ================= */}
        <Section title="⚖️ Legal Notice | कानूनी सूचना">
          <p>
            UdaanPath is not affiliated with any government organization.
            All information is provided for educational and informational purposes only.
          </p>
          <p className="text-slate-500">
            कृपया आधिकारिक जानकारी के लिए संबंधित सरकारी वेबसाइट देखें।
          </p>
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

function InfoBox({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border bg-slate-50/60 p-4">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="text-xs text-slate-500">{subtitle}</div>
      <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-slate-600">
        {items.map((it, idx) => (
          <li key={`${title}-${idx}`}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  value,
  link,
  note,
}: {
  icon: string;
  title: string;
  value: string;
  link: string;
  note?: string;
}) {
  return (
    <a
      href={link}
      target="_blank"
      className="group rounded-2xl border bg-white p-5 hover:shadow-md transition"
    >
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 text-sm font-semibold text-slate-900">
        {title}
      </div>
      <div className="text-sm text-blue-600 group-hover:underline">
        {value}
      </div>
      {note && (
        <div className="mt-1 text-xs text-slate-500">
          {note}
        </div>
      )}
    </a>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white p-4 text-center">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-slate-900 mt-1">{value}</div>
    </div>
  );
}
