"use client";

import { useState } from "react";
import { addStudentsToBatchAction } from "@/app/actions/ueas/batch.actions";

/* ---------------- TYPES ---------------- */

interface StudentRow {
  name: string;
  email: string;
  mobile: string;
}

/* ---------------- COMPONENT ---------------- */

export default function AddStudentsModal({
  open,
  batchId,
  onClose,
  onAdded,
}: {
  open: boolean;
  batchId: string;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [rows, setRows] = useState<StudentRow[]>([
    { name: "", email: "", mobile: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!open) return null;

  /* ---------------- HELPERS ---------------- */

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidMobile(mobile: string) {
    return /^[6-9]\d{9}$/.test(mobile);
  }

  /* ---------------- ADD ROW ---------------- */
  function addRow() {
    setRows([...rows, { name: "", email: "", mobile: "" }]);
  }

  /* ---------------- UPDATE ROW ---------------- */
  function updateRow(
    index: number,
    key: keyof StudentRow,
    value: string
  ) {
    const copy = [...rows];
    copy[index] = { ...copy[index], [key]: value };
    setRows(copy);
  }

  /* ---------------- REMOVE ROW ---------------- */
  function removeRow(index: number) {
    setRows(rows.filter((_, i) => i !== index));
  }

  /* ---------------- SUBMIT ---------------- */
  async function submit() {
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];

      if (!r.name.trim()) {
        alert(`Row ${i + 1}: Name is required`);
        return;
      }

      if (!r.email.trim() || !isValidEmail(r.email)) {
        alert(`Row ${i + 1}: Valid email is required`);
        return;
      }

      if (!r.mobile.trim() || !isValidMobile(r.mobile)) {
        alert(`Row ${i + 1}: Valid 10-digit mobile number is required`);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await addStudentsToBatchAction(batchId, rows);
      setResult(res);
      onAdded();
    } catch (e: any) {
      alert(e.message || "Failed to add students");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- SUCCESS VIEW ---------------- */
  if (result?.credentials) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl w-full max-w-3xl p-6 space-y-4">

          <h2 className="text-lg font-semibold">
            Students Added Successfully
          </h2>

          <p className="text-sm text-slate-600">
            Auto-generated login credentials (share securely).
          </p>

          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Roll No</th>
                  <th className="px-3 py-2 text-left">Password</th>
                </tr>
              </thead>
              <tbody>
                {result.credentials.map((c: any, i: number) => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="px-3 py-2 font-medium">{c.name}</td>
                    <td className="px-3 py-2 font-mono">{c.roll_no}</td>
                    <td className="px-3 py-2 font-mono">{c.password}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- FORM ---------------- */

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-5xl p-6 space-y-4">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Add Students to Batch
          </h2>
          <button onClick={onClose} className="text-slate-500">✕</button>
        </div>

        <div className="text-sm text-slate-600 bg-slate-50 border rounded-lg p-3">
          Name, Email & Mobile are mandatory. Roll number & password will be auto-generated.
        </div>

        {/* TABLE */}
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-3 py-2">Name *</th>
                <th className="px-3 py-2">Email *</th>
                <th className="px-3 py-2">Mobile *</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="px-2 py-2">
                    <input
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Student name"
                      value={r.name}
                      onChange={(e) => updateRow(i, "name", e.target.value)}
                    />
                  </td>

                  <td className="px-2 py-2">
                    <input
                      className="border rounded px-2 py-1 w-full"
                      placeholder="email@example.com"
                      value={r.email}
                      onChange={(e) => updateRow(i, "email", e.target.value)}
                    />
                  </td>

                  <td className="px-2 py-2">
                    <input
                      className="border rounded px-2 py-1 w-full"
                      placeholder="10-digit mobile"
                      value={r.mobile}
                      onChange={(e) => updateRow(i, "mobile", e.target.value)}
                    />
                  </td>

                  <td className="px-2 py-2 text-center">
                    {rows.length > 1 && (
                      <button
                        onClick={() => removeRow(i)}
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between">
          <button onClick={addRow} className="text-sm text-blue-600">
            + Add Row
          </button>

          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 border rounded text-sm">
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
            >
              Save Students
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
