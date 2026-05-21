import { NextResponse } from "next/server";
import { getMany } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat"));
  const lng = parseFloat(searchParams.get("lng"));

  if (!lat || !lng) {
    return NextResponse.json({ error: "lat and lng required" }, { status: 400 });
  }

  const point = `ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`;

  // Check liquefaction
  const liquefaction = await getMany(`
    SELECT risk_level, properties
    FROM risk_layers
    WHERE layer_type = 'liquefaction'
      AND ST_Contains(geom, ${point})
    LIMIT 1
  `);

  // Check nearest fault
  const fault = await getMany(`
    SELECT name, ROUND(ST_Distance(geom::geography, ${point}::geography)) AS distance_m
    FROM risk_layers
    WHERE layer_type = 'fault'
    ORDER BY geom <-> ${point}
    LIMIT 1
  `);

  // Check flood
  const flood = await getMany(`
    SELECT risk_level, properties
    FROM risk_layers
    WHERE layer_type = 'flood'
      AND ST_Contains(geom, ${point})
    LIMIT 1
  `);

  // Check nuisance facilities within 500m
  const nuisance = await getMany(`
    SELECT name, sub_type, risk_level,
           ROUND(ST_Distance(geom::geography, ${point}::geography)) AS distance_m
    FROM risk_layers
    WHERE layer_type = 'nuisance'
      AND ST_DWithin(geom::geography, ${point}::geography, 500)
    ORDER BY ST_Distance(geom::geography, ${point}::geography)
  `);

  const checks = [
    {
      type: "liquefaction",
      label: "土壤液化潛勢",
      result: liquefaction[0]?.risk_level === "high" ? "高潛勢區" :
              liquefaction[0]?.risk_level === "medium" ? "中潛勢區" : "低潛勢區",
      level: liquefaction[0]?.risk_level === "high" ? "danger" :
             liquefaction[0]?.risk_level === "medium" ? "warn" : "safe",
    },
    {
      type: "fault",
      label: "活動斷層",
      result: fault[0] ? `距 ${fault[0].name} ${(fault[0].distance_m / 1000).toFixed(1)}km` : "無資料",
      level: fault[0]?.distance_m < 500 ? "danger" : fault[0]?.distance_m < 2000 ? "warn" : "safe",
    },
    {
      type: "flood",
      label: "淹水潛勢",
      result: flood[0] ? `${flood[0].properties?.depth || "有"}潛勢` : "無淹水紀錄",
      level: flood[0]?.risk_level === "high" ? "danger" : flood[0] ? "warn" : "safe",
    },
    {
      type: "nuisance",
      label: "嫌惡設施",
      result: nuisance.length > 0 ? `500m 內 ${nuisance.length} 處` : "500m 內無設施",
      level: nuisance.length >= 3 ? "warn" : "safe",
    },
  ];

  const summary = {
    safe: checks.filter(c => c.level === "safe").length,
    warn: checks.filter(c => c.level === "warn").length,
    danger: checks.filter(c => c.level === "danger").length,
  };

  return NextResponse.json({ checks, nuisance_facilities: nuisance, summary });
}
