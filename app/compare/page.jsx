"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import { useFavorites } from "@/components/useFavorites";
import { useSession } from "next-auth/react";

const ROWS = [
  { label: "建商", get: (p) => p.b || "—" },
  { label: "區域", get: (p) => p.area || "—" },
  { label: "類型", get: (p) => p.type || "—" },
  { label: "完工", get: (p) => p.est || "—" },
  { label: "單價（萬/坪）", get: (p) => p.price || "—" },
  { label: "坪數", get: (p) => p.ping || "—" },
  { label: "房型", get: (p) => p.rooms || "—" },
  { label: "戶數", get: (p) => (p.u != null ? `${p.u} 戶` : "—") },
  { label: "樓層", get: (p) => (p.fl != null ? `${p.fl} 樓` : "—") },
  { label: "特色", get: (p) => ((p.hl || []).length ? p.hl.join("、") : "—") },
];

const MAX = 3;

function EmptyState({ text, actionLabel, actionHref }) {
  return (
    <div style={{ background: "#fff", borderRadius: 24, padding: "56px 32px", textAlign: "center", boxShadow: "0 2px 12px rgba(80,70,50,0.04)" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>⚖️</div>
      <p style={{ fontSize: 14, color: "#8a8278", marginBottom: 20 }}>{text}</p>
      <Link href={actionHref} style={{ display: "inline-block", padding: "12px 28px", borderRadius: 24, background: "#3a3632", color: "#f8f4ec", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
        {actionLabel}
      </Link>
    </div>
  );
}

export default function ComparePage() {
  const { status } = useSession();
  const { favorites, loggedIn } = useFavorites();
  const [selected, setSelected] = useState([]);
  const [didInit, setDidInit] = useState(false);

  useEffect(() => {
    if (!didInit && favorites.length > 0) {
      setSelected(favorites.slice(0, Math.min(MAX, favorites.length)).map((f) => f.name));
      setDidInit(true);
    }
  }, [favorites, didInit]);

  const toggle = (name) => {
    setSelected((cur) => {
      if (cur.includes(name)) return cur.filter((n) => n !== name);
      if (cur.length >= MAX) return cur;
      return [...cur, name];
    });
  };

  const cols = favorites.filter((f) => selected.includes(f.name));
  const gridCols = `110px repeat(${cols.length}, minmax(0, 1fr))`;

  return (
    <div style={{ background: "#f8f4ec", minHeight: "100vh", fontFamily: "'Noto Sans TC','Nunito',sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: 840, margin: "0 auto", padding: "24px 28px 100px" }}>
        <h1 style={{ fontSize: 34, fontWeight: 900, color: "#3a3632", letterSpacing: 2, marginBottom: 6 }}>建案比較</h1>
        <p style={{ fontSize: 13, color: "#b8b0a8", marginBottom: 32 }}>從你收藏的建案中挑選，最多同時比較 {MAX} 個</p>

        {status === "loading" ? (
          <p style={{ fontSize: 13, color: "#b8b0a8" }}>載入中…</p>
        ) : !loggedIn ? (
          <EmptyState text="登入後才能使用建案比較" actionLabel="前往登入" actionHref="/auth/login" />
        ) : favorites.length < 2 ? (
          <EmptyState text="收藏至少 2 個建案才能進行比較" actionLabel="去逛逛精選建案" actionHref="/projects" />
        ) : (
          <>
            {/* 選擇建案 */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#8a8278", marginBottom: 10 }}>
                選擇要比較的建案（已選 {selected.length}/{MAX}）
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {favorites.map((f) => {
                  const on = selected.includes(f.name);
                  const disabled = !on && selected.length >= MAX;
                  return (
                    <button
                      key={f.name}
                      onClick={() => toggle(f.name)}
                      disabled={disabled}
                      style={{
                        padding: "9px 18px", borderRadius: 22, fontSize: 13, fontWeight: 600,
                        border: "none", fontFamily: "inherit",
                        cursor: disabled ? "not-allowed" : "pointer",
                        background: on ? "#3a3632" : "#fff",
                        color: on ? "#f8f4ec" : disabled ? "#ccc8c0" : "#8a8278",
                        boxShadow: on ? "0 2px 8px rgba(58,54,50,0.15)" : "0 1px 4px rgba(80,70,50,0.04)",
                      }}
                    >
                      {on ? "✓ " : ""}{f.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 比較表 */}
            {cols.length === 0 ? (
              <p style={{ fontSize: 13, color: "#b8b0a8" }}>請至少選擇一個建案進行比較。</p>
            ) : (
              <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 12px rgba(80,70,50,0.05)" }}>
                <div style={{ display: "grid", gridTemplateColumns: gridCols }}>
                  <div style={{ padding: "16px 14px", background: "#f0ebe0" }} />
                  {cols.map((p) => (
                    <div key={p.name} style={{ padding: "16px 14px", background: "#f0ebe0", borderLeft: "1px solid #f8f4ec" }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#3a3632" }}>{p.name}</div>
                    </div>
                  ))}
                </div>
                {ROWS.map((row, ri) => (
                  <div key={row.label} style={{ display: "grid", gridTemplateColumns: gridCols, borderTop: "1px solid #f0ebe0" }}>
                    <div style={{ padding: "14px", fontSize: 12, fontWeight: 700, color: "#a8a098", background: "#faf7f0" }}>
                      {row.label}
                    </div>
                    {cols.map((p) => (
                      <div key={p.name} style={{ padding: "14px", fontSize: 13, color: "#3a3632", lineHeight: 1.7, borderLeft: "1px solid #f0ebe0", background: ri % 2 ? "#fff" : "#fdfbf7" }}>
                        {row.get(p)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: 24 }}>
              <Link href="/favorites" style={{ fontSize: 13, fontWeight: 700, color: "#5a8a6a", textDecoration: "none" }}>← 回到我的收藏</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
