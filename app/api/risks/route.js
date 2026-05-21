import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json({
    checks: [
      { type: "liquefaction", label: "土壤液化", result: "低潛勢區", level: "safe" },
      { type: "fault", label: "活動斷層", result: "距 3.2km", level: "safe" },
      { type: "flood", label: "淹水潛勢", result: "0.3m", level: "warn" },
      { type: "nuisance", label: "嫌惡設施", result: "500m 內 2 處", level: "safe" },
    ],
    summary: { safe: 3, warn: 1, danger: 0 },
  });
}
