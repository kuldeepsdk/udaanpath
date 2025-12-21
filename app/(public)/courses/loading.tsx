export default function LoadingCourses() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-56 rounded-2xl bg-slate-200 animate-pulse"
        />
      ))}
    </div>
  );
}
