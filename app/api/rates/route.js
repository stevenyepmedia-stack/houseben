import { NextResponse } from "next/server";
import { getMany, getOne } from "@/lib/db";

export async function GET() {
  const latest = await getOne(`
    SELECT rate_value, effective_date
    FROM interest_rates
    WHERE bank_group = 'five_major' AND rate_type = 'mortgage_new'
    ORDER BY effective_date DESC LIMIT 1
  `);

  const history = await getMany(`
    SELECT rate_value, effective_date
    FROM interest_rates
    WHERE bank_group = 'five_major' AND rate_type = 'mortgage_new'
    ORDER BY effective_date DESC LIMIT 24
  `);

  return NextResponse.json({
    five_major: {
      mortgage_new: latest?.rate_value || 2.03,
      effective_date: latest?.effective_date,
    },
    history,
    new_youth_plan: {
      rate: 2.03,
      max_ltv: 0.8,
      grace_period_years: 5,
      eligible: "首購族、名下無自住住宅",
    },
  });
}
