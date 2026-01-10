import mysql from "mysql2/promise";

async function createJobMonitoringTables() {
  const connection = await mysql.createConnection({
    host: "itsiksha-db.c7k2cwoo4963.ap-south-1.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "SdKVande007*AWSSQL25",
    database: "itsiksha",
  });

  /* =====================================================
     TABLE 1: job_sources
  ===================================================== */
  const createJobSourcesTable = `
    CREATE TABLE source_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    source_id BIGINT NOT NULL,
    source_name VARCHAR(255) NOT NULL,

    alert_type ENUM(
      'content_changed',
      'status_changed',
      'error',
      'manual_note'
    ) NOT NULL,

    message TEXT NOT NULL,

    detected_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    is_resolved TINYINT(1) DEFAULT 0,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (source_id)
      REFERENCES job_sources(id)
      ON DELETE CASCADE
  );

  `;

  

  try {
    await connection.execute(createJobSourcesTable);
    console.log("✅ job_sources table created successfully");

   
  } finally {
    await connection.end();
  }
}

createJobMonitoringTables().catch((err) => {
  console.error("❌ Failed to create job monitoring tables");
  console.error(err);
  process.exit(1);
});
