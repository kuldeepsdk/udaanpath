"use client";

interface Option {
  text: string;
  is_correct: boolean;
}

interface OptionsEditorProps {
  type: "mcq_single" | "mcq_multi";
  options: Option[];
  onChange: (options: Option[]) => void;
}

export default function OptionsEditor({
  type,
  options,
  onChange,
}: OptionsEditorProps) {
  function updateOption(index: number, key: keyof Option, value: any) {
    const updated = [...options];
    updated[index] = { ...updated[index], [key]: value };
    onChange(updated);
  }

  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-2">
        Options
      </label>

      {options.map((opt, idx) => (
        <div key={idx} className="flex items-center gap-3 mb-2">
          <input
            type={type === "mcq_single" ? "radio" : "checkbox"}
            checked={opt.is_correct}
            onChange={(e) =>
              updateOption(idx, "is_correct", e.target.checked)
            }
          />

          <input
            type="text"
            value={opt.text}
            onChange={(e) =>
              updateOption(idx, "text", e.target.value)
            }
            placeholder={`Option ${idx + 1}`}
            className="flex-1 rounded-lg border px-3 py-2 text-sm"
          />
        </div>
      ))}
    </div>
  );
}
