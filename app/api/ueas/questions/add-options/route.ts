//app\api\ueas\questions\add-options\route.ts

import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import crypto from "crypto";
import { validateInternalApi } from "@/lib/apiAuth";

export async function POST(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 });
  }

  const { question_id, options } = await req.json();

  if (!question_id || !Array.isArray(options) || options.length < 2) {
    return NextResponse.json(
      { success: false, error: "question_id and options[] required" },
      { status: 400 }
    );
  }

  const db = await getDB();

  for (let i = 0; i < options.length; i++) {
    const opt = options[i];

    await db.execute(
      `
      INSERT INTO UEAS_question_options
      (id, question_id, option_text, is_correct, option_order)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        crypto.randomUUID().slice(0, 16),
        question_id,
        opt.text,
        opt.is_correct ? 1 : 0,
        i + 1,
      ]
    );
  }

  return NextResponse.json(
    { success: true, message: "Options added successfully" },
    { status: 200 }
  );
}
