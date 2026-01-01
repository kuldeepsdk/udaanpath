"use client";

import { useState } from "react";
import { bulkUploadQuestionsCsvAction } from "@/app/actions/ueas/questions.actions";

function downloadSampleCsv() {
  const csv = [
    "question_text,question_type,difficulty,marks,negative_marks,subject,topic,analysis,options",
    `"What is 2 + 2?",mcq_single,easy,1,0,Math,Addition,"Basic math","4|1;3|0;2|0;5|0"`,
    `"Select prime numbers",mcq_multi,medium,2,0,Math,Numbers,"Choose all primes","2|1;3|1;4|0;6|0"`,
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "questions_sample.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function BulkQuestionUploadModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!open) return null;

  async function upload() {
    if (!file) return alert("Please select a CSV file");

    setLoading(true);
    try {
      const res = await bulkUploadQuestionsCsvAction(file);
      setResult(res);
    } catch (e: any) {
      alert(e?.message || "Bulk upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Bulk Upload Questions
            </h2>
            <p className="text-sm text-slate-500">
              Upload multiple MCQs using a CSV file
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            ✕
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="p-6 space-y-6">

          {/* DROPZONE */}
          <label className="
            group
            flex flex-col items-center justify-center
            rounded-xl border-2 border-dashed
            border-slate-300
            bg-slate-50
            px-6 py-10
            text-center
            cursor-pointer
            transition
            hover:border-blue-500 hover:bg-blue-50
          ">
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <div className="text-4xl mb-3">📄</div>

            <p className="text-sm font-medium text-slate-700">
              Click to upload or drag & drop
            </p>

            <p className="text-xs text-slate-500 mt-1">
              CSV format only
            </p>

            {file && (
              <p className="mt-3 text-xs text-green-600 font-medium">
                Selected: {file.name}
              </p>
            )}
          </label>

          {/* HELP ROW */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <button
              onClick={downloadSampleCsv}
              type="button"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
            >
              ⬇️ Download Sample CSV
            </button>

            <span className="text-xs text-slate-500">
              Minimum 2 options per question
            </span>
          </div>

          {/* RESULT */}
          {result && (
            <div className="rounded-xl border bg-green-50 p-4 text-sm">
              <p className="text-green-700 font-medium">
                ✅ CSV uploaded successfully
              </p>
              <p className="mt-1">
                Bulk ID: <b>{result.bulk_id}</b>
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Questions are being processed in background.
              </p>
            </div>
          )}

        </div>

        {/* ================= FOOTER ================= */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm border bg-white hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={upload}
            disabled={loading}
            className="
              px-5 py-2 rounded-lg text-sm font-medium text-white
              bg-blue-600 hover:bg-blue-700
              disabled:opacity-50
            "
          >
            {loading ? "Uploading..." : "Upload & Process"}
          </button>
        </div>

      </div>
    </div>
  );
}
