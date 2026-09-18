import { useState } from "react";
import ArcRaidersGuide from "./games/ArcRaiders.jsx";
import CronosGuide from "./games/CronosGuide.jsx";
import SarosGuide from "./games/SarosGuide.jsx";
import MarathonGuide from "./games/MarathonGuide.jsx";
import Destiny2Guide from "./games/Destiny2Guide.jsx";

// ─── ALTERED CARBON PALETTE ───────────────────────────────────────────────────
const C = {
  bg:       "#020408",
  panel:    "#060c14",
  panelAlt: "#080f18",
  border:   "#0e1e2e",
  borderBright: "#142436",
  teal:     "#00f0c8",
  tealDim:  "#007a66",
  red:      "#ff1f4b",
  redDim:   "#7a0f24",
  amber:    "#ff9500",
  amberDim: "#7a4800",
  blue:     "#1e6fff",
  purple:   "#8b44ff",
  dim:      "#1e3448",
  dimmer:   "#0e1e2e",
  text:     "#8ab4cc",
  textDim:  "#3a6070",
  textBright:"#d0ecff",
  grid:     "rgba(0,240,200,0.03)",
};
const F = { fontFamily: "'Courier New', 'Lucida Console', monospace" };

const GAMES = [
  {
    id: "arc-raiders",
    title: "ARC RAIDERS",
    subtitle: "Extraction Shooter",
    color: C.teal,
    accent: "#a8ff3e",
    glow: "0 0 20px rgba(0,240,200,0.2)",
    description: "Complete field guide — 100+ item loot DB, quest walkthroughs, workshop upgrades, full enemy tactics.",
    tags: ["Loot DB", "Quests", "Workshop", "Enemies"],
    component: ArcRaidersGuide,
    platform: "PC",
    status: "ACTIVE",
    lastUpdated: "Flashpoint Update",
  },
  {
    id: "cronos",
    title: "CRONOS: THE NEW DAWN",
    subtitle: "Survival Horror",
    color: C.red,
    accent: C.amber,
    glow: "0 0 20px rgba(255,31,75,0.2)",
    description: "Sci-fi survival horror by Bloober Team. Survival rules, all weapons, upgrade priority, enemy tactics.",
    tags: ["Survival", "Weapons", "Upgrades", "Enemies"],
    component: CronosGuide,
    platform: "PS5 / PC / Xbox",
    status: "ACTIVE",
    lastUpdated: "Sep 2025",
  },
  {
    id: "saros",
    title: "SAROS",
    subtitle: "Bullet-Hell Roguelite",
    color: C.purple,
    accent: "#c084fc",
    glow: "0 0 20px rgba(139,68,255,0.2)",
    description: "Housemarque's Returnal successor. Tips, weapons, Armor Matrix upgrades, biome guide, Halcyon explained.",
    tags: ["Tips", "Weapons", "Upgrades", "Biomes"],
    component: SarosGuide,
    platform: "PS5",
    status: "ACTIVE",
    lastUpdated: "Apr 30, 2026",
  },
  {
    id: "marathon",
    title: "MARATHON",
    subtitle: "PvPvE Extraction Shooter",
    color: C.amber,
    accent: "#fbbf24",
    glow: "0 0 20px rgba(255,149,0,0.2)",
    description: "Bungie's extraction shooter on Tau Ceti IV. All 7 Runner Shells, all 4 maps, weapons tier list.",
    tags: ["Tips", "Runners", "Maps", "Weapons"],
    component: MarathonGuide,
    platform: "PS5 / PC / Xbox",
    status: "ACTIVE",
    lastUpdated: "Mar 5, 2026",
  },
  {
    id: "destiny2",
    title: "DESTINY 2",
    subtitle: "FPS Looter Shooter",
    color: C.blue,
    accent: "#60a5fa",
    glow: "0 0 20px rgba(30,111,255,0.2)",
    description: "Complete guide — weapon slots, 18 subclasses, 10 expansions, all activities, exotic farming, ornaments, bounties.",
    tags: ["Basics", "Classes", "Farming", "Ornaments", "Bounties"],
    component: Destiny2Guide,
    platform: "PS4/5 / PC / Xbox",
    status: "FINAL SANDBOX",
    lastUpdated: "Monument of Triumph",
  },
];

