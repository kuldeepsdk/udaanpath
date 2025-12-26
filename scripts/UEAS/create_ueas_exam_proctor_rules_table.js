import mysql from "mysql2/promise";

async function createUEASProctorRulesTable() {
  const connection = await mysql.createConnection({
    host: "itsiksha-db.c7k2cwoo4963.ap-south-1.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "SdKVande007*AWSSQL25",
    database: "itsiksha",
  });

  const sql = `
    CREATE TABLE IF NOT EXISTS UEAS_exam_proctor_rules (
      id VARCHAR(16) PRIMARY KEY,

      exam_id VARCHAR(16) NOT NULL,

      max_tab_switches INT DEFAULT 5,
      max_fullscreen_exit INT DEFAULT 2,
      max_refresh INT DEFAULT 5,

      auto_disqualify TINYINT(1) DEFAULT 1,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      UNIQUE KEY uniq_exam_rules (exam_id),

      CONSTRAINT fk_ueas_rules_exam
        FOREIGN KEY (exam_id) REFERENCES UEAS_exams(id)
        ON DELETE CASCADE
    );
  `;

  await connection.execute(sql);
  await connection.end();
  console.log("✅ UEAS_exam_proctor_rules table created successfully");
}

createUEASProctorRulesTable().catch((err) => {
  console.error("❌ Failed to create UEAS_exam_proctor_rules table");
  console.error(err);
  process.exit(1);
});
