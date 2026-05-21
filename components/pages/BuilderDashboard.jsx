"use client";
import { useState } from "react";

const MOCK_PROJECTS = [
  { id: 1, name: "潤泰菁英匯", status: "live", area: "台北中山", type: "預售", price: "55~72", views: 3842, clicks: 286, bookings: 18, images: 12, updated: "2026.05.18" },
  { id: 2, name: "潤泰松山苑", status: "draft", area: "台北松山", type: "預售", price: "62~80", views: 0, clicks: 0, bookings: 0, images: 3, updated: "2026.05.15" },
  { id: 3, name: "潤泰中和悅", status: "review", area: "新北中和", type: "新成屋", price: "38~48", views: 0, clicks: 0, bookings: 0, images: 8, updated: "2026.05.20" },
];

const MOCK_LEADS = [
  { id: 1, name: "王○明", phone: "0912-***-456", project: "潤泰菁英匯", interest: "3房・42~48坪", date: "2026.05.20 14:32", read: false },
  { id: 2, name: "李○芳", phone: "0978-***-123", project: "潤泰菁英匯", interest: "4房・55坪以上", date: "2026.05.19 10:15", read: false },
  { id: 3, name: "張○豪", phone: "0935-***-789", project: "潤泰菁英匯", interest: "3房・42~48坪", date: "2026.05.18 16:48", read: true },
  { id: 4, name: "陳○玲", phone: "0922-***-567", project: "潤泰菁英匯", interest: "3房+書房・48坪", date: "2026.05.17 09:22", read: true },
  { id: 5, name: "林○宏", phone: "0988-***-234", project: "潤泰菁英匯", interest: "4房・58坪", date: "2026.05.16 13:05", read: true },
];

const STATUS_MAP = {
  live: { label: "上架中", color: "#5a8a6a", bg: "#eaf5ee" },
  draft: { label: "草稿", color: "#a8a098", bg: "#f0ebe0" },
  review: { label: "審核中", color: "#c0903a", bg: "#fef6e8" },
  sold: { label: "已完銷", color: "#8a78a0", bg: "#f0ecf5" },
};

