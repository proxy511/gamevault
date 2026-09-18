import { useState } from "react";

const C = {
  bg:"#0a0706", panel:"#110d0c", border:"#2a1a14",
  red:"#c0392b", orange:"#e8692a", amber:"#e8a030",
  green:"#6ee7b7", blue:"#60a5fa", purple:"#c77dff",
  dim:"#5a3a30", dimmer:"#2a1a14",
  text:"#d4c4bc", textDim:"#8a6a5a", textBright:"#f0e4dc",
};
const F = { fontFamily:"'Courier New','Lucida Console',monospace" };

// ─── SURVIVAL TIPS ────────────────────────────────────────────────────────────
const SURVIVAL = [
  {
    title:"Charged Shots Are Everything",
    icon:"⚡",
    color:C.amber,
    body:"Normal shots barely tickle enemies and waste ammo. Hold the fire button to charge — this is the ONLY effective way to damage most enemies. Every combat encounter is built around this. Never tap-fire at enemies.",
    tip:"Upgrade Charge Speed first — it transforms every fight.",
  },
  {
    title:"Burn Corpses. Always.",
    icon:"🔥",
    color:C.red,
    body:"Dead enemies can be absorbed by living Orphans, merging them into a much stronger combined form. Burn every corpse with your Torch before moving on. Fuel dispensers are infinite — they refill you as long as you have none in inventory or stash. You are fireproof so punch fire barrels directly to save ammo.",
    tip:"Never save your Torch fuel for 'later'. There is no later. Use it constantly.",
  },
  {
    title:"Flashlight = Safety Indicator",
    icon:"🔦",
    color:C.blue,
    body:"Flashlight OFF = safe zone. Enemies cannot reach you. Use these zones to sort inventory, craft, and plan. Flashlight ON = hostile territory. It occasionally malfunctions right before major encounters — use that warning to prepare.",
    tip:"When the flashlight starts glitching, stop and sort your inventory before pushing forward.",
  },
  {
    title:"Inventory Is Your Biggest Problem",
    icon:"🎒",
    color:C.amber,
    body:"You start with only 6 slots. Weapons, ammo, heals, tools — everything takes a slot except raw crafting materials. You will constantly feel strangled for space. Stash boxes connect across all locations so you can retrieve items from any safe zone.",
    tip:"Spend your first Cores on inventory slots, not damage or health. More space = more options = survival.",
  },
  {
    title:"Craft Ammo — Never Buy It Directly",
    icon:"🔧",
    color:C.green,
    body:"Buying ammo per-bullet is expensive. Crafting from materials is always cheaper. 3 Chemicals crafts 5 handgun bullets — even buying all 3 Chemicals costs less than buying the bullets outright. Hold the weapon button while in safe zones to quick-craft ammo mid-run.",
    tip:"Hold the weapon button to craft ammo instantly without opening the menu. Same for heals — hold the heal button.",
  },
  {
    title:"Use the Environment",
    icon:"💥",
    color:C.orange,
    body:"Explosive canisters kill multiple enemies at once and prevent merging. Punch fire barrels (you're fireproof) to ignite groups without spending ammo. Lure enemies into explosive zones before engaging. Red-lit metal doors lock you in until all enemies die — in open areas, running is always an option.",
    tip:"Shoot explosive canisters from a distance. Punch fire barrels up close. Know the difference.",
  },
  {
    title:"Pet Every Cat",
    icon:"🐱",
    color:C.purple,
    body:"There are 10 cats hidden throughout the game. Each one gives you a Core when petted — the rarest and most valuable upgrade material. The first cat (Baroa) is unmissable. Later cats are well hidden. Explore every corner.",
    tip:"Cats can give ammo, crafting materials, and rare Cores. They are worth every detour.",
  },
  {
    title:"Survivors Change Your Playstyle",
    icon:"👥",
    color:C.blue,
    body:"You can only have a limited number of survivors at once. Each gives passive buffs to specific weapons:\n• Artur — Headshot damage with handguns (turns the pistol into a magnum)\n• Gabe — Shotgun damage when hitting multiple enemies\n• Father — Carbine damage when standing still\nYou cannot have all 3 simultaneously — choose based on your loadout.",
    tip:"If you're running the Sword/Dagger pistol, Artur is game-changing early on.",
  },
  {
    title:"Valuables = Sell Immediately",
    icon:"💎",
    color:C.amber,
    body:"Valuables have no gameplay use except selling. They take up precious inventory slots. Sell them as soon as you reach a safe zone to free space and fund upgrades. Don't hoard them.",
    tip:"If it says 'Valuable' in the description, it goes straight to the vendor.",
  },
  {
    title:"Integrity Scanner",
    icon:"🔍",
    color:C.green,
    body:"The Integrity Scanner lets you check enemy status — is it actually dead or just downed? Use it to identify which corpses are a merge risk and which enemies are still alive. It can turn a scary 1v6 room into a manageable 1v1 by letting you pick off threats one at a time.",
    tip:"Scan a room before rushing in. Knowledge of what's alive vs dead saves more ammo than any upgrade.",
  },
];

