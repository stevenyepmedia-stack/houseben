"""
好室宅吉便 - 實價登錄 ETL 管線
====================================
從內政部下載實價登錄批次資料，清洗後入庫。

用法：
  python fetch_real_price.py --type current     # 當期資料
  python fetch_real_price.py --type season --season 113S1  # 歷史季資料
  python fetch_real_price.py --type backfill    # 回填近3年所有季資料
"""

import os
import io
import csv
import zipfile
import logging
import argparse
import re
from datetime import datetime, date
from typing import Generator, Optional

import requests
import psycopg2
from psycopg2.extras import execute_values

# ============================================================
# 設定
# ============================================================
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

DB_URL = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/haoshih")
DOWNLOAD_BASE = "https://plvr.land.moi.gov.tw"

# 縣市代碼對照表
CITY_MAP = {
    "A": "臺北市", "B": "臺中市", "C": "基隆市", "D": "臺南市",
    "E": "高雄市", "F": "新北市", "G": "宜蘭縣", "H": "桃園市",
    "I": "嘉義市", "J": "新竹縣", "K": "苗栗縣", "L": "臺中市",  # 舊台中縣
    "M": "南投縣", "N": "彰化縣", "O": "新竹市", "P": "雲林縣",
    "Q": "嘉義縣", "R": "臺南市",  # 舊台南縣
    "S": "高雄市",  # 舊高雄縣
    "T": "屏東縣", "U": "花蓮縣", "V": "臺東縣",
    "W": "金門縣", "X": "澎湖縣", "Z": "連江縣",
}

# 交易類型對應檔名
FILE_TYPES = {
    "sale":    ["_A_lvr_land_A.csv", "_lvr_land_a.csv"],     # 買賣
    "presale": ["_A_lvr_land_B.csv", "_lvr_land_b.csv"],     # 預售
    "rent":    ["_A_lvr_land_C.csv", "_lvr_land_c.csv"],     # 租賃
}


# ============================================================
# 下載
# ============================================================
def download_current() -> bytes:
    """下載當期實價登錄批次 ZIP"""
    url = f"{DOWNLOAD_BASE}/DownloadOpenData"
    logger.info(f"Downloading current batch from {url}")
    resp = requests.get(url, timeout=120, params={"type": "zip", "fileName": "lvr_landcsv.zip"})
    resp.raise_for_status()
    logger.info(f"Downloaded {len(resp.content)} bytes")
    return resp.content


def download_season(season: str) -> bytes:
    """下載歷史季資料 ZIP（如 113S1 = 民國113年第1季）"""
    url = f"{DOWNLOAD_BASE}/DownloadSeason"
    logger.info(f"Downloading season {season}")
    resp = requests.get(url, timeout=120, params={
        "season": season, "type": "zip", "fileName": "lvr_landcsv.zip"
    })
    resp.raise_for_status()
    logger.info(f"Downloaded {len(resp.content)} bytes")
    return resp.content


# ============================================================
# 解析
# ============================================================
def parse_roc_date(roc_str: str) -> Optional[date]:
    """民國日期字串 → 西元日期（如 '1140520' → 2025-05-20）"""
    if not roc_str or len(roc_str) < 7:
        return None
    try:
        roc_str = roc_str.strip()
        year = int(roc_str[:3]) + 1911
        month = int(roc_str[3:5])
        day = int(roc_str[5:7])
        if month < 1 or month > 12 or day < 1 or day > 31:
            return None
        return date(year, month, day)
    except (ValueError, IndexError):
        return None


def parse_roc_year_month(roc_str: str) -> tuple:
    """民國年月 → (西元年, 月)，如 '1050' → (2016, None), '10503' → (2016, 3)"""
    if not roc_str or len(roc_str) < 3:
        return None, None
    try:
        roc_str = roc_str.strip()
        if len(roc_str) <= 3:
            return int(roc_str) + 1911, None
        year = int(roc_str[:3]) + 1911
        month = int(roc_str[3:]) if len(roc_str) > 3 else None
        return year, month
    except ValueError:
        return None, None


def safe_int(val: str, default: int = 0) -> int:
    """安全轉換整數"""
    try:
        return int(float(str(val).strip().replace(",", "")))
    except (ValueError, TypeError):
        return default


def safe_float(val: str, default: float = 0.0) -> float:
    """安全轉換浮點數"""
    try:
        return float(str(val).strip().replace(",", ""))
    except (ValueError, TypeError):
        return default


def detect_city_from_filename(filename: str) -> str:
    """從檔名偵測縣市代碼"""
    # 格式通常是 A_lvr_land_A.csv 或 manifest 內的路徑
    basename = os.path.basename(filename).upper()
    for code in CITY_MAP:
        if basename.startswith(code + "_"):
            return CITY_MAP[code]
    # fallback: 取第一個字母
    if basename and basename[0] in CITY_MAP:
        return CITY_MAP[basename[0]]
    return "未知"


def detect_tx_type(filename: str) -> str:
    """從檔名偵測交易類型"""
    fn = filename.lower()
    if "_b." in fn or "_b_" in fn or "land_b" in fn:
        return "presale"
    if "_c." in fn or "_c_" in fn or "land_c" in fn:
        return "rent"
    return "sale"


