import React, { useEffect, useState } from "react";

export default function RightAdminLaporan() {
  const [data, setData] = useState({
    income: {},
    sales: [],
    orders: [],
    daily: [],
    stock: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://backendlombaecomerce-production.up.railway.app/api/laporan/full")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Memuat laporan...
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Laporan Penjualan
      </h1>

      {/* RINGKASAN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-700 shadow-lg rounded-xl text-white transform hover:scale-105 transition-transform">
          <h3 className="text-sm text-gray-200">Total Pendapatan</h3>
          <p className="text-2xl font-bold mt-2">
            Rp {Number(data.income.total_income || 0).toLocaleString()}
          </p>
        </div>

        {data.orders.map((o) => (
          <div
            key={o.status}
            className="p-6 bg-gradient-to-br from-gray-800 via-gray-600 to-gray-500 shadow-lg rounded-xl text-white transform hover:scale-105 transition-transform"
            >
            <h3 className="text-sm text-gray-200">Pesanan {o.status}</h3>
            <p className="text-2xl font-bold mt-2">{o.total_orders}</p>
          </div>
        ))}

        <div className="p-6 bg-gradient-to-br from-gray-600 via-gray-400 to-gray-300 shadow-lg rounded-xl text-white transform hover:scale-105 transition-transform">
          <h3 className="text-sm text-gray-200">Total Produk Terjual</h3>
          <p className="text-2xl font-bold mt-2">
            {data.sales.reduce((a, b) => a + Number(b.total_quantity), 0)}
          </p>
        </div>
      </div>

      {/* PENJUALAN PER PRODUK */}
      <div className="bg-white shadow rounded-xl p-5 mb-6">
        <h2 className="text-lg font-semibold mb-3">Penjualan per Produk</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-2 text-left">Produk</th>
                <th className="p-2 text-right">Jumlah</th>
                <th className="p-2 text-right">Total Penjualan</th>
              </tr>
            </thead>
            <tbody>
              {data.sales.map((item) => (
                <tr key={item.product_name} className="border-t">
                  <td className="p-2">{item.product_name}</td>
                  <td className="p-2 text-right">{item.total_quantity}</td>
                  <td className="p-2 text-right">
                    Rp {Number(item.total_sales).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PENDAPATAN HARIAN */}
      <div className="bg-white shadow rounded-xl p-5 mb-6">
        <h2 className="text-lg font-semibold mb-3">Pendapatan Harian</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-2 text-left">Tanggal</th>
                <th className="p-2 text-right">Pendapatan</th>
              </tr>
            </thead>
            <tbody>
              {data.daily.map((d) => (
                <tr key={d.date} className="border-t">
                  <td className="p-2">{d.date}</td>
                  <td className="p-2 text-right">
                    Rp {Number(d.daily_income).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LAPORAN STOK PRODUK */}
      <div className="bg-white shadow rounded-xl p-5">
        <h2 className="text-lg font-semibold mb-3">Laporan Stok Produk</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-2 text-left">Produk</th>
                <th className="p-2 text-left">Kategori</th>
                <th className="p-2 text-right">Stok</th>
              </tr>
            </thead>
            <tbody>
              {data.stock.map((s) => (
                <tr key={s.product_name} className="border-t">
                  <td className="p-2">{s.product_name}</td>
                  <td className="p-2">{s.category}</td>
                  <td className="p-2 text-right">{s.total_stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
