import { useEffect, useRef, useState } from "react";
import Hots from "./Section/Hots";

const ForYou = () => {

  const [currentIndex, setCurrentIndex] = useState(0)
  const scrolRef = useRef(null)

  const cards = [
    {
      id: 1,
      image: "../../src/assets/img/hero.jpeg",
      title: "Service 1",
      judul: "A FOTOGRAFER TEAM 1",
      description: "Fotografer Terbaik Di Kudus Preweed",
      point: "Lorem ipsum dolor sit amet"
    },
    {
      id: 2,
      image: "../../src/assets/img/hero.jpeg",
      title: "Service 2", 
       judul: "A FOTOGRAFER TEAM 2",
      description: "Fotografer Terbaik Di Kudus Wedding",
      point: "Lorem ipsum dolor sit amet"
    },
    {
      id: 3,
      image: "../../src/assets/img/hero.jpeg",
      title: "Service 3",
       judul: "A FOTOGRAFER TEAM 3",
      description: "Fotografer Terbaik Di Kudus Portrait",
      point: "Lorem ipsum dolor sit amet"
    },
    {
      id: 4,
      image: "../../src/assets/img/hero.jpeg",
      title: "Service 4",
      judul: "A FOTOGRAFER TEAM 4",
      description: "Fotografer Terbaik Di Kudus Event",
      point: "Lorem ipsum dolor sit amet"
    },
    {
      id: 5,
      image: "../../src/assets/img/hero.jpeg",
      title: "Service 5",
      judul: "A FOTOGRAFER TEAM 5",
      description: "Fotografer Terbaik Di Kudus Commercial",
      point: "Lorem ipsum dolor sit amet"
    }
  ];
  useEffect(() => {
    const intervaled = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % cards.length;
        return nextIndex
      })
    }, 3000);
    return () => clearInterval(intervaled);
  }, [cards.length]) 
  useEffect(() => {
    if (scrolRef.current) {
      // Ambil card pertama
      const cardEl = scrolRef.current.querySelector('.card');
      if (cardEl) {
        const cardWidth = cardEl.offsetWidth;
        const scrollPosition = currentIndex * (cardWidth + 12);
        scrolRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);
const goToSlide = (index) => {
    setCurrentIndex(index);
  };
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1
    );
  };
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % cards.length
    );
  };
  return (
    <>
      <div className="flex flex-col">
        <div id="Service" className="w-full h-screen mt-16 px-14 py-8 bg-gray-50">
          <h1 className="font-semibold text-2xl  text-center text-black mb-3 tracking-[0.3em]">
            SERVICE
          </h1>
          <div className="flex items-center justify-center h-full relative">
            <button 
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div 
              ref={scrolRef}
              className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-4 pb-4 ">
                {cards.map((card, index) => (
                  <div
                    key={card.id}
                    className={`card flex w-full border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white flex-shrink-0 transition-all duration-300 ${
                      index === currentIndex ? ' shadow-xl' : ''
                    }`}
                    style={{ minWidth: '1000px', height: '600px' }}
                  >
                    <div className="flex-1">
                      <img
                        className="w-full h-full object-cover"
                        src={card.image}
                        alt={card.title}
                      />
                    </div>
                    <div className="flex-1 flex items-center justify-center flex-col p-6 space-y-2">
                      <p className="text-center text-sm tracking-[0.2em] leading-relaxed">
                        {card.judul}
                      </p>
                      <p className="text-black font-semibold text-2xl text-center leading-relaxed">
                        {card.description}
                      </p>
                      <p className="text-black text-xs text-center leading-relaxed">
                        {card.point}
                      </p>
                      <button className="py-2 border text-md font-light px-10 tracking-tighter cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                        BUY NOW
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
            <div>
              <div className="flex justify-center space-x-2 mt-12">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 
                    ${
                    index === currentIndex 
                      ? 'bg-blue-500 scale-110' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-4 mx-auto max-w-xs">
              <div 
                className="bg-blue-500 h-1 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

{/* Hots */}
      <Hots />
    </>
  );
};

export default ForYou;