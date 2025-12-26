import Navbar from "@/ui/components/Navbar";
import Footer from "@/ui/components/Footer";
import {
  ShieldCheck,
  Timer,
  BarChart3,
  Users,
  BookOpen,
  Lock,
  GraduationCap,
  FileText,
  AlertTriangle,
} from "lucide-react";

export default function UEASLandingPage() {
  return (
    <>
      <Navbar />

      <main className="bg-slate-50 overflow-hidden">

        {/* ================= HERO ================= */}
        <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
          <div className="mx-auto max-w-7xl px-4 py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              UEAS – Secure Online Examination System
            </h1>

            <p className="mt-6 max-w-3xl mx-auto text-lg text-blue-100">
              Conduct exams digitally with confidence.  
              Anti-cheating, auto-evaluation, instant results and detailed reports —
              built specially for Indian schools, colleges and coaching institutes.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="/ueas/org/register"
                className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 shadow hover:scale-[1.03] transition"
              >
                Register Your Institute
              </a>

              <a
                href="/"
                className="rounded-xl border border-white/60 px-8 py-4 font-semibold hover:bg-white/10 transition"
              >
                Explore UdaanPath
              </a>
            </div>
          </div>
        </section>

        {/* ================= TRUST STRIP ================= */}
        <section className="bg-white border-b">
          <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm font-medium text-slate-600">
            <Trust icon={ShieldCheck} text="Anti-Cheating Enabled" />
            <Trust icon={Timer} text="Auto Timed Exams" />
            <Trust icon={BarChart3} text="Instant Results & Rank" />
            <Trust icon={Lock} text="Server-Side Secure" />
          </div>
        </section>

        {/* ================= WHAT IS UEAS ================= */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              What is UEAS?
            </h2>

            <p className="mt-6 max-w-4xl mx-auto text-slate-600 leading-relaxed">
              UEAS (UdaanPath Examination & Assessment System) is a modern online
              exam platform that helps educational institutions conduct secure
              exams, automatically evaluate MCQ papers, calculate ranks and
              generate detailed performance reports — all from one dashboard.
            </p>
          </div>
        </section>

        {/* ================= WHO CAN USE ================= */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-3xl font-bold text-center text-slate-900">
              Who Can Use UEAS?
            </h2>

            <div className="mt-14 grid md:grid-cols-4 gap-8">
              <Audience icon={GraduationCap} title="Schools">
                Conduct class tests, unit tests and term exams online.
              </Audience>
              <Audience icon={Users} title="Colleges">
                Semester exams, internal assessments and mock tests.
              </Audience>
              <Audience icon={BookOpen} title="Coaching Institutes">
                Practice tests, mock exams and ranking based analysis.
              </Audience>
              <Audience icon={FileText} title="Training Centers">
                Skill assessments and certification exams.
              </Audience>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-3xl font-bold text-center text-slate-900">
              Powerful Features Designed for Real Exams
            </h2>

            <div className="mt-16 grid md:grid-cols-3 gap-10">
              <Feature icon={BookOpen} title="Question & Paper Management">
                Create MCQ question banks, build papers and reuse them anytime.
              </Feature>
              <Feature icon={Users} title="Batch & Student Management">
                Manage students batch-wise with roll numbers and secure login.
              </Feature>
              <Feature icon={Timer} title="Timed & Controlled Exams">
                Auto start, auto submit and server-side enforced timers.
              </Feature>
              <Feature icon={ShieldCheck} title="Anti-Cheating System">
                Tab switch, fullscreen exit & refresh tracking with auto-DQ.
              </Feature>
              <Feature icon={BarChart3} title="Auto Evaluation & Rank">
                Instant checking, negative marking and rank calculation.
              </Feature>
              <Feature icon={Lock} title="Secure by Architecture">
                Token-based auth, server-side rules and tamper-proof logic.
              </Feature>
            </div>
          </div>
        </section>

        {/* ================= SECURITY ================= */}
        <section className="bg-slate-100 py-20">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Exam Integrity & Anti-Cheating
            </h2>

            <p className="mt-6 text-slate-600">
              UEAS enforces exam rules strictly on the server — students cannot
              bypass them using browser tricks.
            </p>

            <div className="mt-10 max-w-xl mx-auto text-left space-y-3 text-slate-700">
              <SecurityPoint text="Tab switching & app switching detection" />
              <SecurityPoint text="Fullscreen exit tracking" />
              <SecurityPoint text="Refresh & reconnect monitoring" />
              <SecurityPoint text="Auto disqualification on rule violation" />
            </div>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="py-24 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Ready to Conduct Secure Online Exams?
          </h2>

          <p className="mt-4 text-slate-600">
            Join institutes across India using UEAS for fair and transparent exams.
          </p>

          <a
            href="/ueas/org/register"
            className="inline-block mt-10 rounded-xl bg-blue-600 px-10 py-4 font-semibold text-white hover:bg-blue-700 transition"
          >
            Get Started with UEAS
          </a>
        </section>

      </main>

      <Footer />
    </>
  );
}

/* ================= Helper Components ================= */

function Feature({ icon: Icon, title, children }: any) {
  return (
    <div className="rounded-2xl border bg-white p-8 shadow-sm hover:shadow-md transition">
      <Icon className="h-10 w-10 text-blue-600" />
      <h3 className="mt-6 text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm text-slate-600">{children}</p>
    </div>
  );
}

function Audience({ icon: Icon, title, children }: any) {
  return (
    <div className="rounded-xl border bg-white p-6 text-center shadow-sm">
      <Icon className="mx-auto h-10 w-10 text-indigo-600" />
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{children}</p>
    </div>
  );
}

function Trust({ icon: Icon, text }: any) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Icon className="h-6 w-6 text-blue-600" />
      <span>{text}</span>
    </div>
  );
}

function SecurityPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <AlertTriangle className="h-5 w-5 text-red-500" />
      <span>{text}</span>
    </div>
  );
}
