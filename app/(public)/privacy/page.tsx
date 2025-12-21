// app/(public)/privacy/page.tsx

export const metadata = {
  title: "Privacy Policy | UdaanPath",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-8">

        {/* Header */}
        <div className="bg-white border rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              🔒 Privacy Policy <span className="text-slate-400">|</span> गोपनीयता नीति
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, use, and protect your data when you use UdaanPath.
              <br />
              <span className="text-slate-500">
                आपकी गोपनीयता हमारे लिए महत्वपूर्ण है। यह नीति बताती है कि UdaanPath इस्तेमाल करते समय आपकी जानकारी कैसे एकत्रित, उपयोग और सुरक्षित की जाती है।
              </span>
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                Transparent
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                Secure
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-700 border">
                User-first
              </span>
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MiniCard
            title="What we collect"
            subtitle="हम क्या एकत्र करते हैं"
            points={[
              "Name & email (only if you contact/subscribe)",
              "Usage analytics (pages, device, time)",
              "Poll / blog interactions",
            ]}
          />
          <MiniCard
            title="Why we collect"
            subtitle="क्यों एकत्र करते हैं"
            points={[
              "Improve accuracy & experience",
              "Send updates if subscribed",
              "Understand demand & trends",
            ]}
          />
          <MiniCard
            title="Your control"
            subtitle="आपका नियंत्रण"
            points={[
              "Request access/deletion",
              "Unsubscribe anytime",
              "Contact us for help",
            ]}
          />
        </div>

        {/* Sections */}
        <Section title="📥 Information We Collect | हम क्या जानकारी एकत्र करते हैं">
          <p className="text-slate-600 leading-relaxed">
            We may collect the following information to provide better content and a smoother experience.
            <br />
            <span className="text-slate-500">
              बेहतर कंटेंट और अनुभव देने के लिए हम नीचे दी गई जानकारी एकत्र कर सकते हैं।
            </span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
            <InfoBox
              title="Personal Information"
              subtitle="व्यक्तिगत जानकारी"
              items={[
                "Name, email (only when you subscribe or contact us)",
                "Optional details you voluntarily share in messages/forms",
              ]}
            />
            <InfoBox
              title="Usage & Interaction Data"
              subtitle="उपयोग/इंटरेक्शन डेटा"
              items={[
                "Pages visited, time spent, device/browser type",
                "Poll votes and blog interaction logs",
              ]}
            />
          </div>

          <div className="mt-4 rounded-2xl border bg-amber-50/60 p-4">
            <div className="text-sm font-semibold text-amber-900">
              We do NOT ask for sensitive financial identity data
            </div>
            <div className="text-sm text-amber-800 mt-1">
              We don’t collect Aadhaar, PAN, bank account details, or card information.
              <span className="block text-amber-700">
                हम आधार, पैन, बैंक अकाउंट या कार्ड जैसी संवेदनशील जानकारी नहीं मांगते/संग्रहित करते।
              </span>
            </div>
          </div>
        </Section>

        <Section title="🔐 How We Use Your Information | हम आपकी जानकारी का उपयोग कैसे करते हैं">
          <p className="text-slate-600 leading-relaxed">
            We use collected data only for legitimate purposes that help improve the platform.
            <br />
            <span className="text-slate-500">
              हम आपकी जानकारी का उपयोग केवल UdaanPath को बेहतर बनाने और सही अपडेट देने के लिए करते हैं।
            </span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
            <InfoBox
              title="Improve Content & Experience"
              subtitle="कंटेंट और अनुभव बेहतर"
              items={[
                "Improve performance and page speed",
                "Fix inaccuracies based on feedback",
                "Enhance UI/UX using analytics trends",
              ]}
            />
            <InfoBox
              title="Communication"
              subtitle="संचार"
              items={[
                "Reply to your queries/corrections",
                "Send updates only if you subscribe",
                "Provide important notifications where applicable",
              ]}
            />
          </div>
        </Section>

        <Section title="👥 Third-Party Services | तृतीय पक्ष सेवाएं">
          <p className="text-slate-600 leading-relaxed">
            We may use third-party services such as analytics, advertising, and social sharing tools to run and improve the website.
            These services may collect data according to their own privacy policies.
            <br />
            <span className="text-slate-500">
              हम Google Analytics, AdSense और सोशल शेयरिंग टूल्स जैसी सेवाएँ उपयोग कर सकते हैं। ये सेवाएँ अपनी नीतियों के अनुसार डेटा एकत्र कर सकती हैं।
            </span>
          </p>

          <ul className="list-disc pl-5 mt-3 space-y-1 text-sm text-slate-600">
            <li>Google Analytics (traffic & usage understanding)</li>
            <li>Google AdSense (ads personalization & measurement)</li>
            <li>Social sharing tools (WhatsApp share, etc.)</li>
          </ul>

          <div className="mt-4 rounded-2xl border bg-slate-50 p-4">
            <p className="text-sm text-slate-600">
              Note: UdaanPath does not control how third-party services use your data. Please review their policies for details.
              <span className="block text-slate-500">
                नोट: तृतीय-पक्ष सेवाओं के डेटा उपयोग पर हमारा नियंत्रण नहीं होता। उनकी नीतियाँ देखना बेहतर है।
              </span>
            </p>
          </div>
        </Section>

        <Section title="🔗 External Links Disclaimer | बाहरी लिंक अस्वीकरण">
          <p className="text-slate-600 leading-relaxed">
            UdaanPath often links to official portals (government/organizations) for verification and the most accurate information.
            We do not control external websites and are not responsible for their content or privacy practices.
            <br />
            <span className="text-slate-500">
              UdaanPath सत्यापन के लिए आधिकारिक पोर्टल्स (सरकारी/संस्थागत) के लिंक देता है। बाहरी वेबसाइट्स की सामग्री/गोपनीयता नीति के लिए हम जिम्मेदार नहीं हैं।
            </span>
          </p>
        </Section>

        <Section title="✅ Your Rights | आपके अधिकार">
          <p className="text-slate-600 leading-relaxed">
            You have full control over your personal information.
            <br />
            <span className="text-slate-500">
              आपकी जानकारी पर आपका पूरा अधिकार है।
            </span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
            <InfoBox
              title="Access / Deletion Requests"
              subtitle="एक्सेस / डिलीट अनुरोध"
              items={[
                "Request access to what we have (if any)",
                "Request deletion of your submitted data",
              ]}
            />
            <InfoBox
              title="Unsubscribe Anytime"
              subtitle="कभी भी अनसब्सक्राइब"
              items={[
                "Stop email updates anytime (if subscribed)",
                "You can reach out for assistance",
              ]}
            />
          </div>
        </Section>

        <Section title="📅 Policy Updates | नीति में बदलाव">
          <p className="text-slate-600 leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in services, technology, or legal requirements.
            Any updates will be published on this page along with an updated date.
            <br />
            <span className="text-slate-500">
              हम समय-समय पर सेवाओं/कानूनी आवश्यकताओं के अनुसार इस नीति को अपडेट कर सकते हैं। बदलाव इस पेज पर तारीख सहित प्रकाशित किया जाएगा।
            </span>
          </p>

          <div className="mt-3 rounded-2xl border bg-white p-4 text-sm text-slate-600">
            <div className="font-semibold text-slate-800">Last updated</div>
            <div className="text-slate-500">
              {/* You can replace with a real date string if you want */}
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </Section>

        <Section title="📬 Contact Us | संपर्क करें">
          <p className="text-slate-600 leading-relaxed">
            If you have any questions about this policy, feel free to contact us.
            <br />
            <span className="text-slate-500">
              यदि आपको इस नीति को लेकर कोई सवाल है, तो बेझिझक हमसे संपर्क करें।
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Contact Page खोलें
            </a>
            <a
              href="/jobs"
              className="inline-flex items-center justify-center rounded-xl border bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Latest Updates देखें
            </a>
          </div>
        </Section>

      </div>
    </div>
  );
}

/* ---------------------------
   UI helpers
---------------------------- */

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

function MiniCard({
  title,
  subtitle,
  points,
}: {
  title: string;
  subtitle: string;
  points: string[];
}) {
  return (
    <div className="bg-white border rounded-3xl p-6 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>
      <ul className="mt-3 space-y-1 text-sm text-slate-600">
        {points.map((p, idx) => (
          <li key={`${title}-${idx}`} className="flex gap-2">
            <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-slate-300" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
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
