// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const OrderSummary = () => {
//   const [checkoutData, setCheckoutData] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const data = localStorage.getItem("checkoutData");
//     if (data) setCheckoutData(JSON.parse(data));
//   }, []);

//   if (!checkoutData) return null;

//   return (
//     <div className="bg-[#eeeeeeba] p-4 shadow space-y-3">
//       <div className="flex justify-between items-center">
//         <h2 className="text-lg font-semibold tracking-wide">
//           RINGKASAN PESANAN:
//         </h2>
//         <span
//           onClick={() => navigate("/keranjang")}
//           className="text-xs hover:bg-black underline hover:text-white cursor-pointer"
//         >
//           Edit Bag
//         </span>
//       </div>

//       <div className="p-3 sm:p-4 bg-white space-y-3">

//          <div className="flex flex-col space-y-2.5 justify-center">      
//         <div className="flex items-center text-sm font-light gap-1.5">
//           <span>
//             {checkoutData.items.reduce((acc, item) => acc + item.qty, 0)}
//           </span>
//           <span>PRODUK</span>
//         </div>
//         <hr />

//         <div className="flex justify-between text-sm font-light">
//           <span>Total Produk:</span>
//           <span>Rp. {checkoutData.totalAfterDiscount.toLocaleString()}</span>
//         </div>
//         <hr />
//         <div className="flex justify-between text-sm font-light">
//           <span>Pengiriman ?</span>
//           <span>GRATIS</span>
//         </div>

//         </div>
//         {checkoutData.items.map((item) => (
//           <div
//             key={`${item.id}-${item.size?.value || "default"}`}
//             className="flex items-center gap-3 border-t pt-2"
//           >
//             <img src={item.Image} className="w-20 h-auto" alt={item.name} />
//             <div className="flex-1 flex flex-col">
//               <p className="text-xs font-semibold">{item.name}</p>
//               {item.size && (
//                 <div className="flex items-center gap-2">
//                   <h1 className="text-xs">Size:</h1>

//                   <p className="text-xs text-gray-500">{item.size.value}</p>
//                   <p className="text-xs text-gray-500">{item.size.type}</p>
//                 </div>
//               )}
//               {item.variasi && (
//                 <p className="text-xs text-gray-500">Warna: {item.variasi}</p>
//               )}
//               <div className="flex text-xs items-end gap-1.5 justify-end">
//                 <div className="flex flex-col">
//                   <div className="flex text-sm font-light">
//                     <p>{item.qty}</p>
//                     <span>x</span>
//                   </div>
//                   <span className="text-sm font-light">Total:</span>
//                 </div>
//                 <div className="flex flex-col text-sm font-light">
//                   <p>
//                     Rp.{" "}
//                     {item.discount
//                       ? item.discount.toLocaleString()
//                       : item.price.toLocaleString()}
//                   </p>
//                   <p>
//                     Rp.{" "}
//                     {(
//                       (item.discount ? item.discount : item.price) * item.qty
//                     ).toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}

//         <hr className="bg-black" />
//         {/* <div>
//         <div className="flex justify-between font-semibold mt-2">
//           <span>Total Normal</span>
//           <span>Rp{checkoutData.totalNormal.toLocaleString()}</span>
//         </div>

//         <div className="flex justify-between font-semibold">
//           <span>Total Setelah Diskon</span>
//           <span>Rp{checkoutData.totalAfterDiscount.toLocaleString()}</span>
//         </div>

//         <div className="flex justify-between font-semibold">
//           <span>Total Items</span>
//           <span>
//             {checkoutData.items.reduce((acc, item) => acc + item.qty, 0)}
//           </span>
//         </div>
//         </div> */}

//       </div>
//     </div>
//   );
// };

// export default OrderSummary;
