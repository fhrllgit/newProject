import { useState, useEffect } from "react";
import axios from "axios";

export const useAddress = (userId, token) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://backendlombaecomerce-production.up.railway.app/api/address";

const fetchAddresses = async () => {
  try {
    const res = await axios.get(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAddresses(res.data || []); 
  } catch (err) {
    console.error("❌ Gagal mengambil alamat:", err.response || err);
  } finally {
    setLoading(false);
  }
};


  const addAddress = async (data) => {
    try {
      console.log("📦 Token dikirim:", token);
      await axios.post(API_URL, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchAddresses();
    } catch (err) {
      console.error("❌ Gagal menambah alamat:", err.response || err);
    }
  };

  const deleteAddress = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchAddresses();
    } catch (err) {
      console.error("❌ Gagal menghapus alamat:", err.response || err);
    }
  };

  useEffect(() => {
    if (userId && token) fetchAddresses();
  }, [userId, token]);

  return { addresses, loading, addAddress, deleteAddress, fetchAddresses };
};
