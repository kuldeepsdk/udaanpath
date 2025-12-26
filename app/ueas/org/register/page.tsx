"use client";

import { useState } from "react";
import Navbar from "@/ui/components/Navbar";
import Footer from "@/ui/components/Footer";
import StepIndicator from "./components/StepIndicator";
import { sendOrgRegisterOtpAction } from "@/app/actions/ueas/ueasOrgRegister.actions";

export default function OrgRegisterPage() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    org_name: "",
    org_type: "",
    city: "",
    state: "",
    admin_name: "",
    email: "",
    mobile: "",
    password: "",
    confirm_password: "",
  });

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  /* ---------------- VALIDATION ---------------- */

  function validateStep(): boolean {
    if (step === 1) {
      if (!form.org_name || !form.org_type || !form.city || !form.state) {
        setError("Please fill all organization details");
        return false;
      }
    }

    if (step === 2) {
      if (!form.admin_name || !form.email || !form.mobile) {
        setError("Please fill admin contact details");
        return false;
      }
      if (!/^\S+@\S+\.\S+$/.test(form.email)) {
        setError("Invalid email address");
        return false;
      }
      if (!/^[6-9]\d{9}$/.test(form.mobile)) {
        setError("Invalid Indian mobile number");
        return false;
      }
    }

    if (step === 3) {
      if (!form.password || !form.confirm_password) {
        setError("Please set password");
        return false;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
      if (form.password !== form.confirm_password) {
        setError("Passwords do not match");
        return false;
      }
    }

    return true;
  }

  function next() {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, 4));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
    setError(null);
  }

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 min-h-screen py-16">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border">

          <h1 className="text-2xl font-bold text-center text-slate-900">
            Register Your Institute on UEAS
          </h1>

          <p className="mt-2 text-center text-slate-600 text-sm">
            Secure online exams with anti-cheating & instant results
          </p>

          <StepIndicator current={step} />

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <Input label="Organization Name" value={form.org_name} onChange={(v:any) => updateField("org_name", v)} />
              <Select
                label="Organization Type"
                value={form.org_type}
                onChange={(v:any) => updateField("org_type", v)}
                options={["School", "College", "Coaching Institute", "Training Center"]}
              />
              <Input label="City" value={form.city} onChange={(v:any) => updateField("city", v)} />
              <Input label="State" value={form.state} onChange={(v:any) => updateField("state", v)} />
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <Input label="Admin Name" value={form.admin_name} onChange={(v:any) => updateField("admin_name", v)} />
              <Input label="Email" type="email" value={form.email} onChange={(v:any) => updateField("email", v)} />
              <Input label="Mobile Number" value={form.mobile} onChange={(v:any) => updateField("mobile", v)} />
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5">
              <Input label="Password" type="password" value={form.password} onChange={(v:any) => updateField("password", v)} />
              <Input
                label="Confirm Password"
                type="password"
                value={form.confirm_password}
                onChange={(v:any) => updateField("confirm_password", v)}
              />
            </div>
          )}

          {/* STEP 4 – REVIEW + OTP SEND */}
          {step === 4 && (
            <form
              action={async () => {
                setLoading(true);
                await sendOrgRegisterOtpAction({
                  org_name: form.org_name,
                  org_type: form.org_type,
                  city: form.city,
                  state: form.state,
                  admin_name: form.admin_name,
                  email: form.email,
                  mobile: form.mobile,
                  password: form.password,
                });
              }}
              className="space-y-3"
            >
              <div className="text-sm text-slate-700 space-y-2">
                <p><b>Organization:</b> {form.org_name}</p>
                <p><b>Type:</b> {form.org_type}</p>
                <p><b>Location:</b> {form.city}, {form.state}</p>
                <p><b>Admin:</b> {form.admin_name}</p>
                <p><b>Email:</b> {form.email}</p>
                <p><b>Mobile:</b> {form.mobile}</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 rounded-lg bg-green-600 px-6 py-3 text-white font-semibold disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Send OTP to Email"}
              </button>
            </form>
          )}

          {/* ACTIONS */}
          {step < 4 && (
            <div className="mt-10 flex justify-between">
              {step > 1 ? (
                <button onClick={back} className="px-6 py-2 rounded-lg border">
                  Back
                </button>
              ) : <div />}

              <button onClick={next} className="px-6 py-2 rounded-lg bg-blue-600 text-white">
                Next
              </button>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

/* ---------- UI Helpers ---------- */

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

function Select({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
