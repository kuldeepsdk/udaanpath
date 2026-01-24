// /ui/components/job/poster/PosterRenderer.tsx

import PosterBackground from "./PosterBackground";
import { getJobAvatar } from "./utils/jobAvatar";

export default function PosterRenderer({ job }: { job: any }) {
     const avatarSrc = getJobAvatar(job);
  return (
    <PosterBackground>
      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="absolute inset-0 flex">

        {/* ================= LEFT CONTENT ================= */}
        <div
          className="
            flex-1
            pl-28 pr-20
            pt-68
            space-y-8
          "
        >
          {/* TITLE */}
          <h1 className="
          text-[46px]
          font-extrabold
          text-slate-900
          leading-tight
          max-w-[900px]
          relative
        ">
        
          <span className="text-indigo-700">
            {job.title.split(" ").slice(0, 4).join(" ")}
          </span>{" "}
          <span className="text-slate-900">
            {job.title.split(" ").slice(4).join(" ")}
          </span>
          {/* Accent underline */}
          <span
            className="
              absolute
              left-0
              -bottom-3
              w-32
              h-1.5
              bg-gradient-to-r
              from-indigo-600
              to-blue-400
              rounded-full
            "
          />
        </h1>

        {/* ================= META BLOCK ================= */}
        <div
          className="
            relative
            max-w-[780px]
            px-8
            py-6
            rounded-2xl
            bg-white/40
            backdrop-blur-[2px]
            space-y-4
          "
        >
          {/* LEFT ACCENT LINE */}
          <span
            className="
              absolute
              left-0
              top-6
              bottom-6
              w-1
              rounded-full
              bg-gradient-to-b
              from-indigo-600
              to-blue-400
            "
          />

          <div className="pl-4 space-y-3">
            <p className="text-[18px] text-slate-900">
              <span className="font-semibold text-slate-700">
                Vacancies:
              </span>{" "}
              {job.total_posts}
            </p>

            <p className="text-[18px] text-slate-900">
              <span className="font-semibold text-slate-700">
                Location:
              </span>{" "}
              {job.location || "Across India"}
            </p>

            <p className="text-[18px] text-slate-900">
              <span className="font-semibold text-slate-700">
                Salary:
              </span>{" "}
              <span className="font-semibold text-emerald-700">
                {job.salary}
              </span>
            </p>

            {job.last_date && (
              <p className="text-[18px] text-slate-900">
                <span className="font-semibold text-slate-700">
                  Last Date:
                </span>{" "}
                <span className="font-semibold text-rose-700">
                  {job.last_date}
                </span>
              </p>
            )}
          </div>
        </div>

         
         

        </div>

        {/* ================= RIGHT AVATAR (INTEGRATED STYLE) ================= */}
        <div
          className="
            w-[460px]
            h-full
            flex
            items-end
            justify-center
            pr-24
            pb-24
          "
        >
          <img
            src={avatarSrc}
            alt="Job Illustration"
            className="
              h-full
              w-auto
              object-contain
              drop-shadow-xl
            "
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "/illustrations/students.png";
            }}
          />
        </div>




      </div>

      {/* ================= QR CODE ================= */}
      <div
        style={{
          position: "absolute",
          bottom: "70px",
          right: "80px",
          width: "160px",
          height: "160px",
        }}
      >
        <img
          src="/images/udaanpath_whatsapp_qr_circle_mint.png"
          alt="UdaanPath QR"
          className="w-full h-full rounded-xl shadow-lg bg-white"
        />
      </div>
    </PosterBackground>
  );
}