function StatCard({ value, label, sub, color }) {
  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", flex: 1, boxShadow: "0 2px 8px rgba(80,70,50,0.03)" }}>
      <div style={{ fontSize: 28, fontWeight: 900, color: color || "#3a3632" }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#3a3632", marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "#b8b0a8", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function ProjectEditor({ project, onBack }) {
  const [tab, setTab] = useState("basic");
  const tabs = [
    { id: "basic", label: "基本資料" },
    { id: "media", label: "照片影片" },
    { id: "detail", label: "建案亮點" },
    { id: "plans", label: "格局規劃" },
  ];

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#5a8a6a", fontWeight: 600, fontFamily: "inherit", padding: "0 0 20px", display: "flex", alignItems: "center", gap: 4 }}>← 返回建案列表</button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#3a3632", margin: 0 }}>{project?.name || "新增建案"}</h2>
          {project && <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 10, background: STATUS_MAP[project.status].bg, color: STATUS_MAP[project.status].color, fontWeight: 700, marginTop: 6, display: "inline-block" }}>{STATUS_MAP[project.status].label}</span>}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ padding: "10px 24px", borderRadius: 14, border: "2px solid #d4c8b0", background: "transparent", color: "#6a6258", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>儲存草稿</button>
          <button style={{ padding: "10px 24px", borderRadius: 14, border: "none", background: "#5a8a6a", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 12px rgba(90,138,106,0.2)" }}>送出審核</button>
        </div>
      </div>

      {/* tabs */}
      <div style={{ display: "flex", gap: 4, background: "#f0ebe0", borderRadius: 16, padding: 4, marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "10px 0", borderRadius: 12, border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: tab === t.id ? 700 : 500,
            background: tab === t.id ? "#fff" : "transparent",
            color: tab === t.id ? "#3a3632" : "#a8a098",
            boxShadow: tab === t.id ? "0 2px 8px rgba(80,70,50,0.06)" : "none",
            transition: "all 0.2s", fontFamily: "inherit",
          }}>{t.label}</button>
        ))}
      </div>

      {/* tab content */}
      <div style={{ background: "#fff", borderRadius: 24, padding: "32px", boxShadow: "0 2px 10px rgba(80,70,50,0.03)" }}>
        {tab === "basic" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="建案名稱" value={project?.name} placeholder="例：潤泰菁英匯" />
              <Field label="建商名稱" value="潤泰創新國際" placeholder="公司名稱" />
              <Field label="縣市 / 行政區" value={project?.area} placeholder="例：台北市中山區" />
              <Field label="詳細地址" value="中山北路二段" placeholder="路段門牌" />
              <Field label="建案類型" value={project?.type} type="select" options={["預售屋", "新成屋"]} />
              <Field label="預計完工" value="2028" placeholder="年份" />
              <Field label="每坪單價範圍" value={project?.price} placeholder="例：55~72" suffix="萬/坪" />
              <Field label="總戶數" value="128" placeholder="戶" />
              <Field label="樓層" value="地上24樓/地下4樓" placeholder="樓層說明" />
              <Field label="坪數範圍" value="42~58" placeholder="例：42~58" suffix="坪" />
              <Field label="格局" value="3~4房" placeholder="例：2~4房" />
              <Field label="公設比" value="34.5" placeholder="%" suffix="%" />
              <Field label="結構" value="SRC鋼骨鋼筋混凝土" type="select" options={["RC鋼筋混凝土", "SRC鋼骨鋼筋混凝土", "SC鋼骨", "加強磚造"]} />
              <Field label="基地面積" value="862" placeholder="坪" suffix="坪" />
            </div>
            <Field label="建案標語" value="精工築藝・敬獻城心" placeholder="一句話描述建案特色（限50字）" full />
          </div>
        )}

        {tab === "media" && (
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#3a3632", marginBottom: 6 }}>建案照片</div>
            <div style={{ fontSize: 12, color: "#a8a098", marginBottom: 20 }}>建議上傳至少 5 張，包含外觀、公設、室內實景。精選方案最多 30 張。</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{
                  height: 120, borderRadius: 16, border: i < 3 ? "none" : "2px dashed #d4c8b0",
                  background: i < 3 ? "#e8e2d8" : "#faf6ee",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.2s", position: "relative",
                }}>
                  {i < 3 ? (
                    <>
                      <span style={{ fontSize: 12, color: "#a8a098" }}>已上傳</span>
                      <div style={{ position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: 11, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, cursor: "pointer" }}>✕</div>
                      {i === 0 && <div style={{ position: "absolute", bottom: 8, left: 8, fontSize: 9, background: "#5a8a6a", color: "#fff", padding: "2px 8px", borderRadius: 8, fontWeight: 700 }}>封面</div>}
                    </>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 22, marginBottom: 4 }}>+</div>
                      <div style={{ fontSize: 10, color: "#b8b0a8" }}>上傳照片</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ fontSize: 16, fontWeight: 700, color: "#3a3632", marginBottom: 6 }}>影片連結</div>
            <div style={{ fontSize: 12, color: "#a8a098", marginBottom: 12 }}>支援 YouTube 連結</div>
            <Field label="" value="" placeholder="https://youtube.com/watch?v=..." full />

            <div style={{ fontSize: 16, fontWeight: 700, color: "#3a3632", marginBottom: 6, marginTop: 24 }}>360° 環景連結</div>
            <div style={{ fontSize: 12, color: "#a8a098", marginBottom: 12 }}>支援 Matterport 或其他環景服務連結</div>
            <Field label="" value="" placeholder="https://my.matterport.com/show/?m=..." full />
          </div>
        )}

        {tab === "detail" && (
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#3a3632", marginBottom: 6 }}>建案亮點</div>
            <div style={{ fontSize: 12, color: "#a8a098", marginBottom: 20 }}>設定 3~5 個最吸引買家的特色。可上傳自訂插畫或使用系統圖示。</div>
            {[
              { title: "捷運中山站步行 5 分鐘", desc: "松山新店線、淡水信義線雙線交會" },
              { title: "SRC 鋼骨結構", desc: "耐震等級最高規格" },
              { title: "飯店式管理", desc: "24 小時禮賓服務" },
            ].map((h, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f0ebe0" }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#b8b0a8", cursor: "pointer", flexShrink: 0, border: "2px dashed #d4c8b0" }}>
                  上傳<br/>圖示
                </div>
                <div style={{ flex: 1 }}>
                  <input value={h.title} style={{ width: "100%", border: "none", fontSize: 14, fontWeight: 700, color: "#3a3632", background: "none", fontFamily: "inherit", outline: "none" }} readOnly />
                  <input value={h.desc} style={{ width: "100%", border: "none", fontSize: 12, color: "#a8a098", background: "none", fontFamily: "inherit", outline: "none", marginTop: 2 }} readOnly />
                </div>
                <span style={{ fontSize: 18, color: "#d4c8b0", cursor: "pointer" }}>⋮</span>
              </div>
            ))}
            <button style={{ marginTop: 16, padding: "10px 20px", borderRadius: 14, border: "2px dashed #d4c8b0", background: "none", color: "#8a8278", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", width: "100%" }}>+ 新增亮點</button>
          </div>
        )}

        {tab === "plans" && (
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#3a3632", marginBottom: 6 }}>格局規劃</div>
            <div style={{ fontSize: 12, color: "#a8a098", marginBottom: 20 }}>上傳各戶型的格局圖和說明</div>
            {[
              { name: "A 戶型", ping: "42坪", rooms: "3房2廳2衛" },
              { name: "B 戶型", ping: "48坪", rooms: "3房2廳2衛+書房" },
            ].map((fp, i) => (
              <div key={i} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: "1px solid #f0ebe0" }}>
                <div style={{ width: 100, height: 80, borderRadius: 14, background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#b8b0a8", cursor: "pointer", flexShrink: 0, border: "2px dashed #d4c8b0", textAlign: "center" }}>
                  上傳<br/>格局圖
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                  <input value={fp.name} style={{ border: "none", fontSize: 15, fontWeight: 700, color: "#3a3632", background: "none", fontFamily: "inherit", outline: "none" }} readOnly />
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 12, color: "#8a8278" }}>{fp.ping}</span>
                    <span style={{ fontSize: 12, color: "#8a8278" }}>{fp.rooms}</span>
                  </div>
                  <input value="方正格局，客廳開窗面寬 4.2 米" style={{ border: "none", fontSize: 12, color: "#a8a098", background: "none", fontFamily: "inherit", outline: "none" }} readOnly />
                </div>
                <span style={{ fontSize: 18, color: "#d4c8b0", cursor: "pointer", alignSelf: "center" }}>⋮</span>
              </div>
            ))}
            <button style={{ marginTop: 16, padding: "10px 20px", borderRadius: 14, border: "2px dashed #d4c8b0", background: "none", color: "#8a8278", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", width: "100%" }}>+ 新增戶型</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, placeholder, type, options, suffix, full }) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : undefined }}>
      {label && <div style={{ fontSize: 12, fontWeight: 600, color: "#6a6258", marginBottom: 6 }}>{label}</div>}
      <div style={{ position: "relative" }}>
        {type === "select" ? (
          <select defaultValue={value} style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: "1px solid #e8e0d4", fontSize: 14, color: "#3a3632", background: "#faf8f4", fontFamily: "inherit", appearance: "none", outline: "none" }}>
            {options?.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input defaultValue={value} placeholder={placeholder} style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: "1px solid #e8e0d4", fontSize: 14, color: "#3a3632", background: "#faf8f4", fontFamily: "inherit", outline: "none" }} />
        )}
        {suffix && <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#b8b0a8" }}>{suffix}</span>}
      </div>
    </div>
  );
}