def parse_csv_rows(zip_content: bytes, batch_date: date) -> Generator[dict, None, None]:
    """解壓 ZIP 並逐筆解析 CSV 資料"""
    with zipfile.ZipFile(io.BytesIO(zip_content)) as zf:
        csv_files = [f for f in zf.namelist() if f.endswith(".csv")]
        logger.info(f"Found {len(csv_files)} CSV files in ZIP")

        for csv_name in csv_files:
            city = detect_city_from_filename(csv_name)
            tx_type = detect_tx_type(csv_name)

            with zf.open(csv_name) as f:
                text = io.TextIOWrapper(f, encoding="utf-8-sig")
                reader = csv.DictReader(text)

                row_count = 0
                for row in reader:
                    # 跳過標題列（有些 CSV 第一行是中文欄位名重複）
                    if row.get("交易年月日", "").startswith("交易"):
                        continue

                    tx_date = parse_roc_date(row.get("交易年月日", ""))
                    if not tx_date:
                        continue

                    build_year, build_month = parse_roc_year_month(
                        row.get("建築完成年月", "")
                    )

                    total_price = safe_int(row.get("總價元", 0))
                    unit_price = safe_int(row.get("單價元平方公尺", 0))
                    building_area = safe_float(row.get("建物移轉總面積平方公尺", 0))
                    parking_price = safe_int(row.get("車位總價元", 0))
                    parking_area = safe_float(row.get("車位移轉總面積平方公尺", 0))

                    # 扣除車位的淨單價（如果有車位資料）
                    net_price = total_price - parking_price
                    net_area = building_area - parking_area
                    net_unit_price = round(net_price / net_area) if net_area > 0 else unit_price

                    # 組合來源 ID（用於去重）
                    source_id = row.get("編號", "")
                    if not source_id:
                        source_id = f"{city}_{tx_date}_{row.get('土地區段位置建物區段門牌', '')}"

                    district = row.get("鄉鎮市區", "").strip()
                    address = row.get("土地區段位置建物區段門牌", "").strip()

                    yield {
                        "source_id": source_id,
                        "city": city,
                        "district": district,
                        "address": address,
                        "full_address": f"{city}{district}{address}",
                        "transaction_type": tx_type,
                        "transaction_date": tx_date,
                        "total_price": total_price,
                        "unit_price": net_unit_price,
                        "building_area": building_area,
                        "land_area": safe_float(row.get("土地移轉總面積平方公尺", 0)),
                        "building_type": row.get("建物型態", "").strip(),
                        "main_use": row.get("主要用途", "").strip(),
                        "materials": row.get("主要建材", "").strip(),
                        "build_year": build_year,
                        "build_month": build_month,
                        "rooms": safe_int(row.get("建物現況格局-房", 0)),
                        "halls": safe_int(row.get("建物現況格局-廳", 0)),
                        "bathrooms": safe_int(row.get("建物現況格局-衛", 0)),
                        "compartments": safe_int(row.get("建物現況格局-隔間", 0)),
                        "total_floors": safe_int(row.get("總樓層數", 0)),
                        "transfer_floor": row.get("移轉層次", "").strip(),
                        "has_management": row.get("有無管理組織", "").strip() == "有",
                        "has_parking": parking_price > 0 or parking_area > 0,
                        "parking_price": parking_price,
                        "parking_area": parking_area,
                        "zoning": row.get("都市土地使用分區", "").strip(),
                        "note": row.get("備註", "").strip(),
                        "raw_data": dict(row),
                        "batch_date": batch_date,
                    }
                    row_count += 1

                logger.info(f"  {csv_name}: {row_count} rows ({city}, {tx_type})")


# ============================================================
# 入庫
# ============================================================
def upsert_transactions(conn, rows: list) -> tuple:
    """批次 upsert 交易資料"""
    if not rows:
        return 0, 0

    columns = [
        "source_id", "city", "district", "address", "full_address",
        "transaction_type", "transaction_date", "total_price", "unit_price",
        "building_area", "land_area", "building_type", "main_use", "materials",
        "build_year", "build_month", "rooms", "halls", "bathrooms", "compartments",
        "total_floors", "transfer_floor", "has_management", "has_parking",
        "parking_price", "parking_area", "zoning", "note", "raw_data", "batch_date",
    ]

    values = []
    for r in rows:
        values.append(tuple(
            psycopg2.extras.Json(r[c]) if c == "raw_data" else r[c]
            for c in columns
        ))

    placeholders = ", ".join(["%s"] * len(columns))
    col_names = ", ".join(columns)
    update_cols = ", ".join(
        f"{c} = EXCLUDED.{c}" for c in columns if c != "source_id"
    )

    sql = f"""
        INSERT INTO transactions ({col_names})
        VALUES %s
        ON CONFLICT (source_id) DO UPDATE SET {update_cols}
    """

    with conn.cursor() as cur:
        execute_values(cur, sql, values, page_size=500)
        inserted = cur.rowcount

    conn.commit()
    return inserted, len(rows) - inserted


