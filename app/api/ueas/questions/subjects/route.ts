// app/api/ueas/questions/subjects/route.ts
import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

export async function GET(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing token" },
      { status: 401 }
    );
  }

  const db = await getDB();

  const [rows]: any = await db.execute(
    `
    SELECT DISTINCT q.subject
    FROM UEAS_questions q
    JOIN UEAS_organization_users u ON u.org_id = q.org_id
    WHERE u.session_token = ?
      AND q.subject IS NOT NULL
    ORDER BY q.subject
    `,
    [token]
  );

  return NextResponse.json({
    success: true,
    subjects: rows.map((r: any) => r.subject),
  });
}
