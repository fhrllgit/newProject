import { useEffect, useRef, useState } from "react";
import Hots from "./Section/Hots";
import heroImg from "../../../assets/img/hero.png";
import adds1 from "../../../assets/img/adds1.png"
import adds2 from "../../../assets/img/adds2.png"
import adds3 from "../../../assets/img/adds3.png"

const ForYou = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrolRef = useRef(null);

  const cards = [
    {
      id: 1,
      image: heroImg,
      title: "Service 1",
      judul: "Belanja lewat FSDR",
      description: "Mudah Hemat dan Terpercaya",
      point: "belanja dengan satu klik saja",
    },
    {
      id: 2,
      image: adds1,
      title: "Service 2",
      judul: "FSDR, Solusi Belanja Cerdas",
      description: "Dapatkan produk terbaik tanpa ribet",
      point: "Harga bersahabat, kualitas terjamin",
    },
    {
      id: 3,
      image: adds2,
      title: "Service 3",
      judul: "Nikmati Belanja Modern di FSDR",
      description: "Cepat, aman, dan tanpa batas",
      point: "Dari kebutuhan harian hingga gaya hidup",
    },
    {
      id: 4,
      image: adds3,
      title: "Service 4",
      judul: "Saatnya Pindah ke FSDR",
      description: "Platform jual beli masa kini",
      point: "Temukan barang favoritmu dengan harga terbaik",
    }
  ];

  useEffect(() => {
    const intervaled = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 3000);
    return () => clearInterval(intervaled);
  }, [cards.length]);

  useEffect(() => {
    const el = scrolRef.current;
    if (!el) return;
    const cardEl = el.querySelector(".card");
    if (!cardEl) return;
    const cardWidth = cardEl.offsetWidth + 12;
    el.scrollTo({ left: currentIndex * cardWidth, behavior: "smooth" });
  }, [currentIndex]);

  const goToSlide = (index) => setCurrentIndex(index);
  const goToPrevious = () =>
    setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % cards.length);

  return (
    <>
      <section className="flex flex-col">
        <div
          id="Service"
          className="w-full min-h-screen mt-16 px-4 sm:px-8 lg:px-14 py-8 relative"
        >
          {/* Tombol Navigasi */}
          <button
            onClick={goToPrevious}
            className="absolute shadow-lg shadow-gray-300 left-2 sm:left-4 lg:left-20 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-gray-100 p-2 sm:p-3 rounded transition"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute shadow-lg shadow-gray-300 right-2 sm:right-4 lg:right-20 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-gray-100 p-2 sm:p-3 rounded transition"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Carousel */}
          <div
            ref={scrolRef}
            className="w-full overflow-x-auto scroll-smooth scrollbar-hide"
          >
            <div className="flex gap-4 pb-4">
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  className={`card flex flex-col sm:flex-row w-full min-w-[90%] sm:min-w-[600px] md:min-w-[800px] lg:min-w-[1000px] h-auto sm:h-[500px] md:h-[600px] rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 ${
                    index === currentIndex ? "scale-[1.01]" : ""
                  }`}
                >
                  <div className="flex-1 w-full sm:w-1/2">
                    <img
                      className="w-full h-64 sm:h-full object-cover"
                      src={card.image}
                      alt={card.title}
                    />
                  </div>
                  <div className="flex-1 flex items-center justify-center flex-col p-4 sm:p-6 space-y-3 text-center">
                    <p className="text-xs sm:text-sm tracking-[0.15em]">
                      {card.judul}
                    </p>
                    <p className="text-lg sm:text-2xl font-semibold">
                      {card.description}
                    </p>
                    <p className="text-xs sm:text-sm">{card.point}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicator */}
          <div className="flex flex-col items-center mt-6 sm:mt-10">
            <div className="flex justify-center space-x-2">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? "bg-black scale-110"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Hots />
    </>
  );
};

export default ForYou;
