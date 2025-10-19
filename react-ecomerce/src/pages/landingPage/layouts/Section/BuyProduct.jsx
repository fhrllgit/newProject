import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer"
import { useFetch } from "../../../../hooks/useFetch";
import { HiArrowUturnLeft } from "react-icons/hi2";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CgRuler } from "react-icons/cg";
import Button from "../fixtures/Button";
import { LiaHeart } from "react-icons/lia";
import { TbTruckDelivery } from "react-icons/tb";
import { Element, Link } from "react-scroll";
import ProductSection from "../../../../hooks/useProduct";

export default function BuyProduct() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initial = location.state ?? null;
  const { data, loading, error } = useFetch(id ? `/products/product/${id}` : null);
  const fetchedProduct = data ? (Array.isArray(data) ? data[0] ?? null : data) : null;
  const product = initial ?? fetchedProduct;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selected, setSelected] = useState("Pilih ukuran");
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState([]); // akan diisi dari product.size

  // reset selectedIndex saat product (atau gambarnya) berganti
  useEffect(() => {
    setSelectedIndex(0);
  }, [product?.Image, product?.detail_images]);

  // isi size ketika product ter-load (safety)
  useEffect(() => {
    setSize(Array.isArray(product?.size) ? product.size : []);
    setSelected("Pilih ukuran");
  }, [product]);
  // early returns tetap boleh di sini karena semua Hooks sudah dideklarasikan di atas
  if (loading && !product) return <div className="p-6">Loading...</div>;
  if (error && !product) return <div className="p-6 text-red-600">Error: {String(error)}</div>;
  if (!product) return <div className="p-6">Product not found</div>;

  const images = Array.isArray(product.detail_images)
  ? product.detail_images.filter(img => img && img !== product.Image)
  : [];


  const formatToIDR = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div>
      <Navbar />
      <main className="flex pt-20">
      {/* main section */}
      <section
        className={`pt-96 relative flex-2/3 h-screen flex flex-col justify-center items-center bg-[${product.warna}]`}
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-2 z-20 flex items-center gap-2 px-2 py-1 border rounded"
        >
          <HiArrowUturnLeft className="w-5 h-5" />
          Kembali
        </button>

        <div className="relative w-[400px] min-h-[450px] overflow-hidden group">
          {/* MAIN IMAGE (ubah sesuai selectedIndex) */}
          <img
            src={images[selectedIndex] ?? ""}
            alt={product?.name ?? "product"}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* THUMBNAILS */}
          <section className="absolute z-10 bottom-0 left-1/2 -translate-x-1/2 flex gap-4 overflow-hidden group">
            {images.map((imgSrc, i) => (
              <button
                key={i}
                type="button"
                onMouseOver={() => setCardDisplay(false)}
                onClick={() => setSelectedIndex(i)}
                className={`w-8 overflow-hidden border h-[1px] group-hover:h-8 duration-300
                ${i === selectedIndex ? "border-b-4" : "opacity-80 hover:opacity-100"}
                `}
              >
                <img src={imgSrc} alt={`thumb-${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </section>
        </div>

        <div className="mt-8">
          <div className="sticky z-10 top-10 flex gap-4 text-sm cursor-pointer">
            <Link 
            to="galeri"
            className="hover:underline"
            >GALERI</Link>
            <Link 
            to="deskripsi"
            className="hover:underline"
            >DESKRIPSI</Link>
            <Link 
            to="detail"
            className="hover:underline"
            >DETAIL</Link>
          </div>
        </div>
        <Element 
        name="galeri"
        className="relative w-full px-8 mt-8"
        >
          <section className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <h2 className="text-sm italic">{product.point}</h2>
            <p className="text-sm">{product.description}</p>
          </section>
        </Element>
        <Element 
        name="deksripsi"
        className="relative w-full px-8 mt-8"
        >
          <section className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">SPESIFIKASI</h1>
            {Array.isArray(product.specifications) && product.specifications.length > 0 && (
              <ul className="list-disc list-inside space-y-1 text-sm flex flex-col flex-3 gap-4">
                {product.specifications.map((sp, idx) => (
                  <li 
                  key={idx}
                  className="text-sm text-gray-700"
                  >
                    {sp}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </Element>
      </section>

      {/* side section */}
      <section className="border-l relative border-gray-300 flex flex-col flex-1/3 px-4 py-6 gap-4">
        <h2 className="mb-2 text-sm text-gray-600">{product.tipe}</h2>
        <h1 className="text-4xl">{product.name}</h1>
        <div className="flex flex-col gap-4">
          <h2 className="text-gray-600">{product.variasi}</h2>
          <h1>
            {formatToIDR(product.price)}
            {product.discount ? <span className="ml-3 text-sm text-red-500">- Rp {product.discount}</span> : null}
          </h1>
        </div>

        <div>
          <p className="text-sm text-gray-800 tracking-wider font-bold mb-4">pilih size</p>
          <button
            onClick={() => setOpen(!open)}
            className="w-[120px] border px-3 py-2 flex justify-between items-center text-sm font-medium"
          >
            {selected}
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {open && (
            <div className="w-[120px] absolute mt-1 border bg-white shadow max-h-40 overflow-y-auto z-10">
              {size.map((item, i) => (
                <div
                  key={item.value ?? i}
                  onClick={() => {
                    setSelected(String(item.value));
                    setOpen(false);
                  }}
                  className="px-3 py-2 border-b border-gray-300 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {item.value} {item.stock !== undefined ? `(${item.stock})` : null}
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 group">
            <button className="flex items-center gap-2 group-hover:text-white group-hover:bg-black px-2">
              <CgRuler />
              <span className="text-xs underline font-bold">PANDUAN UKURAN</span>
            </button>
          </div>
          <div className="mt-4 flex w-full h-12 gap-4">
            <span className="w-[80%] text-md tracking-wider text-nowrap bg-black group">
              <Button
              title={"Tambahkan ke keranjang"}
              />
            </span>
            <button className="p-4 flex justify-center items-center border ">
              <LiaHeart size={22}/>
            </button>
          </div>
          <div className="text-gray-700">
            <div className="mt-4 text-xs flex items-center gap-2">
              <TbTruckDelivery size={20} />
              <span>
                <button className="underline cursor-pointer hover:text-black">Learn More</button>
                <p>Gratis Ongkir</p>
              </span>
            </div>
            <div className="mt-4 text-xs flex items-center gap-2">
              <TbTruckDelivery size={20} />
              <span>
                <button className="underline cursor-pointer hover:text-black">Learn More</button>
                <p>refund dengan mudah</p>
              </span>
            </div>
          </div>
        </div>
        </section>
      </main>
      <div className="relative mt-96 pt-8">
        <ProductSection
          endpoint="/products/product"
          filterFn={(item) => String(item.category).toLowerCase() === "pria"}
          onItemClick={(item) => navigate(`/product/${item.id}`, { state: item })}
        />
        <Footer />
      </div>
    </div>
  );
}