# ============================================================
# ETL Log
# ============================================================
def log_etl(conn, pipeline: str, status: str, **kwargs):
    """記錄 ETL 執行狀態"""
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO etl_logs (pipeline_name, status, records_fetched, records_inserted,
                                  records_updated, records_skipped, error_message, finished_at, metadata)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            pipeline, status,
            kwargs.get("fetched", 0), kwargs.get("inserted", 0),
            kwargs.get("updated", 0), kwargs.get("skipped", 0),
            kwargs.get("error"), datetime.now() if status != "running" else None,
            psycopg2.extras.Json(kwargs.get("metadata", {})),
        ))
    conn.commit()


# ============================================================
# 社區聚合更新
# ============================================================
def refresh_communities(conn):
    """更新社區聚合表（簡易版：用地址前段聚合）"""
    logger.info("Refreshing communities...")
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO communities (name, city, district, address_pattern,
                avg_unit_price, median_price, price_stddev, min_price, max_price,
                transaction_count, avg_age, avg_area, building_type, has_management, updated_at)
            SELECT
                COALESCE(
                    REGEXP_REPLACE(address, '[0-9~～至到].*$', ''),
                    district
                ) AS name,
                city, district,
                REGEXP_REPLACE(address, '[0-9~～至到].*$', '') AS addr_pattern,
                ROUND(AVG(unit_price * 3.30579 / 10000))::INT,
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY unit_price * 3.30579 / 10000)::INT,
                ROUND(STDDEV(unit_price * 3.30579 / 10000))::INT,
                ROUND(MIN(unit_price * 3.30579 / 10000))::INT,
                ROUND(MAX(unit_price * 3.30579 / 10000))::INT,
                COUNT(*),
                ROUND(AVG(2026 - COALESCE(build_year, 2020)))::INT,
                ROUND(AVG(building_area * 0.3025), 2),
                MODE() WITHIN GROUP (ORDER BY building_type),
                BOOL_OR(has_management),
                NOW()
            FROM transactions
            WHERE transaction_type = 'sale'
                AND unit_price > 0
                AND transaction_date >= NOW() - INTERVAL '1 year'
            GROUP BY city, district, REGEXP_REPLACE(address, '[0-9~～至到].*$', '')
            HAVING COUNT(*) >= 3
            ON CONFLICT DO NOTHING
        """)
        logger.info(f"Communities refreshed: {cur.rowcount} rows")
    conn.commit()

    # Refresh materialized views
    with conn.cursor() as cur:
        cur.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_district_quarterly_prices")
        cur.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_community_rankings")
    conn.commit()
    logger.info("Materialized views refreshed")


# ============================================================
# 主程式
# ============================================================
def run_pipeline(fetch_type: str, season: str = None):
    """執行完整 ETL 管線"""
    conn = psycopg2.connect(DB_URL)
    pipeline_name = f"real_price_{fetch_type}"
    batch_date = date.today()

    try:
        log_etl(conn, pipeline_name, "running")

        # 1. 下載
        if fetch_type == "current":
            zip_data = download_current()
        elif fetch_type == "season":
            if not season:
                raise ValueError("--season is required for season type")
            zip_data = download_season(season)
            pipeline_name = f"real_price_season_{season}"
        elif fetch_type == "backfill":
            # 回填近 3 年（民國 112~114 年，每年 4 季）
            for year in range(112, 115):
                for q in range(1, 5):
                    s = f"{year}S{q}"
                    try:
                        logger.info(f"=== Backfilling {s} ===")
                        run_pipeline("season", season=s)
                    except Exception as e:
                        logger.warning(f"Failed to fetch {s}: {e}")
            refresh_communities(conn)
            conn.close()
            return
        else:
            raise ValueError(f"Unknown fetch type: {fetch_type}")

        # 2. 解析
        all_rows = list(parse_csv_rows(zip_data, batch_date))
        logger.info(f"Total parsed: {len(all_rows)} rows")

        # 3. 入庫（分批 1000 筆）
        total_inserted = 0
        total_skipped = 0
        batch_size = 1000
        for i in range(0, len(all_rows), batch_size):
            batch = all_rows[i:i + batch_size]
            inserted, skipped = upsert_transactions(conn, batch)
            total_inserted += inserted
            total_skipped += skipped
            logger.info(f"  Batch {i//batch_size+1}: {inserted} upserted, {skipped} skipped")

        # 4. 更新聚合
        if fetch_type == "current":
            refresh_communities(conn)

        # 5. 記錄
        log_etl(conn, pipeline_name, "success",
                fetched=len(all_rows), inserted=total_inserted, skipped=total_skipped,
                metadata={"batch_date": str(batch_date)})

        logger.info(f"✅ Pipeline complete: {total_inserted} inserted, {total_skipped} skipped")

    except Exception as e:
        logger.error(f"❌ Pipeline failed: {e}")
        log_etl(conn, pipeline_name, "failed", error=str(e))
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="實價登錄 ETL 管線")
    parser.add_argument("--type", choices=["current", "season", "backfill"], default="current")
    parser.add_argument("--season", help="季度代碼，如 113S1")
    args = parser.parse_args()
    run_pipeline(args.type, args.season)
