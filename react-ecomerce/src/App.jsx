import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// pages user
import Home from "./pages/Home";
import Checkout from "./pages/checkout/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";

// pages admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProduct from "./pages/admin/ProductPage";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminTransaksi from "./pages/admin/AdminTransaksi"
import AdminUser from "./pages/admin/AdminUser"
import AdminUtama from "./components/SidebarUtama"

// modals admin
import AddProduct from "./components/Modals/AddProductModal";
import EditProduct from "./components/Modals/EditProductModal";

// landing pages
import Apps from "./pages/landingPage/App";
import BuyProduct from "./pages/landingPage/layouts/Section/BuyProduct";
import Category from "./pages/landingPage/layouts/Section/Category";
import Keranjang from "./pages/landingPage/layouts/Section/Keranjang";
// import User from "./pages//UserProfile"
import User from "./pages/UserProfile";

// route protection
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import RightAdminLaporan from "./components/Dashboard/RightAdminLaporan";
import AdminLaporan from "./pages/admin/AdminLaporan";

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
          <Route path="/user-profile" element={<User />} />
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
              <AdminUtama />
            </AdminRoute>
          } />
          <Route path="/admin/Order" element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          } />
          <Route path="/admin/transaksi" element={
            <AdminRoute>
              <AdminTransaksi />
            </AdminRoute>
          } />
          <Route path="/admin/laporan" element={
            <AdminRoute>
              <AdminLaporan />
            </AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute>
              <AdminProduct />
            </AdminRoute>
          } />
          <Route path="/admin/user" element={
            <AdminRoute>
              <AdminUser />
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
