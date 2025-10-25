const express = require("express")
const port = 3005;
const path = require("path")
const fs = require("fs")

exports.uploadSingleFile = (req, res) => {
  console.log("=== DEBUG UPLOAD SINGLE FILE ===");
  console.log("req.file:", req.file);

  if (!req.file) {
    console.log("⚠️ Tidak ada file yang dikirim!");
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const tmpDir = path.join(__dirname, "../uploads/tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const tempPath = req.file.path;
    const targetPath = path.join(tmpDir, req.file.filename);
    fs.renameSync(tempPath, targetPath);

    const fileUrl = `http://localhost:${process.env.PORT || 3005}/uploads/tmp/${req.file.filename}`;
    console.log("✅ File uploaded (TMP):", fileUrl);

    return res.json({
      message: "File uploaded successfully (tmp)",
      url: fileUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ message: "Error uploading file", error });
  }
};


exports.uploadMultipleFile = (req, res) => {
  console.log("=== DEBUG MULTIPLE UPLOAD ===");

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const tmpDir = path.join(__dirname, "../uploads/tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const urls = req.files.map((file) => {
      const tempPath = file.path;
      const targetPath = path.join(tmpDir, file.filename);
      fs.renameSync(tempPath, targetPath);

      const fileUrl = `http://localhost:${process.env.PORT || 3005}/uploads/tmp/${file.filename}`;
      console.log("✅ Uploaded detail image:", fileUrl);
      return fileUrl;
    });

    res.json({ urls });
  } catch (err) {
    console.error("❌ Multiple upload error:", err);
    res.status(500).json({ message: "Error uploading multiple files", error: err });
  }
};
