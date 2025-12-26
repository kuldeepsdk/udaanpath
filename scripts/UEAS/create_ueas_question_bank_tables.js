import mysql from "mysql2/promise";

async function createUEASQuestionBankTables() {
  const connection = await mysql.createConnection({
    host: "itsiksha-db.c7k2cwoo4963.ap-south-1.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "SdKVande007*AWSSQL25",
    database: "itsiksha",
  });

  try {
    /* ===============================
       UEAS_questions
    =============================== */
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS UEAS_questions (
        id VARCHAR(16) PRIMARY KEY,

        org_id VARCHAR(16) NOT NULL,

        question_text LONGTEXT NOT NULL
        COMMENT 'HTML supported question text',

        question_type ENUM('mcq_single','mcq_multi') NOT NULL,

        marks DECIMAL(5,2) NOT NULL DEFAULT 1.0,
        negative_marks DECIMAL(5,2) DEFAULT 0.0,

        difficulty ENUM('easy','medium','hard') DEFAULT 'medium',

        subject VARCHAR(100),
        topic VARCHAR(150),

        is_active TINYINT(1) DEFAULT 1,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        INDEX idx_question_org (org_id),
        INDEX idx_question_type (question_type),
        INDEX idx_question_active (is_active),

        CONSTRAINT fk_ueas_questions_org
          FOREIGN KEY (org_id) REFERENCES UEAS_organizations(id)
          ON DELETE CASCADE
      );
    `);

    /* ===============================
       UEAS_question_options
    =============================== */
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS UEAS_question_options (
        id VARCHAR(16) PRIMARY KEY,

        question_id VARCHAR(16) NOT NULL,

        option_text TEXT NOT NULL,
        is_correct TINYINT(1) DEFAULT 0,

        option_order INT DEFAULT 0,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        INDEX idx_option_question (question_id),

        CONSTRAINT fk_ueas_qoptions_question
          FOREIGN KEY (question_id) REFERENCES UEAS_questions(id)
          ON DELETE CASCADE
      );
    `);

    console.log("✅ UEAS Question Bank tables created successfully");

  } catch (err) {
    console.error("❌ Failed to create UEAS Question Bank tables");
    console.error(err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

createUEASQuestionBankTables();
