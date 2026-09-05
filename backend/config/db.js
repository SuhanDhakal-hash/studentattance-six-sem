const mysql = require("mysql2/promise");

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();

    console.log(" MySQL Database Connected Successfully");

    connection.release();

    return true;
  } catch (error) {
    console.error("MySQL Database Connection Failed:");
    console.error(error.message);

    return false;
  }
}

module.exports = {
  pool,
  testDatabaseConnection
};