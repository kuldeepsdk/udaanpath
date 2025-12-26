import mysql from "mysql2/promise";

async function createUEASExamCoreTables() {
  const connection = await mysql.createConnection({
    host: "itsiksha-db.c7k2cwoo4963.ap-south-1.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "SdKVande007*AWSSQL25",
    database: "itsiksha",
  });

  try {
    /* ===============================
       UEAS_exams
    =============================== */
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS UEAS_exams (
        id VARCHAR(16) PRIMARY KEY,

        org_id VARCHAR(16) NOT NULL,
        paper_id VARCHAR(16) NOT NULL,

        name VARCHAR(200) NOT NULL,

        exam_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,

        duration_minutes INT NOT NULL,

        show_score_after_exam TINYINT(1) DEFAULT 0,
        show_answers TINYINT(1) DEFAULT 0,

        negative_marking TINYINT(1) DEFAULT 0,

        randomize_questions TINYINT(1) DEFAULT 1,
        randomize_options TINYINT(1) DEFAULT 1,

        status ENUM('scheduled','active','completed') DEFAULT 'scheduled',

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        INDEX idx_exam_org (org_id),
        INDEX idx_exam_date (exam_date),
        INDEX idx_exam_status (status),

        CONSTRAINT fk_ueas_exams_org
          FOREIGN KEY (org_id) REFERENCES UEAS_organizations(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_ueas_exams_paper
          FOREIGN KEY (paper_id) REFERENCES UEAS_papers(id)
          ON DELETE CASCADE
      );
    `);

    /* ===============================
       UEAS_exam_batches
    =============================== */
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS UEAS_exam_batches (
        id VARCHAR(16) PRIMARY KEY,

        exam_id VARCHAR(16) NOT NULL,
        batch_id VARCHAR(16) NOT NULL,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        UNIQUE KEY uniq_exam_batch (exam_id, batch_id),

        INDEX idx_exam_batch_exam (exam_id),
        INDEX idx_exam_batch_batch (batch_id),

        CONSTRAINT fk_ueas_exam_batches_exam
          FOREIGN KEY (exam_id) REFERENCES UEAS_exams(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_ueas_exam_batches_batch
          FOREIGN KEY (batch_id) REFERENCES UEAS_batches(id)
          ON DELETE CASCADE
      );
    `);

    /* ===============================
       UEAS_exam_students
    =============================== */
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS UEAS_exam_students (
        id VARCHAR(16) PRIMARY KEY,

        exam_id VARCHAR(16) NOT NULL,
        student_id VARCHAR(16) NOT NULL,

        status ENUM(
          'not_started',
          'in_progress',
          'submitted',
          'absent',
          'disqualified'
        ) DEFAULT 'not_started',

        start_time DATETIME DEFAULT NULL,
        submit_time DATETIME DEFAULT NULL,

        tab_switch_count INT DEFAULT 0,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        UNIQUE KEY uniq_exam_student (exam_id, student_id),

        INDEX idx_es_exam (exam_id),
        INDEX idx_es_student (student_id),
        INDEX idx_es_status (status),

        CONSTRAINT fk_ueas_exam_students_exam
          FOREIGN KEY (exam_id) REFERENCES UEAS_exams(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_ueas_exam_students_student
          FOREIGN KEY (student_id) REFERENCES UEAS_students(id)
          ON DELETE CASCADE
      );
    `);

    /* ===============================
       UEAS_student_answers
    =============================== */
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS UEAS_student_answers (
        id VARCHAR(16) PRIMARY KEY,

        exam_id VARCHAR(16) NOT NULL,
        student_id VARCHAR(16) NOT NULL,
        question_id VARCHAR(16) NOT NULL,

        selected_options JSON DEFAULT NULL,

        is_correct TINYINT(1) DEFAULT NULL,
        marks_awarded DECIMAL(5,2) DEFAULT 0,

        answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        UNIQUE KEY uniq_answer (exam_id, student_id, question_id),

        INDEX idx_ans_exam_student (exam_id, student_id),
        INDEX idx_ans_question (question_id),

        CONSTRAINT fk_ueas_answers_exam
          FOREIGN KEY (exam_id) REFERENCES UEAS_exams(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_ueas_answers_student
          FOREIGN KEY (student_id) REFERENCES UEAS_students(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_ueas_answers_question
          FOREIGN KEY (question_id) REFERENCES UEAS_questions(id)
          ON DELETE CASCADE
      );
    `);

    /* ===============================
    UEAS_exam_results (FIXED)
    =============================== */
    await connection.execute(`
    CREATE TABLE IF NOT EXISTS UEAS_exam_results (
        id VARCHAR(16) PRIMARY KEY,

        exam_id VARCHAR(16) NOT NULL,
        student_id VARCHAR(16) NOT NULL,

        total_marks DECIMAL(6,2) NOT NULL,
        obtained_marks DECIMAL(6,2) NOT NULL,

        percentage DECIMAL(5,2),

        rank_position INT DEFAULT NULL,

        result_status ENUM('pass','fail') DEFAULT NULL,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        UNIQUE KEY uniq_exam_result (exam_id, student_id),

        INDEX idx_result_exam (exam_id),
        INDEX idx_result_student (student_id),

        CONSTRAINT fk_ueas_results_exam
        FOREIGN KEY (exam_id) REFERENCES UEAS_exams(id)
        ON DELETE CASCADE,

        CONSTRAINT fk_ueas_results_student
        FOREIGN KEY (student_id) REFERENCES UEAS_students(id)
        ON DELETE CASCADE
    );
    `);


    /* ===============================
       UEAS_exam_activity_logs
    =============================== */
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS UEAS_exam_activity_logs (
        id VARCHAR(16) PRIMARY KEY,

        exam_id VARCHAR(16) NOT NULL,
        student_id VARCHAR(16) NOT NULL,

        event_type ENUM(
          'tab_switch',
          'refresh',
          'logout',
          'login',
          'fullscreen_exit'
        ) NOT NULL,

        event_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        metadata JSON DEFAULT NULL,

        INDEX idx_log_exam (exam_id),
        INDEX idx_log_student (student_id),

        CONSTRAINT fk_ueas_logs_exam
          FOREIGN KEY (exam_id) REFERENCES UEAS_exams(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_ueas_logs_student
          FOREIGN KEY (student_id) REFERENCES UEAS_students(id)
          ON DELETE CASCADE
      );
    `);

    console.log("✅ UEAS Exam Core tables created successfully");

  } catch (err) {
    console.error("❌ Failed to create UEAS Exam Core tables");
    console.error(err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

createUEASExamCoreTables();
