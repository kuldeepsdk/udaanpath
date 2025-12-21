/**
 * Create Job / Vacancy related tables
 * Run once during setup or migration
 */

const mysql = require("mysql2/promise");

async function run() {
  const connection = await mysql.createConnection({
    host: "itsiksha-db.c7k2cwoo4963.ap-south-1.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "SdKVande007*AWSSQL25",
    database: "itsiksha",
    multipleStatements: true,
  });

  console.log("Connected to DB");

  const sql = `
  /* ===============================
     MAIN JOB POSTS TABLE
  =============================== */
  CREATE TABLE IF NOT EXISTS job_posts (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,

    category ENUM('job','admit_card','result','admission') NOT NULL,

    organization VARCHAR(255),
    department VARCHAR(255),

    summary TEXT,
    full_description LONGTEXT,

    total_posts INT NULL,
    salary VARCHAR(100) NULL,
    qualification VARCHAR(255) NULL,
    age_limit VARCHAR(100) NULL,

    application_fee VARCHAR(100) NULL,
    selection_process VARCHAR(255) NULL,

    official_website VARCHAR(255),
    apply_link VARCHAR(255),

    notification_image_base64 LONGTEXT NULL,

    status ENUM('draft','active','closed','result_out') DEFAULT 'draft',
    published TINYINT DEFAULT 1,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL
  );

  /* ===============================
     IMPORTANT DATES
  =============================== */
  CREATE TABLE IF NOT EXISTS job_important_dates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id VARCHAR(20) NOT NULL,

    event_key VARCHAR(50),
    event_label VARCHAR(100),
    event_date DATE NULL,

    INDEX (job_id),
    CONSTRAINT fk_job_dates
      FOREIGN KEY (job_id) REFERENCES job_posts(id)
      ON DELETE CASCADE
  );

  /* ===============================
     VACANCY BREAKUP
  =============================== */
  CREATE TABLE IF NOT EXISTS job_vacancy_breakup (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id VARCHAR(20) NOT NULL,

    post_name VARCHAR(255),
    total_posts INT,

    INDEX (job_id),
    CONSTRAINT fk_job_vacancy
      FOREIGN KEY (job_id) REFERENCES job_posts(id)
      ON DELETE CASCADE
  );

  /* ===============================
     IMPORTANT LINKS
  =============================== */
  CREATE TABLE IF NOT EXISTS job_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id VARCHAR(20) NOT NULL,

    link_type ENUM(
      'notification',
      'apply_online',
      'admit_card',
      'answer_key',
      'result',
      'counselling',
      'official_site'
    ),
    label VARCHAR(255),
    url VARCHAR(500),

    INDEX (job_id),
    CONSTRAINT fk_job_links
      FOREIGN KEY (job_id) REFERENCES job_posts(id)
      ON DELETE CASCADE
  );

  /* ===============================
     OPTIONAL MEDIA TABLE (FUTURE)
  =============================== */
  CREATE TABLE IF NOT EXISTS job_media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id VARCHAR(20) NOT NULL,

    media_type ENUM('image','pdf'),
    title VARCHAR(255),
    base64_data LONGTEXT,

    INDEX (job_id),
    CONSTRAINT fk_job_media
      FOREIGN KEY (job_id) REFERENCES job_posts(id)
      ON DELETE CASCADE
  );
  `;

  try {
    await connection.query(sql);
    console.log("✅ All job tables created successfully");
  } catch (err) {
    console.error("❌ Error creating tables:", err);
  } finally {
    await connection.end();
    console.log("DB connection closed");
  }
}

run();
