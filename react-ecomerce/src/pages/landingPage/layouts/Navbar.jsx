import { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { TbHeart } from "react-icons/tb";
import { Link } from "react-scroll";
import SearchPopUp from "../layouts/fixtures/SearchPopUp";

function Navbar() {
  const [showNav, setShowNav] = useState(true);
  const [showSearch, setShowsearch] = useState(false);
  const lastScrollY = useRef(0);

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

  // memunculkan dan menyembunyikan search bar saat icon search di klik
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest("#search-popup") && !e.target.closest("#search")) {
        setShowSearch(false);
      }
    };
    if (showSearch) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSearch]);

  return (
    <>
      <header
        className={`p-4 w-screen fixed left-0 z-40 transition-all duration-500 ease-in-out bg-white ${showNav ? "translate-y-0 border-b border-gray-300" : "-translate-y-full"} ${showSearch ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="flex justify-between items-center px-14 py-1 bg-transparent">
          {/* product method */}
          <div className="flex gap-4 text-sm tracking-wider">
            <div className="flex flex-col gap-8 items-center">
              <div className="flex gap-4 text-[13px] tracking-[0.1em]">
                <Link
                  to="Hero"
                  smooth={true}
                  duration={500}
                  className="relative cursor-pointer flex flex-col overflow-hidden group"
                >
                  <span className="text-hoverBefore">PRIA</span>
                  <span className="text-hoverAfter">PRIA</span>
                </Link>
                <Link
                  to="About"
                  smooth={true}
                  duration={500}
                  className="relative cursor-pointer flex flex-col overflow-hidden group"
                >
                  <span className="text-hoverBefore">WANITA</span>
                  <span className="text-hoverAfter">WANITA</span>
                </Link>
                <Link
                  to="Service"
                  smooth={true}
                  duration={500}
                  className="relative cursor-pointer flex flex-col overflow-hidden group"
                >
                  <span className="text-hoverBefore">ANAK</span>
                  <span className="text-hoverAfter">ANAK</span>
                </Link>
                <Link
                  to="Portfolio"
                  smooth={true}
                  duration={500}
                  className="relative cursor-pointer flex flex-col overflow-hidden group"
                >
                  <span className="text-hoverBefore">LUXURY</span>
                  <span className="text-hoverAfter">LUXURY</span>
                </Link>
                <Link
                  to="Contact"
                  smooth={true}
                  duration={500}
                  className="relative cursor-pointer flex flex-col overflow-hidden group"
                >
                  <span className="text-hoverBefore">PROMO</span>
                  <span className="text-hoverAfter">PROMO</span>
                </Link>
              </div>
              <h1 className="absolute font-bold text-lg tracking-[0.2em] top-15 flex flex-col overflow-hidden">
              </h1>
            </div>
          </div>

          {/* logo */}
          <h1 className="font-semibold text-xl tracking-[0.2em] overflow-hidden">
            <span>
              OHMAYLOGOO
            </span>
          </h1>
          
          {/* search cart method */}
          <div className={`flex flex-col gap-8 items-center`}>
            <div className="flex items-center gap-4 text-xl cursor-pointer">
              <span className="relative">
                <input 
                id="search" 
                type="text"
                placeholder="Cari"
                className="w-60 px-4 py-1.5 ring-0 bg-gray-100 active:ring-0 focus:ring-0 focus:outline-none text-sm placeholder:font-thin placeholder:text-gray-600"
                onClick={()=> setShowsearch(true)}
                onFocus={()=> setShowsearch(true)}
                />
                {showSearch ? (
                  <button
                    type="button"
                    className="absolute right-[4px] top-[8px] text-gray-600"
                    onClick={() => setShowsearch(false)}
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
              <span>
                <TbHeart />
              </span>
              <span>
                <LiaShoppingBagSolid />
              </span>
            </div>
          </div>
        </div>
      </header>
      <SearchPopUp show={showSearch} onClose={() => setShowsearch(false)}/>
    </>
  );
}

export default Navbar;
