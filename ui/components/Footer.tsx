import { SITE_CONFIG } from "@/config/site";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/70">
      <div className="mx-auto max-w-6xl px-4 py-8">

        {/* ================= Top ================= */}
        <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between">

          <div className="text-xs sm:text-sm text-slate-500">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-slate-700">
              {SITE_CONFIG.name}
            </span>
            . All rights reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
            <a href="/about" className="text-slate-500 hover:text-blue-600">
              About Us
            </a>
            <span className="text-slate-300">•</span>

            <a href="/privacy" className="text-slate-500 hover:text-blue-600">
              Privacy Policy
            </a>
            <span className="text-slate-300">•</span>

            <a href="/terms" className="text-slate-500 hover:text-blue-600">
              Terms
            </a>
            <span className="text-slate-300">•</span>

            <a href="/disclaimer" className="text-slate-500 hover:text-blue-600">
              Disclaimer
            </a>
            <span className="text-slate-300">•</span>

            <a href="/contact" className="text-slate-500 hover:text-blue-600">
              Contact
            </a>
            <span className="text-slate-300">•</span>

            <a href="/tools" className="text-slate-500 hover:text-blue-600">
              Free Tools
            </a>
            <span className="text-slate-300">•</span>

            <a href="/sitemap.xml" className="text-slate-500 hover:text-blue-600">
              Sitemap
            </a>
          </div>
        </div>

        {/* ================= Trust Line ================= */}
        <div className="mt-6 text-center text-[11px] text-slate-400 leading-relaxed">
          UdaanPath is an independent informational platform. We are not affiliated with any
          government organization. All information is provided for educational purposes only.
        </div>

        {/* ================= Tagline ================= */}
        <div className="mt-2 text-center text-[11px] text-slate-400">
          {SITE_CONFIG.tagline} 🇮🇳
        </div>
      </div>
    </footer>
  );
};

export default Footer;
