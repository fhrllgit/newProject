import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiBell, FiChevronsLeft } from "react-icons/fi";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://backendlombaecomerce-production.up.railway.app/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("❌ Gagal mengambil pesanan:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://backendlombaecomerce-production.up.railway.app/api/orders/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (error) {
      console.error("❌ Gagal update status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
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
      <div className="container mx-auto mt-10 sm:mt-10 px-4 sm:px-6 lg:px-12">
        <h1 className="text-lg sm:text-xl font-bold mb-4">Kelola Pesanan</h1>
        {orders.length === 0 ? (
          <p className="text-gray-500">Belum ada pesanan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm min-w-[640px] rounded-xl overflow-hidden">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-2 sm:p-3">#</th>
                  <th className="p-2 sm:p-3">Pelanggan</th>
                  <th className="p-2 sm:p-3">Alamat</th>
                  <th className="p-2 sm:p-3">Produk</th>
                  <th className="p-2 sm:p-3">Total</th>
                  <th className="p-2 sm:p-3">Status</th>
                  <th className="p-2 sm:p-3">Aksi</th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {orders.map((o, i) => {
                  // Parsing address dari kolom address_json
                  let parsedAddress = {};
                  try {
                    parsedAddress = o.address_json
                      ? JSON.parse(o.address_json)
                      : {};
                  } catch (err) {
                    parsedAddress = {};
                  }

                  // Buat string alamat lengkap
                  const fullAddress = parsedAddress.alamat_lengkap
                    ? `${parsedAddress.nama_penerima || ""} - ${
                        parsedAddress.telepon || ""
                      }, ${parsedAddress.alamat_lengkap || ""}, ${
                        parsedAddress.kota || ""
                      }`
                    : "-";

                  return (
                    <tr key={o.order_id} className="hover:bg-gray-50">
                      <td className="p-2 sm:p-3 text-center">{i + 1}</td>
                      <td className="p-2 sm:p-3">{o.user_name}</td>
                      <td className="p-2 sm:p-3">{fullAddress}</td>
                      <td className="p-2 sm:p-3">{o.product_name}</td>
                      <td className="p-2 sm:p-3 text-right">
                        Rp {o.total_after_discount?.toLocaleString()}
                      </td>
                      <td className="p-2 sm:p-3 text-center">{o.status}</td>
                      <td className="p-2 sm:p-3 text-center">
                        <div className="flex flex-col sm:flex-row items-center gap-2 justify-center">
                          <select
                            value={o.status}
                            onChange={(e) =>
                              setOrders((prev) =>
                                prev.map((order) =>
                                  order.order_id === o.order_id
                                    ? { ...order, status: e.target.value }
                                    : order
                                )
                              )
                            }
                            className="border border-gray-300 p-1 rounded-md text-xs w-full sm:w-auto"
                          >
                            <option value="DIPROSES">Diproses</option>
                            <option value="DIKIRIM">Dikirim</option>
                            <option value="SELESAI">Selesai</option>
                            <option value="DIBATALKAN">Dibatalkan</option>
                          </select>
                          <button
                            onClick={(e) => {
                              const select = e.target.previousSibling;
                              updateStatus(o.order_id, select.value);
                            }}
                            className="bg-black text-white text-xs px-3 py-1 rounded-md hover:bg-gray-800 w-full sm:w-auto"
                          >
                            Simpan
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
