export const metadata = {
  title: "Contact Us | UdaanPath",
  description:
    "Contact UdaanPath for support, feedback, corrections, collaborations, or advertising opportunities.",
};

export default function ContactPage() {
  return (
    <div className="bg-slate-50/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-10">

        {/* ================= Header ================= */}
        <div className="bg-white border rounded-3xl p-6 sm:p-8 shadow-sm text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            📞 Contact Us <span className="text-slate-400">|</span> संपर्क करें
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            Have a question, feedback, correction, or collaboration proposal?  
            <br />
            <span className="text-slate-500">
              कोई सवाल, सुझाव, सुधार या सहयोग से जुड़ी जानकारी चाहिए?
            </span>
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 text-xs rounded-full bg-green-50 text-green-700 border border-green-100">
              Trusted Platform
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              Govt Updates
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-700 border">
              Fast Support
            </span>
          </div>
        </div>

        {/* ================= Intro ================= */}
        <Section title="💬 How Can We Help You? | हम कैसे मदद कर सकते हैं">
          <p>
            <strong>UdaanPath</strong> is dedicated to delivering accurate and timely updates related to
            Government Jobs, Admit Cards, Results, Admissions, and other important notifications.
          </p>
          <p className="text-slate-500">
            <strong>UdaanPath</strong> सरकारी नौकरियों, एडमिट कार्ड, रिजल्ट, एडमिशन और अन्य महत्वपूर्ण
            सूचनाओं की विश्वसनीय जानकारी समय पर उपलब्ध कराता है।
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <InfoBox
              title="You can contact us for"
              subtitle="आप हमसे इन विषयों पर संपर्क कर सकते हैं"
              items={[
                "Wrong or outdated job information",
                "Suggestions or feature requests",
                "Feedback about content quality",
                "Collaboration or advertising inquiries",
              ]}
            />
            <InfoBox
              title="What we don't handle"
              subtitle="हम किन चीज़ों के लिए ज़िम्मेदार नहीं हैं"
              items={[
                "Individual application status",
                "Government form filling issues",
                "Personal exam or result disputes",
              ]}
            />
          </div>
        </Section>

        {/* ================= Contact Details ================= */}
        <Section title="📌 Contact Details | संपर्क विवरण">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <ContactCard
              icon="📧"
              title="Email Support"
              value="support@udaanpath.com"
              link="mailto:support@udaanpath.com"
              note="For feedback, corrections & general queries"
            />

            <ContactCard
              icon="🌐"
              title="Website"
              value="https://udaanpath.com"
              link="https://udaanpath.com"
              note="Official portal"
            />

            <ContactCard
              icon="📲"
              title="WhatsApp Channel"
              value="Join for Daily Updates"
              link="https://whatsapp.com/channel/0029VbBG8135PO0sX5HVPZ1p"
              note="Jobs • Admit Cards • Results"
            />

            <ContactCard
              icon="📘"
              title="Facebook Page"
              value="UdaanPath on Facebook"
              link="https://www.facebook.com/people/Udaanpath/61578611136906/"
              note="Follow for announcements"
            />
          </div>
        </Section>

        {/* ================= Response Time ================= */}
        <Section title="⏱ Response Time | उत्तर समय">
          <div className="rounded-2xl border bg-emerald-50/60 p-5">
            <p className="text-sm text-emerald-900 font-medium">
              💬 We usually respond within <strong>24–48 hours</strong>.
            </p>
            <p className="text-sm text-emerald-800 mt-1">
              💬 हम सामान्यतः <strong>24–48 घंटों</strong> के भीतर उत्तर देते हैं।
            </p>

            <p className="mt-3 text-sm text-slate-600">
              Please include complete details and relevant links/screenshots (if any) for faster resolution.
              <span className="block text-slate-500">
                तेज़ समाधान के लिए पूरी जानकारी और संबंधित लिंक/स्क्रीनशॉट साझा करें।
              </span>
            </p>
          </div>
        </Section>

        {/* ================= Business & Ads ================= */}
        <Section title="🤝 Business & Advertising | व्यवसाय और विज्ञापन">
          <p>
            For <strong>collaborations, sponsored listings, affiliate partnerships, or digital advertising</strong>,
            please contact us via email.
          </p>
          <p className="text-slate-500">
            यदि आप <strong>कोलैबोरेशन, स्पॉन्सर्ड लिस्टिंग, अफिलिएट पार्टनरशिप या डिजिटल विज्ञापन</strong>
            में रुचि रखते हैं, तो ईमेल द्वारा संपर्क करें।
          </p>

          <div className="mt-4 rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">
            📩 <strong>Email Subject:</strong> <em>Collaboration</em>
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
