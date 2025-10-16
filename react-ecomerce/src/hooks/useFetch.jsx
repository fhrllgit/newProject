import { useEffect, useState } from "react";
import api from "../api/client";

export const useFetch = (endpoint = "/", options = {}) => {
  const [data, setData] = useState([]); // default array agar .map aman
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // jika endpoint kosong atau "/" maka akan memanggil baseURL
        const res = await api(endpoint, options);
        // fallback: backend bisa mengembalikan array langsung atau object { payload: [...] }
        const payload = res?.data?.payload ?? res?.data ?? [];
        if (!cancelled) setData(payload);
      } catch (err) {
        if (!cancelled) setError(err.message || err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
    // kalau options adalah object, stringify agar dependency change terdeteksi
  }, [endpoint, JSON.stringify(options)]);

  return { data, loading, error };
};