// ─── WEAPONS ─────────────────────────────────────────────────────────────────
const WEAPONS = [
  {
    name:"Sword MK-1615", type:"Handgun", rating:5, color:C.amber,
    ammo:"Handgun Rounds (most common)", dmg:"140 base → 280 charged (fully upgraded)",
    best:"All-around — entire game",
    desc:"The starting pistol and the community's favorite. Charged shot doubles damage AND pierces through multiple lined-up enemies. Fully upgraded it one-taps standard Orphans on a headshot. Most ammo-efficient weapon in the game.",
    tip:"Most handgun ammo drops in the game. Never sell Handgun Rounds. This weapon carries you start to finish.",
    upgrade:"Charge Speed first, then Damage. Aim Stability is worth it early for the charged shots.",
  },
  {
    name:"Dagger", type:"Handgun (Auto)", rating:4, color:C.amber,
    ammo:"Handgun Rounds (most common)", dmg:"160 base (fully upgraded)",
    best:"Players who prefer faster fire over ammo efficiency",
    desc:"Auto handgun — fires faster but charging is less impactful than the Sword. Higher base damage per shot than Sword but worse ammo efficiency overall. Two-shots standard Orphans on headshots when fully upgraded.",
    tip:"Higher raw damage than Sword but you'll burn through ammo faster. Pick Sword for efficiency, Dagger for comfort.",
    upgrade:"Damage and Charge Speed. Skip if you prefer the Sword.",
  },
  {
    name:"Hammer PROV-2030", type:"Shotgun", rating:5, color:C.orange,
    ammo:"Shotgun Shells (moderately common)", dmg:"475 fully upgraded, 5-shell mag",
    best:"Crowd control, close encounters, large enemies",
    desc:"The best shotgun. Five shell magazine, charged shot gives wider pellet spread. Kills large Orphans in 3 charged shots. Significantly better than the Mace — better mag size and more versatile ammo consumption.",
    tip:"Save Hammer shells for large enemies and grouped fights. Don't waste them on basic Orphans.",
    upgrade:"Charge Speed and magazine size. Getting 5 shells in the mag is essential.",
  },
  {
    name:"Mace", type:"Shotgun (Double Barrel)", rating:2, color:C.dim,
    ammo:"Shotgun Shells", dmg:"725 fully upgraded, 2-shell mag",
    best:"Skip it — Hammer is strictly better",
    desc:"Double-barrel shotgun with higher single-shot damage but only 2 shells per mag. Always fires both shells at once. Takes 4 shells to kill a large Orphan vs Hammer's 3 charged shots — worse efficiency despite higher damage number. Limited versatility.",
    tip:"Sell Mace ammo if you're running the Hammer. The Hammer wins in every practical scenario.",
    upgrade:"Not recommended. Invest in Hammer instead.",
  },
  {
    name:"Lance (Carbine)", type:"Carbine / SMG", rating:3, color:C.blue,
    ammo:"SMG Rounds (less common)", dmg:"Moderate, burst fire",
    best:"Mid-range encounters, crowd control with fire support",
    desc:"Accurate burst carbine. Less effective in a game built around precision charged shots but pairs well with Father (survivor buff for standing still). Decent mid-range option if you have the survivor buff.",
    tip:"With Father's passive buff, this becomes a surprisingly strong stationary weapon. Without it, the Sword outclasses it.",
    upgrade:"Only invest if running Father as your survivor.",
  },
  {
    name:"Arbalest", type:"Railgun", rating:5, color:C.purple,
    ammo:"Energy Cells (very rare — save for bosses)", dmg:"Extremely high, penetrates multiple enemies",
    best:"Boss fights and NG+ — not practical early game",
    desc:"The BFG. Massive damage, can penetrate through multiple enemies. Each individual round takes up a full inventory slot until upgraded. Crafting ammo costs Cores — the same resource you need for upgrades. Best saved for the final boss or NG+.",
    tip:"Upgrade mag capacity ASAP — carrying individual shells in slots is brutal. Don't spend Cores on ammo crafting in a first run.",
    upgrade:"Mag capacity first. Then damage if you're in NG+.",
  },
];

