export default function CategoryHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          {title}
        </h1>
        {subtitle ? (
          <p className="max-w-2xl text-slate-600 text-lg">
            {subtitle}
          </p>
        ) : (
          <p className="max-w-2xl text-slate-600 text-lg">
            Explore structured courses with chapters and practice.
          </p>
        )}
      </div>
    </div>
  );
}
