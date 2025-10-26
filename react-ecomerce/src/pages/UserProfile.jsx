import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PiUserLight } from "react-icons/pi";
import { IoIosArrowForward, IoIosArrowRoundBack } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { PiWarningCircleLight } from "react-icons/pi";
import Riwayat from "../pages/user/userRiwayat";
import Ordering from "../pages/user/order";
import Navbar from "./landingPage/layouts/Navbar";
import { useFavorites } from "../hooks/useFavorites";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("informasi-account");
  const [isEditing, setIsEditing] = useState(false);

  const [userEdit, setUserEdit] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get(
        "https://backendlombaecomerce-production.up.railway.app/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        const u = res.data.user || {};
        setUserEdit({
          first_name: u.first_name || "",
          last_name: u.last_name || "",
          email: u.email || "",
        });
      })
      .catch((err) => {
        console.error("Gagal ambil profile:", err);
        setMsg({ type: "error", text: "Gagal mengambil data profile." });
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handlePassChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!userEdit.first_name || !userEdit.last_name) {
      setMsg({ type: "error", text: "Nama depan & belakang harus diisi." });
      return;
    }

    const wantsChangePassword =
      passwords.old_password ||
      passwords.new_password ||
      passwords.confirm_password;

    if (wantsChangePassword) {
      if (
        !passwords.old_password ||
        !passwords.new_password ||
        !passwords.confirm_password
      ) {
        setMsg({
          type: "error",
          text: "Lengkapi semua field password untuk mengganti password.",
        });
        return;
      }
      if (passwords.new_password !== passwords.confirm_password) {
        setMsg({
          type: "error",
          text: "Password baru dan konfirmasi tidak cocok.",
        });
        return;
      }
      if (passwords.new_password.length < 6) {
        setMsg({ type: "error", text: "Password baru minimal 6 karakter." });
        return;
      }
    }
    const payload = {
      first_name: userEdit.first_name,
      last_name: userEdit.last_name,
    };

    if (wantsChangePassword) {
      payload.old_password = passwords.old_password;
      payload.new_password = passwords.new_password;
      payload.confirm_password = passwords.confirm_password;
    }

    setLoading(true);
    axios
      .put(
        "https://backendlombaecomerce-production.up.railway.app/api/users/profile",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setMsg({
          type: "success",
          text: res.data.message || "Profile diperbarui.",
        });

        if (wantsChangePassword) {
          setMsg((m) => ({
            type: "success",
            text:
              (res.data.message || "Profile diperbarui.") +
              " Silakan login kembali dengan password baru.",
          }));
        }

        setPasswords({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });
      })
      .catch((err) => {
        console.error("Gagal update profile:", err);
        const serverMsg =
          (err.response && err.response.data && err.response.data.message) ||
          "Gagal memperbarui profile.";
        setMsg({ type: "error", text: serverMsg });
      })
      .finally(() => setLoading(false));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://backendlombaecomerce-production.up.railway.app/api/users/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userEdit),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal update profile");

      const profileRes = await fetch(
        "https://backendlombaecomerce-production.up.railway.app/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const profileData = await profileRes.json();

      setUser(profileData.user);
      setUserEdit({
        first_name: profileData.user.first_name,
        last_name: profileData.user.last_name,
        email: profileData.user.email,
      });
    } catch (err) {
      console.error(err);
      alert("Gagal update profile");
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      await fetch(
        "https://backendlombaecomerce-production.up.railway.app/api/users/logout",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };
  const { favorites, addFavorite, removeFavorite, isFavorite, clearFavorites } =
    useFavorites();
  const formatToIDR = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const renderContent = () => {
    // akun user
    if (activeMenu === "informasi-account" && !isEditing) {
      return (
        <div className="bg-white w-full max-w-2xl shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between border-gray-200">
            <div className="flex items-center gap-3">
              <PiUserLight size={25} className="" />
              <h1 className="text-base sm:text-lg">Informasi pribadi</h1>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm sm:text-base font-medium underline hover:no-underline"
            >
              Ubah
            </button>
          </div>

          {/* User Information */}
          <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            <div className="border-b py-3 mt-4 border-b-black">
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                Alamat email
              </label>
              <p className="text-sm sm:text-base text-gray-900 break-all">
                {userEdit?.email}
              </p>
            </div>

            <div className="py-3 border-b border-b-black">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama
              </label>
              <p className="text-sm sm:text-base text-gray-900">
                {userEdit?.first_name}
              </p>
            </div>

            <div className="py-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <p className="text-sm sm:text-base text-gray-900">**********</p>
            </div>
          </div>
        </div>
      );
    }
    // edit
    if (activeMenu === "informasi-account" && isEditing) {
      return (
        <div className="max-w-2xl">
          <div className="flex items-center gap-1 text-xs text-gray-600 mb-4 sm:mb-6 overflow-x-auto">
            <button
              onClick={() => navigate("/")}
              className="hover:text-gray-900 cursor-pointer whitespace-nowrap"
            >
              Home
            </button>
            <IoIosArrowForward className="flex-shrink-0" />
            <button
              onClick={() => setIsEditing(false)}
              className="hover:text-gray-900 cursor-pointer whitespace-nowrap"
            >
              Akun Saya
            </button>
            <IoIosArrowForward className="flex-shrink-0" />
            <span className="text-gray-900 whitespace-nowrap">Rincian</span>
          </div>
          <div className="bg-white w-full shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8">
            <div
              onClick={() => setIsEditing(false)}
              className="flex cursor-pointer items-center gap-2 sm:gap-3 w-max mb-6 sm:mb-8"
            >
              <IoIosArrowBack size={16} />
              <h1 className="text-sm sm:text-base font-semibold">
                Informasi pribadi
              </h1>
            </div>

            <div className="space-y-4 sm:space-y-6 max-w-3xl">
              <form
                onSubmit={handleSubmit}
                className="space-y-4 sm:space-y-6 max-w-3xl"
              >
                {loading && (
                  <p className="text-sm text-gray-500">Memproses...</p>
                )}

                {msg.text && (
                  <div
                    className={`p-3 rounded text-sm ${
                      msg.type === "error"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}

                <div className="flex flex-col">
                  <label className="font-normal text-sm sm:text-base text-gray-900">
                    Alamat email
                  </label>
                  <span className="text-sm sm:text-base break-all">
                    {userEdit.email}
                  </span>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-normal text-gray-900 mb-2">
                    Nama
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Nama Pertama
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={userEdit.first_name}
                        onChange={handleChange}
                        className="w-full text-sm sm:text-base rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#b7b6b6] focus:border-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Nama Akhir
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={userEdit.last_name}
                        onChange={handleChange}
                        className="w-full text-sm sm:text-base rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#b7b6b6] focus:border-gray-900"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-normal text-gray-900 mb-2">
                    Password
                  </label>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative">
                      <input
                        type="password"
                        name="old_password"
                        placeholder="Password"
                        value={passwords.old_password}
                        onChange={handlePassChange}
                        className="w-full text-sm sm:text-base placeholder:text-sm rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#b7b6b6] focus:border-gray-900"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        name="new_password"
                        placeholder="Kata Sandi Baru"
                        value={passwords.new_password}
                        onChange={handlePassChange}
                        className="w-full text-sm sm:text-base placeholder:text-sm px-3 sm:px-4 rounded-xl py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#b7b6b6] focus:border-gray-900"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        name="confirm_password"
                        placeholder="Konfirmasi Kata Sandi Baru"
                        value={passwords.confirm_password}
                        onChange={handlePassChange}
                        className="w-full text-sm sm:text-base placeholder:text-sm px-3 sm:px-4 rounded-xl py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#b7b6b6] focus:border-gray-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 p-3 sm:p-3.5 rounded-xl flex gap-2 sm:gap-3">
                  <PiWarningCircleLight
                    size={15}
                    className="flex-shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-gray-700">
                    Saat memperbarui kata sandi Anda, semua sesi aktif mungkin
                    perlu login kembali untuk melanjutkan.
                  </p>
                </div>

                <div className="flex justify-end pt-3 sm:pt-4">
                  <button
                    onClick={handleUpdate}
                    type="submit"
                    disabled={loading}
                    className="bg-gray-900 text-white text-sm sm:text-base px-8 sm:px-12 py-2.5 sm:py-3 font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 w-full sm:w-auto"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
    // riwayat pesanan
    if (activeMenu === "riwayat-pesanan") {
      return (
        <div className="bg-white w-full max-w-2xl shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8">
          <Riwayat />
        </div>
      );
    }
    // sukai love
    if (activeMenu === "sukai-wishlist") {
      return (
        <div className="bg-white w-full max-w-3xl shadow-xl rounded-2xl p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <span>💖</span> Wish List
            </h1>
            {favorites.length > 0 && (
              <button
                onClick={clearFavorites}
                className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Hapus Semua
              </button>
            )}
          </div>

          {/* Empty State */}
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png"
                alt="Empty wishlist"
                className="w-20 h-20 mb-3 opacity-80"
              />
              <p className="text-gray-500 text-sm sm:text-base">
                Belum ada produk favorit kamu disini.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden border border-gray-200 rounded-xl">
              <table className="w-full border-collapse text-sm sm:text-base">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium">Produk</th>
                    <th className="py-3 px-4 text-left font-medium w-24">
                      Gambar
                    </th>
                    <th className="py-3 px-4 text-left font-medium">Harga</th>
                    <th className="py-3 px-4 text-center font-medium w-24">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {favorites.map((item) => (
                    <tr
                      key={item.id ?? item._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-gray-900 text-xs font-medium truncate max-w-[200px]">
                        {item.name}
                      </td>
                      <td className="py-3 px-4">
                        <img
                          src={item.Image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-md border border-gray-200"
                        />
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs sm:text-sm">
                        {formatToIDR(item.price)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => removeFavorite(item.id ?? item._id)}
                          className="text-red-600 cursor-pointer hover:text-red-700 text-xs sm:text-sm font-medium transition-colors"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    }

    // order chekout/informasi cara order
    if (activeMenu === "ordering") {
      return (
        <div className="bg-white w-full max-w-2xl shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8">
          <Ordering />
        </div>
      );
    }
    // log out
    if (activeMenu === "logout") {
      return (
        <div className="bg-white w-full max-w-2xl shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                Keluar Akun
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Konfirmasi untuk keluar
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-black p-4 rounded-lg mb-6">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Anda akan keluar dari akun ini. Untuk masuk kembali, silakan login
              menggunakan email dan password Anda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleLogout}
              className="bg-black text-white text-sm sm:text-base px-6 py-2.5 sm:py-3 font-medium hover:bg-gray-800 transition-all duration-200 w-full sm:flex-1 rounded-lg"
            >
              Ya, Keluar Sekarang
            </button>
            <button className="bg-white border-2 border-gray-300 text-gray-700 text-sm sm:text-base px-6 py-2.5 sm:py-3 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full sm:flex-1 rounded-lg">
              Batal
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* contennn */}
        <div
          onClick={() => navigate(-1)}
          className="lg:flex ml-5 mt-2 w-max items-center hidden  gap-1.5 hover:bg-black hover:text-white h-5"
        >
          <IoIosArrowRoundBack size={30} strokeWidth={2} />
          <h1 className="text-[12px] tracking-widest underline cursor-pointer font-semibold">
            KEMBALI
          </h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
              <div className="bg-[#e2e2e2bb] rounded-2xl shadow-sm">
                <div className="p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                    INFORMASI AKUN
                  </h2>
                  <button
                    onClick={() => {
                      setActiveMenu("informasi-account");
                      setIsEditing(false);
                    }}
                    className={`w-full text-left px-3 sm:px-4 py-3 sm:py-3.5 items-center flex font-semibold text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.2em] ${
                      activeMenu === "informasi-account"
                        ? "bg-black rounded-xl text-white"
                        : "rounded-xl hover:underline"
                    }`}
                  >
                    Akun Saya
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu("riwayat-pesanan");
                      setIsEditing(false);
                    }}
                    className={`w-full text-left px-3 sm:px-4 py-3 sm:py-3.5 items-center flex font-semibold text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.2em] ${
                      activeMenu === "riwayat-pesanan"
                        ? "bg-black rounded-xl text-white"
                        : "rounded-xl hover:underline"
                    }`}
                  >
                    Riwayat Pesanan
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu("sukai-wishlist");
                      setIsEditing(false);
                    }}
                    className={`w-full text-left px-3 sm:px-4 py-3 sm:py-3.5 items-center flex font-semibold text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.2em] ${
                      activeMenu === "sukai-wishlist"
                        ? "bg-black rounded-xl text-white"
                        : "rounded-xl hover:underline"
                    }`}
                  >
                    Wish List
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu("ordering");
                      setIsEditing(false);
                    }}
                    className={`w-full text-left px-3 sm:px-4 py-3 sm:py-3.5 items-center flex font-semibold text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.2em] ${
                      activeMenu === "ordering"
                        ? "bg-black rounded-xl text-white"
                        : "rounded-xl hover:underline"
                    }`}
                  >
                    Ordering
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu("logout");
                      setIsEditing(false);
                    }}
                    className={`w-full text-left px-3 sm:px-4 py-3 sm:py-3.5 items-center flex font-semibold text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.2em] ${
                      activeMenu === "logout"
                        ? "bg-black rounded-xl text-white"
                        : "rounded-xl hover:underline"
                    }`}
                  >
                    Keluar Akun
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">{renderContent()}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