export default function BuilderDashboard() {
  const [page, setPage] = useState("dashboard");
  const [editProject, setEditProject] = useState(null);
  const sideItems = [
    { id: "dashboard", icon: "📊", label: "數據總覽" },
    { id: "projects", icon: "🏠", label: "建案管理" },
    { id: "leads", icon: "👥", label: "預約名單" },
    { id: "plan", icon: "💎", label: "方案帳務" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Noto Sans TC','Nunito',sans-serif", background: "#f8f4ec" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Noto+Sans+TC:wght@300;400;500;700;800;900&display=swap');
        @keyframes su{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:0;height:0}
        input::placeholder{color:#c8c0b8}
      `}</style>

      {/* SIDEBAR */}
      <div style={{ width: 220, background: "#3a3632", padding: "24px 16px", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "#5a8a6a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏡</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#f8f4ec" }}>好室宅吉便</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>建商管理後台</div>
          </div>
        </div>

        {sideItems.map(item => (
          <button key={item.id} onClick={() => { setPage(item.id); setEditProject(null); }} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12,
            border: "none", cursor: "pointer", width: "100%", textAlign: "left",
            background: page === item.id ? "rgba(255,255,255,0.1)" : "transparent",
            color: page === item.id ? "#f8f4ec" : "rgba(255,255,255,0.45)",
            fontSize: 13, fontWeight: page === item.id ? 700 : 500,
            transition: "all 0.2s", fontFamily: "inherit", marginBottom: 4,
          }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div style={{ marginTop: "auto", padding: "16px 14px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>潤泰創新國際</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>精選展示方案・到期 2026.12</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "28px 36px", overflowY: "auto" }}>

        {/* ═══ DASHBOARD ═══ */}
        {page === "dashboard" && (
          <div style={{ animation: "su 0.3s ease" }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#3a3632", marginBottom: 4 }}>數據總覽</h1>
            <p style={{ fontSize: 13, color: "#a8a098", marginBottom: 28 }}>近 30 天表現</p>
            <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
              <StatCard value="3,842" label="總曝光" sub="↑ 12% vs 上月" color="#3a3632" />
              <StatCard value="286" label="總點擊" sub="CTR 7.4%" color="#5a8a6a" />
              <StatCard value="18" label="預約賞屋" sub="↑ 28% vs 上月" color="#c0903a" />
              <StatCard value="6.3%" label="預約轉換率" sub="高於平台均值" color="#8a78a0" />
            </div>
            <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", boxShadow: "0 2px 8px rgba(80,70,50,0.03)" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#3a3632", marginBottom: 16 }}>曝光趨勢（近 30 天）</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 120 }}>
                {[60,72,55,80,90,68,75,95,88,110,105,92,120,115,108,130,125,140,135,128,145,150,138,155,148,160,155,170,165,158].map((v, i) => (
                  <div key={i} style={{
                    flex: 1, background: `linear-gradient(to top, #5a8a6a, #7ab89a)`,
                    borderRadius: "4px 4px 0 0", height: `${(v / 170) * 100}%`,
                    opacity: 0.4 + (v / 170) * 0.6, transition: "height 0.3s",
                    minWidth: 4,
                  }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10, color: "#b8b0a8" }}>
                <span>4/21</span><span>4/28</span><span>5/5</span><span>5/12</span><span>5/20</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ PROJECTS ═══ */}
        {page === "projects" && !editProject && (
          <div style={{ animation: "su 0.3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: "#3a3632", marginBottom: 4 }}>建案管理</h1>
                <p style={{ fontSize: 13, color: "#a8a098" }}>管理你的所有建案</p>
              </div>
              <button onClick={() => setEditProject({ id: null, name: "", status: "draft" })} style={{ padding: "10px 24px", borderRadius: 14, border: "none", background: "#5a8a6a", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 12px rgba(90,138,106,0.2)" }}>+ 新增建案</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {MOCK_PROJECTS.map(p => {
                const st = STATUS_MAP[p.status];
                return (
                  <div key={p.id} onClick={() => setEditProject(p)} style={{
                    background: "#fff", borderRadius: 20, padding: "20px 24px",
                    display: "flex", alignItems: "center", gap: 20, cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(80,70,50,0.03)", transition: "all 0.2s",
                  }}>
                    <div style={{ width: 64, height: 48, borderRadius: 12, background: "#f0ebe0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#b8b0a8", flexShrink: 0 }}>
                      {p.images}張
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 800, color: "#3a3632" }}>{p.name}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: st.color, background: st.bg, padding: "2px 8px", borderRadius: 8 }}>{st.label}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#a8a098" }}>{p.area}｜{p.type}｜{p.price} 萬/坪｜更新 {p.updated}</div>
                    </div>
                    <div style={{ display: "flex", gap: 20, flexShrink: 0 }}>
                      <div style={{ textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 800, color: "#3a3632" }}>{p.views.toLocaleString()}</div><div style={{ fontSize: 10, color: "#b8b0a8" }}>曝光</div></div>
                      <div style={{ textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 800, color: "#3a3632" }}>{p.clicks}</div><div style={{ fontSize: 10, color: "#b8b0a8" }}>點擊</div></div>
                      <div style={{ textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 800, color: "#5a8a6a" }}>{p.bookings}</div><div style={{ fontSize: 10, color: "#b8b0a8" }}>預約</div></div>
                    </div>
                    <span style={{ fontSize: 18, color: "#d4c8b0" }}>›</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {page === "projects" && editProject && (
          <ProjectEditor project={editProject.id ? editProject : null} onBack={() => setEditProject(null)} />
        )}

        {/* ═══ LEADS ═══ */}
        {page === "leads" && (
          <div style={{ animation: "su 0.3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: "#3a3632", marginBottom: 4 }}>預約名單</h1>
                <p style={{ fontSize: 13, color: "#a8a098" }}>消費者的賞屋預約</p>
              </div>
              <button style={{ padding: "10px 24px", borderRadius: 14, border: "2px solid #d4c8b0", background: "transparent", color: "#6a6258", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>匯出 CSV</button>
            </div>
            <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 8px rgba(80,70,50,0.03)" }}>
              {/* header */}
              <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr 1fr 1.5fr 0.6fr", gap: 12, padding: "14px 24px", borderBottom: "2px solid #f0ebe0" }}>
                {["姓名", "建案", "感興趣", "預約時間", "狀態"].map(h => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#a8a098" }}>{h}</span>
                ))}
              </div>
              {/* rows */}
              {MOCK_LEADS.map((l, i) => (
                <div key={l.id} style={{
                  display: "grid", gridTemplateColumns: "0.8fr 1.2fr 1fr 1.5fr 0.6fr", gap: 12,
                  padding: "16px 24px", borderBottom: "1px solid #f5f0e8",
                  background: l.read ? "transparent" : "#fefcf6",
                  animation: `su 0.3s ease ${i * 40}ms both`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {!l.read && <div style={{ width: 6, height: 6, borderRadius: 3, background: "#c0903a", flexShrink: 0 }} />}
                    <span style={{ fontSize: 14, fontWeight: l.read ? 500 : 700, color: "#3a3632" }}>{l.name}</span>
                  </div>
                  <span style={{ fontSize: 13, color: "#8a8278" }}>{l.project}</span>
                  <span style={{ fontSize: 13, color: "#8a8278" }}>{l.interest}</span>
                  <span style={{ fontSize: 12, color: "#b8b0a8" }}>{l.date}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: l.read ? "#b8b0a8" : "#c0903a" }}>{l.read ? "已讀" : "未讀"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ PLAN ═══ */}
        {page === "plan" && (
          <div style={{ animation: "su 0.3s ease" }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#3a3632", marginBottom: 4 }}>方案與帳務</h1>
            <p style={{ fontSize: 13, color: "#a8a098", marginBottom: 28 }}>目前方案與付款紀錄</p>

            {/* current plan */}
            <div style={{ background: "linear-gradient(135deg, #5a8a6a, #4a7a5a)", borderRadius: 24, padding: "28px 32px", marginBottom: 24, color: "#fff", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 3, marginBottom: 8 }}>目前方案</div>
              <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>💎 精選展示方案</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>到期日 2026.12.31・自動續約已開啟</div>
              <div style={{ display: "flex", gap: 12 }}>
                <button style={{ padding: "10px 24px", borderRadius: 14, border: "none", background: "#fff", color: "#3a6a4a", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>升級為旗艦</button>
                <button style={{ padding: "10px 24px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>管理付款</button>
              </div>
            </div>

            {/* plan comparison */}
            <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", boxShadow: "0 2px 8px rgba(80,70,50,0.03)" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#3a3632", marginBottom: 20 }}>方案比較</div>
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 0 }}>
                {/* header */}
                {["", "基礎（免費）", "精選展示", "品牌旗艦"].map((h, i) => (
                  <div key={i} style={{ padding: "12px 16px", fontWeight: 700, fontSize: 13, color: i === 2 ? "#5a8a6a" : "#3a3632", background: i === 2 ? "#eaf5ee" : "transparent", borderRadius: i === 2 ? "12px 12px 0 0" : 0 }}>{h}</div>
                ))}
                {/* rows */}
                {[
                  ["建案基本資訊", "✓", "✓", "✓"],
                  ["照片上傳", "5 張", "30 張", "30 張"],
                  ["影片 / 環景", "—", "✓", "✓"],
                  ["建材規格表", "—", "✓", "✓"],
                  ["精選卡片", "—", "✓", "✓"],
                  ["Hero Banner", "—", "—", "✓"],
                  ["旅程內文廣告", "—", "—", "✓"],
                  ["預約按鈕", "—", "✓", "✓"],
                  ["月度報告", "—", "—", "✓"],
                  ["月費", "$0", "$15,000~30,000", "$50,000~80,000"],
                ].map((row, i) => (
                  <>{row.map((cell, j) => (
                    <div key={`${i}-${j}`} style={{
                      padding: "10px 16px", fontSize: j === 0 ? 12 : 13,
                      fontWeight: j === 0 ? 600 : (i === row.length ? 800 : 500),
                      color: j === 0 ? "#6a6258" : (cell === "—" ? "#d4c8b0" : (cell === "✓" ? "#5a8a6a" : "#3a3632")),
                      borderBottom: "1px solid #f5f0e8",
                      background: j === 2 ? "#f8fcf8" : "transparent",
                    }}>{cell}</div>
                  ))}</>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
