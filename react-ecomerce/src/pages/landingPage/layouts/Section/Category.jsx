import React, { useMemo } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../../../../hooks/useFetch";
import Navbar from "../Navbar";
import Footer from "../Footer";


function Category() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { data, loading, error } = useFetch("/products/product");

  const items = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.products)) return data.products;
    if (Array.isArray(data.payload)) return data.payload;
    return [];
  }, [data]);

  const labelForSlug = (s) => {
    if (!s) return null;
    const map = {
      pria: "PRIA",
      wanita: "WANITA",
      anak: "ANAK",
      luxury: "LUXURY",
      promo: "PROMO",
    };
    return map[s.toLowerCase()] ?? s;
  };

  const desiredLabel = labelForSlug(slug || location.state?.category || location.state?.fromNav && (slug || ""));

  const getProductCategory = (p) =>
    p?.category || p?.Category || p?.jenis || p?.type || p?.kategori || null;

  const filtered = useMemo(() => {
    if (!desiredLabel) return items;
    return items.filter((p) => {
      const cat = getProductCategory(p);
      if (!cat) return false;
      // compare case-insensitive
      return String(cat).toLowerCase() === String(desiredLabel).toLowerCase();
    });
  }, [items, desiredLabel]);

  if (loading) {
    return <div className="p-8">Loading produk...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-600">Error: {String(error)}</div>;
  }

  return (
    <>
    <Navbar />
    <div className="px-8 py-20">
      <div className="max-w-[1200px] mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {desiredLabel ? `${desiredLabel}` : "Semua Produk"}
          </h2>
          <button
            className="text-sm text-gray-600 underline"
            onClick={() => navigate(-1)}
          >
            Kembali
          </button>
        </header>

        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-12">Tidak ada produk untuk kategori ini.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((item) => {
              // adapt property names (Image vs image etc.)
              const img = item?.Image || item?.image || item?.thumbnail || item?.images?.[0] || "";
              const title = item?.name || item?.title || item?.nama || "Produk tanpa nama";
              const price = item?.price || item?.Price || item?.harga;

              return (
                <div
                  key={item?.id ?? item?._id ?? title}
                  className="border p-3 rounded-md hover:shadow-md cursor-pointer"
                  onClick={() => navigate(`/product/${item?.id ?? item?._id}`, { state: item })}
                >
                  <div className={`w-full h-48 bg-[${item.warna}] flex items-center justify-center overflow-hidden mb-2`}>
                    {img ? (
                      <img src={img} alt={title} className="object-contain w-full h-full" />
                    ) : (
                      <div className="text-xs text-gray-400">No image</div>
                    )}
                  </div>
                  <div className="text-sm font-medium">{title}</div>
                  {price != null && (
                    <div className="text-sm text-gray-600">Rp {Number(price).toLocaleString("id-ID")}</div>
                  )}
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