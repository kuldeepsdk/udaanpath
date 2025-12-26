//app\ueas\org\verify-otp\page.tsx

"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/ui/components/Navbar";
import Footer from "@/ui/components/Footer";
import {
  verifyOrgOtpAndRegisterAction,
  resendOrgOtpAction,
} from "@/app/actions/ueas/ueasOrgRegister.actions";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sid");

  // ✅ Hard guard
  if (!sessionId) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border text-center">
            <h1 className="text-xl font-bold text-slate-900">Invalid Session</h1>
            <p className="mt-2 text-sm text-slate-600">
              OTP session is missing or expired. Please register again.
            </p>
            <a
              href="/ueas/org/register"
              className="inline-block mt-6 rounded-lg bg-blue-600 px-5 py-2 text-white font-semibold"
            >
              Go to Register
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ✅ Now TS knows it is string
  const sid = sessionId;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function verifyOtp() {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await verifyOrgOtpAndRegisterAction(sid, otp);
      // ✅ Server action will redirect on success
    } catch (err: any) {
      setError(err?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    setResending(true);
    setError(null);

    try {
      await resendOrgOtpAction(sid);
      // Optional toast/alert
      alert("New OTP sent to your email.");
    } catch (err: any) {
      setError(err?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border">
          <h1 className="text-2xl font-bold text-center text-slate-900">
            Verify Email OTP
          </h1>

          <p className="mt-2 text-center text-sm text-slate-600">
            Enter the 6-digit OTP sent to your email
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            maxLength={6}
            className="mt-6 w-full text-center text-2xl tracking-widest rounded-lg border px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="------"
          />

          <button
            onClick={verifyOtp}
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-semibold disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            onClick={resendOtp}
            disabled={resending}
            className="mt-4 w-full text-sm text-blue-600 hover:underline disabled:opacity-60"
          >
            {resending ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}
