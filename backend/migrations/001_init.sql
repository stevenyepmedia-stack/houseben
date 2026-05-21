-- ============================================================
-- 好室宅吉便 - 資料庫 Schema
-- PostgreSQL 15+ with PostGIS
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for fuzzy text search

-- ============================================================
-- 1. 實價登錄交易資料
-- ============================================================
CREATE TABLE transactions (
  id              BIGSERIAL PRIMARY KEY,
  source_id       TEXT UNIQUE,                    -- 原始編號（去重）
  city            TEXT NOT NULL,
  district        TEXT NOT NULL,
  address         TEXT,                           -- 去識別化地址
  full_address    TEXT,                           -- 完整路段（用於搜尋）
  transaction_type TEXT DEFAULT 'sale',           -- sale / presale / rent
  transaction_date DATE,
  total_price     BIGINT,                         -- 總價（元）
  unit_price      INT,                            -- 單價（元/平方公尺）
  unit_price_ping INT GENERATED ALWAYS AS (       -- 單價（萬/坪）
    CASE WHEN unit_price > 0 THEN ROUND(unit_price * 3.30579 / 10000)::INT ELSE NULL END
  ) STORED,
  building_area   DECIMAL(10,2),                  -- 建物面積（平方公尺）
  building_area_ping DECIMAL(10,2) GENERATED ALWAYS AS (
    ROUND(building_area * 0.3025, 2)
  ) STORED,
  land_area       DECIMAL(10,2),
  building_type   TEXT,                           -- 公寓/華廈/住宅大樓/透天
  main_use        TEXT,                           -- 住家用/商業用/etc
  materials       TEXT,                           -- 鋼筋混凝土/鋼骨/etc
  build_year      INT,                            -- 建築完成年（西元）
  build_month     INT,
  rooms           INT DEFAULT 0,
  halls           INT DEFAULT 0,
  bathrooms       INT DEFAULT 0,
  compartments    INT DEFAULT 0,
  total_floors    INT,
  transfer_floor  TEXT,                           -- 移轉層次
  has_management  BOOLEAN DEFAULT FALSE,
  has_parking     BOOLEAN DEFAULT FALSE,
  parking_price   BIGINT DEFAULT 0,
  parking_area    DECIMAL(10,2) DEFAULT 0,
  zoning          TEXT,                           -- 都市土地使用分區
  note            TEXT,
  geom            GEOMETRY(Point, 4326),          -- PostGIS 座標
  raw_data        JSONB,                          -- 原始完整資料
  batch_date      DATE,                           -- 批次日期
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_tx_city_district ON transactions(city, district);
CREATE INDEX idx_tx_date ON transactions(transaction_date DESC);
CREATE INDEX idx_tx_type ON transactions(transaction_type);
CREATE INDEX idx_tx_building_type ON transactions(building_type);
CREATE INDEX idx_tx_address ON transactions USING gin(full_address gin_trgm_ops);
CREATE INDEX idx_tx_geom ON transactions USING GIST(geom);
CREATE INDEX idx_tx_unit_price ON transactions(unit_price_ping);
CREATE INDEX idx_tx_batch ON transactions(batch_date);

-- ============================================================
-- 2. 社區聚合表
-- ============================================================
CREATE TABLE communities (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  city            TEXT NOT NULL,
  district        TEXT NOT NULL,
  address_pattern TEXT,                           -- 地址匹配規則
  avg_unit_price  INT,                            -- 近1年均價（萬/坪）
  median_price    INT,
  price_stddev    INT,
  min_price       INT,
  max_price       INT,
  transaction_count INT DEFAULT 0,
  avg_age         INT,
  avg_area        DECIMAL(10,2),
  total_units     INT,
  has_management  BOOLEAN,
  building_type   TEXT,
  geom            GEOMETRY(Point, 4326),
  score_data      JSONB,                          -- 生活圈評分
  price_trend     JSONB,                          -- 季度價格趨勢
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comm_city ON communities(city, district);
CREATE INDEX idx_comm_geom ON communities USING GIST(geom);
CREATE INDEX idx_comm_name ON communities USING gin(name gin_trgm_ops);

-- ============================================================
-- 3. 利率資料
-- ============================================================
CREATE TABLE interest_rates (
  id              SERIAL PRIMARY KEY,
  bank_group      TEXT NOT NULL,                  -- five_major / specific_bank_name
  rate_type       TEXT NOT NULL,                  -- mortgage_new / mortgage_existing / benchmark
  rate_value      DECIMAL(6,4) NOT NULL,          -- e.g. 2.0300
  effective_date  DATE NOT NULL,
  raw_source      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bank_group, rate_type, effective_date)
);

CREATE INDEX idx_rate_date ON interest_rates(effective_date DESC);

-- ============================================================
-- 4. 風險圖層
-- ============================================================
CREATE TABLE risk_layers (
  id              SERIAL PRIMARY KEY,
  layer_type      TEXT NOT NULL,                  -- liquefaction / fault / flood / nuisance
  sub_type        TEXT,                           -- gas_station / substation / temple / etc
  risk_level      TEXT,                           -- high / medium / low
  name            TEXT,
  description     TEXT,
  geom            GEOMETRY(Geometry, 4326),       -- Point or Polygon
  properties      JSONB,
  source          TEXT,                           -- data source name
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_risk_type ON risk_layers(layer_type);
CREATE INDEX idx_risk_geom ON risk_layers USING GIST(geom);

-- ============================================================
-- 5. 生活機能設施
-- ============================================================
CREATE TABLE facilities (
  id              SERIAL PRIMARY KEY,
  category        TEXT NOT NULL,                  -- transport / school / medical / shopping / park
  sub_category    TEXT,                           -- mrt / bus / elementary / hospital / etc
  name            TEXT NOT NULL,
  address         TEXT,
  city            TEXT,
  district        TEXT,
  geom            GEOMETRY(Point, 4326),
  properties      JSONB,
  source          TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fac_category ON facilities(category);
CREATE INDEX idx_fac_geom ON facilities USING GIST(geom);

-- ============================================================
-- 6. 建商
-- ============================================================
CREATE TABLE builders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name    TEXT NOT NULL,
  tax_id          TEXT UNIQUE,
  contact_name    TEXT,
  email           TEXT UNIQUE,
  phone           TEXT,
  plan_tier       TEXT DEFAULT 'free',            -- free / select / flagship
  plan_started_at TIMESTAMPTZ,
  plan_expires_at TIMESTAMPTZ,
  capital         TEXT,                           -- 資本額
  established     TEXT,                           -- 成立年份
  past_projects   INT DEFAULT 0,
  on_time_rate    DECIMAL(5,2),
  complaint_count INT DEFAULT 0,
  auto_renew      BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. 建案
-- ============================================================
CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  builder_id      UUID REFERENCES builders(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE,
  status          TEXT DEFAULT 'draft',           -- draft / pending_review / approved / live / sold_out
  city            TEXT,
  district        TEXT,
  address         TEXT,
  geom            GEOMETRY(Point, 4326),
  project_type    TEXT,                           -- presale / new / renovation
  estimated_completion TEXT,
  price_min       INT,                            -- 萬/坪
  price_max       INT,
  total_price_min INT,                            -- 總價萬
  total_price_max INT,
  area_min        DECIMAL(10,2),                  -- 坪
  area_max        DECIMAL(10,2),
  total_units     INT,
  floors_above    INT,
  floors_below    INT,
  rooms_desc      TEXT,                           -- '2~4房'
  public_ratio    DECIMAL(5,2),
  structure       TEXT,
  base_area       DECIMAL(10,2),                  -- 基地面積（坪）
  parking_type    TEXT,
  tagline         TEXT,
  video_url       TEXT,
  pano_url        TEXT,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_proj_builder ON projects(builder_id);
CREATE INDEX idx_proj_status ON projects(status);
CREATE INDEX idx_proj_city ON projects(city, district);
CREATE INDEX idx_proj_geom ON projects USING GIST(geom);
CREATE INDEX idx_proj_slug ON projects(slug);

-- ============================================================
-- 8. 建案圖片
-- ============================================================
CREATE TABLE project_images (
  id              SERIAL PRIMARY KEY,
  project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
  url             TEXT NOT NULL,
  image_type      TEXT DEFAULT 'gallery',         -- cover / gallery / floorplan / progress / highlight
  caption         TEXT,
  sort_order      INT DEFAULT 0,
  uploaded_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pimg_project ON project_images(project_id);

-- ============================================================
-- 9. 建案亮點
-- ============================================================
CREATE TABLE project_highlights (
  id              SERIAL PRIMARY KEY,
  project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
  icon_url        TEXT,                           -- 水彩插畫 URL
  title           TEXT NOT NULL,
  description     TEXT,
  sort_order      INT DEFAULT 0
);

-- ============================================================
-- 10. 建案格局
-- ============================================================
CREATE TABLE project_floor_plans (
  id              SERIAL PRIMARY KEY,
  project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,                  -- 'A 戶型'
  area_ping       DECIMAL(10,2),
  rooms           TEXT,                           -- '3房2廳2衛'
  description     TEXT,
  image_url       TEXT,
  sort_order      INT DEFAULT 0
);

-- ============================================================
-- 11. 廣告版位
-- ============================================================
CREATE TABLE ad_slots (
  id              SERIAL PRIMARY KEY,
  project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
  slot_type       TEXT NOT NULL,                  -- hero_banner / featured_card / journey_context
  region          TEXT,                           -- north / central / south / all
  image_url       TEXT,
  tagline         TEXT,
  target_url      TEXT,
  starts_at       TIMESTAMPTZ,
  ends_at         TIMESTAMPTZ,
  is_approved     BOOLEAN DEFAULT FALSE,
  impressions     BIGINT DEFAULT 0,
  clicks          BIGINT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ad_type ON ad_slots(slot_type, is_approved);
CREATE INDEX idx_ad_dates ON ad_slots(starts_at, ends_at);

-- ============================================================
-- 12. 預約名單
-- ============================================================
CREATE TABLE leads (
  id              SERIAL PRIMARY KEY,
  project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  phone           TEXT NOT NULL,
  email           TEXT,
  interest        JSONB,                          -- {rooms:'3房', area:'30~40坪'}
  source_page     TEXT,
  source_tool     TEXT,                           -- homepage / detail / price_query
  is_read         BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lead_project ON leads(project_id, created_at DESC);
CREATE INDEX idx_lead_unread ON leads(project_id, is_read) WHERE NOT is_read;

-- ============================================================
-- 13. 使用者（買房族）
-- ============================================================
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           TEXT UNIQUE,
  name            TEXT,
  phone           TEXT,
  auth_provider   TEXT,                           -- email / google / line
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 14. 使用者旅程進度
-- ============================================================
CREATE TABLE user_journeys (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id      TEXT,
  current_stage   INT DEFAULT 1,
  budget_data     JSONB,                          -- 購屋力診斷結果
  area_data       JSONB,                          -- 區域探索結果
  property_data   JSONB,                          -- 物件估價結果
  negotiation_data JSONB,
  loan_data       JSONB,
  checklist_data  JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 15. 使用者收藏
-- ============================================================
CREATE TABLE user_favorites (
  id              SERIAL PRIMARY KEY,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  target_type     TEXT NOT NULL,                  -- project / community / transaction
  target_id       TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- ============================================================
-- 16. 價格通知訂閱
-- ============================================================
CREATE TABLE price_alerts (
  id              SERIAL PRIMARY KEY,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  alert_type      TEXT NOT NULL,                  -- community_price / area_price / project_update
  target_id       TEXT,
  conditions      JSONB,                          -- {max_price: 70, min_area: 30}
  is_active       BOOLEAN DEFAULT TRUE,
  last_triggered  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 17. ETL 執行紀錄
-- ============================================================
CREATE TABLE etl_logs (
  id              SERIAL PRIMARY KEY,
  pipeline_name   TEXT NOT NULL,
  status          TEXT NOT NULL,                  -- running / success / failed
  records_fetched INT DEFAULT 0,
  records_inserted INT DEFAULT 0,
  records_updated INT DEFAULT 0,
  records_skipped INT DEFAULT 0,
  error_message   TEXT,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  finished_at     TIMESTAMPTZ,
  metadata        JSONB
);

-- ============================================================
-- Materialized Views for Analytics
-- ============================================================

-- 每區域季度均價
CREATE MATERIALIZED VIEW mv_district_quarterly_prices AS
SELECT
  city,
  district,
  DATE_TRUNC('quarter', transaction_date)::DATE AS quarter,
  building_type,
  COUNT(*) AS tx_count,
  ROUND(AVG(unit_price_ping)) AS avg_price,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY unit_price_ping) AS median_price,
  MIN(unit_price_ping) AS min_price,
  MAX(unit_price_ping) AS max_price,
  ROUND(STDDEV(unit_price_ping)) AS stddev_price
FROM transactions
WHERE transaction_type = 'sale'
  AND unit_price_ping > 0
  AND transaction_date >= NOW() - INTERVAL '3 years'
GROUP BY city, district, quarter, building_type;

CREATE UNIQUE INDEX idx_mv_dqp ON mv_district_quarterly_prices(city, district, quarter, building_type);

-- 熱門社區排行
CREATE MATERIALIZED VIEW mv_community_rankings AS
SELECT
  c.id,
  c.name,
  c.city,
  c.district,
  c.avg_unit_price,
  c.transaction_count,
  c.avg_age,
  RANK() OVER (PARTITION BY c.city ORDER BY c.avg_unit_price DESC) AS price_rank,
  RANK() OVER (PARTITION BY c.city ORDER BY c.transaction_count DESC) AS activity_rank
FROM communities c
WHERE c.transaction_count >= 3;

CREATE UNIQUE INDEX idx_mv_cr ON mv_community_rankings(id);
