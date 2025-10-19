const db = require("./config/db"); 
const bcrypt = require("bcryptjs");

async function createAdmin() {
  const passwordPlain = "tawakaladminStore"; 
  const hashed = await bcrypt.hash(passwordPlain, 10);

  const sql = `
    INSERT INTO users (first_name, last_name, email, password, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, NOW(), NOW())
  `;
  const values = ["Admin", "Tawakal", "admin@tawakal.com", hashed, "admin"];

  db.query(sql, values, (err, res) => {
    if (err) {
      console.error("Gagal insert admin:", err);
      process.exit(1);
    }
    console.log("Admin berhasil dibuat. Email: admin@tawakal.com, Password:", passwordPlain);
    process.exit(0);
  });
}

createAdmin();