function useLocalStorage(key, def) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; }
  });
  const save = (v) => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };
  return [val, save];
}

// ─── GLITCH TEXT ──────────────────────────────────────────────────────────────
function GlitchText({ children, color = C.teal, size = 28 }) {
  return (
    <span style={{
      fontSize: size, fontWeight: 900, letterSpacing: 6,
      color, textTransform: "uppercase",
      textShadow: `0 0 20px ${color}66, 2px 0 0 ${C.red}44, -2px 0 0 ${C.teal}33`,
      ...F,
    }}>{children}</span>
  );
}

// ─── SCANLINE OVERLAY ────────────────────────────────────────────────────────
function Scanlines() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
      backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,240,200,0.015) 3px, rgba(0,240,200,0.015) 4px),
        repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,240,200,0.008) 40px, rgba(0,240,200,0.008) 41px)
      `,
    }}/>
  );
}

// ─── HOME SCREEN ─────────────────────────────────────────────────────────────
function HomeScreen({ onOpenGame, notes, setNotes }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(notes);

  return (
    <div style={{ ...F, background: C.bg, minHeight: "100vh", color: C.text }}>
      <Scanlines />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto", padding: "28px 16px" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          {/* Top bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
            <div>
              {/* Corp header */}
              <div style={{ fontSize: 9, letterSpacing: 8, color: C.tealDim, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 20, height: 1, background: C.teal }} />
                SECURED ARCHIVE · PERSONAL SLEEVE
                <div style={{ width: 20, height: 1, background: C.teal }} />
              </div>
              <GlitchText color={C.teal} size={30}>GAME VAULT</GlitchText>
              <div style={{ fontSize: 10, letterSpacing: 4, color: C.textDim, marginTop: 6 }}>
                TACTICAL REFERENCE SYSTEM v3.0
              </div>
            </div>
            {/* Status panel */}
            <div style={{
              background: C.panel, border: `1px solid ${C.border}`,
              borderLeft: `2px solid ${C.teal}`, padding: "10px 16px",
              minWidth: 160,
            }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: C.tealDim, marginBottom: 6 }}>SYSTEM STATUS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                  <span style={{ fontSize: 10, color: C.textDim }}>GUIDES LOADED</span>
                  <span style={{ fontSize: 10, color: C.teal, fontWeight: 700 }}>{GAMES.length}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                  <span style={{ fontSize: 10, color: C.textDim }}>STORAGE</span>
                  <span style={{ fontSize: 10, color: C.teal }}>LOCAL</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                  <span style={{ fontSize: 10, color: C.textDim }}>ENCRYPTION</span>
                  <span style={{ fontSize: 10, color: C.amber }}>PRIVATE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative line */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${C.teal}, ${C.tealDim}44, transparent)` }} />
            <div style={{ width: 4, height: 4, background: C.teal, transform: "rotate(45deg)" }} />
            <div style={{ width: 2, height: 2, background: C.teal, transform: "rotate(45deg)" }} />
          </div>
        </div>

        {/* Section header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 2, height: 14, background: C.teal }} />
          <span style={{ fontSize: 9, letterSpacing: 6, color: C.tealDim }}>LOADED ARCHIVES</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 9, color: C.dimmer, letterSpacing: 2 }}>SELECT TO ACCESS</span>
        </div>

        {/* Game cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10, marginBottom: 36 }}>
          {GAMES.map(game => (
            <div
              key={game.id}
              onClick={() => game.component && onOpenGame(game.id)}
              style={{
                background: C.panel,
                border: `1px solid ${C.border}`,
                borderLeft: `3px solid ${game.color}`,
                padding: "18px 16px",
                cursor: game.component ? "pointer" : "default",
                position: "relative", overflow: "hidden",
                transition: "border-color 0.15s, background 0.15s",
              }}
              onMouseEnter={e => {
                if (!game.component) return;
                e.currentTarget.style.background = C.panelAlt;
                e.currentTarget.style.borderColor = game.color;
                e.currentTarget.querySelector(".card-glow").style.opacity = "1";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = C.panel;
                e.currentTarget.style.borderLeftColor = game.color;
                e.currentTarget.style.borderTopColor = C.border;
                e.currentTarget.style.borderRightColor = C.border;
                e.currentTarget.style.borderBottomColor = C.border;
                e.currentTarget.querySelector(".card-glow").style.opacity = "0";
              }}
            >
              {/* Glow */}
              <div className="card-glow" style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                background: `radial-gradient(ellipse at top left, ${game.color}0c, transparent 60%)`,
                pointerEvents: "none", opacity: 0, transition: "opacity 0.2s",
              }}/>

              {/* Corner accent */}
              <div style={{
                position: "absolute", top: 0, right: 0,
                width: 0, height: 0,
                borderStyle: "solid",
                borderWidth: `0 16px 16px 0`,
                borderColor: `transparent ${game.color}44 transparent transparent`,
              }}/>

              {/* Top row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{
                  fontSize: 8, letterSpacing: 3, color: game.color,
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <div style={{ width: 5, height: 5, background: game.color, borderRadius: "50%" }}/>
                  {game.subtitle.toUpperCase()}
                </div>
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  <span style={{
                    fontSize: 8, letterSpacing: 2,
                    color: game.status === "FINAL SANDBOX" ? C.amber : C.teal,
                    background: game.status === "FINAL SANDBOX" ? `${C.amber}15` : `${C.teal}15`,
                    border: `1px solid ${game.status === "FINAL SANDBOX" ? C.amber : C.teal}44`,
                    padding: "1px 5px",
                  }}>{game.status}</span>
                </div>
              </div>

              {/* Title */}
              <div style={{
                fontSize: 15, fontWeight: 900, letterSpacing: 2,
                color: C.textBright, marginBottom: 3,
                textShadow: `0 0 12px ${game.color}33`,
              }}>{game.title}</div>

              {/* Platform */}
              <div style={{ fontSize: 9, color: C.textDim, letterSpacing: 1, marginBottom: 10 }}>{game.platform}</div>

              {/* Description */}
              <div style={{ fontSize: 11, color: C.text, marginBottom: 14, lineHeight: 1.6, opacity: 0.8 }}>
                {game.description}
              </div>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
                {game.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: 8, letterSpacing: 2,
                    color: game.accent,
                    background: `${game.accent}10`,
                    border: `1px solid ${game.accent}30`,
                    padding: "2px 6px",
                  }}>{tag}</span>
                ))}
              </div>

              {/* Footer */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
                <span style={{ fontSize: 9, color: C.textDim, letterSpacing: 1 }}>{game.lastUpdated}</span>
                <span style={{
                  fontSize: 10, color: game.color, letterSpacing: 3, fontWeight: 700,
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  {game.component ? "ACCESS" : "LOCKED"}
                  {game.component && <span style={{ fontSize: 12 }}>→</span>}
                </span>
              </div>
            </div>
          ))}

          {/* Add slot */}
          <div style={{
            border: `1px dashed ${C.dim}`,
            padding: "18px 16px",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            minHeight: 200, opacity: 0.3,
          }}>
            <div style={{ fontSize: 20, color: C.teal, marginBottom: 8 }}>+</div>
            <div style={{ fontSize: 9, color: C.teal, letterSpacing: 4 }}>NEW ARCHIVE</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 2, height: 14, background: C.red }} />
          <span style={{ fontSize: 9, letterSpacing: 6, color: C.redDim }}>PERSONAL TRANSMISSION</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 9, letterSpacing: 3, color: C.textDim }}>ENCRYPTED NOTES</span>
            {!editing ? (
              <button
                onClick={() => { setDraft(notes); setEditing(true); }}
                style={{
                  fontSize: 9, letterSpacing: 3, color: C.teal,
                  background: "transparent", border: `1px solid ${C.teal}44`,
                  padding: "4px 12px", cursor: "pointer", ...F,
                }}
              >EDIT</button>
            ) : (
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => { setNotes(draft); setEditing(false); }} style={{ fontSize: 9, letterSpacing: 3, color: C.teal, background: `${C.teal}15`, border: `1px solid ${C.teal}44`, padding: "4px 12px", cursor: "pointer", ...F }}>SAVE</button>
                <button onClick={() => setEditing(false)} style={{ fontSize: 9, letterSpacing: 3, color: C.textDim, background: "transparent", border: `1px solid ${C.border}`, padding: "4px 12px", cursor: "pointer", ...F }}>CANCEL</button>
              </div>
            )}
          </div>

          {editing ? (
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="// ENTER TRANSMISSION..."
              style={{
                width: "100%", boxSizing: "border-box",
                background: C.panel,
                border: `1px solid ${C.teal}44`,
                borderLeft: `2px solid ${C.teal}`,
                color: C.textBright,
                padding: "14px",
                fontSize: 12, lineHeight: 1.8,
                outline: "none", resize: "vertical", minHeight: 100, ...F,
                letterSpacing: 0.5,
              }}
            />
          ) : (
            <div style={{
              background: C.panel,
              border: `1px solid ${C.border}`,
              borderLeft: `2px solid ${C.red}55`,
              padding: "14px",
              minHeight: 70,
              fontSize: 12, color: notes ? C.text : C.textDim,
              lineHeight: 1.8, whiteSpace: "pre-wrap",
              fontStyle: notes ? "normal" : "italic",
            }}>
              {notes || "// NO ACTIVE TRANSMISSIONS — EDIT TO COMPOSE"}
            </div>
          )}
          <div style={{ fontSize: 8, color: C.dimmer, marginTop: 5, letterSpacing: 2 }}>
            ▸ STORED IN LOCAL SLEEVE · NOT SYNCED
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: `1px solid ${C.border}`, paddingTop: 16,
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 4, height: 4, background: C.teal, transform: "rotate(45deg)" }}/>
            <span style={{ fontSize: 8, color: C.dimmer, letterSpacing: 3 }}>GAME VAULT · PERSONAL ARCHIVE</span>
          </div>
          <span style={{ fontSize: 8, color: C.dimmer, letterSpacing: 2 }}>DATA DOES NOT LEAVE THIS SLEEVE</span>
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [currentGame, setCurrentGame] = useState(null);
  const [notes, setNotes] = useLocalStorage("gamevault-notes", "");
  const activeGame = GAMES.find(g => g.id === currentGame);

  return (
    <div>
      {/* Back nav bar */}
      {currentGame && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "#020408f0",
          borderBottom: `1px solid ${C.border}`,
          backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
          ...F,
        }}>
          {/* Scanline on nav */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,240,200,0.012) 3px,rgba(0,240,200,0.012) 4px)", pointerEvents: "none" }}/>

          <button
            onClick={() => setCurrentGame(null)}
            style={{
              background: "transparent",
              border: `1px solid ${C.border}`,
              color: C.textDim, fontSize: 10, letterSpacing: 3,
              padding: "5px 14px", cursor: "pointer", ...F,
              display: "flex", alignItems: "center", gap: 6, position: "relative", zIndex: 1,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textDim; }}
          >
            ← VAULT
          </button>

          <div style={{ width: 1, height: 16, background: C.border, position: "relative", zIndex: 1 }} />

          <div style={{ display: "flex", alignItems: "center", gap: 6, position: "relative", zIndex: 1 }}>
            <div style={{ width: 5, height: 5, background: activeGame?.color || C.teal, borderRadius: "50%" }} />
            <span style={{
              fontSize: 11,
              color: activeGame?.color || C.teal,
              letterSpacing: 3, fontWeight: 700,
              textShadow: `0 0 10px ${activeGame?.color || C.teal}66`,
            }}>{activeGame?.title}</span>
          </div>
        </div>
      )}

      <div style={{ paddingTop: currentGame ? 46 : 0 }}>
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
