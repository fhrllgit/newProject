import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { useFetch } from "../../../../hooks/useFetch";
import { HiArrowUturnLeft } from "react-icons/hi2";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CgRuler } from "react-icons/cg";
import Button from "../fixtures/Button";
import { LiaHeart } from "react-icons/lia";

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
          className={`relative flex-2/3 h-screen flex justify-center items-center bg-[${product.warna}]`}
        >
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-2 z-20 flex items-center gap-2 px-2 py-1 border rounded"
          >
            <HiArrowUturnLeft className="w-5 h-5" />
            Kembali
          </button>

          <div className="relative w-[400px] h-[450px] overflow-hidden group">
            {/* MAIN IMAGE (ubah sesuai selectedIndex) */}
            <img
              src={images[selectedIndex] ?? ""}
              alt={product?.name ?? "product"}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* THUMBNAILS */}
            <div className="absolute z-10 bottom-0 left-1/2 -translate-x-1/2 flex gap-4 overflow-hidden">
              {images.map((imgSrc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  className={`w-8 h-8 overflow-hidden border ${i === selectedIndex ? "border-b-4" : "opacity-80 hover:opacity-100"}`}
                >
                  <img src={imgSrc} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 flex gap-4">
            <h1 className="">GALERI</h1>
            <h1>DESKRIPSI</h1>
            <h1>DETAIL</h1>
          </div>
        </section>

        {/* side section */}
        <section className="border-l border-gray-300 flex flex-col flex-1/3 px-4 py-6 gap-4">
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
                  <span className="text-xs underline">PANDUAN UKURAN</span>
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
          </div>

          {/* {Array.isArray(product.specifications) && (
            <ul className="mt-4 list-disc list-inside text-sm">
              {product.specifications.map((sp, i) => <li key={i}>{sp}</li>)}
            </ul>
          )} */}
        </section>
      </main>
    </div>
  );
}