const db = require("../config/db");

// exports.getOrdersUser = (req, res) => {
//   const userId = req.user.id;

//   const sql = `
//     SELECT 
//       o.id AS order_id,
//       o.total_after_discount,
//       o.created_at,
//       o.status,
//       oi.id AS item_id,
//       oi.product_name,
//       oi.product_image,
//       oi.size,
//       oi.warna,
//       oi.quantity,
//       oi.price,
//       oi.discount_price
//     FROM orders o
//     JOIN order_items oi ON o.id = oi.order_id
//     WHERE o.user_id = ?
//   `;

//   db.query(sql, [userId], (err, rows) => {
//     if (err) {
//       console.error("❌ Error getOrdersUser:", err);
//       return res.status(500).json({ message: "Terjadi kesalahan server" });
//     }

//     if (!rows || rows.length === 0) {
//       return res.status(404).json({ message: "Tidak ada pesanan ditemukan" });
//     }

//     const items = rows.map((row) => {
//       const activePrice = row.discount_price || row.price;
//       const total = activePrice * row.quantity;

//       return {
//         id: row.item_id,
//         name: row.product_name,
//         image: row.product_image,
//         size: row.size,
//         variasi: row.warna,
//         qty: row.quantity,
//         price: row.price,
//         discount: row.discount_price,
//         activePrice,
//         total
//       };
//     });

//     const totalAfterDiscount = items.reduce((sum, item) => sum + item.total, 0);

//   const order = {
//   id: rows[0].order_id,
//   totalAfterDiscount: totalAfterDiscount, 
//   createdAt: rows[0].created_at,         
//   status: rows[0].status,
//   address: rows[0].address ? JSON.parse(rows[0].address) : null,
//   items: items.map(item => ({
//     id: item.id,
//     Name: item.name,     
//     Image: item.image,   
//     Quantity: item.qty,
//     Price: item.price,
//     Discount: item.discount || 0,
//     Size: item.size || null,
//     Variasi: item.variasi || null
//   }))
// };
// res.json([order]); 

//   });
// };

exports.getOrdersUser = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      o.id AS order_id,
      o.total_after_discount,
      o.created_at,
      o.status,
      o.address_json,
      oi.id AS item_id,
      oi.product_name,
      oi.product_image,
      oi.size,
      oi.warna,
      oi.quantity,
      oi.price,
      oi.discount_price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ? AND o.status != 'SELESAI'
    ORDER BY o.created_at DESC
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error("❌ Error getActiveOrdersUser:", err);
      return res.status(500).json({ message: "Terjadi kesalahan server" });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Tidak ada pesanan aktif" });
    }

    // Map orders, sama seperti sebelumnya
    const ordersMap = {};

    rows.forEach(row => {
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          id: row.order_id,
          totalAfterDiscount: row.total_after_discount,
          createdAt: row.created_at,
          status: row.status,
          address: row.address_json ? JSON.parse(row.address_json) : null,
          items: []
        };
      }

      ordersMap[row.order_id].items.push({
        id: row.item_id,
        Name: row.product_name,
        Image: row.product_image,
        Quantity: row.quantity,
        Price: row.price,
        Discount: row.discount_price || 0,
        Size: row.size || null,
        Variasi: row.warna || null
      });
    });

    res.json(Object.values(ordersMap));
  });
};


// exports.getOrderHistoryUser = (req, res) => {
//   const userId = req.user.id;

//   const sql = `
//     SELECT 
//       o.id AS order_id,
//       o.total_after_discount,
//       o.created_at,
//       o.status,
//       o.address_json,
//       oi.id AS item_id,
//       oi.product_name,
//       oi.product_image,
//       oi.size,
//       oi.warna,
//       oi.quantity,
//       oi.price,
//       oi.discount_price
//     FROM orders o
//     JOIN order_items oi ON o.id = oi.order_id
//     WHERE o.user_id = ? AND o.status = 'SELESAI'
//     ORDER BY o.created_at DESC
//   `;

//   db.query(sql, [userId], (err, rows) => {
//     if (err) {
//       console.error("❌ Error getOrderHistoryUser:", err);
//       return res.status(500).json({ message: "Terjadi kesalahan server" });
//     }

//     if (!rows || rows.length === 0) {
//       return res.status(404).json({ message: "Tidak ada riwayat pesanan" });
//     }

//     const ordersMap = {};

//     rows.forEach(row => {
//       if (!ordersMap[row.order_id]) {
//         ordersMap[row.order_id] = {
//           id: row.order_id,
//           totalAfterDiscount: row.total_after_discount,
//           createdAt: row.created_at,
//           status: row.status,
//           address: row.address_json ? JSON.parse(row.address_json) : null,
//           items: []
//         };
//       }

//       ordersMap[row.order_id].items.push({
//         id: row.item_id,
//         Name: row.product_name,
//         Image: row.product_image,
//         Quantity: row.quantity,
//         Price: row.price,
//         Discount: row.discount_price || 0,
//         Size: row.size || null,
//         Variasi: row.warna || null
//       });
//     });

//     res.json(Object.values(ordersMap));
//   });
// };

