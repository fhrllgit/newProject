import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Apakah saya perlu melakukan registrasi untuk membeli produk di FSDR?",
    answer: "Ya, Anda perlu mendaftar akun agar dapat melakukan pemesanan di FSDR. Dengan akun, Anda juga bisa melihat riwayat pesanan dan menyimpan alamat pengiriman.",
  },
  {
    question: "Bagaimana jika saya lupa kata sandi?",
    answer: "Jika lupa kata sandi, klik Login lalu pilih link Lupa kata sandi. Kami akan mengirimkan email untuk mereset kata sandi Anda.",
  },
  {
    question: "Bagaimana cara menemukan produk yang saya inginkan?",
    answer: "Gunakan fitur pencarian di bagian atas halaman. Masukkan kata kunci atau nomor produk, lalu tekan ikon kaca pembesar. Gunakan filter kategori untuk hasil lebih spesifik.",
  },
  {
    question: "Kenapa FSDR tidak menjual semua produk yang diproduksi?",
    answer: "Kami menawarkan produk terbaru dan eksklusif untuk pasar Indonesia. Tidak semua produk tersedia karena keterbatasan stok dan jenis produk.",
  },
  {
    question: "Kenapa pesanan saya dibatalkan?",
    answer: "Pesanan bisa dibatalkan karena stok habis, masalah pembayaran, atau alamat pengiriman tidak valid. Uang akan dikembalikan dalam 14 hari kerja.",
  },
  {
    question: "Apakah saya dapat mengubah atau membatalkan pesanan?",
    answer: "Pesanan yang sudah diproses tidak bisa diubah atau dibatalkan. Jika sudah menerima pesanan, Anda bisa melakukan retur sesuai Kebijakan Retur FSDR.",
  },
  {
    question: "Bagaimana cara menambahkan atau mengubah produk di bag saya?",
    answer: "Pilih ukuran dan warna produk dari halaman produk, klik Tambah ke Bag. Di halaman Bag, bisa edit jumlah/ukuran atau hapus produk.",
  },
  {
    question: "Apakah saya bisa menukar produk?",
    answer: "Tidak bisa menukar langsung. Lakukan retur lalu pesan ulang produk baru.",
  },
  {
    question: "Bagaimana cara memilih ukuran yang pas?",
    answer: "Setiap produk memiliki bagan ukuran yang bisa diklik di halaman produk, tepat di samping opsi 'Pilih Ukuran'.",
  },
  {
    question: "Bagaimana cara melakukan checkout?",
    answer: "Masuk atau checkout sebagai guest, isi alamat pengiriman dan penagihan, pilih metode pembayaran, lalu konfirmasi pesanan.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="h-screen overflow-y-auto bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pertanyaan yang Sering Diajukan
          </h1>
          <p className="text-[#343434] font-light">
            Panduan lengkap berbelanja di FSDR
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-2xl b overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full text-left px-5 py-4 flex justify-between items-start gap-3 bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-md text-[#505050] tracking-tight leading-snug">
                  {faq.question}
                </span>
                <span className="flex-shrink-0 mt-0.5">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-600" />
                  )}
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-5 pb-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 text-sm leading-relaxed pt-3">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-center">
            Butuh bantuan lebih lanjut?{" "}
            <a href="#" className="text-gray-900 font-medium underline">
              Hubungi customer service
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}