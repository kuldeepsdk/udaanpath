export default function JobPosterResult({ job }: { job: any }) {
  const titleStyle = getTitleStyle(job.title || "");

  return (
    <div
      className="
        w-[1080px]
        min-h-[1350px]
        bg-gradient-to-br from-emerald-700 via-green-600 to-teal-600
        text-white relative overflow-hidden
        px-12 pt-10 pb-44
        flex flex-col
      "
    >
      {/* ================= HEADER ================= */}
      <header className="flex justify-between items-center mb-8 relative z-10">
        <h1 className="text-5xl font-extrabold tracking-wide">
          UdaanPath
        </h1>

        <span className="bg-yellow-300 text-black px-6 py-2 rounded-full text-xl font-bold shadow">
          Result Out
        </span>
      </header>

      {/* ================= TITLE ================= */}
      <section className="max-w-[820px] mb-6 relative z-10">
        <h2
          className={`font-extrabold ${titleStyle.clamp}`}
          style={{
            fontSize: titleStyle.fontSize,
            lineHeight: titleStyle.lineHeight,
          }}
        >
          {job.title}
        </h2>

        <p className="mt-3 text-3xl opacity-90">
          परीक्षा परिणाम जारी
        </p>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <section className="grid grid-cols-2 gap-10 flex-1 relative z-10 items-center">

        {/* LEFT – RESULT INFO */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="bg-white text-black rounded-3xl p-8 shadow-xl space-y-4">
            <p className="text-3xl font-semibold">
              🎉 Result Available Now
            </p>

            <p className="text-2xl">
              👉 Roll Number / Registration Number से देखें
            </p>

            {job.organization && (
              <p className="text-2xl opacity-80">
                संस्था: {job.organization}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT – ILLUSTRATION */}
        <div className="flex justify-center relative">
          <img
            src="/illustrations/result.png"
            className="max-h-[520px] object-contain drop-shadow-2xl"
            alt="Result Illustration"
          />
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="absolute bottom-10 left-12 right-12 flex justify-between items-center">
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

        <div className="text-right">
          <p className="text-3xl font-bold">
            Result Updates WhatsApp पर
          </p>
          <p className="text-xl opacity-90">
            Daily Sarkari Results & Merit List
          </p>
          <p className="mt-2 text-yellow-200 text-2xl font-semibold">
            udaanpath.com
          </p>
        </div>
      </footer>
    </div>
  );
}
