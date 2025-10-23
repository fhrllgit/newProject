import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddress } from "./hooks/useAddress";
import AddressForm from "./components/AddressForm";
import AddressModal from "./components/AddressModal";
import OrderSummary from "./components/OrderSummary";
import { RiCheckLine } from "react-icons/ri";
import { MdErrorOutline } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { BsTruck } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { CiLogin } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useCart } from "../../context/cartContext";
import logo from "../../img/logo.png";
import { CiMobile3 } from "react-icons/ci";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState("DETAIL_PESANAN");
  const [isDetailComplete, setIsDetailComplete] = useState(false);

  const { cart, removeFromCart, clearCart, totalItems, updateQuantity } =
    useCart();
  const userId = user?.id;

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  // const [loading, setLoading] = useState(false);

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
  const handleCompleteDetail = () => {
    if (
      selectedAddress &&
      checkboxes.agree1 &&
      checkboxes.agree2 &&
      checkboxes.agree3
    ) {
      setIsDetailComplete(true);
      setActiveTab("PESANAN_DIBUAT");
    } else {
      alert("Harap selesaikan detail pesanan terlebih dahulu");
    }
  };

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    agree1: false,
    agree2: false,
    agree3: false,
  });
  const checkboxTexts = [
    "Saya menyatakan bahwa saya berusia minimal 18 tahun atau telah mencapai usia legal untuk membeli produk ini sesuai dengan hukum yang berlaku di wilayah saya. Saya memahami bahwa penggunaan produk ini oleh anak di bawah umur adalah ilegal.",
    "Saya menyatakan bahwa saya telah menyetujui ",
    "Saya setuju dengan syarat dan ketentuan C",
  ];

  const { addresses, loading, addAddress, deleteAddress, fetchAddresses } =
    useAddress(userId, token);

  useEffect(() => {
    const savedAddress = localStorage.getItem("selectedAddress");
    if (savedAddress) {
      setSelectedAddress(JSON.parse(savedAddress));
    }
  }, []);

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const handleSaveAddress = async (data) => {
    try {
      await addAddress({ ...data, user_id: userId });
      setShowForm(false);
      await fetchAddresses();
    } catch (err) {
      console.error("Gagal menambah alamat:", err);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress(id);
      if (selectedAddress?.id === id) {
        setSelectedAddress(null);
        localStorage.removeItem("selectedAddress");
      }
      await fetchAddresses();
    } catch (err) {
      console.error("Gagal menghapus alamat:", err);
    }
  };

  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr);
    localStorage.setItem("selectedAddress", JSON.stringify(addr));
    setShowAddressModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-gray-500 animate-pulse">Memuat alamat...</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="w-full">
        {/* navbar deks */}
        <div className="block w-full">
          {/* sticky */}
          <div className="w-full bg-white border-b-2 border-b-[#e1e1e1a5] transition-all duration-500 ease-in-out fixed top-0 left-0 z-50">
            <div className="w-full px-8 lg:px-16 xl:px-35 py-2">
              <div className="flex items-center justify-between w-full">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-auto object-contain"
                    src={logo}
                    alt="Logo"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="sm:flex items-center gap-1 cursor-pointer">
                      <div className="flex items-center">
                        <CiMobile3 size={20} />
                        <span className="font-semibold text-sm">
                          BANTUAN? 0831-9382-863
                        </span>
                      </div>
                      <p className="text-xs font-light">
                        Senin to Sabtu: 9am - 5pm
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* route category */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex gap-8">
                  <button
                    onClick={() => setActiveTab("DETAIL_PESANAN")}
                    className={`text-sm cursor-pointer font-extrabold transition-all ${
                      activeTab === "DETAIL_PESANAN" ? "underline" : ""
                    }`}
                  >
                    DETAIL PESANAN
                  </button>

                  <button
                    onClick={() =>
                      isDetailComplete && setActiveTab("PESANAN_DIBUAT")
                    }
                    className={`text-sm font-extrabold transition-all ${
                      isDetailComplete
                        ? activeTab === "PESANAN_DIBUAT"
                          ? "underline cursor-pointer text-black"
                          : "text-black"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    PESANAN DIBUAT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeTab === "DETAIL_PESANAN" && (
        <div className="container mt-25 px-4 sm:px-6 lg:px-15 xl:px-25 mx-auto py-6 sm:py-8 lg:py-10 lg:flex gap-6">
          <div className="w-full lg:w-1/3 mb-6 lg:mb-0">
            {showForm ? (
              <AddressForm
                onSave={handleSaveAddress}
                onCancel={() => setShowForm(false)}
              />
            ) : (
              <div>
                {selectedAddress ? (
                  <div
                    className="border border-red-800 p-3 sm:p-4 rounded-2xl cursor-pointer"
                    onClick={() => setShowAddressModal(true)}
                  >
                    <div className="flex gap-2.5">
                      <CiLocationOn size={30} className="flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h1 className="font-semibold text-xs sm:text-sm mb-1">
                          ALAMAT PENGIRIMAN
                        </h1>
                        <div className="flex flex-col sm:flex-row sm:gap-2 text-xs sm:text-sm">
                          <p className="font-normal">
                            {selectedAddress.nama_penerima}
                          </p>
                          <p className="font-light break-words">
                            {selectedAddress.alamat_lengkap},{" "}
                            {selectedAddress.kota}, {selectedAddress.kecamatan},{" "}
                            {selectedAddress.kode_pos}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto"
                  >
                    Pilih Alamat
                  </button>
                )}
              </div>
            )}

            {/* popuppp alamat */}
            {showAddressModal && (
              <AddressModal
                addresses={addresses}
                onSelect={handleSelectAddress}
                onDelete={handleDeleteAddress}
                onAddNew={() => setShowForm(true)}
                onClose={() => setShowAddressModal(false)}
              />
            )}

            <div className="flex flex-col gap-2 sm:gap-3 mt-4">
              {checkboxTexts.map((text, index) => {
                const key = `agree${index + 1}`;
                return (
                  <div
                    key={key}
                    onClick={() =>
                      setCheckboxes({ ...checkboxes, [key]: !checkboxes[key] })
                    }
                    className="flex gap-2 cursor-pointer select-none"
                  >
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 mt-1 sm:mt-2 border flex items-center justify-center transition-colors duration-200 flex-shrink-0 ${
                        checkboxes[key]
                          ? "bg-black border-black"
                          : "border-black"
                      }`}
                    >
                      {checkboxes[key] && (
                        <RiCheckLine className="text-white" size={24} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-sm">{text}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {(!checkboxes.agree1 ||
              !checkboxes.agree2 ||
              !checkboxes.agree3) && (
              <p className="text-red-600 font-semibold text-xs sm:text-sm mt-4 sm:mt-5">
                Anda harus menerima ketentuan yang disyaratkan untuk melanjutkan
                halaman berikut nya.
              </p>
            )}

            <div className="flex flex-col mt-6 sm:mt-8">
              <h1 className="text-lg sm:text-xl font-semibold">
                METODE PENGIRIMAN
              </h1>
              <div className="flex gap-2 mt-3 items-start">
                <MdErrorOutline className="mt-0.5 flex-shrink-0" size={18} />
                <p className="text-xs sm:text-sm font-light">
                  Produk akan di kirim dalam waktu 2-5 hari untuk wilayah Jateng
                  dan 8-14 hari untuk wilayah lainya/diluar Jateng
                </p>
              </div>
              <span className="text-xs sm:text-sm font-light mt-6 sm:mt-10">
                Tidak ada metode pengiriman yang tersedia
              </span>
            </div>

            <button
              onClick={() => {
                if (!selectedAddress) {
                  setError("Harap pilih alamat pengiriman terlebih dahulu");
                  return;
                }
                if (
                  !checkboxes.agree1 ||
                  !checkboxes.agree2 ||
                  !checkboxes.agree3
                ) {
                  setError("Harap setujui semua persetujuan sebelum checkout");
                  return;
                }
                setError("");
                console.log("Checkout berhasil!", selectedAddress);
              }}
              className={`mt-4 w-full py-2.5 sm:py-3 text-sm sm:text-base text-white ${
                selectedAddress &&
                checkboxes.agree1 &&
                checkboxes.agree2 &&
                checkboxes.agree3
                  ? "bg-black cursor-pointer"
                  : "bg-[#cacaca] cursor-not-allowed"
              }`}
              disabled={
                !selectedAddress ||
                !checkboxes.agree1 ||
                !checkboxes.agree2 ||
                !checkboxes.agree3
              }
            >
              BUAT PESANAN
            </button>
          </div>

          {/* pesanan  */}
          <div className="w-full lg:w-2/3">
            <OrderSummary selectedAddress={selectedAddress} />
          </div>
        </div>
      )}

      {activeTab === "PESANAN_DIBUAT" && isDetailComplete && (
        <p>Untuk pesanan nanti</p>
      )}
    </div>
  );
};

export default CheckoutPage;
