// 全站共用建案資料 — 單一來源。
// 每筆建案的 id 為全站唯一（1-24），用於詳情頁路由 /projects/[id]。

export const IC = {"近捷運":"🚇","近高鐵":"🚄","近公園":"🌳","明星學區":"🎓","低公設":"📐","SRC鋼骨":"🏗","全齡公設":"🏊","智慧宅":"📱","雙衛浴":"🚿","零店面":"🏠","景觀戶":"🌅","大基地":"📏","飯店管理":"🛎","綠建築":"🌱","制震宅":"🛡","輕軌沿線":"🚈","河岸第一排":"🌊","捷運共構":"🔗","百坪中庭":"🏡","溫泉入戶":"♨️","重劃區":"📋","雙車位":"🚗","頂樓花園":"🌺","近醫學中心":"🏥","角地建築":"🔺","正對公園":"🌲","步行商圈":"🛍","國際建築師":"✨","泳池會館":"🏊","近好市多":"🛒"};

export const PROJECTS_BY_REGION = {
  north:[
    {id:1,name:"潤泰菁英匯",area:"台北中山",type:"預售",ping:"42~58坪",price:"55~72",rooms:"3~4房",u:128,fl:24,sp:true,v:true,p:true,hl:["近捷運","SRC鋼骨","飯店管理","低公設","景觀戶"],b:"潤泰創新",est:"2028",tag:"精工築藝・敬獻城心"},
    {id:2,name:"聯上和煦",area:"台北文山",type:"預售",ping:"28~36坪",price:"48~55",rooms:"2~3房",u:86,fl:15,sp:false,hl:["近捷運","明星學區","綠建築"],b:"聯上開發",est:"2027"},
    {id:3,name:"遠雄明玥",area:"台北內湖",type:"新成屋",ping:"32~45坪",price:"62~78",rooms:"3房",u:210,fl:28,sp:false,hl:["近捷運","全齡公設","智慧宅","大基地"],b:"遠雄建設",est:"即可入住"},
    {id:4,name:"國美馥遇",area:"台北松山",type:"預售",ping:"25~38坪",price:"68~85",rooms:"2~3房",u:64,fl:18,sp:true,p:true,hl:["近捷運","雙衛浴","零店面","制震宅","步行商圈"],b:"國美建設",est:"2028",tag:"松山經典・馥郁人生"},
    {id:5,name:"寶亞得玥",area:"台北大安",type:"預售",ping:"18~26坪",price:"82~95",rooms:"1~2房",u:42,fl:12,sp:false,hl:["明星學區","近公園","低公設"],b:"寶亞建設",est:"2027"},
    {id:6,name:"三輝序慕",area:"台北士林",type:"預售",ping:"35~50坪",price:"52~64",rooms:"3~4房",u:96,fl:20,sp:false,hl:["景觀戶","全齡公設","大基地","近好市多"],b:"三輝建設",est:"2028"},
    {id:7,name:"忠泰大華",area:"台北中正",type:"新成屋",ping:"22~40坪",price:"75~92",rooms:"2~3房",u:180,fl:32,sp:false,hl:["國際建築師","SRC鋼骨","近捷運","飯店管理"],b:"忠泰建設",est:"即可入住"},
    {id:8,name:"良茂 KING ONE",area:"新北板橋",type:"預售",ping:"30~42坪",price:"45~58",rooms:"3房",u:156,fl:22,sp:true,v:true,hl:["捷運共構","全齡公設","泳池會館","百坪中庭"],b:"良茂建設",est:"2029",tag:"板橋新都心"},
    {id:9,name:"冠德鼎峰",area:"新北新店",type:"新成屋",ping:"38~55坪",price:"42~53",rooms:"3~4房",u:220,fl:26,sp:false,hl:["近捷運","大基地","近公園","雙車位"],b:"冠德建設",est:"即可入住"},
    {id:10,name:"興富發天匯",area:"桃園中壢",type:"預售",ping:"25~40坪",price:"28~38",rooms:"2~3房",u:340,fl:18,sp:false,hl:["近高鐵","重劃區","全齡公設"],b:"興富發建設",est:"2028"},
  ],
  central:[
    {id:11,name:"惠宇觀市政",area:"台中西屯",type:"預售",ping:"38~55坪",price:"38~52",rooms:"3~4房",u:168,fl:28,sp:true,v:true,p:true,hl:["正對公園","SRC鋼骨","飯店管理","智慧宅","近好市多"],b:"惠宇建設",est:"2028",tag:"市政核心・一席到位"},
    {id:12,name:"精銳博",area:"台中南屯",type:"預售",ping:"42~60坪",price:"35~48",rooms:"3~4房",u:120,fl:22,sp:false,hl:["大基地","全齡公設","景觀戶","近公園"],b:"精銳建設",est:"2028"},
    {id:13,name:"聯聚方庭",area:"台中西區",type:"新成屋",ping:"50~75坪",price:"42~56",rooms:"4房",u:48,fl:16,sp:false,hl:["國際建築師","角地建築","制震宅","頂樓花園"],b:"聯聚建設",est:"即可入住"},
    {id:14,name:"豐邑日日青",area:"台中北屯",type:"預售",ping:"28~40坪",price:"32~42",rooms:"2~3房",u:240,fl:20,sp:true,v:true,hl:["近捷運","明星學區","綠建築","低公設"],b:"豐邑建設",est:"2027"},
    {id:15,name:"雙橡園1617",area:"台中南區",type:"預售",ping:"32~45坪",price:"30~40",rooms:"3房",u:180,fl:18,sp:false,hl:["近醫學中心","全齡公設","重劃區"],b:"雙橡園",est:"2028"},
    {id:16,name:"國聚之鑄",area:"台中北區",type:"新成屋",ping:"35~48坪",price:"34~45",rooms:"3房",u:92,fl:15,sp:false,hl:["近捷運","步行商圈","制震宅","零店面"],b:"國聚建設",est:"即可入住"},
  ],
  south:[
    {id:17,name:"興富發夢時代",area:"高雄前鎮",type:"預售",ping:"28~50坪",price:"22~35",rooms:"2~4房",u:520,fl:32,sp:true,v:true,p:true,hl:["輕軌沿線","大基地","泳池會館","智慧宅","景觀戶"],b:"興富發建設",est:"2029",tag:"港灣新都心"},
    {id:18,name:"欣巴巴天御",area:"台南東區",type:"預售",ping:"32~48坪",price:"20~28",rooms:"3~4房",u:160,fl:15,sp:false,hl:["近公園","低公設","雙車位"],b:"欣巴巴",est:"2027"},
    {id:19,name:"京城美術皇居",area:"高雄鼓山",type:"新成屋",ping:"45~68坪",price:"28~38",rooms:"3~4房",u:88,fl:24,sp:false,hl:["河岸第一排","國際建築師","飯店管理","全齡公設"],b:"京城建設",est:"即可入住"},
    {id:20,name:"城揚玉璽",area:"高雄左營",type:"預售",ping:"35~52坪",price:"25~34",rooms:"3房",u:200,fl:20,sp:true,v:true,hl:["近高鐵","近捷運","明星學區","全齡公設"],b:"城揚建設",est:"2028"},
    {id:21,name:"太子鑫都",area:"台南安平",type:"預售",ping:"30~42坪",price:"22~30",rooms:"2~3房",u:140,fl:16,sp:false,hl:["近公園","綠建築","低公設","步行商圈"],b:"太子建設",est:"2028"},
  ],
  east:[
    {id:22,name:"山海硯",area:"宜蘭市",type:"新成屋",ping:"35~55坪",price:"18~26",rooms:"2~3房",u:42,fl:8,sp:true,p:true,hl:["溫泉入戶","近公園","景觀戶","低公設"],b:"在地建設",est:"即可入住",tag:"山與海之間"},
    {id:23,name:"大翔鷹堡",area:"花蓮市",type:"預售",ping:"28~42坪",price:"16~22",rooms:"2~3房",u:60,fl:10,sp:false,hl:["近公園","雙車位","制震宅"],b:"大翔建設",est:"2028"},
    {id:24,name:"台東雲端",area:"台東市",type:"新成屋",ping:"30~48坪",price:"14~20",rooms:"3房",u:36,fl:7,sp:false,hl:["景觀戶","大基地","近醫學中心"],b:"在地建設",est:"即可入住"},
  ],
};

// 攤平成單一陣列，每筆加上 region 欄位。
export const PROJECTS = Object.entries(PROJECTS_BY_REGION).flatMap(
  ([region, list]) => list.map((p) => ({ ...p, region }))
);

// 依 id 取得單一建案；找不到回傳 null。
export function getProject(id) {
  return PROJECTS.find((p) => String(p.id) === String(id)) || null;
}

// 取 price 字串（如 "55~72"）的下界數字，用於篩選。
export function priceLow(price) {
  const m = String(price || "").match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

export const REGION_LABEL = { north: "北部", central: "中部", south: "南部", east: "東部" };
