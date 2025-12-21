export const metadata = {
  title: "Terms of Service | UdaanPath",
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
            By accessing or using UdaanPath, you agree to comply with the following Terms of Service.
            <br />
            <span className="text-slate-500">
              UdaanPath का उपयोग करके, आप नीचे दी गई सेवा शर्तों से सहमत होते हैं।
            </span>
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              Transparent
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              User Responsibility
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-700 border">
              Fair Usage
            </span>
          </div>
        </div>

        {/* ================= Intro ================= */}
        <Section title="📌 Acceptance of Terms | शर्तों की स्वीकृति">
          <p>
            These Terms govern your access to and use of UdaanPath, including all content, features,
            tools, and services provided on the platform.
          </p>
          <p className="text-slate-500">
            ये शर्तें UdaanPath पर उपलब्ध सभी कंटेंट, फीचर्स, टूल्स और सेवाओं के उपयोग को नियंत्रित करती हैं।
          </p>
          <div className="mt-3 rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">
            If you do not agree with any part of these terms, please discontinue using the website.
            <span className="block text-slate-500">
              यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया वेबसाइट का उपयोग न करें।
            </span>
          </div>
        </Section>

        {/* ================= Content Usage ================= */}
        <Section title="1️⃣ Use of Content | सामग्री का उपयोग">
          <p>
            All content on UdaanPath (articles, job updates, tools, graphics, and layouts)
            is provided strictly for educational and informational purposes.
          </p>
          <p className="text-slate-500">
            UdaanPath पर उपलब्ध सभी सामग्री केवल शैक्षणिक और जानकारी देने के उद्देश्य से है।
          </p>

          <ul className="list-disc pl-5 mt-3 space-y-1">
            <li>No unauthorized copying, scraping, or redistribution</li>
            <li>No commercial reuse without written permission</li>
            <li>Branding, logos, and layouts are protected assets</li>
          </ul>

          <p className="mt-3 text-slate-500">
            बिना अनुमति कंटेंट की नकल, पुनः वितरण या व्यावसायिक उपयोग प्रतिबंधित है।
          </p>
        </Section>

        {/* ================= User Responsibility ================= */}
        <Section title="2️⃣ User Responsibilities | उपयोगकर्ता की जिम्मेदारी">
          <p>
            Users are expected to use UdaanPath responsibly and lawfully.
          </p>
          <p className="text-slate-500">
            उपयोगकर्ताओं से अपेक्षा की जाती है कि वे UdaanPath का उपयोग जिम्मेदारी से करें।
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <InfoBox
              title="You must NOT"
              subtitle="आपको यह नहीं करना चाहिए"
              items={[
                "Post abusive, misleading, or illegal content",
                "Spread misinformation or fake updates",
                "Attempt to hack, overload, or misuse the platform",
              ]}
            />
            <InfoBox
              title="You are responsible for"
              subtitle="आप जिम्मेदार हैं"
              items={[
                "Verifying official details from linked sources",
                "Your actions performed using shared links",
                "Compliance with local laws and regulations",
              ]}
            />
          </div>
        </Section>

        {/* ================= Accuracy ================= */}
        <Section title="3️⃣ Accuracy of Information | जानकारी की शुद्धता">
          <p>
            While we strive to keep information accurate and up to date, UdaanPath does not guarantee
            100% accuracy for all job, exam, or result updates.
          </p>
          <p className="text-slate-500">
            हम जानकारी को अपडेट रखने का प्रयास करते हैं, लेकिन 100% शुद्धता की गारंटी नहीं देते।
          </p>

          <div className="mt-3 rounded-2xl border bg-amber-50/60 p-4">
            <p className="text-sm text-amber-900 font-semibold">
              Important Disclaimer
            </p>
            <p className="text-sm text-amber-800 mt-1">
              Always verify critical details from official government websites before applying or
              making decisions.
              <span className="block text-amber-700">
                आवेदन या निर्णय से पहले आधिकारिक वेबसाइट से जानकारी अवश्य जांचें।
              </span>
            </p>
          </div>
        </Section>

        {/* ================= Third Party ================= */}
        <Section title="4️⃣ Third-Party Links | तृतीय-पक्ष लिंक">
          <p>
            UdaanPath may contain links to external or official websites for user convenience.
          </p>
          <p className="text-slate-500">
            UdaanPath उपयोगकर्ता सुविधा के लिए बाहरी या आधिकारिक वेबसाइटों के लिंक दे सकता है।
          </p>

          <ul className="list-disc pl-5 mt-3 space-y-1">
            <li>We do not control third-party content or policies</li>
            <li>We are not responsible for external website actions</li>
          </ul>

          <p className="mt-3 text-slate-500">
            बाहरी वेबसाइटों की सामग्री, नीतियों या गतिविधियों के लिए UdaanPath जिम्मेदार नहीं है।
          </p>
        </Section>

        {/* ================= Termination ================= */}
        <Section title="5️⃣ Termination of Access | सेवा समाप्ति">
          <p>
            We reserve the right to suspend or terminate access to UdaanPath if a user violates
            these terms or engages in harmful activity.
          </p>
          <p className="text-slate-500">
            यदि कोई उपयोगकर्ता इन शर्तों का उल्लंघन करता है, तो हम उसकी पहुँच सीमित या समाप्त कर सकते हैं।
          </p>
        </Section>

        {/* ================= Updates ================= */}
        <Section title="6️⃣ Changes to Terms | शर्तों में परिवर्तन">
          <p>
            UdaanPath may update these Terms of Service periodically to reflect changes in services,
            laws, or platform policies.
          </p>
          <p className="text-slate-500">
            हम समय-समय पर सेवा शर्तों को अपडेट कर सकते हैं।
          </p>

          <div className="mt-3 rounded-2xl border bg-white p-4 text-sm text-slate-600">
            Continued use of the website after changes means you accept the updated terms.
            <span className="block text-slate-500">
              बदलाव के बाद वेबसाइट का उपयोग आपकी सहमति माना जाएगा।
            </span>
          </div>
        </Section>

        {/* ================= Contact ================= */}
        <Section title="7️⃣ Contact Us | संपर्क करें">
          <p>
            If you have any questions regarding these Terms of Service, please reach out to us.
          </p>
          <p className="text-slate-500">
            यदि आपको इन शर्तों को लेकर कोई प्रश्न है, तो हमसे संपर्क करें।
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Contact Us
            </a>
            <a
              href="/privacy"
              className="inline-flex items-center justify-center rounded-xl border bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Privacy Policy
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
