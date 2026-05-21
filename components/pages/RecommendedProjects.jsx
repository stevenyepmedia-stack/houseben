"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import { useFavorites } from "@/components/useFavorites";

const R = [
  { id:"north", label:"北部", n:10 },
  { id:"central", label:"中部", n:6 },
  { id:"south", label:"南部", n:5 },
  { id:"east", label:"東部", n:3 },
];

const FT = ["全部","預售屋","新成屋","2房","3房","4房+","1000萬內","1000~2000萬","2000萬+"];
const IC = {"近捷運":"🚇","近高鐵":"🚄","近公園":"🌳","明星學區":"🎓","低公設":"📐","SRC鋼骨":"🏗","全齡公設":"🏊","智慧宅":"📱","雙衛浴":"🚿","零店面":"🏠","景觀戶":"🌅","大基地":"📏","飯店管理":"🛎","綠建築":"🌱","制震宅":"🛡","輕軌沿線":"🚈","河岸第一排":"🌊","捷運共構":"🔗","百坪中庭":"🏡","溫泉入戶":"♨️","重劃區":"📋","雙車位":"🚗","頂樓花園":"🌺","近醫學中心":"🏥","角地建築":"🔺","正對公園":"🌲","步行商圈":"🛍","國際建築師":"✨","泳池會館":"🏊","近好市多":"🛒"};

const P = {
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

// warm abstract illustration SVGs
const warmPat = [
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260'%3E%3Crect width='400' height='260' fill='%23e8ddd0'/%3E%3Ccircle cx='300' cy='80' r='120' fill='%23d4c4a8' opacity='0.6'/%3E%3Ccircle cx='100' cy='200' r='80' fill='%23c9b896' opacity='0.4'/%3E%3Ccircle cx='340' cy='220' r='40' fill='%23bfad84' opacity='0.3'/%3E%3Crect x='60' y='100' width='80' height='80' rx='40' fill='%23d8ccb4' opacity='0.5'/%3E%3C/svg%3E")`,
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260'%3E%3Crect width='400' height='260' fill='%23d6ddd4'/%3E%3Ccircle cx='200' cy='130' r='100' fill='%23c2cebc' opacity='0.7'/%3E%3Cellipse cx='320' cy='60' rx='60' ry='40' fill='%23b4c4ae' opacity='0.5'/%3E%3Ccircle cx='80' cy='200' r='50' fill='%23aabb a2' opacity='0.4'/%3E%3C/svg%3E")`,
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260'%3E%3Crect width='400' height='260' fill='%23d4dae0'/%3E%3Ccircle cx='150' cy='100' r='90' fill='%23c0c8d2' opacity='0.6'/%3E%3Crect x='250' y='60' width='120' height='120' rx='60' fill='%23b0bcc8' opacity='0.4'/%3E%3Ccircle cx='350' cy='220' r='30' fill='%23a8b4c0' opacity='0.5'/%3E%3C/svg%3E")`,
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260'%3E%3Crect width='400' height='260' fill='%23e0d8cc'/%3E%3Cellipse cx='280' cy='150' rx='120' ry='80' fill='%23d0c4b0' opacity='0.5'/%3E%3Ccircle cx='100' cy='80' r='60' fill='%23c8b8a0' opacity='0.4'/%3E%3Ccircle cx='200' cy='230' r='35' fill='%23bfb090' opacity='0.3'/%3E%3C/svg%3E")`,
];

function FavBtn({ project, fav }) {
  const router = useRouter();
  const active = fav.isFavorite(project.name);
  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!fav.loggedIn) {
      if (window.confirm("收藏建案需要先登入，要前往登入嗎？")) router.push("/auth/login");
      return;
    }
    fav.toggleFavorite(project);
  };
  return (
    <button onClick={onClick} title={active ? "取消收藏" : "加入收藏"} style={{
      width:36, height:36, borderRadius:"50%", padding:0,
      border:"1px solid rgba(0,0,0,0.06)", background:"rgba(255,255,255,0.95)",
      cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center",
      boxShadow:"0 2px 8px rgba(80,70,50,0.15)",
    }}>{active ? "❤️" : "🤍"}</button>
  );
}

