"""
同步搜尋索引
將交易資料和社區資料同步到 Meilisearch，提供中文全文搜尋
"""
import os
import logging
import psycopg2
import meilisearch

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

DB_URL = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/haoshih")
MEILI_URL = os.environ.get("MEILI_URL", "http://localhost:7700")
MEILI_KEY = os.environ.get("MEILI_KEY", "haoshih_dev_key_change_in_production")


def sync_communities():
    """同步社區資料到搜尋引擎"""
    conn = psycopg2.connect(DB_URL)
    client = meilisearch.Client(MEILI_URL, MEILI_KEY)

    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, name, city, district, avg_unit_price, median_price,
                       transaction_count, avg_age, building_type, has_management
                FROM communities
                WHERE transaction_count >= 3
                ORDER BY transaction_count DESC
                LIMIT 50000
            """)
            rows = cur.fetchall()
            columns = [desc[0] for desc in cur.description]

        docs = []
        for row in rows:
            doc = dict(zip(columns, row))
            doc["_searchable"] = f"{doc['city']} {doc['district']} {doc['name']}"
            # Meilisearch needs string or int IDs
            doc["id"] = str(doc["id"])
            # Convert Decimal to float
            for k, v in doc.items():
                if hasattr(v, "is_finite"):
                    doc[k] = float(v)
            docs.append(doc)

        # Create or update index
        index = client.index("communities")
        index.update_settings({
            "searchableAttributes": ["_searchable", "name", "city", "district"],
            "filterableAttributes": ["city", "district", "building_type", "avg_unit_price"],
            "sortableAttributes": ["avg_unit_price", "transaction_count"],
            "rankingRules": ["words", "typo", "proximity", "attribute", "sort", "exactness"],
        })

        # Add documents in batches
        batch_size = 1000
        for i in range(0, len(docs), batch_size):
            batch = docs[i:i + batch_size]
            index.add_documents(batch)
            logger.info(f"Indexed communities batch {i // batch_size + 1}: {len(batch)} docs")

        logger.info(f"✅ Synced {len(docs)} communities to search index")

    finally:
        conn.close()


def sync_projects():
    """同步建案資料到搜尋引擎"""
    conn = psycopg2.connect(DB_URL)
    client = meilisearch.Client(MEILI_URL, MEILI_KEY)

    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT p.id, p.name, p.city, p.district, p.address,
                       p.project_type, p.price_min, p.price_max,
                       p.area_min, p.area_max, p.rooms_desc, p.status,
                       b.company_name AS builder_name
                FROM projects p
                JOIN builders b ON p.builder_id = b.id
                WHERE p.status IN ('approved', 'live')
            """)
            rows = cur.fetchall()
            columns = [desc[0] for desc in cur.description]

        docs = []
        for row in rows:
            doc = dict(zip(columns, row))
            doc["_searchable"] = f"{doc['city']} {doc['district']} {doc['name']} {doc['builder_name']}"
            doc["id"] = str(doc["id"])
            for k, v in doc.items():
                if hasattr(v, "is_finite"):
                    doc[k] = float(v)
            docs.append(doc)

        index = client.index("projects")
        index.update_settings({
            "searchableAttributes": ["_searchable", "name", "city", "district", "builder_name"],
            "filterableAttributes": ["city", "district", "project_type", "status", "price_min"],
            "sortableAttributes": ["price_min", "price_max"],
        })

        if docs:
            index.add_documents(docs)
        logger.info(f"✅ Synced {len(docs)} projects to search index")

    finally:
        conn.close()


if __name__ == "__main__":
    sync_communities()
    sync_projects()
