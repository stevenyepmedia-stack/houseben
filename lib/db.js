import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (duration > 100) {
    console.log("Slow query:", { text: text.slice(0, 80), duration, rows: res.rowCount });
  }
  return res;
}

export async function getOne(text, params) {
  const res = await query(text, params);
  return res.rows[0] || null;
}

export async function getMany(text, params) {
  const res = await query(text, params);
  return res.rows;
}

export default pool;
