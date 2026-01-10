import mysql from "mysql2/promise";

async function seedExpectedJobs2026() {
  const connection = await mysql.createConnection({
    host: "itsiksha-db.c7k2cwoo4963.ap-south-1.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "SdKVande007*AWSSQL25",
    database: "itsiksha",
  });

  /* -----------------------------------------------------
     Helper: get source_id from source_code
  ----------------------------------------------------- */
  async function getSourceId(sourceCode) {
    const [rows] = await connection.execute(
      "SELECT id FROM job_sources WHERE source_code = ? LIMIT 1",
      [sourceCode]
    );
    if (!rows.length) {
      throw new Error(`Source not found: ${sourceCode}`);
    }
    return rows[0].id;
  }

  /* -----------------------------------------------------
     Top Expected Jobs for 2026
  ----------------------------------------------------- */
  const expectedJobs = [
    /* ===== CENTRAL EXAMS ===== */
    { job_key: "upsc-cse-2026", title: "UPSC Civil Services Examination 2026", src: "SRC_UPSC", month: "Feb-Mar" },
    { job_key: "ssc-cgl-2026", title: "SSC CGL Recruitment 2026", src: "SRC_SSC", month: "Apr-May" },
    { job_key: "ssc-chsl-2026", title: "SSC CHSL Recruitment 2026", src: "SRC_SSC", month: "May-Jun" },
    { job_key: "ssc-gd-2026", title: "SSC GD Constable Recruitment 2026", src: "SRC_SSC", month: "Nov-Dec" },
    { job_key: "rrb-ntpc-2026", title: "RRB NTPC Recruitment 2026", src: "SRC_RRB", month: "Jun-Jul" },
    { job_key: "rrb-group-d-2026", title: "RRB Group D Recruitment 2026", src: "SRC_RAILWAY_BOARD", month: "Jul-Aug" },
    { job_key: "nta-ugc-net-2026", title: "UGC NET 2026", src: "SRC_NTA", month: "Mar-Apr" },
    { job_key: "epfo-ao-eo-2026", title: "EPFO AO/EO Recruitment 2026", src: "SRC_EPFO", month: "Aug-Sep" },

    /* ===== BANKING ===== */
    { job_key: "ibps-po-2026", title: "IBPS PO Recruitment 2026", src: "SRC_IBPS", month: "Aug" },
    { job_key: "ibps-clerk-2026", title: "IBPS Clerk Recruitment 2026", src: "SRC_IBPS", month: "Jul-Aug" },
    { job_key: "ibps-rrb-2026", title: "IBPS RRB Recruitment 2026", src: "SRC_IBPS", month: "Jun-Jul" },
    { job_key: "sbi-po-2026", title: "SBI PO Recruitment 2026", src: "SRC_SBI", month: "Sep-Oct" },
    { job_key: "sbi-clerk-2026", title: "SBI Clerk Recruitment 2026", src: "SRC_SBI", month: "Nov-Dec" },
    { job_key: "rbi-grade-b-2026", title: "RBI Grade B Recruitment 2026", src: "SRC_RBI", month: "May-Jun" },

    /* ===== INSURANCE ===== */
    { job_key: "lic-aao-ao-2026", title: "LIC AAO / AO Recruitment 2026", src: "SRC_LIC", month: "Jan-Feb" },
    { job_key: "aic-mt-2026", title: "AIC Management Trainee 2026", src: "SRC_AIC", month: "Feb-Mar" },
    { job_key: "niacl-ao-2026", title: "NIACL AO Recruitment 2026", src: "SRC_NIACL", month: "Aug-Sep" },

    /* ===== DEFENCE ===== */
    { job_key: "nda-1-2026", title: "NDA I Examination 2026", src: "SRC_UPSC", month: "Dec-2025" },
    { job_key: "nda-2-2026", title: "NDA II Examination 2026", src: "SRC_UPSC", month: "May-Jun" },
    { job_key: "cds-1-2026", title: "CDS I Examination 2026", src: "SRC_UPSC", month: "Dec-2025" },
    { job_key: "cds-2-2026", title: "CDS II Examination 2026", src: "SRC_UPSC", month: "May-Jun" },
    { job_key: "agniveer-2026", title: "Agniveer Recruitment 2026", src: "SRC_ARMY", month: "Feb-Mar" },
    { job_key: "airforce-group-x-y-2026", title: "Air Force Group X & Y Recruitment 2026", src: "SRC_AIRFORCE", month: "Jan-Feb" },

    /* ===== PSU ===== */
    { job_key: "ongc-aee-2026", title: "ONGC Assistant Executive Engineer 2026", src: "SRC_ONGC", month: "May-Jun" },
    { job_key: "ntpc-et-2026", title: "NTPC Engineering Trainee 2026", src: "SRC_NTPC", month: "Jan-Feb" },
    { job_key: "bhel-et-2026", title: "BHEL Engineer Trainee 2026", src: "SRC_BHEL", month: "Feb-Mar" },
    { job_key: "hal-apprentice-2026", title: "HAL Apprentice Recruitment 2026", src: "SRC_HAL", month: "Aug-Sep" },

    /* ===== MP STATE ===== */
    { job_key: "mppsc-pre-2026", title: "MPPSC State Service Prelims 2026", src: "SRC_MPPSC", month: "Jan-Feb" },
    { job_key: "mp-police-constable-2026", title: "MP Police Constable Recruitment 2026", src: "SRC_MPESB", month: "Mar-Apr" },
    { job_key: "mp-group-4-2026", title: "MP Group 4 Recruitment 2026", src: "SRC_MPESB", month: "May-Jun" },
    { job_key: "mp-teacher-eligibility-2026", title: "MP Teacher Eligibility Test 2026", src: "SRC_MPESB", month: "Jul-Aug" }
  ];

  /* -----------------------------------------------------
     Insert Expected Jobs
  ----------------------------------------------------- */
  for (const job of expectedJobs) {
    const sourceId = await getSourceId(job.src);

    const sql = `
      INSERT INTO expected_jobs
      (job_key, title, source_id, expected_month, expected_year, status, seo_page_created)
      VALUES (?, ?, ?, ?, 2026, 'waiting', 0)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        expected_month = VALUES(expected_month),
        expected_year = 2026,
        status = 'waiting';
    `;

    await connection.execute(sql, [
      job.job_key,
      job.title,
      sourceId,
      job.month,
    ]);
  }

  await connection.end();
  console.log("✅ expected_jobs (Top 2026 exams) seeded successfully");
}

seedExpectedJobs2026().catch((err) => {
  console.error("❌ Failed to seed expected_jobs");
  console.error(err);
  process.exit(1);
});
