import { use } from "react";
import { useEffect, useState } from "react";
import { FaOpencart } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

function Navbar() {
  const [isActive, setIsActive] = useState(false);
  const [showNav, setShowNav] = useState(true)
  const [lastScroll, setLastScroll] = useState(0)

  useEffect(() => {
    const handleScroll = () => {

      const current = window.scrollY
      setIsActive(current > 30)
      if(current > lastScroll && current > 50) {
        setShowNav(false)
      } else if ( current < lastScroll) {
        setShowNav(true)
      }
      setLastScroll(current)
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScroll]);

  return (
    <>
      <div
        className={`w-screen fixed left-0 duration-500 
          ${isActive ? "translate-y-0" : "-translate-y-full" }
        ${showNav ? "bg-gray-100 shadow" : "bg-transparent"}`}
      >
        <div className="flex justify-between items-center px-14 z-auto  py-1 bg-white">
          <h1 className="font-semibold text-sm tracking-[0.2em] overflow-hidden">
            <span
              className={`block duration-1000 ${
                isActive ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              OHMAYLOGOO
            </span>
          </h1>

          <div className="flex flex-col gap-8 items-center ">
            <div className="flex gap-4 text-md">
              <a
                href=""
                className="relative flex flex-col overflow-hidden group"
              >
                <span className="text-hoverBefore">Home</span>
                <span className="text-hoverAfter">Home</span>
              </a>
              <a
                href=""
                className="relative flex flex-col overflow-hidden group"
              >
                <span className="text-hoverBefore">About</span>
                <span className="text-hoverAfter">About</span>
              </a>
              <a
                href=""
                className="relative flex flex-col overflow-hidden group"
              >
                <span className="text-hoverBefore">Services</span>
                <span className="text-hoverAfter">Services</span>
              </a>
              <a
                href=""
                className="relative flex flex-col overflow-hidden group"
              >
                <span className="text-hoverBefore">Portfolio</span>
                <span className="text-hoverAfter">Portfolio</span>
              </a>
              <a
                href=""
                className="relative flex flex-col overflow-hidden group"
              >
                <span className="text-hoverBefore">Contact</span>
                <span className="text-hoverAfter">Contact</span>
              </a>
            </div>
            <h1 className="absolute font-bold text-2xl tracking-widest top-20 flex flex-col overflow-hidden">
              <span
                className={`block duration-200 ${
                  isActive ? "-translate-y-full" : "translate-y-0"
                }`}
              >
                OHMAYLOGOO
              </span>
            </h1>
          </div>

          <div className={`flex gap-8 items-center`}>
            <div className="flex items-center gap-4 text-xl cursor-pointer border">
              <span>
                <FiSearch />
              </span>
              <span>
                <FaOpencart />
              </span>
              <img
                src="../../src/assets/img/user.png"
                alt="user"
                className="size-12"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
