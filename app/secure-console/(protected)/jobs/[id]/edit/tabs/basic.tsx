"use client";

import { useEffect, useState, useTransition } from "react";
import { updateJobAction } from "@/app/actions/admin/jobs.edit.action";

/* -----------------------------
   Utils
------------------------------ */
function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

const JOB_CATEGORIES = [
  { value: "job", label: "Job / Vacancy" },
  { value: "admit_card", label: "Admit Card" },
  { value: "result", label: "Result" },
  { value: "admission", label: "Admission" },
];

export default function BasicJobForm({
  jobId,
  job,
}: {
  jobId: string;
  job: any;
}) {
  const [pending, startTransition] = useTransition();
  const [autoSlug, setAutoSlug] = useState(true);
  const [imageBase64, setImageBase64] = useState<string | null>(
    job.notification_image_base64 || null
  );

  const [form, setForm] = useState({
    title: job.title || "",
    slug: job.slug || "",
    category: job.category || "",
    organization: job.organization || "",
    department: job.department || "",
    summary: job.summary || "",
    full_description: job.full_description || "",
    total_posts: job.total_posts || "",
    salary: job.salary || "",
    qualification: job.qualification || "",
    age_limit: job.age_limit || "",
    application_fee: job.application_fee || "",
    selection_process: job.selection_process || "",
    official_website: job.official_website || "",
    apply_link: job.apply_link || "",
    published: job.published ? 1 : 0,
    status: job.status || "draft",
  });

  /* -----------------------------
     Auto slug
  ------------------------------ */
  function handleTitleChange(val: string) {
    setForm((f) => ({
      ...f,
      title: val,
      slug: autoSlug ? slugify(val) : f.slug,
    }));
  }

  /* -----------------------------
     Image → Base64
  ------------------------------ */
  function handleImageUpload(file: File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  /* -----------------------------
     Save
  ------------------------------ */
  function handleSave() {
    startTransition(async () => {
      await updateJobAction(jobId, {
        ...form,
        notification_image_base64: imageBase64,
      });

      alert("Job updated successfully");
    });
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Basic Job Information
          </h2>
          <p className="text-sm text-slate-500">
            Update main vacancy details
          </p>
        </div>

        <button
          disabled={pending}
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* =====================
         BASIC INFO
      ====================== */}
      <Grid>
        <Input
          label="Title *"
          value={form.title}
          onChange={(v: string) => handleTitleChange(v)}
        />

        <Input
          label="Slug *"
          value={form.slug}
          mono
          onChange={(v: string) => {
            setAutoSlug(false);
            setForm({ ...form, slug: v });
          }}
        />

        <Select
          label="Category *"
          value={form.category}
          options={JOB_CATEGORIES}
          onChange={(v: string) => setForm({ ...form, category: v })}
        />

        <Input
          label="Organization"
          value={form.organization}
          onChange={(v: string) =>
            setForm({ ...form, organization: v })
          }
        />

        <Input
          label="Department"
          value={form.department}
          onChange={(v: string) =>
            setForm({ ...form, department: v })
          }
        />
      </Grid>

      {/* =====================
         DETAILS
      ====================== */}
      <Section title="Job Details">
        <Grid>
          <Input
            label="Total Posts"
            value={form.total_posts}
            onChange={(v: string) =>
              setForm({ ...form, total_posts: v })
            }
          />
          <Input
            label="Salary"
            value={form.salary}
            onChange={(v: string) =>
              setForm({ ...form, salary: v })
            }
          />
          <Input
            label="Qualification"
            value={form.qualification}
            onChange={(v: string) =>
              setForm({ ...form, qualification: v })
            }
          />
          <Input
            label="Age Limit"
            value={form.age_limit}
            onChange={(v: string) =>
              setForm({ ...form, age_limit: v })
            }
          />
          <Input
            label="Application Fee"
            value={form.application_fee}
            onChange={(v: string) =>
              setForm({ ...form, application_fee: v })
            }
          />
          <Input
            label="Selection Process"
            value={form.selection_process}
            onChange={(v: string) =>
              setForm({ ...form, selection_process: v })
            }
          />
        </Grid>

        <Textarea
          label="Summary"
          value={form.summary}
          onChange={(v: string) =>
            setForm({ ...form, summary: v })
          }
        />

        <Textarea
          label="Full Description (HTML allowed)"
          rows={6}
          value={form.full_description}
          onChange={(v: string) =>
            setForm({ ...form, full_description: v })
          }
        />
      </Section>

      {/* =====================
         LINKS
      ====================== */}
      <Section title="Official Links">
        <Grid>
          <Input
            label="Official Website"
            value={form.official_website}
            onChange={(v: string) =>
              setForm({ ...form, official_website: v })
            }
          />
          <Input
            label="Apply Link"
            value={form.apply_link}
            onChange={(v: string) =>
              setForm({ ...form, apply_link: v })
            }
          />
        </Grid>
      </Section>

      {/* =====================
         IMAGE
      ====================== */}
      <Section title="Notification Image">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImageUpload(f);
          }}
        />

        {imageBase64 && (
          <img
            src={imageBase64}
            alt="Notification"
            className="mt-4 max-h-56 rounded border"
          />
        )}
      </Section>

      {/* =====================
         PUBLISH
      ====================== */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.published === 1}
          onChange={(e) =>
            setForm({
              ...form,
              published: e.target.checked ? 1 : 0,
            })
          }
        />
        Published
      </label>
    </div>
  );
}

/* ============================
   UI Helpers
============================= */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 border rounded-xl p-6 space-y-6">
      <h3 className="text-md font-semibold text-slate-800">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        className={`w-full mt-1 border rounded-lg px-3 py-2 ${
          mono ? "font-mono text-sm" : ""
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        rows={rows}
        className="w-full mt-1 border rounded-lg px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        className="w-full mt-1 border rounded-lg px-3 py-2 bg-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
