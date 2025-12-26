import mysql from "mysql2/promise";

async function createUEASStudentBatchTables() {
  const connection = await mysql.createConnection({
    host: "itsiksha-db.c7k2cwoo4963.ap-south-1.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "SdKVande007*AWSSQL25",
    database: "itsiksha",
  });

  try {
    /* ===============================
       UEAS_batches
    =============================== */
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS UEAS_batches (
        id VARCHAR(16) PRIMARY KEY,

        org_id VARCHAR(16) NOT NULL,

        name VARCHAR(150) NOT NULL,
        description TEXT,

        is_active TINYINT(1) DEFAULT 1,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        INDEX idx_batch_org (org_id),
        INDEX idx_batch_active (is_active),

        CONSTRAINT fk_ueas_batches_org
          FOREIGN KEY (org_id) REFERENCES UEAS_organizations(id)
          ON DELETE CASCADE
      );
    `);

    /* ===============================
       UEAS_students
    =============================== */
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS UEAS_students (
        id VARCHAR(16) PRIMARY KEY,

        org_id VARCHAR(16) NOT NULL,

        roll_no VARCHAR(50),
        name VARCHAR(150) NOT NULL,

        email VARCHAR(150),
        mobile VARCHAR(20),

        password_hash VARCHAR(255) NOT NULL,

        extra_data JSON DEFAULT NULL
        COMMENT 'father_name, dob, category, etc',

        is_active TINYINT(1) DEFAULT 1,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        UNIQUE KEY uniq_student_roll (org_id, roll_no),
        INDEX idx_student_org (org_id),
        INDEX idx_student_active (is_active),

        CONSTRAINT fk_ueas_students_org
          FOREIGN KEY (org_id) REFERENCES UEAS_organizations(id)
          ON DELETE CASCADE
      );
    `);

    /* ===============================
       UEAS_batch_students
    =============================== */
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS UEAS_batch_students (
        id VARCHAR(16) PRIMARY KEY,

        batch_id VARCHAR(16) NOT NULL,
        student_id VARCHAR(16) NOT NULL,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        UNIQUE KEY uniq_batch_student (batch_id, student_id),

        INDEX idx_bs_batch (batch_id),
        INDEX idx_bs_student (student_id),

        CONSTRAINT fk_ueas_bs_batch
          FOREIGN KEY (batch_id) REFERENCES UEAS_batches(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_ueas_bs_student
          FOREIGN KEY (student_id) REFERENCES UEAS_students(id)
          ON DELETE CASCADE
      );
    `);

    console.log("✅ UEAS Student & Batch tables created successfully");

  } catch (err) {
    console.error("❌ Failed to create UEAS Student/Batch tables");
    console.error(err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

createUEASStudentBatchTables();
