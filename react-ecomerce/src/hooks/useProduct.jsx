import React, { useMemo, useState, useRef } from "react";
import { useFetch } from "./useFetch";
import { useNavigate } from "react-router-dom"; // ⬅️ tambahan

export default function ProductSection({
  title = "Products",
  endpoint = "/products/product",
  items = null,
  limit = 6,
  filterFn = null,
  onItemClick = null,
  showLike = true,
}) {
  const navigate = useNavigate(); // ⬅️ tambahan
  const containerRef = useRef(null); // ref untuk scroll container
  const SCROLL_AMOUNT = 300; // pixel yang digeser setiap klik (ubah sesuai kebutuhan)

  const { data, loading, error } = items ? { data: null, loading: false, error: null } : useFetch(endpoint);
  const raw = items ?? (data ?? []);
  const arr = Array.isArray(raw) ? raw : [];
  const [liked, setLiked] = useState([]);

  const formatToIDR = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const handleLike = (id, e) => {
    e?.stopPropagation?.();
    setLiked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleProductClick = (item) => { // ⬅️ tambahan
    if (onItemClick) onItemClick(item);
    navigate(`/product/${item.id}`, { state: item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filtered = useMemo(() => {
  let out = arr;
  if (typeof filterFn === "function") out = out.filter(filterFn);
  if (limit && Number.isInteger(limit)) out = out.slice(0, limit);
  return out;
}, [arr, filterFn, limit]);

const dynamicTitle = useMemo(() => {
  if (title !== "Products") return title;
  if (!filtered.length) return "Products";
  const sample = filtered[0];
  return sample.category ? `Produk ${sample.category}` : "Anda mungkin juga menyukai";
}, [filtered, title]);

  // fungsi scroll ke kanan
  const scrollRight = (amount = SCROLL_AMOUNT) => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  // (opsional) fungsi scroll ke kiri
  const scrollLeft = (amount = SCROLL_AMOUNT) => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: -amount, behavior: "smooth" });
  };

  if (loading) return <p>loading</p>;
  if (error) return <p>Error: {String(error)}</p>;

  return (
    <div className="px-24 relative py-4 flex flex-col gap-8 overflow-hidden ">
      <div className="flex justify-between items-center">
        <h1 className="text-xl">{dynamicTitle}</h1>
        <div className="flex items-center gap-2">
          {/* Tombol geser kiri (opsional) */}
          <button className="border shadow shadow-gray-200 rounded-lg px-4 py-1 hover:bg-zinc-100 duration-300 ease-in-out">
          <span className="font-bold text-md text-gray-700">Shop</span>
        </button>
        </div>
      </div>

      {/* item */}
      <div ref={containerRef} className="flex overflow-x-auto scrollbar-hide">
        {filtered.length === 0 && <p className="px-4 text-sm text-gray-500">No items found.</p>}
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => handleProductClick(item)}
            className="shadow bg-gray-100 mx-4 flex-shrink-0 flex flex-col gap-4 cursor-pointer w-52 border-transparent hover:border-gray-700"
          >
            <div className="relative">
              {showLike && (
                <button
                  aria-pressed={liked.includes(item.id)}
                  onClick={(e) => handleLike(item.id, e)}
                  className="absolute right-2 top-2 z-10 "
                >
                  <svg
                    className={`w-[27px] h-[27px] ${liked.includes(item.id) ? "text-red-500" : "text-white"}`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    stroke="black"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
                  </svg>
                </button>
              )}
              <div className={`h-56 w-52 bg-[${item.warna ?? "#fff"}]`}>
                <img src={item.Image} alt={item.name} className="object-cover w-full h-full" />
              </div>
            </div>

            <div className="p-2 text-sm">
              <h1 className="text-gray-500">{item.tipe}</h1>
              <p className="mt-2 text-zinc-700 truncate w-full">{item.name}</p>
              <h1 className="block ">{formatToIDR(item.price)}</h1>
            </div>
          </div>
        ))}
      </div>
          {/* Tombol geser kiri (opsional) */}
          <button
            type="button"
            onClick={() => scrollLeft()}
            className="absolute z-30 top-1/2 left-28 p-2 bg-gray-200 rounded hover:bg-gray-300 flex justify-center items-center w-10 h-10"
            aria-label="scroll left"
          >
            ‹
          </button>

          {/* Tombol geser kanan yang Anda minta */}
          <button
            type="button"
            onClick={() => scrollRight()}
            className="absolute z-30 top-1/2 right-28 p-2 bg-gray-200 rounded hover:bg-gray-300 flex justify-center items-center w-10 h-10"
            aria-label="scroll right"
          >
            ›
          </button>
    </div>
  );
}