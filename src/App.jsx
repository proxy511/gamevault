import { useState } from "react";
import ArcRaidersGuide from "./games/ArcRaiders.jsx";
import CronosGuide from "./games/CronosGuide.jsx";
import SarosGuide from "./games/SarosGuide.jsx";
import MarathonGuide from "./games/MarathonGuide.jsx";
import Destiny2Guide from "./games/Destiny2Guide.jsx";

// ─── CYBERPUNK 2077 PALETTE ───────────────────────────────────────────────────
const C = {
  bg:        "#0a0d1a",
  panel:     "#0f1222",
  panelHov:  "#131627",
  border:    "#1e2540",
  borderBrt: "#2a3560",
  yellow:    "#fcee09",
  yellowDim: "#7a720a",
  orange:    "#e87800",
  red:       "#ff3d3d",
  cyan:      "#00d9ff",
  blue:      "#1b6fff",
  purple:    "#b44fff",
  dim:       "#252a40",
  dimmer:    "#141828",
  text:      "#d8e4f0",
  textDim:   "#6a7a9a",
  textBright:"#ffffff",
};
const F = { fontFamily:"'Courier New','Lucida Console',monospace" };

const GAMES = [
  {
    id:"arc-raiders", title:"ARC RAIDERS", subtitle:"Extraction Shooter",
    color:C.cyan, accent:"#a8ff3e",
    description:"100+ item loot DB, all NPC quests, workshop upgrades, full enemy roster with weaknesses and drops.",
    tags:["Loot DB","Quests","Workshop","Enemies"],
    component:ArcRaidersGuide, platform:"PC", lastUpdated:"Flashpoint Update",
  },
  {
    id:"cronos", title:"CRONOS: THE NEW DAWN", subtitle:"Survival Horror",
    color:C.red, accent:C.orange,
    description:"Survival rules, charged shot system, all weapons and upgrade priority, every enemy type explained.",
    tags:["Survival","Weapons","Upgrades","Enemies"],
    component:CronosGuide, platform:"PS5 / PC / Xbox", lastUpdated:"Sep 2025",
  },
  {
    id:"saros", title:"SAROS", subtitle:"Bullet-Hell Roguelite",
    color:C.purple, accent:"#d084fc",
    description:"Eclipse mechanic, Halcyon farming, Armor Matrix upgrades, all biomes, weapon tier list.",
    tags:["Tips","Weapons","Upgrades","Biomes"],
    component:SarosGuide, platform:"PS5", lastUpdated:"Apr 30, 2026",
  },
  {
    id:"marathon", title:"MARATHON", subtitle:"PvPvE Extraction Shooter",
    color:C.orange, accent:"#fbbf24",
    description:"All 7 Runner Shells, 4 maps, weapon tier list, Heat system, extraction strategy.",
    tags:["Tips","Runners","Maps","Weapons"],
    component:MarathonGuide, platform:"PS5 / PC / Xbox", lastUpdated:"Mar 5, 2026",
  },
  {
    id:"destiny2", title:"DESTINY 2", subtitle:"FPS Looter Shooter",
    color:C.blue, accent:"#60a5fa",
    description:"Complete guide — 15 tabs covering weapon slots, all 18 subclasses, every expansion, exotic farming, quest walkthroughs, builds, enemies and more.",
    tags:["Quests","Builds","Loadouts","Enemies","Lost Sectors"],
    component:Destiny2Guide, platform:"PS4/5 / PC / Xbox", lastUpdated:"Monument of Triumph · Jun 2026",
  },
];

function useLocalStorage(key, def) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; }
    catch { return def; }
  });
  const save = (v) => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };
  return [val, save];
}

