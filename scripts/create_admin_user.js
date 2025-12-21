const mysql = require("mysql2/promise");
const crypto = require("crypto");

// 🔐 CHANGE THESE BEFORE RUNNING
const ADMIN_EMAIL = "admin@udaanpath.com";
const ADMIN_PASSWORD = "ChangeThisStrongPassword!";
const ADMIN_ROLE = "superadmin"; // superadmin | editor | viewer

function generateAdminId() {
  // 16-character uppercase hex string
  return crypto.randomBytes(8).toString("hex").toUpperCase();
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function createAdmin() {
  const connection = await mysql.createConnection({
    host: "itsiksha-db.c7k2cwoo4963.ap-south-1.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "SdKVande007*AWSSQL25",
    database: "itsiksha",
  });

  // 🔍 Check if admin already exists
  const [existing] = await connection.execute(
    "SELECT id FROM admin_users WHERE email = ? LIMIT 1",
    [ADMIN_EMAIL]
  );

  if (existing.length > 0) {
    console.error("❌ Admin with this email already exists");
    await connection.end();
    process.exit(1);
  }

  const adminId = generateAdminId();
  const passwordHash = hashPassword(ADMIN_PASSWORD);

  await connection.execute(
    `
    INSERT INTO admin_users
      (id, email, password_hash, role, is_active)
    VALUES
      (?, ?, ?, ?, 1)
    `,
    [adminId, ADMIN_EMAIL, passwordHash, ADMIN_ROLE]
  );

  await connection.end();

  console.log("✅ Admin user created successfully");
  console.log("🆔 Admin ID:", adminId);
  console.log("📧 Email:", ADMIN_EMAIL);
  console.log("🔐 Role:", ADMIN_ROLE);
}

createAdmin().catch((err) => {
  console.error("❌ Failed to create admin user");
  console.error(err);
  process.exit(1);
});
