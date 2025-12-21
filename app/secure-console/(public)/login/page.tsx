"use client";

import { adminLoginAction } from "@/app/actions/admin.actions";
import { useState } from "react";

export default function AdminLogin() {
  const [error, setError] = useState("");

  return (
    <form
      action={async (formData) => {
        try {
          await adminLoginAction(formData);
          // ✅ redirect handled by server
        } catch (error){
          setError("Invalid email or password"+error);
        }
      }}
      className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6 space-y-4"
    >
      <h1 className="text-xl font-semibold text-slate-800 text-center">
        Admin Login
      </h1>

      {error && (
        <div className="text-sm text-red-600 text-center">{error}</div>
      )}

      <input
        name="email"
        type="email"
        placeholder="Admin email"
        required
        className="w-full border rounded px-3 py-2"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="w-full border rounded px-3 py-2"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>
  );
}
