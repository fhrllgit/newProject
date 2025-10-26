import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { CgMenuRightAlt } from "react-icons/cg";
import { LiaHomeSolid } from "react-icons/lia";
import { FiBox } from "react-icons/fi";
import { FiTag } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FiCreditCard } from "react-icons/fi";
import { FiBarChart2 } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import { TbLogout2 } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { BsCart } from "react-icons/bs";
import RightOrder from "./Dashboard/RightAdminOrder";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchItem, setSearchItem] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {user, logout} = useContext(AuthContext)

  const menuItems = [
    { name: "Dashboard", icons: <LiaHomeSolid />, path: "/admin/dashboard" },
    { name: "Produk", icons: <FiBox />, path: "/admin/products" },
    { name: "Order", icons: <BsCart />, path: "/admin/Order" },
    { name: "User", icons: <FiUser />, path: "/admin/user" },
    { name: "Transaksi", icons: <FiCreditCard />, path: "/admin/transaksi" },
    { name: "Laporan", icons: <FiBarChart2 />, path: "/admin/laporan" },
  ];

  const filterDashboard = menuItems.filter((item) => {
    return item.name.toLowerCase().includes(searchItem.toLowerCase());
  });

  const handleLogout = () => {
    logout(),
    navigate("/login")
  }

  const displayMenu = searchItem ? filterDashboard : menuItems;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className="flex w-full min-h-screen bg-gray-100">
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg text-gray-700 hover:bg-gray-100"
        >
          <CgMenuRightAlt className="text-2xl" />
        </button>
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleMobileMenu}
          ></div>
        )}
        <div
          className={`
            ${isSidebarOpen ? "w-60" : "w-20"} 
            bg-white border-r-2 border-r-gray-200 
            fixed top-0 left-0 h-screen 
            flex flex-col justify-between 
            ${isSidebarOpen ? "px-5" : "px-3"} py-6
            transition-all duration-300 ease-in-out
            z-40
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
          `}
        >
          <div className="overflow-y-auto overflow-x-hidden">
            <div className="flex justify-between items-center mb-6">
              {isSidebarOpen ? (
                <>
                  <p className="text-lg tracking-widest font-bold text-black transition-opacity duration-300">
                    FSDR
                  </p>
                  <button
                    onClick={toggleSidebar}
                    className="text-xl cursor-pointer text-gray-700 hover:text-black transition-colors hidden lg:block"
                  >
                    <CgMenuRightAlt />
                  </button>
                  <button
                    onClick={toggleMobileMenu}
                    className="text-2xl cursor-pointer text-gray-700 hover:text-black transition-colors lg:hidden"
                  >
                    <IoClose />
                  </button>
                </>
              ) : (
                <button
                  onClick={toggleSidebar}
                  className="text-xl cursor-pointer text-gray-700 hover:text-black transition-colors mx-auto"
                >
                  <CgMenuRightAlt />
                </button>
              )}
            </div>

            {isSidebarOpen && (
              <div className="flex items-center rounded-sm py-2 border-gray-200 border-2 gap-2 px-2 transition-all duration-300">
                <span className="text-base text-gray-500">
                  <FiSearch />
                </span>
                <input
                  type="text"
                  placeholder="Search..."
                  className="outline-0 ring-0 placeholder:text-gray-500 placeholder:text-sm w-full bg-transparent"
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                />
              </div>
            )}

            <div className="mt-6 space-y-1.5">
              {displayMenu.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    if (window.innerWidth < 1024) {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className={`
                    flex items-center gap-3 
                    ${isSidebarOpen ? "px-3" : "px-0 justify-center"} 
                    py-2.5 rounded-md cursor-pointer 
                    transition-all duration-200
                    ${
                      location.pathname === item.path
                        ? "bg-black text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                    group relative
                  `}
                  title={!isSidebarOpen ? item.name : ""}
                >
                  <span className="text-xl">{item.icons}</span>
                  {isSidebarOpen && (
                    <p className="text-sm font-medium whitespace-nowrap">
                      {item.name}
                    </p>
                  )}

                  {!isSidebarOpen && (
                    <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </div>
              ))}
              {searchItem && displayMenu.length === 0 && isSidebarOpen && (
                <p className="text-gray-400 text-sm text-center mt-4">
                  Tidak ditemukan
                </p>
              )}
            </div>
          </div>

          <div
          onClick={handleLogout}
            className={`
              flex items-center gap-3 
              ${isSidebarOpen ? "px-3" : "px-0 justify-center"} 
              py-2.5 rounded-md cursor-pointer 
              text-gray-600 hover:bg-red-50 hover:text-red-600
              transition-all duration-200
              group relative
            `}
            title={!isSidebarOpen ? "Log out" : ""}
          >
            <span className="text-xl">
              <TbLogout2 />
            </span>
            {isSidebarOpen && <p className="text-sm font-medium">Log out</p>}

            {!isSidebarOpen && (
              <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Log out
              </div>
            )}
          </div>
        </div>

        <div
          className={`
            flex-1 
            ${isSidebarOpen ? "lg:ml-60" : "lg:ml-20"} 
            ml-0
            min-h-screen 
            transition-all duration-300 ease-in-out
            overflow-y-auto
          `}
        >
          <RightOrder />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
