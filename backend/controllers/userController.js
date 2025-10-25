const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const JWT_SECRET = "secret123";
let tokenBlacklist = [];

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    first_name,
    last_name,
    old_password,
    new_password,
    confirm_password,
  } = req.body;
  User.findByEmail(req.user.email, async (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!results || results.length === 0)
      return res.status(404).json({ message: "User tidak ditemukan" });

    const user = results[0];

    let hashedPassword;
    if (old_password || new_password || confirm_password) {
      if (!old_password || !new_password || !confirm_password)
        return res
          .status(400)
          .json({ message: "Lengkapi semua field password" });

      const validOld = await bcrypt.compare(old_password, user.password);
      if (!validOld)
        return res.status(401).json({ message: "Password lama salah" });

      if (new_password !== confirm_password)
        return res
          .status(400)
          .json({ message: "Password baru dan konfirmasi tidak cocok" });

      hashedPassword = await bcrypt.hash(new_password, 10);
    }
    const updateData = {
      first_name,
      last_name,
      // password: hashedPassword,
    };
    if (hashedPassword) {
      updateData.password = hashedPassword;
    }

    User.updateProfile(userId, updateData, (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal update profile" });
      res.json({ message: "Profile berhasil diperbarui" });
    });
  });
};

exports.register = (req, res) => {
  const { first_name, last_name, email, password, confirm_password } = req.body;

  if (!first_name || !last_name || !email || !password || !confirm_password)
    return res.status(400).json({ message: "Lengkapi semua data" });

  if (password !== confirm_password)
    return res.status(400).json({ message: "Password tidak cocok" });

  User.findByEmail(email, async (err, results) => {
    if (results.length > 0)
      return res.status(400).json({ message: "Email sudah terdaftar" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: "user",
    };

    User.create(newUser, (err) => {
      if (err) return res.status(500).json({ message: "Gagal register" });
      res.status(201).json({ message: "Registrasi berhasil, silakan login" });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Isi email dan password" });

  User.findByEmail(email, async (err, results) => {
    if (results.length === 0)
      return res.status(400).json({ message: "Email tidak ditemukan" });

    const user = results[0];
    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        email: user.email,
      },
    });
  });
};

exports.logout = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];
  tokenBlacklist.push(token);

  res.json({ message: "Logout berhasil, token diblacklist" });
};

exports.isTokenBlacklisted = (token) => {
  return tokenBlacklist.includes(token);
};
