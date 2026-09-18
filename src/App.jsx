import { useState } from "react";
import ArcRaidersGuide from "./games/ArcRaiders.jsx";
import CronosGuide from "./games/CronosGuide.jsx";
import SarosGuide from "./games/SarosGuide.jsx";
import MarathonGuide from "./games/MarathonGuide.jsx";
import Destiny2Guide from "./games/Destiny2Guide.jsx";

// CYBERPUNK 2077 — high contrast, panels clearly visible against bg
const C = {
  bg:        "#0a0b18",   // dark navy
  panel:     "#14172e",   // clearly lighter — cards visible
  panelHov:  "#1c2040",   // hover state
  border:    "#fcee09",   // YELLOW borders — CP2077 signature
  borderDim: "#2a2e55",   // dim borders for subtle dividers
  yellow:    "#fcee09",
  yellowDim: "#7a720a",
  orange:    "#ff8c00",
  red:       "#ff3232",
  cyan:      "#00d9ff",
  blue:      "#4488ff",
  purple:    "#cc44ff",
  text:      "#ffffff",   // pure white body text
  textDim:   "#8899cc",   // blue-tinted secondary text
  textBright:"#ffffff",
  dim:       "#1e2240",
  dimmer:    "#111428",
};
const F = { fontFamily:"'Courier New','Lucida Console',monospace" };

const GAMES = [
  { id:"arc-raiders", title:"ARC RAIDERS", subtitle:"Extraction Shooter",
    color:C.cyan, accent:"#a8ff3e",
    description:"100+ item loot database, all NPC quest walkthroughs, workshop upgrades, full enemy roster with weaknesses and drops.",
    tags:["Loot DB","Quests","Workshop","Enemies"],
    component:ArcRaidersGuide, platform:"PC", lastUpdated:"Flashpoint Update" },
  { id:"cronos", title:"CRONOS: THE NEW DAWN", subtitle:"Survival Horror",
    color:C.red, accent:C.orange,
    description:"Charged shot system, all weapons and upgrade priority, every enemy and merge mechanic explained.",
    tags:["Survival","Weapons","Upgrades","Enemies"],
    component:CronosGuide, platform:"PS5 / PC / Xbox", lastUpdated:"Sep 2025" },
  { id:"saros", title:"SAROS", subtitle:"Bullet-Hell Roguelite",
    color:C.purple, accent:"#d084fc",
    description:"Eclipse mechanic, Halcyon farming, Armor Matrix upgrades, all biomes, weapon tier list.",
    tags:["Tips","Weapons","Upgrades","Biomes"],
    component:SarosGuide, platform:"PS5", lastUpdated:"Apr 30, 2026" },
  { id:"marathon", title:"MARATHON", subtitle:"PvPvE Extraction Shooter",
    color:C.orange, accent:"#fbbf24",
    description:"All 7 Runner Shells, 4 maps, weapon tier list, Heat system, extraction strategy.",
    tags:["Tips","Runners","Maps","Weapons"],
    component:MarathonGuide, platform:"PS5 / PC / Xbox", lastUpdated:"Mar 5, 2026" },
  { id:"destiny2", title:"DESTINY 2", subtitle:"FPS Looter Shooter",
    color:C.blue, accent:"#60a5fa",
    description:"Complete guide — all quests with walkthroughs, 18 subclasses, all exotics, builds, farming, enemies, lost sectors and more.",
    tags:["Quests","Builds","Loadouts","Enemies","Lost Sectors"],
    component:Destiny2Guide, platform:"PS4/5 / PC / Xbox", lastUpdated:"Monument of Triumph · Jun 2026" },
];

function useLocalStorage(key, def) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; }
  });
  const save = (v) => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };
  return [val, save];
}

