const data = [
  {
    id: 1,
    title: "Wisuda",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet, id.",
    img: "../../src/assets/img/wisuda.jpg"
  }, 
  {
    id: 2,
    title: "wedding",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet, id.",
    img: "../../src/assets/img/prewed.jpg"
  },
  {
    id: 3,
    title: "product",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet, id.",
    img: "../../src/assets/img/product.jpg"
  },
  {
    id: 4,
    title: "event",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet, id.",
    img: "../../src/assets/img/event.jpg"
  },
]

function About() {
  return (
    <>
      <div className="w-full h-screen flex flex-col justify-center items-center gap-14 px-14 py-20">
        <h1 className="font-bold text-2xl">About</h1>
        <div className="w-full flex justify-center gap-20 lg:gap-28 xl:gap-36">
          {data.map((item) => {
            return (
              <div key={item.id} className="flex-1/4 h-[450px]">
                <div className="h-[280px] lg:h-[320px] xl:h-[380px] relative group">
                  <img 
                  src={item.img} 
                  alt={item.title} 
                  className="h-full object-cover border-8 border-zinc-800 group-hover:border-gray-200 group-hover:border-8 shadow-[4px_4px_12px_grey] group-hover:shadow-[-4px_4px_12px_grey] duration-500"/>
                  <div className="absolute inset-0 group-hover:top-0 w-full h-full flex justify-center items-center">
                    <a 
                    href="#" 
                    className="text-xl bg-white px-4 py-2 opacity-0 group-hover:opacity-100 hover:opacity-70 duration-500">
                      learn more
                    </a>
                  </div>
                </div>
                <div className="py-2 text-gray-900">
                  <h1 className="font-medium text-xl">{item.title}</h1>
                  <p>{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default About


