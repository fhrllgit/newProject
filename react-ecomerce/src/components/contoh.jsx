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



//   

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAddress } from "./hooks/useAddress";
// import AddressForm from "./components/AddressForm";
// import AddressModal from "./components/AddressModal";
// import { RiCheckLine } from "react-icons/ri";
// import { MdErrorOutline } from "react-icons/md";
// import { CiLocationOn } from "react-icons/ci";
// import { useCart } from "../../context/cartContext";
// import logo from "../../img/logo.png";
// import { CiMobile3 } from "react-icons/ci";
// import { FaCcVisa } from "react-icons/fa";
// import { LiaCcAmex } from "react-icons/lia";
// import { SiMastercard } from "react-icons/si";
// import { SlPaypal } from "react-icons/sl";
// import { FaQrcode } from "react-icons/fa6";

// const CheckoutPage = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user"));
//   const [activeTab, setActiveTab] = useState("DETAIL_PESANAN");
//   const [isDetailComplete, setIsDetailComplete] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState("");
//   const [orderDetail, setOrderDetail] = useState(null);
//   const [orders, setOrders] = useState([]);

//   const [error, setError] = useState("");

//   const { cart, removeFromCart, clearCart, totalItems, updateQuantity } =
//     useCart();
//   const userId = user?.id;

//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [showForm, setShowForm] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       const ctaHeight = 45;

//       if (window.scrollY > ctaHeight) {
//         setIsSticky(true);
//       } else {
//         setIsSticky(false);
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);
//   const handleCompleteDetail = () => {
//     if (
//       selectedAddress &&
//       checkboxes.agree1 &&
//       checkboxes.agree2 &&
//       checkboxes.agree3
//     ) {
//       setIsDetailComplete(true);
//       setActiveTab("PESANAN_DIBUAT");
//     } else {
//       alert("Harap selesaikan detail pesanan terlebih dahulu");
//     }
//   };

//   const [showAddressModal, setShowAddressModal] = useState(false);
//   const [checkboxes, setCheckboxes] = useState({
//     agree1: false,
//     agree2: false,
//     agree3: false,
//   });
//   const checkboxTexts = [
//     "Saya menyatakan bahwa saya berusia minimal 18 tahun atau telah mencapai usia legal untuk membeli produk ini sesuai dengan hukum yang berlaku di wilayah saya. Saya memahami bahwa penggunaan produk ini oleh anak di bawah umur adalah ilegal.",
//     "Saya menyatakan bahwa saya telah menyetujui ",
//     "Saya setuju dengan syarat dan ketentuan C",
//   ];

//   const { addresses, loading, addAddress, deleteAddress, fetchAddresses } =
//     useAddress(userId, token);

//   useEffect(() => {
//     const savedAddress = localStorage.getItem("selectedAddress");
//     if (savedAddress) {
//       setSelectedAddress(JSON.parse(savedAddress));
//     }
//   }, []);

//   useEffect(() => {
//     if (!token) navigate("/login");
//   }, [token, navigate]);

//   const handleSaveAddress = async (data) => {
//     try {
//       await addAddress({ ...data, user_id: userId });
//       setShowForm(false);
//       await fetchAddresses();
//     } catch (err) {
//       console.error("Gagal menambah alamat:", err);
//     }
//   };
//   useEffect(() => {
//     const savedOrder = localStorage.getItem("orderData");
//     if (savedOrder) {
//       setIsDetailComplete(true);
//       setActiveTab("PESANAN_DIBUAT");
//     }
//   }, []);

//   const handleDeleteAddress = async (id) => {
//     try {
//       await deleteAddress(id);
//       if (selectedAddress?.id === id) {
//         setSelectedAddress(null);
//         localStorage.removeItem("selectedAddress");
//       }
//       await fetchAddresses();
//     } catch (err) {
//       console.error("Gagal menghapus alamat:", err);
//     }
//   };

//   const handleSelectAddress = (addr) => {
//     setSelectedAddress(addr);
//     localStorage.setItem("selectedAddress", JSON.stringify(addr));
//     setShowAddressModal(false);
//   };

//   // const [checkoutData, setCheckoutData] = useState(null);
//   const [checkoutData, setCheckoutData] = useState({
//     items: [],
//     totalAfterDiscount: 0,
//   });

//   useEffect(() => {
//     const data = localStorage.getItem("checkoutData");
//     if (data) setCheckoutData(JSON.parse(data));
//   }, []);

//   const handleSelect = (method) => {
//     setSelectedPayment(method);
//   };