// ─── UPGRADES ─────────────────────────────────────────────────────────────────
const UPGRADES = {
  cores: [
    { priority:1, name:"Inventory Slots", why:"You start with 6 slots. Everything takes one. This is not optional — the game is nearly unplayable without at least 3–4 more slots early on. Spend your first Cores here, every time.", tag:"ESSENTIAL" },
    { priority:2, name:"More Inventory Slots", why:"Seriously. Keep going. More slots means carrying more ammo types, a backup weapon, and heals simultaneously. Every extra slot is more survivability than a health upgrade.", tag:"ESSENTIAL" },
    { priority:3, name:"Weapon Charge Speed (primary weapon)", why:"Charged shots are your entire damage output. Faster charge = faster kills = less damage taken = less ammo wasted. Transformative upgrade. Apply to your main weapon immediately after inventory.", tag:"HIGH" },
    { priority:4, name:"Damage (primary weapon)", why:"Improves ammo efficiency significantly. One upgrade can change a 3-shot kill into a 2-shot kill — that's 33% ammo savings on every enemy for the rest of the game.", tag:"HIGH" },
    { priority:5, name:"Aim Stability / Sway Reduction", why:"There's significant weapon sway by default. Reducing it makes charged headshots much easier to land, especially at range with the pistol.", tag:"MEDIUM" },
    { priority:6, name:"Resources Limit (crafting capacity)", why:"Lets you carry more raw materials without spending inventory slots. Less urgent early but valuable once you're crafting ammo regularly.", tag:"MEDIUM" },
    { priority:7, name:"Health Upgrades", why:"Less impactful than it seems. Better inventory and charge speed keep you from taking hits in the first place. Get these after the above.", tag:"LOWER" },
    { priority:8, name:"Torch Upgrades (burn time / damage)", why:"Burn damage to burning enemies pairs with Edward's Essence. Useful but not a priority over combat fundamentals.", tag:"LOWER" },
  ],
  energy: [
    { name:"Craft ammo", rule:"Always craft — never buy directly. 3 Chemicals = 5 Handgun Bullets, cheaper than buying them outright." },
    { name:"Weapon upgrades", rule:"Upgrade your primary weapon before spending on a second. One great weapon beats two mediocre ones." },
    { name:"Refund & reinvest", rule:"You can refund weapon upgrades for a small fee and reinvest in a better gun. Don't be afraid to switch weapons when you find an upgrade." },
    { name:"Sell Valuables", rule:"Valuables exist only to be sold. Never hold onto them — sell immediately at every vendor visit." },
    { name:"Store Cores in stash", rule:"Unneeded Cores take up inventory slots. Store them in stash boxes and retrieve when you're ready to upgrade." },
  ]
};

