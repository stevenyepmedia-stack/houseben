"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

// 收藏功能：存在瀏覽器 localStorage，依登入帳號 email 分開存放。
// 未登入時 storageKey 為 null，收藏一律為空且無法寫入。
export function useFavorites() {
  const { data: session } = useSession();
  const email = session?.user?.email || null;
  const storageKey = email ? `favorites:${email}` : null;
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!storageKey) { setFavorites([]); return; }
    try {
      const raw = window.localStorage.getItem(storageKey);
      setFavorites(raw ? JSON.parse(raw) : []);
    } catch {
      setFavorites([]);
    }
  }, [storageKey]);

  const persist = useCallback((next) => {
    setFavorites(next);
    if (storageKey) {
      try { window.localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
    }
  }, [storageKey]);

  const isFavorite = useCallback(
    (name) => favorites.some((f) => f.name === name),
    [favorites]
  );

  const toggleFavorite = useCallback((project) => {
    if (!storageKey) return;
    const exists = favorites.some((f) => f.name === project.name);
    persist(exists
      ? favorites.filter((f) => f.name !== project.name)
      : [...favorites, project]);
  }, [favorites, storageKey, persist]);

  const removeFavorite = useCallback((name) => {
    if (!storageKey) return;
    persist(favorites.filter((f) => f.name !== name));
  }, [favorites, storageKey, persist]);

  return { favorites, isFavorite, toggleFavorite, removeFavorite, loggedIn: !!email };
}