function Hero({ p, fav }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      borderRadius:28, overflow:"hidden", cursor:"pointer", position:"relative",
      background:"#3a3632", minHeight:300,
      display:"flex", flexDirection:"column", justifyContent:"flex-end",
      padding:"32px 36px",
      boxShadow: hov ? "0 24px 64px rgba(58,54,50,0.25)" : "0 8px 32px rgba(58,54,50,0.1)",
      transform: hov ? "translateY(-3px)" : "none",
      transition:"all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
    }}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, #4a6858 0%, #3a5a4a 30%, #2a3a32 100%)", opacity:0.9 }}/>
      <div style={{ position:"absolute", top:-60, right:-60, width:280, height:280, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }}/>
      <div style={{ position:"absolute", bottom:-40, left:"30%", width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.03)" }}/>
      <div style={{ position:"absolute", top:20, left:24, display:"flex", gap:8, zIndex:2 }}>
        {p.sp && <span style={{ background:"#e2c87a", color:"#3a2e18", fontSize:11, fontWeight:700, padding:"6px 16px", borderRadius:24 }}>合作建案</span>}
        <span style={{ background:"rgba(255,255,255,0.12)", backdropFilter:"blur(12px)", color:"rgba(255,255,255,0.85)", fontSize:11, fontWeight:600, padding:"6px 16px", borderRadius:24 }}>{p.type}・{p.est}</span>
      </div>
      <div style={{ position:"absolute", top:18, right:24, zIndex:3 }}><FavBtn project={p} fav={fav}/></div>
      {(p.v||p.p)&&<div style={{ position:"absolute", top:20, right:70, display:"flex", gap:6, zIndex:2 }}>
        {p.p&&<span style={{ background:"rgba(255,255,255,0.12)", backdropFilter:"blur(10px)", color:"rgba(255,255,255,0.8)", fontSize:10, fontWeight:700, padding:"6px 14px", borderRadius:20 }}>360° 環景</span>}
        {p.v&&<span style={{ background:"rgba(255,255,255,0.12)", backdropFilter:"blur(10px)", color:"rgba(255,255,255,0.8)", fontSize:10, fontWeight:700, padding:"6px 14px", borderRadius:20 }}>▶ 影片</span>}
      </div>}
      <div style={{ position:"relative", zIndex:1 }}>
        <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, fontWeight:500, letterSpacing:2, marginBottom:8 }}>{p.b}｜{p.area}</div>
        <div style={{ color:"#fff", fontSize:32, fontWeight:800, letterSpacing:3, lineHeight:1.15, fontFamily:"'Noto Sans TC','Nunito',sans-serif", marginBottom:6 }}>{p.name}</div>
        {p.tag&&<div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, fontStyle:"italic", letterSpacing:1, marginBottom:18 }}>{p.tag}</div>}
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
          <span style={{ fontSize:30, fontWeight:900, color:"#e2c87a" }}>{p.price}</span>
          <span style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>萬/坪</span>
          <div style={{ width:1, height:18, background:"rgba(255,255,255,0.12)" }}/>
          <span style={{ fontSize:13, color:"rgba(255,255,255,0.5)" }}>{p.ping}｜{p.rooms}｜{p.u}戶</span>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {p.hl.map((h,i)=>(
            <span key={i} style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.85)", padding:"6px 16px", borderRadius:24, background:"rgba(255,255,255,0.1)", backdropFilter:"blur(6px)", display:"inline-flex", alignItems:"center", gap:5 }}>
              <span style={{fontSize:14}}>{IC[h]||"✦"}</span>{h}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ p, idx, fav }) {
  const [hov, setHov] = useState(false);
  const bg = warmPat[idx % warmPat.length];
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      borderRadius:24, overflow:"hidden", cursor:"pointer",
      background:"#fff",
      boxShadow: hov ? "0 16px 40px rgba(80,70,50,0.12)" : "0 2px 12px rgba(80,70,50,0.04)",
      transform: hov ? "translateY(-4px)" : "none",
      transition:"all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
      display:"flex", flexDirection:"column",
    }}>
      <div style={{
        height:160, backgroundImage:bg, backgroundSize:"cover",
        position:"relative", display:"flex", alignItems:"flex-end", padding:"16px 18px",
      }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(50,45,38,0.55) 0%, transparent 50%)" }}/>
        <div style={{ position:"absolute", top:14, left:14, display:"flex", gap:6 }}>
          {p.sp&&<span style={{ background:"#e2c87a", color:"#3a2e18", fontSize:9, fontWeight:800, padding:"4px 10px", borderRadius:16 }}>合作</span>}
          <span style={{ background:"rgba(255,255,255,0.8)", color:"#5a5550", fontSize:9, fontWeight:700, padding:"4px 10px", borderRadius:16 }}>{p.type}</span>
        </div>
        {(p.v||p.p)&&<div style={{ position:"absolute", top:14, right:14, display:"flex", gap:4 }}>
          {p.p&&<span style={{ background:"rgba(255,255,255,0.85)", color:"#5a5550", fontSize:8, fontWeight:800, padding:"3px 8px", borderRadius:12 }}>360°</span>}
          {p.v&&<span style={{ background:"rgba(255,255,255,0.85)", color:"#5a5550", fontSize:8, fontWeight:800, padding:"3px 8px", borderRadius:12 }}>▶</span>}
        </div>}
        <span style={{ position:"relative", zIndex:1, color:"#fff", fontSize:20, fontWeight:800, fontFamily:"'Noto Sans TC','Nunito',sans-serif", letterSpacing:1, textShadow:"0 2px 8px rgba(0,0,0,0.2)" }}>{p.name}</span>
        <div style={{ position:"absolute", bottom:14, right:14, zIndex:2 }}><FavBtn project={p} fav={fav}/></div>
      </div>
      <div style={{ padding:"18px 20px 22px", flex:1, display:"flex", flexDirection:"column" }}>
        <div style={{ fontSize:11, color:"#a8a098", marginBottom:8, fontWeight:500 }}>{p.b}｜{p.area}｜{p.est}</div>
        <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:12 }}>
          <span style={{ fontSize:22, fontWeight:900, color:"#3a3632" }}>{p.price}</span>
          <span style={{ fontSize:12, color:"#a8a098" }}>萬/坪</span>
          <span style={{ fontSize:11, color:"#ccc8c0" }}>｜{p.rooms}｜{p.ping}</span>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:"auto" }}>
          {p.hl.slice(0,3).map((h,i)=>(
            <span key={i} style={{ fontSize:11, fontWeight:600, color:"#6a6258", padding:"5px 12px", borderRadius:20, background:"#f5f0e8", display:"inline-flex", alignItems:"center", gap:4 }}>
              <span style={{fontSize:12}}>{IC[h]||"✦"}</span>{h}
            </span>
          ))}
          {p.hl.length>3&&<span style={{fontSize:10,color:"#c8c0b8",padding:"5px 4px"}}>+{p.hl.length-3}</span>}
        </div>
      </div>
    </div>
  );
}

