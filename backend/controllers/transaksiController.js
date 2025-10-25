const db = require("../config/db");

// Ringkasan Transaksi: total pendapatan, jumlah per status, produk terlaris
exports.getTransactionSummary = (req, res) => {
  const summarySql = `
    SELECT 
      COUNT(*) AS total_transaksi,
      SUM(CASE WHEN status='SELESAI' THEN 1 ELSE 0 END) AS total_selesai,
      SUM(CASE WHEN status='DIBATALKAN' THEN 1 ELSE 0 END) AS total_batal,
      SUM(CASE WHEN status='DIPROSES' OR status='DIKIRIM' THEN 1 ELSE 0 END) AS total_diproses,
      SUM(CASE WHEN status='SELESAI' THEN total_after_discount ELSE 0 END) AS total_pendapatan
    FROM orders
  `;

  db.query(summarySql, (err, result) => {
    if (err) {
      console.error("❌ SQL Error getTransactionSummary:", err);
      return res
        .status(500)
        .json({ message: "Gagal mengambil ringkasan transaksi" });
    }

    const topProductsSql = `
      SELECT oi.product_name, SUM(oi.quantity) AS total_terjual
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'SELESAI'   -- hanya order selesai
      GROUP BY oi.product_name
      ORDER BY total_terjual DESC
      LIMIT 10
    `;

    db.query(topProductsSql, (err2, products) => {
      if (err2) {
        console.error("❌ SQL Error topProducts:", err2);
        return res
          .status(500)
          .json({ message: "Gagal mengambil produk terlaris" });
      }

      res.json({
        summary: result[0],
        topProducts: products,
      });
    });
  });
};


// Daftar Transaksi Ringkas (untuk tabel dashboard)
exports.getTransactionList = (req, res) => {
  const sql = `
    SELECT 
      o.id AS order_id,
      u.first_name AS user_name,
      o.total_after_discount,
      o.status,
      o.created_at,
      COUNT(oi.id) AS total_item
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_items oi ON o.id = oi.order_id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ SQL Error getTransactionList:", err);
      return res
        .status(500)
        .json({ message: "Gagal mengambil daftar transaksi" });
    }
    res.json(result);
  });
};
