import Link from "next/link";

export const metadata = {
  title: "Free Exam Form Tools Online | Photo, Signature, Crop – UdaanPath",
  description:
    "Use free online tools for government exam forms: photo resize, signature resize, crop image, passport photo with name & date. Fast, safe & no upload.",
};
const toolsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Free Exam Form Tools by UdaanPath",
  "description":
    "Free online tools for government exam forms including photo resize, signature resize, crop image and passport photo tools.",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Photo Resize Tool",
      "url": "https://udaanpath.com/tools/photo-resize"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Signature Resize Tool",
      "url": "https://udaanpath.com/tools/signature-resize"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Image Crop Tool",
      "url": "https://udaanpath.com/tools/image-crop"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Passport Photo with Name & Date",
      "url": "https://udaanpath.com/tools/passport-photo"
    },
    {
      "@type": "ListItem",
      "position": 5,
      "name": "Photo & Signature Combo Tool",
      "url": "https://udaanpath.com/tools/photo-signature"
    }
  ]
};
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Are UdaanPath tools free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, all exam form tools on UdaanPath are 100% free to use."
      }
    },
    {
      "@type": "Question",
      "name": "Do you upload my photos or documents?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. All tools work locally in your browser. Files are never uploaded."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use these tools on mobile?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, all tools are fully mobile responsive and work on Android and iPhone."
      }
    },
    {
      "@type": "Question",
      "name": "Which exams are supported?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SSC, MP, Police, UPSC, Railway, Banking, Teaching and all government exams."
      }
    }
  ]
};

const TOOLS = [
  {
    title: "Photo Resize Tool",
    desc: "Resize photo to exact size & KB for SSC, MP, Police, UPSC forms.",
    href: "/tools/photo-resize",
  },
  {
    title: "Signature Resize Tool",
    desc: "Resize signature to required KB size for government exams.",
    href: "/tools/signature-resize",
  },
  {
    title: "Photo Crop Tool",
    desc: "Crop image online for exam forms. Mobile friendly & free.",
    href: "/tools/image-crop",
  },
  {
    title: "Passport Photo with Name & Date",
    desc: "Create passport size photo with name and date below for exam forms.",
    href: "/tools/passport-photo",
  },
  {
    title: "Photo + Signature Combo Tool",
    desc: "Resize photo and signature together in one click.",
    href: "/tools/photo-signature",
  },
];

export default function ToolsSEOPage() {
  
    return (
    
    <main className="max-w-6xl mx-auto px-4 py-8">
         <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* ================== HERO ================== */}
      <h1 className="text-3xl font-bold mb-2">
        Free Online Tools for Exam Forms
      </h1>
      <p className="text-gray-700 mb-6">
        UdaanPath provides free online tools for government exam applications.
        Resize photo, resize signature, crop images and create passport photos
        easily. No signup. No upload. Works on mobile.
      </p>

      {/* ================== TOOLS GRID ================== */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {TOOLS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="border rounded-xl p-5 hover:shadow transition bg-white"
          >
            <h2 className="text-lg font-semibold mb-1">{t.title}</h2>
            <p className="text-sm text-gray-600">{t.desc}</p>
            <span className="inline-block mt-3 text-blue-600 text-sm">
              Use Tool →
            </span>
          </Link>
        ))}
      </div>

      {/* ================== SEO CONTENT ================== */}
      <section className="mt-10 text-gray-700 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold mb-2">
          Why use UdaanPath exam tools?
        </h2>
        <p>
          Students applying for SSC, MP, Police, UPSC, Railway, Bank and other
          government exams often face issues with photo size, signature size and
          document format. UdaanPath tools solve this problem instantly without
          uploading files to any server.
        </p>

        <p className="mt-3">
          All tools are free, fast, mobile-friendly and privacy-safe. Your files
          never leave your device. Thousands of students use these tools every
          day for exam form submission.
        </p>
      </section>

      {/* ================== FAQ ================== */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Frequently Asked Questions</h2>

        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Q. Are these tools free?</strong>
            <br />
            Yes, all tools are 100% free to use.
          </p>

          <p>
            <strong>Q. Do you upload my photos?</strong>
            <br />
            No. All tools work locally in your browser. Your data is safe.
          </p>

          <p>
            <strong>Q. Can I use these tools on mobile?</strong>
            <br />
            Yes, all tools are mobile responsive and work on Android/iPhone.
          </p>

          <p>
            <strong>Q. Which exams are supported?</strong>
            <br />
            SSC, MP, Police, UPSC, Railway, Bank, Patwari, Teacher & all govt
            exams.
          </p>
        </div>
      </section>

      {/* ================== INTERNAL LINK BOOST ================== */}
      <div className="mt-12 p-5 bg-blue-50 rounded-xl">
        <h3 className="font-semibold mb-1">Tip for students</h3>
        <p className="text-sm text-gray-700">
          Always check photo & signature size before submitting exam form.
          Use UdaanPath tools to avoid rejection.
        </p>
      </div>
    </main>

    
  );
}
