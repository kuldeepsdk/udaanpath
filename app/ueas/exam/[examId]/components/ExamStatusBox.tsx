export default function ExamStatusBox({
  state,
  access,
}: {
  state: string;
  access: any;
}) {
  const messages: Record<string, string> = {
    not_started:
      "⏳ Exam has not started yet. Please be available before start time.",
    login_closed:
      "🚫 Login window is closed. Exam is already running.",
    completed:
      "✅ This exam has been completed.",
  };

  return (
    <div className="bg-white border rounded-xl p-6 text-center text-sm text-slate-600">
      {messages[state] || "Exam not accessible"}
    </div>
  );
}
