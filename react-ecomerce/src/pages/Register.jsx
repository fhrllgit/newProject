import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { TfiCheck } from "react-icons/tfi";
import { Menu, X, Search, ShoppingCart, User } from "lucide-react";
import logo from "../img/logo.png";
import Swal from "sweetalert2";

export default function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const panduan = [
    {
      icon: <TfiCheck />,
      label: "Produk dengan harga spesial sepanjang tahun, setiap hari.",
    },
    { icon: <TfiCheck />, label: "Kelola Wishlist" },
    { icon: <TfiCheck />, label: "Checkout lebih cepat" },
    { icon: <TfiCheck />, label: "Akses awal ke SALE" },
  ];
  
  const handleCLick = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/login");
      setLoading(false);
    }, 700);
  };

  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/users/register", form);
      alert("Registrasi berhasil, silakan login");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Gagal register");
    }
  };

  return (
    <div>
      <div className="h-full w-full">
        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="relative flex items-center justify-center">
              <div className="absolute animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>

              <img
                src={logo}
                alt="Loading Logo"
                className="w-12 h-auto object-contain"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col min-h-screen">
            <div className="hidden md:flex py-3 px-4 lg:px-20 bg-transparent w-full fixed justify-between z-50">
              <div>
                <img
                  className="w-40 lg:w-70 h-auto object-cover"
                  src="../src/img/logo.png"
                  alt=""
                />
              </div>
              <div className="flex gap-6 items-center">
                <div className="border-b-[#c3c3c3] border-b w-50 cursor-pointer">
                  <span className="text-xs font-light text-[#939393]">
                    CARI
                  </span>
                </div>
                <span
                  onClick={handleCLick}
                  className="text-xs font-light text-[#939393] cursor-pointer"
                >
                  LOG IN
                </span>
                <div className="flex items-center justify-center cursor-pointer">
                  <span className="text-xs font-light text-[#939393]">
                    KERANJANG [0]
                  </span>
                </div>
              </div>
            </div>

            <div className="md:hidden flex py-3 px-4 bg-white w-full fixed justify-between items-center z-50 border-b border-gray-200">
              <div>
                <img
                  className="w-32 h-auto object-cover"
                  src="../src/img/logo.png"
                  alt=""
                />
              </div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2"
              >
                {isMenuOpen ? (
                  <X className="w-8 h-8 text-[#939393]" strokeWidth={1} />
                ) : (
                  <Menu className="w-8 h-8 text-[#939393]" strokeWidth={1} />
                )}
              </button>
            </div>

            {isMenuOpen && (
              <div className="md:hidden fixed top-20 left-0 right-0 bg-white z-40 border-b border-gray-200 shadow-lg">
                <div className="flex flex-col p-4 space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#c3c3c3] pb-2 cursor-pointer">
                    <Search className="w-4 h-4 text-[#939393]" />
                    <span className="text-xs font-light text-[#939393]">
                      CARI
                    </span>
                  </div>
                  <div
                    onClick={handleCLick}
                    className="flex items-center gap-2 border-b border-[#c3c3c3] pb-2 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#939393]" />
                    <span className="text-xs font-light text-[#939393]">
                      LOG IN
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pb-2 cursor-pointer">
                    <ShoppingCart className="w-4 h-4 text-[#939393]" />
                    <span className="text-xs font-light text-[#939393]">
                      KERANJANG [0]
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* content */}
            <div className="flex flex-col md:flex-row mt-20 md:mt-35 px-4 md:px-0">
              <div className="flex flex-1 md:flex-1/2 justify-center mb-8 md:mb-0">
                <div className="w-full md:w-md py-1 flex flex-col">
                  <div className="px-2">
                    <p className="text-sm font-light tracking-[0.1em] mt-8">
                      DETAIL PRIBADI
                    </p>
                    <div className="flex flex-col mt-8">
                      <div className="w-full border-b-[#c3c3c3] border-b-1">
                        <input
                          className="outline-0 ring-0 w-full placeholder:text-xs font-extralight placeholder:text-[#939393] mb-1.5"
                          placeholder="NAMA DEPAN"
                          onChange={(e) =>
                            setForm({ ...form, first_name: e.target.value })
                          }
                        />
                      </div>
                      <div className="w-full border-b-[#c3c3c3] border-b mt-9">
                        <input
                          className="outline-0 ring-0 w-full placeholder:text-xs font-extralight placeholder:text-[#939393] mb-1.5"
                          placeholder="NAMA BELAKANG"
                          onChange={(e) =>
                            setForm({ ...form, last_name: e.target.value })
                          }
                        />
                      </div>
                      <div className="w-full border-b-[#c3c3c3] border-b mt-9">
                        <input
                          className="outline-0 ring-0 w-full placeholder:text-xs font-extralight placeholder:text-[#939393] mb-1.5"
                          placeholder="EMAIL"
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="w-full border-b-[#c3c3c3] border-b mt-9">
                        <input
                          className="outline-0 ring-0 w-full placeholder:text-xs font-extralight placeholder:text-[#939393] mb-1.5"
                          type="password"
                          placeholder="PASSWORD"
                          onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                          }
                        />
                      </div>
                      <div className="w-full border-b-[#c3c3c3] border-b mt-9">
                        <input
                          className="outline-0 ring-0 w-full placeholder:text-xs font-extralight placeholder:text-[#939393] mb-1.5"
                          type="password"
                          placeholder="KONFIRMASI PASSWORD"
                          onChange={(e) =>
                            setForm({
                              ...form,
                              confirm_password: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="flex flex-col space-y-2.5 mt-10">
                        <div className="border flex-1 pb-0.5">
                          <button
                            className="text-center w-full text-[#fffbfb] cursor-pointer font-extralight tracking-wider bg-black p-2 text-xs -mt-1 h-8 -ml-0.5"
                            onClick={handleSubmit}
                          >
                            REGISTER
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-15">
                      <span className="text-xs font-extralight tracking-widest">
                        BANTUAN
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex py-1 flex-1 md:flex-1/2">
                <div className="mt-5">
                  <p className="text-md font-semibold">CREATE AN ACCOUNT</p>
                  <p className="text-md text-[#242424] font-extralight mt-5">
                    Sangat mudah. Masukan alamat email Anda, isi formulir di
                    bagian atas dan <br className="hidden md:block" /> nikmati
                    keuntungan dari memiliki akun, misal nya:
                  </p>
                  <div className="gap-2 flex flex-col mt-3 px-2">
                    {panduan.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {item.icon}
                        <span className="text-[14px] text-[#5d5d5d] font-light font-sans">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
