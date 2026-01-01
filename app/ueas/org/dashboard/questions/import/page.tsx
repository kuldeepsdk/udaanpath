"use client";

import { useEffect, useState } from "react";
import {
  uploadQuestionsCsvAction,
  importQuestionsCsvAction,
  getPendingCsvUploadsAction,
} from "@/app/actions/ueas/questions.import.actions";

interface PendingUpload {
  id: string;
  status: "pending" | "partial" | "imported";
  total_rows: number;
  imported_rows: number;
  failed_rows: number;
  created_at: string;
}

export default function QuestionCsvImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD PENDING UPLOADS ---------------- */

  useEffect(() => {
    loadPending();
  }, []);

  async function loadPending() {
    try {
      const res = await getPendingCsvUploadsAction();
      setPendingUploads(res || []);
    } catch {
      /* silent */
    }
  }

  /* ---------------- FILE SELECT ---------------- */

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;
    setFile(e.target.files[0]);
    setResult(null);
    setUploadId(null);
  }

  /* ---------------- UPLOAD ---------------- */

  async function upload() {
    if (!file) return alert("Please select CSV file");

    setLoading(true);
    try {
      const res = await uploadQuestionsCsvAction(file);
      setUploadId(res.upload_id);
      alert("CSV uploaded successfully");
      loadPending();
    } catch (e: any) {
      alert(e.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- IMPORT ---------------- */

  async function importCsv(id?: string) {
    const targetId = id || uploadId;
    if (!targetId) return;

    setLoading(true);
    try {
      const res = await importQuestionsCsvAction(targetId);
      setResult(res);
      loadPending();
    } catch (e: any) {
      alert(e.message || "Import failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white border rounded-xl p-6 space-y-6">

      <h1 className="text-xl font-bold text-slate-800">
        Import Questions via CSV
      </h1>

      {/* ================= PENDING UPLOADS ================= */}
      {pendingUploads.length > 0 && (
        <div className="border rounded-lg p-4 bg-yellow-50">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">
            Pending CSV Uploads
          </h3>

          <ul className="space-y-2 text-sm">
            {pendingUploads.map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between border rounded p-2 bg-white"
              >
                <div>
                  <p className="font-medium">
                    Upload ID: {u.id}
                  </p>
                  <p className="text-xs text-slate-500">
                    Rows: {u.total_rows} | Imported: {u.imported_rows} | Failed: {u.failed_rows}
                  </p>
                </div>

                <button
                  disabled={loading}
                  onClick={() => importCsv(u.id)}
                  className="rounded bg-green-600 px-3 py-1.5 text-white text-xs"
                >
                  Resume Import
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ================= DROP ZONE ================= */}
      <label
        className="flex flex-col items-center justify-center
                   border-2 border-dashed rounded-xl p-8
                   cursor-pointer hover:bg-slate-50"
      >
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFile}
        />
        <p className="text-sm text-slate-600">
          Drag & drop CSV here or click to select
        </p>
        {file && (
          <p className="mt-2 text-xs text-green-600">
            Selected: {file.name}
          </p>
        )}
      </label>

      {/* ================= ACTIONS ================= */}
      <div className="flex gap-3">
        <button
          onClick={upload}
          disabled={loading || !file}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white text-sm
                     disabled:opacity-60"
        >
          Upload CSV
        </button>

        <button
          onClick={() => importCsv()}
          disabled={loading || !uploadId}
          className="rounded-lg bg-green-600 px-4 py-2 text-white text-sm
                     disabled:opacity-60"
        >
          Import Questions
        </button>
      </div>

      {/* ================= RESULT ================= */}
      {result && (
        <div className="border rounded-lg p-4 bg-slate-50 text-sm">
          <p>Total Rows: {result.total_rows}</p>
          <p className="text-green-600">
            Inserted: {result.inserted}
          </p>
          <p className="text-red-600">
            Failed: {result.failed}
          </p>

          {result.errors?.length > 0 && (
            <div className="mt-3">
              <h4 className="font-semibold text-slate-700 mb-1">
                Errors
              </h4>
              <ul className="list-disc pl-5 text-red-600 text-xs space-y-1">
                {result.errors.map((e: any, i: number) => (
                  <li key={i}>
                    Row {e.row}: {e.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
