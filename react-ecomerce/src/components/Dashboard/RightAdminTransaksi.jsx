import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiBell, FiChevronsLeft } from "react-icons/fi";

const DashboardTransaksi = () => {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const BASE_URL = "https://backendlombaecomerce-production.up.railway.app/api/transactions";

        const summaryRes = await axios.get(`${BASE_URL}/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("📊 Summary Response:", summaryRes.data)

        const listRes = await axios.get(`${BASE_URL}/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSummary(summaryRes.data.summary);
        setTransactions(listRes.data);
      } catch (error) {
        console.error("❌ Gagal mengambil data transaksi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

    const formatToIDR = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };


  if (loading) return <p>Loading...</p>;

  return (
    <>
 <div>
  <div className="w-full bg-white sticky top-0 z-10 shadow-sm">
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
  
  <div className="p-4">
    <h2 className="text-xl font-bold mb-4">Ringkasan Transaksi</h2>
    {summary && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-700 shadow-lg rounded-xl text-white transform hover:scale-105 transition-transform">
          <p className="text-sm opacity-90 mb-2">Total Pendapatan</p>
          <p className="text-2xl font-bold">{formatToIDR(summary.total_pendapatan)}</p>
        </div>
        
        <div className="p-6 bg-gradient-to-br from-gray-800 via-gray-600 to-gray-500 shadow-lg rounded-xl text-white transform hover:scale-105 transition-transform">
          <p className="text-sm opacity-90 mb-2">Transaksi Selesai</p>
          <p className="text-2xl font-bold">{summary.total_selesai}</p>
        </div>
        
        <div className="p-6 bg-gradient-to-br from-gray-600 via-gray-400 to-gray-300 shadow-lg rounded-xl text-white transform hover:scale-105 transition-transform">
          <p className="text-sm opacity-90 mb-2">Transaksi Diproses</p>
          <p className="text-2xl font-bold">{summary.total_diproses}</p>
        </div>
        
        <div className="p-6 bg-gradient-to-br from-gray-400 via-gray-300 to-gray-100 shadow-lg rounded-xl text-gray-800 transform hover:scale-105 transition-transform">
          <p className="text-sm opacity-75 mb-2">Transaksi Batal</p>
          <p className="text-2xl font-bold">{summary.total_batal}</p>
        </div>
      </div>
    )}
    
    <h2 className="text-xl font-bold mb-4">Daftar Transaksi</h2>
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
            <tr key={t.order_id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4">{t.order_id}</td>
              <td className="p-4">{t.user_name}</td>
              <td className="p-4">{formatToIDR(t.total_after_discount)}</td>
              <td className="p-4">{t.status}</td>
              <td className="p-4">{new Date(t.created_at).toLocaleString()}</td>
              <td className="p-4">{t.total_item}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
    </>
    
  );
};

export default DashboardTransaksi;
