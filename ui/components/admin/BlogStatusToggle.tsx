"use client";

import { toggleBlogStatusAction } from "@/app/actions/admin/blogs.mutate.action";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function BlogStatusToggle({
  blogId,
  published,
}: {
  blogId: string;   // 👈 keep string-safe
  published: number;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await toggleBlogStatusAction(blogId, published ? 0 : 1);
          router.refresh(); // 🔥 THIS IS THE KEY
        })
      }
      className={`px-2 py-1 rounded text-xs font-medium ${
        published
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
      } ${pending ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {pending ? "Updating..." : published ? "Published" : "Draft"}
    </button>
  );
}
