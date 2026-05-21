import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json({
    five_major: { mortgage_new: 2.03, effective_date: "2026-05-01" },
    history: [],
    new_youth_plan: { rate: 2.03, max_ltv: 0.8, grace_period_years: 5 },
  });
}
