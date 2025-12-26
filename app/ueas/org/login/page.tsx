"use client";

import { useState } from "react";
import Navbar from "@/ui/components/Navbar";
import Footer from "@/ui/components/Footer";
import { ueasOrgLoginAction } from "@/app/actions/ueas/ueasOrgAuth.actions";

export default function OrgLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError(null);
    setLoading(true);

    try {
      await ueasOrgLoginAction(email, password);
      // redirect handled server-side
    } catch (err: any) {
      setError(err.message || "Login failed");
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border">

          <h1 className="text-2xl font-bold text-center text-slate-900">
            Organization Login
          </h1>

          <p className="mt-2 text-center text-sm text-slate-600">
            Login to manage exams, students & results
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-semibold disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="mt-4 text-center text-sm text-slate-600">
            Don’t have an account?{" "}
            <a
              href="/ueas/org/register"
              className="text-blue-600 hover:underline"
            >
              Register Institute
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

/* ---------- Input ---------- */

function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
