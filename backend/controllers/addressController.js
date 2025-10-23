const Address = require("../models/addressModel");
exports.createAddress = (req, res) => {
  const data = { ...req.body, user_id: req.user.id }; 
  Address.createAddress(data, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal menambahkan alamat", error: err });
    res.status(201).json({
      message: "Alamat berhasil ditambahkan",
      address_id: result.insertId,
    });
  });
};

exports.getAddress = (req, res) => {
  const { user_id } = req.params;
  Address.getAddressesByUser(user_id, (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data alamat", error: err });
    res.json(results);
  });
};

exports.updateAddress = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  Address.updateAddress(id, data, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal memperbarui alamat", error: err });
    res.json({ message: "Alamat berhasil diperbarui" });
  });
};

exports.deleteAddress = (req, res) => {
  const { id } = req.params;
  Address.deleteAddress(id, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal menghapus alamat", error: err });
    res.json({ message: "Alamat berhasil dihapus" });
  });
};

exports.setDefaultAddress = (req, res) => {
  const { user_id, id } = req.params;
  Address.setDefaultAddress(user_id, id, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal mengatur alamat utama", error: err });
    res.json({ message: "Alamat utama berhasil diatur" });
  });
};
