export default function ExamPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      {/* TOP BAR */}
      <header className="h-14 border-b bg-white flex items-center px-6">
        <div className="text-sm font-semibold text-slate-700">
          UdaanPath Examination Portal
        </div>

        <div className="ml-auto text-xs text-slate-500">
          Secure Exam Environment
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex justify-center px-4 py-10">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="text-center text-xs text-slate-400 py-6">
        © {new Date().getFullYear()} UdaanPath · All rights reserved
      </footer>
    </div>
  );
}
