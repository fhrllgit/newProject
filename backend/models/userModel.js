const db = require("../config/db")

const User = {
  findByEmail: (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], callback);
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO users (first_name, last_name, email, password, role, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    db.query(sql, [data.first_name, data.last_name, data.email, data.password, data.role], callback);
  },
};

module.exports = User;