function HomeScreen({ onOpenGame, notes, setNotes }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(notes);

  return (
    <div style={{ ...F, background:C.bg, minHeight:"100vh", color:C.text }}>
      {/* Subtle grid overlay */}
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        backgroundImage:`linear-gradient(rgba(252,238,9,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(252,238,9,0.025) 1px, transparent 1px)`,
        backgroundSize:"40px 40px",
      }}/>

      <div style={{ position:"relative", zIndex:1, maxWidth:1060, margin:"0 auto", padding:"32px 20px" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom:40 }}>
          <div style={{ fontSize:11, letterSpacing:8, color:C.yellowDim, marginBottom:10 }}>
            ◈ PERSONAL ARCHIVE SYSTEM ◈
          </div>
          <div style={{
            fontSize:44, fontWeight:900, letterSpacing:6, color:C.yellow,
            textShadow:`0 0 30px ${C.yellow}55, 0 0 60px ${C.yellow}22`,
            marginBottom:6,
          }}>GAME VAULT</div>
          <div style={{ fontSize:14, letterSpacing:4, color:C.textDim }}>
            {GAMES.length} ARCHIVES LOADED — TAP TO ACCESS
          </div>
          <div style={{
            marginTop:16, height:2,
            background:`linear-gradient(90deg, ${C.yellow}, ${C.orange}88, transparent)`,
          }}/>
        </div>

        {/* ── GAME CARDS ── */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill, minmax(290px, 1fr))",
          gap:14, marginBottom:40,
        }}>
          {GAMES.map(game => (
            <div
              key={game.id}
              onClick={() => game.component && onOpenGame(game.id)}
              style={{
                background:C.panel,
                border:`1px solid ${C.border}`,
                borderLeft:`4px solid ${game.color}`,
                padding:"22px 20px",
                cursor:game.component ? "pointer" : "default",
                position:"relative", overflow:"hidden",
              }}
              onMouseEnter={e => {
                if (!game.component) return;
                e.currentTarget.style.background = C.panelHov;
                e.currentTarget.style.borderColor = game.color;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = C.panel;
                e.currentTarget.style.borderTopColor = C.border;
                e.currentTarget.style.borderRightColor = C.border;
                e.currentTarget.style.borderBottomColor = C.border;
              }}
            >
              {/* Corner decoration */}
              <div style={{
                position:"absolute", top:0, right:0,
                width:40, height:40,
                background:`linear-gradient(225deg, ${game.color}22, transparent)`,
                borderBottom:`1px solid ${game.color}33`,
                borderLeft:`1px solid ${game.color}33`,
              }}/>
              <div style={{
                position:"absolute", top:6, right:6,
                width:6, height:6,
                background:game.color,
                borderRadius:"50%",
                boxShadow:`0 0 8px ${game.color}`,
              }}/>

              {/* Subtitle + platform */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <div style={{ fontSize:11, letterSpacing:3, color:game.color, fontWeight:700 }}>
                  {game.subtitle.toUpperCase()}
                </div>
                <div style={{
                  fontSize:10, color:C.textDim, letterSpacing:1,
                  background:C.dim, border:`1px solid ${C.border}`,
                  padding:"2px 8px",
                }}>{game.platform}</div>
              </div>

              {/* Title */}
              <div style={{
                fontSize:18, fontWeight:900, letterSpacing:2,
                color:C.textBright, marginBottom:10,
                textShadow:`0 0 10px ${game.color}33`,
              }}>{game.title}</div>

              {/* Description */}
              <div style={{
                fontSize:13, color:C.text, marginBottom:16,
                lineHeight:1.7, opacity:0.85,
              }}>{game.description}</div>

              {/* Tags */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:16 }}>
                {game.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize:10, letterSpacing:2,
                    color:game.accent,
                    background:`${game.accent}12`,
                    border:`1px solid ${game.accent}35`,
                    padding:"3px 8px",
                  }}>{tag}</span>
                ))}
              </div>

              {/* Footer */}
              <div style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                borderTop:`1px solid ${C.border}`, paddingTop:12,
              }}>
                <span style={{ fontSize:11, color:C.textDim }}>{game.lastUpdated}</span>
                <span style={{
                  fontSize:12, color:game.color,
                  letterSpacing:3, fontWeight:900,
                  display:"flex", alignItems:"center", gap:6,
                }}>
                  {game.component ? <>ACCESS <span style={{fontSize:16}}>→</span></> : "LOCKED"}
                </span>
              </div>
            </div>
          ))}

          {/* Add slot */}
          <div style={{
            border:`1px dashed ${C.dim}`, padding:"22px 20px",
            display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center",
            minHeight:220, opacity:0.25,
          }}>
            <div style={{ fontSize:32, color:C.yellow, marginBottom:8 }}>+</div>
            <div style={{ fontSize:11, color:C.yellow, letterSpacing:4 }}>NEW ARCHIVE</div>
          </div>
        </div>

        {/* ── NOTES ── */}
        <div style={{
          borderTop:`1px solid ${C.border}`, paddingTop:24, marginBottom:24,
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ fontSize:11, letterSpacing:5, color:C.yellow }}>◈ PERSONAL NOTES</div>
            {!editing ? (
              <button onClick={() => { setDraft(notes); setEditing(true); }} style={{
                fontSize:11, letterSpacing:3, color:C.yellow,
                background:`${C.yellow}12`, border:`1px solid ${C.yellow}44`,
                padding:"6px 16px", cursor:"pointer", ...F,
              }}>EDIT</button>
            ) : (
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => { setNotes(draft); setEditing(false); }} style={{
                  fontSize:11, letterSpacing:3, color:C.bg, fontWeight:900,
                  background:C.yellow, border:"none",
                  padding:"6px 16px", cursor:"pointer", ...F,
                }}>SAVE</button>
                <button onClick={() => setEditing(false)} style={{
                  fontSize:11, letterSpacing:3, color:C.textDim,
                  background:"transparent", border:`1px solid ${C.border}`,
                  padding:"6px 16px", cursor:"pointer", ...F,
                }}>CANCEL</button>
              </div>
            )}
          </div>

          {editing ? (
            <textarea value={draft} onChange={e => setDraft(e.target.value)}
              placeholder="// ADD NOTES..."
              style={{
                width:"100%", boxSizing:"border-box",
                background:C.panel, border:`1px solid ${C.yellow}55`,
                borderLeft:`3px solid ${C.yellow}`,
                color:C.textBright, padding:"16px",
                fontSize:14, lineHeight:1.8, outline:"none",
                resize:"vertical", minHeight:120, ...F,
              }}/>
          ) : (
            <div style={{
              background:C.panel, border:`1px solid ${C.border}`,
              borderLeft:`3px solid ${C.yellowDim}`,
              padding:"16px", minHeight:80,
              fontSize:14, color:notes ? C.text : C.textDim,
              lineHeight:1.8, whiteSpace:"pre-wrap",
            }}>
              {notes || "// NO NOTES — TAP EDIT TO ADD"}
            </div>
          )}
          <div style={{ fontSize:11, color:C.dimmer, marginTop:6, letterSpacing:2 }}>
            ▸ SAVED LOCALLY — NOT SYNCED
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display:"flex", justifyContent:"space-between",
          flexWrap:"wrap", gap:8,
        }}>
          <span style={{ fontSize:11, color:C.dimmer, letterSpacing:3 }}>GAME VAULT v3.0</span>
          <span style={{ fontSize:11, color:C.dimmer, letterSpacing:3 }}>PERSONAL USE · LOCAL STORAGE</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentGame, setCurrentGame] = useState(null);
  const [notes, setNotes] = useLocalStorage("gamevault-notes", "");
  const activeGame = GAMES.find(g => g.id === currentGame);

  return (
    <div>
      {currentGame && (
        <div style={{
          position:"fixed", top:0, left:0, right:0, zIndex:100,
          background:`${C.bg}f5`, backdropFilter:"blur(10px)",
          borderBottom:`2px solid ${C.yellow}44`,
          display:"flex", alignItems:"center", gap:14, padding:"12px 20px",
          ...F,
        }}>
          <button onClick={() => setCurrentGame(null)} style={{
            background:"transparent",
            border:`1px solid ${C.border}`,
            borderLeft:`3px solid ${C.yellow}`,
            color:C.textDim, fontSize:12, letterSpacing:3,
            padding:"7px 16px", cursor:"pointer", ...F,
          }}
            onMouseEnter={e => { e.currentTarget.style.color = C.yellow; e.currentTarget.style.borderColor = C.yellow; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.textDim; e.currentTarget.style.borderTopColor = C.border; e.currentTarget.style.borderRightColor = C.border; e.currentTarget.style.borderBottomColor = C.border; }}
          >← VAULT</button>
          <div style={{ width:1, height:20, background:C.border }}/>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:8, height:8, background:activeGame?.color || C.yellow, borderRadius:"50%", boxShadow:`0 0 8px ${activeGame?.color}` }}/>
            <span style={{ fontSize:13, color:activeGame?.color || C.yellow, letterSpacing:3, fontWeight:900 }}>
              {activeGame?.title}
            </span>
          </div>
        </div>
      )}
      <div style={{ paddingTop:currentGame ? 52 : 0 }}>
        {!currentGame
          ? <HomeScreen onOpenGame={setCurrentGame} notes={notes} setNotes={setNotes} />
          : activeGame
            ? <activeGame.component />
            : <HomeScreen onOpenGame={setCurrentGame} notes={notes} setNotes={setNotes} />
        }
      </div>
    </div>
  );
}
