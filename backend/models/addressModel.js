const db = require("../config/db")

exports.createAddress = (data, callback) => {
  const sql = `
    INSERT INTO address 
    (user_id, nama_penerima, telepon, alamat_lengkap, kecamatan, kota, provinsi, kode_pos, is_default) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [
      data.user_id,
      data.nama_penerima,
      data.telepon,
      data.alamat_lengkap,
      data.kecamatan,
      data.kota,
      data.provinsi,
      data.kode_pos,
      data.is_default || false,
    ],
    callback
  );
};


exports.getAddressesByUser = (user_id, callback) => {
  db.query("SELECT * FROM address WHERE user_id = ? ORDER BY is_default DESC, id DESC", [user_id], callback);
};

exports.updateAddress = (id, data, callback) => {
  const sql = `
    UPDATE address 
    SET nama_penerima=?, telepon=?, alamat_lengkap=?, kecamatan=?, kota=?, provinsi=?, kode_pos=?, is_default=?, updated_at=NOW()
    WHERE id=?`;
  db.query(
    sql,
    [
      data.nama_penerima,
      data.telepon,
      data.alamat_lengkap,
      data.kecamatan,
      data.kota,
      data.provinsi,
      data.kode_pos,
      data.is_default || false,
      id,
    ],
    callback
  );
};

exports.deleteAddress = (id, callback) => {
  db.query("DELETE FROM address WHERE id=?", [id], callback);
};


exports.setDefaultAddress = (user_id, id, callback) => {
  db.query("UPDATE address SET is_default = FALSE WHERE user_id = ?", [user_id], (err) => {
    if (err) return callback(err);
    db.query("UPDATE address SET is_default = TRUE WHERE id = ?", [id], callback);
  });
};
