"use client";

import Link from "next/link";
import { StatusBadge } from "./StatusBadges";

interface Props {
  examId: string;
  students: any[];
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function ExamStudentsTable({
  examId,
  students,
  loading,
  page,
  limit,
  total,
  onPageChange,
}: Props) {
  if (loading) {
    return (
      <div className="bg-white border rounded-xl p-6 text-sm text-slate-500">
        Loading students…
      </div>
    );
  }

  if (!students.length) {
    return (
      <div className="bg-white border rounded-xl p-6 text-sm text-slate-500">
        No students found
      </div>
    );
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b">
          <tr className="text-slate-600">
            <th className="px-4 py-3 text-left">Roll No</th>
            <th className="px-4 py-3 text-left">Student</th>
            <th className="px-4 py-3 text-center">Invite</th>
            <th className="px-4 py-3 text-center">Credentials</th>
            <th className="px-4 py-3 text-center">Exam</th>
            <th className="px-4 py-3 text-center">Marks</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => {
            const analysisUrl = `/ueas/org/dashboard/exams/${examId}/students/${s.roll_no}`;

            return (
              <tr
                key={s.student_id}
                className="border-b last:border-0 hover:bg-slate-50 transition"
              >
                {/* Roll No (Clickable) */}
                <td className="px-4 py-3 font-mono">
                  <Link
                    href={analysisUrl}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {s.roll_no}
                  </Link>
                </td>

                {/* Name + Email */}
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">
                    {s.name}
                  </div>
                  {s.email && (
                    <div className="text-xs text-slate-500">
                      {s.email}
                    </div>
                  )}
                </td>

                {/* Invite */}
                <td className="px-4 py-3 text-center">
                  <StatusBadge value={s.invite_status} type="invite" />
                </td>

                {/* Credentials */}
                <td className="px-4 py-3 text-center">
                  <StatusBadge
                    value={s.credentials_status}
                    type="credentials"
                  />
                </td>

                {/* Exam Status */}
                <td className="px-4 py-3 text-center">
                  <StatusBadge value={s.exam_status} type="exam" />
                </td>

                {/* Marks */}
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${
                        s.total_marks > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                  >
                    {s.total_marks}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex justify-between items-center px-4 py-3 text-sm border-t bg-slate-50">
        <span className="text-slate-600">
          Page <b>{page}</b> of <b>{totalPages}</b>
        </span>

        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1 border rounded-lg disabled:opacity-40 hover:bg-white"
          >
            Prev
          </button>

          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1 border rounded-lg disabled:opacity-40 hover:bg-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
