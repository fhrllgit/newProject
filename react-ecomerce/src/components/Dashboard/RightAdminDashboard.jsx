import { useState, useEffect, useRef } from "react";
import { FiChevronsLeft, FiBell, FiEdit2, FiTrash2 } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { CiSliderVertical } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { PiSlidersHorizontal } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { BiChevronDown } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { AlertTriangle } from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [minStock, setMinStock] = useState("");
  const [maxStock, setMaxStock] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  const fetchFilteredProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};

      if (search) params.search = search;
      if (minStock) params.minStock = minStock;
      if (maxStock) params.maxStock = maxStock;
      if (category) params.category = category;

      const res = await axios.get("https://backendlombaecomerce-production.up.railway.app/api/products/filter", {
        params,
      });

      setProducts(res.data || []);
    } catch (err) {
      console.error("Error filtering products!", err);
      setError("Gagal memuat produk yang difilter");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedProducts.length === 0) {
      return alert("Pilih produk dulu!");
    }
    setShowDeleteModal(true);
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("https://backendlombaecomerce-production.up.railway.app/api/products/product");
      setProducts(res.data || []);
    } catch (err) {
      console.log("Error fetching products!", err);
      setError("Gagal memuat produk, coba refresh halaman");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  const confirmDelete = async () => {
    try {
      await axios.post("https://backendlombaecomerce-production.up.railway.app/api/products/delete-multiple", {
        ids: selectedProducts,
      });
      fetchProducts();
      setSelectedProducts([]);
      setSelectAll(false);
    } catch (err) {
      console.error("Error deleting products:", err);
      alert("Gagal menghapus produk");
    } finally {
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://backendlombaecomerce-production.up.railway.app/api/category");
        const payload = res.data?.[0]?.payload || [];
        setCategories(payload);
        // console.log("Categories:", categories);
      } catch (err) {
        console.error("Gagal memuat kategori", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    navigate(`/admin/dashboard/edit-product/${product.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading produk...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full bg-white sticky  top-0 z-10 shadow-sm">
        <div className="px-4 sm:px-6 py-3 flex justify-between items-center border-b-2 border-gray-200">
          <button className="text-gray-600 hover:text-gray-900">
            <FiChevronsLeft className="text-xl" />
          </button>
          <div className="flex gap-3 items-center">
            <button className="relative text-gray-600 hover:text-gray-900">
              <FiBell className="text-xl" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <p className="text-sm sm:text-base font-medium text-gray-700">
              Prof admin
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                Produk
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/products/add")}
                className="flex cursor-pointer items-center gap-2 border-black text-white px-4 py-2.5 rounded-lg shadow-lg w-fit"
              >
                <span className="text-xl font-semibold text-black">+</span>
                <span className="font-medium text-black">Add Product</span>
              </button>

              <button
                onClick={handleDeleteSelected}
                className="flex cursor-pointer items-center gap-2 bg-red-800 text-white px-4 py-2.5 rounded-lg shadow-lg w-fit"
              >
                <span>
                  <RiDeleteBinLine />
                </span>
                <span className="font-medium text-white">Delete</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 bg-[#f1f1f1d8] rounded-xl p-2">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="flex items-center p-2 gap-2 bg-white border rounded-xl border-[#dad9d9] flex-1 sm:flex-initial">
              <IoSearchOutline />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchFilteredProducts()}
                className="outline-0 ring-0 placeholder:text-gray-400 placeholder:text-sm flex-1 w-full sm:w-auto"
                placeholder="Search anything..."
              />

              <PiSlidersHorizontal />
            </div>
            <div className="flex items-center gap-2 sm:gap-5 flex-wrap sm:flex-nowrap">
              <div className="flex items-center border border-[#dad9d9] px-2 rounded-lg gap-1 flex-1 sm:flex-initial justify-center py-2 sm:py-0">
                <span className="text-xs font-semibold">Stock range</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value)}
                  className="border rounded px-1 text-xs w-16"
                />
                <span className="text-gray-400 text-xs">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxStock}
                  onChange={(e) => setMaxStock(e.target.value)}
                  className="border rounded px-1 text-xs w-16"
                />
                <button
                  onClick={fetchFilteredProducts}
                  className="ml-2 px-2 py-1 cursor-pointer bg-black text-white text-xs rounded"
                >
                  Apply
                </button>
              </div>

              <div className="flex items-center border border-[#dad9d9] px-2 rounded-lg gap-1 flex-1 sm:flex-initial justify-center py-2 sm:py-0">
                <CiSliderVertical className="text-black" strokeWidth={0.5} />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="text-xs font-semibold bg-transparent outline-none cursor-pointer"
                >
                  <option key="all" value="">
                    All Categories
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={fetchFilteredProducts}
                  className="ml-2 cursor-pointer px-2 py-1 bg-black text-white text-xs rounded"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-black">
                    <th className="px-4 py-3">
                      <input
                        checked={selectAll}
                        onChange={handleSelectAll}
                        type="checkbox"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                      Image
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                      Current Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                      Discount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                      Start
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                      End
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                      Tipe
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                      Point
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                      Variasi
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                      Warna
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                      Size Guide
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                      Detail Images
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                      Specifications
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap sticky right-0 bg-black">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan="18"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Tidak ada produk tersedia
                      </td>
                    </tr>
                  ) : (
                    products.map((p, idx) => (
                      <tr
                        key={p.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            checked={selectedProducts.includes(p.id)}
                            onChange={() => handleSelectProduct(p.id)}
                            type="checkbox"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {p.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <img
                            src={p.Image}
                            alt={p.name}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {p.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          Rp {p.price?.toLocaleString() || 0}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-semibold">
                          Rp {p.current_price?.toLocaleString() || 0}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {p.discount ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Rp {p.discount.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                          {p.startDiscount
                            ? new Date(p.startDiscount).toLocaleDateString(
                                "id-ID"
                              )
                            : "-"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                          {p.endDiscount
                            ? new Date(p.endDiscount).toLocaleDateString(
                                "id-ID"
                              )
                            : "-"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {p.category}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {p.tipe}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {p.point}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {p.variasi}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {p.warna}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">
                          <div className="truncate">{p.description}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="w-full max-w-md">
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                              <div className="bg-gray-100 border-b border-gray-200">
                                <table className="min-w-full">
                                  <thead>
                                    <tr>
                                      <th className="px-2 py-1 text-left font-medium text-xs text-gray-700 w-2/5">
                                        Tipe
                                      </th>
                                      <th className="px-2 py-1 text-left font-medium text-xs text-gray-700 w-2/5">
                                        Value
                                      </th>
                                      <th className="px-2 py-1 text-left font-medium text-xs text-gray-700 w-1/5">
                                        Stock
                                      </th>
                                    </tr>
                                  </thead>
                                </table>
                              </div>

                              <div className="overflow-y-auto max-h-25">
                                <table className="min-w-full">
                                  <tbody className="text-xs text-gray-700">
                                    {p.size?.map((s, i) => (
                                      <tr
                                        key={i}
                                        className="border-t border-gray-200 hover:bg-gray-50"
                                      >
                                        <td className="px-2 py-1 whitespace-nowrap w-2/5">
                                          {s.type}
                                        </td>
                                        <td className="px-2 py-1 whitespace-nowrap w-2/5">
                                          {s.value}
                                        </td>
                                        <td className="px-2 py-1 whitespace-nowrap w-1/5">
                                          {s.stock}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {p.size_guide ? (
                            <div className="w-full max-w-md overflow-x-auto border border-gray-200 rounded-lg">
                              <table className="min-w-full text-xs text-gray-700">
                                <thead className="bg-gray-100">
                                  <tr>
                                    {p.size_guide.thead?.map((col, i) => (
                                      <th
                                        key={i}
                                        className="px-2 py-1 font-medium text-gray-700 text-left"
                                      >
                                        {col}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {p.size_guide.tbody?.map((row, ri) => (
                                    <tr
                                      key={ri}
                                      className="border-t border-gray-200 hover:bg-gray-50"
                                    >
                                      {row.map((cell, ci) => (
                                        <td key={ci} className="px-2 py-1">
                                          {cell}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs italic">
                              Tidak ada
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {p.detail_images?.map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                alt={`detail-${i}`}
                                className="w-10 h-10 object-cover rounded shadow-sm"
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1 max-w-xs">
                            {p.specifications?.map((spc, i) => (
                              <div key={i} className="text-xs text-gray-600">
                                • {spc}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap sticky right-0 bg-inherit">
                          <div className="flex gap-2">
                            <button
                              // onClick={() => navigate(`/admin/dashboard/edit-product/${products.id}`)}
                              onClick={() => handleEdit(p)}
                              className="inline-flex items-center px-3 py-1.5 bg-black text-white text-sm font-medium rounded-md transition-colors duration-200"
                            >
                              <FiEdit2 className="mr-1" />
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500 text-center">
          Scroll horizontal untuk melihat semua kolom
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
              Hapus Produk?
            </h3>

            <p className="text-gray-600 mb-8 text-center leading-relaxed">
              Produk yang dihapus tidak dapat dikembalikan. Apakah Anda yakin
              ingin melanjutkan?
            </p>

            <div className="flex gap-3">
              <button
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors duration-200"
                onClick={() => setShowDeleteModal(false)}
              >
                Batal
              </button>
              <button
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg shadow-red-600/30"
                onClick={confirmDelete}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;
