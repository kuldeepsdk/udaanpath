
import { getTitleStyle } from "@/ui/components/job/poster/templates/titlestyle";

export default function JobPosterJob({ job }: { job: any }) {
  const titleStyle = getTitleStyle(job.title || "");

  return (
    <div
  className="
    w-[1080px]
    min-h-[1350px]
    bg-gradient-to-br from-fuchsia-700 via-purple-700 to-indigo-700
    text-white relative overflow-hidden
    px-12 pt-10 pb-44
    flex flex-col
  "
>

      {/* DECORATION */}
      <div className="absolute -top-40 -right-40 w-[520px] h-[520px] bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-80 left-1/3 w-[420px] h-[420px] bg-yellow-400/10 rounded-full blur-3xl" />

      {/* HEADER */}
      <header className="flex justify-between items-center mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <img src="/images/udaanpath_logo_v1.png" className="h-16 w-16" />
          <h1 className="text-5xl font-extrabold">UdaanPath</h1>
        </div>

        <span className="bg-yellow-400 text-black px-6 py-2 rounded-full text-xl font-bold">
          सरकारी नौकरी
        </span>
      </header>

      {/* TITLE */}
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

        <p className="mt-2 text-2xl opacity-90 line-clamp-1">
          {job.organization}
        </p>
      </section>

      {/* MAIN GRID */}
      <section className="grid grid-cols-2 gap-10 flex-1 relative z-10">

        {/* LEFT */}
        <div className="flex flex-col justify-between">

          <div className="space-y-2">
            <div className="bg-white text-black rounded-3xl p-8 shadow-xl space-y-4">
              {job.qualification && (
                <p className="text-2xl font-semibold">
                  🎓 योग्यता: {job.qualification}
                </p>
              )}
              {job.total_posts && (
                <p className="text-2xl font-semibold">
                  📌 कुल पद: {job.total_posts}
                </p>
              )}
              {job.age_limit && (
                <p className="text-2xl font-semibold">
                  🎂 आयु सीमा: {job.age_limit}
                </p>
              )}
            </div>

            {job.salary && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl px-8 py-4 text-2xl font-bold">
                💰 वेतन: {job.salary}
              </div>
            )}
            {job.selection_process && (
            <div className="bg-white text-black rounded-3xl p-6 shadow relative">
              <p className="text-2xl font-bold mb-2">📝 चयन प्रक्रिया</p>
              <p className="text-xl leading-relaxed line-clamp-5">
                {job.selection_process}
              </p>
            </div>
          )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex items-center justify-center">
          <div className="absolute top-6 right-6 space-y-3 z-20">
            {["🇮🇳 All India Job", "📄 Official", "💯 Free Alerts"].map((t) => (
              <div
                key={t}
                className="bg-white text-black px-5 py-2 rounded-full text-lg font-bold shadow"
              >
                {t}
              </div>
            ))}
          </div>

          <img
            src="/illustrations/students.png"
            className="max-h-[720px] object-contain"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="absolute bottom-10 left-12 right-12 flex justify-between items-center">
        <div className="bg-white p-2 rounded-2xl shadow">
          <img src="/qr/udaanpath-whatsapp.png" className="h-40 w-40" />
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold">WhatsApp चैनल जॉइन करें</p>
          <p className="text-xl opacity-90">Daily Sarkari Job Updates</p>
          <p className="mt-2 text-yellow-300 text-2xl font-semibold">
            udaanpath.com
          </p>
        </div>
      </footer>
    </div>
  );
}
