import mysql from "mysql2/promise";

async function createAdminTable() {
  const connection = await mysql.createConnection({
    host: "itsiksha-db.c7k2cwoo4963.ap-south-1.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "SdKVande007*AWSSQL25",
    database: "itsiksha",
  });

  const sql = `
    CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(16) PRIMARY KEY,

        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,

        session_token VARCHAR(64) DEFAULT NULL,

        role ENUM('superadmin', 'editor', 'viewer') DEFAULT 'superadmin',

        is_active TINYINT(1) DEFAULT 1,

        last_login DATETIME DEFAULT NULL,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;

  await connection.execute(sql);
  await connection.end();

  console.log("✅ admin_users table created successfully");
}

createAdminTable().catch((err) => {
  console.error("❌ Failed to create admin_users table");
  console.error(err);
  process.exit(1);
});
