import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3005/api/products/product"
})

export default api;