function Hero() {
  return (
    <>
      <div
        id="Hero"
        className="flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-8 px-4 sm:px-8 lg:px-14 bg-[#e4e2e6]"
        >
        <div className="pb-4 w-full flex flex-col md:flex-row justify-center items-center gap-6 lg:gap-8">
          {/* gambar */}
          <div className="flex flex-1 justify-center lg:justify-end max-w-md lg:w-1/2">
            <img
              src="../../src/assets/img/hero.png"
              alt="hero"
              className="w-3/4 sm:w-2/3 lg:w-full max-w-md lg:max-w-xl object-contain h-auto"
            />
          </div>
          {/* Teks */}
          <div className="flex flex-1 flex-col items-center lg:items-start justify-center gap-6 text-center lg:text-left max-w-lg px-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              HAPPY BELANJA
            </h1>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
              libero quidem et nostrum ipsum sequi tempora recusandae?
              Quibusdam, eaque ad?
            </p>
            <button className="border rounded-lg px-4 py-2 bg-black hover:bg-zinc-700 transition duration-300 ease-in-out">
              <a
                href="#"
                className="font-bold text-sm sm:text-base text-gray-200"
              >
                Shop Now
              </a>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
