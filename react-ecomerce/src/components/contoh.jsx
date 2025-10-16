// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// const EditProductPage = () => {
//   const { id } = useParams(); // Ambil ID dari URL
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null); // State untuk data produk
//   const [form, setForm] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true); // Loading untuk fetch data
//   const [previewMainImage, setPreviewMainImage] = useState(""); // Preview blob untuk main image
//   const [previewDetailImages, setPreviewDetailImages] = useState([]); // Preview blob untuk detail images

//   // Fetch detail produk berdasarkan ID
//   useEffect(() => {
//     const fetchProduct = async () => {
//       if (!id) {
//         setError("ID produk tidak valid");
//         setLoading(false);
//         return;
//       }
//       try {
//         const res = await axios.get(`http://localhost:3005/api/products/product/${id}`); // Asumsi endpoint detail
//         console.log("Product fetched:", res.data);
//         setProduct(res.data);
//       } catch (err) {
//         console.error("Error fetching product:", err);
//         setError("Gagal memuat data produk");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   // Initialize form setelah product loaded (mirip useEffect lama)
//   useEffect(() => {
//     if (product) {
//       const initialForm = {
//         ...product,
//         category_id: product.category_id ? Number(product.category_id) : null,
//         category: product.category || product.category?.name || "",
//         size: product.size || [],
//         specifications: product.specifications || [],
//         detail_images: product.detail_images || [],
//         Image: product.Image || "",
//         discount: product.discount != null ? Number(product.discount) : null,
//         startDiscount: product.startDiscount ?? null,
//         endDiscount: product.endDiscount ?? null,
//         price: Number(product.price) || 0,
//         // Tambah field lain jika ada, misalnya:
//         description: product.description || "",
//         tipe: product.tipe || "",
//         point: product.point || 0,
//         variasi: product.variasi || "",
//         warna: product.warna || "",
//       };
//       setForm(initialForm);
//       setPreviewMainImage(""); // Reset preview
//       setPreviewDetailImages([]); // Reset preview detail
//       console.log("Form initialized:", initialForm);
//     }
//   }, [product]);

//   // Fetch categories (sama seperti sebelumnya)
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get("http://localhost:3005/api/category");
//         console.log("Categories Response:", res.data);
//         if (res.data && res.data[0]?.payload) {
//           setCategories(res.data[0].payload);
//         } else {
//           setCategories([]);
//           console.warn("No categories found");
//         }
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//         setError("Gagal memuat kategori");
//       }
//     };
//     fetchCategories();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-lg text-gray-600">Loading data produk...</div>
//       </div>
//     );
//   }

//   if (error || !product || !form) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
//           <p>{error || "Produk tidak ditemukan"}</p>
//           <button
//             type="button"
//             onClick={() => navigate("/admin/dashboard")}
//             className="mt-2 px-4 py-1 bg-red-500 text-white rounded"
//           >
//             Kembali ke Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let newValue = value;
    
//     if (["price", "discount", "category_id", "point"].includes(name)) {
//       newValue = value === "" ? null : Number(value);
//     }
//     setForm({ ...form, [name]: newValue });
//     console.log(`Field changed - ${name}:`, newValue);
//   };

//   const handleArrayChange = (field, index, value, subfield) => {
//     const arr = [...form[field]];
//     if (subfield) {
//       const parsedValue = subfield === "stock" ? (value === "" ? 0 : Number(value)) : value;
//       arr[index][subfield] = parsedValue;
//     } else {
//       arr[index] = value;
//     }
//     setForm({ ...form, [field]: arr });
//   };

//   const handleAddArrayItem = (field, item) => {
//     setForm({ ...form, [field]: [...form[field], item] });
//   };

//   const handleRemoveArrayItem = (field, index) => {
//     const arr = [...form[field]];
//     arr.splice(index, 1);
//     if (field === "detail_images") {
//       console.log("Hapus detail image index:", index);
//     }
//     setForm({ ...form, [field]: arr });
//   };

//   const handleNewDetailImages = (e) => {
//     const files = Array.from(e.target.files);
//     const newPreviews = files.map((file) => ({
//       file,
//       url: URL.createObjectURL(file),
//     }));
//     // Tambah ke preview state saja, jangan ubah form.detail_images (tetap URL server asli)
//     setPreviewDetailImages([...previewDetailImages, ...newPreviews]);
//     e.target.value = "";
//   };

