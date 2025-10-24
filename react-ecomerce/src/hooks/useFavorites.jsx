import { useEffect, useState } from "react";

const STORAGE_KEY = "ohmay_favorites";

const readFavorites = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeFavorites = (arr) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    window.dispatchEvent(new CustomEvent("favorites-updated", { detail: arr }));
  } catch {}
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(readFavorites);

  // 🔹 Dengarkan event 'favorites-updated' agar hook di komponen lain ikut refresh
  useEffect(() => {
    const handler = (e) => {
      const next = Array.isArray(e.detail) ? e.detail : readFavorites();
      setFavorites(next);
    };
    window.addEventListener("favorites-updated", handler);
    return () => window.removeEventListener("favorites-updated", handler);
  }, []);

  const addFavorite = (item) => {
    const current = readFavorites();
    const id = item?.id ?? item?._id;
    if (!id) return;

    if (current.some((f) => (f.id ?? f._id) === id)) return;
    const next = [...current, item];
    writeFavorites(next);
    setFavorites(next);
  };

  const removeFavorite = (id) => {
    const current = readFavorites();
    const next = current.filter((f) => (f.id ?? f._id) !== id);
    writeFavorites(next);
    setFavorites(next);
  };

  const clearFavorites = () => {
    writeFavorites([]);
    setFavorites([]);
  };

  const isFavorite = (id) =>
    favorites.some((f) => String(f.id ?? f._id) === String(id));

  return { favorites, addFavorite, removeFavorite, clearFavorites, isFavorite };
};
