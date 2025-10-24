import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../../../hooks/useFetch";

function SearchPopUp({
  show = false,
  onClose = () => {},
  query = "",
  setQuery = () => {},
  limit = 8,
}) {
  const navigate = useNavigate();
  const { data, loading, error } = useFetch("/products/product");
  const [expanded, setExpanded] = useState(false);

  const items = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.products)) return data.products;
    if (Array.isArray(data.payload)) return data.payload;
    return [];
  }, [data]);

  const results = useMemo(() => {
    const q = String(query || "")
      .trim()
      .toLowerCase();
    if (!q) return items.slice(0, 200);
    return items.filter((it) => {
      const name = String(it?.name || it?.title || "").toLowerCase();
      const tipe = String(
        it?.tipe || it?.type || it?.category || ""
      ).toLowerCase();
      const desc = String(it?.description || it?.deskripsi || "").toLowerCase();
      return name.includes(q) || tipe.includes(q) || desc.includes(q);
    });
  }, [items, query]);

  const visible = expanded ? results : results.slice(0, limit);

  useEffect(() => {
    setExpanded(false);
  }, [query, show]);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  const onSelect = (item) => {
    const id = item?.id ?? item?._id;
    if (!id) return;
    setQuery("");
    onClose();
    navigate(`/product/${id}`, { state: item });
  };

  if (!show) return null;

  return (
    <div className="relative">
      <div
        id="search-popup"
        className={`fixed top-0 left-1/2 -translate-x-1/2 z-40 h-screen w-full max-md:left-0 max-md:translate-x-0 max-md:rounded-none max-md:h-full max-md:w-full backdrop-blur-xs bg-white/70 shadow-2xl border border-gray-200 rounded-b-3xl overflow-hidden transition-transform duration-300 ease-in-out`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-8 max-md:px-4 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
          <div className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            Hasil Pencarian
          </div>
          <button
            onClick={() => {
              setQuery("");
              onClose();
            }}
            className="px-3 py-1 text-sm text-gray-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors"
          >
            Tutup ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-8 max-md:px-4 py-5 max-h-[80vh] max-md:max-h-[85vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {loading && (
            <div className="text-sm text-gray-500 animate-pulse">
              Memuat produk...
            </div>
          )}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-md">
              Error: {String(error)}
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="mb-5 text-sm text-gray-600">
                Menampilkan{" "}
                <span className="font-semibold text-indigo-600">
                  {visible.length}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-indigo-600">
                  {results.length}
                </span>{" "}
                hasil
                {query ? (
                  <span className="italic text-gray-500"> untuk “{query}”</span>
                ) : (
                  ""
                )}
              </div>

              {results.length === 0 ? (
                <div className="py-20 text-center text-gray-500 text-sm">
                  Tidak ada hasil ditemukan.
                </div>
              ) : (
                <>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-md:gap-3">
                    {visible.map((item) => {
                      const id = item?.id ?? item?._id ?? crypto.randomUUID();
                      const img =
                        item?.Image ||
                        item?.image ||
                        item?.thumbnail ||
                        item?.images?.[0] ||
                        "";
                      const title =
                        item?.name || item?.title || "Produk tanpa nama";
                      const tipe =
                        item?.tipe || item?.type || item?.category || "";
                      const price =
                        item?.current_price ?? item?.price ?? item?.harga;

                      return (
                        <li
                          key={id}
                          className="bg-white/80 border border-gray-100 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 backdrop-blur-sm"
                        >
                          <button
                            onClick={() => onSelect(item)}
                            className="w-full text-left flex gap-4 p-4 hover:bg-gray-50 rounded-xl max-md:gap-3 max-md:p-3"
                          >
                            <div
                              className="w-24 h-24 max-md:w-20 max-md:h-20 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 border"
                              style={{
                                backgroundColor: item?.warna || "#f9fafb",
                              }}
                            >
                              {img ? (
                                <img
                                  src={img}
                                  alt={title}
                                  className="object-contain w-full h-full"
                                />
                              ) : (
                                <div className="text-xs text-gray-400">
                                  No image
                                </div>
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="text-sm font-semibold text-gray-800 line-clamp-1 max-md:text-[13px]">
                                {title}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                {tipe}
                              </div>
                              {price != null && (
                                <div className="text-sm text-indigo-600 font-medium mt-2 max-md:text-[13px]">
                                  Rp {Number(price).toLocaleString("id-ID")}
                                </div>
                              )}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {results.length > limit && (
                    <div className="mt-6 flex items-center justify-center">
                      <button
                        onClick={() => setExpanded((s) => !s)}
                        className="px-5 py-2 rounded-lg border border-indigo-200 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition-colors max-md:text-xs max-md:px-4 max-md:py-1.5"
                      >
                        {expanded
                          ? "Tampilkan lebih sedikit"
                          : `Lihat semua (${results.length})`}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPopUp;
