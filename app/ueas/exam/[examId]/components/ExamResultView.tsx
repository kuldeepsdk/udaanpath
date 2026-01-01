export default function ExamResultView({ data }: { data: any }) {
  const { student, summary, questions } = data;

  return (
    <div className="space-y-6">

      {/* SUMMARY */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <h2 className="text-xl font-bold text-green-700">
          🎉 Exam Completed
        </h2>

        <p className="text-sm text-slate-600 mt-2">
          {student.name} ({student.roll_no})
        </p>

        <div className="mt-4 flex justify-center gap-10 text-sm">
          <div>
            <div className="font-semibold text-lg">
              {summary.obtained_marks}
            </div>
            <div className="text-slate-500">
              Obtained
            </div>
          </div>

          <div>
            <div className="font-semibold text-lg">
              {summary.total_marks}
            </div>
            <div className="text-slate-500">
              Total
            </div>
          </div>
        </div>
      </div>

      {/* QUESTIONS */}
      <div className="space-y-4">
        {questions.map((q: any, idx: number) => (
          <div
            key={q.id}
            className="border rounded-xl p-5 bg-white"
          >
            <div
              className="font-medium"
              dangerouslySetInnerHTML={{
                __html: `${idx + 1}. ${q.question_text}`,
              }}
            />

            <div className="mt-3 space-y-2">
              {q.options.map((opt: any) => {
                const selected = q.selected_options?.includes(opt.id);

                return (
                  <div
                    key={opt.id}
                    className={`p-3 rounded border text-sm
                      ${
                        opt.is_correct
                          ? "border-green-500 bg-green-50"
                          : selected
                          ? "border-red-500 bg-red-50"
                          : "border-slate-200"
                      }
                    `}
                  >
                    {opt.text}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 text-sm">
              {q.is_correct ? (
                <span className="text-green-600 font-medium">
                  ✅ Correct (+{q.marks_awarded})
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  ❌ Incorrect ({q.marks_awarded})
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
