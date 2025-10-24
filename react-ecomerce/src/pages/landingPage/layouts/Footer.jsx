import { LuArrowRightFromLine } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
1;

function Footer() {
  const navigate = useNavigate()

  const datas = [
    {
      title:
        "TAWAKAL adalah merek fashion yang mengutamakan kenyamanan dan gaya",
      description:
        "Selamat datang di situs resmi TAWAKAL shop, kami percaya bahwa pakaian yang nyaman adalah kunci untuk tampil percaya diri. Dengan desain yang modern dan bahan berkualitas tinggi, produk kami dirancang untuk memenuhi kebutuhan gaya hidup aktif Anda. Bergabunglah dengan komunitas kami dan rasakan perbedaannya!",
    },
    {
      title: "Bergaya dan nyaman dengan proiduk kami dengan kualitas terbaik",
      description:
        "Temukan berbagai produk fashion terkini dengan kualitas terbaik di toko kami. Dari pakaian kasual hingga formal, kami menyediakan pilihan yang sesuai dengan gaya Anda. Belanja sekarang dan nikmati penawaran eksklusif!",
    },
  ];
  return (
    <>
      <div className="mt-20 bg-gray-200">
        <div className="px-4 sm:px-10 md:px-20 py-10 sm:py-14 flex flex-col md:flex-row gap-6 md:gap-8">
          {datas.map((item, index) => {
            return (
              <div
                key={index}
                className="flex-1 flex flex-col gap-3 sm:gap-4 text-sm text-center md:text-left"
              >
                <h1 className="font-bold text-base sm:text-lg">{item.title}</h1>
                <p className="text-gray-700 text-sm sm:text-xs">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-auto md:h-52 w-full bg-black text-white px-6 sm:px-16 md:px-40 py-10 md:py-14 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-0 text-center md:text-left">
        <div className="flex-1">
          <h1 className="font-bold text-xl sm:text-2xl">
            DAFTAR SEKARANG DAN BELANJA SESUKA HATI ANDA
          </h1>
        </div>

        <div className="flex justify-center md:justify-end flex-1">
          <div
            onClick={() => navigate("/login")}
            className="bg-white cursor-pointer hover:bg-gray-300 shadow shadow-white text-black px-10 sm:px-16 md:px-20 py-3 sm:py-4 flex items-center gap-2 group text-sm sm:text-base"
          >
            <span>LOGIN SEKARANG</span>
            <span className="relative overflow-hidden">
              <LuArrowRightFromLine className="block text-lg sm:text-xl translate-x-0 group-hover:translate-x-full duration-300" />
              <LuArrowRightFromLine className="absolute text-lg sm:text-xl inset-0 -translate-x-full group-hover:translate-x-0 duration-300" />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
