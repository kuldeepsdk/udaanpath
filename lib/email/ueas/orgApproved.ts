import { baseEmailTemplate } from "../baseTemplate";

export function ueasOrgApprovedTemplate(orgName: string): string {
  return baseEmailTemplate({
    title: "Institute Approved 🎉",
    body: `
      <p>
        Congratulations! Your institute <b>${orgName}</b> has been approved.
      </p>

      <p>
        You can now login and start creating exams on UEAS.
      </p>

      <p style="margin-top:20px;">
        👉 <a href="https://udaanpath.com/ueas/org/login"
             style="color:#1e40af;font-weight:bold;">
             Login to UEAS
           </a>
      </p>
    `,
  });
}
