"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createJobAction } from "@/app/actions/admin/jobs.create.action";

/* -----------------------------
   Utils
------------------------------ */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

type JobForm = {
  title: string;
  slug: string;
  category: string;
  organization: string;
  department: string;
  summary: string;
  full_description: string;
  total_posts: string;
  salary: string;
  qualification: string;
  age_limit: string;
  application_fee: string;
  selection_process: string;
  official_website: string;
  apply_link: string;
  published: number;
};

export default function NewJobPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [autoSlug, setAutoSlug] = useState<boolean>(true);
  //const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<JobForm>({
    title: "",
    slug: "",
    category: "",
    organization: "",
    department: "",
    summary: "",
    full_description: "",
    total_posts: "",
    salary: "",
    qualification: "",
    age_limit: "",
    application_fee: "",
    selection_process: "",
    official_website: "",
    apply_link: "",
    published: 1,
  });

  const JOB_CATEGORIES = [
    { value: "job", label: "Job / Vacancy" },
    { value: "admit_card", label: "Admit Card" },
    { value: "result", label: "Result" },
    { value: "admission", label: "Admission" },
  ];

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
  

  async function uploadToCloudinary(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "udaanpath_jobs");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/domixqd2u/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    console.log("uploadToCloudinary:", data);

    return data.secure_url as string;
  }


  /* -----------------------------
     Save
  ------------------------------ */
  function handleSave() {
  startTransition(async () => {
    const payload: any = {
      ...form,
    };

    if (imageUrl) {
      payload.notification_image_base64 = imageUrl;
    }

    const res = await createJobAction(payload);
    router.push(`/secure-console/jobs/${res.jobId}/edit`);
  });
}


  return (
    <div className="max-w-6xl space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Create New Vacancy
          </h1>
          <p className="text-sm text-slate-500">
            Add government job / admission / result notification
          </p>
        </div>

        <button
          disabled={pending || uploading}
          onClick={handleSave}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm
                    hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "Saving..." : uploading ? "Uploading image..." : "Save Vacancy"}
        </button>

      </div>

      {/* BASIC INFO */}
      <Section title="Basic Information">
        <Grid>
          <Input
            label="Title *"
            value={form.title}
            onChange={handleTitleChange}
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
            onChange={(v: string) => setForm({ ...form, category: v })}
            options={JOB_CATEGORIES}
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
      </Section>

      {/* DETAILS */}
      <Section title="Vacancy Details">
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
            onChange={(v: string) => setForm({ ...form, salary: v })}
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
          onChange={(v: string) => setForm({ ...form, summary: v })}
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

      {/* LINKS */}
      <Section title="Important Links">
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

      {/* IMAGE */}
      <Section title="Notification Image">
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;

            setUploading(true);
            const url = await uploadToCloudinary(f);
            setImageUrl(url);
            setUploading(false);
          }}
        />

        {uploading && (
          <p className="text-sm text-slate-500 mt-2">Uploading image…</p>
        )}

        {imageUrl && (
          <img
            src={imageUrl}
            className="mt-4 max-h-56 rounded border"
          />
        )}
      </Section>


      {/* PUBLISH */}
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
        Publish immediately
      </label>
    </div>
  );
}

/* ============================
   Helper Components (Typed)
============================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">
        {title}
      </h2>
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

type InputProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
  placeholder?: string;
};

function Input({
  label,
  value,
  onChange,
  mono,
  placeholder,
}: InputProps) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        className={`w-full mt-1 border rounded-lg px-3 py-2 ${
          mono ? "font-mono text-sm" : ""
        }`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

type TextareaProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
};

function Textarea({
  label,
  value,
  onChange,
  rows = 4,
}: TextareaProps) {
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

type SelectProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
};

function Select({
  label,
  value,
  onChange,
  options,
}: SelectProps) {
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
        <option value="">Select category</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
