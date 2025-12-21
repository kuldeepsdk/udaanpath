import Link from "next/link";

function getImageSrc(base64?: string) {
  if (!base64) return null;
  if (base64.startsWith("data:image")) return base64;
  return `data:image/png;base64,${base64}`;
}

export default function CategoryCard({ category }: { category: any }) {
  const imageSrc = getImageSrc(category.thumbnail_base64);

  return (
    <Link
      href={`/courses/category/${category.slug}`}
      className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400 text-sm">
            No Image
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition">
          {category.name}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Explore courses & chapters
        </p>
      </div>
    </Link>
  );
}