// ─── ENEMIES ──────────────────────────────────────────────────────────────────
const ENEMIES = [
  {
    name:"Orphan (Standard)", tier:"Common", color:C.red,
    desc:"The most common enemy — infected humans mid-transformation. Aggressive melee attackers that pursue relentlessly.",
    weakness:"Head. One charged headshot kills standard variants when weapon is upgraded.",
    how:"Keep distance. Charge shot, aim head, release. Back away while recharging. Punch while they're staggered to save ammo.",
    merge:"YES — burns corpses immediately or they'll absorb nearby bodies.",
    tip:"After staggering one, punch it for bonus damage then back off before the counter.",
  },
  {
    name:"Orphan (Headless)", tier:"Common", color:C.red,
    desc:"Weaker variant — no head, so headshot bonus doesn't apply. But lower health overall.",
    weakness:"Body shots — any charged hit works. Piercing shots can kill 2–3 in a line.",
    how:"Line them up and use Sword's piercing charged shot to hit multiple at once. Fast to kill.",
    merge:"YES — burn them.",
    tip:"Great targets for testing the Sword's piercing capability to conserve ammo.",
  },
  {
    name:"Large Orphan", tier:"Elite", color:C.orange,
    desc:"Hulking heavily mutated Orphan. Takes significantly more damage, hits hard, can charge.",
    weakness:"Head — takes multiple charged shots even when upgraded.",
    how:"Hammer shotgun (3 charged shots fully upgraded). Alternatively lure near explosive canisters. Use fire first, then unload — burning enemies take bonus damage with Edward's Essence.",
    merge:"YES — burns immediately after kill.",
    tip:"Save Hammer shells for these. Don't waste pistol ammo on Large Orphans when you have the shotgun.",
  },
  {
    name:"Merged Orphan", tier:"Elite", color:"#8B0000",
    desc:"What happens when an Orphan absorbs a corpse you didn't burn. Much larger, more health, more dangerous attacks. Avoidable entirely by burning corpses.",
    weakness:"Exposed orange blisters are the weak points. Set on fire first to reveal them.",
    how:"Explosive canisters are most efficient. Lure it near one and blow it up to ignite — then target the exposed blisters while burning. Edward's Essence (burn damage bonus) helps massively.",
    merge:"Cannot merge further but still drops a burnable corpse.",
    tip:"This enemy should never exist. Burn every corpse before moving on.",
  },
  {
    name:"Acid Spitter (Polyp)", tier:"Common", color:C.green,
    desc:"Wall/floor-mounted creature that sprays corrosive acid. Tempting to shoot from range but you don't have the ammo for that.",
    weakness:"Proximity detonation — walk close and back away before it explodes.",
    how:"Walk slowly toward it, wait for the audio cue (pitch change in its sound), then back away. It detonates harmlessly. Free kill, zero ammo spent.",
    merge:"N/A",
    tip:"Learn the audio cue — it's consistent. Once you hear it you can time the escape perfectly every run.",
  },
  {
    name:"Wall Crawler", tier:"Common", color:C.orange,
    desc:"Clings to walls and ceilings. Drops or lunges at you. Common indoors.",
    weakness:"Body — fragile, dies fast.",
    how:"Charged shot or stomp if downed. Watch ceilings in corridors.",
    merge:"YES — burn after killing.",
    tip:"Scan ceilings when entering tight indoor spaces. They ambush from above.",
  },
  {
    name:"Spitter (Multi-head)", tier:"Elite", color:C.orange,
    desc:"Multi-headed ranged enemy that fires acid projectiles. Requires more shots to down.",
    weakness:"Head(s). Carbine with Father's passive or charged pistol shots work well.",
    how:"Maintain distance to avoid acid splash. Prioritize — these are dangerous in groups. Father buff on Carbine shreds these efficiently.",
    merge:"YES — burn after.",
    tip:"If you're running Father as survivor, the Carbine turns these from a problem into a routine kill.",
  },
  {
    name:"Boss: Goo Guardian (First Boss)", tier:"Boss", color:C.purple,
    desc:"Covered in protective black goo making it normally immune to damage. Found in an arena filled with explosive canisters.",
    weakness:"Orange blisters on head, chest, and legs — only exposed when on fire.",
    how:"Lure the boss near an explosive canister and detonate it to set it on fire. Protective layer disappears while burning. Unload into the orange blisters. Edward's Essence (burn damage bonus) multiplies damage during this window. It has a charge attack and ground shockwave — sidestep both.",
    merge:"N/A — boss",
    tip:"The arena is a plus-sign shape. Use the layout to stay mobile and avoid getting cornered. Plenty of explosive canisters to keep it burning.",
  },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
const TABS = ["SURVIVAL","WEAPONS","UPGRADES","ENEMIES"];
const TAB_COLORS = { SURVIVAL:C.amber, WEAPONS:C.red, UPGRADES:C.green, ENEMIES:C.orange };

function Stars({ n, max=5, color }) {
  return (
    <span>
      {Array.from({length:max}).map((_,i)=>(
        <span key={i} style={{color:i<n?color:C.dimmer,fontSize:14}}>★</span>
      ))}
    </span>
  );
}

export default function CronosGuide() {
  const [tab, setTab] = useState("SURVIVAL");
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");

  const filterText = (str) => str.toLowerCase().includes(search.toLowerCase());

  return (
    <div style={{...F, background:C.bg, minHeight:"100vh", color:C.text}}>
      {/* Atmospheric overlay */}
      <div style={{position:"fixed",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(200,50,20,0.006) 3px,rgba(200,50,20,0.006) 6px)",pointerEvents:"none",zIndex:0}}/>

      <div style={{position:"relative",zIndex:1,maxWidth:960,margin:"0 auto",padding:"20px 16px"}}>

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:22}}>
          <div style={{display:"inline-block",border:`1px solid ${C.red}44`,borderTop:`2px solid ${C.red}`,padding:"3px 18px",marginBottom:6}}>
            <span style={{fontSize:10,letterSpacing:5,color:`${C.red}88`}}>BLOOBER TEAM · 2025 · SURVIVAL HORROR</span>
          </div>
          <h1 style={{fontSize:21,fontWeight:900,letterSpacing:3,margin:"5px 0 3px",color:C.textBright,textTransform:"uppercase",textShadow:`0 0 24px ${C.red}33`}}>
            CRONOS: THE NEW DAWN
          </h1>
          <p style={{fontSize:10,color:C.textDim,letterSpacing:2,margin:0}}>
            SURVIVAL GUIDE · WEAPONS · UPGRADES · ENEMIES
          </p>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:3,marginBottom:16,flexWrap:"wrap"}}>
          {TABS.map(t=>{
            const col=TAB_COLORS[t];
            const active=tab===t;
            return (
              <button key={t} onClick={()=>{setTab(t);setExpanded(null);setSearch("");}} style={{
                flex:"1 1 auto",padding:"10px 6px",
                background:active?`${col}12`:C.panel,
                border:active?`1px solid ${col}`:`1px solid ${C.border}`,
                borderTop:active?`2px solid ${col}`:"2px solid transparent",
                color:active?col:C.dim,
                cursor:"pointer",fontSize:11,letterSpacing:3,...F,fontWeight:active?700:400,
                whiteSpace:"nowrap",
              }}>{t}</button>
            );
          })}
        </div>

        {/* Search */}
        <div style={{marginBottom:14,position:"relative"}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:`${C.red}44`,fontSize:13}}>⌕</span>
          <input value={search} onChange={e=>{setSearch(e.target.value);setExpanded(null);}}
            placeholder={`SEARCH ${tab}...`}
            style={{width:"100%",boxSizing:"border-box",background:"#0e0908",border:`1px solid ${C.border}`,borderLeft:`2px solid ${C.red}44`,color:"#d4b4a4",padding:"9px 10px 9px 28px",fontSize:11,letterSpacing:1,outline:"none",...F}}/>
        </div>

        {/* ── SURVIVAL ── */}
        {tab==="SURVIVAL" && (
          <>
            <div style={{fontSize:11,color:C.textDim,letterSpacing:2,marginBottom:14}}>
              CORE RULES · LEARN THESE BEFORE ANYTHING ELSE
            </div>
            {SURVIVAL.filter(s=>!search||filterText(s.title)||filterText(s.body)||filterText(s.tip)).map((s,i)=>{
              const open=expanded===`s-${i}`;
              return (
                <div key={i} style={{border:`1px solid ${open?s.color+"55":C.border}`,marginBottom:8,background:C.panel}}>
                  <div onClick={()=>setExpanded(open?null:`s-${i}`)}
                    style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,
                      background:open?`${s.color}08`:"transparent",borderBottom:open?`1px solid ${C.border}`:"none"}}
                    onMouseEnter={e=>e.currentTarget.style.background=`${s.color}0a`}
                    onMouseLeave={e=>e.currentTarget.style.background=open?`${s.color}08`:"transparent"}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:18}}>{s.icon}</span>
                      <span style={{fontSize:14,color:C.textBright,fontWeight:700}}>{s.title}</span>
                    </div>
                    <span style={{color:s.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
                  </div>
                  {open && (
                    <div style={{padding:"12px 14px"}}>
                      <div style={{fontSize:13,color:C.text,lineHeight:1.8,marginBottom:10,whiteSpace:"pre-line"}}>{s.body}</div>
                      <div style={{background:`${s.color}08`,padding:"8px 12px",borderLeft:`2px solid ${s.color}66`,fontSize:12,color:s.color,lineHeight:1.6}}>
                        ⚡ {s.tip}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ── WEAPONS ── */}
        {tab==="WEAPONS" && (
          <>
            <div style={{fontSize:11,color:C.textDim,letterSpacing:2,marginBottom:14}}>
              ALL WEAPONS · ALWAYS CHARGE BEFORE FIRING · RAPID FIRE IS FOR BARRELS ONLY
            </div>
            {/* Mobile cards */}
            <style>{`
              @media (max-width:640px) { .w-table{display:none!important} .w-cards{display:flex!important} }
              @media (min-width:641px) { .w-table{display:block!important} .w-cards{display:none!important} }
            `}</style>

            {/* Desktop table */}
            <div className="w-table">
              <div style={{border:`1px solid ${C.border}`}}>
                <div style={{display:"grid",gridTemplateColumns:"150px 90px 100px 1fr",background:"#100908",borderBottom:`1px solid ${C.border}`}}>
                  {["WEAPON","TYPE","RATING","BEST USE / NOTES"].map(h=>(
                    <div key={h} style={{padding:"7px 12px",fontSize:11,letterSpacing:2,color:C.dim,borderRight:`1px solid ${C.border}`}}>{h}</div>
                  ))}
                </div>
                {WEAPONS.filter(w=>!search||filterText(w.name)||filterText(w.best)||filterText(w.desc)).map((w,i)=>{
                  const open=expanded===`w-${i}`;
                  return (
                    <div key={i}>
                      <div onClick={()=>setExpanded(open?null:`w-${i}`)}
                        style={{display:"grid",gridTemplateColumns:"150px 90px 100px 1fr",borderBottom:`1px solid ${C.border}`,background:open?`${w.color}08`:i%2===0?"#0d0807":"#100a09",cursor:"pointer"}}
                        onMouseEnter={e=>e.currentTarget.style.background=`${w.color}0a`}
                        onMouseLeave={e=>e.currentTarget.style.background=open?`${w.color}08`:i%2===0?"#0d0807":"#100a09"}>
                        <div style={{padding:"10px 12px",fontSize:13,color:C.textBright,fontWeight:700,borderRight:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:6}}>
                          <span style={{width:3,height:3,background:w.color,display:"inline-block",flexShrink:0}}/>
                          {w.name}
                        </div>
                        <div style={{padding:"10px 12px",fontSize:12,color:C.textDim,borderRight:`1px solid ${C.border}`,display:"flex",alignItems:"center"}}>{w.type}</div>
                        <div style={{padding:"10px 12px",borderRight:`1px solid ${C.border}`,display:"flex",alignItems:"center"}}><Stars n={w.rating} color={w.color}/></div>
                        <div style={{padding:"10px 12px",fontSize:12,color:C.textDim,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                          <span style={{lineHeight:1.5}}>{w.best}</span>
                          <span style={{color:w.color,flexShrink:0}}>{open?"▲":"▼"}</span>
                        </div>
                      </div>
                      {open && (
                        <div style={{padding:"14px 16px",background:`${w.color}06`,borderBottom:`1px solid ${C.border}`}}>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                            <div style={{background:`${w.color}0a`,padding:"8px 10px",borderLeft:`2px solid ${w.color}44`}}>
                              <div style={{fontSize:10,letterSpacing:2,color:w.color,marginBottom:4}}>AMMO TYPE</div>
                              <div style={{fontSize:12,color:C.text}}>{w.ammo}</div>
                            </div>
                            <div style={{background:`${w.color}0a`,padding:"8px 10px",borderLeft:`2px solid ${w.color}44`}}>
                              <div style={{fontSize:10,letterSpacing:2,color:w.color,marginBottom:4}}>DAMAGE</div>
                              <div style={{fontSize:12,color:C.text}}>{w.dmg}</div>
                            </div>
                          </div>
                          <div style={{fontSize:13,color:C.text,lineHeight:1.7,marginBottom:10}}>{w.desc}</div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                            <div style={{background:`${C.amber}08`,padding:"8px 10px",borderLeft:`2px solid ${C.amber}44`}}>
                              <div style={{fontSize:10,letterSpacing:2,color:C.amber,marginBottom:4}}>⚡ TIP</div>
                              <div style={{fontSize:12,color:C.textDim,lineHeight:1.6}}>{w.tip}</div>
                            </div>
                            <div style={{background:`${C.green}08`,padding:"8px 10px",borderLeft:`2px solid ${C.green}44`}}>
                              <div style={{fontSize:10,letterSpacing:2,color:C.green,marginBottom:4}}>↑ UPGRADE PATH</div>
                              <div style={{fontSize:12,color:C.textDim,lineHeight:1.6}}>{w.upgrade}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile cards */}
            <div className="w-cards" style={{flexDirection:"column",gap:8,display:"none"}}>
              {WEAPONS.filter(w=>!search||filterText(w.name)||filterText(w.best)||filterText(w.desc)).map((w,i)=>{
                const open=expanded===`wm-${i}`;
                return (
                  <div key={i} style={{background:C.panel,border:`1px solid ${open?w.color+"55":C.border}`,borderLeft:`3px solid ${w.color}`}}>
                    <div onClick={()=>setExpanded(open?null:`wm-${i}`)}
                      style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}
                      onMouseEnter={e=>e.currentTarget.style.background=`${w.color}0a`}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <div>
                        <div style={{fontSize:14,color:C.textBright,fontWeight:700,marginBottom:4}}>{w.name}</div>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{fontSize:11,color:C.textDim}}>{w.type}</span>
                          <Stars n={w.rating} color={w.color}/>
                        </div>
                      </div>
                      <span style={{color:w.color,fontSize:14}}>{open?"▲":"▼"}</span>
                    </div>
                    {open && (
                      <div style={{padding:"0 14px 14px"}}>
                        <div style={{fontSize:11,color:w.color,marginBottom:4,letterSpacing:1}}>AMMO: <span style={{color:C.text}}>{w.ammo}</span></div>
                        <div style={{fontSize:11,color:w.color,marginBottom:8,letterSpacing:1}}>DMG: <span style={{color:C.text}}>{w.dmg}</span></div>
                        <div style={{fontSize:13,color:C.text,lineHeight:1.7,marginBottom:8}}>{w.desc}</div>
                        <div style={{background:`${C.amber}08`,padding:"8px 10px",borderLeft:`2px solid ${C.amber}44`,marginBottom:6}}>
                          <div style={{fontSize:10,letterSpacing:2,color:C.amber,marginBottom:3}}>⚡ TIP</div>
                          <div style={{fontSize:12,color:C.textDim,lineHeight:1.6}}>{w.tip}</div>
                        </div>
                        <div style={{background:`${C.green}08`,padding:"8px 10px",borderLeft:`2px solid ${C.green}44`}}>
                          <div style={{fontSize:10,letterSpacing:2,color:C.green,marginBottom:3}}>↑ UPGRADE PATH</div>
                          <div style={{fontSize:12,color:C.textDim,lineHeight:1.6}}>{w.upgrade}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── UPGRADES ── */}
        {tab==="UPGRADES" && (
          <>
            <div style={{fontSize:11,color:C.textDim,letterSpacing:2,marginBottom:16}}>
              CORES = RARE · INVENTORY FIRST · CHARGE SPEED SECOND · EVERYTHING ELSE AFTER
            </div>

            {/* Core upgrades */}
            <div style={{marginBottom:24}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{width:3,height:15,background:C.purple}}/>
                <span style={{fontSize:12,letterSpacing:4,color:C.purple,fontWeight:700}}>CORE UPGRADES</span>
                <div style={{flex:1,height:1,background:`${C.purple}22`}}/>
                <span style={{fontSize:10,color:C.textDim}}>Found exploring + cat rewards</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {UPGRADES.cores.filter(u=>!search||filterText(u.name)||filterText(u.why)).map((u,i)=>{
                  const tagColor = u.tag==="ESSENTIAL"?C.red:u.tag==="HIGH"?C.orange:u.tag==="MEDIUM"?C.amber:C.dim;
                  return (
                    <div key={i} style={{background:C.panel,border:`1px solid ${C.border}`,borderLeft:`3px solid ${tagColor}`,padding:"12px 14px"}}>
                      {/* Top row: number, name, priority badge */}
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{fontSize:15,color:C.purple,fontWeight:900,flexShrink:0}}>{u.priority}.</span>
                          <span style={{fontSize:13,color:C.textBright,fontWeight:700}}>{u.name}</span>
                        </div>
                        <span style={{fontSize:10,letterSpacing:1,color:tagColor,background:`${tagColor}18`,border:`1px solid ${tagColor}55`,padding:"3px 8px",whiteSpace:"nowrap",flexShrink:0}}>{u.tag}</span>
                      </div>
                      {/* Why */}
                      <div style={{fontSize:12,color:C.textDim,lineHeight:1.7}}>{u.why}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Energy rules */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{width:3,height:15,background:C.amber}}/>
                <span style={{fontSize:12,letterSpacing:4,color:C.amber,fontWeight:700}}>ENERGY RULES</span>
                <div style={{flex:1,height:1,background:`${C.amber}22`}}/>
                <span style={{fontSize:10,color:C.textDim}}>The currency — earn from kills + selling Valuables</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {UPGRADES.energy.filter(e=>!search||filterText(e.name)||filterText(e.rule)).map((e,i)=>(
                  <div key={i} style={{background:C.panel,border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.amber}`,padding:"12px 14px",display:"flex",gap:12,alignItems:"flex-start"}}>
                    <span style={{fontSize:14,flexShrink:0,marginTop:1}}>💰</span>
                    <div>
                      <div style={{fontSize:13,color:C.textBright,fontWeight:700,marginBottom:4}}>{e.name}</div>
                      <div style={{fontSize:12,color:C.textDim,lineHeight:1.6}}>{e.rule}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── ENEMIES ── */}
        {tab==="ENEMIES" && (
          <>
            <div style={{fontSize:11,color:C.textDim,letterSpacing:2,marginBottom:14}}>
              BURN EVERY CORPSE · HEADSHOTS ALWAYS · MERGES ARE PREVENTABLE
            </div>
            {ENEMIES.filter(e=>!search||filterText(e.name)||filterText(e.how)||filterText(e.weakness)).map((enemy,i)=>{
              const key=`e-${i}`;
              const open=expanded===key;
              const col=enemy.color;
              return (
                <div key={i} style={{border:`1px solid ${open?col+"55":C.border}`,marginBottom:7,background:C.panel}}>
                  <div onClick={()=>setExpanded(open?null:key)}
                    style={{padding:"11px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,
                      background:open?`${col}08`:"transparent",borderBottom:open?`1px solid ${C.border}`:"none"}}
                    onMouseEnter={e=>e.currentTarget.style.background=`${col}0a`}
                    onMouseLeave={e=>e.currentTarget.style.background=open?`${col}08`:"transparent"}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                        <span style={{fontSize:14,color:col,fontWeight:900}}>{enemy.name.toUpperCase()}</span>
                        <span style={{fontSize:10,letterSpacing:2,color:col,background:`${col}15`,border:`1px solid ${col}44`,padding:"2px 7px"}}>{enemy.tier}</span>
                        {enemy.merge==="YES" && (
                          <span style={{fontSize:10,letterSpacing:1,color:C.red,background:`${C.red}15`,border:`1px solid ${C.red}44`,padding:"2px 7px"}}>⚠ MERGES</span>
                        )}
                      </div>
                      <div style={{fontSize:12,color:C.textDim}}>{enemy.desc}</div>
                    </div>
                    <span style={{color:col,fontSize:14,flexShrink:0,marginTop:2}}>{open?"▲":"▼"}</span>
                  </div>
                  {open && (
                    <div style={{padding:"12px 14px"}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                        <div style={{background:`${C.red}08`,padding:"8px 10px",borderLeft:`2px solid ${C.red}44`}}>
                          <div style={{fontSize:10,letterSpacing:2,color:C.red,marginBottom:4}}>🎯 WEAKNESS</div>
                          <div style={{fontSize:12,color:C.text,lineHeight:1.6}}>{enemy.weakness}</div>
                        </div>
                        <div style={{background:`${C.red}08`,padding:"8px 10px",borderLeft:`2px solid ${C.orange}44`}}>
                          <div style={{fontSize:10,letterSpacing:2,color:C.orange,marginBottom:4}}>🔥 MERGE RISK</div>
                          <div style={{fontSize:12,color:enemy.merge==="YES"?C.red:C.dim,lineHeight:1.6,fontWeight:enemy.merge==="YES"?700:400}}>{enemy.merge}</div>
                        </div>
                      </div>
                      <div style={{marginBottom:10}}>
                        <div style={{fontSize:10,letterSpacing:2,color:C.green,marginBottom:4}}>⚔ HOW TO KILL</div>
                        <div style={{fontSize:13,color:C.text,lineHeight:1.7,background:`${C.green}06`,padding:"8px 10px",borderLeft:`2px solid ${C.green}33`}}>{enemy.how}</div>
                      </div>
                      <div style={{background:`${C.amber}08`,padding:"8px 10px",borderLeft:`2px solid ${C.amber}44`}}>
                        <div style={{fontSize:10,letterSpacing:2,color:C.amber,marginBottom:4}}>⚡ PRO TIP</div>
                        <div style={{fontSize:12,color:C.textDim,lineHeight:1.6}}>{enemy.tip}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        <div style={{marginTop:22,borderTop:`1px solid ${C.border}`,paddingTop:10,fontSize:10,color:C.dimmer,letterSpacing:2,textAlign:"center"}}>
          CRONOS: THE NEW DAWN · BLOOBER TEAM · SEP 2025 · BURN THE CORPSES
        </div>
      </div>
    </div>
  );
}
