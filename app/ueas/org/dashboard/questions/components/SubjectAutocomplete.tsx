"use client";

import { useEffect, useState } from "react";
import { getQuestionSubjectsAction } from "@/app/actions/ueas/questions.actions";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SubjectAutocomplete({ value, onChange }: Props) {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function loadSubjects() {
      const data = await getQuestionSubjectsAction();
      setSubjects(data);
    }
    loadSubjects();
  }, []);

  useEffect(() => {
    if (!value) {
      setFiltered(subjects);
    } else {
      setFiltered(
        subjects.filter((s) =>
          s.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  }, [value, subjects]);

  return (
    <div className="relative">

      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Type or select subject"
        className="w-full rounded-lg border px-3 py-2 
                   focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      {/* Suggestions */}
      {open && filtered.length > 0 && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border bg-white shadow-lg max-h-48 overflow-auto">
          {filtered.map((sub) => (
            <div
              key={sub}
              onMouseDown={() => {
                onChange(sub);
                setOpen(false);
              }}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-100"
            >
              {sub}
            </div>
          ))}
        </div>
      )}

      {/* New subject hint */}
      {value && !subjects.includes(value) && (
        <p className="mt-1 text-xs text-slate-500">
          New subject will be created
        </p>
      )}
    </div>
  );
}
