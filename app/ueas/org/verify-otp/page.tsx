import { Suspense } from "react";
import Navbar from "@/ui/components/Navbar";
import Footer from "@/ui/components/Footer";
import VerifyOtpClient from "./VerifyOtpClient";

export default function VerifyOtpPage() {
  return (
    <>
      <Navbar />

      <Suspense
        fallback={
          <main className="min-h-screen flex items-center justify-center">
            <p className="text-slate-500">Loading OTP verification…</p>
          </main>
        }
      >
        <VerifyOtpClient />
      </Suspense>

      <Footer />
    </>
  );
}
