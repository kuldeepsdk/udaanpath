"use client";

import { useEffect, useState } from "react";
import { getQuestionSubjectsAction } from "@/app/actions/ueas/questions.actions";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SubjectInput({ value, onChange }: Props) {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubjects() {
      try {
        const data = await getQuestionSubjectsAction();
        setSubjects(data);
      } catch {
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    }
    loadSubjects();
  }, []);

  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        Subject
      </label>

      <input
        list="ueas-subjects"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          loading ? "Loading subjects..." : "Type or select subject"
        }
        disabled={loading}
        className="w-full rounded-lg border px-3 py-2 text-sm
                   disabled:bg-slate-50 disabled:text-slate-400
                   focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <datalist id="ueas-subjects">
        {subjects.map((subject) => (
          <option key={subject} value={subject} />
        ))}
      </datalist>

      <p className="mt-1 text-[11px] text-slate-400">
        You can select an existing subject or create a new one
      </p>
    </div>
  );
}
