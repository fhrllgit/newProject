import React, { useEffect, useState } from "react";
import { useParams, useNavigate, data } from "react-router-dom";
import axios from "axios";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [newMainFile, setNewMainFile] = useState(null);
  const [newDetailFiles, setNewDetailFiles] = useState([]);
  const [mainPreview, setMainPreview] = useState("");
  const [detailPreviews, setDetailPreviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("ID produk tidak valid");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(
          `https://backendlombaecomerce-production.up.railway.app/api/products/product/${id}`
        );
        console.log("Product fetched:", res.data);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Gagal memuat data produk");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      const initialForm = {
        ...product,
        category_id: product.category_id ? Number(product.category_id) : null,
        category: product.category || product.category?.name || "",
        size: product.size || [],
        specifications: product.specifications || [],
        detail_images: product.detail_images || [],
        Image: product.Image || "",
        discount: product.discount != null ? Number(product.discount) : null,
        startDiscount: product.startDiscount ?? null,
        endDiscount: product.endDiscount ?? null,
        price: Number(product.price) || 0,
        description: product.description || "",
        tipe: product.tipe || "",
        point: product.point || "",
        variasi: product.variasi || "",
        warna: product.warna || "",
        size_guide: product.size_guide || { thead: [], tbody: [] },

      };
      setForm(initialForm);
      setNewMainFile(null);
      setNewDetailFiles([]);
      setMainPreview("");
      setDetailPreviews([]);
      console.log("Form initialized:", initialForm);
    }
  }, [product]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://backendlombaecomerce-production.up.railway.app/api/category");
        console.log("Categories Response:", res.data);
        if (res.data && res.data[0]?.payload) {
          setCategories(res.data[0].payload);
        } else {
          setCategories([]);
          console.warn("No categories found");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Gagal memuat kategori");
      }
    };
    fetchCategories();
  }, []);

  const generatePreview = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(file);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading data produk...</div>
      </div>
    );
  }

  if (error || !product || !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <p>{error || "Produk tidak ditemukan"}</p>
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="mt-2 px-4 py-1 bg-red-500 text-white rounded"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (["price", "discount", "category_id"].includes(name)) {
      newValue = value === "" ? null : Number(value);
    }
    setForm({ ...form, [name]: newValue });
    console.log(`Field changed - ${name}:`, newValue);
  };

  const handleArrayChange = (field, index, value, subfield) => {
    const arr = [...form[field]];
    if (subfield) {
      const parsedValue =
        subfield === "stock" ? (value === "" ? 0 : Number(value)) : value;
      arr[index][subfield] = parsedValue;
    } else {
      arr[index] = value;
    }
    setForm({ ...form, [field]: arr });
  };

  const handleAddArrayItem = (field, item) => {
    setForm({ ...form, [field]: [...form[field], item] });
  };

  const handleRemoveArrayItem = (field, index) => {
    const arr = [...form[field]];
    arr.splice(index, 1);
    if (field === "detail_images") {
      console.log("Hapus detail image index:", index);
    }
    setForm({ ...form, [field]: arr });
  };

  const handleNewDetailImages = async (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = [];
    for (const file of files) {
      const preview = await generatePreview(file);
      newPreviews.push({ file, preview });
    }
    setNewDetailFiles([...newDetailFiles, ...files]);
    setDetailPreviews([
      ...detailPreviews,
      ...newPreviews.map((p) => p.preview),
    ]);
    e.target.value = "";
  };

  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = await generatePreview(file);
      setNewMainFile(file);
      setMainPreview(preview);
    }
  };

  // === SIZE GUIDE ===
const handleAddSizeGuideColumn = () => {
  const colName = prompt("Masukkan nama kolom:");
  if (!colName) return;
  setForm((prev) => ({
    ...prev,
    size_guide: {
      ...prev.size_guide,
      thead: [...prev.size_guide.thead, colName],
      tbody: prev.size_guide.tbody.map((row) => [...row, ""]),
    },
  }));
};