exports.getOrderHistoryUser = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      o.id AS order_id,
      o.total_after_discount,
      o.created_at,
      o.status,
      o.address,
      oi.id AS item_id,
      oi.product_name,
      oi.product_image,
      oi.size,
      oi.warna,
      oi.quantity,
      oi.price,
      oi.discount_price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ? AND o.status = 'SELESAI'
    ORDER BY o.created_at DESC
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: "Terjadi kesalahan server" });
    if (!rows || rows.length === 0) return res.status(200).json([]);

    const groupedOrders = {};
    rows.forEach((row) => {
      if (!groupedOrders[row.order_id]) {
        groupedOrders[row.order_id] = {
          id: row.order_id,
          totalAfterDiscount: row.total_after_discount,
          createdAt: row.created_at,
          status: row.status,
          address: row.address ? JSON.parse(row.address) : null,
          items: [],
        };
      }
      groupedOrders[row.order_id].items.push({
        id: row.item_id,
        Name: row.product_name,
        Image: row.product_image,
        Quantity: row.quantity,
        Price: row.price,
        Discount: row.discount_price,
        Size: row.size,
        Variasi: row.warna,
      });
    });

    res.json(Object.values(groupedOrders));
  });
};



// exports.createOrder = (req, res) => {
//   const userId = req.user.id;
//   let { address, paymentMethod, totalAfterDiscount, items } = req.body;

//   try {
//     if (typeof address === "string") address = JSON.parse(address);
//     if (typeof items === "string") items = JSON.parse(items);
//   } catch (e) {
//     console.error("❌ Gagal parsing JSON:", e);
//     return res.status(400).json({ message: "Format data tidak valid" });
//   }

//   const addressJSON = JSON.stringify(address);

//   db.query(
//     "INSERT INTO orders (user_id, address, payment_method, total_after_discount, status, created_at) VALUES (?, ?, ?, ?, 'Diproses', NOW())",
//     [userId, addressJSON, paymentMethod, totalAfterDiscount],
//     (err, orderResult) => {
//       if (err)
//         return res.status(500).json({ message: "Gagal membuat pesanan", error: err });

//       const orderId = orderResult.insertId;

//       if (!Array.isArray(items) || items.length === 0) {
//         return res.status(400).json({ message: "Tidak ada item dalam pesanan." });
//       }

//       const values = items.map(item => [
//         orderId,
//         item.name,
//         item.Image,
//         item.size,
//         item.variasi,
//         item.qty,
//         item.price,
//         item.discount,
//       ]);

//       db.query(
//         "INSERT INTO order_items (order_id, product_name, product_image, size, warna, quantity, price, discount_price) VALUES ?",
//         [values],
//         (err2) => {
//           if (err2)
//             return res.status(500).json({ message: "Gagal menambahkan item pesanan", error: err2 });

//           res.status(201).json({ message: "Pesanan berhasil dibuat", orderId });
//         }
//       );
//     }
//   );
// };


exports.createOrder = (req, res) => {
  const userId = req.user.id; 
  let { address, paymentMethod, totalAfterDiscount, items } = req.body;

  if (!address) return res.status(400).json({ message: "Alamat harus diisi" });
  if (!items || !Array.isArray(items) || items.length === 0)
    return res.status(400).json({ message: "Tidak ada item dalam pesanan." });
  if (!paymentMethod) return res.status(400).json({ message: "Metode pembayaran harus dipilih" });

  try {
    if (typeof address === "string") address = JSON.parse(address);
    if (typeof items === "string") items = JSON.parse(items);
  } catch (e) {
    console.error("❌ Gagal parsing JSON:", e);
    return res.status(400).json({ message: "Format data tidak valid" });
  }

  const addressJSON = JSON.stringify(address); 

db.query(
  `INSERT INTO orders 
     (user_id, address, address_json, payment_method, total_after_discount, status, created_at)
   VALUES (?, ?, ?, ?, ?, 'Diproses', NOW())`,
  [userId, addressJSON, addressJSON, paymentMethod, totalAfterDiscount],
  (err, orderResult) => {
    if (err)
      return res.status(500).json({ message: "Gagal membuat pesanan", error: err });

    const orderId = orderResult.insertId;

    const values = items.map(item => [
      orderId,
      item.name,
      item.Image,
      item.size,
      item.variasi,
      item.qty,
      item.price,
      item.discount || null,
    ]);

    db.query(
      "INSERT INTO order_items (order_id, product_name, product_image, size, warna, quantity, price, discount_price) VALUES ?",
      [values],
      (err2) => {
        if (err2)
          return res.status(500).json({ message: "Gagal menambahkan item pesanan", error: err2 });

        res.status(201).json({
          message: "Pesanan berhasil dibuat",
          orderId,
          itemsCount: items.length,
          totalAfterDiscount,
        });
      }
    );
  }
);


};


exports.getOrders = (req, res) => {
  const sql = `
    SELECT 
      o.id AS order_id,
      o.user_id,
      u.first_name AS user_name,
      o.total_after_discount,
      o.status,
      o.created_at,
      o.address_json,
      i.product_name,
      i.product_image,
      i.size,
      i.warna,
      i.quantity,
      i.price,
      i.discount_price
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_items i ON o.id = i.order_id
    ORDER BY o.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("🔥 SQL Error getOrders:", err);
      return res.status(500).json({ message: "Gagal mengambil pesanan", error: err });
    }
    res.json(result);
  });
};


exports.updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["DIPROSES", "DIKIRIM", "SELESAI", "DIBATALKAN"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Status tidak valid" });
  }

  const sql = "UPDATE orders SET status = ? WHERE id = ?";
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error("❌ Error update status:", err);
      return res.status(500).json({ message: "Gagal memperbarui status" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }
    res.json({ message: "Status pesanan berhasil diperbarui" });
  });
};

