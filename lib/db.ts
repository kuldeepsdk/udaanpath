// lib/db.ts
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

let pool: mysql.Pool;

export function getDB() {
  if (!pool) {
    const caPath = path.join(process.cwd(), "global-bundle.pem");

    pool = mysql.createPool({
      host: process.env.DB_HOST, // AWS RDS endpoint
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT || 3306),

      // 🔐 AWS RDS SSL CONFIG (CORRECT)
      ssl: {
        ca: fs.readFileSync(caPath),
      },

      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });

    console.log("🔥 MySQL Pool Created (AWS RDS SSL Enabled)");
  }

  return pool;
}
