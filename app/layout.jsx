import "./globals.css";

export const metadata = {
  title: "好室宅吉便 — 用資料說話・陪你找到家",
  description: "整合政府開放資料，從預算診斷到交屋驗收，用透明資訊幫你買到真正適合的好宅。",
  openGraph: {
    title: "好室宅吉便",
    description: "買房這件事，你不需要一個人搞懂",
    siteName: "好室宅吉便",
    locale: "zh_TW",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Noto+Sans+TC:wght@300;400;500;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
