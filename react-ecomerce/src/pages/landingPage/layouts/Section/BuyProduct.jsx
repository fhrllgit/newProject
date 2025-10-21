import { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useFetch } from "../../../../hooks/useFetch";
import logo from "../../../../img/logo.png";
import { HiArrowUturnLeft } from "react-icons/hi2";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CgRuler } from "react-icons/cg";
import Button from "../fixtures/Button";
import { LiaHeart } from "react-icons/lia";
import { TbTruckDelivery } from "react-icons/tb";
import { Element, Link } from "react-scroll";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { TbHeart } from "react-icons/tb";
import ProductSection from "../../../../hooks/useProduct";
import { Menu, X, Search, ShoppingCart, User } from "lucide-react";
import { AiOutlineUser } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { CiLogin } from "react-icons/ci";
import { BsTruck } from "react-icons/bs";
import {
  IoIosArrowRoundBack,
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";
import { BiRuler } from "react-icons/bi";
import { FaArrowRightLong } from "react-icons/fa6";

export default function BuyProduct() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initial = location.state ?? null;
  const { data, loading, error } = useFetch(
    id ? `/products/product/${id}` : null
  );
  const fetchedProduct = data
    ? Array.isArray(data)
      ? data[0] ?? null
      : data
    : null;
  const product = fetchedProduct
  ? { ...initial, ...fetchedProduct } // fetchedProduct akan menimpa field kosong
  : initial;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef(null);
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState([]);
  const [selectedType, setSelectedType] = useState(size[0]?.type);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    setSelectedIndex(0);
  }, [product?.Image, product?.detail_images]);

  useEffect(() => {
    setSize(Array.isArray(product?.size) ? product.size : []);
    setSelected("");
  }, [product]);

  useEffect(() => {
    if (size.length > 0) {
      setSelectedType(size[0].type);
    }
  }, [size]);

  // early returns tetap boleh di sini karena semua Hooks sudah dideklarasikan di atas
  if (loading && !product) return <div className="p-6">Loading...</div>;
  if (error && !product)
    return <div className="p-6 text-red-600">Error: {String(error)}</div>;
  if (!product) return <div className="p-6">Product not found</div>;

  const images = Array.isArray(product.detail_images)
    ? product.detail_images.filter(img => img && img !== product.Image)
    : product.Image
    ? [product.Image]
    : [];

  const formatToIDR = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

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

  // thumbnail
  const handleThumbnailClick = (index) => {
    setSelectedIndex(index);
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const imageWidth = scrollContainer.offsetWidth;
      scrollContainer.scrollTo({
        left: imageWidth * index,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const index = Math.round(
        scrollContainer.scrollLeft / scrollContainer.offsetWidth
      );
      setSelectedIndex(index);
    }
  };

  const handleNext = () => {
    if (selectedIndex < images.length - 1) {
      handleThumbnailClick(selectedIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      handleThumbnailClick(selectedIndex - 1);
    }
  };

  return (
    <div>
      {/* Navbar detail */}
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
                    <HiOutlineShoppingBag
                      size={23}
                      strokeWidth={1.5}
                      className="cursor-pointer hover:text-blue-600 transition-colors"
                    />
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
            {product.name}
          </h2>
          <CiHeart
            size={23}
            strokeWidth={0.5}
            className="text-gray-700 cursor-pointer hover:text-red-500 transition-colors flex-shrink-0"
          />
        </div>
      </div>

      {/* content */}
      {/* <main className="flex">
        <section
          className={`pt-96 relative flex-2/3 border h-full min-h-screen flex flex-col justify-center items-center bg-[${product.warna}]`}
        >
          <div className="border">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-4 top-2 z-20 flex items-center gap-2 px-2 py-1 border rounded"
            >
              <HiArrowUturnLeft className="w-5 h-5" />
              Kembali
            </button>

            <div className="relative w-[400px] min-h-[450px] border overflow-hidden group">
              <img
                src={images[selectedIndex] ?? ""}
                alt={product?.name ?? "product"}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />

              <section className="absolute z-10 bottom-0 left-1/2 -translate-x-1/2 flex gap-4 overflow-hidden group">
                {images.map((imgSrc, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseOver={() => setCardDisplay(false)}
                    onClick={() => setSelectedIndex(i)}
                    className={`w-8 overflow-hidden border h-[1px] group-hover:h-8 duration-300
                ${
                  i === selectedIndex
                    ? "border-b-4"
                    : "opacity-80 hover:opacity-100"
                }
                `}
                  >
                    <img
                      src={imgSrc}
                      alt={`thumb-${i}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </section>
            </div>
          </div>

          <div className="mt-8">
            <div className="sticky z-10 top-10 flex gap-4 text-sm cursor-pointer">
              <Link to="galeri" className="hover:underline">
                GALERI
              </Link>
              <Link to="deskripsi" className="hover:underline">
                DESKRIPSI
              </Link>
              <Link to="detail" className="hover:underline">
                DETAIL
              </Link>
            </div>
          </div>
          <Element name="galeri" className="relative w-full px-8 mt-8">
            <section className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <h2 className="text-sm italic">{product.point}</h2>
              <p className="text-sm">{product.description}</p>
            </section>
          </Element>
          <Element name="deksripsi" className="relative w-full px-8 mt-8">
            <section className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">SPESIFIKASI</h1>
              {Array.isArray(product.specifications) &&
                product.specifications.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-sm flex flex-col flex-3 gap-4">
                    {product.specifications.map((sp, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        {sp}
                      </li>
                    ))}
                  </ul>
                )}
            </section>
          </Element>
        </section>

        <section className="border h-screen border-gray-300 flex flex-col w-md px-4 py-6 gap-4">
          <h2 className="mb-2 text-sm text-gray-600">{product.tipe}</h2>
          <h1 className="text-4xl">{product.name}</h1>
          <div className="flex flex-col gap-4">
            <h2 className="text-gray-600">{product.variasi}</h2>
            <h1>
              {formatToIDR(product.price)}
              {product.discount ? (
                <span className="ml-3 text-sm text-red-500">
                  - Rp {product.discount}
                </span>
              ) : null}
            </h1>
          </div>

          <div>
            <p className="text-sm text-gray-800 tracking-wider font-bold mb-4">
              pilih size
            </p>
            <button
              onClick={() => setOpen(!open)}
              className="w-[120px] border px-3 py-2 flex justify-between items-center text-sm font-medium"
            >
              {selected}
              {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {open && (
              <div className="w-[120px] absolute mt-1 border bg-white shadow max-h-40 overflow-y-auto z-10">
                {size.map((item, i) => (
                  <div
                    key={item.value ?? i}
                    onClick={() => {
                      setSelected(String(item.value));
                      setOpen(false);
                    }}
                    className="px-3 py-2 border-b border-gray-300 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {item.value}{" "}
                    {item.stock !== undefined ? `(${item.stock})` : null}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 group">
              <button className="flex items-center gap-2 group-hover:text-white group-hover:bg-black px-2">
                <CgRuler />
                <span className="text-xs underline font-bold">
                  PANDUAN UKURAN
                </span>
              </button>
            </div>
            <div className="mt-4 flex w-full h-12 gap-4">
              <span className="w-[80%] text-md tracking-wider text-nowrap bg-black group">
                <Button title={"Tambahkan ke keranjang"} />
              </span>
              <button className="p-4 flex justify-center items-center border ">
                <LiaHeart size={22} />
              </button>
            </div>
            <div className="text-gray-700">
              <div className="mt-4 text-xs flex items-center gap-2">
                <TbTruckDelivery size={20} />
                <span>
                  <button className="underline cursor-pointer hover:text-black">
                    Learn More
                  </button>
                  <p>Gratis Ongkir</p>
                </span>
              </div>
              <div className="mt-4 text-xs flex items-center gap-2">
                <TbTruckDelivery size={20} />
                <span>
                  <button className="underline cursor-pointer hover:text-black">
                    Learn More
                  </button>
                  <p>refund dengan mudah</p>
                </span>
              </div>
            </div>
          </div>
        </section>
      </main> */}

      <main className="flex  xl:mt-0 mt-12">
        {/* kanan */}
        <section className="scrollbar-hide overflow-x-auto max-h-screen flex-1/2">
          <div
            className={`w-full cursor-pointer overflow-x-auto flex  justify-center items-end relative max-h-150 min-h-150 group bg-[${product.warna}]`}
          >
            <div
              onClick={handleNext}
              className="p-2 left-0 top-1/2 hover:bg-black hover:text-white bg-white flex items-center border justify-center cursor-pointer absolute z-10 ml-8"
            >
              <IoIosArrowBack size={20} />
            </div>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex scrollbar-hide hide-scroll items-center overflow-x-auto w-full relative min-h-150 snap-x snap-mandatory scroll-smooth"
            >
              {images.map((img, index) => (
                <div
                  key={index}
                  className="flex justify-center items-center snap-center flex-shrink-0 w-full"
                >
                  <img
                    src={img}
                    alt={`${product?.name ?? "product"} ${index + 1}`}
                    className="w-full max-w-xs sm:max-w-sm md:max-w-sm lg:max-w-md xl:max-w-md min-h-110 object-cover rounded transition-all duration-300"
                  />
                </div>
              ))}
            </div>
            <div className="absolute z-20 top-0 w-full px-8">
              <div className="flex items-center justify-between mt-5 lg:mt-8">
                <div className="flex gap-4 items-center">
                  <div
                    onClick={() => navigate(-1)}
                    className="lg:flex items-center hidden  gap-1.5 hover:bg-black hover:text-white h-5"
                  >
                    <IoIosArrowRoundBack size={30} strokeWidth={2} />
                    <h1 className="text-[12px] tracking-widest underline cursor-pointer font-semibold">
                      KEMBALI
                    </h1>
                  </div>
                  <p className="text-[13px] font-light underline cursor-pointer">
                    {product.tipe}
                  </p>
                </div>
                <div className="flex lg:hidden">
                  <p className="text-[13px] underline hover:bg-black cursor-pointer hover:text-white w-max font-extralight">
                    Tulis Ulasan
                  </p>
                </div>
              </div>
              <div className="flex lg:hidden flex-col mt-6 space-y-3">
                <h1 className="italic font-light -tracking-[0.04em] text-2xl sm:text-3xl">
                  {product.name}
                </h1>
                <div className="sm:flex sm:space-y-0 lg:hidden justify-between items-center">
                  <p className="text-xs font-light tracking-widest">
                    <span className="text-xs font-bold"></span>
                    {product.variasi}
                  </p>
                  <span className="font-semibold text-sm">
                    {" "}
                    Rp. {formatToIDR(product.price)}
                  </span>
                </div>
              </div>
            </div>
            <div
              onClick={handlePrev}
              className="p-3 right-0 mr-8 z-10 absolute flex items-center justify-center top-1/2 cursor-pointer border hover:bg-black hover:text-white bg-white"
            >
              <IoIosArrowForward size={20} />
            </div>
            {/* thubmnail kecil */}
            <div className="absolute w-full flex gap-2 items-end justify-center h-full pointer-events-none">
              <div
                className={`flex gap-2 items-center cursor-pointer mb-10 overflow-hidden transition-all duration-300 pointer-events-auto bg-[${product.warna}]`}
              >
                {images.map((imgSrc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleThumbnailClick(i)}
                    className={`w-8 overflow-hidden border h-[1px] group-hover:h-8 duration-300 
                ${
                  i === selectedIndex
                    ? "bg-black border-b-4 border-b-black"
                    : "opacity-80 hover:opacity-100"
                }
              `}
                  >
                    <img
                      src={imgSrc}
                      alt={`thumb-${i}`}
                      className="w-8 h-8 cursor-pointer object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center py1.2 gap-8 border border-[#e1e1e1a5]">
            <Link
              to="galeri"
              className="text-xs tracking-widest font-light cursor-pointer hover:border-b-2 hover:border-b-black py-4.5"
            >
              GALERI
            </Link>
            <Link
              to="deskripsi"
              className="text-xs tracking-widest font-light cursor-pointer hover:border-b-2 hover:border-b-black py-4.5"
            >
              DESKRIPSI
            </Link>
            <Link
              to="detail"
              className="text-xs tracking-widest font-light cursor-pointer hover:border-b-2 hover:border-b-black py-4.5"
            >
              DETAIL
            </Link>
          </div>

            <div className="mt-5 px-8 flex flex-col lg:hidden">
            <p className="text-[11px] font-semibold tracking-widest">
              PILIH SIZE
            </p>
            <div>
              <div className="flex items-center gap-2">
                <button className="font-semibold text-md">
                  Ukuran{" "}
                  <span className="text-sm text-[#595959] font-medium">
                    {selectedType}: {selected}
                  </span>
                </button>
                <div
                  onClick={() => setShowSizeGuide(true)}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <BiRuler size={20} strokeWidth={0.5} />
                  <span className="text-xs underline font-light text-[#595959]">
                    Panduan Ukuran
                  </span>
                </div>

                {/* opup guide */}
                {showSizeGuide && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl w-[90%] max-w-xl shadow-lg relative flex flex-col">
                      <div className="flex justify-between items-center border-b-[#bfbfbf] border-b p-4">
                        <h2 className="text-lg font-semibold">
                          Panduan Ukuran
                        </h2>
                        <button
                          onClick={() => setShowSizeGuide(false)}
                          className="text-gray-600 hover:text-black cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="overflow-y-auto max-h-70 p-4">
                        {product?.size_guide ? (
                          <>
                            <div className="flex flex-col space-y-1 border-b border-b-[#bfbfbf] mb-5">
                              <p className="text-md font-semibold">
                                Dapatkan ukuran yang paling pas buat Anda
                              </p>
                              <p className="text-xs font-light text-[#727070] mb-2">
                                Semua nilai konversi adalah perkiraan. Ukuran
                                bisa bervariasi mengikuti pabrik
                              </p>
                            </div>
                            <h1 className="text-md font-semibold">
                              Panduan ukuran dari :{" "}
                              <span className="text-sm">{product.name}</span>
                            </h1>
                            <table className="w-full border-collapse border text-sm">
                              <thead>
                                <tr>
                                  {product.size_guide.thead.map((head, i) => (
                                    <th
                                      key={i}
                                      className="border p-2 bg-gray-100 text-left top-0"
                                    >
                                      {head}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {product.size_guide.tbody.map((row, i) => (
                                  <tr key={i}>
                                    {row.map((cell, j) => (
                                      <td
                                        key={j}
                                        className="border p-2 text-center"
                                      >
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </>
                        ) : (
                          <p className="text-center text-gray-500 font-light">
                            Ukuran belum tersedia
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {/* opup guide end */}
              </div>
              <div className="flex gap-3 text-sm mt-4 max-w-md flex-wrap">
                {size.map((item, i) => (
                  <div
                    key={`${item.value}-${i}`}
                    onClick={() => {
                      setSelected(String(item.value));
                      setOpen(false);
                    }}
                    className={`px-5 py-1 border rounded-lg cursor-pointer transition-all duration-200
                    ${
                      selected === String(item.value)
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-black hover:bg-[#f1f0f064]"
                    }`}
                  >
                    {item.value}
                  </div>
                ))}
              </div>

                <div className="flex items-center gap-3 mt-5">
                <div className="border flex-1 pb-0.5 ">
                  <div
                    className="bg-black w-full flex gap-3 items-center cursor-pointer justify-center hover:text-gray-400 -mt-0.5 h-12 -ml-0.5">
                    <p className="text-xs font-bold text-white tracking-[0.2em]">TAMBAH KE KERANJANG</p>
                    <FaArrowRightLong className="text-white" size={20}/>
                  </div>
                </div>
                <div className="p-2 border cursor-pointer items-center w-12 h-12 justify-center flex">
                  <CiHeart size={30}/>
                </div>
              </div>

                  <div className="text-gray-700">
              <div className="mt-4 text-xs flex items-center gap-2">
                <TbTruckDelivery size={20} />
                <span>
                  <button className="underline cursor-pointer hover:text-black">
                    Learn More
                  </button>
                  <p>Gratis Ongkir</p>
                </span>
              </div>
              <div className="mt-4 text-xs flex items-center gap-2">
                <TbTruckDelivery size={20} />
                <span>
                  <button className="underline cursor-pointer hover:text-black">
                    Learn More
                  </button>
                  <p>refund dengan mudah</p>
                </span>
              </div>
            </div>
            </div>
          </div>


          <Element name="deskripsi" className="px-8 mt-8 relative">
            <div className="flex flex-col space-y-2">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <h2 className="text-lg italic">{product.point}</h2>
              <p className="text-[15px] text-black font-extralight">
                {product.description}
              </p>
            </div>
          </Element>
          <Element name="detail" className="relative w-full px-8 mt-8">
            <section className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">SPESIFIKASI</h1>
              {Array.isArray(product.specifications) &&
                product.specifications.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-sm grid grid-cols-2 flex-col flex-3 gap-2">
                    {product.specifications.map((sp, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        {sp}
                      </li>
                    ))}
                  </ul>
                )}
            </section>
          </Element>
        </section>

        {/* kiri */}
        <section className="hidden lg:flex lg:flex-col border-l border-l-[#dcdcdc] h-screen px-5 py-5 flex-1/8">
          <div className="flex justify-between items-center">
            <h1 className="text-[13px] font-extralight">{product.tipe}</h1>
            <p className="text-[13px] underline hover:bg-black cursor-pointer hover:text-white w-max font-extralight">
              Tulis Ulasan
            </p>
          </div>
          <h1 className="text-5xl mt-8 tracking-wide">{product.name}</h1>
          <p className="text-xs mt-6 mb-7 font-light tracking-widest">
            <span className="text-xs font-bold">Variasi: </span>
            {product.variasi}
          </p>
          <span className="font-semibold text-md">
            {" "}
            Rp.
            {formatToIDR(product.price)}
            {product.discount ? (
              <span className="ml-3 text-sm text-red-500">
                - Rp {product.discount}
              </span>
            ) : null}
          </span>
          <div className="mt-5">
            <p className="text-[11px] font-semibold tracking-widest">
              PILIH SIZE
            </p>
            <div>
              <div className="flex items-center gap-2">
                <button className="font-semibold text-md">
                  Ukuran{" "}
                  <span className="text-sm text-[#595959] font-medium">
                    {selectedType}: {selected}
                  </span>
                </button>
                <div
                  onClick={() => setShowSizeGuide(true)}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <BiRuler size={20} strokeWidth={0.5} />
                  <span className="text-xs underline font-light text-[#595959]">
                    Panduan Ukuran
                  </span>
                </div>

                {/* opup guide */}
                {showSizeGuide && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl w-[90%] max-w-xl shadow-lg relative flex flex-col">
                      <div className="flex justify-between items-center border-b-[#bfbfbf] border-b p-4">
                        <h2 className="text-lg font-semibold">
                          Panduan Ukuran
                        </h2>
                        <button
                          onClick={() => setShowSizeGuide(false)}
                          className="text-gray-600 hover:text-black cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="overflow-y-auto max-h-70 p-4">
                        {product?.size_guide ? (
                          <>
                            <div className="flex flex-col space-y-1 border-b border-b-[#bfbfbf] mb-5">
                              <p className="text-md font-semibold">
                                Dapatkan ukuran yang paling pas buat Anda
                              </p>
                              <p className="text-xs font-light text-[#727070] mb-2">
                                Semua nilai konversi adalah perkiraan. Ukuran
                                bisa bervariasi mengikuti pabrik
                              </p>
                            </div>
                            <h1 className="text-md font-semibold">
                              Panduan ukuran dari :{" "}
                              <span className="text-sm">{product.name}</span>
                            </h1>
                            <table className="w-full border-collapse border text-sm">
                              <thead>
                                <tr>
                                  {product.size_guide.thead.map((head, i) => (
                                    <th
                                      key={i}
                                      className="border p-2 bg-gray-100 text-left top-0"
                                    >
                                      {head}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {product.size_guide.tbody.map((row, i) => (
                                  <tr key={i}>
                                    {row.map((cell, j) => (
                                      <td
                                        key={j}
                                        className="border p-2 text-center"
                                      >
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </>
                        ) : (
                          <p className="text-center text-gray-500 font-light">
                            Ukuran belum tersedia
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {/* opup guide end */}
              </div>
              <div className="flex gap-3 text-sm mt-4 flex-wrap">
                {size.map((item, i) => (
                  <div
                    key={`${item.value}-${i}`}
                    onClick={() => {
                      setSelected(String(item.value));
                      setOpen(false);
                    }}
                    className={`px-5 py-1 border rounded-lg cursor-pointer transition-all duration-200
                    ${
                      selected === String(item.value)
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-black hover:bg-[#f1f0f064]"
                    }`}
                  >
                    {item.value}
                    {""}
                  </div>
                ))}
              </div>

                <div className="flex items-center gap-3 mt-5">
                <div className="border flex-1 pb-0.5 ">
                  <div
                    className="bg-black w-full flex gap-3 items-center cursor-pointer justify-center hover:text-gray-400 -mt-0.5 h-12 -ml-0.5">
                    <p className="text-xs font-bold text-white tracking-[0.2em]">TAMBAH KE KERANJANG</p>
                    <FaArrowRightLong className="text-white" size={20}/>
                  </div>
                </div>
                <div className="p-2 border cursor-pointer items-center w-12 h-12 justify-center flex">
                  <CiHeart size={30}/>
                </div>
              </div>

                  <div className="text-gray-700">
              <div className="mt-4 text-xs flex items-center gap-2">
                <TbTruckDelivery size={20} />
                <span>
                  <button className="underline cursor-pointer hover:text-black">
                    Learn More
                  </button>
                  <p>Gratis Ongkir</p>
                </span>
              </div>
              <div className="mt-4 text-xs flex items-center gap-2">
                <TbTruckDelivery size={20} />
                <span>
                  <button className="underline cursor-pointer hover:text-black">
                    Learn More
                  </button>
                  <p>refund dengan mudah</p>
                </span>
              </div>
            </div>
            </div>
          </div>
        </section>
      </main>

      {/* <div className="relative mt-96 pt-8">
        <ProductSection
          endpoint="/products/product"
          filterFn={(item) => String(item.category).toLowerCase() === "pria"}
          onItemClick={(item) =>
            navigate(`/product/${item.id}`, { state: item })
          }
        />
        <Footer />
      </div> */}
    </div>
  );
}
