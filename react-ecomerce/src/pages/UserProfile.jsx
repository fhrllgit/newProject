import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [profileMessage, setProfileMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:3005/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil profil");
        }

        const data = await res.json();
        setProfileMessage(data.message);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      await fetch("http://localhost:3005/api/users/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3V3z" />
                </svg>
                <span>GRATIS ONGKIR UNTUK PESANAN MIN. 900RB</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth={2}/>
                </svg>
                <span>CHAT DENGAN KAMI</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>KONTAK RESMI ADIDAS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-12">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-8">HALO {profileMessage}</h1>

            <div className="mb-12">
              <h2 className="text-xl font-bold mb-6">CUSTOMER DATA MIGRATION</h2>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-700 flex items-center justify-center">
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">
                    adidas akan melakukan peningkatan sistem segera (tanggal akan segera diumumkan), dan saya menyatakan bahwa saya telah membaca dan memahami{' '}
                    <a href="#" className="text-blue-600 underline">
                      syarat dan ketentuan baru
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">RECENT ORDERS</h2>
                <button className="text-sm underline hover:no-underline">
                  View All
                </button>
              </div>
              <p className="text-gray-600 mb-8">Anda sedang tidak memiliki pesanan.</p>
              
              <button 
                onClick={() => navigate("/")}
                className="bg-black text-white px-8 py-4 font-bold flex items-center gap-3 hover:bg-gray-800 transition-colors"
              >
                BERBELANJA
              </button>
            </div>
          </div>

          <div className="w-80">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm">Bukan {profileMessage}?</span>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-bold underline hover:no-underline"
                >
                  KELUAR
                </button>
              </div>
              <div className="text-sm">
                <button className="block w-full text-left py-2 border-b border-gray-200 hover:bg-gray-50">
                  Akun Saya
                </button>
              </div>
            </div>

            <nav className="space-y-4 text-sm">
              <a href="#" className="block hover:underline">Informasi Pribadi</a>
              <a href="#" className="block hover:underline">Your Preferences</a>
              <a href="#" className="block hover:underline">Daftar Alamat</a>
              <a href="#" className="block hover:underline">Riwayat Pesanan</a>
              <a href="#" className="block hover:underline">Wish List</a>
            </nav>

            <div className="mt-12">
              <h3 className="text-lg font-bold mb-4">NEED HELP?</h3>
              <nav className="space-y-3 text-sm">
                <a href="#" className="block hover:underline">Ordering</a>
                <a href="#" className="block hover:underline">Promotions & Vouchers</a>
                <a href="#" className="block hover:underline">Payment</a>
                <a href="#" className="block hover:underline">Delivery</a>
                <a href="#" className="block hover:underline">Returns and Refunds</a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default UserProfile;