function Row({ p, i, fav }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      display:"flex", gap:18, padding:"20px 24px",
      background: hov ? "#fff" : "transparent",
      borderRadius:20, cursor:"pointer",
      transition:"all 0.25s",
      boxShadow: hov ? "0 8px 24px rgba(80,70,50,0.06)" : "none",
      animation:`ri 0.3s ease ${i*40}ms both`,
    }}>
      <div style={{
        width:68, height:52, borderRadius:16,
        backgroundImage:warmPat[i%warmPat.length], backgroundSize:"cover",
        flexShrink:0, position:"relative",
      }}>
        {p.sp&&<span style={{ position:"absolute", top:-3, right:-3, width:14, height:14, borderRadius:7, background:"#e2c87a", border:"2px solid #f8f4ec" }}/>}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:15, fontWeight:700, color:"#3a3632", fontFamily:"'Noto Sans TC','Nunito',sans-serif" }}>{p.name}</span>
          <span style={{ fontSize:10, color:"#b8b0a8" }}>{p.type}・{p.est}</span>
        </div>
        <div style={{ fontSize:11, color:"#a8a098", marginTop:3 }}>{p.b}｜{p.area}｜{p.ping}｜{p.rooms}</div>
        <div style={{ display:"flex", gap:5, marginTop:8 }}>
          {p.hl.slice(0,3).map((h,j)=>(
            <span key={j} style={{ fontSize:9, fontWeight:600, color:"#8a8278", padding:"3px 8px", borderRadius:12, background:"#f5f0e8" }}>{IC[h]||"✦"} {h}</span>
          ))}
        </div>
      </div>
      <div style={{ textAlign:"right", flexShrink:0, display:"flex", flexDirection:"column", justifyContent:"center" }}>
        <div style={{ fontSize:20, fontWeight:900, color:"#3a3632" }}>{p.price}</div>
        <div style={{ fontSize:10, color:"#b8b0a8" }}>萬/坪</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", flexShrink:0 }}><FavBtn project={p} fav={fav}/></div>
    </div>
  );
}

