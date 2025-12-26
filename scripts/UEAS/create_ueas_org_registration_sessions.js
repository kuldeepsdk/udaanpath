import mysql from "mysql2/promise";

async function createUEASOrgResisterSessionTables() {
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
      CREATE TABLE UEAS_org_registration_sessions (
        id VARCHAR(36) PRIMARY KEY,

        org_name VARCHAR(200),
        org_type VARCHAR(50),
        city VARCHAR(100),
        state VARCHAR(100),

        admin_name VARCHAR(150),
        email VARCHAR(150),
        mobile VARCHAR(15),

        password_hash VARCHAR(255),

        otp VARCHAR(6),
        otp_expires_at DATETIME,

        verified TINYINT(1) DEFAULT 0,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

    `);

    
    console.log("✅ UEAS Org Register Session tables created successfully");

  } catch (err) {
    console.error("❌ Failed to create UEAS Org Register Session tables");
    console.error(err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

createUEASOrgResisterSessionTables();
