// app\api\ueas\org\register\send-otp\route.ts
import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import crypto from "crypto";
import { validateInternalApi } from "@/lib/apiAuth";
import { sendEmail } from "@/lib/mailer";
import { ueasOrgOtpTemplate } from "@/lib/email";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  const auth = await validateInternalApi(req);
  if (!auth.ok) return auth.response;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const {
    org_name,
    org_type,
    city,
    state,
    admin_name,
    email,
    mobile,
    password,
  } = body;

  if (
    !org_name ||
    !org_type ||
    !city ||
    !state ||
    !admin_name ||
    !email ||
    !mobile ||
    !password
  ) {
    return NextResponse.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  const db = await getDB();

  // 🔒 Prevent duplicate org / admin email
  const [exists]: any = await db.execute(
    `
    SELECT id FROM UEAS_organization_users
    WHERE email = ?
    LIMIT 1
    `,
    [email]
  );

  if (exists.length) {
    return NextResponse.json(
      { success: false, error: "Email already registered" },
      { status: 409 }
    );
  }

  const session_id = crypto.randomUUID().slice(0, 36);
  const otp = generateOTP();
  const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  const password_hash = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  // ⛳ Upsert session (email = unique logical key)
  await db.execute(
    `
    INSERT INTO UEAS_org_registration_sessions
      (id, org_name, org_type, city, state, admin_name,
       email, mobile, password_hash, otp, otp_expires_at, verified)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    ON DUPLICATE KEY UPDATE
      org_name = VALUES(org_name),
      org_type = VALUES(org_type),
      city = VALUES(city),
      state = VALUES(state),
      admin_name = VALUES(admin_name),
      mobile = VALUES(mobile),
      password_hash = VALUES(password_hash),
      otp = VALUES(otp),
      otp_expires_at = VALUES(otp_expires_at),
      verified = 0
    `,
    [
      session_id,
      org_name,
      org_type,
      city,
      state,
      admin_name,
      email,
      mobile,
      password_hash,
      otp,
      otp_expires_at,
    ]
  );

  // 📧 TODO: integrate email service
  console.log(`📧 OTP for ${email}: ${otp}`);

  
    await sendEmail({
    to: email,
    subject: "Verify your institute email – UEAS",
    html: ueasOrgOtpTemplate({ otp }),
    });

  return NextResponse.json(
    {
      success: true,
      session_id,
      message: "OTP sent to registered email",
    },
    { status: 200 }
  );
}
