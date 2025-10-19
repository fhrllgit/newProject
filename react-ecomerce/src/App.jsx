import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Apps from "./pages/landingPage/App"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminProduct from "./pages/admin/ProductPage"
import AddProduct from "./components/Modals/AddProductModal"
import EditProduct from "./components/Modals/EditProductModal"
import BuyProduct from "./pages/landingPage/layouts/Section/BuyProduct";
import Category from "./pages/landingPage/layouts/Section/Category";

export default function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Apps/>}/>
        <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
        <Route path="/admin/products" element={<AdminProduct/>}/>
        <Route path="/admin/products/add" element={<AddProduct/>}/>
        <Route path="/admin/dashboard/edit-product/:id" element={<EditProduct/>}/>
        <Route path="/product/:id" element={<BuyProduct />} />
        <Route path="/category/:slug" element={<Category />} />
      </Routes>
    </Router>
    </>
  );
}

