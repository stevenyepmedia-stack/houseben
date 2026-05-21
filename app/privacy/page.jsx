import Link from "next/link";

export const metadata = { title: "隱私政策 — 好室宅吉便" };

const SECTIONS = [
  {
    h: "1. 我們蒐集的資料",
    p: "當你使用 Google 帳號登入時，我們會取得你的姓名、電子郵件與大頭貼。當你使用試算與查詢工具時，你輸入的內容（如收入、地址）會用於即時計算，我們不會將其與你的身分綁定儲存。",
  },
  {
    h: "2. 資料的用途",
    p: "我們使用上述資料來：建立並辨識你的帳號、提供收藏與紀錄功能、改善服務品質。我們不會將你的個人資料出售給第三方。",
  },
  {
    h: "3. 第三方服務",
    p: "本服務使用 Google 提供登入驗證。當你選擇以 Google 登入，你與 Google 之間的互動同時受 Google 隱私政策規範。本服務的圖資與資料亦可能引用政府開放資料平台。",
  },
  {
    h: "4. Cookie 與工作階段",
    p: "為了維持你的登入狀態，本服務會在你的瀏覽器存放必要的工作階段資訊。你可以隨時透過瀏覽器設定清除這些資訊，但這可能導致你需要重新登入。",
  },
  {
    h: "5. 資料安全與保存",
    p: "我們採取合理的技術與管理措施保護你的資料。當你刪除帳號或要求移除資料時，我們會在合理期間內刪除相關個人資料，但法律要求保留者除外。",
  },
  {
    h: "6. 你的權利",
    p: "你有權查詢、更正或刪除我們所持有的你的個人資料，也可以隨時停止使用本服務並要求刪除帳號。如需行使權利，請透過下方聯絡方式與我們聯繫。",
  },
  {
    h: "7. 聯絡我們",
    p: "對本隱私政策有任何疑問，歡迎來信與我們聯繫，我們會盡快回覆。",
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ background: "#f8f4ec", minHeight: "100vh", fontFamily: "'Noto Sans TC','Nunito',sans-serif" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "18px 28px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", width: "fit-content" }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: "#5a8a6a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏡</div>
          <span style={{ fontSize: 17, fontWeight: 800, color: "#3a3632", letterSpacing: 1 }}>好室宅吉便</span>
        </Link>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "16px 28px 80px" }}>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: "#3a3632", letterSpacing: 2, marginBottom: 6 }}>隱私政策</h1>
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
