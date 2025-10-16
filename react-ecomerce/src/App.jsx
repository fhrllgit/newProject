import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminProduct from "./pages/admin/ProductPage"
import AddProduct from "./components/Modals/AddProductModal"
import EditProduct from "./components/Modals/EditProductModal"

export default function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
        <Route path="/admin/products" element={<AdminProduct/>}/>
        <Route path="/admin/products/add" element={<AddProduct/>}/>
        <Route path="/admin/dashboard/edit-product/:id" element={<EditProduct/>}/>
      </Routes>
    </Router>
    </>
  );
}

