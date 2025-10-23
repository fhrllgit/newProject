import React, { use } from "react";
import { useState, useEffect } from "react";
import { useCart } from "../../../../context/cartContext";
import logo from "../../../../img/logo.png";
import { BsTruck } from "react-icons/bs";
import { CiLogin } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { AiOutlineUser } from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { CiDiscount1 } from "react-icons/ci";
import login from "../../../../img/logo.png";


const Cart = () => {
  const { cart, removeFromCart, clearCart, totalItems, updateQuantity } =
    useCart();
  const [openQtyItems, setOpenQtyItems] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const totalNormal = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
const totalDiscount = cart.reduce((acc, item) => {
  if (item.discount) {
    return acc + (item.price - item.discount) * item.qty;
  }
  return acc; 
}, 0);

  const totalAfterDiscount = totalNormal - totalDiscount;
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

  const toggleDropdown = (id) => {
    setOpenQtyItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCheckout = () => {
    setLoading(true)
    const checkoutData = {
      items: cart,
      totalNormal,
      totalDiscount,
      totalAfterDiscount,
    };
    console.log(checkoutData);
    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    setTimeout(() => {
      setLoading(false)
      navigate("/checkout");
    }, 700);
  };

  // const type = item.size?.[0]?.type;

  return (
    <>
      <div>
         {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="relative flex items-center justify-center">
            <div className="absolute animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
            <img
              src={login}
              alt="Loading Logo"
              className="w-12 h-auto object-contain"
            />
          </div>
        </div>
      )}
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

        <div className="md:flex">
          <div className="md:px-30 mt-10 lg:mt-10 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 scrollbar-hide overflow-y-auto max-h-screen md:flex-1/2 bg-white">
            {cart.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center space-y-2.5">
                <p className="text-black text-xl sm:text-2xl lg:text-3xl font-semibold text-center">
                  BAG ANDA KOSONG
                </p>
                <div className="border w-full max-w-md flex-1 pb-0.5">
                  <div
                    onClick={() => navigate("/")}
                    className="bg-black w-full flex gap-3 items-center cursor-pointer justify-between px-3 hover:text-gray-400 -mt-0.5 h-12 -ml-0.5"
                  >
                    <p className="text-xs font-bold text-white tracking-[0.2em]">
                      LANJUTKAN BELANJA ANDA
                    </p>
                    <FaArrowRightLong className="text-white" size={20} />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-5 bg-[#dfdede2c] rounded-2xl">
                  <div className="flex items-center gap-2.5 p-2">
                    <img
                      src={logo}
                      alt="tas"
                      className="w-10 sm:w-12 lg:w-13 h-auto object-cover"
                    />
                    <h1 className="text-base sm:text-lg font-bold">
                      Tas ({totalItems})
                    </h1>
                  </div>
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.size.value}`}
                      className="bg-white shadow rounded-2xl p-3 sm:p-4"
                    >
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        {item.Image && (
                          <img
                            src={item.Image}
                            alt={item.name}
                            className="w-full sm:w-32 md:w-36 lg:w-42 h-auto object-cover rounded-md"
                          />
                        )}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex flex-col space-y-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h2 className="text-black font-semibold mb-2 text-sm sm:text-base">
                                  {item.name}
                                </h2>
                              </div>
                              <button
                                onClick={() =>
                                  removeFromCart(item.id, item.size)
                                }
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <svg
                                  className="w-5 h-5 sm:w-6 sm:h-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                                Ukuran: {item.size?.type || "-"} |{" "}
                                {item.size?.value || "-"}
                              </p>
                              <p className="text-red-800 bg-red-100 text-xs sm:text-sm p-0.5 rounded-md font-medium w-fit">
                                Hanya {item.size?.stock} lagi
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                              <div className="border border-[#cacaca] w-max py-0.5 rounded-md cursor-pointer bg-white">
                                <div
                                  className="flex px-3 items-center gap-3"
                                  onClick={() => toggleDropdown(item.id)}
                                >
                                  <span className="text-[#a3a3a3] font-normal text-sm">
                                    {item.qty}
                                  </span>
                                  <FiChevronDown size={18} strokeWidth={2.5} />
                                </div>

                                {openQtyItems[item.id] && (
                                  <div className="z-10 items-center">
                                    {Array.from(
                                      { length: item.size.stock },
                                      (_, i) => i + 1
                                    ).map((num) => (
                                      <div
                                        key={num}
                                        className="px-3 py-1 border-t border-t-black hover:bg-gray-100 cursor-pointer text-sm"
                                        onClick={() => {
                                          updateQuantity(
                                            item.id,
                                            item.size,
                                            num
                                          );
                                          toggleDropdown(item.id);
                                        }}
                                      >
                                        {num}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-baseline gap-2">
                                <div className="flex flex-wrap items-baseline gap-2">
                                  {item.discount && item.discount > 0 ? (
                                    <>
                                      <div className="flex items-center gap-1 flex-wrap">
                                        <CiDiscount1
                                          className="text-red-800"
                                          strokeWidth={1}
                                        />
                                        <span className="text-red-800 font-semibold text-sm sm:text-md">
                                          Rp {item.discount.toLocaleString()}
                                        </span>
                                        <span className="text-[#6d6d6d] font-normal ml-1 line-through text-xs">
                                          Rp {item.price.toLocaleString()}
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <span className="text-black font-bold text-sm sm:text-md">
                                      Rp {item.price.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {item.discount && item.discount > 0 ? (
                            <>
                              <div className="flex mt-3 sm:mt-0 bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg p-2">
                                <div className="flex gap-2 items-center">
                                  <CiDiscount1
                                    className="text-red-800"
                                    strokeWidth={1}
                                  />
                                  <span className="text-xs">Diskon</span>
                                  <span className="text-black font-bold text-xs">
                                    Rp{" "}
                                    {(
                                      item.price - item.discount
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="md:flex-1/8 md:border-l border-l-[#cacaca] md:h-screen px-4 sm:px-6 lg:px-8 py-6 md:py-0">
            {cart.length === 0 ? (
              <div className="mt-6">
                <h1 className="font-bold text-lg sm:text-xl">BUTUH BANTUAN?</h1>
                <div className="flex flex-col space-y-1.5">
                  <p className="text-xs sm:text-sm tracking-wider cursor-pointer w-max underline hover:text-white hover:bg-black font-light">
                    Order
                  </p>
                  <p className="text-xs sm:text-sm tracking-wider cursor-pointer w-max underline hover:text-white hover:bg-black font-light">
                    Promotion & Vouchers
                  </p>
                  <p className="text-xs sm:text-sm tracking-wider cursor-pointer w-max underline hover:text-white hover:bg-black font-light">
                    Payment
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 md:pt-6">
                <h1 className="text-lg sm:text-xl mb-5 font-semibold">
                  JUMLAH PESANAN:
                </h1>
                <div className="p-3 sm:p-4 rounded-xl bg-[#eeeeeeba]">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-800 text-xs sm:text-sm font-semibold">
                      Subtotal (<span className="font-bold">{totalItems}</span>{" "}
                      Produk)
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-gray-900">
                      Rp {totalNormal.toLocaleString()}
                    </p>
                  </div>
                  <hr className="bg-black" />
                  <div className="flex flex-col space-y-1.5 mt-3">
                    <p className="font-light text-xs sm:text-sm to-black">
                      Total Penghematan
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="font-light text-xs sm:text-sm underline">
                        discount new product?
                      </p>
                      <span className="text-black font-bold text-xs sm:text-sm">
                        Rp {totalDiscount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5 mt-3">
                    <p className="text-xs sm:text-sm font-light">Pengiriman</p>
                    <div className="flex justify-between font-light text-xs sm:text-sm">
                      <span>Ongkir ?</span>
                      <span>GRATIS</span>
                    </div>
                  </div>
                  <hr className="bg-black mt-3 mb-3" />
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm font-semibold tracking-wider">
                      Total{" "}
                      <span className="text-xs font-light">(Termasuk dll)</span>
                    </p>
                    <p className="text-sm sm:text-base font-bold">
                      Rp{""}
                      {totalAfterDiscount.toLocaleString()}
                    </p>
                  </div>
                  <div className="border mt-5 max-w-md flex-1 pb-0.5">
                    <div
                      onClick={handleCheckout}
                      className="bg-black w-full flex gap-3 items-center cursor-pointer justify-between px-3 hover:text-gray-400 -mt-0.5 h-12 -ml-0.5"
                    >
                      <p className="text-xs font-bold text-white tracking-[0.2em]">
                        CHECKOUT
                      </p>
                      <FaArrowRightLong className="text-white" size={20} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col mt-10 sm:mt-20">
                  <h1 className="font-bold text-lg sm:text-xl">
                    BUTUH BANTUAN?
                  </h1>
                  <div className="flex flex-col space-y-1.5">
                    <p className="text-xs sm:text-sm tracking-wider cursor-pointer w-max underline hover:text-white hover:bg-black font-light">
                      Order
                    </p>
                    <p className="text-xs sm:text-sm tracking-wider cursor-pointer w-max underline hover:text-white hover:bg-black font-light">
                      Promotion & Vouchers
                    </p>
                    <p className="text-xs sm:text-sm tracking-wider cursor-pointer w-max underline hover:text-white hover:bg-black font-light">
                      Payment
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
