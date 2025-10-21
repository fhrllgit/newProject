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
import Keranjang from "./pages/landingPage/layouts/Section/Keranjang";

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
          <Route path="/keranjang" element={<Keranjang />} />
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
