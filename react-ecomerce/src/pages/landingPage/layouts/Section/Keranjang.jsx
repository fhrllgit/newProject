import React from "react";
import { useState, useEffect } from "react";
import { useCart } from "../../../../context/cartContext";
import logo from "../../../../img/logo.png";
import { BsTruck } from "react-icons/bs";
import { CiLogin } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { AiOutlineUser } from "react-icons/ai";



const Cart = () => {
  const { cart, removeFromCart, clearCart, totalItems, updateQuantity } = useCart();

    // sticky navbarrr
    const [isSticky, setIsSticky] = useState(false);
    useEffect(() => {
      const handleScroll = () => {
        const ctaHeight = 45;
  
        if (window.scrollY > ctaHeight) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);


  return (
    <>
     <div className="w-full">
            {/* navbar deks */}
            <div className="hidden xl:block w-full">
              {/* cta */}
              <div className="flex justify-center items-center gap-10 py-2.5 bg-[#d1d1d155] w-full overflow-hidden">
                <div className="flex items-center gap-2">
                  <BsTruck size={20} />
                  <span className="text-xs tracking-tight">
                    GRATIS ONGKIR UNTUK PENGGUNA PERTAMA
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BsTruck size={20} />
                  <span className="text-xs tracking-tight">
                    GRATIS ONGKIR UNTUK PENGGUNA PERTAMA
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BsTruck size={20} />
                  <span className="text-xs tracking-tight">
                    GRATIS ONGKIR UNTUK PENGGUNA PERTAMA
                  </span>
                </div>
              </div>
    
              {/* sticky */}
              <div
                className={`w-full bg-white border-b-2 border-b-[#e1e1e1a5] transition-all duration-500 ease-in-out ${
                  isSticky ? "fixed top-0 left-0 z-50" : "relative"
                }`}
              >
                <div className="w-full px-8 lg:px-16 xl:px-24 py-2">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-auto object-contain"
                        src={logo}
                        alt="Logo"
                      />
                    </div>
    
                    <div className="flex items-center gap-6">
                      {/* buat cari mengko di router beda halaman dan masuk ke hal cari */}
                      <div className="border-b w-50 border-[#c3c3c3] cursor-pointer pb-1">
                        <span className="text-xs font-light text-[#939393]">
                          CARI
                        </span>
                      </div>
    
                      <div className="relative group">
                        <div className="flex items-center gap-1 cursor-pointer">
                          <AiOutlineUser size={20} strokeWidth={2} />
                          <span className="text-sm font-extrabold whitespace-nowrap">
                            Masuk / Daftar
                          </span>
                        </div>
    
                        {/* route hover hal login */}
                        <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-lg rounded-xl bg-white z-40">
                          <div className="p-3">
                            <div className="flex items-center gap-3">
                              <CiLogin size={18} strokeWidth={0.5} />
                              <div className="text-sm flex items-center gap-1 font-light">
                                <button
                                  onClick={() => navigate("/login")}
                                  className="hover:underline cursor-pointer"
                                >
                                  Masuk
                                </button>
                                <span>/</span>
                                <button
                                  onClick={() => navigate("/register")}
                                  className="hover:underline cursor-pointer"
                                >
                                  Daftar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <CiHeart
                          size={23}
                          strokeWidth={0.5}
                          className="cursor-pointer hover:text-red-500 transition-colors"
                        />
                        <div className="relative">
          <HiOutlineShoppingBag
            size={23}
            strokeWidth={1.5}
            className="cursor-pointer hover:text-blue-600 transition-colors"
          />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </div>
                      </div>
                    </div>
                  </div>
    
                  {/* route category */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex gap-8">
                      <button className="text-sm cursor-pointer font-extrabold hover:underline transition-all">
                        PRIA
                      </button>
                      <button className="text-sm cursor-pointer font-extrabold hover:underline transition-all">
                        WANITA
                      </button>
                      <button className="text-sm cursor-pointer font-extrabold hover:underline transition-all">
                        ANAK
                      </button>
                    </div>
                  </div>
                </div>
              </div>
    
              {/* Spacer - Prevent content jump saat navbar jadi fixed */}
              {isSticky && <div className="h-[120px]" />}
            </div>
    
            {/* navbar mobile */}
            <div className="flex xl:hidden w-full fixed top-0 left-0 bg-white z-40 border-b py-3 border-b-[#e1e1e1a5] items-center justify-between px-4">
              <h2 className="text-sm font-medium flex-grow text-center">
                {/* {product.name} */}
              </h2>
              <CiHeart
                size={23}
                strokeWidth={0.5}
                className="text-gray-700 cursor-pointer hover:text-red-500 transition-colors flex-shrink-0"
              />
            </div>
          </div>


    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Keranjang Belanja</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Keranjang kamu masih kosong 😢</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex items-center justify-between border-b pb-3"
              >
                {/* Gambar produk */}
                {item.Image && (
                  <img
                    src={item.Image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}

                {/* Info produk */}
                <div className="flex-1 ml-4">
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-500">Ukuran: {item.size}</p>

                  {/* ✅ Dropdown jumlah */}
                  <div className="flex items-center gap-2 mt-1">
                    <label className="text-sm text-gray-500">Jumlah:</label>
                    <select
                      value={item.qty}
                      onChange={(e) =>
                        updateQuantity(item.id, item.size, e.target.value)
                      }
                      className="border rounded-md px-2 py-1 text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                    <span className="text-gray-600 text-sm">
                      × Rp{item.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Tombol hapus */}
                <button
                  onClick={() => removeFromCart(item.id, item.size)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>

          {/* Total dan hapus semua */}
          <div className="mt-6 border-t pt-4 flex justify-between items-center">
            <p className="font-semibold">
              Total Item: {totalItems} | Total Harga: Rp
              {cart
                .reduce((acc, item) => acc + item.price * item.qty, 0)
                .toLocaleString()}
            </p>
            <button
              onClick={clearCart}
              className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Hapus Semua
            </button>
          </div>
        </>
      )}
    </div>
    </>

  );
};

export default Cart;
