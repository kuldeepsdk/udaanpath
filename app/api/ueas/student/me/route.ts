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
    SELECT id, name, roll_no, email, mobile
    FROM UEAS_students
    WHERE session_token = ?
    LIMIT 1
    `,
    [token]
  );

  if (!rows || rows.length === 0) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { success: true, student: rows[0] },
    { status: 200 }
  );
}
