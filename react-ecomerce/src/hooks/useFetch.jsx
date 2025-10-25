import { useEffect, useState } from "react";
import api from "../api/client";

export const useFetch = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!endpoint) return;
    let active = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(endpoint, options);
        if (!active) return;
        const payload = response?.data?.payload ?? response?.data ?? null;
        setData(payload);
      } catch (err) {
        if (active) setError(err.message || "Terjadi kesalahan");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [endpoint]);

  return { data, error, loading };
};
