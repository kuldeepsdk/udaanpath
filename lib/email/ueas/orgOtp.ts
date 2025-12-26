// lib\email\ueas\orgOtp.ts
import { baseEmailTemplate } from "../baseTemplate";

interface OrgOtpParams {
  otp: string;
  validityMinutes?: number;
}

export function ueasOrgOtpTemplate({
  otp,
  validityMinutes = 10,
}: OrgOtpParams): string {
  return baseEmailTemplate({
    title: "Verify Your Institute Email",
    body: `
      <p>
        Thank you for registering your institute on <b>UEAS</b>.
      </p>

      <p>
        Your One-Time Password (OTP) is:
      </p>

      <div style="
        font-size:32px;
        font-weight:bold;
        letter-spacing:4px;
        margin:20px 0;
        color:#1e40af;
      ">
        ${otp}
      </div>

      <p>
        This OTP is valid for <b>${validityMinutes} minutes</b>.
        Please do not share it with anyone.
      </p>

      <p style="margin-top:24px;">
        If you did not request this, you can safely ignore this email.
      </p>
    `,
  });
}
