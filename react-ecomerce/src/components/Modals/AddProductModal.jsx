import React, { useState, useEffect, useRef } from "react";
import { FiChevronsLeft, FiBell, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProductForm = () => {
  const singleImageRef = useRef(null);
  const detailImagesRef = useRef(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    category_id: "",
    name: "",
    tipe: "",
    point: "",
    variasi: "",
    warna: "",
    description: "",
    price: 0,
    discount_price: 0,
    discount_start: "",
    discount_end: "",
    img: "",
    detail_images: [],
    specifications: [],
    size: [{ type: "", value: "", stock: 0 }],
    size_guide: { thead: [], tbody: [] },
  });

  const [categories, setCategories] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [newGuideCol, setNewGuideCol] = useState("");
  const apiUrl = "http://localhost:3005";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/category`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data.payload || data[0]?.payload || []);
      } catch (err) {
        console.log("Error fetching categories: " + err);
        alert(
          "Gagal load categories. Solusi: Cek koneksi server atau restart backend."
        );
      }
    };
    fetchCategories();
  }, []);

  const resetForm = () => {
    setForm({
      category_id: "",
      name: "",
      tipe: "",
      point: "",
      variasi: "",
      warna: "",
      description: "",
      price: 0,
      discount_price: 0,
      discount_start: "",
      discount_end: "",
      img: "",
      detail_images: [],
      specifications: [],
      size: [{ type: "", value: "", stock: 0 }],
      size_guide: { thead: [], tbody: [] },
    });
    setUploadError("");
    if (singleImageRef.current) singleImageRef.current.value = "";
    if (detailImagesRef.current) detailImagesRef.current.value = "";
  };

  const uploadSingleImg = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setUploadError("No file selected for single image.");
      return;
    }

    const formData = new FormData();
    formData.append("singleFile", file);

    try {
      const res = await fetch(`${apiUrl}/api/uploads/singleUpload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error((await res.text()) || "Upload single image failed");
      }
      const data = await res.json();
      setForm((prev) => ({ ...prev, img: data.filename }));
      setUploadError("");
      e.target.value = "";
    } catch (err) {
      console.log("Error uploading single image: " + err);
      alert(
        `Gagal upload gambar utama: ${err.message}. Solusi: Pilih file gambar valid (JPG/PNG, <5MB) dan cek server.`
      );
      setUploadError(err.message);
      e.target.value = "";
    }
  };

  const uploadDetailImg = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setUploadError("No files selected for detail images.");
      return;
    }
    if (files.length > 10) {
      alert(
        "Max 10 files for detail images. Solusi: Pilih kurang dari 10 file."
      );
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("multipleFile", files[i]);
    }

    try {
      const res = await fetch(`${apiUrl}/api/uploads/multipleUpload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error((await res.text()) || "Upload detail images failed");
      }
      const data = await res.json();
      // const newFilenames = data.urls.map((f) => f.filename);
      const newFilenames = data.urls.map((url) => {
        const filename = url.split("/").pop();
        return filename;
      });

      console.log("Previous detail_images:", form.detail_images);
      console.log("New filenames from server:", newFilenames);
      console.log("Full data response:", data);

      const hasDuplicate = new Set(newFilenames).size !== newFilenames.length;
      if (hasDuplicate) {
        alert(
          "Deteksi duplikat filename dari server! Solusi: Update backend untuk generate filename unik (tambah random string di multer) dan restart server."
        );
        return;
      }

      setForm((prev) => ({
        ...prev,
        detail_images: [...prev.detail_images, ...newFilenames],
      }));
      setUploadError("");
      console.log(data);
      console.log(data?.urls);
      e.target.value = "";
    } catch (err) {
      console.log("Error uploading detail images: " + err);
      alert(
        `Gagal upload detail images: ${err.message}. Solusi: Pilih file gambar valid (JPG/PNG, <5MB per file) dan cek server.`
      );
      setUploadError(err.message);
      e.target.value = "";
    }
  };

  const clearDetailImages = () => {
    setForm((prev) => ({ ...prev, detail_images: [] }));
    if (detailImagesRef.current) detailImagesRef.current.value = "";
    setUploadError("");
    alert("Detail images cleared. Upload baru untuk tambah.");
  };

  const deleteDetailImage = (index) => {
    setForm((prev) => ({
      ...prev,
      detail_images: prev.detail_images.filter((_, i) => i !== index),
    }));
  };

  const addSpecification = () => {
    setForm((prev) => ({
      ...prev,
      specifications: [...prev.specifications, ""],
    }));
  };

  const deleteSpecification = (index) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const addSize = () => {
    setForm((prev) => ({
      ...prev,
      size: [...prev.size, { type: "", value: "", stock: 0 }],
    }));
  };

  const deleteSize = (index) => {
    setForm((prev) => ({
      ...prev,
      size: prev.size.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "discount_price" ? Number(value) : value,
    }));
  };

  const handleSpecChange = (index, value) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? value : spec
      ),
    }));
  };

  const handleSizeChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      size: prev.size.map((size, i) =>
        i === index
          ? { ...size, [field]: field === "stock" ? Number(value) || 0 : value }
          : size
      ),
    }));
  };

  const addGuideColumn = () => {
    const colName = prompt("Masukka nama kolom (misal: Panjang, Lebar, Dada)");
    if (colName && colName.trim()) {
      setForm((prev) => ({
        ...prev,
        size_guide: {
          ...prev.size_guide,
          thead: [...prev.size_guide.thead, colName.trim()],
        },
      }));
    }
  };

  const addGuideRow = () => {
    if (form.size_guide.thead.length === 0) {
      alert("Buat kolom dulu sebelum menambah baris!");
      return;
    }
    const newRow = form.size_guide.thead.map(() => "");
    setForm((prev) => ({
      ...prev,
      size_guide: {
        ...prev.size_guide,
        tbody: [...prev.size_guide.tbody, newRow],
      },
    }));
  };

  const handleGuideCellChange = (rowIdx, colIdx, value) => {
    setForm((prev) => {
      const newBody = [...prev.size_guide.tbody];
      newBody[rowIdx][colIdx] = value;
      return {
        ...prev,
        size_guide: { ...prev.size_guide, tbody: newBody },
      };
    });
  };

  const deleteGuideColumn = (index) => {
    setForm((prev) => {
      const newHead = prev.size_guide.thead.filter((_, i) => i !== index);
      const newBody = prev.size_guide.tbody.map((row) =>
        row.filter((_, i) => i !== index)
      );
      return {
        ...prev,
        size_guide: { thead: newHead, tbody: newBody },
      };
    });
  };

  const deleteGuideRow = (index) => {
    setForm((prev) => ({
      ...prev,
      size_guide: {
        ...prev.size_guide,
        tbody: prev.size_guide.tbody.filter((_, i) => i !== index),
      },
    }));
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    setUploadError("");

    if (
      !form.category_id ||
      !form.name.trim() ||
      !form.tipe.trim() ||
      !form.point.trim() ||
      !form.variasi.trim() ||
      !form.warna.trim() ||
      !form.description.trim() ||
      form.price <= 0 ||
      !form.img ||
      form.size.length === 0
    ) {
      alert(
        "Mohon lengkapi dulu. Gambar utama wajib diupload. Solusi: Pilih file dan upload terlebih dahulu."
      );
      return;
    }

    const invalidSize = form.size.some(
      (sz) => !sz.type.trim() || !sz.value.trim() || sz.stock <= 0
    );
    if (invalidSize) {
      alert(
        "Mohon lengkapi semua data size dan stock dengan benar! (Stock > 0)"
      );
      return;
    }

    if (form.specifications.length > 0) {
      const invalidSpec = form.specifications.some((sp) => !sp.trim());
      if (invalidSpec) {
        alert("Specification tidak boleh kosong");
        return;
      }
    }

    if (!form.price || form.price <= 0) {
      alert("Harga harus di isi dengan harga lebih dari 0");
      return;
    }

    if (form.discount_price > 0 && form.discount_price >= form.price) {
      alert(
        "Discount price tidak boleh lebih besar atau sama dengan harga utama! Solusi: Masukkan discount < harga."
      );
      return;
    }

    const submitBody = {
      category_id: form.category_id,
      name: form.name,
      tipe: form.tipe,
      point: form.point,
      variasi: form.variasi,
      warna: form.warna,
      description: form.description,
      price: form.price,
      discount_price: form.discount_price > 0 ? form.discount_price : null,
      discount_start: form.discount_start || null,
      discount_end: form.discount_end || null,
      img: form.img,
      detail_images: form.detail_images,
      specifications: form.specifications,
      sizes: form.size,
      size_guide: form.size_guide,
    };

    try {
      const res = await fetch(`${apiUrl}/api/products/post/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitBody),
      });
      if (!res.ok) {
        throw new Error((await res.text()) || "Submit failed");
      }
      const data = await res.json();
      alert(`Product berhasil di simpan ID: ${data.product_id}`);
      resetForm();
    } catch (err) {
      alert(
        `Gagal add product: ${err.message}. Solusi: Cek data form atau restart backend.`
      );
      console.log(err);
    }
  };

  const handlePreviewError = (type) => {
    alert(
      `Preview ${type} gagal dimuat. Solusi: Upload ulang file atau cek apakah file corrupt/path salah di server.`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div
          onClick={() => navigate("/admin/products")}
          className="flex items-center gap-2 cursor-pointer mb-8 group w-fit"
        >
          <span className="text-gray-700 group-hover:text-black transition-colors duration-200">
            <FiChevronsLeft className="w-5 h-5" />
          </span>
          <p className="text-gray-700 group-hover:text-black font-medium transition-colors duration-200">
            Back
          </p>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            UJI COBA BACKEND POST
          </h1>
          {uploadError && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
              <p className="text-red-700 text-sm font-medium">{uploadError}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <form
            onSubmit={submitProduct}
            className="p-6 sm:p-8 lg:p-10 space-y-6"
          >
            <div className="space-y-2">
              <label
                className="block text-sm font-semibold text-gray-900"
                htmlFor="category_id"
              >
                Category
              </label>
              <select
                value={form.category_id}
                onChange={handleInputChange}
                name="category_id"
                id="category_id"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Nama produk"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Tipe
                </label>
                <input
                  type="text"
                  name="tipe"
                  value={form.tipe}
                  onChange={handleInputChange}
                  placeholder="Tipe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Point
                </label>
                <input
                  type="text"
                  name="point"
                  value={form.point}
                  onChange={handleInputChange}
                  placeholder="point"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Variasi
                </label>
                <input
                  type="text"
                  name="variasi"
                  value={form.variasi}
                  onChange={handleInputChange}
                  placeholder="variasi"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Warna
                </label>
                <input
                  type="text"
                  name="warna"
                  value={form.warna}
                  onChange={handleInputChange}
                  placeholder="warna"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="description"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleInputChange}
                  placeholder="Harga"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Discount Price
                </label>
                <input
                  type="number"
                  name="discount_price"
                  value={form.discount_price}
                  onChange={handleInputChange}
                  placeholder="Discount Price (opsional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold text-gray-900"
                  htmlFor="discount_start"
                >
                  Discount Start Date
                </label>
                <input
                  type="date"
                  name="discount_start"
                  value={form.discount_start}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold text-gray-900"
                  htmlFor="discount_end"
                >
                  Discount End Date
                </label>
                <input
                  type="date"
                  name="discount_end"
                  value={form.discount_end}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 my-8"></div>

            <div className="space-y-3">
              <label
                className="block text-sm font-semibold text-gray-900"
                htmlFor="singleImage"
              >
                Gambar Utama
              </label>
              <input
                ref={singleImageRef}
                type="file"
                name="singleFile"
                id="singleImage"
                onChange={uploadSingleImg}
                accept="image/*"
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800 file:cursor-pointer cursor-pointer transition-all duration-200"
              />
              {form.img && (
                <div className="mt-4 inline-block">
                  <img
                    src={`${apiUrl}/uploads/tmp/${form.img}?t=${Date.now()}`}
                    alt="preview"
                    className="w-40 h-40 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                    onError={() => handlePreviewError("gambar utama")}
                    onLoad={() =>
                      console.log(`Single preview loaded: ${form.img}`)
                    }
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label
                className="block text-sm font-semibold text-gray-900"
                htmlFor="detailImages"
              >
                Detail Gambar
              </label>
              <input
                ref={detailImagesRef}
                type="file"
                multiple
                name="multipleFile"
                id="detailImages"
                onChange={uploadDetailImg}
                accept="image/*"
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800 file:cursor-pointer cursor-pointer transition-all duration-200"
              />
              {form.detail_images.length > 0 && (
                <button
                  type="button"
                  onClick={clearDetailImages}
                  className="mt-3 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors duration-200 text-sm"
                >
                  Hapus Semua Detail Images
                </button>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {form.detail_images.map((filename, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={`${apiUrl}/uploads/tmp/${filename}?t=${Date.now()}`}
                      alt={`detail-${i}`}
                      className="w-full h-32 object-cover rounded-xl border-2 border-gray-200 shadow-sm transition-all duration-200 group-hover:border-gray-400"
                      onError={() =>
                        handlePreviewError(`detail image ${i + 1}`)
                      }
                      onLoad={() =>
                        console.log(`Detail preview loaded: ${filename}`)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => deleteDetailImage(i)}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg transition-all duration-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 my-8"></div>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-900">
                Specifications
              </label>
              <div className="space-y-3">
                {form.specifications.map((spc, i) => (
                  <div key={i} className="flex gap-3">
                    <input
                      type="text"
                      value={spc}
                      onChange={(e) => handleSpecChange(i, e.target.value)}
                      placeholder="Specification"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => deleteSpecification(i)}
                      className="w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-lg font-bold transition-colors duration-200 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addSpecification}
                className="mt-3 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
              >
                + Tambah Specification
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-900">
                Sizes
              </label>
              <div className="space-y-3">
                {form.size.map((s, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-3"
                  >
                    <input
                      value={s.type}
                      onChange={(e) =>
                        handleSizeChange(i, "type", e.target.value)
                      }
                      placeholder="Tipe (US/UK/EU)"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                    />
                    <input
                      value={s.value}
                      onChange={(e) =>
                        handleSizeChange(i, "value", e.target.value)
                      }
                      placeholder="Value"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                    />
                    <input
                      type="number"
                      value={s.stock}
                      onChange={(e) =>
                        handleSizeChange(i, "stock", e.target.value)
                      }
                      placeholder="Stock"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => deleteSize(i)}
                      className="h-12 bg-black hover:bg-gray-800 text-white rounded-lg font-bold transition-colors duration-200 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addSize}
                className="mt-3 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
              >
                + Tambah Size
              </button>
            </div>
            <div className="border-t border-gray-200 my-8"></div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-900">
                Size Guide (Opsional)
              </label>

              <div className="flex flex-wrap gap-3 items-center mt-2">
                <input
                  type="text"
                  value={newGuideCol}
                  onChange={(e) => setNewGuideCol(e.target.value)}
                  placeholder="Nama kolom"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newGuideCol.trim()) return;
                    setForm((prev) => ({
                      ...prev,
                      size_guide: {
                        ...prev.size_guide,
                        thead: [...prev.size_guide.thead, newGuideCol.trim()],
                      },
                    }));
                    setNewGuideCol("");
                  }}
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm"
                >
                  + Tambah Kolom
                </button>

                <button
                  type="button"
                  onClick={addGuideRow}
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm"
                >
                  + Tambah Baris
                </button>
              </div>

              {form.size_guide.thead.length > 0 && (
                <div className="overflow-x-auto border border-gray-200 rounded-lg mt-4">
                  <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-gray-100">
                      <tr>
                        {form.size_guide.thead.map((col, ci) => (
                          <th
                            key={ci}
                            className="px-2 py-2 font-medium text-gray-700 text-left"
                          >
                            {col}
                            <button
                              type="button"
                              onClick={() => deleteGuideColumn(ci)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {form.size_guide.tbody.map((row, ri) => (
                        <tr key={ri} className="border-t border-gray-200">
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-2 py-1">
                              <input
                                type="text"
                                value={cell}
                                onChange={(e) =>
                                  handleGuideCellChange(ri, ci, e.target.value)
                                }
                                placeholder="Isi data"
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                              />
                            </td>
                          ))}
                          <td className="px-2 py-1">
                            <button
                              type="button"
                              onClick={() => deleteGuideRow(ri)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 my-8"></div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Simpan Produk
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
