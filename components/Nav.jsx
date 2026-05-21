"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/projects", label: "精選建案" },
  { href: "/tools/affordability", label: "買房旅程" },
  { href: "/tools/price-check", label: "實用工具" },
  { href: "/dashboard", label: "建商合作" },
  { href: "/favorites", label: "我的收藏" },
];

export default function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav style={{
      maxWidth: 960, margin: "0 auto", padding: "18px 28px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div style={{
          width: 36, height: 36, borderRadius: 12, background: "#5a8a6a",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>🏡</div>
        <span style={{ fontSize: 17, fontWeight: 800, color: "#3a3632", letterSpacing: 1 }}>好室宅吉便</span>
      </Link>

      <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
        {NAV_ITEMS.map(item => (
          <Link key={item.href} href={item.href} style={{
            fontSize: 13, fontWeight: pathname === item.href ? 700 : 500,
            color: pathname === item.href ? "#3a3632" : "#8a8278",
            textDecoration: "none", whiteSpace: "nowrap",
          }}>{item.label}</Link>
        ))}
        {session ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {session.user?.image && (
              <img src={session.user.image} alt="" style={{ width: 30, height: 30, borderRadius: "50%" }} />
            )}
            <button onClick={() => signOut({ callbackUrl: "/" })} style={{
              padding: "8px 16px", borderRadius: 20, border: "1px solid #d4c8b0",
              background: "transparent", color: "#8a8278", fontSize: 12, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
            }}>登出</button>
          </div>
        ) : (
          <Link href="/auth/login" style={{
            padding: "8px 20px", borderRadius: 20,
            background: "#3a3632", color: "#f8f4ec", fontSize: 12, fontWeight: 700,
            textDecoration: "none", whiteSpace: "nowrap",
          }}>登入</Link>
        )}
      </div>
    </nav>
  );
}
