export default function AdminPagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-end gap-2 pt-4">
      {Array.from({ length: totalPages }).map((_, i) => {
        const p = i + 1;
        return (
          <a
            key={p}
            href={`/secure-console/blogs?page=${p}`}
            className={`px-3 py-1 rounded text-sm ${
              p === page
                ? "bg-blue-600 text-white"
                : "bg-white border hover:bg-slate-50"
            }`}
          >
            {p}
          </a>
        );
      })}
    </div>
  );
}
