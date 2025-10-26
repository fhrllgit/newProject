import { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { TbHeart } from "react-icons/tb";
import { AiOutlineUser } from "react-icons/ai";
import { CiLogin } from "react-icons/ci";
import {
  HiOutlineShoppingBag,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineUserCircle,
} from "react-icons/hi";
import { BsTruck } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import SearchPopUp from "../layouts/fixtures/SearchPopUp";
import { useFavorites } from "../../../hooks/useFavorites";
import { useCart } from "../../../context/cartContext";
import logo from "../../../img/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [showSearch, setShowsearch] = useState(false);
  const [query, setQuery] = useState("");
  const [showNav, setShowNav] = useState(true);
  const [showFavPopup, setShowFavPopup] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const { totalItems } = useCart();

  const toggleFavPopup = () => setShowFavPopup((s) => !s);
  const closeFavPopup = () => setShowFavPopup(false);

  const onOpenFavoriteItem = (item) => {
    const id = item?.id ?? item?._id;
    if (!id) return;
    closeFavPopup();
    navigate(`/product/${id}`, { state: item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setShowNav(current < lastScrollY.current);
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest("#search-popup") && !e.target.closest("#search")) {
        setShowsearch(false);
      }
    };
    if (showSearch) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSearch]);

  const goToCategory = (slug) =>
    navigate(`/category/${slug}`, { state: { fromNav: true } });

  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 45);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="w-full">
        {/* navbar desktop */}
        <div className="block w-full">
          {/* cta hanya tampil di desktop */}
          <div className="hidden lg:flex justify-center items-center gap-10 py-2.5 bg-[#d1d1d155] w-full overflow-hidden">
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
            {/* desktop */}
            <div className="hidden lg:block w-full px-8 lg:px-16 xl:px-24 py-2">
              <div className="flex items-center justify-between w-full">
                <div 
                className="flex-shrink-0">
                  <img
                    className="h-10 w-auto object-contain"
                    src={logo}
                    alt="Logo"
                  />
                </div>

                <div className="flex items-center gap-6">
                  {/* search */}
                  <div
                    id="search"
                    className="border-b w-50 border-[#c3c3c3] cursor-pointer pb-1"
                  >
                    <div className="flex items-center gap-2">
                      {showSearch || query ? (
                        <IoMdClose
                          size={18}
                          className="text-gray-500 cursor-pointer hover:text-red-500 transition-colors"
                          onClick={() => {
                            setQuery("");
                            setShowsearch(false);
                          }}
                        />
                      ) : (
                        <FiSearch
                          size={16}
                          className="text-gray-500 cursor-pointer"
                          onClick={() => setShowsearch(true)}
                        />
                      )}

                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Cari produk..."
                        className="text-xs font-light text-[#939393] focus:outline-none bg-transparent flex-1"
                        onFocus={() => setShowsearch(true)}
                      />
                    </div>
                  </div>

                  {/* login */}
                  <div className="relative group">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <AiOutlineUser size={20} strokeWidth={2} />
                      <span className="text-sm font-extrabold whitespace-nowrap">
                        Masuk / Daftar
                      </span>
                    </div>

                    {/* hover menu */}
                    <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-lg rounded-xl bg-white z-40">
                      <div className="p-3">
                        <div className="flex items-center gap-3">
                          <HiOutlineUserCircle />
                          <button
                            onClick={() => navigate("/user-profile")}
                            className="hover:underline cursor-pointer text-sm"
                            >
                            Profil
                          </button>
                        </div>
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

                  {/* ikon kanan */}
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => toggleFavPopup()}
                      aria-label="Favorit"
                      className="relative p-1"
                    >
                      <TbHeart size={20} />
                      {favorites.length > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                          {favorites.length}
                        </span>
                      )}
                    </button>

                    <div
                      onClick={() => navigate("/keranjang")}
                      className="relative"
                    >
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
              {/* kategori */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex gap-8">
                  <button
                    onClick={() => goToCategory("pria")}
                    className="text-sm cursor-pointer font-extrabold hover:underline transition-all"
                  >
                    PRIA
                  </button>
                  <button
                    onClick={() => goToCategory("wanita")}
                    className="text-sm cursor-pointer font-extrabold hover:underline transition-all"
                  >
                    WANITA
                  </button>
                  <button
                    onClick={() => goToCategory("anak")}
                    className="text-sm cursor-pointer font-extrabold hover:underline transition-all"
                  >
                    ANAK
                  </button>
                  <button
                    onClick={() => goToCategory("luxury")}
                    className="text-sm cursor-pointer font-extrabold hover:underline transition-all"
                  >
                    LUXURY
                  </button>
                </div>
              </div>
            </div>
            {/* tablet & mobile modern bar */}
            <div className="flex lg:hidden items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
              <img
                src={logo}
                alt="Logo"
                className="h-8 w-auto object-contain"
              />
              {/* ikon kanan */}
              <div className="flex items-center gap-4">
                <FiSearch
                  size={22}
                  className="text-gray-700 cursor-pointer hover:text-indigo-600 transition"
                  onClick={() => setShowsearch(true)}
                />
                <button
                  type="button"
                  onClick={() => toggleFavPopup()}
                  className="relative"
                >
                  <TbHeart
                    size={22}
                    className="text-gray-700 hover:text-pink-600 transition"
                  />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] rounded-full px-1 py-[1px]">
                      {favorites.length}
                    </span>
                  )}
                </button>
                <div
                  onClick={() => navigate("/keranjang")}
                  className="relative cursor-pointer"
                >
                  <HiOutlineShoppingBag
                    size={22}
                    className="text-gray-700 hover:text-indigo-600 transition"
                  />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {totalItems}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* spacer */}
          {isSticky && <div className="h-[90px] lg:h-[120px]" />}
        </div>
        
      </div>

      {/* popup favorit */}
      <div
        className={`fixed right-2 top-20 z-50 w-80 transition-transform duration-200 ${
          showFavPopup
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
        aria-hidden={!showFavPopup}
      >
        <div
          className={`cursor-pointer bg-white border border-l-8 border-l-gray-600 rounded-l shadow-lg overflow-hidden duration-300 ${
            showNav ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="px-4 py-2 flex items-center justify-between border-b">
            <h3 className="text-sm font-medium">Favorit</h3>
            <button
              className="text-xs text-gray-500"
              onClick={() => clearFavorites()}
            >
              Hapus semua
            </button>
          </div>

          <div className="max-h-64 overflow-auto">
            {favorites.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">
                Belum ada favorit.
              </div>
            ) : (
              <ul>
                {favorites.map((f) => (
                  <li
                    key={f.id ?? f._id}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50"
                  >
                    <div
                      onClick={() => onOpenFavoriteItem(f)}
                      className="flex items-center gap-3 text-left w-full overflow-hidden"
                    >
                      <div className="min-w-1/5 h-12 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                        {f.Image ? (
                          <img
                            src={f.Image}
                            alt={f.name}
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <div className="text-xs text-gray-400">No image</div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="text-sm font-medium truncate">
                          {f.name}
                        </div>
                        {f.price != null && (
                          <div className="text-xs text-gray-500">
                            Rp {Number(f.price).toLocaleString("id-ID")}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFavorite(f.id ?? f._id)}
                      className="text-xs text-red-500 px-2 py-1 min-w-1/5"
                      aria-label="Hapus favorit"
                    >
                      Hapus
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* popup search */}
      <div>
      <SearchPopUp
        show={showSearch}
        onClose={() => setShowsearch(false)}
        query={query}
        setQuery={setQuery}
      />
      </div>
    </>
  );
}
