function Hero() {
  return (
    <>
      <div id="Hero" className="flex justify-between gap-4 px-14">
      <div className="w-full h-full flex justify-between gap-4 pl-14 py-20">
        <div className="flex flex-1/2 flex-col items-center justify-center gap-8">
          <h1 className="text-6xl">Photography</h1>
          <p className="text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum libero quidem et nostrum ipsum sequi tempora recusandae? Quibusdam, eaque ad?</p>
          <button className="border rounded-lg px-4 py-2 hover:bg-zinc-100 duration-300 ease-in-out">
            <a href="#" className="font-bold text-md text-gray-700">Shop Now</a>
          </button>
        </div>
        <div className="flex flex-1/2">
          <img src="../../src/assets/img/hero.jpeg" alt="hero" className="w-xl object-cover"/>
        </div>
      </div>
      </div>
    </>
  )
}

export default Hero