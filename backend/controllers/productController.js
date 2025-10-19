const db = require("../config/db");
const path = require("path");
const fs = require("fs");
const response = require("../response");
const port = 3005;

exports.getTestApi = (req, res) => {
  response(200, "API Ready", "SUCCES", res);
};

exports.getAllProducts = async (req, res) => {
  try {
    const productsResult = await new Promise((resolve, rejects) => {
      const sql = `SELECT p.*,
        CASE
         WHEN p.discount_price IS NOT NULL
          AND NOW() BETWEEN p.discount_start AND p.discount_end
         THEN p.discount_price
         ELSE p.price
         END AS current_price
        FROM products p;`;
      db.query(sql, (err, result) => (err ? rejects(err) : resolve(result)));
    });
    if (productsResult.length === 0) return res.json([]);
    const productID = productsResult.map((p) => p.id);

    const sizeResult = await new Promise((resolve, rejects) => {
      if (productID.length === 0) return res.json([]);
      const sql = `SELECT * FROM product_sizes WHERE product_id IN (?)`;
      db.query(sql, [productID], (err, result) => {
        err ? rejects(err) : resolve(result);
      });
    });

    const detailImgResult = await new Promise((resolve, rejects) => {
      if (productID.length === 0) return res.json([]);
      const sql = `SELECT * FROM product_images WHERE product_id IN (?)`;
      db.query(sql, [productID], (err, result) => {
        err ? rejects(err) : resolve(result);
      });
    });

    const specResult = await new Promise((resolve, rejects) => {
      if (productID.length === 0) return res.json([]);
      const sql = `SELECT * FROM product_specifications WHERE product_id IN (?)`;
      db.query(sql, [productID], (err, result) => {
        err ? rejects(err) : resolve(result);
      });
    });
    const categoriesResult = await new Promise((resolve, rejects) => {
      const sql = `SELECT * FROM categories`;
      db.query(sql, (err, result) => {
        err ? rejects(err) : resolve(result);
      });
    });
    const categoryMap = {};
    categoriesResult.forEach((c) => (categoryMap[c.id] = c.name));

    const products = productsResult.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      current_price: p.current_price,
      Image: p.img,
      tipe: p.tipe,
      point: p.point,
      variasi: p.variasi,
      warna: p.warna,
      description: p.description,
      discount: p.discount_price,
      startDiscount: p.discount_start,
      endDiscount: p.discount_end,
      category: categoryMap[p.category_id] || null,
      size_guide: p.size_guide ? JSON.parse(p.size_guide) : null,
      size: sizeResult
        .filter((s) => s.product_id === p.id)
        .map((s) => ({
          type: s.size_type,
          value: s.size_value,
          stock: s.stock,
        })),
      detail_images: detailImgResult
        .filter((i) => i.product_id === p.id)
        .map((i) => i.url),
      specifications: specResult
        .filter((spc) => spc.product_id === p.id)
        .map((spc) => spc.name),
    }));
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "DB error", error: err });
  }
};

exports.getAllbyID = async (req, res) => {
  const { id } = req.params;
  try {
    const productsResult = await new Promise((resolve, rejects) => {
      const sql = `SELECT * FROM products WHERE id = ?`;
      db.query(sql, [id], (err, result) =>
        err ? rejects(err) : resolve(result)
      );
    });
    if (productsResult.length === 0) {
      return res.status(400).json({ message: "Products tidak ditemukan" });
    }
    const products = productsResult[0];

    const sizeResult = await new Promise((resolve, rejects) => {
      const sql = `SELECT * FROM product_sizes WHERE product_id = ?`;
      db.query(sql, [id], (err, result) =>
        err ? rejects(err) : resolve(result)
      );
    });

    const imagesResult = await new Promise((resolve, rejects) => {
      const sql = `SELECT * FROM product_images WHERE product_id = ?`;
      db.query(sql, [id], (err, result) =>
        err ? rejects(err) : resolve(result)
      );
    });

    const specificationsResult = await new Promise((resolve, rejects) => {
      const sql = `SELECT * FROM product_specifications WHERE product_id = ?`;
      db.query(sql, [id], (err, result) =>
        err ? rejects(err) : resolve(result)
      );
    });

    const categoriesResult = await new Promise((resolve, rejects) => {
      const sql = `SELECT id, name FROM categories`;
      db.query(sql, (err, result) => (err ? rejects(err) : resolve(result)));
    });
    const mapCategory = {};
    categoriesResult.forEach((c) => (mapCategory[c.id] = c.name));

    const finalID = {
      id: products.id,
      name: products.name,
      price: products.price,
      current_price: products.current_price,
      Image: products.img,
      tipe: products.tipe,
      point: products.point,
      variasi: products.variasi,
      warna: products.warna,
      description: products.description,
      discount: products.discount_price,
      startDiscount: products.discount_start,
      endDiscount: products.discount_end,
      category: mapCategory[products.category_id] || null,
      size_guide: products.size_guide ? JSON.parse(products.size_guide) : null,
      size: sizeResult.map((s) => ({
        type: s.size_type,
        value: s.size_value,
        stock: s.stock,
      })),
      detail_images: imagesResult.map((i) => i.url),
      specifications: specificationsResult.map((spc) => spc.name),
    };
    res.json(finalID);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "DB error", error: err });
  }
};

