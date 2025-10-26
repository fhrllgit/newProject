import { useState, useEffect } from "react";
import { FiChevronsLeft, FiBell, FiEdit2 } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { CiSliderVertical } from "react-icons/ci";
import { PiSlidersHorizontal } from "react-icons/pi";
import { RiDeleteBinLine } from "react-icons/ri";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const RightAdmin = () => {
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

  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  
  const [weeklyData, setWeeklyData] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://backendlombaecomerce-production.up.railway.app/api/category");
      const payload = res.data?.[0]?.payload || [];
      setCategories(payload);
    } catch (err) {
      console.error("Gagal memuat kategori", err);
    }
  };

  const fetchTransaksi = async () => {
    try {
      const BASE_URL = "https://backendlombaecomerce-production.up.railway.app/api/transactions";
      const summaryRes = await axios.get(`${BASE_URL}/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const listRes = await axios.get(`${BASE_URL}/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSummary(summaryRes.data.summary);
      setTransactions(listRes.data);
      
      generateWeeklyData(listRes.data);
    } catch (error) {
      console.error("Gagal memuat data transaksi:", error);
    }
  };

  const generateWeeklyData = (transactionsList) => {
    const now = new Date();
    const weeklyStats = [];
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i + 1) * 7);
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - i * 7);
      
      const weekTransactions = transactionsList.filter(t => {
        const transDate = new Date(t.created_at);
        return transDate >= weekStart && transDate < weekEnd;
      });
      
      const pendapatan = weekTransactions
        .filter(t => t.status === "selesai" || t.status === "Selesai")
        .reduce((sum, t) => sum + (t.total_after_discount || 0), 0);
      
      const selesai = weekTransactions.filter(
        t => t.status === "selesai" || t.status === "Selesai"
      ).length;
      
      const totalProdukTerjual = weekTransactions
        .filter(t => t.status === "selesai" || t.status === "Selesai")
        .reduce((sum, t) => sum + (t.total_item || 0), 0);
      
      const weekLabel = `${weekStart.getDate()}/${weekStart.getMonth() + 1} - ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`;
      
      weeklyStats.push({
        minggu: weekLabel,
        pendapatan: pendapatan,
        transaksiSelesai: selesai,
        totalProduk: totalProdukTerjual
      });
    }
    
    setWeeklyData(weeklyStats);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchTransaksi();
  }, []);

  const handleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = () => {
    if (selectedProducts.length === 0) return alert("Pilih produk dulu!");
    setShowDeleteModal(true);
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

  const handleEdit = (product) => {
    navigate(`/admin/dashboard/edit-product/${product.id}`);
  };

  const formatToIDR = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number || 0);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading produk...</div>
      </div>
    );

  if (error)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-3 flex justify-between items-center border-b border-gray-200">
          <button className="text-gray-600 hover:text-gray-900">
            <FiChevronsLeft className="text-xl" />
          </button>
          <div className="flex gap-3 items-center">
            <button className="relative text-gray-600 hover:text-gray-900">
              <FiBell className="text-xl" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <p className="text-sm font-medium text-gray-700">Admin</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 shadow-lg rounded-xl text-white p-5">
          <h3 className="text-sm opacity-90 mb-1">Total Pendapatan</h3>
          <p className="text-2xl font-bold">
            {formatToIDR(summary?.total_pendapatan)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-600 shadow-lg rounded-xl text-white p-5">
          <h3 className="text-sm opacity-90 mb-1">Transaksi Selesai</h3>
          <p className="text-2xl font-bold">{summary?.total_selesai || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-600 shadow-lg rounded-xl text-white p-5">
          <h3 className="text-sm opacity-90 mb-1">Diproses</h3>
          <p className="text-2xl font-bold">{summary?.total_diproses || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-stone-800 via-stone-700 to-stone-600 shadow-lg rounded-xl text-white p-5">
          <h3 className="text-sm opacity-90 mb-1">Dibatalkan</h3>
          <p className="text-2xl font-bold">{summary?.total_batal || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 shadow-lg rounded-xl text-white p-5">
          <h3 className="text-sm opacity-90 mb-1">Total Produk</h3>
          <p className="text-2xl font-bold mt-2">{products.length}</p>
        </div>
      </div>

      <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Pendapatan Per Minggu</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="minggu" />
              <YAxis />
              <Tooltip formatter={(value) => formatToIDR(value)} />
              <Legend />
              <Line type="monotone" dataKey="pendapatan" stroke="#1f2937" strokeWidth={2} name="Pendapatan" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Transaksi & Produk Terjual Per Minggu</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="minggu" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="transaksiSelesai" fill="#1f2937" name="Transaksi Selesai" />
              <Bar dataKey="totalProduk" fill="#4b5563" name="Produk Terjual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="px-6">
        <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 border border-gray-200">
          <div className="flex items-center flex-1 gap-2 border border-gray-300 rounded-xl px-3 py-2 bg-gray-50">
            <IoSearchOutline />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchFilteredProducts()}
              placeholder="Cari produk..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <PiSlidersHorizontal className="text-gray-400" />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <div className="flex items-center gap-1 border border-gray-300 rounded-lg px-2 py-1 bg-gray-50">
              <span className="text-xs font-medium">Stok</span>
              <input
                type="number"
                placeholder="Min"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                className="w-14 border rounded text-xs px-1"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxStock}
                onChange={(e) => setMaxStock(e.target.value)}
                className="w-14 border rounded text-xs px-1"
              />
              <button
                onClick={fetchFilteredProducts}
                className="ml-2 bg-black text-white px-2 py-1 text-xs rounded"
              >
                Apply
              </button>
            </div>

            <div className="flex items-center gap-1 border border-gray-300 rounded-lg px-2 py-1 bg-gray-50">
              <CiSliderVertical />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent text-xs outline-none"
              >
                <option value="">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                onClick={fetchFilteredProducts}
                className="ml-2 bg-black text-white px-2 py-1 text-xs rounded"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Daftar Produk</h2>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/admin/products/add")}
              className="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800"
            >
              + Tambah Produk
            </button>
            <button
              onClick={handleDeleteSelected}
              className="bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2"
            >
              <RiDeleteBinLine /> Hapus
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left">Produk</th>
                  <th className="px-4 py-3 text-left">Harga</th>
                  <th className="px-4 py-3 text-left">Kategori</th>
                  <th className="px-4 py-3 text-center">Stok</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-8 text-center text-gray-500 italic"
                    >
                      Tidak ada produk
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const totalStock =
                      p.stock ??
                      p.quantity ??
                      p.stock_available ??
                      (Array.isArray(p.size)
                        ? p.size.reduce((a, s) => a + (s.stock || 0), 0)
                        : 0);

                    return (
                      <tr key={p.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(p.id)}
                            onChange={() => handleSelectProduct(p.id)}
                          />
                        </td>
                        <td className="px-4 py-3 flex items-center gap-3">
                          <img
                            src={
                              p.Image ||
                              "https://via.placeholder.com/60x60?text=No+Image"
                            }
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded-md border"
                          />
                          <span className="font-medium text-gray-800 truncate max-w-[150px]">
                            {p.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          Rp {p.current_price?.toLocaleString() || p.price || 0}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {p.category}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-gray-800">
                          {totalStock || "-"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleEdit(p)}
                            className="bg-black text-white text-xs px-3 py-1.5 rounded-md hover:bg-gray-800 flex items-center justify-center mx-auto"
                          >
                            <FiEdit2 className="mr-1" /> Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* TABLE TRANSAKSI */}
      <div className="px-6 pb-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Daftar Transaksi
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white overflow-hidden shadow rounded-2xl">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-left font-semibold">ID</th>
                <th className="p-4 text-left font-semibold">Nama User</th>
                <th className="p-4 text-left font-semibold">Total</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Tanggal</th>
                <th className="p-4 text-left font-semibold">Jumlah Item</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr
                  key={t.order_id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">{t.order_id}</td>
                  <td className="p-4">{t.user_name}</td>
                  <td className="p-4">{formatToIDR(t.total_after_discount)}</td>
                  <td className="p-4">{t.status}</td>
                  <td className="p-4">
                    {new Date(t.created_at).toLocaleString("id-ID")}
                  </td>
                  <td className="p-4">{t.total_item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
              Hapus Produk?
            </h3>
            <p className="text-gray-600 mb-8 text-center leading-relaxed">
              Produk yang dihapus tidak dapat dikembalikan. Apakah Anda yakin?
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl"
                onClick={() => setShowDeleteModal(false)}
              >
                Batal
              </button>
              <button
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg"
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

export default RightAdmin;