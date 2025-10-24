import React, { useMemo, useRef } from "react";
import { useFetch } from "./useFetch";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "./useFavorites";

export default function ProductSection({
  title = "Products",
  endpoint = "/products/product",
  items = null,
  limit = 6,
  filterFn = null,
  sortFn = null,
  onItemClick = null,
  showLike = true,
}) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const SCROLL_AMOUNT = 300;
  const { data, loading, error } = items
    ? { data: null, loading: false, error: null }
    : useFetch(endpoint);
  const raw = items ?? (data ?? []);
  const arr = Array.isArray(raw) ? raw : [];
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const formatToIDR = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  const handleLike = (item, e) => {
    e?.stopPropagation?.();
    const rawId = item?.id ?? item?._id;
    if (!rawId) return;
    const snapshot = {
      id: rawId,
      name: item?.name ?? item?.title ?? "",
      Image: item?.Image ?? item?.image ?? (item?.images?.[0] ?? ""),
      price: item?.current_price ?? item?.price ?? item?.harga ?? null,
      tipe: item?.tipe || item?.type || item?.category || "",
    };
    if (isFavorite(rawId)) removeFavorite(rawId);
    else addFavorite(snapshot);
  };

  const handleProductClick = (item) => {
    if (onItemClick) onItemClick(item);
    navigate(`/product/${item.id}`, { state: item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filtered = useMemo(() => {
    let out = arr;
    if (typeof filterFn === "function") out = out.filter(filterFn);
    if (typeof sortFn === "function") out = [...out].sort(sortFn);
    if (limit && Number.isInteger(limit)) out = out.slice(0, limit);
    return out;
  }, [arr, filterFn, sortFn, limit]);

  const dynamicTitle = useMemo(() => {
    if (title !== "Products") return title;
    if (!filtered.length) return "Products";
    const sample = filtered[0];
    return sample.category
      ? `Produk ${sample.category}`
      : "Anda mungkin juga menyukai";
  }, [filtered, title]);

  const toSlug = (s) =>
    encodeURIComponent(
      String(s || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "")
    );

  const onShopClick = () => {
    const labelCandidate =
      title && title !== "Products"
        ? title
        : arr[0]?.tipe || arr[0]?.type || arr[0]?.category || "all";
    const label = String(labelCandidate || "all");
    const slug = toSlug(label);
    navigate(`/category/${slug}`, { state: { items: arr, label } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollRight = (amount = SCROLL_AMOUNT) => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const scrollLeft = (amount = SCROLL_AMOUNT) => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: -amount, behavior: "smooth" });
  };

  if (loading) return <p>loading</p>;
  if (error) return <p>Error: {String(error)}</p>;

  return (
    <div className="relative py-4 flex flex-col gap-6 overflow-hidden px-4 sm:px-8 md:px-16 lg:px-24">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-lg sm:text-xl font-semibold">{dynamicTitle}</h1>
        <button
          type="button"
          onClick={onShopClick}
          className="border shadow shadow-gray-200 rounded-lg px-4 py-1 hover:bg-zinc-100 duration-300 ease-in-out text-sm sm:text-base"
        >
          <span className="font-bold text-gray-700">Shop</span>
        </button>
      </div>

      {/* PRODUCT LIST */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-hide gap-4 sm:gap-6"
      >
        {filtered.length === 0 && (
          <p className="px-4 text-sm text-gray-500">No items found.</p>
        )}
        {filtered.map((item) => {
          const idStr = String(item.id ?? item._id);
          const liked = isFavorite(idStr);

          return (
            <div
              key={idStr}
              onClick={() => handleProductClick(item)}
              className="flex-shrink-0 w-40 sm:w-48 md:w-52 lg:w-56 flex flex-col gap-3 cursor-pointer border border-transparent hover:border-black overflow-hidden rounded-md transition-colors duration-200 mx-auto"
            >
              <div className="relative">
                {showLike && (
                  <button
                    aria-pressed={liked}
                    onClick={(e) => handleLike(item, e)}
                    className="absolute right-2 top-2 z-10 bg-white/60 rounded-full p-1"
                  >
                    <svg
                      className={`w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] ${
                        liked ? "text-black" : "text-gray-200"
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="black"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
                    </svg>
                  </button>
                )}
                <div
                  className={`h-48 sm:h-52 md:h-56 w-full bg-[${
                    item.warna ?? "#fff"
                  }]`}
                >
                  <img
                    src={item.Image}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div className="p-2 text-xs sm:text-sm">
                <h1 className="text-[#9f9f9f] font-light">{item.tipe}</h1>
                <p className="mt-1 sm:mt-2 text-zinc-700 truncate w-full">
                  {item.name}
                </p>
                <h1>{formatToIDR(item.price)}</h1>
              </div>
            </div>
          );
        })}
      </div>

      {/* SCROLL BUTTONS */}
      <button
        type="button"
        onClick={() => scrollLeft()}
        className="absolute hidden md:flex z-30 top-1/2 left-2 sm:left-8 lg:left-20 p-2 bg-gray-200 rounded hover:bg-gray-300 justify-center items-center w-8 h-8 sm:w-10 sm:h-10"
        aria-label="scroll left"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={() => scrollRight()}
        className="absolute hidden md:flex z-30 top-1/2 right-2 sm:right-8 lg:right-20 p-2 bg-gray-200 rounded hover:bg-gray-300 justify-center items-center w-8 h-8 sm:w-10 sm:h-10"
        aria-label="scroll right"
      >
        ›
      </button>
    </div>
  );
}
