const db = require("../config/db")

const User = {
  findByEmail: (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], callback);
  },

  updateProfile: (userId, data, callback) => {
  const fields = [];
  const values = [];

  if (data.first_name) {
    fields.push("first_name = ?");
    values.push(data.first_name);
  }

  if (data.last_name) {
    fields.push("last_name = ?");
    values.push(data.last_name);
  }

  if (data.password) {
    fields.push("password = ?");
    values.push(data.password); // sudah di-hash
  }

  if (fields.length === 0) return callback(null, { affectedRows: 0 });

  values.push(userId);

  const sql = `UPDATE users SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`;
  db.query(sql, values, callback);
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