import Link from "next/link";

export const metadata = {
  title: "Free Exam & Resume Tools Online | Photo, Signature, Resume – UdaanPath",
  description:
    "Use free online tools by UdaanPath: resume builder, photo resize, signature resize, image crop & passport photo for government exam forms. Fast, safe & mobile friendly.",
};

const toolsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Free Exam & Resume Tools by UdaanPath",
  "description":
    "Free online tools for students including resume builder, photo resize, signature resize, image crop and passport photo tools for government exams.",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Resume Builder",
      "url": "https://udaanpath.com/tools/resume-builder",
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Photo Resize Tool",
      "url": "https://udaanpath.com/tools/photo-resize",
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Signature Resize Tool",
      "url": "https://udaanpath.com/tools/signature-resize",
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Image Crop Tool",
      "url": "https://udaanpath.com/tools/image-crop",
    },
    {
      "@type": "ListItem",
      "position": 5,
      "name": "Passport Photo with Name & Date",
      "url": "https://udaanpath.com/tools/passport-photo",
    },
    {
      "@type": "ListItem",
      "position": 6,
      "name": "Photo & Signature Combo Tool",
      "url": "https://udaanpath.com/tools/photo-signature",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is the resume builder free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Yes, UdaanPath resume builder is free to use. You can edit resumes online and download them easily.",
      },
    },
    {
      "@type": "Question",
      "name": "Are UdaanPath tools free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, all tools on UdaanPath are 100% free to use.",
      },
    },
    {
      "@type": "Question",
      "name": "Do you upload my photos or resumes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "No. All tools work locally in your browser. Your data and files are never uploaded.",
      },
    },
    {
      "@type": "Question",
      "name": "Can I use these tools on mobile?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Yes, all tools are fully mobile responsive and work on Android and iPhone.",
      },
    },
  ],
};

const TOOLS = [
  {
    title: "Resume Builder",
    desc: "Create professional resumes online. Edit directly on template and download PDF.",
    href: "/tools/resume-builder",
  },
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
        Free Online Tools for Students & Exam Forms
      </h1>
      <p className="text-gray-700 mb-6">
        UdaanPath provides free online tools for students and government exam
        applicants. Create resumes, resize photos, resize signatures, crop
        images and generate passport photos easily. No signup. No upload. Works
        on mobile.
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
          Why use UdaanPath tools?
        </h2>
        <p>
          UdaanPath tools help students save time while applying for exams or
          preparing documents. From resume creation to photo and signature size
          correction, everything works instantly without uploading files.
        </p>

        <p className="mt-3">
          All tools are free, fast, privacy-safe and designed especially for
          Indian students and government exam aspirants.
        </p>
      </section>

      {/* ================== INTERNAL LINK BOOST ================== */}
      <div className="mt-12 p-5 bg-blue-50 rounded-xl">
        <h3 className="font-semibold mb-1">Student Tip</h3>
        <p className="text-sm text-gray-700">
          Keep your resume, photo and signature ready before applying for any
          exam or job. UdaanPath tools help you prepare everything correctly.
        </p>
      </div>
    </main>
  );
}
