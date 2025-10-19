import { LuArrowRightFromLine } from "react-icons/lu";1

function Footer() {
  const datas = [
    {
      title: "TAWAKAL adalah merek fashion yang mengutamakan kenyamanan dan gaya",
      description: "Selamat datang di situs resmi TAWAKAL shop, kami percaya bahwa pakaian yang nyaman adalah kunci untuk tampil percaya diri. Dengan desain yang modern dan bahan berkualitas tinggi, produk kami dirancang untuk memenuhi kebutuhan gaya hidup aktif Anda. Bergabunglah dengan komunitas kami dan rasakan perbedaannya!"
    },
    {
      title: "Bergaya dan nyaman dengan proiduk kami dengan kualitas terbaik",
      description: "Temukan berbagai produk fashion terkini dengan kualitas terbaik di toko kami. Dari pakaian kasual hingga formal, kami menyediakan pilihan yang sesuai dengan gaya Anda. Belanja sekarang dan nikmati penawaran eksklusif!"
    }
  ]
  return (
    <>
      <div className="mt-40 bg-gray-200">
        <div className="px-20 py-14 flex gap-8">
          {datas.map((item, index) => {
            return (
              <div 
              key={index}
              className="flex-1/2 flex flex-col gap-4 text-sm"
              >
                <h1 className="font-bold">{item.title}</h1>
                <p>{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className="h-52 w-full bg-black text-white px-40 py-14 flex justify-center items-center">
        <div className="flex flex-1/2">
          <h1 className="font-bold text-2xl">DAFTAR SEKARANG DAN BELANJA SESUKA HATI ANDA</h1>
        </div>
        <div className="flex flex-1/2 justify-center">
          <a 
          href=""
          className="bg-white hover:bg-gray-300 shadow shadow-white text-black px-20 py-4 flex items-center gap-2 group"
          >
            <span>LOGIN SEKARANG</span>
            <span className=" relative overflow-hidden">
              <LuArrowRightFromLine className="block text-xl translate-x-0 group-hover:translate-x-full duration-300"/>
              <LuArrowRightFromLine className="absolute text-xl inset-0 -translate-x-full group-hover:translate-x-0 duration-300"/>
            </span>
          </a>
        </div>
      </div>
    </>
  )
}

export default Footer