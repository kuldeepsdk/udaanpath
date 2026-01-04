import Link from "next/link";
import OrgActions from "./OrgActions";

function StatusBadge({ status }: { status: number }) {
  if (status === 1) {
    return (
      <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
        Approved
      </span>
    );
  }

  if (status === 2) {
    return (
      <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-700">
        Blocked
      </span>
    );
  }

  return (
    <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700">
      Unverified
    </span>
  );
}

export default function OrgTable({
  organizations,
  page,
  total,
  limit,
}: any) {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {organizations.map((o: any) => (
            <tr key={o.id} className="border-b last:border-0">
              <td className="px-4 py-3 font-medium">
                <Link
                  href={`/secure-console/organizations/${o.id}/details`}
                  className="hover:underline"
                >
                  {o.name}
                </Link>
              </td>

              <td className="px-4 py-3">
                {o.email}
              </td>

              <td className="px-4 py-3 text-center">
                <StatusBadge status={o.status} />
              </td>

              <td className="px-4 py-3 text-right">
                <OrgActions org={o} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between px-4 py-3 text-sm">
        <span>
          Page {page} of {totalPages}
        </span>
      </div>
    </div>
  );
}
