import mysql from "mysql2/promise";

async function createUEASOrganizationAuthTables() {
  const connection = await mysql.createConnection({
    host: "itsiksha-db.c7k2cwoo4963.ap-south-1.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "SdKVande007*AWSSQL25",
    database: "itsiksha",
  });

  try {
    /* ===============================
       UEAS_organizations
    =============================== */
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS UEAS_organizations (
        id VARCHAR(16) PRIMARY KEY,

        name VARCHAR(200) NOT NULL,
        slug VARCHAR(200) NOT NULL UNIQUE,

        type ENUM('school','college','coaching','other') NOT NULL,

        email VARCHAR(150) NOT NULL,
        mobile VARCHAR(20) NOT NULL,

        address TEXT,
        logo_base64 LONGTEXT,

        status TINYINT(1) DEFAULT 0 COMMENT '0=pending,1=approved,2=blocked',

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        INDEX idx_org_status (status)
      );
    `);

    /* ===============================
       UEAS_organization_users
    =============================== */
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS UEAS_organization_users (
        id VARCHAR(16) PRIMARY KEY,

        org_id VARCHAR(16) NOT NULL,

        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        mobile VARCHAR(20),

        password_hash VARCHAR(255) NOT NULL,
        session_token VARCHAR(64) DEFAULT NULL,

        role ENUM('admin','staff') DEFAULT 'admin',

        is_active TINYINT(1) DEFAULT 1,
        last_login_at DATETIME DEFAULT NULL,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        UNIQUE KEY uniq_org_user_email (org_id, email),
        INDEX idx_org_user_org (org_id),

        CONSTRAINT fk_ueas_org_users_org
          FOREIGN KEY (org_id) REFERENCES UEAS_organizations(id)
          ON DELETE CASCADE
      );
    `);

    /* ===============================
       UEAS_subscriptions
    =============================== */
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS UEAS_subscriptions (
        id VARCHAR(16) PRIMARY KEY,

        org_id VARCHAR(16) NOT NULL,

        plan_name VARCHAR(100) NOT NULL,

        start_date DATE NOT NULL,
        end_date DATE NOT NULL,

        max_exams INT DEFAULT 0,
        max_students INT DEFAULT 0,

        used_exams INT DEFAULT 0,
        used_students INT DEFAULT 0,

        status ENUM('active','expired','cancelled') DEFAULT 'active',

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        INDEX idx_subscription_org (org_id),
        INDEX idx_subscription_status (status),

        CONSTRAINT fk_ueas_subscription_org
          FOREIGN KEY (org_id) REFERENCES UEAS_organizations(id)
          ON DELETE CASCADE
      );
    `);

    console.log("✅ UEAS Organization & Auth tables created successfully");

  } catch (err) {
    console.error("❌ Failed to create UEAS Organization/Auth tables");
    console.error(err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

createUEASOrganizationAuthTables();
