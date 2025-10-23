import { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { TbHeart } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import SearchPopUp from "../layouts/fixtures/SearchPopUp";
import logo from "../../../assets/img/logo.jpg"

const STORAGE_KEY = "ohmay_favorites";

const readFavorites = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeFavorites = (arr) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    window.dispatchEvent(new CustomEvent("favorites-updated", { detail: arr }));
  } catch {}
};

function Navbar() {
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(true);
  const [showSearch, setShowsearch] = useState(false);
  const [query, setQuery] = useState("");
  const [showFavPopup, setShowFavPopup] = useState(false);
  const lastScrollY = useRef(0);
  const [favorites, setFavorites] = useState([]);

  // read favorites on mount
  useEffect(() => {
    setFavorites(readFavorites());
  }, []);

  // listen to favorites-updated events (optional other components can dispatch)
  useEffect(() => {
    const handler = (e) => {
      setFavorites(Array.isArray(e.detail) ? e.detail : readFavorites());
    };
    window.addEventListener("favorites-updated", handler);
    return () => window.removeEventListener("favorites-updated", handler);
  }, []);

  // popup favorite handlers
  const toggleFavPopup = () => setShowFavPopup((s) => !s);
  const closeFavPopup = () => setShowFavPopup(false);

  const onRemoveFavorite = (id) => {
    const next = favorites.filter((f) => (f.id ?? f._id) !== id);
    writeFavorites(next);
    setFavorites(next);
  };

  const onOpenFavoriteItem = (item) => {
    const id = item?.id ?? item?._id;
    if (!id) return;
    closeFavPopup();
    navigate(`/product/${id}`, { state: item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // memunculkan dan menyembunyikan navbar saat scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // close search when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest("#search-popup") && !e.target.closest("#search")) {
        setShowSearch(false);
      }
    };
    if (showSearch) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSearch]);

  const goToCategory = (slug) => {
    navigate(`/category/${slug}`, { state: { fromNav: true } });
  };

  return (
    <main className="container">
      <header
        className={`p-4 w-screen fixed left-0 z-50 transition-all duration-500 ease-in-out bg-white ${showNav ? "translate-y-0 border-b border-gray-300" : "-translate-y-full"} ${showSearch ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="flex justify-between items-center px-14 py-1 bg-transparent">
          {/* product method */}
          <div className="flex gap-4 text-sm tracking-wider">
            <div className="flex flex-col gap-8 items-center">
              <div className="flex gap-4 text-[13px] tracking-[0.1em]">
                <button
                  type="button"
                  onClick={() => goToCategory("pria")}
                  className="relative cursor-pointer flex flex-col overflow-hidden group bg-transparent border-0 p-0"
                >
                  <span className="text-hoverBefore">PRIA</span>
                  <span className="text-hoverAfter">PRIA</span>
                </button>

                <button
                  type="button"
                  onClick={() => goToCategory("wanita")}
                  className="relative cursor-pointer flex flex-col overflow-hidden group bg-transparent border-0 p-0"
                >
                  <span className="text-hoverBefore">WANITA</span>
                  <span className="text-hoverAfter">WANITA</span>
                </button>

                <button
                  type="button"
                  onClick={() => goToCategory("anak")}
                  className="relative cursor-pointer flex flex-col overflow-hidden group bg-transparent border-0 p-0"
                >
                  <span className="text-hoverBefore">ANAK</span>
                  <span className="text-hoverAfter">ANAK</span>
                </button>

                <button
                  type="button"
                  onClick={() => goToCategory("luxury")}
                  className="relative cursor-pointer flex flex-col overflow-hidden group bg-transparent border-0 p-0"
                >
                  <span className="text-hoverBefore">LUXURY</span>
                  <span className="text-hoverAfter">LUXURY</span>
                </button>

                <button
                  type="button"
                  onClick={() => goToCategory("promo")}
                  className="relative cursor-pointer flex flex-col overflow-hidden group bg-transparent border-0 p-0"
                >
                  <span className="text-hoverBefore">PROMO</span>
                  <span className="text-hoverAfter">PROMO</span>
                </button>
              </div>
              <h1 className="absolute font-bold text-lg tracking-[0.2em] top-15 flex flex-col overflow-hidden" />
            </div>
          </div>

          {/* logo */}
          <a href="/" className="overflow-hidden max-h-8 flex items-center">
            <img src={logo} alt="FSDR" className="block max-h-20 md:hidden" />
            <span className="font-bold text-xl tracking-wider hidden md:block">FSDR</span>
          </a>

          {/* search cart method */}
          <div className={`flex flex-col gap-8 items-center`}>
            <div className="flex items-center gap-4 text-xl cursor-pointer">
              <span className="relative">
                <input
                  id="search"
                  type="text"
                  placeholder="Cari"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-60 px-4 py-1.5 ring-0 bg-gray-100 active:ring-0 focus:ring-0 focus:outline-none text-sm placeholder:font-thin placeholder:text-gray-600"
                  onClick={() => setShowsearch(true)}
                  onFocus={() => setShowsearch(true)}
                />
                {showSearch ? (
                  <button
                    type="button"
                    className="absolute right-[4px] top-[8px] text-gray-600"
                    onClick={() => {
                      setShowsearch(false);
                    }}
                  >
                    <IoMdClose size={20} />
                  </button>
                ) : (
                  <label
                    htmlFor="search"
                    className="absolute right-[4px] top-[8px]"
                    onClick={() => setShowsearch(true)}
                  >
                    <FiSearch size={18} />
                  </label>
                )}
              </span>

              {/* Heart with badge */}
              <span className="relative">
                <button
                  type="button"
                  onClick={toggleFavPopup}
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
              </span>

              <span>
                <LiaShoppingBagSolid />
              </span>

              <span className="text-sm">
                <a href="">login</a>
              </span>
            </div>
          </div>
        </div>
      </header>

      <SearchPopUp show={showSearch} onClose={() => setShowsearch(false)} query={query} setQuery={setQuery} />

      {/* favorites popup - left under navbar */}
      <div
        className={`fixed right-2 top-20 z-50 w-80 transition-transform duration-200 ${showFavPopup ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}
        aria-hidden={!showFavPopup}
      >
        <div className={`cursor-pointer bg-white border border-l-8 border-l-gray-600 rounded-l shadow-lg overflow-hidden duration-300 ${showNav ? "translate-x-0" : "translate-x-full"}`}>
          <div className="px-4 py-2 flex items-center justify-between border-b">
            <h3 className="text-sm font-medium">Favorit</h3>
            <button
              className="text-xs text-gray-500"
              onClick={() => {
                writeFavorites([]);
                setFavorites([]);
              }}
            >
              Hapus semua
            </button>
          </div>

          <div className="max-h-64 overflow-auto">
            {favorites.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">Belum ada favorit.</div>
            ) : (
              <ul>
                {favorites.map((f) => (
                  <li key={f.id ?? f._id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50">
                    <div
                      onClick={() => onOpenFavoriteItem(f)}
                      className="flex items-center gap-3 text-left w-full overflow-hidden"
                    >
                      <div className="min-w-1/5 h-12 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                        {f.Image ? (
                          <img src={f.Image} alt={f.name} className="object-contain w-full h-full" />
                        ) : (
                          <div className="text-xs text-gray-400">No image</div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="text-sm font-medium truncate">{f.name}</div>
                        {f.price != null && 
                        <div className="text-xs text-gray-500">Rp {Number(f.price).toLocaleString("id-ID")}
                        </div>}
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveFavorite(f.id ?? f._id)}
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
    </main>
  );
}

export default Navbar;