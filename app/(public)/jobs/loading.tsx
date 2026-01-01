export default function JobsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-pulse">

      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-slate-200 rounded" />
        <div className="h-4 w-80 bg-slate-200 rounded" />
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border bg-white p-4 space-y-3"
          >
            <div className="h-9 w-9 bg-slate-200 rounded-xl" />
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-3 w-full bg-slate-200 rounded" />
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white border rounded-2xl p-4 space-y-3">
        <div className="h-10 bg-slate-200 rounded-xl" />
        <div className="h-10 bg-slate-200 rounded-xl" />
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border rounded-2xl overflow-hidden"
          >
            <div className="h-40 bg-slate-200" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-full bg-slate-200 rounded" />
              <div className="h-3 w-2/3 bg-slate-200 rounded" />
              <div className="h-3 w-full bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
