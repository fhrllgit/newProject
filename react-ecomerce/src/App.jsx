// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home"
// import AdminDashboard from "./pages/admin/AdminDashboard"
// import AdminProduct from "./pages/admin/ProductPage"
// import AddProduct from "./components/Modals/AddProductModal"
// import EditProduct from "./components/Modals/EditProductModal"

// export default function App() {
//   return (
//     <>
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home/>}/>
//         <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
//         <Route path="/admin/products" element={<AdminProduct/>}/>
//         <Route path="/admin/products/add" element={<AddProduct/>}/>
//         <Route path="/admin/dashboard/edit-product/:id" element={<EditProduct/>}/>
//       </Routes>
//     </Router>
//     </>
//   );
// }

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";

// import Home from "./pages/Home";
// import Checkout from "./pages/Checkout";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// // admin
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminProduct from "./pages/admin/ProductPage";
// import AddProduct from "./components/Modals/AddProductModal";
// import EditProduct from "./components/Modals/EditProductModal";
// // rout protek
// import ProtectedRoute from "./components/ProtectedRoute";
// import AdminRoute from "./components/AdminRoute";

// export default function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* route untk user */}
//           <Route
//             path="/checkout"
//             element={
//               <ProtectedRoute>
//                 <Checkout />
//               </ProtectedRoute>
//             }
//           />

//           {/* admin route */}
//           <Route
//             path="/admin/dashboard"
//             element={
//               <AdminRoute>
//                 <AdminDashboard />
//               </AdminRoute>
//             }
//           />
//           <Route
//             path="/admin/products"
//             element={
//               <AdminRoute>
//                 <AdminProduct />
//               </AdminRoute>
//             }
//           />
//           <Route
//             path="/admin/products/add"
//             element={
//               <AdminRoute>
//                 <AddProduct />
//               </AdminRoute>
//             }
//           />
//           <Route
//             path="/admin/products/edit/:id"
//             element={
//               <AdminRoute>
//                 <EditProduct />
//               </AdminRoute>
//             }
//           />
//         </Routes>
//       </Router>
//     </AuthProvider>

// import Apps from "./pages/landingPage/App"
// import AdminDashboard from "./pages/admin/AdminDashboard"
// import AdminProduct from "./pages/admin/ProductPage"
// import AddProduct from "./components/Modals/AddProductModal"
// import EditProduct from "./components/Modals/EditProductModal"
// import BuyProduct from "./pages/landingPage/layouts/Section/BuyProduct";
// import Category from "./pages/landingPage/layouts/Section/Category";

// export default function App() {
//   return (
//     <>
//     <Router>
//       <Routes>
//         <Route path="/" element={<Apps/>}/>
//         <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
//         <Route path="/admin/products" element={<AdminProduct/>}/>
//         <Route path="/admin/products/add" element={<AddProduct/>}/>
//         <Route path="/admin/dashboard/edit-product/:id" element={<EditProduct/>}/>
//         <Route path="/product/:id" element={<BuyProduct />} />
//         <Route path="/category/:slug" element={<Category />} />
//       </Routes>
//     </Router>
//     </>
//   );
// }


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// pages user
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";

// pages admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProduct from "./pages/admin/ProductPage";

// modals admin
import AddProduct from "./components/Modals/AddProductModal";
import EditProduct from "./components/Modals/EditProductModal";

// landing pages
import Apps from "./pages/landingPage/App";
import BuyProduct from "./pages/landingPage/layouts/Section/BuyProduct";
import Category from "./pages/landingPage/layouts/Section/Category";

// route protection
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* landing page */}
          <Route path="/" element={<Apps />} />
          
          {/* user pages */}
          <Route path="/home" element={<Home />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* product pages */}
          <Route path="/product/:id" element={<BuyProduct />} />
          <Route path="/category/:slug" element={<Category />} />

          {/* admin pages */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute>
              <AdminProduct />
            </AdminRoute>
          } />
          <Route path="/admin/products/add" element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          } />
          <Route path="/admin/dashboard/edit-product/:id" element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
