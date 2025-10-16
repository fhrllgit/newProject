import { useEffect, useRef, useState } from "react";

const HorizontalScrollCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrolRef = useRef(null);

  const cards = [
    {
      id: 1,
      image: "/src/assets/img/hero.jpeg",
      title: "Service 1",
      judul: "A FOTOGRAFER TEAM 1",
      description: "Fotografer Terbaik Di Kudus Preweed",
      point: "Lorem ipsum dolor sit amet",
    },
    {
      id: 2,
      image: "/src/assets/img/hero.jpeg",
      title: "Service 2",
      judul: "A FOTOGRAFER TEAM 2",
      description: "Fotografer Terbaik Di Kudus Wedding",
      point: "Lorem ipsum dolor sit amet",
    },
    {
      id: 3,
      image: "/src/assets/img/hero.jpeg",
      title: "Service 3",
      judul: "A FOTOGRAFER TEAM 3",
      description: "Fotografer Terbaik Di Kudus Portrait",
      point: "Lorem ipsum dolor sit amet",
    },
    {
      id: 4,
      image: "/src/assets/img/hero.jpeg",
      title: "Service 4",
      judul: "A FOTOGRAFER TEAM 4",
      description: "Fotografer Terbaik Di Kudus Event",
      point: "Lorem ipsum dolor sit amet",
    },
    {
      id: 5,
      image: "/src/assets/img/hero.jpeg",
      title: "Service 5",
      judul: "A FOTOGRAFER TEAM 5",
      description: "Fotografer Terbaik Di Kudus Commercial",
      point: "Lorem ipsum dolor sit amet",
    },
  ];

  // autoplay
  useEffect(() => {
    const intervaled = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 3000);
    return () => clearInterval(intervaled);
  }, [cards.length]);

  useEffect(() => {
    if (scrolRef.current) {
      const containerWidth = scrolRef.current.offsetWidth;
      scrolRef.current.scrollTo({
        left: currentIndex * containerWidth,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  const goToSlide = (i) => setCurrentIndex(i);
  const goToPrevious = () =>
    setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % cards.length);

  return (
    <div className="w-full h-screen px-14 py-8 bg-gray-50 border">
      <h1 className="font-semibold text-2xl text-center mb-3 tracking-[0.3em]">
        SERVICE
      </h1>

      <div className="flex items-center justify-center h-full relative">
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            clas="size-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="size-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>

        <div ref={scrolRef} className="w-full overflow-x-hidden scroll-smooth">
          <div className="flex">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`flex-shrink-0 w-full h-[600px] flex rounded-lg bg-white shadow-lg transition-all duration-300 ${
                  index === currentIndex ? "ring-2 ring-blue-400 shadow-xl" : ""
                }`}
              >
                <div className="flex-1">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-2">
                  <p className="tracking-[0.2em] text-sm">{card.judul}</p>
                  <p className="text-black font-semibold text-2xl text-center">
                    {card.description}
                  </p>
                  <p className="text-black text-xs text-center">{card.point}</p>
                  <button className="py-2 px-10 border hover:bg-gray-50 transition">
                    BUY NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <div className="flex justify-center space-x-2 mt-6">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`w-3 h-3 rounded-full ${
              i === currentIndex ? "bg-blue-500 scale-110" : "bg-gray-300"
            } transition`}
          />
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1 mt-4 mx-auto max-w-xs">
        <div
          className="bg-blue-500 h-1 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div> */}
    </div>
  );
};

export default HorizontalScrollCards;