//   useEffect(() => {
//     const data = localStorage.getItem("checkoutData");
//     if (data) setCheckoutData(JSON.parse(data));
//   }, []);

//   useEffect(() => {
//     const data = localStorage.getItem("checkoutData");
//     if (data) setCheckoutData(JSON.parse(data));
//   }, []);


//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[300px]">
//         <p className="text-gray-500 animate-pulse">Memuat alamat...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="">
//       <div className="w-full">
//         {/* navbar deks */}
//         <div className="block w-full">
//           {/* sticky */}
//           <div className="w-full bg-white border-b-2 border-b-[#e1e1e1a5] transition-all duration-500 ease-in-out fixed top-0 left-0 z-50">
//             <div className="w-full px-8 lg:px-16 xl:px-35 py-2">
//               <div className="flex items-center justify-between w-full">
//                 <div className="flex-shrink-0">
//                   <img
//                     className="h-10 w-auto object-contain"
//                     src={logo}
//                     alt="Logo"
//                   />
//                 </div>

//                 <div className="flex items-center gap-6">
//                   <div className="relative group">
//                     <div className="sm:flex items-center gap-1 cursor-pointer">
//                       <div className="flex items-center">
//                         <CiMobile3 size={20} />
//                         <span className="font-semibold text-sm">
//                           BANTUAN? 0831-9382-863
//                         </span>
//                       </div>
//                       <p className="text-xs font-light">
//                         Senin to Sabtu: 9am - 5pm
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* route category */}
//               <div className="mt-4 pt-3 border-t border-gray-100">
//                 <div className="flex gap-8">
//                   <button
//                     onClick={() => setActiveTab("DETAIL_PESANAN")}
//                     className={`text-sm cursor-pointer font-extrabold transition-all ${
//                       activeTab === "DETAIL_PESANAN" ? "underline" : ""
//                     }`}
//                   >
//                     DETAIL PESANAN
//                   </button>

