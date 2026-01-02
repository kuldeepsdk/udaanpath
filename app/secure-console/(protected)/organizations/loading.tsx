export default function LoadingOrganizations() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-slate-200 rounded" />

      <div className="bg-white border rounded-xl p-4 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-10 bg-slate-200 rounded"
          />
        ))}
      </div>
    </div>
  );
}
