import { useState } from "react";
import { useFetch } from "../../../hooks/useFetch";


export function Section() {
  const [liked, setLiked] = useState([]);

  const handleClick = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const { data, loading, error } = useFetch("/");
  if (loading) return <p>loading</p>;
  if (error) return <p>Error: {error}</p>;
  console.log(data);

  return (
    <>
      <div className="px-24 flex flex-col gap-8 overflow-hidden">
        <div className="flex justify-between">
          <h1 className="text-xl">New And Best Product from our store</h1>
          <button className="border rounded-lg px-4 py-1 hover:bg-zinc-100 duration-300 ease-in-out">
            <a href="#" className="font-bold text-md text-gray-700">Shop Now</a>
          </button>
        </div>
        {/* produk */}
        <div className="flex overflow-x-auto scrollbar-hide">
          {(Array.isArray(data) ? data : []).slice(0, 6).map(item => {
            return (
              <a
                href="#"
                key={item.id}
                className="mx-4 flex-shrink-0 flex flex-1/5 flex-col gap-4 cursor-pointer w-52 border-transparent border hover:border-gray-700 hover:border"
              >
                <div className="relative">
                  {/* svg button hati */}
                  <button aria-pressed={liked.includes(item.id)} onClick={(e) => handleClick(item.id, e)} className="absolute right-2 top-2">
                    <svg
                      className={`w-[27px] h-[27px] dark:text-whiten hover:text-red-500 cursor-pointer stroke-1 hover:stroke-red-500 active:text-red-700 ${liked.includes(item.id) ? "text-red-500 stroke-none" : "text-white stroke-zinc-800"}`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
                    </svg>
                  </button>
                  <div className={`h-56 w-52 bg-[${item.warna}]`}>
                    <img
                      src={item.Image}
                      alt="img"
                      className={`object-cover w-full h-full`} />
                  </div>
                </div>
                <div className="p-2 text-sm">
                  <h1 className="text-gray-500">{item.tipe}</h1>
                  <p className="mt-2 text-zinc-700 truncate w-full">{item.name}</p>
                  <h1 className="block ">Rp.{item.price}</h1>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Section;