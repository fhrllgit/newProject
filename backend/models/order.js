// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  address: {
    nama_penerima: String,
    alamat_lengkap: String,
    kota: String,
    kecamatan: String,
    kode_pos: String,
    telp: String
  },
  paymentMethod: { type: String, enum: ["cod"], default: "cod" },
  items: [
    {
      id: String,
      name: String,
      price: Number,
      discount: Number,
      qty: Number,
      Image: String,
      size: {
        value: String,
        type: String
      },
      variasi: String
    }
  ],
  totalAfterDiscount: { type: Number, required: true },
  status: { type: String, enum: ["Diproses", "Dikirim", "Selesai", "Batal"], default: "Diproses" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