//                   <button
//                     onClick={() =>
//                       isDetailComplete && setActiveTab("PESANAN_DIBUAT")
//                     }
//                     className={`text-sm font-extrabold transition-all ${
//                       isDetailComplete
//                         ? activeTab === "PESANAN_DIBUAT"
//                           ? "underline cursor-pointer text-black"
//                           : "text-black"
//                         : "text-gray-400 cursor-not-allowed"
//                     }`}
//                   >
//                     PESANAN DIBUAT
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {activeTab === "DETAIL_PESANAN" && (
//         <div className="container mt-25 px-4 sm:px-6 lg:px-15 xl:px-25 mx-auto py-6 sm:py-8 lg:py-10 lg:flex gap-6">
//           <div className="w-full lg:w-1/3 mb-6 lg:mb-0">
//             {showForm ? (
//               <AddressForm
//                 onSave={handleSaveAddress}
//                 onCancel={() => setShowForm(false)}
//               />
//             ) : (
//               <div>
//                 {selectedAddress ? (
//                   <div
//                     className="border border-red-800 p-3 sm:p-4 rounded-2xl cursor-pointer"
//                     onClick={() => setShowAddressModal(true)}
//                   >
//                     <div className="flex gap-2.5">
//                       <CiLocationOn size={30} className="flex-shrink-0" />
//                       <div className="flex-1 min-w-0">
//                         <h1 className="font-semibold text-xs sm:text-sm mb-1">
//                           ALAMAT PENGIRIMAN
//                         </h1>
//                         <div className="flex flex-col sm:flex-row sm:gap-2 text-xs sm:text-sm">
//                           <p className="font-normal">
//                             {selectedAddress.nama_penerima}
//                           </p>
//                           <p className="font-light break-words">
//                             {selectedAddress.alamat_lengkap},{" "}
//                             {selectedAddress.kota}, {selectedAddress.kecamatan},{" "}
//                             {selectedAddress.kode_pos}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <button
//                     onClick={() => setShowAddressModal(true)}
//                     className="bg-black text-white px-4 py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto"
//                   >
//                     Pilih Alamat
//                   </button>
//                 )}
//               </div>
//             )}

//             {showAddressModal && (
//               <AddressModal
//                 addresses={addresses}
//                 onSelect={handleSelectAddress}
//                 onDelete={handleDeleteAddress}
//                 onAddNew={() => setShowForm(true)}
//                 onClose={() => setShowAddressModal(false)}
//               />
//             )}

//             <div className="flex flex-col gap-2 sm:gap-3 mt-4">
//               {checkboxTexts.map((text, index) => {
//                 const key = `agree${index + 1}`;
//                 return (
//                   <div
//                     key={key}
//                     onClick={() =>
//                       setCheckboxes({ ...checkboxes, [key]: !checkboxes[key] })
//                     }
//                     className="flex gap-2 cursor-pointer select-none"
//                   >
//                     <div
//                       className={`w-5 h-5 sm:w-6 sm:h-6 mt-1 sm:mt-2 border flex items-center justify-center transition-colors duration-200 flex-shrink-0 ${
//                         checkboxes[key]
//                           ? "bg-black border-black"
//                           : "border-black"
//                       }`}
//                     >
//                       {checkboxes[key] && (
//                         <RiCheckLine className="text-white" size={24} />
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <span className="text-xs sm:text-sm">{text}</span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {(!checkboxes.agree1 ||
//               !checkboxes.agree2 ||
//               !checkboxes.agree3) && (
//               <p className="text-red-600 font-semibold text-xs sm:text-sm mt-4 sm:mt-5">
//                 Anda harus menerima ketentuan yang disyaratkan untuk melanjutkan
//                 halaman berikut nya.
//               </p>
//             )}

//             <div className="flex flex-col mt-6 sm:mt-8">
//               <h1 className="text-lg sm:text-xl font-semibold">
//                 METODE PENGIRIMAN
//               </h1>
//               <div className="flex gap-2 mt-3 items-start">
//                 <MdErrorOutline className="mt-0.5 flex-shrink-0" size={18} />
//                 <p className="text-xs sm:text-sm font-light">
//                   Produk akan di kirim dalam waktu 2-5 hari untuk wilayah Jateng
//                   dan 8-14 hari untuk wilayah lainya/diluar Jateng
//                 </p>
//               </div>
//               <span className="text-xs sm:text-sm font-light mt-6 sm:mt-10">
//                 Tidak ada metode pengiriman yang tersedia
//               </span>
//             </div>
//             <div className="flex flex-col space-y-2 mt-4">
//               <div
//                 className={`flex items-center justify-between border h-11 px-3 cursor-not-allowed rounded-xl opacity-50`}
//               >
//                 <p>Credit Card</p>
//                 <span className="flex items-center gap-1">
//                   <FaCcVisa size={30} />
//                   <LiaCcAmex size={30} />
//                   <SiMastercard size={30} />
//                 </span>
//               </div>

//               <div
//                 className={`flex items-center justify-between border h-11 px-3 cursor-not-allowed rounded-xl opacity-50`}
//               >
//                 <p>Paypal</p>
//                 <span className="flex items-center gap-1">
//                   <SlPaypal />
//                 </span>
//               </div>

//               <div
//                 onClick={() => handleSelect("cod")}
//                 className={`flex items-center justify-between border h-11 px-3 rounded-xl cursor-pointer transition-all ${
//                   selectedPayment === "cod" ? "border-black" : "border-gray-700"
//                 }`}
//               >
//                 <p>COD</p>
//                 <div
//                   className={`w-6 h-6 border  flex items-center justify-center transition-all ${
//                     selectedPayment === "cod"
//                       ? "bg-black border-white"
//                       : "border-gray-400"
//                   }`}
//                 >
//                   {selectedPayment === "cod" && (
//                     <RiCheckLine size={24} className="text-white text-sm" />
//                   )}
//                 </div>
//               </div>

//               <div
//                 className={`flex items-center justify-between border h-11 px-3 cursor-not-allowed rounded-xl opacity-50`}
//               >
//                 <p>QRIS</p>
//                 <span className="flex items-center gap-1">
//                   <FaQrcode />
//                 </span>
//               </div>
//             </div>


//             <button
//               onClick={() => {
//                 if (!selectedAddress) {
//                   setError("Harap pilih alamat pengiriman terlebih dahulu");
//                   return;
//                 }
//                 if (
//                   !checkboxes.agree1 ||
//                   !checkboxes.agree2 ||
//                   !checkboxes.agree3
//                 ) {
//                   setError("Harap setujui semua persetujuan sebelum checkout");
//                   return;
//                 }
//                 if (selectedPayment !== "cod") {
//                   setError("Saat ini hanya metode COD yang tersedia");
//                   return;
//                 }

//                 setError("");

//                 const checkoutData =
//                   JSON.parse(localStorage.getItem("checkoutData")) || {};

//                 const orderData = {
//                   id: Date.now(), 
//                   address: selectedAddress,
//                   paymentMethod: selectedPayment,
//                   items: checkoutData.items || [],
//                   totalAfterDiscount: checkoutData.totalAfterDiscount || 0,
//                   status: "Diproses",
//                   createdAt: new Date().toISOString(),
//                 };

//                 console.log("Pesanan baru:", orderData);

//                 let existingOrders = [];

//                 try {
//                   const storedOrders = JSON.parse(
//                     localStorage.getItem("orderData")
//                   );
//                   if (Array.isArray(storedOrders)) {
//                     existingOrders = storedOrders;
//                   } else {
//                     existingOrders = [];
//                   }
//                 } catch (error) {
//                   console.error(
//                     "Error parsing orderData from localStorage:",
//                     error
//                   );
//                   existingOrders = [];
//                 }

//                 const updatedOrders = [...existingOrders, orderData];
//                 localStorage.setItem(
//                   "orderData",
//                   JSON.stringify(updatedOrders)
//                 );

//                 clearCart();
//                 localStorage.removeItem("checkoutData");

//                 setIsDetailComplete(true);
//                 setActiveTab("PESANAN_DIBUAT");
//               }}
//               className={`mt-4 w-full py-2.5 sm:py-3 text-sm sm:text-base text-white ${
//                 selectedAddress &&
//                 checkboxes.agree1 &&
//                 checkboxes.agree2 &&
//                 checkboxes.agree3 &&
//                 selectedPayment === "cod"
//                   ? "bg-black cursor-pointer"
//                   : "bg-[#cacaca] cursor-not-allowed"
//               }`}
//               disabled={
//                 !selectedAddress ||
//                 !checkboxes.agree1 ||
//                 !checkboxes.agree2 ||
//                 !checkboxes.agree3 ||
//                 selectedPayment !== "cod"
//               }
//             >
//               BUAT PESANAN
//             </button>

//             {error && (
//               <p className="text-red-600 font-semibold text-xs sm:text-sm mt-2">
//                 {error}
//               </p>
//             )}
//           </div>

//           {/* pesanan  */}
//           <div className="w-full lg:w-2/3">
//             <div className="bg-[#eeeeeeba] p-4 shadow space-y-3">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-lg font-semibold tracking-wide">
//                   RINGKASAN PESANAN:
//                 </h2>
//                 <span
//                   onClick={() => navigate("/keranjang")}
//                   className="text-xs hover:bg-black underline hover:text-white cursor-pointer"
//                 >
//                   Edit Bag
//                 </span>
//               </div>

//               <div className="p-3 sm:p-4 bg-white space-y-3">
//                 <div className="flex flex-col space-y-2.5 justify-center">
//                   <div className="flex items-center text-sm font-light gap-1.5">
//                     <span>
//                       {checkoutData.items.reduce(
//                         (acc, item) => acc + item.qty,
//                         0
//                       )}
//                     </span>
//                     <span>PRODUK</span>
//                   </div>
//                   <hr />

//                   <div className="flex justify-between text-sm font-light">
//                     <span>Total Produk:</span>
//                     <span>
//                       Rp. {checkoutData.totalAfterDiscount.toLocaleString()}
//                     </span>
//                   </div>
//                   <hr />
//                   <div className="flex justify-between text-sm font-light">
//                     <span>Pengiriman ?</span>
//                     <span>GRATIS</span>
//                   </div>
//                 </div>

//                 {checkoutData.items.length === 0 ? (
//                   <p className="text-gray-500 text-sm mt-2">
//                     Tidak ada produk di keranjang
//                   </p>
//                 ) : (
//                   checkoutData.items.map((item) => (
//                     <div
//                       key={`${item.id}-${item.size?.value || "default"}`}
//                       className="flex items-center gap-3 border-t pt-2"
//                     >
//                       <img
//                         src={item.Image}
//                         className="w-20 h-auto"
//                         alt={item.name}
//                       />
//                       <div className="flex-1 flex flex-col">
//                         <p className="text-xs font-semibold">{item.name}</p>
//                         {item.size && (
//                           <div className="flex items-center gap-2">
//                             <h1 className="text-xs">Size:</h1>
//                             <p className="text-xs text-gray-500">
//                               {item.size.value}
//                             </p>
//                             <p className="text-xs text-gray-500">
//                               {item.size.type}
//                             </p>
//                           </div>
//                         )}
//                         {item.variasi && (
//                           <p className="text-xs text-gray-500">
//                             Warna: {item.variasi}
//                           </p>
//                         )}
//                         <div className="flex text-xs items-end gap-1.5 justify-end">
//                           <div className="flex flex-col">
//                             <div className="flex text-sm font-light">
//                               <p>{item.qty}</p>
//                               <span>x</span>
//                             </div>
//                             <span className="text-sm font-light">Total:</span>
//                           </div>
//                           <div className="flex flex-col text-sm font-light">
//                             <p>
//                               Rp.{" "}
//                               {(item.discount
//                                 ? item.discount
//                                 : item.price
//                               ).toLocaleString()}
//                             </p>
//                             <p>
//                               Rp.{" "}
//                               {(
//                                 (item.discount ? item.discount : item.price) *
//                                 item.qty
//                               ).toLocaleString()}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}

//                 <hr className="bg-black" />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {activeTab === "PESANAN_DIBUAT" && isDetailComplete && (
//         <div className="container mt-28 px-6 sm:px-12 lg:px-20 mx-auto">
//           <h2 className="text-lg sm:text-xl font-bold mb-4">
//             Riwayat Pesanan Anda
//           </h2>

//           {(() => {
//             let orders = [];

//             try {
//               const stored = JSON.parse(localStorage.getItem("orderData"));
//               if (Array.isArray(stored)) {
//                 orders = stored;
//               } else if (stored) {
//                 orders = [stored];
//               }
//             } catch (error) {
//               console.error("Error parsing orderData:", error);
//               orders = [];
//             }

//             if (orders.length === 0) {
//               return <p>Tidak ada pesanan ditemukan.</p>;
//             }

//             return orders.map((order, index) => (
//               <div
//                 key={order.createdAt || index} // ✅ pakai createdAt, fallback ke index
//                 className="bg-white p-4 rounded-xl shadow space-y-3 mb-4"
//               >
//                 <div className="flex justify-between text-sm font-light">
//                   <span>Status Pesanan:</span>
//                   <span className="font-medium">{order.status}</span>
//                 </div>
//                 <div className="flex justify-between text-sm font-light">
//                   <span>Tanggal:</span>
//                   <span>{new Date(order.createdAt).toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between text-sm font-light">
//                   <span>Total Produk:</span>
//                   <span>Rp. {order.totalAfterDiscount.toLocaleString()}</span>
//                 </div>
//                 <hr />

//                 {Array.isArray(order.items) &&
//                   order.items.map((item, i) => (
//                     <div
//                       key={`${item.id || i}-${item.size?.value || "default"}`} // ✅ item key aman
//                       className="flex items-center gap-3 border-t pt-2"
//                     >
//                       <img
//                         src={item.Image}
//                         className="w-20 h-auto"
//                         alt={item.name}
//                       />
//                       <div className="flex-1 flex flex-col">
//                         <p className="text-xs font-semibold">{item.name}</p>
//                         {item.size && (
//                           <p className="text-xs text-gray-500">
//                             Size: {item.size.value} {item.size.type}
//                           </p>
//                         )}
//                         {item.variasi && (
//                           <p className="text-xs text-gray-500">
//                             Warna: {item.variasi}
//                           </p>
//                         )}
//                         <p className="text-xs text-gray-500">
//                           Jumlah: {item.qty} x Rp{" "}
//                           {(item.discount || item.price).toLocaleString()}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           Total: Rp{" "}
//                           {(
//                             (item.discount ? item.discount : item.price) *
//                             item.qty
//                           ).toLocaleString()}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             ));
//           })()}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CheckoutPage;








import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3005/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("❌ Gagal mengambil pesanan:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3005/api/orders/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (error) {
      console.error("❌ Gagal update status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto mt-24 px-6 sm:px-12">
      <h1 className="text-xl font-bold mb-4">Kelola Pesanan</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">Belum ada pesanan.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Pelanggan</th>
              <th className="p-2 border">Produk</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={o.order_id}>
                <td className="p-2 border text-center">{i + 1}</td>
                <td className="p-2 border">{o.user_name}</td>
                <td className="p-2 border">{o.product_name}</td>
                <td className="p-2 border text-right">
                  Rp {o.total_after_discount?.toLocaleString()}
                </td>
                <td className="p-2 border text-center">{o.status}</td>
<td className="p-2 border text-center flex items-center gap-2 justify-center">
  <select
    value={o.status}
    onChange={(e) =>
      setOrders((prev) =>
        prev.map((order) =>
          order.order_id === o.order_id ? { ...order, status: e.target.value } : order
        )
      )
    }
    className="border p-1 rounded text-xs"
  >
    <option value="DIPROSES">Diproses</option>
    <option value="DIKIRIM">Dikirim</option>
    <option value="SELESAI">Selesai</option>
    <option value="DIBATALKAN">Dibatalkan</option>
  </select>
<button
  onClick={(e) => {
    const select = e.target.previousSibling; // ambil <select> sebelum button
    updateStatus(o.order_id, select.value);
  }}
  className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
>
  Simpan
</button>

</td>


              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;
