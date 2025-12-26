interface BaseTemplateParams {
  title: string;
  body: string;
}

export function baseEmailTemplate({ title, body }: BaseTemplateParams): string {
  return `
  <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:30px">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden">
      
      <!-- Header -->
      <div style="background:#1e40af;color:#ffffff;padding:20px">
        <h2 style="margin:0;">UdaanPath</h2>
        <p style="margin:4px 0 0;font-size:13px;">
          Examination & Assessment Platform
        </p>
      </div>

      <!-- Content -->
      <div style="padding:24px;color:#1f2937">
        <h3 style="margin-top:0;">${title}</h3>
        ${body}
      </div>

      <!-- Footer -->
      <div style="padding:16px;background:#f1f5f9;color:#64748b;font-size:12px;text-align:center">
        © ${new Date().getFullYear()} UdaanPath • All rights reserved
      </div>

    </div>
  </div>
  `;
}
