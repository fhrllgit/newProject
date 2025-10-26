import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderHistory = ({ token }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://backendlombaecomerce-production.up.railway.app/api/orders/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Gagal mengambil data pesanan");

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Terjadi kesalahan");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-500 animate-pulse">Memuat riwayat pesanan...</p>
      </div>
    );
  if (error) return <p className="text-red-600">{error}</p>;
  
  return (
    <div className="container mx-auto">
      <h2 className="text-lg sm:text-xl font-bold mb-4">
        Riwayat Pesanan Anda
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">Belum ada pesanan selesai.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="">
            <div className="flex justify-between text-sm font-light">
              <span>Status Pesanan:</span>
              <span className="font-medium">{order.status}</span>
            </div>

            <div className="flex justify-between text-sm font-light">
              <span>Tanggal:</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm font-light">
              <span>Total Produk:</span>
              <span>
                Rp. {order.totalAfterDiscount?.toLocaleString() || "0"}
              </span>
            </div>

            <hr />

            {order.items.map((item, i) => {
              const price = item.Discount || item.Price || 0;
              return (
                <div
                  key={`${item.id}-${i}`}
                  className="flex items-center gap-3 border-t pt-2"
                >
                  <img
                    src={item.Image}
                    className="w-20 h-auto rounded-md"
                    alt={item.Name}
                  />
                  <div className="flex-1 flex flex-col">
                    <p className="text-xs font-semibold">{item.Name}</p>
                    {item.Size && (
                      <p className="text-xs text-gray-500">Size: {item.Size}</p>
                    )}
                    {item.Variasi && (
                      <p className="text-xs text-gray-500">
                        Warna: {item.Variasi}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Jumlah: {item.Quantity} × Rp {price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Total: Rp {(price * item.Quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
