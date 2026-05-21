# 好室宅吉便 — 完整專案

買房決策平台。整合政府開放資料，從預算診斷到交屋驗收，陪你做對每一步決定。

## 專案結構

```
haoshih/
├── app/                          # Next.js App Router
│   ├── layout.jsx                # 根 Layout
│   ├── globals.css               # 全域 CSS
│   ├── page.jsx                  # / 首頁
│   ├── projects/
│   │   ├── page.jsx              # /projects 精選建案
│   │   └── [slug]/page.jsx       # /projects/:slug 建案詳情
│   ├── dashboard/page.jsx        # /dashboard 建商後台
│   ├── tools/
│   │   ├── affordability/page.jsx # /tools/affordability 購屋力診斷
│   │   ├── price-check/page.jsx   # /tools/price-check AI房價健檢
│   │   └── risk-map/page.jsx      # /tools/risk-map 風險透視圖
│   └── api/                       # API Routes
│       ├── transactions/{search,nearby}/route.js
│       ├── rates/route.js
│       └── risks/route.js
├── components/
│   ├── Nav.jsx                    # 共用導覽列
│   ├── Footer.jsx                 # 共用頁尾
│   └── pages/                     # 7 個頁面級元件
├── lib/db.js                      # PostgreSQL 連線
├── backend/
│   ├── migrations/001_init.sql    # DB Schema（17表）
│   ├── pipeline/                  # Python ETL 管線
│   └── scripts/                   # 排程與健康檢查
├── docker-compose.yml             # DB + Redis + Meilisearch
├── package.json
└── .env.example
```

## 快速啟動

```bash
# 1. 安裝
npm install

# 2. 啟動資料庫
docker compose up -d

# 3. 建庫
psql postgresql://postgres:postgres@localhost:5432/haoshih \
  -f backend/migrations/001_init.sql

# 4. 回填實價登錄
pip install -r backend/pipeline/requirements.txt
python backend/pipeline/fetch_real_price.py --type backfill

# 5. 環境變數
cp .env.example .env.local

# 6. 啟動
npm run dev
```

## 路由對照

| 路由 | 頁面 | 元件 |
|------|------|-----|
| / | 首頁 | Homepage.jsx |
| /projects | 精選建案 | RecommendedProjects.jsx |
| /projects/:slug | 建案詳情 | ProjectDetail.jsx |
| /dashboard | 建商後台 | BuilderDashboard.jsx |
| /tools/affordability | 購屋力診斷 | AffordabilityCalc.jsx |
| /tools/price-check | AI房價健檢 | AIPriceQuery.jsx |
| /tools/risk-map | 風險透視圖 | RiskMap.jsx |
