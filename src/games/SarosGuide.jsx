import { useState } from "react";
const C={bg:"#07060f",panel:"#0e0c1a",border:"#1e1a30",purple:"#7c3aed",violet:"#a78bfa",cyan:"#00e5ff",green:"#6ee7b7",gold:"#ffd700",orange:"#f59e0b",red:"#f87171",pink:"#e879f9",dim:"#4a3a6a",dimmer:"#1e1a30",text:"#d4ccf0",textDim:"#7a6a9a",textBright:"#f0ecff"};
const F={fontFamily:"'Courier New','Lucida Console',monospace"};
const TIPS=[
  {icon:"⚡",title:"Aggression Wins — Move Into Danger",color:C.violet,body:"Saros rewards forward momentum. The Soltari Shield absorbs lethal projectiles and converts them into Power Weapon charges. The more you move into bullet patterns, absorb, and convert — the more damage you output. Hiding drains your options.",tip:"Hold R1 to absorb. The absorbed energy becomes your Power Weapon. Use it constantly — it recharges fast."},
  {icon:"🌑",title:"The Eclipse — Worth It Almost Every Time",color:C.pink,body:"Before activating the Eclipse, all upgrades are purely positive — grab every single one. After the Eclipse, upgrades come with downsides. Choose based on the DOWNSIDE you can tolerate, not the upside you want. You'll always run out of upgrade slots.",tip:"Pre-Eclipse: take everything. Post-Eclipse: pick the downside you can live with, not the upgrade you want."},
  {icon:"💜",title:"Halcyon — Always Choose It Over Anything Else",color:C.pink,body:"Halcyon is the rare purple currency for the most powerful permanent Armor Matrix upgrades — Second Chance (extra life), better Aether healing, less Lucenite lost on death. It's finite per biome. When a container offers Halcyon vs anything else, always take the Halcyon.",tip:"There is a finite amount of Halcyon per biome. Check the World Dial to track how much remains before moving on."},
  {icon:"🟡",title:"Lucenite — Collect Everything, Always",color:C.gold,body:"Lucenite is the orange currency dropped by enemies and found everywhere. During a run it raises your Proficiency, which increases the power level of weapons you find. Between runs it buys permanent Armor Matrix upgrades. Pick up Aether at full health — it converts to Lucenite.",tip:"Lucenite hides in unexpected spots — check high and low. Also unlock Armor Matrix nodes that make enemies drop more."},
  {icon:"🛡️",title:"Corruption — Cleanse Before Healing",color:C.red,body:"Corrupted projectiles reduce your BASE health. Even if you pick up healing, you can't recover above your reduced max until you cleanse. Cleanse by firing Power Weapon shots — they don't need to hit enemies. Fire a few Power shots, THEN pick up the healing item.",tip:"Power Weapon shots cleanse corruption without hitting anything. Fire into the air to cleanse, then heal."},
  {icon:"🗝️",title:"Keys — Save for Later in the Run",color:C.orange,body:"Keys unlock gates to treasure troves or chests scaled to your current Lucenite level. Using a key early in a run gives a weak reward. Save them until you've accumulated significant Lucenite — later in a run the scaling makes them far more valuable.",tip:"Always save keys for after you've built up Lucenite. A key at the end of a run is worth 3× what it gives at the start."},
  {icon:"🎲",title:"Acolyte's Wager — Use Your Rerolls Every Run",color:C.violet,body:"You start each run with a few Acolyte's Wager rerolls that let you delete artifacts or reroll random upgrade drops. These refresh every run — don't save them. Best use: right before a boss fight, reroll until you get your preferred weapon.",tip:"Rerolls refresh every run. Use them all right before the final boss to optimize your loadout."},
  {icon:"👊",title:"Melee — Don't Forget You Have a Punch",color:C.green,body:"Arjun has a melee attack from the start — unlike Returnal where you had to find the sword. It's strong and useful when enemies close the gap. Melee breaks enemy shields.",tip:"Melee breaks shields. Instead of wasting ammo chipping through a shield, punch through it first then shoot."},
  {icon:"🔵",title:"Projectile Colors — Know What to Dodge vs Absorb",color:C.cyan,body:"Three projectile colors. Blue = absorb with your Soltari Shield to charge Power Weapons — move into them. Red/orange = corrupting — avoid completely. White = standard — dodge or absorb situationally.",tip:"Blue = absorb for Power. Red = avoid completely. White = dodge or absorb situationally."},
  {icon:"🗺️",title:"Blue Flags vs White Flags",color:C.violet,body:"Blue flags on your minimap = critical path progress. White flags = alternate side paths — usually containing upgrades, healing, or loot with minimal danger. Take white flag detours almost every time.",tip:"White flag paths almost always have something useful. The risk is low and the reward is consistent."},
  {icon:"🏃",title:"Smart Guns for Beginners",color:C.green,body:"Smart Guns have a homing system that does a lot of the aiming for you. While you focus on dodging bullet patterns, Smart Guns track targets automatically. Perfect for your first runs while learning the movement system.",tip:"If you're overwhelmed by bullet patterns, switch to a Smart Gun and focus entirely on movement. Survivability first."},
];
const UPGRADES=[
  {priority:1,name:"Second Chance",currency:"Halcyon",tag:"ESSENTIAL",why:"Gives you an extra life per run. Single biggest survivability upgrade in the game."},
  {priority:2,name:"Aether Improvement",currency:"Halcyon",tag:"ESSENTIAL",why:"Makes healing items more effective. More healing per pickup means longer runs and more consistency."},
  {priority:3,name:"Reduced Lucenite Loss on Death",currency:"Halcyon",tag:"HIGH",why:"You keep more resources when you die. Critical for maintaining momentum across long sessions."},
  {priority:4,name:"Proficiency Increase (permanent)",currency:"Lucenite",tag:"HIGH",why:"Raises the base power level of weapons you find in every run. Better weapons = easier time across all biomes."},
  {priority:5,name:"Drive Increase",currency:"Lucenite",tag:"HIGH",why:"Drive determines how fast Lucenite fills your Proficiency bar during a run. Higher Drive = faster in-run scaling."},
  {priority:6,name:"Attribute Enhancer Drops",currency:"Lucenite",tag:"MEDIUM",why:"Enemies and containers start dropping stat boosts during runs. Compounds your power quickly."},
  {priority:7,name:"Lucenite Pickup Duration",currency:"Lucenite",tag:"MEDIUM",why:"Dropped Lucenite stays on the ground longer. Less lost in chaotic fights."},
  {priority:8,name:"Resilience Increase",currency:"Lucenite",tag:"MEDIUM",why:"Increases your armor integrity cap (max health). More survivability in the late biomes."},
  {priority:9,name:"Command Increase",currency:"Lucenite",tag:"LOWER",why:"Improves artifact effectiveness. More useful after core survival upgrades are locked in."},
];
const WEAPONS=[
  {name:"Smart Gun (Soltari)",type:"Homing Rifle",tier:"B",color:C.green,desc:"Auto-targeting weapon that tracks enemies. Not the highest damage but removes the aiming burden. Perfect for beginners.",best:"Beginners / overwhelming rooms",tip:"Focus entirely on dodging while it aims. Let it do the work."},
  {name:"Phosphorous Shotgun (Soltari)",type:"Shotgun",tier:"S",color:C.violet,desc:"High damage close-range weapon. Melts enemies fast and generates Power Weapon charge quickly from absorbed pellets. Outstanding against large enemies.",best:"Close-range, boss chunks, large enemies",tip:"Stay aggressive — get close, absorb, shoot. The loop is extremely satisfying and effective."},
  {name:"Carcosan Power Weapons",type:"Eclipse Weapon",tier:"S",color:C.pink,desc:"Not looted — charged by absorbing blue projectiles with your Soltari Shield. Transforms Arjun's arm into a devastating weapon. Recharges faster than you think. Use constantly.",best:"All situations — use as often as possible",tip:"Half-pull L2 for alt fire. Full pull L2 to activate Power Weapon. Build this muscle memory immediately."},
  {name:"Pulse Rifle (Soltari)",type:"Mid-range Burst",tier:"A",color:C.cyan,desc:"Accurate burst fire at medium range. Good balance of ammo efficiency and damage. Pairs well with aggressive shield absorption loops.",best:"Mid-range fights, biome clearing",tip:"Burst into shield absorb cycles. Fire burst → absorb → Power → repeat."},
  {name:"Carcosan Alien Weapons",type:"Alien Tech",tier:"A",color:C.orange,desc:"Found alongside Soltari human weapons. Stranger behavior — some arc, some bounce. Higher ceiling but require more adjustment.",best:"Experienced players who understand the shield loop",tip:"The Acolyte's Wager reroll lets you swap an alien weapon for your preferred type before boss fights."},
];
const BIOMES=[
  {name:"Starting Biomes (1–2)",difficulty:"Entry",color:C.green,notes:"Learn the Eclipse mechanic. Unlock permanent abilities: Fast Travel, Grapple Hook. Focus on Halcyon collection and Armor Matrix fundamentals. Boss: Consort (tutorial fight)."},
  {name:"Mid Biomes (3–5)",difficulty:"Moderate",color:C.orange,notes:"Corruption becomes a serious threat. Eclipse modifiers stack harder. Save keys for later. Overlord bosses unlock after each biome."},
  {name:"Late Biomes (6–8)",difficulty:"Hard",color:C.red,notes:"Post-Prophet boss: every Proficiency level gives +1 to Resilience, Command, and Drive — massive power spike. Yellow Shore biome: enemies can drop Halcyon. Farm here."},
  {name:"Nightmare Gates",difficulty:"Optional Endgame",color:C.pink,notes:"Unlock after defeating all 8 Overlords. Hard challenge rooms that reward Halcyon, Integrity Augments, and endgame resources. Run after Armor Matrix is mostly complete."},
];
const ABILITIES=[
  {name:"Grapple Hook",how:"Campaign unlock",use:"Traversal and exploration — reaches previously inaccessible areas."},
  {name:"Fast Travel / Jump Network",how:"Early campaign unlock",use:"Teleport directly to unlocked biomes at the start of a run."},
  {name:"Overdrive",how:"Campaign milestone",use:"Combat ability — enhances movement and weapon capabilities temporarily."},
  {name:"Parry",how:"Campaign milestone",use:"Deflect specific attacks — reduces damage and can stagger enemies."},
  {name:"Eclipse Thread",how:"Campaign milestone",use:"Traverse Eclipse-locked barriers."},
  {name:"Blazing Strike",how:"Late campaign unlock",use:"Powerful offensive ability. All 6 abilities are mandatory progression — cannot be missed."},
];
const TABS=["TIPS","WEAPONS","UPGRADES","BIOMES"];
const TAB_COLORS={TIPS:C.violet,WEAPONS:C.pink,UPGRADES:C.purple,BIOMES:C.orange};
export default function SarosGuide(){
  const[tab,setTab]=useState("TIPS");
  const[expanded,setExpanded]=useState(null);
  const[search,setSearch]=useState("");
  const f=(s)=>s.toLowerCase().includes(search.toLowerCase());
  return(
    <div style={{...F,background:C.bg,minHeight:"100vh",color:C.text}}>
      <div style={{position:"fixed",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(124,58,237,0.007) 3px,rgba(124,58,237,0.007) 6px)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"relative",zIndex:1,maxWidth:960,margin:"0 auto",padding:"20px 16px"}}>
        <div style={{textAlign:"center",marginBottom:22}}>
          <div style={{display:"inline-block",border:`1px solid ${C.purple}44`,borderTop:`2px solid ${C.purple}`,padding:"3px 18px",marginBottom:6}}>
            <span style={{fontSize:10,letterSpacing:5,color:`${C.purple}88`}}>HOUSEMARQUE · PS5 · APR 30 2026</span>
          </div>
          <h1 style={{fontSize:22,fontWeight:900,letterSpacing:3,margin:"5px 0 3px",color:C.textBright,textTransform:"uppercase"}}>SAROS</h1>
          <p style={{fontSize:11,color:C.textDim,letterSpacing:2,margin:0}}>FIELD GUIDE · BULLET-HELL ROGUELITE · PLANET CARCOSA</p>
        </div>
        <div style={{display:"flex",gap:3,marginBottom:16,flexWrap:"wrap"}}>
          {TABS.map(t=>{const col=TAB_COLORS[t];const active=tab===t;return<button key={t} onClick={()=>{setTab(t);setExpanded(null);setSearch("");}} style={{flex:"1 1 auto",padding:"10px 6px",background:active?`${col}12`:C.panel,border:active?`1px solid ${col}`:`1px solid ${C.border}`,borderTop:active?`2px solid ${col}`:"2px solid transparent",color:active?col:C.dim,cursor:"pointer",fontSize:12,letterSpacing:3,...F,fontWeight:active?700:400,whiteSpace:"nowrap"}}>{t}</button>;})}
        </div>
        <div style={{marginBottom:14,position:"relative"}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:`${C.purple}44`,fontSize:13}}>⌕</span>
          <input value={search} onChange={e=>{setSearch(e.target.value);setExpanded(null);}} placeholder={`SEARCH ${tab}...`} style={{width:"100%",boxSizing:"border-box",background:"#0c0a18",border:`1px solid ${C.border}`,borderLeft:`2px solid ${C.purple}44`,color:"#c4b8e8",padding:"9px 10px 9px 28px",fontSize:11,letterSpacing:1,outline:"none",...F}}/>
        </div>
        {tab==="TIPS"&&(<>
          <div style={{fontSize:12,color:C.textDim,letterSpacing:2,marginBottom:14}}>CORE RULES · READ THESE BEFORE YOUR FIRST RUN</div>
          {TIPS.filter(s=>!search||f(s.title)||f(s.body)).map((s,i)=>{const open=expanded===`t-${i}`;return(
            <div key={i} style={{border:`1px solid ${open?s.color+"55":C.border}`,marginBottom:8,background:C.panel}}>
              <div onClick={()=>setExpanded(open?null:`t-${i}`)} style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,background:open?`${s.color}08`:"transparent",borderBottom:open?`1px solid ${C.border}`:"none"}} onMouseEnter={e=>e.currentTarget.style.background=`${s.color}0a`} onMouseLeave={e=>e.currentTarget.style.background=open?`${s.color}08`:"transparent"}>
                <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>{s.icon}</span><span style={{fontSize:14,color:C.textBright,fontWeight:700}}>{s.title}</span></div>
                <span style={{color:s.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
              </div>
              {open&&(<div style={{padding:"12px 14px"}}><div style={{fontSize:13,color:C.text,lineHeight:1.8,marginBottom:10}}>{s.body}</div><div style={{background:`${s.color}08`,padding:"8px 12px",borderLeft:`2px solid ${s.color}66`,fontSize:12,color:s.color,lineHeight:1.6}}>⚡ {s.tip}</div></div>)}
            </div>
          );})}
        </>)}
        {tab==="WEAPONS"&&(<>
          <div style={{fontSize:12,color:C.textDim,letterSpacing:2,marginBottom:14}}>SOLTARI HUMAN WEAPONS + CARCOSAN ALIEN WEAPONS · POWER WEAPON IS ALWAYS FREE</div>
          {WEAPONS.filter(w=>!search||f(w.name)||f(w.desc)||f(w.best)).map((w,i)=>{const open=expanded===`w-${i}`;return(
            <div key={i} style={{border:`1px solid ${open?w.color+"55":C.border}`,marginBottom:8,background:C.panel}}>
              <div onClick={()=>setExpanded(open?null:`w-${i}`)} style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,background:open?`${w.color}08`:"transparent",borderBottom:open?`1px solid ${C.border}`:"none"}} onMouseEnter={e=>e.currentTarget.style.background=`${w.color}0a`} onMouseLeave={e=>e.currentTarget.style.background=open?`${w.color}08`:"transparent"}>
                <div style={{display:"flex",alignItems:"center",gap:10,flex:1,flexWrap:"wrap"}}>
                  <span style={{fontSize:14,color:C.textBright,fontWeight:700}}>{w.name}</span>
                  <span style={{fontSize:10,color:w.color,background:`${w.color}15`,border:`1px solid ${w.color}44`,padding:"2px 7px",letterSpacing:1}}>{w.type}</span>
                  <span style={{fontSize:12,color:w.color,fontWeight:900}}>{w.tier}-TIER</span>
                </div>
                <span style={{color:w.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
              </div>
              {open&&(<div style={{padding:"12px 14px"}}><div style={{fontSize:13,color:C.text,lineHeight:1.8,marginBottom:10}}>{w.desc}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><div style={{background:`${C.gold}08`,padding:"8px 10px",borderLeft:`2px solid ${C.gold}44`}}><div style={{fontSize:10,letterSpacing:2,color:C.gold,marginBottom:4}}>BEST FOR</div><div style={{fontSize:12,color:C.textDim,lineHeight:1.6}}>{w.best}</div></div><div style={{background:`${w.color}08`,padding:"8px 10px",borderLeft:`2px solid ${w.color}44`}}><div style={{fontSize:10,letterSpacing:2,color:w.color,marginBottom:4}}>⚡ TIP</div><div style={{fontSize:12,color:C.textDim,lineHeight:1.6}}>{w.tip}</div></div></div></div>)}
            </div>
          );})}
          <div style={{marginTop:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><div style={{width:3,height:14,background:C.pink}}/><span style={{fontSize:12,letterSpacing:4,color:C.pink,fontWeight:700}}>PERMANENT ABILITIES</span><div style={{flex:1,height:1,background:`${C.pink}22`}}/><span style={{fontSize:10,color:C.textDim}}>All 6 are mandatory — cannot be missed</span></div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {ABILITIES.filter(a=>!search||f(a.name)||f(a.use)).map((a,i)=>(
                <div key={i} style={{background:C.panel,border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.pink}`,padding:"10px 14px",display:"flex",gap:12,alignItems:"flex-start",flexWrap:"wrap"}}>
                  <div style={{minWidth:160}}><div style={{fontSize:13,color:C.textBright,fontWeight:700,marginBottom:2}}>{a.name}</div><div style={{fontSize:10,color:C.pink,letterSpacing:1}}>{a.how}</div></div>
                  <div style={{fontSize:12,color:C.textDim,lineHeight:1.6,flex:1}}>{a.use}</div>
                </div>
              ))}
            </div>
          </div>
        </>)}
        {tab==="UPGRADES"&&(<>
          <div style={{fontSize:12,color:C.textDim,letterSpacing:2,marginBottom:16}}>ARMOR MATRIX · HALCYON = RARE PURPLE · LUCENITE = COMMON ORANGE · SECOND CHANCE FIRST</div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {UPGRADES.filter(u=>!search||f(u.name)||f(u.why)).map((u,i)=>{
              const tagColor=u.tag==="ESSENTIAL"?C.red:u.tag==="HIGH"?C.orange:u.tag==="MEDIUM"?C.gold:C.dim;
              const currencyColor=u.currency==="Halcyon"?C.pink:C.gold;
              return(<div key={i} style={{background:C.panel,border:`1px solid ${C.border}`,borderLeft:`3px solid ${tagColor}`,padding:"12px 14px"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <span style={{fontSize:15,color:C.purple,fontWeight:900,flexShrink:0}}>{u.priority}.</span>
                    <span style={{fontSize:13,color:C.textBright,fontWeight:700}}>{u.name}</span>
                    <span style={{fontSize:10,letterSpacing:1,color:currencyColor,background:`${currencyColor}18`,border:`1px solid ${currencyColor}55`,padding:"2px 7px",whiteSpace:"nowrap"}}>{u.currency}</span>
                  </div>
                  <span style={{fontSize:10,letterSpacing:1,color:tagColor,background:`${tagColor}18`,border:`1px solid ${tagColor}55`,padding:"3px 8px",whiteSpace:"nowrap",flexShrink:0}}>{u.tag}</span>
                </div>
                <div style={{fontSize:12,color:C.textDim,lineHeight:1.7}}>{u.why}</div>
              </div>);
            })}
          </div>
          <div style={{marginTop:16,background:C.panel,border:`1px solid ${C.purple}44`,borderLeft:`3px solid ${C.purple}`,padding:"12px 14px"}}>
            <div style={{fontSize:11,letterSpacing:2,color:C.purple,marginBottom:6}}>HOW THE ARMOR MATRIX WORKS</div>
            <div style={{fontSize:12,color:C.textDim,lineHeight:1.8}}>The Armor Matrix is your permanent skill tree in The Passage hub. Purple nodes cost Halcyon. Orange/yellow nodes cost Lucenite. Unlock purple nodes first — always more impactful. After defeating the Prophet boss, every Proficiency level permanently grants +1 to Resilience, Command, and Drive — a massive late-game power spike.</div>
          </div>
        </>)}
        {tab==="BIOMES"&&(<>
          <div style={{fontSize:12,color:C.textDim,letterSpacing:2,marginBottom:14}}>8 BIOMES TOTAL · 8 OVERLORD BOSSES · NIGHTMARE GATES UNLOCK AFTER COMPLETING ALL 8</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
            {BIOMES.filter(b=>!search||f(b.name)||f(b.notes)).map((b,i)=>(
              <div key={i} style={{background:C.panel,border:`1px solid ${C.border}`,borderLeft:`3px solid ${b.color}`,padding:"14px 16px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
                  <span style={{fontSize:14,color:C.textBright,fontWeight:700}}>{b.name}</span>
                  <span style={{fontSize:10,letterSpacing:2,color:b.color,background:`${b.color}15`,border:`1px solid ${b.color}44`,padding:"2px 8px"}}>{b.difficulty.toUpperCase()}</span>
                </div>
                <div style={{fontSize:13,color:C.textDim,lineHeight:1.7}}>{b.notes}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <div style={{fontSize:12,letterSpacing:4,color:C.dim,marginBottom:4}}>KEY MECHANICS</div>
            {[{label:"Blue Flags",col:C.cyan,text:"Critical path progression. Follow these to advance the run."},{label:"White Flags",col:C.violet,text:"Side paths with upgrades, loot, and healing. Low risk — always worth the detour."},{label:"Eclipse Apparatus",col:C.pink,text:"Sun-symbol mechanisms. Activating powers up enemies but unlocks better rewards. Mandatory at certain points."},{label:"Containers",col:C.gold,text:"Two-choice reward containers — almost always choose Halcyon over the alternative."},{label:"World Dial",col:C.purple,text:"Shows how much Halcyon remains in each biome. Access from Primary in The Passage hub."}].map((m,i)=>(
              <div key={i} style={{background:C.panel,border:`1px solid ${C.border}`,borderLeft:`3px solid ${m.col}`,padding:"10px 14px",display:"flex",gap:12,alignItems:"flex-start",flexWrap:"wrap"}}>
                <span style={{fontSize:12,color:m.col,fontWeight:700,minWidth:140,flexShrink:0}}>{m.label}</span>
                <span style={{fontSize:12,color:C.textDim,lineHeight:1.6,flex:1}}>{m.text}</span>
              </div>
            ))}
          </div>
        </>)}
        <div style={{marginTop:22,borderTop:`1px solid ${C.border}`,paddingTop:10,fontSize:10,color:C.dimmer,letterSpacing:2,textAlign:"center"}}>SAROS · HOUSEMARQUE · APR 30 2026 · HALCYON ALWAYS · ABSORB BLUE PROJECTILES</div>
      </div>
    </div>
  );
}
