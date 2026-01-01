"use client";

export default function BatchStudentsTable({
  students,
  batchId,
  onChange,
}: {
  students: any[];
  batchId: string;
  onChange: () => void;
}) {
  if (!students || students.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-6 text-sm text-slate-500">
        No students added to this batch yet
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left">Roll No</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Mobile</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr
              key={s.id}
              className="border-b last:border-b-0 hover:bg-slate-50"
            >
              <td className="px-4 py-3">{s.roll_no}</td>
              <td className="px-4 py-3 font-medium">{s.name}</td>
              <td className="px-4 py-3">{s.email || "-"}</td>
              <td className="px-4 py-3">{s.mobile || "-"}</td>

              <td className="px-4 py-3 text-center">
                {/* 🔜 future: remove student */}
                <button
                  onClick={() => alert("Remove student API later")}
                  className="text-red-600 text-xs hover:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