function HomeScreen({ onOpenGame, notes, setNotes }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(notes);
  return (
    <div style={{ ...F, background:C.bg, minHeight:"100vh", color:C.text }}>
      {/* CP2077 grid overlay */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        backgroundImage:"linear-gradient(rgba(252,238,9,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(252,238,9,0.04) 1px,transparent 1px)",
        backgroundSize:"48px 48px" }}/>

      <div style={{ position:"relative", zIndex:1, maxWidth:1080, margin:"0 auto", padding:"36px 20px" }}>

        {/* HEADER */}
        <div style={{ marginBottom:44 }}>
          <div style={{ fontSize:12, letterSpacing:8, color:C.yellowDim, marginBottom:12 }}>
            ◈ PERSONAL ARCHIVE SYSTEM · NIGHT CITY
          </div>
          <div style={{ fontSize:52, fontWeight:900, letterSpacing:6, color:C.yellow, marginBottom:8,
            textShadow:`0 0 40px ${C.yellow}66, 0 0 80px ${C.yellow}22, 2px 2px 0 #000` }}>
            GAME VAULT
          </div>
          <div style={{ fontSize:16, letterSpacing:4, color:C.textDim, marginBottom:20 }}>
            {GAMES.length} ARCHIVES LOADED — TAP TO ACCESS
          </div>
          <div style={{ height:3, background:C.yellow, boxShadow:`0 0 16px ${C.yellow}` }}/>
        </div>

        {/* GAME CARDS */}
        <div style={{ marginBottom:16, fontSize:12, letterSpacing:6, color:C.yellow }}>◈ MY GAMES</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16, marginBottom:44 }}>
          {GAMES.map(game => (
            <div key={game.id}
              onClick={() => game.component && onOpenGame(game.id)}
              style={{ background:C.panel, border:`1px solid ${C.borderDim}`,
                borderLeft:`4px solid ${game.color}`, padding:"24px 20px",
                cursor:game.component?"pointer":"default", position:"relative", overflow:"hidden" }}
              onMouseEnter={e => { if(!game.component)return;
                e.currentTarget.style.background=C.panelHov;
                e.currentTarget.style.borderLeftColor=C.yellow; }}
              onMouseLeave={e => {
                e.currentTarget.style.background=C.panel;
                e.currentTarget.style.borderLeftColor=game.color; }}>

              {/* Corner dot */}
              <div style={{ position:"absolute", top:12, right:12, width:10, height:10,
                background:game.color, borderRadius:"50%", boxShadow:`0 0 10px ${game.color}` }}/>

              <div style={{ fontSize:12, letterSpacing:3, color:game.color, fontWeight:700, marginBottom:10 }}>
                {game.subtitle.toUpperCase()}
              </div>
              <div style={{ fontSize:20, fontWeight:900, letterSpacing:2, color:"#fff", marginBottom:12,
                textShadow:`0 0 12px ${game.color}44` }}>
                {game.title}
              </div>
              <div style={{ fontSize:15, color:"#b0bcd8", marginBottom:18, lineHeight:1.7 }}>
                {game.description}
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:18 }}>
                {game.tags.map(tag => (
                  <span key={tag} style={{ fontSize:11, letterSpacing:2, color:game.accent,
                    background:`${game.accent}18`, border:`1px solid ${game.accent}44`,
                    padding:"4px 10px" }}>{tag}</span>
                ))}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                borderTop:`1px solid ${C.borderDim}`, paddingTop:14 }}>
                <span style={{ fontSize:12, color:C.textDim }}>{game.lastUpdated}</span>
                <span style={{ fontSize:14, color:game.color, letterSpacing:3, fontWeight:900 }}>
                  {game.component ? "ACCESS →" : "LOCKED"}
                </span>
              </div>
            </div>
          ))}

          {/* Add slot */}
          <div style={{ border:`1px dashed ${C.borderDim}`, padding:"24px 20px",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            minHeight:240, opacity:0.3 }}>
            <div style={{ fontSize:36, color:C.yellow, marginBottom:10 }}>+</div>
            <div style={{ fontSize:12, color:C.yellow, letterSpacing:4 }}>NEW ARCHIVE</div>
          </div>
        </div>

        {/* NOTES */}
        <div style={{ borderTop:`1px solid ${C.borderDim}`, paddingTop:28, marginBottom:28 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ fontSize:12, letterSpacing:6, color:C.yellow }}>◈ PERSONAL NOTES</div>
            {!editing ? (
              <button onClick={() => { setDraft(notes); setEditing(true); }}
                style={{ fontSize:12, letterSpacing:3, color:C.yellow,
                  background:`${C.yellow}18`, border:`1px solid ${C.yellow}77`,
                  padding:"8px 20px", cursor:"pointer", ...F }}>EDIT</button>
            ) : (
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={() => { setNotes(draft); setEditing(false); }}
                  style={{ fontSize:12, letterSpacing:3, color:C.bg, fontWeight:900,
                    background:C.yellow, border:"none", padding:"8px 20px", cursor:"pointer", ...F }}>SAVE</button>
                <button onClick={() => setEditing(false)}
                  style={{ fontSize:12, letterSpacing:3, color:C.textDim,
                    background:"transparent", border:`1px solid ${C.borderDim}`,
                    padding:"8px 20px", cursor:"pointer", ...F }}>CANCEL</button>
              </div>
            )}
          </div>
          {editing ? (
            <textarea value={draft} onChange={e=>setDraft(e.target.value)}
              placeholder="// ADD NOTES..."
              style={{ width:"100%", boxSizing:"border-box", background:C.dim,
                border:`1px solid ${C.yellow}88`, borderLeft:`4px solid ${C.yellow}`,
                color:"#fff", padding:"18px", fontSize:16, lineHeight:1.8,
                outline:"none", resize:"vertical", minHeight:130, ...F }}/>
          ) : (
            <div style={{ background:C.panel, border:`1px solid ${C.borderDim}`,
              borderLeft:`4px solid ${C.yellowDim}`, padding:"18px", minHeight:90,
              fontSize:16, color:notes?"#b0bcd8":C.textDim, lineHeight:1.8, whiteSpace:"pre-wrap" }}>
              {notes || "// NO NOTES — TAP EDIT TO ADD"}
            </div>
          )}
          <div style={{ fontSize:12, color:C.textDim, marginTop:8, letterSpacing:2 }}>
            ▸ SAVED LOCALLY — NOT SYNCED
          </div>
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
          <span style={{ fontSize:12, color:C.textDim, letterSpacing:3 }}>GAME VAULT v3.0</span>
          <span style={{ fontSize:12, color:C.textDim, letterSpacing:3 }}>PERSONAL USE · LOCAL STORAGE</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentGame, setCurrentGame] = useState(null);
  const [notes, setNotes] = useLocalStorage("gamevault-notes","");
  const activeGame = GAMES.find(g=>g.id===currentGame);
  return (
    <div>
      {currentGame && (
        <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:100,
          background:`${C.bg}f5`, backdropFilter:"blur(10px)",
          borderBottom:`3px solid ${C.yellow}`, ...F,
          display:"flex", alignItems:"center", gap:14, padding:"14px 20px" }}>
          <button onClick={()=>setCurrentGame(null)}
            style={{ background:"transparent", border:`1px solid ${C.yellow}77`,
              borderLeft:`4px solid ${C.yellow}`, color:"#fff",
              fontSize:14, letterSpacing:3, padding:"8px 18px", cursor:"pointer", ...F }}
            onMouseEnter={e=>{ e.currentTarget.style.background=`${C.yellow}18`; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; }}>
            ← VAULT
          </button>
          <div style={{ width:1, height:22, background:C.borderDim }}/>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:10, height:10, background:activeGame?.color||C.yellow,
              borderRadius:"50%", boxShadow:`0 0 10px ${activeGame?.color}` }}/>
            <span style={{ fontSize:15, color:activeGame?.color||C.yellow, letterSpacing:3, fontWeight:900 }}>
              {activeGame?.title}
            </span>
          </div>
        </div>
      )}
      <div style={{ paddingTop:currentGame?54:0 }}>
        {!currentGame
          ? <HomeScreen onOpenGame={setCurrentGame} notes={notes} setNotes={setNotes}/>
          : activeGame
            ? <activeGame.component/>
            : <HomeScreen onOpenGame={setCurrentGame} notes={notes} setNotes={setNotes}/>}
      </div>
    </div>
  );
}
