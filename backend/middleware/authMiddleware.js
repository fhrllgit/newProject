const jwt = require("jsonwebtoken");
const JWT_SECRET = "secret123";
const { isTokenBlacklisted } = require("../controllers/userController")


exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token tidak ditemukan" });

  if (isTokenBlacklisted(token)) {
    return res.status(401).json({ message: "Token sudah logout" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token tidak valid" });
    req.user = user;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Akses ditolak, bukan admin" });
  next();
};

exports.isUser = (req, res, next) => {
  if (req.user.role !== "user")
    return res.status(403).json({ message: "Akses ditolak, bukan user" });
  next();
};


