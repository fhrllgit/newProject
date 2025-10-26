// db.js
const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306
});

db.connect(err => {
  if (err) {
    console.error("DB connect error:", err);
    throw err;
  }
  console.log("Database connected!");
});

module.exports = db;
