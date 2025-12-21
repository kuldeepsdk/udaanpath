export default function LoadingCategoryCourses() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-72 rounded-2xl bg-slate-200 animate-pulse"
        />
      ))}
    </div>
  );
}
