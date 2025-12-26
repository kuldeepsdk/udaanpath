"use client";

import { testZohoSMTP } from "@/app/actions/testMailer.actions";
import Navbar from "@/ui/components/Navbar";
import Footer from "@/ui/components/Footer";
import { useState } from "react";

export default function TestMailerPage() {
  const [status, setStatus] = useState<string | null>(null);

  async function runTest() {
    setStatus("sending");

    try {
      await testZohoSMTP();
      setStatus("success");
    } catch (e: any) {
      setStatus(e.message || "failed");
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-xl border shadow-sm text-center">
          <h1 className="text-xl font-bold">Zoho SMTP Test</h1>

          <button
            onClick={runTest}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold"
          >
            Send Test Email
          </button>

          {status === "sending" && (
            <p className="mt-4 text-sm text-slate-500">
              Sending email...
            </p>
          )}

          {status === "success" && (
            <p className="mt-4 text-sm text-green-600">
              Email sent successfully ✅
            </p>
          )}

          {status && status !== "sending" && status !== "success" && (
            <p className="mt-4 text-sm text-red-600">
              Error: {status}
            </p>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
