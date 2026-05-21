"use client";
import Link from "next/link";
import Nav from "@/components/Nav";
import { useFavorites } from "@/components/useFavorites";
import { useSession } from "next-auth/react";

function EmptyState({ text, actionLabel, actionHref }) {
  return (
    <div style={{ background: "#fff", borderRadius: 24, padding: "56px 32px", textAlign: "center", boxShadow: "0 2px 12px rgba(80,70,50,0.04)" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🤍</div>
      <p style={{ fontSize: 14, color: "#8a8278", marginBottom: 20 }}>{text}</p>
      <Link href={actionHref} style={{ display: "inline-block", padding: "12px 28px", borderRadius: 24, background: "#3a3632", color: "#f8f4ec", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
        {actionLabel}
      </Link>
    </div>
  );
}

function FavCard({ p, onRemove }) {
  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "20px 22px", boxShadow: "0 2px 12px rgba(80,70,50,0.04)", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#3a3632" }}>{p.name}</div>
          <div style={{ fontSize: 11, color: "#a8a098", marginTop: 3 }}>{p.b}｜{p.area}｜{p.type}・{p.est}</div>
        </div>
        <button onClick={onRemove} title="移除收藏" style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 18, padding: 4, flexShrink: 0 }}>❤️</button>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontSize: 22, fontWeight: 900, color: "#3a3632" }}>{p.price}</span>
        <span style={{ fontSize: 12, color: "#a8a098" }}>萬/坪</span>
        <span style={{ fontSize: 11, color: "#ccc8c0" }}>｜{p.rooms}｜{p.ping}</span>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {(p.hl || []).slice(0, 3).map((h, i) => (
          <span key={i} style={{ fontSize: 11, fontWeight: 600, color: "#6a6258", padding: "5px 12px", borderRadius: 20, background: "#f5f0e8" }}>{h}</span>
        ))}
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const { status } = useSession();
  const { favorites, removeFavorite, loggedIn } = useFavorites();

  return (
    <div style={{ background: "#f8f4ec", minHeight: "100vh", fontFamily: "'Noto Sans TC','Nunito',sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: 840, margin: "0 auto", padding: "24px 28px 100px" }}>
        <h1 style={{ fontSize: 34, fontWeight: 900, color: "#3a3632", letterSpacing: 2, marginBottom: 6 }}>我的收藏</h1>
        <p style={{ fontSize: 13, color: "#b8b0a8", marginBottom: 32 }}>你收藏的建案都在這裡</p>

        {status === "loading" ? (
          <p style={{ fontSize: 13, color: "#b8b0a8" }}>載入中…</p>
        ) : !loggedIn ? (
          <EmptyState text="登入後才能收藏與檢視建案" actionLabel="前往登入" actionHref="/auth/login" />
        ) : favorites.length === 0 ? (
          <EmptyState text="還沒有收藏任何建案，去精選建案頁點 🤍 加入收藏吧" actionLabel="去逛逛精選建案" actionHref="/projects" />
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: "#8a8278" }}>共 {favorites.length} 個收藏建案</span>
              {favorites.length >= 2 && (
                <Link href="/compare" style={{ padding: "10px 22px", borderRadius: 22, background: "#3a3632", color: "#f8f4ec", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                  比較這些建案 →
                </Link>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {favorites.map((p) => (
                <FavCard key={p.name} p={p} onRemove={() => removeFavorite(p.name)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
