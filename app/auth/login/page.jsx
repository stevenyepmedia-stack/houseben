"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ background: "#f8f4ec", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans TC','Nunito',sans-serif" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", width: "100%", padding: "18px 28px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", width: "fit-content" }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: "#5a8a6a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏡</div>
          <span style={{ fontSize: 17, fontWeight: 800, color: "#3a3632", letterSpacing: 1 }}>好室宅吉便</span>
        </Link>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 28px 64px" }}>
        <div style={{ background: "#fff", borderRadius: 28, padding: "48px 40px", maxWidth: 380, width: "100%", boxShadow: "0 8px 32px rgba(80,70,50,0.08)", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏡</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#3a3632", letterSpacing: 1, marginBottom: 8 }}>歡迎回來</h1>
          <p style={{ fontSize: 13, color: "#a8a098", lineHeight: 1.8, marginBottom: 32 }}>
            登入後即可收藏建案、追蹤你的買房旅程
          </p>

          <button
            onClick={() => { setLoading(true); signIn("google", { callbackUrl: "/" }); }}
            disabled={loading}
            style={{ width: "100%", padding: "14px 0", borderRadius: 24, border: "1px solid #e0d8c8", background: "#fff", color: "#3a3632", fontSize: 14, fontWeight: 700, cursor: loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "inherit", opacity: loading ? 0.6 : 1 }}
          >
            <GoogleIcon /> {loading ? "前往 Google…" : "用 Google 帳號繼續"}
          </button>

          <p style={{ fontSize: 11, color: "#c8c0b8", lineHeight: 2, marginTop: 24 }}>
            繼續即表示你同意我們的<br />
            <Link href="/terms" style={{ color: "#8a8278" }}>使用條款</Link>
            {" 與 "}
            <Link href="/privacy" style={{ color: "#8a8278" }}>隱私政策</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