export default function V5() {
  const [reg, setReg] = useState("north");
  const [tags, setTags] = useState(new Set(["全部"]));
  const toggle = t => { if(t==="全部"){setTags(new Set(["全部"]));return} const n=new Set(tags);n.delete("全部");n.has(t)?n.delete(t):n.add(t);if(!n.size)n.add("全部");setTags(n)};
  const all = P[reg]||[];
  const hero = all.find(p=>p.sp);
  const grid = all.filter(p=>p!==hero).slice(0,3);
  const list = all.filter(p=>p!==hero&&!grid.includes(p));
  const fav = useFavorites();

  return (
    <div style={{ background:"#f8f4ec", minHeight:"100vh", fontFamily:"'Noto Sans TC',sans-serif" }}>
      <Nav />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Noto+Sans+TC:wght@300;400;500;700;800;900&display=swap');
        @keyframes ri{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:0;height:0}
      `}</style>

      <div style={{ maxWidth:840, margin:"0 auto", padding:"0 28px 100px" }}>

        {/* ═══ HEADER ═══ */}
        <div style={{ padding:"48px 0 20px" }}>
          <div style={{ fontSize:56, fontWeight:900, color:"#3a3632", letterSpacing:6, lineHeight:1.0, fontFamily:"'Noto Sans TC','Nunito',sans-serif" }}>精選建案</div>
          <div style={{ fontSize:14, color:"#b8b0a8", fontWeight:400, marginTop:10, letterSpacing:2 }}>找到屬於你的理想居所</div>
        </div>

        {/* ═══ REGION + CONTROLS ═══ */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 0", marginBottom:12 }}>
          <div style={{ display:"flex", gap:6, background:"#f0ebe0", borderRadius:20, padding:4 }}>
            {R.map(r=>(
              <button key={r.id} onClick={()=>setReg(r.id)} style={{
                padding:"10px 22px", borderRadius:16, border:"none", cursor:"pointer",
                fontSize:14, fontWeight:reg===r.id?700:400,
                background:reg===r.id?"#fff":"transparent",
                color:reg===r.id?"#3a3632":"#a8a098",
                boxShadow:reg===r.id?"0 2px 10px rgba(80,70,50,0.08)":"none",
                transition:"all 0.25s", fontFamily:"inherit",
              }}>{r.label} <span style={{ fontSize:10, color:reg===r.id?"#c8c0b8":"#c8c0b8" }}>{r.n}</span></button>
            ))}
          </div>
          <select style={{ border:"1px solid #e8e0d4", borderRadius:14, padding:"8px 14px", fontSize:12, color:"#8a8278", background:"#fff", cursor:"pointer", fontFamily:"inherit" }}>
            <option>預設排序</option>
            <option>價格低→高</option>
            <option>價格高→低</option>
          </select>
        </div>

        {/* ═══ FILTERS ═══ */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:40 }}>
          {FT.map(t=>(
            <button key={t} onClick={()=>toggle(t)} style={{
              padding:"8px 18px", borderRadius:24, fontSize:12, fontWeight:600, cursor:"pointer",
              border:"none",
              background:tags.has(t)?"#3a3632":"#fff",
              color:tags.has(t)?"#f8f4ec":"#8a8278",
              boxShadow:tags.has(t)?"0 2px 8px rgba(58,54,50,0.15)":"0 1px 4px rgba(80,70,50,0.04)",
              transition:"all 0.2s", fontFamily:"inherit",
            }}>{t}</button>
          ))}
        </div>

        {/* ═══ HERO ═══ */}
        {hero && <div style={{ marginBottom:48 }}><Hero p={hero} fav={fav}/></div>}

        {/* ═══ GRID (3 cards, 1 row) ═══ */}
        {grid.length>0 && <>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ width:32, height:3, borderRadius:2, background:"#d4c8b0" }}/>
            <span style={{ fontSize:13, fontWeight:600, color:"#8a8278", letterSpacing:2 }}>推薦建案</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20, marginBottom:64 }}>
            {grid.map((p,i) => <Card key={p.id} p={p} idx={i} fav={fav}/>)}
          </div>
        </>}

        {/* ═══ MORE LIST ═══ */}
        {list.length>0 && <>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <div style={{ width:32, height:3, borderRadius:2, background:"#d4c8b0" }}/>
            <span style={{ fontSize:13, fontWeight:600, color:"#8a8278", letterSpacing:2 }}>更多建案</span>
            <div style={{ flex:1, height:1, background:"#e8e0d4" }}/>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:40 }}>
            {list.map((p,i) => <Row key={p.id} p={p} i={i} fav={fav}/>)}
          </div>
        </>}

        {/* ═══ CTA ═══ */}
        <div style={{ textAlign:"center", marginTop:20 }}>
          <button style={{
            padding:"16px 48px", borderRadius:28, border:"none",
            background:"#3a3632", color:"#f8f4ec", fontSize:14, fontWeight:700,
            cursor:"pointer", fontFamily:"inherit", letterSpacing:2,
            boxShadow:"0 8px 24px rgba(58,54,50,0.15)",
            transition:"all 0.25s",
          }}>探索更多建案</button>
        </div>

        {/* ═══ FOOTER ═══ */}
        <div style={{ marginTop:64, paddingTop:20, borderTop:"1px solid #e8e0d4", fontSize:11, color:"#c8c0b8", lineHeight:2 }}>
          建案資訊由建商提供。「合作建案」為付費展示方案，不影響排序位置。如需查看建商公開資料，請點入建案詳情頁。
        </div>
      </div>
    </div>
  );
}