exports.createProduct = (req, res) => {
  const {
    category_id,
    name,
    tipe,
    point,
    variasi,
    warna,
    description,
    price,
    discount_price,
    discount_start,
    discount_end,
    img,
    detail_images,
    specifications,
    sizes,
    size_guide
  } = req.body;

  const filename = path.basename(img);
  const tmpPath = path.join(__dirname, "../uploads/tmp", filename);
  const finalTmp = path.join(__dirname, "../uploads", filename);

  fs.rename(tmpPath, finalTmp, (err) => {
    if (err) res.status(500).json({ message: "Move image failed", error: err });

    const imgUrl = `http://localhost:${port}/uploads/${img}`;
    const sqlProducts = `INSERT INTO products (category_id, name, tipe, point, variasi, warna, description, price, discount_price, discount_start, discount_end, img, size_guide) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      sqlProducts,
      [
        category_id,
        name,
        tipe,
        point,
        variasi,
        warna,
        description,
        price,
        discount_price,
        discount_start,
        discount_end,
        imgUrl, 
        size_guide ? JSON.stringify(size_guide) : null
      ],
      (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Insert Products error", error: err });
        const productId = result.insertId;
        if (detail_images?.length > 0) {
          const finalImg = [];
          detail_images.forEach((filename) => {
            // const tmpPath = path.join(__dirname, "../uploads/tmp", filename);
            // const newFilename = Date.now() + path.extname(filename);
            // const finalTmp = path.join(__dirname, "../uploads/", newFilename);
            const tmpPath = path.join(__dirname, "../uploads/tmp", filename);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const newFilename = uniqueSuffix + path.extname(filename);
            const finalTmp = path.join(__dirname, "../uploads/", newFilename);
            try {
              fs.renameSync(tmpPath, finalTmp);
              console.log("Succes Rename");
            } catch (err) {
              console.log("ERROR Rename!", err);
            }
            const imgUrl = `http://localhost:${port}/uploads/${newFilename}`;
            finalImg.push([productId, imgUrl]);
          });
          const sqlImages = `INSERT INTO product_images (product_id, url) VALUES ?`;
          db.query(sqlImages, [finalImg], (err) => {
            if (err) console.log("Insert detail images error:", err);
          });
        }
        if (specifications?.length > 0) {
          const specSql = `INSERT INTO product_specifications (product_id, name) VALUES ?`;
          const values = specifications.map((name) => [productId, name]);
          db.query(specSql, [values]);
        }
        if (sizes?.length > 0) {
          const sizeSql = `INSERT INTO product_sizes (product_id, size_type, size_value, stock) VALUES ?`;
          const values = sizes.map((s) => [
            productId,
            s.type,
            s.value,
            s.stock,
          ]);
          db.query(sizeSql, [values]);
        }
        res.json({
          message: "Product created succesfull",
          product_id: productId,
        });
      }
    );
  });
};

