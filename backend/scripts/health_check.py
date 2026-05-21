"""健康檢查腳本"""
import os, sys, psycopg2, requests

DB_URL = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/haoshih")
MEILI_URL = os.environ.get("MEILI_URL", "http://localhost:7700")

checks = []

# DB
try:
    conn = psycopg2.connect(DB_URL, connect_timeout=5)
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM transactions")
    count = cur.fetchone()[0]
    checks.append(f"✅ DB: {count:,} transactions")
    cur.execute("SELECT COUNT(*) FROM communities")
    checks.append(f"✅ DB: {cur.fetchone()[0]:,} communities")
    cur.execute("SELECT MAX(batch_date) FROM transactions")
    checks.append(f"✅ DB: latest batch {cur.fetchone()[0]}")
    conn.close()
except Exception as e:
    checks.append(f"❌ DB: {e}")

# Meilisearch
try:
    r = requests.get(f"{MEILI_URL}/health", timeout=5)
    checks.append(f"✅ Search: {r.json().get('status', 'unknown')}")
except Exception as e:
    checks.append(f"❌ Search: {e}")

for c in checks:
    print(c)

if any("❌" in c for c in checks):
    sys.exit(1)
