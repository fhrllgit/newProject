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

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
// admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProduct from "./pages/admin/ProductPage";
import AddProduct from "./components/Modals/AddProductModal";
import EditProduct from "./components/Modals/EditProductModal";
// rout protek
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* route untk user */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* admin route */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProduct />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products/add"
            element={
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products/edit/:id"
            element={
              <AdminRoute>
                <EditProduct />
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