//   const handleMainImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const preview = URL.createObjectURL(file);
//       setPreviewMainImage(preview); // Set ke preview saja, jangan ubah form.Image (tetap URL asli)
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       if (form.discount && form.discount > form.price) {
//         throw new Error("Discount tidak boleh lebih besar dari price");
//       }
//       if (!form.name || !form.price) {
//         throw new Error("Name dan Price wajib diisi");
//       }

//       const fd = new FormData();
//       const hasNewMainImage = e.target.mainImage.files[0];
//       const hasNewDetailImages = e.target.newDetailImages.files.length > 0;

//       const submitForm = { ...form };
//       if (hasNewMainImage) {
//         delete submitForm.Image; // Hapus Image dari JSON, kirim file via FormData (backend akan generate URL baru)
//       } else {
//         submitForm.Image = form.Image || ""; // Pakai URL asli dari form (bukan blob)
//       }
//       submitForm.size = submitForm.size || [];
//       submitForm.discount = form.discount ?? null;

//       // Untuk detail_images: Hanya kirim URL asli (dari DB), blob preview tidak masuk JSON
//       if (Array.isArray(submitForm.detail_images)) {
//         submitForm.detail_images = submitForm.detail_images.filter(img => img && img !== "" && !img.startsWith('blob:')); // Filter blob jika ada
//       }

//       fd.append("data", JSON.stringify(submitForm));
//       console.log("Data to submit:", submitForm);

//       if (hasNewMainImage) {
//         fd.append("singleFile", e.target.mainImage.files[0]);
//       }
//       if (hasNewDetailImages) {
//         [...e.target.newDetailImages.files].forEach((file) => {
//           fd.append("multipleFile", file);
//         });
//       }

//       const res = await axios.put(`http://localhost:3005/api/products/put/product/${product.id}`, fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       console.log("Update success:", res.data);

//       // Cleanup blob setelah sukses
//       if (previewMainImage) {
//         URL.revokeObjectURL(previewMainImage);
//         setPreviewMainImage("");
//       }
//       previewDetailImages.forEach(p => URL.revokeObjectURL(p.url));
//       setPreviewDetailImages([]);

//       // Kembali ke dashboard setelah sukses
//       navigate("/admin/dashboard");
//     } catch (err) {
//       console.error("Submit error:", err);
//       setError(err.response?.data?.message || err.message || "Gagal update product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Error modal (sama, tapi tanpa fixed inset-0 karena halaman penuh)
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md mx-auto mt-20">
//           <p>{error}</p>
//           <button
//             type="button"
//             onClick={() => setError("")}
//             className="mt-2 px-4 py-1 bg-red-500 text-white rounded"
//           >
//             OK
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Gabung preview + asli untuk tampilan detail images
//   const allDetailImages = [...(form.detail_images || []), ...previewDetailImages.map(p => p.url)];

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
//       <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-4xl my-10">
//         <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Name */}
//           <div>
//             <label className="block text-sm font-medium">Name</label>
//             <input
//               name="name"
//               value={form.name || ""}
//               onChange={handleChange}
//               required
//               className="w-full border rounded p-2"
//             />
//           </div>

//           {/* Price & Discount */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium">Price</label>
//               <input
//                 type="number"
//                 name="price"
//                 value={form.price ?? ""}
//                 onChange={handleChange}
//                 required
//                 className="w-full border rounded p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium">Discount</label>
//               <input
//                 type="number"
//                 name="discount"
//                 value={form.discount ?? ""}
//                 onChange={handleChange}
//                 className="w-full border rounded p-2"
//               />
//             </div>
//           </div>

//           {/* Dates */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium">Start Discount</label>
//               <input
//                 type="datetime-local"
//                 name="startDiscount"
//                 value={form.startDiscount ? new Date(form.startDiscount).toISOString().slice(0, 16) : ""}
//                 onChange={handleChange}
//                 className="w-full border rounded p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium">End Discount</label>
//               <input
//                 type="datetime-local"
//                 name="endDiscount"
//                 value={form.endDiscount ? new Date(form.endDiscount).toISOString().slice(0, 16) : ""}
//                 onChange={handleChange}
//                 className="w-full border rounded p-2"
//               />
//             </div>
//           </div>

//           {/* Category */}
//           <div>
//             <label className="block text-sm font-medium">Category</label>
//             <select
//               name="category_id"
//               value={form.category_id || ""}
//               onChange={handleChange}
//               className="w-full border rounded p-2 bg-white"
//             >
//               <option value="">Pilih Kategori</option>
//               {categories.map((cat) => (
//                 <option key={cat.id} value={String(cat.id)}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Sizes */}
//           <div>
//             <label className="block text-sm font-medium">Sizes</label>
//             {form.size.map((s, i) => (
//               <div key={i} className="flex gap-2 mb-2">
//                 <input
//                   placeholder="Type (e.g., S, M)"
//                   value={s.type || ""}
//                   onChange={(e) => handleArrayChange("size", i, e.target.value, "type")}
//                   className="border rounded p-2 flex-1"
//                 />
//                 <input
//                   placeholder="Value (e.g., Small)"
//                   value={s.value || ""}
//                   onChange={(e) => handleArrayChange("size", i, e.target.value, "value")}
//                   className="border rounded p-2 flex-1"
//                 />
//                 <input
//                   placeholder="Stock"
//                   type="number"
//                   value={s.stock ?? ""}
//                   onChange={(e) => handleArrayChange("size", i, e.target.value, "stock")}
//                   className="border rounded p-2 w-24"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveArrayItem("size", i)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   ✕
//                 </button>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() => handleAddArrayItem("size", { type: "", value: "", stock: 0 })}
//               className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               + Add Size
//             </button>
//           </div>

//           {/* Specifications */}
//           <div>
//             <label className="block text-sm font-medium">Specifications</label>
//             {form.specifications.map((spc, i) => (
//               <div key={i} className="flex gap-2 mb-2">
//                 <input
//                   value={spc || ""}
//                   onChange={(e) => handleArrayChange("specifications", i, e.target.value)}
//                   className="border rounded p-2 flex-1"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveArrayItem("specifications", i)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   ✕
//                 </button>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() => handleAddArrayItem("specifications", "")}
//               className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               + Add Specification
//             </button>
//           </div>

//           {/* Detail Images */}
//           <div>
//             <label className="block text-sm font-medium">Detail Images</label>
//             <div className="flex gap-2 flex-wrap mb-2">
//               {allDetailImages.map((img, i) => (
//                 <div key={i} className="relative">
//                   <img
//                     src={img}
//                     alt={`detail-${i}`}
//                     className="w-20 h-20 object-cover rounded"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => {
//                       // Hapus dari preview jika blob, atau dari form jika URL asli
//                       if (img.startsWith('blob:')) {
//                         const previewIndex = previewDetailImages.findIndex(p => p.url === img);
//                         if (previewIndex > -1) {
//                           const newPreviews = [...previewDetailImages];
//                           newPreviews.splice(previewIndex, 1);
//                           setPreviewDetailImages(newPreviews);
//                           URL.revokeObjectURL(img);
//                         }
//                       } else {
//                         handleRemoveArrayItem("detail_images", form.detail_images.findIndex(d => d === img));
//                       }
//                     }}
//                     className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                   >
//                     ✕
//                   </button>
//                 </div>
//               ))}
//             </div>
//             <input type="file" name="newDetailImages" multiple accept="image/*" onChange={handleNewDetailImages} />
//           </div>

//           {/* Main Image */}
//           <div>
//             <label className="block text-sm font-medium">Main Image</label>
//             {(previewMainImage || form.Image) && (
//               <div className="mb-2">
//                 <img
//                   src={previewMainImage || form.Image}
//                   alt="main"
//                   className="w-24 h-24 object-cover rounded mb-2"
//                 />
//                 <p className="text-xs text-gray-500">Image saat ini {previewMainImage ? '(preview baru)' : ''}</p>
//               </div>
//             )}
//             <input type="file" name="mainImage" accept="image/*" onChange={handleMainImageChange}/>
//             {!(previewMainImage || form.Image) && <p className="text-xs text-gray-500 mt-1">Tidak ada image saat ini</p>}
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end gap-2 mt-4">
//             {/* <button
//               type="button"
//               onClick={onClose}
//               disabled={loading}
//               className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//             >
//               Cancel
//             </button> */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//             >
//               {loading ? "Saving..." : "Save Changes"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default EditProductPage;




  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);
  //   try {
  //     if (form.discount && form.discount > form.price) {
  //       throw new Error("Discount tidak boleh lebih besar dari price");
  //     }
  //     if (!form.name || !form.price) {
  //       throw new Error("Name dan Price wajib diisi");
  //     }

      
      

  //     const fd = new FormData();
  //     fd.append("Image", form.Image);
  //     const hasNewMainImage = newMainFile; // Cek dari state file
  //     const hasNewDetailImages = newDetailFiles.length > 0;

  //     const submitForm = { ...form };
  //     if (hasNewMainImage) {
  //       submitForm.Image = null; // Set null agar backend tahu replace dengan file baru (bukan delete, biar parsed ada field)
  //     } // Jika tidak ada, tetap form.Image asli
  //     submitForm.size = submitForm.size || [];
  //     submitForm.discount = form.discount ?? null;

  //     // Untuk detail_images: Tambah placeholder untuk file baru (backend akan replace dengan URL)
  //     if (hasNewDetailImages) {
  //       const existingDetails = form.detail_images || [];
  //       const newPlaceholders = newDetailFiles.map(
  //         (_, i) => `new_detail_${Date.now() + i}`
  //       ); // Placeholder unik
  //       submitForm.detail_images = [...existingDetails, ...newPlaceholders];
  //     } else if (Array.isArray(submitForm.detail_images)) {
  //       submitForm.detail_images = submitForm.detail_images.filter(
  //         (img) => img && img !== ""
  //       );
  //     }

  //     fd.append("data", JSON.stringify(submitForm));
  //     console.log("Data to submit:", submitForm);

  //     if (hasNewMainImage) {
  //       fd.append("singleFile", newMainFile);
  //     }
  //     if (hasNewDetailImages) {
  //       newDetailFiles.forEach((file) => {
  //         fd.append("multipleFile", file);
  //       });
  //     }

  //     let imageUrl = form.Image; // Gunakan gambar lama dulu

  // // Jika user upload gambar baru
  // if (newMainFile) {
  //   const fd = new FormData();
  //   fd.append("singleFile", newMainFile);

  //   // Upload ke endpoint upload khusus
  //   const uploadRes = await axios.post("http://localhost:3005/api/uploads/singleUpload", fd, {
  //     headers: { "Content-Type": "multipart/form-data" },
  //   });


  //   form.img = uploadRes.data.url
  //   form.Image = uploadRes.data.url
  //     const imageUrl = uploadRes.data.url; 
  //   setForm((prev) => ({ ...prev, Image: imageUrl }))
  // }


  // // Kirim PUT update produk
  // const updatedProduct = {
  //   ...form,
  //   Image: imageUrl,
  // };

  //     const res = await axios.put(
  //       `http://localhost:3005/api/products/put/product/${product.id}`,
  //       fd, updatedProduct,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       }
  //     );
  //     console.log("Update success:", res.data);

  //     // Reset states setelah sukses (hilangkan preview)
  //     setNewMainFile(null);
  //     setMainPreview("");
  //     setNewDetailFiles([]);
  //     setDetailPreviews([]);

  //     // Kembali ke dashboard setelah sukses
  //     navigate("/admin/dashboard");
  //   } catch (err) {
  //     console.error("Submit error:", err);
  //     setError(
  //       err.response?.data?.message || err.message || "Gagal update product"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  import { useState, useEffect } from "react";
import axios from "axios";
import { RiDeleteBinLine } from "react-icons/ri";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3005/api/products/product");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Toggle checkbox per produk
  const handleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : [...prev, id]
    );
  };

  // Select / Deselect all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  // Delete selected products
  const handleDeleteSelected = async () => {
    if (selectedProducts.length === 0) return alert("Pilih produk dulu!");
    if (!window.confirm("Yakin ingin menghapus produk terpilih?")) return;

    try {
      await axios.post("http://localhost:3005/api/products/delete-multiple", {
        ids: selectedProducts,
      });
      fetchProducts(); // refresh produk
      setSelectedProducts([]);
      setSelectAll(false);
    } catch (err) {
      console.error("Error deleting products:", err);
      alert("Gagal menghapus produk");
    }
  };

  return (
    <div>
      <button
        onClick={handleDeleteSelected}
        className="flex cursor-pointer items-center gap-2 bg-red-800 text-white px-4 py-2.5 rounded-lg shadow-lg w-fit mb-4"
      >
        <RiDeleteBinLine />
        <span className="font-medium text-white">Delete</span>
      </button>

      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Current Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(p.id)}
                  onChange={() => handleSelectProduct(p.id)}
                />
              </td>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.current_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
