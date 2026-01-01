"use client";

import { useState } from "react";
import {
  uploadBatchStudentsCsvAction,
  importBatchStudentsCsvAction,
} from "@/app/actions/ueas/batch.actions";

export default function BulkUploadModal({
  open,
  batchId,
  onClose,
  onImported,
}: {
  open: boolean;
  batchId: string;
  onClose: () => void;
  onImported: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  /* ---------------- FILE SELECT ---------------- */
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;
    setFile(e.target.files[0]);
    setPreview([]);
    setResult(null);
  }

  /* ---------------- UPLOAD CSV ---------------- */
  async function uploadCsv() {
    if (!file) return alert("Select CSV file");

    setLoading(true);
    try {
      const res = await uploadBatchStudentsCsvAction(batchId, file);
      setUploadId(res.upload_id);
      setPreview(res.preview || []);
    } catch (e: any) {
      alert(e.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- IMPORT CSV ---------------- */
  async function importCsv() {
    if (!uploadId) return;

    setLoading(true);
    try {
      const res = await importBatchStudentsCsvAction(uploadId);
      setResult(res);
      onImported();
    } catch (e: any) {
      alert(e.message || "Import failed");
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Bulk Upload Students
          </h2>
          <p className="text-xs text-slate-500">
            Upload CSV to add students in this batch
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
      <div className="p-6 space-y-8">

        {/* ---------- STEP 1: UPLOAD ---------- */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">
            Step 1: Upload CSV File
          </h3>

          <label className="group border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition hover:bg-blue-50 hover:border-blue-400">
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFile}
            />

            <div className="text-3xl mb-2">📄</div>
            <p className="text-sm text-slate-600">
              Click or drag CSV file here
            </p>

            {file ? (
              <p className="mt-2 text-xs text-green-600">
                Selected: {file.name}
              </p>
            ) : (
              <p className="mt-2 text-xs text-slate-400">
                Format: name, email, mobile
              </p>
            )}
          </label>

          <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={downloadSampleCsv}
              type="button"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              ⬇️ Download Sample CSV
            </button>

            <button
              onClick={uploadCsv}
              disabled={!file || loading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white
                         hover:bg-blue-700 disabled:opacity-50"
            >
              Upload & Preview
            </button>
          </div>
        </div>

        {/* ---------- STEP 2: PREVIEW ---------- */}
        {preview.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">
              Step 2: Preview Data
            </h3>

            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Email</th>
                    <th className="px-3 py-2 text-left">Mobile</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((r, i) => (
                    <tr key={i} className="border-b last:border-b-0">
                      <td className="px-3 py-2">{r.name}</td>
                      <td className="px-3 py-2">{r.email}</td>
                      <td className="px-3 py-2">{r.mobile}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 text-right">
              <button
                onClick={importCsv}
                disabled={!uploadId || loading}
                className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white
                           hover:bg-green-700 disabled:opacity-50"
              >
                Import Students
              </button>
            </div>
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {result && (
          <div className="rounded-xl border bg-green-50 p-4 space-y-3">
            <p className="text-green-700 font-medium">
              ✅ {result.imported} students imported successfully
            </p>

            <div className="max-h-56 overflow-auto border rounded bg-white">
              <table className="w-full text-xs">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-2 py-1 text-left">Name</th>
                    <th className="px-2 py-1">Roll No</th>
                    <th className="px-2 py-1">Password</th>
                  </tr>
                </thead>
                <tbody>
                  {result.credentials.map((c: any, i: number) => (
                    <tr key={i} className="border-b">
                      <td className="px-2 py-1">{c.name}</td>
                      <td className="px-2 py-1">{c.roll_no}</td>
                      <td className="px-2 py-1 font-mono">{c.password}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-red-600">
              ⚠️ Passwords are shown only once. Please save them.
            </p>
          </div>
        )}

      </div>
    </div>
  </div>
);

}


function downloadSampleCsv() {
  const headers = ["name", "email", "mobile"];
  const rows = [
    ["Student One", "student1@example.com", "9876543210"],
    ["Student Two", "student2@example.com", "9123456789"],
  ];

  const csvContent =
    [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "students_sample.csv";
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
