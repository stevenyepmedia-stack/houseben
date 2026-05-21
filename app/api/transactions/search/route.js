import { NextResponse } from "next/server";
import { getMany } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const city = searchParams.get("city");
  const district = searchParams.get("district");
  const type = searchParams.get("type") || "sale";
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const offset = parseInt(searchParams.get("offset") || "0");

  let where = ["transaction_type = $1"];
  let params = [type];
  let idx = 2;

  if (q) {
    where.push(`full_address ILIKE $${idx}`);
    params.push(`%${q}%`);
    idx++;
  }
  if (city) {
    where.push(`city = $${idx}`);
    params.push(city);
    idx++;
  }
  if (district) {
    where.push(`district = $${idx}`);
    params.push(district);
    idx++;
  }

  const whereClause = where.join(" AND ");

  const [countResult, data] = await Promise.all([
    getMany(`SELECT COUNT(*) FROM transactions WHERE ${whereClause}`, params),
    getMany(`
      SELECT id, city, district, address, full_address, transaction_date,
             total_price, unit_price_ping, building_area_ping,
             building_type, rooms, halls, bathrooms, total_floors,
             transfer_floor, build_year, has_management
      FROM transactions
      WHERE ${whereClause}
      ORDER BY transaction_date DESC
      LIMIT $${idx} OFFSET $${idx + 1}
    `, [...params, limit, offset]),
  ]);

  return NextResponse.json({
    total: parseInt(countResult[0]?.count || 0),
    data,
  });
}
