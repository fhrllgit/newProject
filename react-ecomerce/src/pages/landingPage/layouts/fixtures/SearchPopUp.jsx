import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../../../hooks/useFetch";

/**
 * SearchPopUp
 * props:
 *  - show: boolean
 *  - onClose: fn
 *  - query: string
 *  - setQuery: fn (optional)
 *  - limit: number (how many items to show initially) default 8
 *
 * Behavior:
 *  - shows `limit` items initially, with a "Lihat semua" button if more exist
 *  - clicking "Lihat semua" expands to show all (or to a larger page)
 */
function SearchPopUp({ show = false, onClose = () => {}, query = "", setQuery, limit = 8 }) {
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

  // filtered results (client-side)
  const results = useMemo(() => {
    const q = String(query || "").trim().toLowerCase();
    if (!q) return items.slice(0, 200); // limit upstream but keep stable
    return items.filter((it) => {
      const name = String(it?.name || it?.title || "").toLowerCase();
      const tipe = String(it?.tipe || it?.type || it?.category || "").toLowerCase();
      const desc = String(it?.description || it?.deskripsi || "").toLowerCase();
      return name.includes(q) || tipe.includes(q) || desc.includes(q);
    });
  }, [items, query]);

  // visible subset depending on expanded flag
  const visible = expanded ? results : results.slice(0, limit);

  useEffect(() => {
    // reset expanded when query changes / popup opens/closes
    setExpanded(false);
  }, [query, show]);

  useEffect(() => {
    // disable body scroll while popup open
    document.body.style.overflow = show ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  const onSelect = (item) => {
    const id = item?.id ?? item?._id;
    if (!id) return;
    if (typeof setQuery === "function") setQuery("");
    onClose();
    navigate(`/product/${id}`, { state: item });
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={() => onClose()}
        aria-hidden="true"
      />

      {/* Popup (below navbar; top handled by CSS in previous version) */}
      <div
        id="search-popup"
        className={`fixed pt-20 left-1/2 -translate-x-1/2 z-40 w-full bg-white rounded-b-lg shadow-lg overflow-hidden transition-transform duration-200`}
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-3 border-b flex items-center justify-between">
          <div className="text-sm text-gray-600">Hasil pencarian</div>
          <button
            onClick={() => {
              if (typeof setQuery === "function") setQuery("");
              onClose();
            }}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
          >
            Tutup
          </button>
        </div>

        <div className="px-6 py-4 max-h-[60vh] overflow-auto">
          {loading && <div className="text-sm text-gray-500">Memuat produk...</div>}
          {error && <div className="text-sm text-red-600">Error: {String(error)}</div>}

          {!loading && !error && (
            <>
              <div className="mb-3 text-sm text-gray-600">
                Menampilkan {visible.length} dari {results.length} hasil{query ? ` untuk "${query}"` : ""}
              </div>

              {results.length === 0 ? (
                <div className="py-12 text-center text-gray-500">Tidak ada hasil.</div>
              ) : (
                <>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visible.map((item) => {
                      const id = item?.id ?? item?._id;
                      const img = item?.Image || item?.image || item?.thumbnail || item?.images?.[0] || "";
                      const title = item?.name || item?.title || item?.nama || "Produk tanpa nama";
                      const tipe = item?.tipe || item?.type || item?.category || "";
                      const price = item?.current_price ?? item?.price ?? item?.harga;

                      return (
                        <li key={id ?? title} className="border rounded-lg overflow-hidden">
                          <button
                            onClick={() => onSelect(item)}
                            className="w-full text-left flex gap-3 p-3 hover:bg-gray-50"
                          >
                            <div className={`w-24 h-24 bg-[${item.warna}] flex items-center justify-center overflow-hidden rounded`}>
                              {img ? (
                                <img src={img} alt={title} className="object-contain w-full h-full" />
                              ) : (
                                <div className="text-xs text-gray-400">No image</div>
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="text-sm font-medium">{title}</div>
                              <div className="text-xs text-gray-500 mt-1">{tipe}</div>
                              {price != null && (
                                <div className="text-sm text-indigo-600 mt-2">Rp {Number(price).toLocaleString("id-ID")}</div>
                              )}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Show more / show less control */}
                  {results.length > limit && (
                    <div className="mt-4 flex items-center justify-center">
                      <button
                        onClick={() => setExpanded((s) => !s)}
                        className="px-4 py-2 rounded-md border text-sm"
                      >
                        {expanded ? "Tampilkan lebih sedikit" : `Lihat semua (${results.length})`}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchPopUp;