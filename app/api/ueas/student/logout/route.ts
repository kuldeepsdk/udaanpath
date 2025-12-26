import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { validateInternalApi } from "@/lib/apiAuth";

export async function POST(req: Request) {
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

  await db.execute(
    `
    UPDATE UEAS_students
    SET session_token = NULL
    WHERE session_token = ?
    `,
    [token]
  );

  return NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 }
  );
}
