import mysql from "mysql2/promise";

async function createUEASQuestionPaperTables() {
  const connection = await mysql.createConnection({
    host: "itsiksha-db.c7k2cwoo4963.ap-south-1.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "SdKVande007*AWSSQL25",
    database: "itsiksha",
  });

  try {
    /* ===============================
       UEAS_papers
    =============================== */
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS UEAS_papers (
        id VARCHAR(16) PRIMARY KEY,

        org_id VARCHAR(16) NOT NULL,

        name VARCHAR(200) NOT NULL,
        description TEXT,

        total_marks DECIMAL(6,2) DEFAULT 0,
        total_questions INT DEFAULT 0,

        default_duration_minutes INT DEFAULT 60,

        instructions LONGTEXT
        COMMENT 'HTML supported instructions',

        is_active TINYINT(1) DEFAULT 1,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        INDEX idx_paper_org (org_id),
        INDEX idx_paper_active (is_active),

        CONSTRAINT fk_ueas_papers_org
          FOREIGN KEY (org_id) REFERENCES UEAS_organizations(id)
          ON DELETE CASCADE
      );
    `);

    /* ===============================
       UEAS_paper_questions
    =============================== */
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS UEAS_paper_questions (
        id VARCHAR(16) PRIMARY KEY,

        paper_id VARCHAR(16) NOT NULL,
        question_id VARCHAR(16) NOT NULL,

        question_order INT DEFAULT 0,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        UNIQUE KEY uniq_paper_question (paper_id, question_id),

        INDEX idx_pq_paper (paper_id),
        INDEX idx_pq_question (question_id),

        CONSTRAINT fk_ueas_pq_paper
          FOREIGN KEY (paper_id) REFERENCES UEAS_papers(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_ueas_pq_question
          FOREIGN KEY (question_id) REFERENCES UEAS_questions(id)
          ON DELETE CASCADE
      );
    `);

    console.log("✅ UEAS Question Paper tables created successfully");

  } catch (err) {
    console.error("❌ Failed to create UEAS Question Paper tables");
    console.error(err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

createUEASQuestionPaperTables();
