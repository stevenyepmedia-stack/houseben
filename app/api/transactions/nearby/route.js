import { NextResponse } from "next/server";
import { getMany } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat"));
  const lng = parseFloat(searchParams.get("lng"));
  const radius = parseInt(searchParams.get("radius") || "500");
  const months = parseInt(searchParams.get("months") || "12");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

  if (!lat || !lng) {
    return NextResponse.json({ error: "lat and lng required" }, { status: 400 });
  }

  const data = await getMany(`
    SELECT id, city, district, address, transaction_date,
           total_price, unit_price_ping, building_area_ping,
           building_type, rooms, halls, bathrooms, total_floors,
           transfer_floor, build_year,
           ROUND(ST_Distance(
             geom::geography,
             ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
           )) AS distance_m
    FROM transactions
    WHERE ST_DWithin(
      geom::geography,
      ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
      $3
    )
    AND transaction_date >= NOW() - ($4 || ' months')::INTERVAL
    AND transaction_type = 'sale'
    AND unit_price_ping > 0
    ORDER BY transaction_date DESC
    LIMIT $5
  `, [lat, lng, radius, months, limit]);

  // Calculate stats
  const prices = data.map(d => d.unit_price_ping).filter(Boolean);
  const avg = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  const sorted = [...prices].sort((a, b) => a - b);
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;

  return NextResponse.json({
    data,
    stats: {
      count: prices.length,
      avg_price: avg,
      median_price: median,
      min_price: Math.min(...prices) || 0,
      max_price: Math.max(...prices) || 0,
    },
  });
}
