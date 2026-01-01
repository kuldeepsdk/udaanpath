"use server";

export async function studentExamLoginAction(payload: {
  exam_id: string;
  roll_no: string;
  password: string;
}) {
  const res = await fetch(
    `${process.env.INTERNAL_API_BASE_URL}/api/ueas/student/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-token": process.env.INTERNAL_API_TOKEN!,
      },
      body: JSON.stringify({
        exam_id: payload.exam_id,
        roll_no: payload.roll_no,
        password: payload.password,
      }),
      cache: "no-store", // 🔒 VERY IMPORTANT
    }
  );

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok || !data?.success) {
    throw new Error(data?.error || "Login failed");
  }

  /* 
    Return ONLY what frontend needs.
    Do NOT store token here.
  */
  return {
    token: data.token,
    student: data.student,
    exam_access: data.exam_access,
  };
}
