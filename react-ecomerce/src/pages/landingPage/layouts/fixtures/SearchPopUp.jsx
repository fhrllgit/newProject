import { useEffect, useState } from "react";
import data from '../../../../assets/App/App';

function SearchPopUp({ show }) {
  const [startIdx, setStartIdx] = useState(0);
  const itemsPerPage = 4;
  const maxIdx = data.length - itemsPerPage;

  // Reset ke awal saat popup dibuka
  useEffect(() => {
    if (show) setStartIdx(0);
  }, [show]);

  // Nonaktifkan scroll body saat popup aktif
  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => { document.body.style.overflow = ""; }
  }, [show]);

  const handlePrev = () => setStartIdx((idx) => Math.max(idx - 1, 0));
  const handleNext = () => setStartIdx((idx) => Math.min(idx + 1, maxIdx));

  return (
    <>
      {/* Overlay */}
      {show && (
        <div className="z-20 w-full h-screen fixed inset-0 bg-black/40 transition-opacity duration-300"></div>
      )}
      {/* Popup */}
      <div id='search-popup' className={`z-20 px-14 w-full fixed left-1/2 -translate-x-1/2 bg-white shadow-lg transition-all duration-300 ${show ? "top-18 opacity-100" : "-top-32 opacity-0 pointer-events-none"}`}>
        <section className='flex flex-col'>
          <h1 className='text-zinc-500 mt-4'>Trending</h1>
          <div className='py-8 relative max-w-[770px] flex items-center group'>
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              disabled={startIdx === 0}
              className="absolute top-1/2 -translate-y-1/2 left-2 border z-10 bg-white/80 px-2 py-1 rounded-lg shadow hover:border-2 hover:bg-white disabled:opacity-40 hidden group-hover:block"
            >
              &#8592;
            </button>
            {/* Images */}
            <div className='flex gap-4 overflow-x-auto duration-500 scrollbar-hide'>
              {data.slice(startIdx, itemsPerPage + (startIdx +1)).map((item) => (
                <a
                  key={item.id + '-' + startIdx}
                  href="#"
                  className="w-36 h-52 flex-shrink-0"
                >
                  <img src={item.img} alt='img' className='object-cover h-full w-full'/>
                  <div className="w-full h-full bg-black/40"> <span>learn more</span></div>
                </a>
              ))}
            </div>
            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={startIdx >= maxIdx}
              className="absolute top-1/2 -translate-y-1/2 right-2 border z-10 bg-white/80 px-2 py-1 rounded-lg shadow hover:border-2 hover:bg-white disabled:opacity-40 hidden group-hover:block"
            >
              &#8594;
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

export default SearchPopUp;