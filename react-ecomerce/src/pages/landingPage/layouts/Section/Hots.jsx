import React, { useMemo, useRef } from "react";
import { useFetch } from "../../../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundForward } from "react-icons/io";
import { ChevronLeft, ChevronRight } from "lucide-react";

import pria from "../../../../assets/img/pria.png";
import wanita from "../../../../assets/img/wanita.png";
import anak from "../../../../assets/img/anak.png";
import poster from "../../../../assets/img/poster.png";

function Hots() {
  const navigate = useNavigate();

  const cards = [
    { id: 1, image: pria, name: "pria" },
    { id: 2, image: wanita, name: "wanita" },
    { id: 3, image: anak, name: "anak" },
  ];

  const { data, loading, error } = useFetch("/products/product");
  const items = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const productTotal = useMemo(() => {
    return items.map((p) => {
      const sizeArr = Array.isArray(p.size) ? p.size : [];
      const totalStock = sizeArr.reduce((sum, s) => sum + (s?.stock || 0), 0);
      return { ...p, totalStock };
    });
  }, [items]);

  const sorted = useMemo(() => {
    return [...productTotal].sort((a, b) => a.totalStock - b.totalStock);
  }, [productTotal]);

  const toSlug = (s) =>
    encodeURIComponent(
      String(s || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "")
    );

  const goToCategory = (label) => {
    if (!label) return;
    const slug = toSlug(label);
    navigate(`/category/${slug}`, { state: { label } });
  };

  const goToProduct = (item) => {
    const id = item?.id ?? item?._id;
    if (!id) return;
    navigate(`/product/${id}`, { state: item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uniqueByType = useMemo(() => {
    const normalize = (s) =>
      String(s ?? "")
        .trim()
        .toLowerCase()
        .replace(/[\s\-_\/]+/g, " ")
        .replace(/[^0-9a-z\s]/gi, "")
        .replace(/\s+/g, " ")
        .trim();

    const map = new Map();
    for (const it of items) {
      const raw = it?.tipe ?? it?.type ?? it?.category ?? "";
      const key = normalize(raw) || "__unknown__" + (it?.id ?? it?._id ?? Math.random());
      if (!map.has(key)) map.set(key, it);
    }
    const arr = Array.from(map.values()).sort((a, b) => (b.id ?? b._id) - (a.id ?? a._id));
    return arr;
  }, [items]);

  const scrollRef = useRef(null);
  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 300;
    el.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  if (loading) return <p>loading</p>;
  if (error) return <p>Error: {String(error)}</p>;

  return (
    <>
      {/* What's Hot Section */}
      <div className="mt-16 sm:mt-24 px-4 sm:px-8 lg:px-16 py-4 min-h-[60vh] overflow-hidden">
        <h1 className="font-bold text-xl sm:text-2xl mb-4">WHAT'S HOT</h1>
        <div className="flex justify-center overflow-x-auto scrollbar-hide gap-4">
          {sorted.slice(0, 4).map((i) => {
            const img = i?.Image || i?.image || i?.thumbnail || "";
            return (
              <div
                key={i.id ?? i._id}
                className="flex-shrink-0 w-48 sm:w-56 md:w-64 text-xs sm:text-sm flex flex-col justify-between cursor-pointer"
                onClick={() => goToProduct(i)}
              >
                <img src={img} alt="img" className="w-full h-56 sm:h-64 md:h-72 object-cover rounded-md" />
                <div>
                  <p className="mt-3 sm:mt-4 font-bold">{i.tipe ?? i.category}</p>
                  <p className="text-gray-600 truncate">{i.point}</p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToProduct(i);
                    }}
                    className="underline text-sm sm:text-md font-semibold tracking-wider"
                  >
                    Beli sekarang
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Section */}
      <div className="px-4 sm:px-8 lg:px-14 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-auto sm:h-80 md:h-96">
          {cards.map((card) => (
            <div
              key={card.id}
              className="relative cursor-pointer"
              onClick={() => goToCategory(card.name)}
            >
              <img src={card.image} alt={card.name} className="object-cover w-full h-64 sm:h-full rounded-md" />
              <figcaption className="group absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 bg-gray-950 text-white px-3 py-2 sm:px-4 sm:py-2 rounded">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToCategory(card.name);
                  }}
                  className="flex items-center text-sm sm:text-base tracking-wider group-hover:bg-black group-hover:text-gray-400 duration-300"
                >
                  {card.name}
                  <IoIosArrowRoundForward size={28} className="ml-1" />
                </button>
              </figcaption>
            </div>
          ))}
        </div>
      </div>

      {/* Unique Type Section */}
      <div className="pt-8 px-4 sm:px-8 lg:px-14 relative">
        <button
          onClick={() => scroll("left")}
          className="hidden sm:flex absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 bg-gray-200 rounded shadow p-2 hover:bg-gray-300 z-10"
        >
          <ChevronLeft size={20} />
        </button>

        <div ref={scrollRef} className="flex gap-6 sm:gap-12 overflow-x-auto scroll-smooth scrollbar-hide py-2">
          {uniqueByType.map((item) => {
            const img = item?.Image || item?.image || item?.thumbnail || "";
            const typeLabel = item?.tipe ?? item?.type ?? item?.category;
            const displayLabel = typeLabel ?? "Lihat";

            return (
              <div key={item.id ?? item._id} className="flex flex-col items-center min-w-[160px] sm:min-w-[200px] md:min-w-[240px] flex-shrink-0">
                <div className="w-full h-32 sm:h-40 flex justify-center items-center overflow-hidden">
                  <img src={img} alt={item.name} className="w-24 sm:w-32 h-24 sm:h-32 object-contain" draggable="false" />
                </div>
                <div className="flex justify-center mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToCategory(typeLabel);
                    }}
                    className="underline font-bold text-xs sm:text-sm hover:bg-black hover:text-white duration-200"
                  >
                    {displayLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => scroll("right")}
          className="hidden sm:flex absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 bg-gray-200 rounded shadow p-2 hover:bg-gray-300 z-10"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Poster Section */}
      <div className="px-4 sm:px-10 lg:px-20 mt-10 sm:mt-12 overflow-hidden">
        <img src={poster} alt="adds" className="w-full object-cover object-center rounded-md" />
      </div>
    </>
  );
}

export default Hots;
