import React, { useMemo, useRef } from "react";
import { useFetch } from "../../../../hooks/useFetch";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import pria from "../../../../assets/img/pria.png";
import wanita from "../../../../assets/img/wanita.png";
import anak from "../../../../assets/img/anak.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Hots() {
  const navigate = useNavigate();

  const cards = [
    { id: 1, image: pria, name: "pria" },
    { id: 2, image: wanita, name: "wanita" },
    { id: 3, image: anak, name: "anak" },
  ];

  const { data, loading, error } = useFetch("/products/product");

  // normalize data -> always an array so hooks order stable
  const items = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  // safe totalStock calc (guard jika size undefined)
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

  // helper: buat slug dari label (untuk url)
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

  // --- compute uniqueByType using useMemo AT TOP LEVEL (before any early return) ---
  const uniqueByType = useMemo(() => {
    // normalizer: buat string kunci yang konsisten dari tipe
    const normalize = (s) =>
      String(s ?? "")
        .trim()
        .toLowerCase()
        .replace(/[\s\-_\/]+/g, " ")
        .replace(/[^0-9a-z\s]/gi, "")
        .replace(/\s+/g, " ")
        .trim();

    const map = new Map(); // key = normalized tipe, value = first item with that tipe
    for (const it of items) {
      const raw = it?.tipe ?? it?.type ?? it?.category ?? "";
      const key = normalize(raw) || "__unknown__" + (it?.id ?? it?._id ?? Math.random());
      if (!map.has(key)) {
        map.set(key, it);
      }
    }
    // convert to array and sort by id (desc)
    const arr = Array.from(map.values()).sort((a, b) => (b.id ?? b._id) - (a.id ?? a._id));
    return arr;
  }, [items]);
  
  // scroll button
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 300;
    el.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) return <p>loading</p>;
  if (error) return <p>Error: {String(error)}</p>;

  return (
    <>
      <div className="mt-28 px-16 py-4 h-screen overflow-hidden">
        <div>
          <h1 className="font-bold text-2xl">WHAT'S HOT</h1>
        </div>
        <div className="flex justify-center overflow-x-auto scrollbar-hide gap-4">
          {sorted.slice(0, 4).map((i) => {
            const img = i?.Image || i?.image || i?.thumbnail || "";
            return (
              <div
                key={i.id ?? i._id}
                className="flex-shrink-0 w-64 text-sm flex flex-col justify-between cursor-pointer"
                onClick={() => goToProduct(i)}
              >
                <img src={img} alt="img" className="w-full h-72 object-cover" />
                <div>
                  <p className="mt-4 font-bold">{i.tipe ?? i.category}</p>
                  <p className="">{i.point}</p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToProduct(i);
                    }}
                    className="cursor-pointer underline text-md font-bold tracking-wider"
                  >
                    Beli sekarang
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* genre categori */}
      <div className="px-14">
        <div className="flex gap-4 h-96">
          {cards.map((card) => {
            return (
              <div key={card.id} className="flex-1/3 relative cursor-pointer" onClick={() => goToCategory(card.name)}>
                <img src={card.image} alt={card.name} className="object-cover w-full h-full" />
                <figcaption className="group absolute bottom-12 left-1/2 -translate-x-1/2 bg-gray-950 text-white px-4 py-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToCategory(card.name);
                    }}
                    className="flex flex-wrap items-center tracking-wider group-hover:bg-black group-hover:text-gray-400 duration-300"
                  >
                    {card.name}
                    <IoIosArrowRoundForward size={33} />
                  </button>
                </figcaption>
              </div>
            );
          })}
        </div>
      </div>

      {/* tampilkan satu item per tipe (unique types) */}
      <div className="pt-8 px-14 relative">
      {/* Tombol kiri */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-20 top-1/2 -translate-y-1/2 bg-gray-200 rounded shadow p-2 hover:bg-gray-300 z-10"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Container scroll */}
      <div
        ref={scrollRef}
        className="flex gap-12 max-h-32 overflow-x-auto scroll-smooth scrollbar-hide"
      >
        {uniqueByType.map((item) => {
          const img = item?.Image || item?.image || item?.thumbnail || "";
          const typeLabel = item?.tipe ?? item?.type ?? item?.category;
          const displayLabel = typeLabel ?? "Lihat";

          return (
            <div
              key={item.id ?? item._id}
              className="flex flex-col items-center min-w-[240px] flex-shrink-0"
            >
              <div className="w-full h-40 flex justify-center items-center overflow-hidden">
                <img
                  src={img}
                  alt={item.name}
                  className="w-32 h-32 object-contain"
                  draggable="false"
                />
              </div>
              <div className="flex justify-center mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToCategory(typeLabel);
                  }}
                  className="underline font-bold text-sm hover:bg-black hover:text-white duration-200"
                >
                  {displayLabel}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tombol kanan */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-20 top-1/2 -translate-y-1/2 bg-gray-200 rounded shadow p-2 hover:bg-gray-300 z-10"
      >
        <ChevronRight size={20} />
      </button>
    </div>
    </>
  );
}

export default Hots;