import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ maxWidth: 960, margin: "0 auto", padding: "0 28px 40px" }}>
      <div style={{ textAlign: "center", padding: "20px 0 28px" }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#3a3632", letterSpacing: 2, marginBottom: 6 }}>好室宅吉便</div>
        <div style={{ fontSize: 13, color: "#b8b0a8", letterSpacing: 2, marginBottom: 24 }}>用資料說話・陪你找到家</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 32, fontSize: 12, color: "#a8a098" }}>
          {["精選建案", "買房旅程", "實用工具", "建商合作", "使用條款", "隱私政策"].map(t => (
            <span key={t} style={{ cursor: "pointer" }}>{t}</span>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#c8c0b8", marginTop: 16 }}>© 2026 好室宅吉便</div>
      </div>
    </footer>
  );
}
