"use client";

import { deleteBlogAction } from "@/app/actions/admin/blogs.mutate.action";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteBlogButton({
  blogId,
}: {
  blogId: string; // ✅ string (VARCHAR-safe)
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this blog permanently?")) return;

        startTransition(async () => {
          await deleteBlogAction(blogId);
          router.refresh(); // 🔥 IMPORTANT: refresh list
        });
      }}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
