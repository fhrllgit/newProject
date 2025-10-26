import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddress } from "./hooks/useAddress";
import AddressForm from "./components/AddressForm";
import AddressModal from "./components/AddressModal";
import { RiCheckLine } from "react-icons/ri";
import { MdErrorOutline } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { useCart } from "../../context/cartContext";
import logo from "../../img/logo.png";
import { CiMobile3 } from "react-icons/ci";
import { FaCcVisa } from "react-icons/fa";
import { LiaCcAmex } from "react-icons/lia";
import { SiMastercard } from "react-icons/si";
import { SlPaypal } from "react-icons/sl";
import { FaQrcode } from "react-icons/fa6";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState("DETAIL_PESANAN");
  const [isDetailComplete, setIsDetailComplete] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [orderDetail, setOrderDetail] = useState(null);
  const [orders, setOrders] = useState([]);

  const [error, setError] = useState("");

  const { cart, removeFromCart, clearCart, totalItems, updateQuantity } =
    useCart();
  const userId = user?.id;

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
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
  useEffect(() => {
    const savedOrder = localStorage.getItem("orderData");
    if (savedOrder) {
      setIsDetailComplete(true);
      setActiveTab("PESANAN_DIBUAT");
    }
  }, []);

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

  // const [checkoutData, setCheckoutData] = useState(null);
  const [checkoutData, setCheckoutData] = useState({
    items: [],
    totalAfterDiscount: 0,
  });

  useEffect(() => {
    const data = localStorage.getItem("checkoutData");
    if (data) setCheckoutData(JSON.parse(data));
  }, []);

  const handleSelect = (method) => {
    setSelectedPayment(method);
  };

  useEffect(() => {
    const data = localStorage.getItem("checkoutData");
    if (data) setCheckoutData(JSON.parse(data));
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("checkoutData");
    if (data) setCheckoutData(JSON.parse(data));
  }, []);

  useEffect(() => {
    if (activeTab === "PESANAN_DIBUAT" && token) {
      const fetchOrders = async () => {
        try {
          const res = await fetch("https://backendlombaecomerce-production.up.railway.app/api/orders/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Gagal mengambil data pesanan");
          const orders = await res.json();
          // console.log("Orders user:", orders);
          setOrders(orders);
        } catch (err) {
          console.error(err);
          setOrders([]);
        }
      };

      fetchOrders();
    }
  }, [activeTab, token]);

  useEffect(() => {
    if (activeTab === "HISTORY" && token) {
      const fetchHistory = async () => {
        try {
          const res = await fetch("https://backendlombaecomerce-production.up.railway.app/api/orders/history", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setOrders(data);
        } catch (err) {
          console.error(err);
          setOrders([]);
        }
      };
      fetchHistory();
    }
  }, [activeTab, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-gray-500 animate-pulse">Memuat alamat...</p>
      </div>
    );
  }
  if (error) return <p>Error: {error}</p>;
  // if (orders.length === 0) return <p>Tidak ada pesanan ditemukan.</p>;

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
                <div className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide md:overflow-x-visible">
                  <button
                    onClick={() => setActiveTab("DETAIL_PESANAN")}
                    className={`text-sm cursor-pointer font-extrabold transition-all whitespace-nowrap ${
                      activeTab === "DETAIL_PESANAN" ? "underline" : ""
                    }`}
                  >
                    DETAIL PESANAN
                  </button>
                  <button
                    onClick={() =>
                      isDetailComplete && setActiveTab("PESANAN_DIBUAT")
                    }
                    className={`text-sm font-extrabold transition-all whitespace-nowrap ${
                      isDetailComplete
                        ? activeTab === "PESANAN_DIBUAT"
                          ? "underline cursor-pointer text-black"
                          : "text-black"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    PESANAN DIBUAT
                  </button>
                  <button
                    onClick={() => setActiveTab("HISTORY")}
                    className={`text-sm font-extrabold cursor-pointer transition-all whitespace-nowrap ${
                      activeTab === "HISTORY"
                        ? "underline cursor-pointer text-black"
                        : "text-black"
                    }`}
                  >
                    HISTORY PESANAN
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
            <div className="flex flex-col space-y-2 mt-4">
              <div
                className={`flex items-center justify-between border h-11 px-3 cursor-not-allowed rounded-xl opacity-50`}
              >
                <p>Credit Card</p>
                <span className="flex items-center gap-1">
                  <FaCcVisa size={30} />
                  <LiaCcAmex size={30} />
                  <SiMastercard size={30} />
                </span>
              </div>

              <div
                className={`flex items-center justify-between border h-11 px-3 cursor-not-allowed rounded-xl opacity-50`}
              >
                <p>Paypal</p>
                <span className="flex items-center gap-1">
                  <SlPaypal />
                </span>
              </div>

              <div
                onClick={() => handleSelect("cod")}
                className={`flex items-center justify-between border h-11 px-3 rounded-xl cursor-pointer transition-all ${
                  selectedPayment === "cod" ? "border-black" : "border-gray-700"
                }`}
              >
                <p>COD</p>
                <div
                  className={`w-6 h-6 border  flex items-center justify-center transition-all ${
                    selectedPayment === "cod"
                      ? "bg-black border-white"
                      : "border-gray-400"
                  }`}
                >
                  {selectedPayment === "cod" && (
                    <RiCheckLine size={24} className="text-white text-sm" />
                  )}
                </div>
              </div>

              <div
                className={`flex items-center justify-between border h-11 px-3 cursor-not-allowed rounded-xl opacity-50`}
              >
                <p>QRIS</p>
                <span className="flex items-center gap-1">
                  <FaQrcode />
                </span>
              </div>
            </div>
            <button
              onClick={async () => {
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

                if (selectedPayment !== "cod") {
                  setError("Saat ini hanya metode COD yang tersedia");
                  return;
                }

                setError("");

                const checkoutData =
                  JSON.parse(localStorage.getItem("checkoutData")) || {};

                const items = (checkoutData.items || []).map((item) => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  discount: item.discount || null,
                  qty: item.qty,
                  Image: item.Image,
                  size: item.size
                    ? `${item.size.type} ${item.size.value}`
                    : null,
                  variasi: item.variasi || null,
                }));

                const orderData = {
                  address: selectedAddress, 
                  paymentMethod: selectedPayment,
                  items: items, 
                  totalAfterDiscount: checkoutData.totalAfterDiscount || 0,
                };

                try {
                  const res = await fetch("https://backendlombaecomerce-production.up.railway.app/api/orders", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(orderData),
                  });

                  const data = await res.json();

                  if (!res.ok)
                    throw new Error(data.message || "Gagal kirim pesanan");

                  console.log("Pesanan terkirim ke admin:", data);

                  clearCart();
                  localStorage.removeItem("checkoutData");

                  setIsDetailComplete(true);
                  setActiveTab("PESANAN_DIBUAT");
                } catch (err) {
                  console.error("Gagal kirim pesanan:", err);
                  setError(err.message);
                }
              }}
              className={`mt-4 w-full py-2.5 sm:py-3 text-sm sm:text-base text-white ${
                selectedAddress &&
                checkboxes.agree1 &&
                checkboxes.agree2 &&
                checkboxes.agree3 &&
                selectedPayment === "cod"
                  ? "bg-black cursor-pointer hover:bg-gray-800"
                  : "bg-[#cacaca] cursor-not-allowed"
              }`}
              disabled={
                !selectedAddress ||
                !checkboxes.agree1 ||
                !checkboxes.agree2 ||
                !checkboxes.agree3 ||
                selectedPayment !== "cod"
              }
            >
              BUAT PESANAN
            </button>

            {error && (
              <p className="text-red-600 font-semibold text-xs sm:text-sm mt-2">
                {error}
              </p>
            )}
          </div>

          {/* pesanan  */}
          <div className="w-full lg:w-2/3">
            <div className="bg-[#eeeeeeba] p-4 shadow space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold tracking-wide">
                  RINGKASAN PESANAN:
                </h2>
                <span
                  onClick={() => navigate("/keranjang")}
                  className="text-xs hover:bg-black underline hover:text-white cursor-pointer"
                >
                  Edit Bag
                </span>
              </div>

              <div className="p-3 sm:p-4 bg-white space-y-3">
                <div className="flex flex-col space-y-2.5 justify-center">
                  <div className="flex items-center text-sm font-light gap-1.5">
                    <span>
                      {checkoutData.items.reduce(
                        (acc, item) => acc + item.qty,
                        0
                      )}
                    </span>
                    <span>PRODUK</span>
                  </div>
                  <hr />

                  <div className="flex justify-between text-sm font-light">
                    <span>Total Produk:</span>
                    <span>
                      Rp. {checkoutData.totalAfterDiscount.toLocaleString()}
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-sm font-light">
                    <span>Pengiriman ?</span>
                    <span>GRATIS</span>
                  </div>
                </div>

                {checkoutData.items.length === 0 ? (
                  <p className="text-gray-500 text-sm mt-2">
                    Tidak ada produk di keranjang
                  </p>
                ) : (
                  checkoutData.items.map((item) => (
                    <div
                      key={`${item.id}-${item.size?.value || "default"}`}
                      className="flex items-center gap-3 border-t pt-2"
                    >
                      <img
                        src={item.Image}
                        className="w-20 h-auto"
                        alt={item.name}
                      />
                      <div className="flex-1 flex flex-col">
                        <p className="text-xs font-semibold">{item.name}</p>
                        {item.size && (
                          <div className="flex items-center gap-2">
                            <h1 className="text-xs">Size:</h1>
                            <p className="text-xs text-gray-500">
                              {item.size.value}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.size.type}
                            </p>
                          </div>
                        )}
                        {item.variasi && (
                          <p className="text-xs text-gray-500">
                            Warna: {item.variasi}
                          </p>
                        )}
                        <div className="flex text-xs items-end gap-1.5 justify-end">
                          <div className="flex flex-col">
                            <div className="flex text-sm font-light">
                              <p>{item.qty}</p>
                              <span>x</span>
                            </div>
                            <span className="text-sm font-light">Total:</span>
                          </div>
                          <div className="flex flex-col text-sm font-light">
                            <p>
                              Rp.{" "}
                              {(item.discount
                                ? item.discount
                                : item.price
                              ).toLocaleString()}
                            </p>
                            <p>
                              Rp.{" "}
                              {(
                                (item.discount ? item.discount : item.price) *
                                item.qty
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                <hr className="bg-black" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "PESANAN_DIBUAT" && isDetailComplete && (
        <div className="container mt-28 px-6 sm:px-12 lg:px-20 mx-auto">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            Riwayat Pesanan Anda
          </h2>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <img
                src="/img/empty-box.png"
                alt="Tidak ada pesanan"
                className="w-32 mb-4 opacity-80"
              />
              <p className="text-sm sm:text-base font-light">
                Kamu belum memiliki pesanan.
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
              >
                Belanja Sekarang
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-4 rounded-xl shadow space-y-3 mb-4"
              >
                <div className="flex justify-between text-sm font-light">
                  <span>Status Pesanan:</span>
                  <span className="font-medium">{order.status}</span>
                </div>

                <div className="flex justify-between text-sm font-light">
                  <span>Tanggal:</span>
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm font-light">
                  <span>Total Produk:</span>
                  <span>
                    Rp. {order.totalAfterDiscount?.toLocaleString?.() || "0"}
                  </span>
                </div>

                <hr />

                {order.items.map((item, i) => {
                  const activePrice = item.Discount || item.Price || 0;
                  const total = activePrice * item.Quantity;

                  return (
                    <div
                      key={`${item.id}-${i}`}
                      className="flex items-center gap-3 border-t pt-2"
                    >
                      <img
                        src={item.Image}
                        className="w-20 h-auto rounded-md"
                        alt={item.Name}
                      />
                      <div className="flex-1 flex flex-col">
                        <p className="text-xs font-semibold">{item.Name}</p>
                        {item.Size && (
                          <p className="text-xs text-gray-500">
                            Size: {item.Size}
                          </p>
                        )}
                        {item.Variasi && (
                          <p className="text-xs text-gray-500">
                            Warna: {item.Variasi}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Jumlah: {item.Quantity} × Rp{" "}
                          {activePrice.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Total: Rp {total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "HISTORY" && (
        <div className="container mt-28 px-6 sm:px-12 lg:px-20 mx-auto">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            Riwayat Pesanan Anda
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-500">Belum ada pesanan selesai.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-4 rounded-xl shadow mb-4"
              >
                <div className="flex justify-between text-sm font-light">
                  <span>Status Pesanan:</span>
                  <span className="font-medium">{order.status}</span>
                </div>

                <div className="flex justify-between text-sm font-light">
                  <span>Tanggal:</span>
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm font-light">
                  <span>Total Produk:</span>
                  <span>Rp. {order.totalAfterDiscount.toLocaleString()}</span>
                </div>

                <hr />

                {order.items.map((item, i) => (
                  <div
                    key={`${item.id}-${i}`}
                    className="flex items-center gap-3 border-t pt-2"
                  >
                    <img
                      src={item.Image}
                      className="w-20 h-auto rounded-md"
                      alt={item.Name}
                    />
                    <div className="flex-1 flex flex-col">
                      <p className="text-xs font-semibold">{item.Name}</p>
                      {item.Size && (
                        <p className="text-xs text-gray-500">
                          Size: {item.Size}
                        </p>
                      )}
                      {item.Variasi && (
                        <p className="text-xs text-gray-500">
                          Warna: {item.Variasi}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Jumlah: {item.Quantity} × Rp{" "}
                        {item.Discount || item.Price}
                      </p>
                      <p className="text-xs text-gray-500">
                        Total: Rp{" "}
                        {(item.Discount || item.Price) * item.Quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
