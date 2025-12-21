import { fetchAdminBlogs } from "@/app/actions/admin/blogs.action";
import BlogStatusToggle from "@/ui/components/admin/BlogStatusToggle";
import DeleteBlogButton from "@/ui/components/admin/DeleteBlogButton";
import AdminPagination from "@/ui/components/admin/AdminPagination";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // ✅ Next.js 16: searchParams is async
  const resolvedSearchParams = await searchParams;

  const rawPage = Array.isArray(resolvedSearchParams.page)
    ? resolvedSearchParams.page[0]
    : resolvedSearchParams.page;

  const page = Number(rawPage) > 0 ? Number(rawPage) : 1;

  // 🔹 Server Action → Internal API
  const response = await fetchAdminBlogs({
    page,
    limit: 10,
  });

  const blogs = response?.data ?? [];
  const meta = response?.meta;

  return (
    <div className="space-y-8">
      {/* ================= Header ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Blogs
          </h1>
          <p className="text-sm text-slate-500">
            Manage blog articles
          </p>
        </div>

        <a
          href="/secure-console/blogs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          + New Blog
        </a>
      </div>

      {/* ================= Table ================= */}
      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {blogs.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  No blogs found
                </td>
              </tr>
            )}

            {blogs.map((blog: any) => (
              <tr key={blog.id} className="border-b last:border-0">
                {/* Title */}
                <td className="px-4 py-3 font-medium text-slate-800">
                  {blog.title}
                </td>

                {/* Publish / Draft toggle */}
                <td className="px-4 py-3">
                  <BlogStatusToggle
                    blogId={blog.id}
                    published={blog.published}
                  />
                </td>

                {/* Created date */}
                <td className="px-4 py-3 text-slate-500">
                  {blog.created_at
                    ? new Date(blog.created_at).toLocaleDateString()
                    : "-"}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right space-x-3">
                  <a
                    href={`/secure-console/blogs/${blog.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </a>

                  <DeleteBlogButton blogId={blog.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= Pagination ================= */}
      {meta?.totalPages > 1 && (
        <AdminPagination
          page={page}
          totalPages={meta.totalPages}
        />
      )}
    </div>
  );
}
