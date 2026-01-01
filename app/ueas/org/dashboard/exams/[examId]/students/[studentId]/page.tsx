"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getStudentExamAnalysisAction } from "@/app/actions/ueas/exam/studentAnalysis.actions";

export default function ExamStudentAnalysisPage() {
  const { examId, studentId } = useParams<{
    examId: string;
    studentId: string;
  }>();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getStudentExamAnalysisAction({
          exam_id: examId,
          roll_no: studentId,
        });
        setData(res);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [examId, studentId]);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading analysis…</p>;
  }

  if (error || !data) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          {data.student.name}
        </h1>
        <p className="text-sm text-slate-600">
          Roll No: <span className="font-mono">{data.student.roll_no}</span>
        </p>
      </div>

      {/* SUMMARY */}
      <div className="bg-white border rounded-xl p-4 flex gap-6">
        <div>
          <p className="text-xs text-slate-500">Total Marks</p>
          <p className="text-xl font-bold">{data.summary.total_marks}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Obtained</p>
          <p className="text-xl font-bold text-green-600">
            {data.summary.obtained_marks}
          </p>
        </div>
      </div>

      {/* QUESTIONS */}
      <div className="space-y-4">
        {data.questions.map((q: any, idx: number) => (
          <div
            key={q.id}
            className="bg-white border rounded-xl p-4"
          >
            <div className="font-medium mb-2">
              Q{idx + 1}.{" "}
              <span
                dangerouslySetInnerHTML={{ __html: q.question_text }}
              />
            </div>

            <ul className="space-y-1 text-sm">
              {q.options.map((o: any) => {
                const selected = q.selected_options.includes(o.id);
                return (
                  <li
                    key={o.id}
                    className={`px-2 py-1 rounded ${
                      o.is_correct
                        ? "bg-green-50 text-green-700"
                        : selected
                        ? "bg-red-50 text-red-600"
                        : ""
                    }`}
                  >
                    {o.text}
                  </li>
                );
              })}
            </ul>

            <div className="mt-2 text-xs text-slate-600">
              Marks:{" "}
              <b>
                {q.marks_awarded} / {q.marks}
              </b>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