const handleAddSizeGuideRow = () => {
  if (form.size_guide.thead.length === 0) {
    alert("Tambahkan kolom terlebih dahulu!");
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

const handleSizeGuideChange = (rowIdx, colIdx, value) => {
  setForm((prev) => {
    const newBody = [...prev.size_guide.tbody];
    newBody[rowIdx][colIdx] = value;
    return {
      ...prev,
      size_guide: { ...prev.size_guide, tbody: newBody },
    };
  });
};

const handleRemoveSizeGuideColumn = (colIdx) => {
  setForm((prev) => ({
    ...prev,
    size_guide: {
      thead: prev.size_guide.thead.filter((_, i) => i !== colIdx),
      tbody: prev.size_guide.tbody.map((row) =>
        row.filter((_, i) => i !== colIdx)
      ),
    },
  }));
};

const handleRemoveSizeGuideRow = (rowIdx) => {
  setForm((prev) => ({
    ...prev,
    size_guide: {
      ...prev.size_guide,
      tbody: prev.size_guide.tbody.filter((_, i) => i !== rowIdx),
    },
  }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (form.discount && form.discount > form.price) {
        throw new Error("Discount tidak boleh lebih besar dari price");
      }
      if (!form.name || !form.price) {
        throw new Error("Name dan Price wajib diisi");
      }

      let imageUrl = form.Image;
      let newDetailImageUrls = [];

      if (newMainFile) {
        const fdUpload = new FormData();
        fdUpload.append("singleFile", newMainFile);

        const uploadRes = await axios.post(
          "https://backendlombaecomerce-production.up.railway.app/api/uploads/singleUpload",
          fdUpload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        imageUrl = uploadRes.data.url;
        console.log("✅ Upload success:", imageUrl);
      }

      if (newDetailFiles.length > 0) {
        const fdMulti = new FormData();
        newDetailFiles.forEach((file) => fdMulti.append("multipleFile", file));

        const resMulti = await axios.post(
          "https://backendlombaecomerce-production.up.railway.app/api/uploads/multipleUpload",
          fdMulti,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        newDetailImageUrls = resMulti.data.urls || [];
        console.log("✅ Detail images uploaded:", newDetailImageUrls);
      }

      const updatedProduct = {
        ...form,
        Image: imageUrl,
        detail_images: [...(form.detail_images || []), ...newDetailImageUrls],
      };

      const fd = new FormData();
      fd.append("data", JSON.stringify(updatedProduct));

      if (newMainFile) {
        fd.append("singleFile", newMainFile);
      }

      const res = await axios.put(
        `https://backendlombaecomerce-production.up.railway.app/api/products/put/product/${product.id}`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("✅ Update success:", res.data);

      setNewMainFile(null);
      setMainPreview("");
      setNewDetailFiles([]);
      setDetailPreviews([]);

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("❌ Submit error:", err);
      setError(
        err.response?.data?.message || err.message || "Gagal update product"
      );
    } finally {
      setLoading(false);
    }
  };


  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md mx-auto mt-20">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setError("")}
            className="mt-2 px-4 py-1 bg-red-500 text-white rounded"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  const allDetailPreviews = [...(form.detail_images || []), ...detailPreviews];

  return (
    <div className="fixed inset-0 bg-white flex justify-center items-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-4xl my-4 md:my-8 lg:my-10 max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-xl px-4 md:px-6 py-4 md:py-5 z-10">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            Edit Product
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Name
            </label>
            <input
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm md:text-base transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tipe
              </label>
              <input
                name="tipe"
                value={form.tipe || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm md:text-base transition"
                placeholder="Contoh: Elektronik / Fashion"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Point
              </label>
              <input
                type="text"
                name="point"
                value={form.point || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm md:text-base transition"
                placeholder="Masukkan point produk"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Variasi
              </label>
              <input
                name="variasi"
                value={form.variasi || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm md:text-base transition"
                placeholder="Contoh: Ukuran, Model, dll."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Warna
              </label>
              <input
                name="warna"
                value={form.warna || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm md:text-base transition"
                placeholder="Contoh: Merah, Biru, Hitam"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm md:text-base transition"
              placeholder="Masukkan deskripsi produk..."
              rows={4}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={form.price ?? ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm md:text-base transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Discount
              </label>
              <input
                type="number"
                name="discount"
                value={form.discount ?? ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm md:text-base transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Start Discount
              </label>
              <input
                type="datetime-local"
                name="startDiscount"
                value={
                  form.startDiscount
                    ? new Date(form.startDiscount).toISOString().slice(0, 16)
                    : ""
                }
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm md:text-base transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                End Discount
              </label>
              <input
                type="datetime-local"
                name="endDiscount"
                value={
                  form.endDiscount
                    ? new Date(form.endDiscount).toISOString().slice(0, 16)
                    : ""
                }
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm md:text-base transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category
            </label>
            <select
              name="category_id"
              value={form.category_id || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 bg-white text-sm md:text-base transition"
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Sizes
            </label>
            <div className="space-y-2.5">
              {form.size.map((s, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-2">
                  <input
                    placeholder="Type (e.g., S, M)"
                    value={s.type || ""}
                    onChange={(e) =>
                      handleArrayChange("size", i, e.target.value, "type")
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm transition"
                  />
                  <input
                    placeholder="Value (e.g., Small)"
                    value={s.value || ""}
                    onChange={(e) =>
                      handleArrayChange("size", i, e.target.value, "value")
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm transition"
                  />
                  <input
                    placeholder="Stock"
                    type="number"
                    value={s.stock ?? ""}
                    onChange={(e) =>
                      handleArrayChange("size", i, e.target.value, "stock")
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-24 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm transition"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem("size", i)}
                    className="text-gray-500 hover:text-red-600 px-3 py-2 transition text-lg"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                handleAddArrayItem("size", { type: "", value: "", stock: 0 })
              }
              className="mt-3 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              + Add Size
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Specifications
            </label>
            <div className="space-y-2">
              {form.specifications.map((spc, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={spc || ""}
                    onChange={(e) =>
                      handleArrayChange("specifications", i, e.target.value)
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm transition"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem("specifications", i)}
                    className="text-gray-500 hover:text-red-600 px-3 py-2 transition text-lg"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleAddArrayItem("specifications", "")}
              className="mt-3 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              + Add Specification
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Detail Images
            </label>
            <div className="flex gap-2.5 flex-wrap mb-3">
              {allDetailPreviews.map((img, i) => {
                const isNew = i >= (form.detail_images?.length || 0);
                const imgIndex = isNew
                  ? i - (form.detail_images?.length || 0)
                  : form.detail_images.findIndex((d) => d === img);
                return (
                  <div key={i} className="relative">
                    <img
                      src={img}
                      alt={`detail-${i}`}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (isNew) {
                          const newIndex =
                            i - (form.detail_images?.length || 0);
                          const newFilesCopy = [...newDetailFiles];
                          newFilesCopy.splice(newIndex, 1);
                          setNewDetailFiles(newFilesCopy);
                          const newPreviewsCopy = [...detailPreviews];
                          newPreviewsCopy.splice(newIndex, 1);
                          setDetailPreviews(newPreviewsCopy);
                        } else {
                          handleRemoveArrayItem("detail_images", imgIndex);
                        }
                      }}
                      className="absolute -top-1.5 -right-1.5 bg-white border border-gray-300 text-gray-600 rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition text-xs shadow-sm"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
            <input
              type="file"
              name="multipleFile"
              multiple
              accept="image/*"
              onChange={handleNewDetailImages}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50 file:cursor-pointer cursor-pointer transition"
            />
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Main Image
            </label>
            {(mainPreview || form.Image) && (
              <div className="mb-3">
                <img
                  src={mainPreview || form.Image}
                  alt="main"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Image saat ini {mainPreview ? "(preview baru)" : ""}
                </p>
              </div>
            )}
            <input
              type="file"
              name="singleFile"
              accept="image/*"
              onChange={handleMainImageChange}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50 file:cursor-pointer cursor-pointer transition"
            />
            {!(mainPreview || form.Image) && (
              <p className="text-xs text-gray-500 mt-2">
                Tidak ada image saat ini
              </p>
            )}
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
  <h3 className="font-semibold text-gray-800 mb-3">Size Guide</h3>

  {/* Jika belum ada size guide */}
  {(!form.size_guide || !form.size_guide.thead) && (
    <p className="text-gray-500 text-sm">
      Belum ada data size guide. Tambahkan kolom terlebih dahulu.
    </p>
  )}

  {/* Tabel size guide */}
  {form.size_guide && form.size_guide.thead.length > 0 && (
    <div className="overflow-auto">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr>
            {form.size_guide.thead.map((col, ci) => (
              <th key={ci} className="border border-gray-300 p-2 text-left">
                <div className="flex justify-between items-center">
                  <span>{col}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSizeGuideColumn(ci)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    ×
                  </button>
                </div>
              </th>
            ))}
            <th className="border border-gray-300 p-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {form.size_guide.tbody.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className="border border-gray-300 p-1">
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) =>
                      handleSizeGuideChange(ri, ci, e.target.value)
                    }
                    className="w-full border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </td>
              ))}
              <td className="border border-gray-300 text-center">
                <button
                  type="button"
                  onClick={() => handleRemoveSizeGuideRow(ri)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}

  {/* Tombol kontrol */}
  <div className="mt-3 flex flex-wrap gap-2">
    <button
      type="button"
      onClick={handleAddSizeGuideColumn}
      className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm text-gray-800 border border-gray-300"
    >
      + Kolom
    </button>
    <button
      type="button"
      onClick={handleAddSizeGuideRow}
      className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm text-gray-800 border border-gray-300"
    >
      + Baris
    </button>
  </div>
</div>


          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              onClick={() => navigate("/admin/products")}
              className="w-full cursor-pointer sm:w-auto px-5 py-2.5 bg-gray-300 text-white rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer sm:w-auto px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;
