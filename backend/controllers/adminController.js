const db = require("../config/db");

exports.getAllUsers = (req, res) => {
  const sql = "SELECT id, first_name, email, role, created_at, updated_at FROM users";

  db.query(sql, (error, results) => {
    if (error) {
      console.error("❌ Error getAllUsers:", error);
      return res.status(500).json({ message: "Gagal mengambil data user", error });
    }

    console.log("✅ Data dari DB:", results);
    res.status(200).json(results);
  });
};
