import React, { useMemo, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../../../../hooks/useFetch";
import { useFavorites } from "../../../../hooks/useFavorites";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { IoIosArrowRoundBack } from "react-icons/io";

function normalizeToSearchText(s) {
  if (!s) return "";
  try {
    s = decodeURIComponent(String(s));
  } catch {
    s = String(s);
  }
  return String(s)
    .replace(/[\-_/]+/g, " ")
    .replace(/[^0-9a-zA-Z\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function Category() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const stateItems = location.state?.items ?? null;
  const { data, loading, error } = useFetch(
    stateItems ? null : "/products/product"
  );

  const [filters, setFilters] = useState({
    harga: "",
    ukuran: "",
    tipe: "",
    diskon: "",
  });
  const [openFilter, setOpenFilter] = useState(null);

  const toggleFilter = (key) => {
    setOpenFilter(openFilter === key ? null : key);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setOpenFilter(null);
  };

  const handleRemoveFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  const handleClearAll = () => {
    setFilters({
      harga: "",
      ukuran: "",
      tipe: "",
      diskon: "",
    });
  };
  // format idr
  const formatToIDR = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const items = useMemo(() => {
    if (Array.isArray(stateItems)) return stateItems;
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.products)) return data.products;
    if (Array.isArray(data.payload)) return data.payload;
    return [];
  }, [data, stateItems]);

  const rawFromState =
    location.state?.label || location.state?.category || null;
  const slugText = slug ? String(slug).replace(/\-/g, " ") : null;
  const desiredRawLabel = Array.isArray(stateItems)
    ? null
    : rawFromState || slugText || null;

  const needleTokens = useMemo(() => {
    if (!desiredRawLabel) return [];
    const normalized = normalizeToSearchText(desiredRawLabel);
    if (!normalized) return [];
    return normalized.split(" ").filter(Boolean);
  }, [desiredRawLabel]);

  const getProductSearchString = (p) =>
    normalizeToSearchText(
      p?.tipe ||
        p?.type ||
        p?.category ||
        p?.Category ||
        p?.nama ||
        p?.name ||
        ""
    );

  const tipeOptions = useMemo(() => {
    const all = items
      .map((i) => i.tipe || i.type || i.category || "")
      .filter(Boolean);
    return [...new Set(all)];
  }, [items]);

  const ukuranOptions = useMemo(() => {
    const allSizes = items
      .flatMap((i) =>
        Array.isArray(i.size)
          ? i.size.map((s) => s.value)
          : i.ukuran
          ? [i.ukuran]
          : []
      )
      .filter(Boolean);
    return [...new Set(allSizes)];
  }, [items]);

  const filtered = useMemo(() => {
    let result = items;

    if (needleTokens.length) {
      result = result.filter((p) => {
        const productText = getProductSearchString(p);
        return (
          productText && needleTokens.every((t) => productText.includes(t))
        );
      });
    }

    // === LOGIKA HARGA
    if (filters.harga === "under500") {
      result = result.filter((p) => (p.price || p.harga) < 500000);
    } else if (filters.harga === "500to1jt") {
      result = result.filter((p) => {
        const price = p.price || p.harga;
        return price >= 500000 && price <= 1000000;
      });
    } else if (filters.harga === "over1jt") {
      result = result.filter((p) => (p.price || p.harga) > 1000000);
    }

    if (filters.ukuran) {
      result = result.filter((p) => {
        const sizes = Array.isArray(p.size)
          ? p.size.map((s) => s.value)
          : [p.ukuran];
        return sizes.some((v) => v === filters.ukuran);
      });
    }

    if (filters.tipe) {
      result = result.filter((p) => {
        const tipe = p.tipe || p.type || p.category;
        return tipe === filters.tipe;
      });
    }

    if (filters.diskon === "with") {
      result = result.filter((p) => p.discount && p.discount > 0);
    } else if (filters.diskon === "without") {
      result = result.filter((p) => !p.discount || p.discount === 0);
    }

    return result;
  }, [items, needleTokens, filters]);

  const handleLike = (item, e) => {
    e?.stopPropagation?.();
    const rawId = item?.id ?? item?._id;
    if (!rawId) return;
    const snapshot = {
      id: rawId,
      name: item?.name ?? item?.title ?? "",
      Image: item?.Image ?? item?.image ?? item?.images?.[0] ?? "",
      price: item?.current_price ?? item?.price ?? item?.harga ?? null,
      tipe: item?.tipe || item?.type || item?.category || "",
    };
    if (isFavorite(rawId)) removeFavorite(rawId);
    else addFavorite(snapshot);
  };

  const handleProductClick = (item) => {
    navigate(`/product/${item?.id ?? item?._id}`, { state: item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <div className="p-8">Loading produk...</div>;
  if (error)
    return <div className="p-8 text-red-600">Error: {String(error)}</div>;

  const filtersData = [
    {
      key: "harga",
      label: "HARGA",
      options: [
        { label: "Di bawah 500rb", value: "under500" },
        { label: "500rb - 1jt", value: "500to1jt" },
        { label: "Di atas 1jt", value: "over1jt" },
      ],
    },
    {
      key: "ukuran",
      label: "UKURAN",
      options: ukuranOptions.map((u) => ({ label: u, value: u })),
    },
    {
      key: "tipe",
      label: "TIPE",
      options: tipeOptions.map((t) => ({ label: t, value: t })),
    },
    {
      key: "diskon",
      label: "DISKON",
      options: [
        { label: "Ada Diskon", value: "with" },
        { label: "Tanpa Diskon", value: "without" },
      ],
    },
  ];

  const getLabelByValue = (key, value) => {
    const filter = filtersData.find((f) => f.key === key);
    const opt = filter?.options.find((o) => o.value === value);
    return opt?.label || "";
  };

  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-10 bg-gradient-to-b from-white to-gray-50 min-h-[60vh]">
        <div className="max-w-[1200px] mx-auto">
          <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
              {desiredRawLabel ? `${desiredRawLabel}` : "Semua Produk"}
            </h2>
            <div
                                onClick={() => navigate(-1)}
                                className="lg:flex items-center hidden  gap-1.5 hover:bg-black hover:text-white h-5"
                              >
                                <IoIosArrowRoundBack size={30} strokeWidth={2} />
                                <h1 className="text-[12px] tracking-widest underline cursor-pointer font-semibold">
                                  KEMBALI
                                </h1>
                              </div>
          </header>

          {/* === FILTER BAR === */}
          <section className="mb-6 bg-white border border-gray-300 p-4 shadow-sm">
            <div className="flex flex-wrap gap-4 relative">
              {filtersData.map((filter) => (
                <div key={filter.key} className="relative">
                  <button
                    onClick={() => toggleFilter(filter.key)}
                    className={`border border-gray-400 px-4 py-2 text-sm font-medium text-gray-800 flex items-center gap-1 uppercase transition ${
                      openFilter === filter.key ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    {filter.label}
                    {openFilter === filter.key ? (
                      <MdKeyboardArrowUp size={18} />
                    ) : (
                      <MdKeyboardArrowDown size={18} />
                    )}
                  </button>

                  {openFilter === filter.key && (
                    <div className="absolute left-0 mt-1 w-64 bg-white border border-gray-300 shadow-md z-20 p-3 max-h-72 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-2">
                        {filter.options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() =>
                              handleFilterChange(filter.key, opt.value)
                            }
                            className="border border-gray-400 text-sm text-gray-700 px-2 py-1 w-full hover:bg-gray-100 transition"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* === filter aktif === */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {Object.entries(filters)
                .filter(([_, v]) => v)
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center bg-gray-100 border border-gray-300 text-gray-700 text-sm px-2 py-1"
                  >
                    <span>{getLabelByValue(key, value)}</span>
                    <button
                      className="ml-2 text-gray-500 hover:text-black"
                      onClick={() => handleRemoveFilter(key)}
                    >
                      <IoClose size={14} />
                    </button>
                  </div>
                ))}

              {Object.values(filters).some((v) => v) && (
                <button
                  className="text-sm text-blue-600 hover:underline ml-2"
                  onClick={handleClearAll}
                >
                  Hapus Semua
                </button>
              )}
            </div>
          </section>

          {/* === PRODUK === */}
          {filtered.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              <p className="text-base sm:text-lg">
                Tidak ada produk untuk kategori ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((item) => {
                const id = item?.id ?? item?._id;
                const liked = isFavorite(id);
                const img =
                  item?.Image ||
                  item?.image ||
                  item?.thumbnail ||
                  item?.images?.[0] ||
                  "";
                const title =
                  item?.name ||
                  item?.title ||
                  item?.nama ||
                  "Produk tanpa nama";
                const price = item?.price || item?.Price || item?.harga;

                return (
                  <div
                    key={id ?? title}
                    className="flex flex-col justify-between relative group border rounded-xl overflow-hidden bg-white hover:shadow-md hover:-translate-y-[1px] transition-all duration-200 cursor-pointer"
                    onClick={() => handleProductClick(item)}
                  >
                    <button
                      onClick={(e) => handleLike(item, e)}
                      className="absolute top-3 right-3 bg-white/80 p-1.5 rounded-full shadow-sm hover:bg-white transition"
                    >
                      <svg
                        className={`w-5 h-5 ${
                          liked ? "text-black" : "text-white"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        stroke="black"
                        viewBox="0 0 24 24"
                      >
                        <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
                      </svg>
                    </button>

                    <div className={`w-full h-44 sm:h-48 md:h-52 flex items-center justify-center overflow-hidden bg-[${filtered.warna}]`}>
                      {img ? (
                        <img
                          src={img}
                          alt={title}
                          className="object-contain w-full h-full"
                        />
                      ) : (
                        <div className="text-xs text-gray-400">No image</div>
                      )}
                    </div>

                    <div className="p-3 sm:p-4">
                      <h3 className="text-xs font-thin">{item.tipe}</h3>
                      <div className="text-sm sm:text-base font-medium text-gray-800 line-clamp-1">
                        {title}
                      </div>
                      {price != null && (
                        <div className="text-sm sm:text-[15px] text-black font-semibold mt-1 ">
                          {/* diskon */}
                          {price != null && (
                            <div className="text-sm sm:text-[15px] text-black font-semibold mt-1">
                              {item.discount && item.discount > 0 ? (
                                <div>
                                  <p className="text-red-600 text-xs font-bold mb-1">
                                    Diskon {formatToIDR(item.discount)}
                                  </p>
                                  <p className="text-gray-400 line-through text-xs">
                                    {formatToIDR(price)}
                                  </p>
                                  <p className="text-black font-bold">
                                    {formatToIDR(price - item.discount)}
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-black">
                                    {formatToIDR(price)}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Category;
