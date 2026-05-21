import Link from "next/link";

export const metadata = { title: "使用條款 — 好室宅吉便" };

const SECTIONS = [
  {
    h: "1. 服務說明",
    p: "好室宅吉便（以下稱「本服務」）是一個整合政府公開資料的買房資訊平台，提供購屋力試算、合理房價查詢、區域風險檢視與建案資訊等工具。本服務僅供參考，不構成任何投資、財務或法律建議。",
  },
  {
    h: "2. 資料來源與免責",
    p: "本服務呈現的實價登錄、利率、風險圖資等內容，來自政府開放資料及第三方來源。我們會盡力維持資料正確與更新，但不保證其完整性、即時性或無誤。你在做出購屋決定前，應自行向相關單位查證。因使用本服務內容所生之任何損失，本服務不負賠償責任。",
  },
  {
    h: "3. 使用規範",
    p: "你同意不以自動化程式大量擷取本服務資料、不從事干擾服務運作之行為、不上傳違法或侵害他人權利之內容。違反者，我們得暫停或終止你的使用權限。",
  },
  {
    h: "4. 帳號與登入",
    p: "本服務透過 Google 帳號提供登入。你應妥善保管自己的帳號，並對該帳號下的所有活動負責。",
  },
  {
    h: "5. 智慧財產權",
    p: "本服務的介面設計、程式與原創內容之智慧財產權均屬本服務所有。未經授權，不得重製、散布或作商業利用。",
  },
  {
    h: "6. 條款變更",
    p: "我們可能不定期修訂本條款，修訂後將於本頁公告。你於條款變更後繼續使用本服務，即視為同意修訂後之內容。",
  },
];

export default function TermsPage() {
  return (
    <div style={{ background: "#f8f4ec", minHeight: "100vh", fontFamily: "'Noto Sans TC','Nunito',sans-serif" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "18px 28px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", width: "fit-content" }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: "#5a8a6a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏡</div>
          <span style={{ fontSize: 17, fontWeight: 800, color: "#3a3632", letterSpacing: 1 }}>好室宅吉便</span>
        </Link>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "16px 28px 80px" }}>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: "#3a3632", letterSpacing: 2, marginBottom: 6 }}>使用條款</h1>
        <p style={{ fontSize: 12, color: "#b8b0a8", marginBottom: 36 }}>最後更新：2026 年 5 月</p>

        {SECTIONS.map((s) => (
          <div key={s.h} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#3a3632", marginBottom: 8 }}>{s.h}</h2>
            <p style={{ fontSize: 14, color: "#6a6258", lineHeight: 2 }}>{s.p}</p>
          </div>
        ))}

        <Link href="/" style={{ fontSize: 13, fontWeight: 700, color: "#5a8a6a", textDecoration: "none" }}>← 返回首頁</Link>
      </div>
    </div>
  );
}
