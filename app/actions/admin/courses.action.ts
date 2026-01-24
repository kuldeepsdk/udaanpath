"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/* =====================================================
   COMMON HELPERS
===================================================== */

async function getApiBaseUrl() {
  const h = await headers();
  const host = h.get("host");
  const protocol =
    process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${host}`;
}

async function getAdminHeaders() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session")?.value;
  const adminId = cookieStore.get("admin_id")?.value;

  if (!adminSession || !adminId) {
    throw new Error("Admin session missing");
  }

  return {
    "x-internal-token": process.env.INTERNAL_API_TOKEN!,
    "x-admin-id": adminId,
    "x-admin-session": adminSession,
    "Content-Type": "application/json",
  };
}

/* =====================================================
   COURSES
===================================================== */

export async function fetchAdminCourses({
  page = 1,
  q = "",
}: {
  page?: number;
  q?: string;
}) {
  try {
    const url =
      `${await getApiBaseUrl()}/api/admin/course` +
      `?page=${page}&q=${encodeURIComponent(q)}`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: await getAdminHeaders(),
    });

    if (!res.ok) {
      return { data: [], pagination: null };
    }

    const json = await res.json();
    return {
      data: json.data || [],
      pagination: json.pagination || null,
    };
  } catch (err) {
    console.error("fetchAdminCourses error:", err);
    return { data: [], pagination: null };
  }
}

export async function createCourseAction(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "");
  const is_published = formData.get("is_published") === "on";

  if (!title) throw new Error("Title is required");

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/course`,
    {
      method: "POST",
      headers: await getAdminHeaders(),
      body: JSON.stringify({
        title,
        slug,
        description,
        is_published,
      }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to create course");
  }

  revalidatePath("/secure-console/courses");
  redirect("/secure-console/courses");
}

/* =====================================================
   CHAPTERS
===================================================== */

export async function fetchAdminChapters(courseId: number) {
  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/course/chapter?course_id=${courseId}`,
    {
      cache: "no-store",
      headers: await getAdminHeaders(),
    }
  );

  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export async function createChapterAction(formData: FormData) {
  const course_id = Number(formData.get("course_id"));
  const title = String(formData.get("title") || "").trim();
  const order_no = Number(formData.get("order_no")) || null;

  if (!course_id || !title) return;

  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/course/chapter`,
    {
      method: "POST",
      headers: await getAdminHeaders(),
      body: JSON.stringify({
        course_id,
        title,
        order_no,
      }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Create chapter failed");
    return;
  }

  revalidatePath(`/secure-console/courses/${course_id}`);
  redirect(`/secure-console/courses/${course_id}/chapters`);
}

export async function updateChapterMetaAction(
  chapterUuid: string,
  formData: FormData
) {
  const title = String(formData.get("title") || "").trim();
  const order = Number(formData.get("order"));
  const is_published = formData.get("is_published") === "on";

  if (!title) return;

  await fetch(
    `${await getApiBaseUrl()}/api/admin/course/chapter/meta`,
    {
      method: "POST",
      headers: await getAdminHeaders(),
      body: JSON.stringify({
        chapter_uuid: chapterUuid,
        title,
        order,
        is_published,
      }),
      cache: "no-store",
    }
  );

  revalidatePath("/secure-console/courses");
}

/* =====================================================
   CHAPTER CONTENT
===================================================== */

export async function fetchChapterContent(chapterUuid: string) {
  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/course/chapter-content?chapter_uuid=${chapterUuid}`,
    {
      cache: "no-store",
      headers: await getAdminHeaders(),
    }
  );

  if (!res.ok) return null;
  const json = await res.json();
  return json.data || null;
}

export async function saveChapterContentAction(
  chapterUuid: string,
  formData: FormData
) {
  const content_html = String(formData.get("content_html") || "");
  const video_url = String(formData.get("video_url") || "");
  const notes_pdf = String(formData.get("notes_pdf") || "");

  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/course/chapter-content`,
    {
      method: "POST",
      headers: await getAdminHeaders(),
      body: JSON.stringify({
        chapter_uuid: chapterUuid,
        content_html,
        video_url,
        notes_pdf,
      }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Save chapter content failed");
    return;
  }

  revalidatePath("/secure-console/courses");
}



/* =====================================================
   SINGLE COURSE (EDIT)
===================================================== */

export async function fetchAdminCourse(courseId: number) {
  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/course/${courseId}`,
    {
      cache: "no-store",
      headers: await getAdminHeaders(),
    }
  );

  if (!res.ok) return null;
  const json = await res.json();
  return json.data || null;
}

export async function updateCourseAction(
  courseId: number,
  formData: FormData
) {
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "");
  const is_published = formData.get("is_published") === "on";

  if (!title || !slug) return;

  await fetch(
    `${await getApiBaseUrl()}/api/admin/course/${courseId}`,
    {
      method: "POST",
      headers: await getAdminHeaders(),
      body: JSON.stringify({
        title,
        slug,
        description,
        is_published,
      }),
      cache: "no-store",
    }
  );

  revalidatePath("/secure-console/courses");
}

export async function fetchStudyCategories() {
  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/course/category`, // ✅ FIXED
    {
      headers: await getAdminHeaders(),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("fetchStudyCategories failed:", res.status);
    return [];
  }

  const json = await res.json();
  return json.data || [];
}


export async function fetchCourseCategories(courseId: number) {
  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/course/${courseId}/categories`,
    {
      headers: await getAdminHeaders(),
      cache: "no-store",
    }
  );

  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export async function updateCourseCategoriesAction(
  courseId: number,
  formData: FormData
) {
  // ✅ FIX: correct field name
  const categoryIds = formData
    .getAll("category_ids")
    .map((id) => Number(id))
    .filter(Boolean);

  // 🛡️ Safety check
  if (!Array.isArray(categoryIds)) {
    console.error("Invalid category ids");
    return;
  }

  const res = await fetch(
    `${await getApiBaseUrl()}/api/admin/course/${courseId}/categories`,
    {
      method: "POST",
      headers: await getAdminHeaders(),
      body: JSON.stringify({
        category_ids: categoryIds, // must be array
      }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Update course categories failed:", text);
  }
}
