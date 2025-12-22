export default function JobPosterAdmit({ job }: { job: any }) {
  return (
    <div className="w-[1080px] h-[1350px] bg-gradient-to-br from-indigo-800 via-blue-700 to-cyan-600 text-white p-10 relative overflow-hidden">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-5xl font-extrabold tracking-wide">
          UdaanPath
        </h1>
        <span className="bg-yellow-300 text-black px-6 py-2 rounded-full text-xl font-bold">
          Admit Card
        </span>
      </div>

      {/* ================= TITLE ================= */}
      <h2 className="text-[64px] font-extrabold leading-tight max-w-[85%]">
        {job.title}
      </h2>

      <p className="mt-2 text-3xl opacity-90">
        प्रवेश पत्र जारी
      </p>

      {/* ================= MIDDLE SECTION ================= */}
      <div className="mt-10 grid grid-cols-2 gap-8 items-center">

        {/* LEFT – ADMIT INFO */}
        <div className="bg-white text-black rounded-3xl p-8 space-y-5 shadow-2xl">
          <p className="text-3xl font-semibold">
            📝 Admit Card Available
          </p>

          <p className="text-2xl">
            👉 Exam Date, Center & Instructions देखें
          </p>

          {job.organization && (
            <p className="text-2xl opacity-80">
              संस्था: {job.organization}
            </p>
          )}

          <p className="text-xl text-slate-600">
            Official website से डाउनलोड करें
          </p>
        </div>

        {/* RIGHT – HERO Illustration */}
        <div className="flex justify-center">
          <img
            src="/illustrations/exam.png"
            className="h-[420px] drop-shadow-2xl"
            alt="Admit Card Illustration"
          />
        </div>
      </div>

      {/* ================= BOTTOM SECTION ================= */}
      <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center">

        {/* QR BLOCK */}
        <div className="bg-white p-4 rounded-2xl shadow-xl">
          <img
            src="/qr/udaanpath-whatsapp.png"
            className="h-40 w-40"
            alt="Join WhatsApp Channel"
          />
          <p className="mt-2 text-black text-center text-lg font-semibold">
            Scan to Join
          </p>
        </div>

        {/* CTA */}
        <div className="text-right">
          <p className="text-3xl font-bold">
            Admit Card Updates WhatsApp पर
          </p>
          <p className="text-xl opacity-90">
            Exam Date • Center • Instructions
          </p>
          <p className="mt-2 text-yellow-200 text-2xl font-semibold">
            udaanpath.com
          </p>
        </div>
      </div>
    </div>
  );
}
