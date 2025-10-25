const db = require("../config/db");

// Fungsi: Total pendapatan
exports.getTotalIncome = (req, res) => {
  db.query(
    `SELECT SUM(total_after_discount) AS total_income FROM orders WHERE status = 'Selesai'`,
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result[0]);
    }
  );
};

// Fungsi: Penjualan per produk
exports.getSalesPerProduct = (req, res) => {
  db.query(
    `SELECT oi.product_name, SUM(oi.quantity) AS total_quantity, SUM(oi.price) AS total_sales
     FROM order_items oi
     JOIN orders o ON oi.order_id = o.id
     WHERE o.status = 'Selesai'
     GROUP BY oi.product_name`,
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
};

// Fungsi: Pesanan per status
exports.getOrdersByStatus = (req, res) => {
  db.query(
    `SELECT status, COUNT(*) AS total_orders FROM orders GROUP BY status`,
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
};

// Fungsi: Pendapatan harian
exports.getDailyIncome = (req, res) => {
  db.query(
    `SELECT DATE(created_at) AS date, SUM(total_after_discount) AS daily_income
     FROM orders
     WHERE status = 'Selesai'
     GROUP BY DATE(created_at)
     ORDER BY date ASC`,
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
};

// Fungsi: Laporan stok
exports.getStockReport = (req, res) => {
  db.query(
    `SELECT p.name AS product_name, c.name AS category, SUM(ps.stock) AS total_stock
     FROM product_sizes ps
     JOIN products p ON ps.product_id = p.id
     JOIN categories c ON p.category_id = c.id
     GROUP BY ps.product_id
     ORDER BY total_stock ASC`,
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
};

// Fungsi gabungan: Full report
exports.getFullReport = (req, res) => {
  const result = {};

  db.query(
    `SELECT SUM(total_after_discount) AS total_income FROM orders WHERE status = 'Selesai'`,
    (err, income) => {
      if (err) return res.status(500).json({ error: err.message });
      result.income = income[0];

      db.query(
        `SELECT oi.product_name, SUM(oi.quantity) AS total_quantity, SUM(oi.price) AS total_sales
         FROM order_items oi
         JOIN orders o ON oi.order_id = o.id
         WHERE o.status = 'Selesai'
         GROUP BY oi.product_name`,
        (err, sales) => {
          if (err) return res.status(500).json({ error: err.message });
          result.sales = sales;

          db.query(
            `SELECT status, COUNT(*) AS total_orders FROM orders GROUP BY status`,
            (err, orders) => {
              if (err) return res.status(500).json({ error: err.message });
              result.orders = orders;

              db.query(
                `SELECT DATE(created_at) AS date, SUM(total_after_discount) AS daily_income
                 FROM orders
                 WHERE status = 'Selesai'
                 GROUP BY DATE(created_at)
                 ORDER BY date ASC`,
                (err, daily) => {
                  if (err) return res.status(500).json({ error: err.message });
                  result.daily = daily;

                  db.query(
                    `SELECT p.name AS product_name, c.name AS category, SUM(ps.stock) AS total_stock
                     FROM product_sizes ps
                     JOIN products p ON ps.product_id = p.id
                     JOIN categories c ON p.category_id = c.id
                     GROUP BY ps.product_id
                     ORDER BY total_stock ASC`,
                    (err, stock) => {
                      if (err) return res.status(500).json({ error: err.message });
                      result.stock = stock;

                      res.json(result);
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
};