const fetchSingleProduct = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;
    db.query(sql, [id], async (err, result) => {
      if (err) return reject(err);
      if (result.length === 0) return reject(new Error("Product not found"));

      const product = result[0];

      try {
        const sizes = await new Promise((resolve, reject) => {
          db.query(
            `SELECT size_type AS type, size_value AS value, stock 
             FROM product_sizes WHERE product_id = ?`,
            [id],
            (err, rows) => (err ? reject(err) : resolve(rows))
          );
        });

        const images = await new Promise((resolve, reject) => {
          db.query(
            `SELECT url FROM product_images WHERE product_id = ?`,
            [id],
            (err, rows) => (err ? reject(err) : resolve(rows.map((r) => r.url)))
          );
        });

        const specs = await new Promise((resolve, reject) => {
          db.query(
            `SELECT name FROM product_specifications WHERE product_id = ?`,
            [id],
            (err, rows) =>
              err ? reject(err) : resolve(rows.map((r) => r.name))
          );
        });

        resolve({
          id: product.id,
          name: product.name,
          price: product.price,
          discount: product.discount_price,
          startDiscount: product.discount_start,
          endDiscount: product.discount_end,
          tipe: product.tipe,
          point: product.point,
          variasi: product.variasi,
          warna: product.warna,
          description: product.description,
          category: product.category_name,
          img: product.img,
          size: sizes,
          detail_images: images,
          specifications: specs,
        });
      } catch (nestedErr) {
        reject(nestedErr);
      }
    });
  });
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    let data;
    try {
      data = JSON.parse(req.body.data || "{}");
      console.log("Parsed data (debug):", {
        discount: data.discount,
        startDiscount: data.startDiscount,
        endDiscount: data.endDiscount,
        sizeLength: data.size ? data.size.length : 0,
        Image: data.Image,
        detailImagesLength: data.detail_images ? data.detail_images.length : 0,
      });
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      return res.status(400).json({ message: "Invalid JSON data" });
    }

    if (data.Image && data.Image.includes("/uploads/tmp/")) {
      try {
        const tmpPath = path.join(
          __dirname,
          "..",
          data.Image.replace(`http://localhost:${port}/`, "")
        );
        const newFilename = path.basename(tmpPath);
        const finalPath = path.join(__dirname, "../uploads", newFilename);
        fs.renameSync(tmpPath, finalPath);
        data.Image = `http://localhost:${port}/uploads/${newFilename}`;
        console.log("✅ Moved tmp file to uploads:", data.Image);
      } catch (err) {
        console.error("❌ Failed to move image:", err);
      }
    }
    // get data lama
    const oldProduct = await new Promise((resolve, reject) => {
      const sql = `SELECT * FROM products WHERE id = ?`;
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else if (result.length === 0) reject(new Error("Product not found"));
        else resolve(result[0]);
      });
    });

    const oldSizes = await new Promise((resolve, reject) => {
      const sql = `SELECT * FROM product_sizes WHERE product_id = ?`;
      db.query(sql, [id], (err, result) =>
        err ? reject(err) : resolve(result)
      );
    });

    const oldDetailImages = await new Promise((resolve, reject) => {
      const sql = `SELECT url FROM product_images WHERE product_id = ?`;
      db.query(sql, [id], (err, result) =>
        err ? reject(err) : resolve(result.map((i) => i.url))
      );
    });

    const oldSpecs = await new Promise((resolve, reject) => {
      const sql = `SELECT name FROM product_specifications WHERE product_id = ?`;
      db.query(sql, [id], (err, result) =>
        err ? reject(err) : resolve(result.map((s) => s.name))
      );
    });

    // mer data baru
    const merged = {
      name: data.name || oldProduct.name,
      price: data.price !== undefined ? data.price : oldProduct.price,
      discount_price: data.discount ?? oldProduct.discount_price,
      discount_start: data.startDiscount ?? oldProduct.discount_start,
      discount_end: data.endDiscount ?? oldProduct.discount_end,
      tipe: data.tipe || oldProduct.tipe,
      point: data.point || oldProduct.point,
      variasi: data.variasi || oldProduct.variasi,
      warna: data.warna || oldProduct.warna,
      description: data.description || oldProduct.description,
      category_id:
        data.category_id !== undefined
          ? data.category_id
          : oldProduct.category_id,
      img: data.Image || oldProduct.img,
      size:
        data.size ||
        oldSizes.map((s) => ({
          type: s.size_type,
          value: s.size_value,
          stock: s.stock,
        })),
      specifications: data.specifications || oldSpecs,
      detail_images: data.detail_images || oldDetailImages,
      size_guide: data.size_guide ? JSON.stringify(data.size_guide) : oldProduct.size_guide
    };

    console.log("Merged data (debug):", {
      discount_price: merged.discount_price,
      sizeLength: merged.size.length,
      img: merged.img,
    });

    // format tgl mysql
    const formatDateForMySQL = (date) => {
      if (!date) return null;
      const d = new Date(date);
      if (isNaN(d)) return null;
      const pad = (n) => (n < 10 ? "0" + n : n);
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
      )} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };
    merged.discount_start = formatDateForMySQL(merged.discount_start);
    merged.discount_end = formatDateForMySQL(merged.discount_end);

    let imgToUse = oldProduct.img;
    if (data.Image && data.Image.includes("/uploads/tmp/")) {
      try {
        const oldTmpPath = path.join(
          __dirname,
          "..",
          data.Image.replace(`http://localhost:${port}/`, "")
        );
        const newFilename = path.basename(oldTmpPath);
        const newPath = path.join(__dirname, "uploads", newFilename);

        fs.renameSync(oldTmpPath, newPath);
        imgToUse = `http://localhost:${port}/uploads/${newFilename}`;
        console.log("✅ Moved tmp file to uploads:", imgToUse);
      } catch (moveErr) {
        console.error("❌ Failed to move image from tmp to uploads:", moveErr);
      }
    } else if (data.Image) {
      imgToUse = data.Image;
    } else if (req.files && req.files.singleFile && req.files.singleFile[0]) {
      if (
        oldProduct.img &&
        oldProduct.img.startsWith("http://localhost:" + port + "/uploads/")
      ) {
        const oldFilename = oldProduct.img.split("/").pop();
        const oldPath = path.join(__dirname, "uploads", oldFilename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      imgToUse = `http://localhost:${port}/uploads/${req.files.singleFile[0].filename}`;
    }

    const updateProductSql = `
        UPDATE products SET
          name = ?, price = ?, discount_price = ?, discount_start = ?, discount_end = ?,
          tipe = ?, point = ?, variasi = ?, warna = ?, description = ?, category_id = ?, img = ?, size_guide = ?
        WHERE id = ?
      `;
    await new Promise((resolve, reject) => {
      db.query(
        updateProductSql,
        [
          merged.name,
          merged.price,
          merged.discount_price,
          merged.discount_start,
          merged.discount_end,
          merged.tipe,
          merged.point,
          merged.variasi,
          merged.warna,
          merged.description,
          merged.category_id,
          imgToUse,
          merged.size_guide,
          id,
        ],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });

    await new Promise((resolve, reject) => {
      db.query(`DELETE FROM product_sizes WHERE product_id = ?`, [id], (err) =>
        err ? reject(err) : resolve()
      );
    });
    if (merged.size && merged.size.length > 0) {
      const values = merged.size.map((s) => [id, s.type, s.value, s.stock]);
      await new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO product_sizes (product_id, size_type, size_value, stock) VALUES ?`,
          [values],
          (err) => (err ? reject(err) : resolve())
        );
      });
    }

    await new Promise((resolve, reject) => {
      db.query(
        `DELETE FROM product_specifications WHERE product_id = ?`,
        [id],
        (err) => (err ? reject(err) : resolve())
      );
    });
    if (merged.specifications && merged.specifications.length > 0) {
      const values = merged.specifications.map((name) => [id, name]);
      await new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO product_specifications (product_id, name) VALUES ?`,
          [values],
          (err) => (err ? reject(err) : resolve())
        );
      });
    }

    const imagesToKeep = merged.detail_images;
    const imagesToDelete = oldDetailImages.filter(
      (url) => !imagesToKeep.includes(url)
    );
    if (imagesToDelete.length > 0) {
      const placeholders = imagesToDelete.map(() => "?").join(",");
      await new Promise((resolve, reject) => {
        db.query(
          `DELETE FROM product_images WHERE product_id = ? AND url IN (${placeholders})`,
          [id, ...imagesToDelete],
          (err) => (err ? reject(err) : resolve())
        );
      });
    }

    const newFromJson = imagesToKeep.filter(
      (url) => !oldDetailImages.includes(url)
    );
 if (newFromJson.length > 0) {
  const finalNewImages = [];

  for (const url of newFromJson) {
    if (url.includes("/uploads/tmp/")) {
      const tmpPath = path.join(__dirname, "..", url.replace(`http://localhost:${port}/`, ""));
      const ext = path.extname(tmpPath);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const newFilename = uniqueSuffix + ext;
      const finalPath = path.join(__dirname, "../uploads", newFilename);

      try {
        fs.renameSync(tmpPath, finalPath);
        const newUrl = `http://localhost:${port}/uploads/${newFilename}`;
        finalNewImages.push([id, newUrl]);
        console.log("✅ Moved & renamed tmp file:", newUrl);
      } catch (err) {
        console.error("❌ Error moving detail image:", err);
      }
    } else {
      finalNewImages.push([id, url]);
    }
  }

  if (finalNewImages.length > 0) {
    await new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO product_images (product_id, url) VALUES ?`,
        [finalNewImages],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }
}


    if (
      req.files &&
      req.files.multipleFile &&
      req.files.multipleFile.length > 0
    ) {
      const newFileUrls = req.files.multipleFile.map(
        (file) => `http://localhost:${port}/uploads/${file.filename}`
      );
      const values = newFileUrls.map((url) => [id, url]);
      await new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO product_images (product_id, url) VALUES ?`,
          [values],
          (err) => (err ? reject(err) : resolve())
        );
      });
      console.log("Appended new detail images:", newFileUrls);
    }

    const updatedProduct = await fetchSingleProduct(id);
    console.log("Update success (debug):", {
      discount: updatedProduct.discount,
      sizeLength: updatedProduct.size.length,
    });
    res.json(updatedProduct);
  } catch (err) {
    console.error("PUT error:", err);
    res.status(500).json({ message: "DB error", error: err.message });
  }
};

exports.getFilteredProducts = async (req, res) => {
  const { search, minStock, maxStock, category } = req.query;
  let minStockNum = minStock ? Number(minStock) : undefined;
  let maxStockNum = maxStock ? Number(maxStock) : undefined;

  try {
    let sql = `
      SELECT 
        p.*,
        CASE
          WHEN p.discount_price IS NOT NULL
            AND NOW() BETWEEN p.discount_start AND p.discount_end
          THEN p.discount_price
          ELSE p.price
        END AS current_price
      FROM products p
      WHERE 1=1
    `;

    const params = [];

    if (search) {
      sql += " AND p.name LIKE ?";
      params.push(`%${search}%`);
    }

    if (category) {
      sql += " AND p.category_id = ?";
      params.push(category);
    }

    const productsResult = await new Promise((resolve, reject) => {
      db.query(sql, params, (err, result) =>
        err ? reject(err) : resolve(result)
      );
    });

    if (productsResult.length === 0) return res.json([]);

    const productIDs = productsResult.map((p) => p.id);

    const [sizeResult, detailImgResult, specResult, categoriesResult] =
      await Promise.all([
        new Promise((resolve, reject) => {
          const sql = `SELECT * FROM product_sizes WHERE product_id IN (?)`;
          db.query(sql, [productIDs], (err, result) =>
            err ? reject(err) : resolve(result)
          );
        }),
        new Promise((resolve, reject) => {
          const sql = `SELECT * FROM product_images WHERE product_id IN (?)`;
          db.query(sql, [productIDs], (err, result) =>
            err ? reject(err) : resolve(result)
          );
        }),
        new Promise((resolve, reject) => {
          const sql = `SELECT * FROM product_specifications WHERE product_id IN (?)`;
          db.query(sql, [productIDs], (err, result) =>
            err ? reject(err) : resolve(result)
          );
        }),
        new Promise((resolve, reject) => {
          const sql = `SELECT * FROM categories`;
          db.query(sql, (err, result) => (err ? reject(err) : resolve(result)));
        }),
      ]);

    const categoryMap = {};
    categoriesResult.forEach((c) => (categoryMap[c.id] = c.name));

    let products = productsResult.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      current_price: p.current_price,
      Image: p.img,
      tipe: p.tipe,
      point: p.point,
      variasi: p.variasi,
      warna: p.warna,
      description: p.description,
      discount: p.discount_price,
      startDiscount: p.discount_start,
      endDiscount: p.discount_end,
      category: categoryMap[p.category_id] || null,
      size: sizeResult
        .filter((s) => s.product_id === p.id)
        .map((s) => ({
          type: s.size_type,
          value: s.size_value,
          stock: s.stock,
        })),
      detail_images: detailImgResult
        .filter((i) => i.product_id === p.id)
        .map((i) => i.url),
      specifications: specResult
        .filter((spc) => spc.product_id === p.id)
        .map((spc) => spc.name),
      size_guide: p.size_guide ? JSON.parse(p.size_guide) : null
    }));

    if (minStockNum !== undefined && maxStockNum !== undefined) {
      products = products.filter((p) =>
        p.size.some((s) => s.stock >= minStockNum && s.stock <= maxStockNum)
      );
    }

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB error", error: err });
  }
};


exports.deleteMultipleProducts = async (req, res) => {
  const { ids } = req.body; 
  if (!ids || !ids.length) return res.status(400).json({ message: "No IDs provided" });

  try {
    await new Promise((resolve, reject) => {
      const sqlSizes = `DELETE FROM product_sizes WHERE product_id IN (?)`;
      db.query(sqlSizes, [ids], (err) => (err ? reject(err) : resolve()));
    });

    await new Promise((resolve, reject) => {
      const sqlImages = `DELETE FROM product_images WHERE product_id IN (?)`;
      db.query(sqlImages, [ids], (err) => (err ? reject(err) : resolve()));
    });

    await new Promise((resolve, reject) => {
      const sqlSpecs = `DELETE FROM product_specifications WHERE product_id IN (?)`;
      db.query(sqlSpecs, [ids], (err) => (err ? reject(err) : resolve()));
    });

    await new Promise((resolve, reject) => {
      const sqlProducts = `DELETE FROM products WHERE id IN (?)`;
      db.query(sqlProducts, [ids], (err) => (err ? reject(err) : resolve()));
    });

    res.json({ message: "Products deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB error", error: err });
  }
};



exports.getFilteredAll = async (req, res) => {
  const {
    search,
    gender, 
    category, //
    minPrice,
    maxPrice,
    size,
    minStock,
    maxStock,
  } = req.query;

  let sql = `
    SELECT 
      p.*,
      CASE
        WHEN p.discount_price IS NOT NULL
          AND NOW() BETWEEN p.discount_start AND p.discount_end
        THEN p.discount_price
        ELSE p.price
      END AS current_price,
      c.name AS category_name,
      c.gender AS category_gender
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;

  const params = [];

  // 🔍 Filter nama produk
  if (search) {
    sql += " AND p.name LIKE ?";
    params.push(`%${search}%`);
  }

if (gender) {
  sql += " AND LOWER(c.gender) = LOWER(?)";
  params.push(gender);
}
if (category) {
  sql += " AND LOWER(c.name) = LOWER(?)";
  params.push(category);
}


  if (minPrice) {
    sql += " AND p.price >= ?";
    params.push(Number(minPrice));
  }
  if (maxPrice) {
    sql += " AND p.price <= ?";
    params.push(Number(maxPrice));
  }

  try {
    const productsResult = await new Promise((resolve, reject) => {
      db.query(sql, params, (err, result) =>
        err ? reject(err) : resolve(result)
      );
    });

    if (productsResult.length === 0) return res.json([]);

    const productIDs = productsResult.map((p) => p.id);

    const [sizeResult, detailImgResult] = await Promise.all([
      new Promise((resolve, reject) => {
        const sql = `SELECT * FROM product_sizes WHERE product_id IN (?)`;
        db.query(sql, [productIDs], (err, result) =>
          err ? reject(err) : resolve(result)
        );
      }),
      new Promise((resolve, reject) => {
        const sql = `SELECT * FROM product_images WHERE product_id IN (?)`;
        db.query(sql, [productIDs], (err, result) =>
          err ? reject(err) : resolve(result)
        );
      }),
    ]);

    let products = productsResult.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      current_price: p.current_price,
      category: p.category_name,
      gender: p.category_gender,
      description: p.description,
      image: p.img,
      sizes: sizeResult
        .filter((s) => s.product_id === p.id)
        .map((s) => ({
          type: s.size_type,
          value: s.size_value,
          stock: s.stock,
        })),
      images: detailImgResult
        .filter((i) => i.product_id === p.id)
        .map((i) => i.url),
    }));

    if (size) {
      products = products.filter((p) =>
        p.sizes.some((s) => s.value == size)
      );
    }

    const minStockNum = minStock ? Number(minStock) : undefined;
    const maxStockNum = maxStock ? Number(maxStock) : undefined;

    if (minStockNum !== undefined && maxStockNum !== undefined) {
      products = products.filter((p) =>
        p.sizes.some(
          (s) => s.stock >= minStockNum && s.stock <= maxStockNum
        )
      );
    }

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB error", error: err });
  }
};
