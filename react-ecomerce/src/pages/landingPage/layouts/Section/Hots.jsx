import { useFetch } from "../../../../hooks/useFetch"
import { IoIosArrowRoundForward } from "react-icons/io";

import pria from "../../../../assets/img/pria.png"
import wanita from "../../../../assets/img/wanita.png"
import anak from "../../../../assets/img/anak.png"

function Hots() {

  const cards = [
    {
      id: 1,
      image: pria,
      name: "pria"
    },
    {
      id: 2,
      image: wanita,
      name: "wanita"
    },
    {
      id: 3,
      image: anak,
      name: "anak"
    }
  ]

  const {data, loading, error} = useFetch("/")

  if (loading) return <p>loading</p>;
  if (error) return <p>Error: {error}</p>;
  const items = Array.isArray(data) ? data : [];

  const productTotal = data.map(p => {
    const totalStock = p.size.reduce((sum, s) => sum + s.stock, 0);
    return { ...p, totalStock };
  });
  const minStock = Math.min(...productTotal.map(p => p.totalStock));
  const sorted = [...productTotal].sort((a, b) => a.totalStock - b.totalStock);


  
  return (
    <>
      <div className="mt-28 px-16 py-4 w-screen h-screen overflow-hidden">
        <div>
          <h1 className="font-bold text-2xl">WHAT'S HOT</h1>
        </div>
        <div className="flex overflow-x-auto scrollbar-hide gap-4">
          {sorted.slice(0,4).map((i) => {
            return (
              <div key={i.id} className="flex-shrink-0 w-64 text-sm flex flex-col justify-between">
                <img src={i.Image} alt="img" className="w-full h-72 object-cover"/>
                <div>
                  <p className="mt-4 font-bold">{i.category}</p>
                  <p className="">{i.point}</p>
                </div>
                <a href="" className="underline text-md font-bold tracking-wider">Beli sekarang</a>
              </div>
              
            )
          })}
        </div>
      </div>
      {/* genre categori */}
      <div className="px-14">
        <div className="flex gap-4 h-96">
          {cards.map((card) => {
            return (
              <div
              key={card.id}
              className="flex-1/3 relative">
                <img 
                src={card.image} 
                alt={card.name} 
                className="object-cover w-full h-full"
                />
                <figcaption className="group absolute bottom-12 left-1/2 -translate-x-1/2 bg-gray-950 text-white px-4 py-2">
                  <a 
                  href=""
                  className="flex flex-wrap items-center tracking-wider group-hover:bg-black group-hover:text-gray-400 duration-300"
                  >{card.name}<IoIosArrowRoundForward size={33}/></a>
                </figcaption>
              </div>
            )
          })}
        </div>
      </div>
      <div className="px-14">
        <div className="flex gap-12 max-h-32">
          {[...data].sort((a,b) => b.id - a.id).slice(0, 4).map((item) => {
            return (
              <div 
              key={item.id}
              className="flex flex-col flex-1/4 justify-center items-center"
              >
                <div className="flex justify-center w-full">
                  <img 
                  src={item.Image} 
                  alt={item.name} 
                  className="w-[80%] object-cover"
                  />
                </div>
                <div className="flex justify-center">
                  <a href="" className="underline font-bold text-sm hover:bg-black hover:text-white duration-200">{item.tipe}</a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Hots