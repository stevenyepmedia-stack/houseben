"""
利率資料擷取管線
從中央銀行網站擷取五大行庫新承做房貸利率
"""
import os
import re
import logging
from datetime import date
from decimal import Decimal

import requests
from bs4 import BeautifulSoup
import psycopg2

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

DB_URL = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/haoshih")
CBC_URL = "https://www.cbc.gov.tw/tw/cp-528-68030-5BB9B-1.html"


def fetch_rates():
    """擷取央行五大行庫房貸利率頁面"""
    logger.info("Fetching interest rates from CBC...")
    resp = requests.get(CBC_URL, timeout=30)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")
    tables = soup.find_all("table")

    rates = []
    for table in tables:
        rows = table.find_all("tr")
        for row in rows:
            cells = row.find_all(["td", "th"])
            text = [c.get_text(strip=True) for c in cells]

            # 找到包含利率數字的行
            for i, t in enumerate(text):
                rate_match = re.search(r"(\d+\.\d+)", t)
                if rate_match and i > 0:
                    rate_val = Decimal(rate_match.group(1))
                    if 1.0 < rate_val < 5.0:  # 合理的房貸利率範圍
                        rates.append({
                            "bank_group": "five_major",
                            "rate_type": "mortgage_new",
                            "rate_value": rate_val,
                            "effective_date": date.today().replace(day=1),
                            "raw_source": " | ".join(text),
                        })
                        break

    logger.info(f"Found {len(rates)} rate entries")
    return rates


def save_rates(rates: list):
    """儲存利率資料"""
    conn = psycopg2.connect(DB_URL)
    try:
        with conn.cursor() as cur:
            for r in rates:
                cur.execute("""
                    INSERT INTO interest_rates (bank_group, rate_type, rate_value, effective_date, raw_source)
                    VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (bank_group, rate_type, effective_date) DO UPDATE
                    SET rate_value = EXCLUDED.rate_value, raw_source = EXCLUDED.raw_source
                """, (r["bank_group"], r["rate_type"], r["rate_value"], r["effective_date"], r["raw_source"]))
        conn.commit()
        logger.info(f"✅ Saved {len(rates)} rate entries")
    finally:
        conn.close()


if __name__ == "__main__":
    rates = fetch_rates()
    if rates:
        save_rates(rates)
    else:
        logger.warning("No rates found, check if CBC page structure changed")
