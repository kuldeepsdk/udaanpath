export default function JobPosterJob({ job }: { job: any }) {
  return (
    <div className="h-[1350px] bg-gradient-to-br from-fuchsia-700 via-purple-700 to-indigo-700 text-white p-10 relative overflow-hidden">

      {/* Decorative Background Blobs */}
      <div className="absolute -top-40 -right-40 w-[520px] h-[520px] bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-52 left-1/3 w-[420px] h-[420px] bg-yellow-400/10 rounded-full blur-3xl" />

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-10 relative z-10">

        {/* Logo + Brand */}
        <div className="flex items-center gap-4">
          <img
            src="/images/udaanpath_logo_v1.png"
            alt="UdaanPath Logo"
            className="h-16 w-16 object-contain"
          />
          <h1 className="text-5xl font-extrabold tracking-wide">
            UdaanPath
          </h1>
        </div>

        {/* Category Badge */}
        <span className="bg-yellow-400 text-black px-6 py-2 rounded-full text-xl font-bold shadow-md">
          सरकारी नौकरी
        </span>
      </div>

      {/* ================= TITLE ================= */}
      <h2 className="text-[64px] font-extrabold leading-tight max-w-[85%] relative z-10">
        {job.title}
      </h2>
      <p className="mt-2 text-3xl opacity-90 relative z-10">
        {job.organization}
      </p>

      {/* ================= MIDDLE SECTION ================= */}
      <div className="grid grid-cols-2 gap-10 items-start mt-6 relative z-10">

        {/* LEFT COLUMN */}
        <div className="space-y-6">

          {/* Job Info */}
          <div className="bg-white text-black rounded-3xl p-8 space-y-5 shadow-2xl">
            {job.qualification && (
              <p className="text-3xl font-semibold">
                🎓 योग्यता: {job.qualification}
              </p>
            )}
            {job.total_posts && (
              <p className="text-3xl font-semibold">
                📌 कुल पद: {job.total_posts}
              </p>
            )}
            {job.age_limit && (
              <p className="text-3xl font-semibold">
                🎂 आयु सीमा: {job.age_limit}
              </p>
            )}
          </div>

          {/* Salary */}
          {job.salary && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl px-8 py-5 text-2xl font-bold shadow-lg">
              💰 वेतन: {job.salary}
            </div>
          )}

          {/* Important Dates */}
          {(job.start_date || job.last_date) && (
            <div className="bg-white text-black rounded-3xl p-6 shadow-xl space-y-3">
              <p className="text-2xl font-bold">📅 महत्वपूर्ण तिथियाँ</p>
              {job.start_date && (
                <p className="text-xl">🟢 आवेदन शुरू: {job.start_date}</p>
              )}
              {job.last_date && (
                <p className="text-xl">🔴 अंतिम तिथि: {job.last_date}</p>
              )}
            </div>
          )}

          {/* Selection Process */}
          {job.selection_process && (
            <div className="bg-white text-black rounded-3xl p-6 shadow-xl">
              <p className="text-2xl font-bold mb-2">
                📝 चयन प्रक्रिया
              </p>
              <p className="text-xl leading-relaxed">
                {job.selection_process}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN – Illustration */}
        <div className="relative h-full min-h-[920px]">

          {/* Floating Trust Chips */}
          <div className="absolute top-8 right-8 space-y-4 z-20">
            <div className="bg-white text-black px-6 py-3 rounded-full text-xl font-bold shadow-lg">
              🇮🇳 All India Job
            </div>
            <div className="bg-white text-black px-6 py-3 rounded-full text-xl font-bold shadow-lg">
              📄 Official Notification
            </div>
            <div className="bg-white text-black px-6 py-3 rounded-full text-xl font-bold shadow-lg">
              💯 Free Job Alerts
            </div>
          </div>

          <img
            src="/illustrations/students.png"
            alt="Students illustration"
            className="absolute inset-0 h-full w-full object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* ================= TRUST STRIP ================= */}
      <div className="absolute bottom-52 left-10 right-10 flex justify-center gap-12 text-xl font-semibold opacity-90">
        <span>✅ Official Updates</span>
        <span>🚫 No Fake Jobs</span>
        <span>📢 Daily Notifications</span>
      </div>

      {/* ================= BOTTOM SECTION ================= */}
      <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center">

        {/* QR Code */}
        <div className="rounded-2xl shadow-xl bg-white p-2">
          <img
            src="/qr/udaanpath-whatsapp.png"
            className="h-40 w-40"
            alt="Join WhatsApp"
          />
        </div>

        {/* CTA */}
        <div className="text-right">
          <p className="text-3xl font-bold">
            WhatsApp चैनल जॉइन करें
          </p>
          <p className="text-xl opacity-90">
            Daily Sarkari Job Updates
          </p>
          <p className="mt-2 text-yellow-300 text-2xl font-semibold">
            udaanpath.com
          </p>
        </div>
      </div>

    </div>
  );
}
