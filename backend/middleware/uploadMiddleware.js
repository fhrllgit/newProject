const multer = require("multer")
const path = require("path")
const fs = require("fs")

const uploadPath = path.join(__dirname, "../uploads/tmp")
if(!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true })
}

const storageImg = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
    // cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploads = multer({ storage: storageImg });

module.exports = { uploads }