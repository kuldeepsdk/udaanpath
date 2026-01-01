import { removeQuestionFromPaperAction } from "@/app/actions/ueas/papers.actions";

export default function PaperQuestionTable({
  questions,
  paperId,
  onChange,
}: {
  questions: any[];
  paperId: string;
  onChange: () => void;
}) {
  async function remove(questionId: string) {
    if (!confirm("Remove this question from paper?")) return;

    await removeQuestionFromPaperAction(paperId, questionId);
    onChange();
  }

  if (!questions.length) {
    return (
      <div className="bg-white border rounded-xl p-6 text-sm text-slate-500">
        No questions added to this paper yet
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl overflow-hidden">

      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">Question</th>
            <th className="px-4 py-3 text-center">Marks</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {questions.map((q, idx) => (
            <tr key={q.id} className="border-b last:border-b-0">
              <td className="px-4 py-3">{idx + 1}</td>

              <td className="px-4 py-3">
                <div
                  className="prose prose-sm max-w-none line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: q.question_text }}
                />
              </td>

              <td className="px-4 py-3 text-center">
                {q.marks}
              </td>

              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => remove(q.id)}
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
