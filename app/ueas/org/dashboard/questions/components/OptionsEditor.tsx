"use client";

type QuestionType = "mcq_single" | "mcq_multi";

interface Option {
  text: string;
  is_correct: boolean;
}

export default function OptionsEditor({
  type,
  options = [],
  onChange,
}: {
  type: QuestionType;
  options?: Option[]; // 👈 optional
  onChange: (opts: Option[]) => void;
}) {
  /* ---------- SAFETY GUARD ---------- */
  const safeOptions =
    Array.isArray(options) && options.length > 0
      ? options
      : [
          { text: "", is_correct: false },
          { text: "", is_correct: false },
        ];

  /* ---------- UPDATE OPTION TEXT ---------- */
  function updateText(index: number, value: string) {
    const updated = [...safeOptions];
    updated[index] = {
      ...updated[index],
      text: value,
    };
    onChange(updated);
  }

  /* ---------- TOGGLE CORRECT ---------- */
  function toggleCorrect(index: number) {
    let updated = [...safeOptions];

    if (type === "mcq_single") {
      updated = updated.map((opt, i) => ({
        ...opt,
        is_correct: i === index,
      }));
    } else {
      updated[index] = {
        ...updated[index],
        is_correct: !updated[index].is_correct,
      };
    }

    onChange(updated);
  }

  /* ---------- ADD OPTION ---------- */
  function addOption() {
    onChange([
      ...safeOptions,
      { text: "", is_correct: false },
    ]);
  }

  /* ---------- REMOVE OPTION (MIN 2) ---------- */
  function removeOption(index: number) {
    if (safeOptions.length <= 2) return;

    const updated = safeOptions.filter((_, i) => i !== index);
    onChange(updated);
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-700">
        Answer Options
      </h3>

      {safeOptions.map((opt, i) => (
        <div key={i} className="flex items-center gap-3">
          <input
            type={type === "mcq_single" ? "radio" : "checkbox"}
            checked={opt.is_correct}
            onChange={() => toggleCorrect(i)}
          />

          <input
            value={opt.text}
            onChange={(e) => updateText(i, e.target.value)}
            placeholder={`Option ${i + 1}`}
            className="flex-1 rounded-lg border px-3 py-2 text-sm"
          />

          <button
            type="button"
            onClick={() => removeOption(i)}
            disabled={safeOptions.length <= 2}
            className="text-red-500 text-sm disabled:opacity-30"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addOption}
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        + Add another option
      </button>

      <p className="text-xs text-slate-500">
        Minimum 2 options are required
      </p>
    </div>
  );
}
