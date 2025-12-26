import { baseEmailTemplate } from "../baseTemplate";

export function ueasOrgRejectedTemplate(reason?: string): string {
  return baseEmailTemplate({
    title: "Institute Registration Update",
    body: `
      <p>
        Thank you for your interest in UEAS.
      </p>

      <p>
        Unfortunately, your institute registration could not be approved.
      </p>

      ${
        reason
          ? `<p><b>Reason:</b> ${reason}</p>`
          : ""
      }

      <p style="margin-top:20px;">
        You may contact support for further clarification.
      </p>
    `,
  });
}
