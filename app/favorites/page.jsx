"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import { useFavorites } from "@/components/useFavorites";
import { useSession } from "next-auth/react";
import { PROJECTS, REGION_LABEL, priceLow } from "@/lib/projects";

// 房型範圍比對：rooms 例 "2~4房"，want 為數字 2/3/4。
function roomsMatch(rooms, want) {
  if (!want) return true;
  const nums = (String(rooms).match(/\d+/g) || []).map(Number);
  if (!nums.length) return true;
  return want >= Math.min(...nums) && want <= Math.max(...nums);
}

function EmptyState({ text, actionLabel, actionHref }) {
  return (
    <div style={{ background: "#fff", borderRadius: 24, padding: "56px 32px", textAlign: "center", boxShadow: "0 2px 12px rgba(80,70,50,0.04)" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🏠</div>
      <p style={{ fontSize: 14, color: "#8a8278", marginBottom: 20 }}>{text}</p>
      <Link href={actionHref} style={{ display: "inline-block", padding: "12px 28px", borderRadius: 24, background: "#3a3632", color: "#f8f4ec", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
        {actionLabel}
      </Link>
    </div>
  );
}

function StatCard({ label, value, unit }) {
  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: "16px 20px", boxShadow: "0 2px 10px rgba(80,70,50,0.04)", flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 12, color: "#a8a098", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 23, fontWeight: 900, color: "#3a3632" }}>
        {value}{unit && <span style={{ fontSize: 12, fontWeight: 400, color: "#a8a098" }}> {unit}</span>}
      </div>
    </div>
  );
}

function ProjectMini({ p, fav, router }) {
  const active = fav.isFavorite(p.name);
  const onHeart = (e) => {
    e.stopPropagation();
    if (!fav.loggedIn) return;
    fav.toggleFavorite(p);
  };
  return (
    <div onClick={() => router.push(`/projects/${p.id}`)} style={{
      background: "#fff", borderRadius: 16, padding: "16px 18px", cursor: "pointer",
      boxShadow: "0 2px 10px rgba(80,70,50,0.04)", display: "flex", flexDirection: "column", gap: 8,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#3a3632" }}>{p.name}</div>
          <div style={{ fontSize: 11, color: "#a8a098", marginTop: 2 }}>{p.area}｜{p.rooms}｜{p.ping}</div>
        </div>
        <button onClick={onHeart} title={active ? "取消收藏" : "加入收藏"} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 16, padding: 2, flexShrink: 0 }}>
          {active ? "❤️" : "🤍"}
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
        <span style={{ fontSize: 19, fontWeight: 900, color: "#3a3632" }}>{p.price}</span>
        <span style={{ fontSize: 11, color: "#a8a098" }}>萬/坪</span>
      </div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {(p.hl || []).slice(0, 3).map((h, i) => (
          <span key={i} style={{ fontSize: 10, fontWeight: 600, color: "#6a6258", padding: "4px 9px", borderRadius: 14, background: "#f5f0e8" }}>{h}</span>
        ))}
      </div>
    </div>
  );
}

const SELECT_STYLE = { border: "1px solid #e8e0d4", borderRadius: 14, padding: "10px 14px", fontSize: 13, color: "#3a3632", background: "#fff", cursor: "pointer", fontFamily: "inherit" };

function SectionTitle({ children, hint }) {
  return (
    <div style={{ marginBottom: 14, marginTop: 8 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#3a3632" }}>{children}</div>
      {hint && <div style={{ fontSize: 12, color: "#b8b0a8", marginTop: 3 }}>{hint}</div>}
    </div>
  );
}

export default function BuyCenterPage() {
  const { status } = useSession();
  const fav = useFavorites();
  const router = useRouter();

  const [rates, setRates] = useState(null);
  const [region, setRegion] = useState("");
  const [rooms, setRooms] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    fetch("/api/rates").then((r) => r.json()).then(setRates).catch(() => {});
  }, []);

  const favorites = fav.favorites;
  const favPrices = favorites.map((f) => priceLow(f.price)).filter(Boolean);
  const avgPrice = favPrices.length ? Math.round(favPrices.reduce((a, b) => a + b, 0) / favPrices.length) : 0;
  const minP = favPrices.length ? Math.min(...favPrices) : 0;
  const maxP = favPrices.length ? Math.max(...favPrices) : 0;

  const results = PROJECTS.filter((p) =>
    (!region || p.region === region) &&
    roomsMatch(p.rooms, rooms) &&
    (!maxPrice || priceLow(p.price) <= maxPrice)
  );

  return (
    <div style={{ background: "#f8f4ec", minHeight: "100vh", fontFamily: "'Noto Sans TC','Nunito',sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "24px 28px 100px" }}>
        <h1 style={{ fontSize: 34, fontWeight: 900, color: "#3a3632", letterSpacing: 2, marginBottom: 6 }}>我的買房中心</h1>
        <p style={{ fontSize: 13, color: "#b8b0a8", marginBottom: 28 }}>即時行情、需求快搜、收藏與比較，買房進度一頁掌握</p>

        {status === "loading" ? (
          <p style={{ fontSize: 13, color: "#b8b0a8" }}>載入中…</p>
        ) : !fav.loggedIn ? (
          <EmptyState text="登入後即可使用買房中心：收藏建案、需求快搜與比較" actionLabel="前往登入" actionHref="/auth/login" />
        ) : (
          <>
            {/* 即時房貸利率 */}
            <div style={{ background: "#3a3632", borderRadius: 20, padding: "20px 24px", marginBottom: 28, display: "flex", flexWrap: "wrap", gap: 28, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>五大銀行房貸利率</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#e2c87a" }}>
                  {rates ? rates.five_major?.mortgage_new : "—"}<span style={{ fontSize: 13, fontWeight: 400 }}> %</span>
                </div>
              </div>
              <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.12)" }} />
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>新青安專案利率</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>
                  {rates ? rates.new_youth_plan?.rate : "—"}<span style={{ fontSize: 13, fontWeight: 400 }}> %</span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginLeft: "auto", maxWidth: 220 }}>
                新青安最高貸款成數 8 成、寬限期 5 年，適用首購族。利率僅供參考。
              </div>
            </div>

            {/* 收藏摘要統計 */}
            <SectionTitle hint="根據你目前收藏的建案計算">收藏摘要</SectionTitle>
            <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
              <StatCard label="收藏建案數" value={favorites.length} unit="個" />
              <StatCard label="平均單價" value={avgPrice || "—"} unit={avgPrice ? "萬/坪起" : ""} />
              <StatCard label="單價區間" value={favPrices.length ? `${minP}~${maxP}` : "—"} unit={favPrices.length ? "萬/坪起" : ""} />
            </div>

            {/* 需求快搜 */}
            <SectionTitle hint="選擇你的條件，立即看符合範圍的建案">需求快搜</SectionTitle>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
              <select value={region} onChange={(e) => setRegion(e.target.value)} style={SELECT_STYLE}>
                <option value="">全部區域</option>
                {Object.entries(REGION_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={rooms} onChange={(e) => setRooms(Number(e.target.value))} style={SELECT_STYLE}>
                <option value={0}>不限房型</option>
                <option value={2}>2 房</option>
                <option value={3}>3 房</option>
                <option value={4}>4 房以上</option>
              </select>
              <select value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={SELECT_STYLE}>
                <option value={0}>單價不限</option>
                <option value={30}>每坪 30 萬以內</option>
                <option value={50}>每坪 50 萬以內</option>
                <option value={70}>每坪 70 萬以內</option>
              </select>
            </div>
            <div style={{ fontSize: 12, color: "#8a8278", marginBottom: 14 }}>符合條件的建案：{results.length} 個</div>
            {results.length === 0 ? (
              <p style={{ fontSize: 13, color: "#b8b0a8", marginBottom: 32 }}>目前沒有符合條件的建案，試著放寬條件。</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 32 }}>
                {results.map((p) => <ProjectMini key={p.id} p={p} fav={fav} router={router} />)}
              </div>
            )}

            {/* 我的收藏 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, marginTop: 8 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#3a3632" }}>我的收藏（{favorites.length}）</div>
              {favorites.length >= 2 && (
                <Link href="/compare" style={{ padding: "10px 22px", borderRadius: 22, background: "#3a3632", color: "#f8f4ec", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                  比較這些建案 →
                </Link>
              )}
            </div>
            {favorites.length === 0 ? (
              <p style={{ fontSize: 13, color: "#b8b0a8" }}>還沒有收藏任何建案，從上方需求快搜或精選建案頁點 🤍 加入收藏。</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                {favorites.map((p) => <ProjectMini key={p.name} p={p} fav={fav} router={router} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
