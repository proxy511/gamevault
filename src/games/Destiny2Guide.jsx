import { useState } from "react";

const C = {
  bg:"#060810", panel:"#0c0e18", border:"#1a1e30", borderDim:"#1a1e30",
  blue:"#4f8ef7", cyan:"#00e5ff", gold:"#ffd700",
  green:"#6ee7b7", red:"#f87171", orange:"#fb923c",
  purple:"#c084fc", pink:"#f472b6", teal:"#2dd4bf",
  solar:"#f97316", arc:"#60a5fa", void:"#a855f7",
  stasis:"#38bdf8", strand:"#4ade80", prismatic:"#e879f9",
  dim:"#3a4060", dimmer:"#1a1e30",
  text:"#c8d0f0", textDim:"#6a74a0", textBright:"#f0f4ff",
};
const F = { fontFamily:"'Courier New','Lucida Console',monospace" };

// ─── BASICS ──────────────────────────────────────────────────────────────────
const WEAPON_SLOTS = [
  { slot:"Kinetic", color:C.text, icon:"⬜",
    ammo:"Primary (white) — infinite", dmgType:"Physical / Stasis / Strand",
    strength:"10% more damage to unshielded enemies in PvE. Your workhorse slot.",
    use:"Default damage slot. Always shooting kinetic means consistent DPS against unshielded targets.",
    tip:"Kinetic doesn't break elemental shields — use Energy for those. Best slot for high-uptime weapons like hand cannons and pulse rifles." },
  { slot:"Energy", color:C.cyan, icon:"🔵",
    ammo:"Primary (white) — infinite or Special (green) — limited", dmgType:"Arc / Solar / Void / Stasis / Strand",
    strength:"Deals 2.8× damage to matching elemental shields. Breaking a matching shield causes an explosion that damages nearby enemies.",
    use:"Shield breaking and elemental synergy. Match the element to the shield color for maximum efficiency.",
    tip:"Always carry an Energy weapon that matches the most common enemy shield type in the activity. Barrier Champions require a specific ammo type — check your mod loadout." },
  { slot:"Power", color:C.gold, icon:"🟡",
    ammo:"Power (purple) — very limited, drops from elites and bosses", dmgType:"All elements",
    strength:"Highest burst damage in the game outside of Supers. Reserved for boss damage phases and tough champions.",
    use:"Save Power ammo for boss damage windows. Don't spray it on trash enemies.",
    tip:"Rocket Launchers, Grenade Launchers, Swords, Linear Fusion Rifles, Sniper Rifles — all live here. In raids, coordinate your team's Power weapon types for maximum DPS phases." },
];

const AMMO_TYPES = [
  { name:"Primary", color:"#d8d8d8", symbol:"⬜", desc:"Infinite reserves. Never runs out. Handguns, pulse rifles, auto rifles, scouts, SMGs, sidearms, bows, trace rifles (some). Your always-available damage source." },
  { name:"Special", color:C.green, symbol:"🟩", desc:"Limited reserves — refills from green bricks dropped by enemies. Shotguns, fusion rifles, sniper rifles, grenade launchers (energy), glaives. More powerful per shot than Primary." },
  { name:"Power", color:C.gold, symbol:"🟨", desc:"Very limited — drops from elite enemies and bosses as purple bricks. Rocket launchers, heavy grenade launchers, linear fusion rifles, swords, machine guns. Highest damage per hit." },
];

const DAMAGE_TYPES = [
  { type:"Kinetic", color:"#c8d0f0", desc:"Physical damage. No elemental effects. +10% vs unshielded. Best raw DPS slot." },
  { type:"Arc", color:C.arc, desc:"Lightning. Jolts, blinds, and amplifies. Strong vs Arc shields (blue). Aggressive high-mobility builds." },
  { type:"Solar", color:C.solar, desc:"Fire. Scorches, ignites, radiance. Strong vs Solar shields (orange/red). Sustain and healing builds." },
  { type:"Void", color:C.void, desc:"Space magic. Weakens, suppresses, devours. Strong vs Void shields (purple). Invisibility and survivability builds." },
  { type:"Stasis", color:C.stasis, desc:"Ice/Darkness. Slows, freezes, shatters. No common shield type. Crowd control builds. Requires Beyond Light." },
  { type:"Strand", color:C.strand, desc:"Woven light/Darkness. Suspends, severs, unravels. No common shield type. Movement and threadling builds. Requires Lightfall." },
];

const POWER_BASICS = [
  { title:"What is Power Level?", body:"Every piece of gear (weapons and armor) has a Power number. Your effective Power is the average of all 8 equipped items — 3 weapons + 5 armor pieces. Higher Power = more damage dealt, less taken in activities with Power requirements." },
  { title:"Powerful vs Pinnacle Drops", body:"Powerful drops raise your Power up to a soft cap. Once you hit the soft cap, only Pinnacle drops (from raids, dungeons, high-level Nightfalls, etc.) raise you further. Pinnacle drops are limited and often weekly." },
  { title:"Artifact Power Bonus", body:"The seasonal Artifact grants bonus Power on top of your gear Power — this bonus is unlimited and earned by playing. It lets you over-level the cap. It resets each season but seasonal mods unlocked on it are free." },
  { title:"Champion Mods — Critical", body:"Champions are elite enemies with special abilities. Anti-Barrier (orange shield), Overload (regenerating health), and Unstoppable (can't be staggered). Each season assigns which weapon types counter which champion. Equip the matching Combat Style mod or you CANNOT kill Champions effectively in high-end content." },
  { title:"Exotic Limit", body:"You can only equip ONE Exotic weapon AND ONE Exotic armor piece at a time. No exceptions. Build around your chosen Exotic — it's the foundation of every endgame build." },
  { title:"Loadout System", body:"Destiny 2 lets you save named Loadouts — a full snapshot of your weapons, armor, mods, and subclass configuration. Save multiple loadouts for different activities (Raid DPS, Crucible, Grandmaster). The fastest way to switch builds." },
];

// ─── CLASSES ─────────────────────────────────────────────────────────────────
const CLASSES = [
  {
    name:"Hunter", color:C.gold, role:"Agility / Single-Target DPS / Stealth",
    ability:"Dodge — either Gamblers Dodge (recharges melee) or Marksman Dodge (recharges from distance). Fastest and most mobile class.",
    jump:"Triple Jump / Strafe Jump / High Jump",
    playstyle:"Hit-and-run. High damage peaks, repositioning, invisibility. The lone wolf class. Weakest group utility, strongest individual DPS ceiling.",
    pvp:"Top PvP class. Fast dodge, high precision damage, invisibility from Void.",
    pve:"Best burst DPS through Celestial Nighthawk Golden Gun builds, Prismatic knife builds, and Tether for crowd control.",
    avoid:"Hunters are punished for standing still. If you like holding a position, play Titan.",
    subclasses:[
      { name:"Gunslinger", element:"Solar", color:C.solar, super:"Golden Gun (3-shot or 6-shot) — precision kills cause explosions. Celestial Nighthawk exotic makes 1 massive shot.", playstyle:"Single-target burst DPS. Best boss damage super in the game when paired with Celestial Nighthawk.", key:"Knife Throw melee, Radiant on precision hits." },
      { name:"Nightstalker", element:"Void", color:C.void, super:"Shadowshot — tethers enemies, weakens them, makes them grant Void Orbs. OR Deadfall for a stationary tether trap.", playstyle:"Crowd control, team support (Weaken), invisibility. The only reliable invisibility class.", key:"Smoke Bomb grants invis. Weaken debuff is one of the strongest team buffs in the game." },
      { name:"Arcstrider", element:"Arc", color:C.arc, super:"Arc Staff — spinning lightning staff melee super. OR Gathering Storm — throw arc staff as a lightning AoE.", playstyle:"High movement, Amplified state increases speed. Best for aggressive close-range PvP.", key:"Combination Blow melee builds — each kill increases melee damage stacks. Absurdly powerful in content with lots of ads." },
      { name:"Revenant", element:"Stasis", color:C.stasis, super:"Silence and Squall — throw two Kama blades that create a freezing storm. Excellent AoE freeze.", playstyle:"Crowd freeze and slow. Shuriken melee chains freeze. Excellent for Grandmaster content control.", key:"Requires Beyond Light. Shuriken melee freeze is the best Stasis crowd control in the game." },
      { name:"Threadrunner", element:"Strand", color:C.strand, super:"Silkstrike — creates a ball of Strand energy. Most mobile super in the game — swing, slam, whip.", playstyle:"Extreme mobility, grapple everywhere, suspend enemies. Best traversal subclass.", key:"Requires Lightfall. Grapple melee suspends enemies. Threaded Spike bounces and deals heavy damage." },
      { name:"Prismatic Hunter", element:"Prismatic", color:C.prismatic, super:"Blade Barrage (Solar) or Silence and Squall (Stasis)", playstyle:"Combine Light and Dark abilities. Fill Transcendence meter for Hailfire Spike grenade and massive damage/regen buff. Knife melee from Stasis + Gunslinger Solar synergies.", key:"Requires The Final Shape. Transcendence is a short-window supercharge — learn to activate it during burst DPS windows." },
    ]
  },
  {
    name:"Titan", color:C.blue, role:"Tank / Front-Line / Crowd Control",
    ability:"Barricade — either Rally Barricade (reload all weapons) or Towering Barricade (full cover wall). Strongest class ability in PvE.",
    jump:"Lift (Strafe, High, or Catapult) — shortest air time but most controllable.",
    playstyle:"Hold the line. Survivability, crowd suppression, team barricades. The class that makes hard content feel manageable.",
    pvp:"Strong but slower. Barricade is a game-changer in Trials. One-punch melee builds punish rushing opponents.",
    pve:"Top endgame pick. Consecration slam, Thundercrash, Glacial Quake, and Ward of Dawn are all meta-defining.",
    avoid:"Titan jump has limited vertical reach. If you need height quickly, Warlock or Hunter handle it better.",
    subclasses:[
      { name:"Sunbreaker", element:"Solar", color:C.solar, super:"Hammer of Sol — throw flaming hammers. OR Burning Maul — two-handed flaming maul slam.", playstyle:"Restoration and scorching. Consecration slam (slide + melee) is one of the best add-clear tools in the game.", key:"Consecration: slide then melee to create an ignition wave. Kills grant restoration. Excellent for Master content." },
      { name:"Sentinel", element:"Void", color:C.void, super:"Shield Throw — throw a Captain America shield. OR Ward of Dawn — indestructible dome that grants Weapons of Light buff to all allies inside.", playstyle:"Team protection. Ward of Dawn is a mandatory raid tool. Suppression grenades shut down elites.", key:"Ward of Dawn + Weapons of Light = 25% weapon damage buff for the whole team. Use it in every raid DPS phase." },
      { name:"Striker", element:"Arc", color:C.arc, super:"Fists of Havoc — AoE slam. OR Thundercrash — become a human missile, best boss super in the game.", playstyle:"Aggressive brawler. Knockout heals on melee kills. Thundercrash with Cuirass of the Falling Star is the #1 boss damage super.", key:"Thundercrash + Cuirass of the Falling Star exotic = devastating single boss damage. Standard in raid DPS." },
      { name:"Behemoth", element:"Stasis", color:C.stasis, super:"Glacial Quake — Stasis fists, punch to create crystals and shatter frozen enemies.", playstyle:"Crowd freeze. Shiver Strike melee launches enemies. Diamond Lance creates Stasis spear weapons from crystals.", key:"Requires Beyond Light. Shatter damage from frozen enemies is one of the highest burst AoE damage types in the game." },
      { name:"Berserker", element:"Strand", color:C.strand, super:"Bladefury — dual Strand blades. Sever and unravel enemies to reduce damage output.", playstyle:"Suspend groups with Drengr's Lash (barricade creates suspend burst). Woven Mail damage resistance.", key:"Requires Lightfall. Drengr's Lash on barricade suspends ALL nearby enemies — the best Titan group CC tool." },
      { name:"Prismatic Titan", element:"Prismatic", color:C.prismatic, super:"Thundercrash (Arc) or Bladefury (Strand)",playstyle:"The brawler combo: Barricade suspends (Drengr's Lash), slide + Consecration ignites everything. Thundercrash covers boss damage. Knock Out heals the melee loop. Transcendence: Electrified Snare grenade for AoE.", key:"Requires The Final Shape. Spirit of Synthoceps + Spirit of Inmost Light is the top PvE Titan exotic pairing." },
    ]
  },
  {
    name:"Warlock", color:C.purple, role:"Support / Healing / Versatile Caster",
    ability:"Rift — either Healing Rift (constant health regeneration) or Empowering Rift (weapon damage boost). The only class that heals teammates in place.",
    jump:"Glide — slowest to start, floats far. Excellent for horizontal distance, punishing for fast vertical needs.",
    playstyle:"Space wizard. Buffs, heals, ranged super abilities, and the most build variety. Best class for learning hard content because Healing Rift covers mistakes.",
    pvp:"High skill floor. Glide is predictable but strong aerial control. Nova Bomb and Chaos Reach are deadly accurate supers.",
    pve:"Most forgiving in Grandmaster content thanks to Healing Rift. Best Well of Radiance for team support. Dawnblade is raid meta.",
    avoid:"Warlock jump feels floaty and hard to control for new players. Stick with it — the class is worth it.",
    subclasses:[
      { name:"Dawnblade", element:"Solar", color:C.solar, super:"Daybreak — throw flaming swords. OR Well of Radiance — slam sword into ground, creates a healing and empowering field that makes all allies invincible-ish.", playstyle:"The support king. Well of Radiance is the single most important team ability in Destiny 2 raids.", key:"Well of Radiance + Phoenix Dive (slam into well for instant restoration) + healing grenades = unkillable. Mandatory in most raid strategies." },
      { name:"Voidwalker", element:"Void", color:C.void, super:"Nova Bomb (Cataclysm — tracking projectiles, or Vortex — big explosion). OR Nova Warp — teleport and AoE detonate.", playstyle:"Devour (kill to full heal) + Chaos Accelerant grenades. Self-sustaining solo build. Suppression and weakening.", key:"Devour is one of the strongest self-healing mechanics in the game. Feed the Void exotic lets you activate Devour from a grenade." },
      { name:"Stormcaller", element:"Arc", color:C.arc, super:"Stormtrance — chain lightning. OR Chaos Reach — concentrated beam of Arc energy (best sustained super DPS).", playstyle:"Ionic Traces generate ability energy. Arc Soul (turret from Rift) shreds ads constantly. High uptime on abilities.", key:"Chaos Reach with Geomag Stabilizers extends the beam duration. Top sustained DPS super for stationary boss fights." },
      { name:"Shadebinder", element:"Stasis", color:C.stasis, super:"Winter's Wrath — fire Stasis shards to freeze, then detonate with shockwave.", playstyle:"Long-range freeze and shatter. Penumbral Blast melee shoots a Stasis projectile. Exceptional for long-range crowd freeze.", key:"Requires Beyond Light. Osmiomancy Gloves exotic makes your Coldsnap grenades aggressive tracking chains — one of the best ad-clear tools." },
      { name:"Broodweaver", element:"Strand", color:C.strand, super:"Needlestorm — launch Strand missiles, spawn Threadlings on kill.", playstyle:"Threadlings everywhere. Weave Call grenade spawns Threadlings. Mindspun Invocation makes grenades spawn more Threadlings.", key:"Requires Lightfall. Swarmers exotic generates Threadlings from Tangle explosions — passive damage that stacks up massively." },
      { name:"Prismatic Warlock", element:"Prismatic", color:C.prismatic, super:"Needlestorm (Strand) or Nova Bomb (Void)", playstyle:"Getaway Artist: turn Arc grenade into an Arc Soul that charges abilities. Combine with Devour from Void and healing from Solar. Transcendence: Freezing Singularity grenade AoE.", key:"Requires The Final Shape. Getaway Artist + Fallen Sunstar is the top sustained ability-generation build in the entire game." },
    ]
  }
];

// ─── EXPANSIONS ───────────────────────────────────────────────────────────────
const EXPANSIONS = [
  { name:"New Light (Free)", year:"2019", color:C.green, status:"Free — always available",
    adds:"Base game content. Cosmodrome, EDZ, Nessus, Moon destinations. Strikes, basic Crucible, Gambit. All three classes. Arc/Solar/Void subclasses. Story missions from Shadowkeep onward.",
    unlocks:"Arc, Solar, Void for all classes. Basic endgame loop.",
    note:"All new players start here. Good enough to learn the game fully before investing." },
  { name:"Forsaken Pack", year:"2018 / Repackaged 2022", color:C.orange, status:"Purchasable separately",
    adds:"Dreaming City destination. Exotic weapons and armor from the Forsaken era. Shattered Throne dungeon. Warden of Nothing strike.",
    unlocks:"Dreaming City exotics, Shattered Throne dungeon, Warden of Nothing strike.",
    note:"Story campaign is in the Destiny Content Vault. Only endgame content remains." },
  { name:"Shadowkeep", year:"2019", color:C.dimmer, status:"Included in Collection Bundle",
    adds:"Moon destination. Pit of Heresy dungeon. Garden of Salvation raid. Nightmare Hunts. Hive lore deep-dive.",
    unlocks:"Pit of Heresy dungeon, Garden of Salvation raid, Moon patrol zone.",
    note:"The first standalone expansion. Good raid for learning mechanics." },
  { name:"Beyond Light", year:"2020", color:C.stasis, status:"Included in Collection Bundle",
    adds:"Europa destination. Deep Stone Crypt raid. Stasis subclass for all 3 classes. Exo Stranger quests. Clovis Bray lore.",
    unlocks:"STASIS SUBCLASS — available to all 3 classes. Deep Stone Crypt raid. Europa Exotics.",
    note:"One of the best expansions. Stasis was the first Darkness subclass — a massive gameplay shift." },
  { name:"The Witch Queen", year:"2022", color:C.void, status:"Included in Collection Bundle",
    adds:"Savathun's Throne World destination. Vow of the Disciple raid. Heartshadow and Warlord's Ruin dungeons. Weapon Crafting system. Glaive weapon type. Campaign is some of the best storytelling in the game.",
    unlocks:"Weapon Crafting (reshape weapons with desired perks), Glaives, Vow of the Disciple raid, two dungeons.",
    note:"The Weapon Crafting system fundamentally changed how players chase god rolls. Essential expansion." },
  { name:"Lightfall", year:"2023", color:C.strand, status:"Included in Collection Bundle",
    adds:"Neomuna (Neptune) destination. Root of Nightmares raid. Strand subclass for all 3 classes. Strand-based weapons and exotics. Guardian Ranks system.",
    unlocks:"STRAND SUBCLASS — available to all 3 classes. Root of Nightmares raid. Grapple traversal.",
    note:"Strand's Grapple mechanic changes how you move around every activity. Root of Nightmares is an accessible raid." },
  { name:"The Final Shape", year:"2024", color:C.prismatic, status:"Included in Collection Bundle",
    adds:"The Pale Heart (The Traveler interior) destination. Salvation's Edge raid — the most mechanically complex raid ever made. PRISMATIC subclass for all 3 classes. Exotic Class Items. Imbaru Engine questline. The true ending of the Light vs Darkness saga.",
    unlocks:"PRISMATIC SUBCLASS — combines Light and Dark abilities. Transcendence mechanic. Exotic Class Items. Salvation's Edge (hardest raid).",
    note:"The narrative conclusion. Prismatic is the most powerful subclass in the game. Salvation's Edge is the peak of Destiny 2 raiding." },
  { name:"The Edge of Fate", year:"2025", color:C.blue, status:"Included in Collection Bundle",
    adds:"New destination. Desert Perpetual raid. New subclass fragments and aspects. Tier-5 armor system. New weapon archetypes.",
    unlocks:"Desert Perpetual and Pantheon raids (fully customizable difficulty with modifier cards). Tier-5 armor.",
    note:"Introduced the deepest difficulty customization system in the game. Pantheon raid is the endgame pinnacle." },
  { name:"Renegades", year:"Dec 2025", color:C.red, status:"Included in Collection Bundle",
    adds:"Lawless Frontier on Mars. New story. Additional weapons and armor. Expanded seasonal content.",
    unlocks:"Final expansion content before game entered maintenance-only mode.",
    note:"The 10th and final expansion. Game entered the Monument of Triumph permanent state in June 2026." },
  { name:"Monument of Triumph", year:"June 2026", color:C.gold, status:"Final free update — all players",
    adds:"The last content update ever. All expansions bundled into Destiny 2: The Collection. Final sandbox balance pass. All content remains playable forever. Game is now in maintenance-only mode.",
    unlocks:"Nothing new — consolidates everything into its final permanent state.",
    note:"The game is done. No more seasons, no more expansions. The sandbox you play in now is the final version forever." },
];

// ─── ACTIVITIES ───────────────────────────────────────────────────────────────
const ACTIVITIES = [
  { name:"Patrol / Open World", tier:"Starter", color:C.green,
    power:"Any", players:"Solo",
    desc:"Free-roam exploration of all destinations. Public events spawn on a timer — Heroic versions give better loot. Lost Sectors are small dungeons with a boss chest. Region Chests give glimmer and materials.",
    rewards:"Materials, gear, Exotic drops from Heroic Lost Sectors (legend/master difficulty).",
    tip:"Legend and Master Lost Sectors are the ONLY way to target-farm specific Exotic armor pieces. Solo only." },
  { name:"Strikes", tier:"PvE Standard", color:C.cyan,
    power:"1300+ recommended", players:"3-player fireteam",
    desc:"Matchmade 3-player missions with a boss at the end. The Vanguard Playlist cycles through all available strikes. Completing gives Vanguard reputation and Vanguard Engrams.",
    rewards:"Vanguard engrams, Vanguard medals, random legendary gear.",
    tip:"Don't farm regular strikes for specific gear. Use them to level Vanguard reputation for Zavala's engram focusing." },
  { name:"Nightfall: The Ordeal", tier:"PvE Challenging", color:C.orange,
    power:"Scales with difficulty — GM requires high Power", players:"3-player fireteam (solo possible on lower tiers)",
    desc:"A specific strike with modifiers and champions. Difficulties: Adept, Hero, Legend, Master, Grandmaster. Higher difficulties give better loot. Weekly rotating strike.",
    rewards:"Exclusive Nightfall weapons (rotating weekly). Adept weapons from GM. High stat armor.",
    tip:"If you want a specific Nightfall weapon, farm the week it's featured. GM Nightfalls give Adept (enhanced perk) versions — the best possible rolls." },
  { name:"Crucible (PvP)", tier:"PvP", color:C.red,
    power:"Normalized for most modes", players:"3v3 or 6v6",
    desc:"Player vs player combat. Modes: Control (6v6 objective), Survival (3v3 competitive), Clash (6v6 team deathmatch), Trials of Osiris (3v3 weekend tournament), Iron Banner (seasonal 6v6 with Power advantages).",
    rewards:"Crucible engrams, Trials of Osiris exclusive weapons and armor (best PvP gear), Iron Banner weapons.",
    tip:"Trials of Osiris rewards the best PvP weapons. Going Flawless (7 wins, 0 losses) unlocks the Adept versions. Reserve Trials for when you have a solid 3-stack." },
  { name:"Gambit", tier:"PvPvE Hybrid", color:C.strand,
    power:"1300+ recommended", players:"4v4",
    desc:"Two teams simultaneously fight PvE enemies to collect Motes of Dark. Deposit 75 Motes to summon a Primeval boss. Invaders can cross to the enemy side to kill Guardians and drop their undeposited Motes. Kill the Primeval first to win.",
    rewards:"Gambit engrams, exclusive Gambit weapons.",
    tip:"Mote banking strategy wins Gambit — small (5), medium (10), large (15). Don't die while holding more than 14 Motes. Invade at 75+ on your side to block the enemy Primeval from healing." },
  { name:"Dungeons", tier:"Endgame", color:C.gold,
    power:"Recommended 1600+", players:"1–3 fireteam (no matchmaking)",
    desc:"Mini-raids. Solo-able but designed for 3. Have puzzle mechanics, unique boss encounters, and exclusive loot. 7 dungeons total: Shattered Throne, Pit of Heresy, Prophecy, Grasp of Avarice, Duality, Spire of the Watcher, Ghosts of the Deep, Warlord's Ruin, Vesper's Host, Liberator, Equilibrium.",
    rewards:"Exclusive Exotic weapons (Heartshadow, Hierarchy of Needs, Wicked Implement, Buried Bloodline), Exotic armor, high-stat armor.",
    tip:"Dungeons are the best solo endgame challenge. Each dungeon drops an exclusive weapon — farming is weekly lockout per character. Run 3 characters to triple your weekly chances." },
  { name:"Raids", tier:"Endgame — Pinnacle", color:C.prismatic,
    power:"Normal: 1580+. Master: 1640+", players:"6-player fireteam (no matchmaking)",
    desc:"The pinnacle of Destiny 2 PvE. Multi-encounter activities requiring full team communication, puzzle mechanics, and mechanical execution. 10 raids total. Each has a weekly challenge that rewards Pinnacle drops. Completing all encounters in a week gives the pinnacle reward.",
    rewards:"Exclusive Raid weapons and armor, Adept weapons from Master difficulty, Raid-specific Exotic weapons (One Thousand Voices, Eyes of Tomorrow, Collective Obligation, Conditional Finality).",
    tip:"Use Destiny 2 LFG (LFG.gg or the in-game fireteam finder) if you don't have a group. Know the mechanics before you show up — look up a guide for each encounter first. Raids have weekly lockouts per encounter per character." },
  { name:"Legend / Master Lost Sectors", tier:"Endgame Solo", color:C.teal,
    power:"Legend: 1610+. Master: 1640+", players:"Solo ONLY (no matchmaking, no fireteam)",
    desc:"Standard Lost Sectors upgraded to high-difficulty versions with Champions, modifiers, and a boss. The ONLY way to target-farm specific Exotic armor slots. Daily rotation changes which slot is available: Helmet, Arms, Chest, Legs, Class Item.",
    rewards:"Specific Exotic armor slot (check the daily rotation). Each day a different armor slot drops.",
    tip:"Check the daily Lost Sector rotation. If you need specific Exotic boots, wait for the day Legs are the featured slot then farm it. Master gives higher stat rolls." },
  { name:"Seasonal Activities", tier:"Varies", color:C.blue,
    power:"Scales per activity", players:"Matchmade or LFG",
    desc:"Each expansion and season introduced new activities. Most notable still active in the final sandbox: Onslaught (endless wave defense), Coil (roguelite-esque difficulty scaling), Partition (The Final Shape's combat arena).",
    rewards:"Seasonal weapons, armor, and focusing currency for seasonal vendors.",
    tip:"Onslaught is one of the best XP and material farms in the game. Run it for artifact progression and seasonal engrams." },
];

// ─── FARMING ─────────────────────────────────────────────────────────────────
const FARMING = [
  { topic:"Power Level — How to Raise It", color:C.gold, icon:"📈",
    body:"1. Play any activity for Powerful drops until you hit the soft cap. 2. Once at soft cap, only Pinnacle sources raise you further. 3. Pinnacle sources: Raid encounters, Dungeon final bosses, Grand Master Nightfalls, weekly Vanguard/Crucible/Gambit milestones, weekly Exotic mission completions. 4. Artifact bonus Power adds on top — grind seasonal activities for Artifact XP.",
    tip:"Equip the highest Power item in each slot even if the perks are bad. Your Power average includes ALL 8 slots — a low slot tanks your effective Power." },
  { topic:"Exotic Armor Farming", color:C.purple, icon:"🟣",
    body:"Method 1 — Legend/Master Lost Sectors: Solo only. Daily rotation tells you which armor slot drops. Farm the day that matches what you need. Master tier gives slightly better stat distribution.\n\nMethod 2 — Exotic Engrams: Xur (weekend vendor, random location) sells exotics and has a guaranteed exotic engram. You can also focus exotic engrams at the Monument of Lost Lights in the Tower using Exotic Ciphers and Spoils of Conquest.\n\nMethod 3 — Raid/Dungeon runs: Some exotics only drop from specific raids or dungeons (One Thousand Voices from Last Wish, Heartshadow from Duality, etc.).",
    tip:"The Monument of Lost Lights in the Tower lets you buy any sunset Exotic using Exotic Ciphers + Spoils of Conquest. Essential for completing your collection." },
  { topic:"Exotic Weapons Farming", color:C.solar, icon:"🟠",
    body:"World drop exotics: Random chance from any activity — Nightfalls and high-difficulty content have better drop rates.\n\nXur: Weekend vendor sells a random exotic weapon and one exotic armor piece per class. Location rotates weekly.\n\nExotic Missions: Specific exotic weapons are locked behind dedicated exotic missions (Zero Hour, The Whisper, Harbinger, Presage, etc.). These are the only sources for those weapons.\n\nRaid exotics: Only drop from specific raid encounters — long farm, but most are best-in-slot weapons.",
    tip:"Check DIM (Destiny Item Manager) or light.gg for which exotics drop from which source. Time-gated exotic quests can still be completed — they're all in the final sandbox." },
  { topic:"God Roll Weapons — Crafting vs RNG", color:C.green, icon:"🔨",
    body:"Red Border weapons (Deepsight Resonance): Extract their pattern by completing in-game kills/activities while the weapon is equipped. Extract 5 copies of the same weapon to unlock its Crafting pattern at the Enclave on Mars.\n\nCrafted weapons let you choose EXACTLY which perks go on the weapon — no more RNG farming. Crafted weapons can also be Enhanced (upgraded perk versions) by leveling them up through kills.\n\nNon-craftable weapons: Still RNG. Farm the activity it drops from and use focusing (turning in engrams at the relevant vendor) to narrow the perk pool.",
    tip:"Prioritize red border weapons from any source. Unlocking the pattern saves thousands of hours of RNG farming. Check the Enclave on Mars for any patterns you've already partially unlocked." },
  { topic:"Weekly Lockouts — Maximize Your Characters", color:C.cyan, icon:"🔄",
    body:"Most of Destiny 2's best rewards are weekly lockouts — you can only earn them once per character per week. With 3 characters (one of each class or any combination), you effectively triple your weekly reward income.\n\nLockouts include: Raid encounters (each encounter once per week), Dungeon final bosses, GM Nightfall completion, Weekly vendor milestones (Vanguard, Crucible, Gambit), Exotic missions.\n\nSunday reset clears all weekly lockouts.",
    tip:"Create and maintain 3 characters even if you main one class. Running a raid on all 3 triples your weekly chances at the exclusive weapons and high-stat armor." },
  { topic:"Materials — What to Keep and Spend", color:C.teal, icon:"🧰",
    body:"Glimmer (in-game currency): Spend freely — regenerates constantly from play. Buy ammo finders, bounties, and materials from vendors.\n\nShard of Eternity / Enhancement Cores: Used for Masterworking armor. Don't trash them.\n\nUpgrade Modules: Buy from Banshee-44 (daily limit). Used for Masterworking weapons.\n\nSpoils of Conquest: Only from raid completions. Spend at the Raid Exotic Kiosk in the Tower for raid exotics you're missing.\n\nExotic Ciphers: Rare — complete Xur's Xenology quest weekly. Spend at the Monument of Lost Lights for legacy exotics.",
    tip:"Never shard Exotic gear — Exotic weapons/armor can be pulled back from Collections for free, but sharding feels bad. Keep every Exotic you earn even if you don't use it." },
  { topic:"Bounties and XP Farming", color:C.dimmer, icon:"📋",
    body:"Daily and weekly bounties from all vendors give XP toward your Artifact Power bonus. The Artifact has no cap — the more you play the higher your bonus Power climbs.\n\nBest XP sources: Onslaught (seasonal wave defense), Strikes playlist bounties, Weekly challenge completions.\n\nGhostly Memento / XP Boosts: Seasonal XP boost items temporarily double your XP gain — use them before playing.",
    tip:"Artifact Power is the most important long-term progression. Even when your gear is capped, grinding Artifact Power means you're effectively higher level than other players at the same gear cap." },
];

// ─── QUESTS ──────────────────────────────────────────────────────────────────
const QUESTS = [
  // ── EXOTIC MISSIONS ──
  { name:"Zero Hour", cat:"exotic", reward:"Outbreak Perfected (Exotic Pulse Rifle)", expansion:"Forsaken Era",
    power:"1500+ recommended", players:"Solo or up to 3",
    source:"Director → Pinnacle Ops → Zero Hour. Must be unlocked by completing the 'Enemy of My Enemy' quest on the Tangled Shore first.",
    color:"#00e5ff",
    steps:[
      "Launch Zero Hour from Pinnacle Ops in the Director.",
      "Navigate through the abandoned Cosmodrome starting from the Old Tower. The mission has a 20-minute timer — move fast and only kill what blocks your path.",
      "Section 1 — Warehouses: Follow the linear path through broken Cosmodrome structures. Fallen Vandals and Captains patrol — kill the ones in narrow corridors, sprint past open rooms.",
      "Section 2 — Underground passage: Drop into the underground section. Follow the glowing vent lights. Crouch through the low-ceiling areas.",
      "Section 3 — Saboteur room: Use the Fallen control panel to open the blast door. This room has a large Fallen ambush — clear the room fast and interact with the console on the elevated platform.",
      "Section 4 — Ventilation shafts: Parkour section through vertical shafts. Follow the light trail upward. No enemies — just move quickly.",
      "Boss — Aksiniks, Bound by Honor: A Fallen Captain with Arc shields. Break Arc shields first (use Arc Energy weapon), then burst him down. He calls in reinforcement Vandals at 50% health — kill them fast so they don't overwhelm you. He staggers on heavy hits.",
      "Loot the chest behind the boss. Outbreak Perfected is in your rewards. The mission can be replayed weekly for red border Deepsight drops to unlock the crafting pattern.",
    ],
    tip:"With a 20-minute timer, every second matters. Prioritize the path over kills. If you have a 3-person fireteam, assign one person to hold enemies while the other two sprint the route." },

  { name:"The Whisper", cat:"exotic", reward:"Whisper of the Worm (Exotic Sniper Rifle)", expansion:"Warmind Era",
    power:"1500+ recommended", players:"Solo or up to 3",
    source:"Director → Pinnacle Ops → The Whisper.",
    color:"#a855f7",
    steps:[
      "Launch The Whisper from Pinnacle Ops.",
      "Section 1 — Taken Blight Maze: Navigate through layers of Taken corruption. The portals glow purple — enter each one to advance. Kill Taken Acolytes and Thralls as you push through. There is no timer on this section.",
      "Section 2 — Jumping Puzzle: Reach the central Taken corruption chamber. An extensive jumping sequence follows — you will navigate through floating platforms, gravity-inverted corridors, and zero-gravity sections. Take your time. Falls reset you to the nearest checkpoint.",
      "Key jump landmarks: the crumbling staircase (jump between the left-side ledges), the rotating cylinder (time the jump to the stable platform at the top), the final gap before the boss room (double-jump across and immediately vault right).",
      "Boss Room — 3 Taken Minotaurs + Blight: The boss room has a pulsing Blight orb that regenerates all enemy health if left alive. Priority: kill both flanking Minotaurs in each wave FIRST, then shoot the Blight orb to destroy it. Once the Blight is down, damage the boss Minotaur before the next phase begins.",
      "Repeat the Minotaur-then-Blight sequence for 3 full phases. After the third phase, the boss Minotaur falls and a chest spawns in the center of the room.",
      "Open the chest. Whisper of the Worm is inside.",
    ],
    tip:"The jumping puzzle is where most players fail or give up. The zero-gravity section has a consistent path — hug the right wall the entire way through and you'll find every platform. Practice it a few times — it becomes muscle memory." },

  { name:"Presage", cat:"exotic", reward:"Dead Man's Tale (Exotic Scout Rifle)", expansion:"Season of the Chosen",
    power:"1500+ recommended", players:"Solo recommended (better rewards) or up to 3",
    source:"Director → Pinnacle Ops → Presage. Start the mission from the Tangled Shore patrol zone.",
    color:"#f97316",
    steps:[
      "Board the Glykon, a derelict Cabal ship. The mission has horror atmosphere — reduced visibility, ambient sound cues, narrow corridors.",
      "Section 1 — Cargo Hold: Navigate through the lower cargo bay. Activate the yellow console on the right wall to open the blast door ahead.",
      "Section 2 — Power Restoration: Find 3 power nodes scattered across different sections of the ship. Each node is in a separate area connected by ventilation shafts — crawl through the vents to reach each one. Activate all 3.",
      "Section 3 — Rotating Airlocks: The ship has sections that rotate on a timer. Watch the ceiling indicators — they flash before the room rotates. Time your movement through each rotating section during the still window.",
      "Section 4 — Scorn Infestation: The lower decks are overrun with Scorn. Fight through Raiders, Lurkers, and two Scorn Chieftains to reach the bridge elevator.",
      "Final Boss — Katabasis (Scorn Chieftain): Katabasis fires a tracking projectile that homes onto you. Dodge behind pillars immediately when you see it launch — never dodge in open space. During the vulnerable phase (when his shield drops), dump all your damage into him. Heavy ammo priority. Repeat 3 damage phases.",
      "Open the chest on the bridge. Dead Man's Tale is your reward. Solo completions have a weekly chance to drop a curated roll.",
    ],
    tip:"Dead Man's Tale has one of the most distinct exotic perks in the game (stacking precision hits increase fire rate). The solo clear bonus gives you better roll chances — attempt it solo once you're confident with the rotating sections." },

  { name:"Harbinger", cat:"exotic", reward:"Hawkmoon (Exotic Hand Cannon)", expansion:"Season of the Hunt",
    power:"1300+ recommended", players:"1–3",
    source:"Pick up 'Bird of Prey' quest from Crow in the Tower (Annex area, right side). He appears after completing the Season of the Hunt intro quest.",
    color:C.gold,
    steps:[
      "Accept 'Bird of Prey' from Crow in the Tower Annex.",
      "Travel to the EDZ. The mission marker sends you to Harbinger's Seclude in the southern EDZ.",
      "Enter the cave system. As you push through, 5 golden Feathers are hidden throughout the mission area. They glow gold and emit an audio tone when you're within 10 meters.",
      "Feather Locations: (1) In the first open cave chamber, on a ledge to the left. (2) Above the waterfall in the second section — jump up the cliffside. (3) In the mid-mission ravine, behind a large boulder on the right. (4) Inside the Taken bubble room, on the raised platform. (5) Right before the boss room, tucked in the left alcove.",
      "Fight through Taken patrols. The mission has no timer — explore thoroughly for all Feathers.",
      "Boss — Savek, Eyes of Malice (Taken Captain): Void shields. Use a Void Energy weapon to break shields fast — the explosion from breaking shields staggers nearby adds. Standard Taken Captain fight after the shield is down.",
      "Return to Crow in the Tower with all 5 Feathers collected. Hawkmoon is your reward.",
    ],
    tip:"If you miss a Feather, you can replay Harbinger as many times as needed. The Feathers carry over between runs — you don't lose progress. The mission is replayable weekly for Hawkmoon rolls." },

  { name:"Operation: Seraph's Shield", cat:"exotic", reward:"Revision Zero (Exotic Pulse Rifle)", expansion:"Season of the Seraph",
    power:"1550+ recommended", players:"Solo or 1–3",
    source:"Director → Pinnacle Ops → Operation: Seraph's Shield.",
    color:C.arc,
    steps:[
      "Launch from Pinnacle Ops. You board an orbital Warmind station above Earth.",
      "Section 1 — Warmind Bunker: Navigate through the bunker entrance. Find 2 yellow Warmind consoles and activate them to disable the initial security lockdown.",
      "Section 2 — Station Exterior: Exit onto the station hull. Precision platforming required across exposed girders with Earth visible below. Fall = reset to last checkpoint. The path is marked by yellow Warmind light panels.",
      "Section 3 — Core Override: Find 3 Warmind Core fragments inside the station. Each is in a separate locked room — activate the security panel outside each room (requires killing the nearby Hive Wizard to drop the access key).",
      "Bring all 3 Cores to the central override console. Interact to bypass security.",
      "Boss — Akelous, The Siren's Current (Vex Hydra variant): Akelous has a unique shield — she faces it FORWARD, so her eye is protected from the front. Flank her to either side and shoot her directly. She spins to face you — sidestep constantly while shooting. During adds waves, keep distance and use the pillars for cover. Damage her from the flanks in all 3 phases.",
      "Loot the final chest. Revision Zero drops here. Weekly replays grant crafting pattern progress.",
    ],
    tip:"Revision Zero has a secret alternate fire mode — aiming down sights charges a burst shot. The charged shot is exceptionally powerful against champions and bosses. Unlock the catalyst to fully enable this mode." },

  { name:"Warlord's Ruin — Buried Bloodline Secret", cat:"exotic", reward:"Buried Bloodline (Exotic Shotgun)", expansion:"Season of the Wish",
    power:"1800+ recommended", players:"1–3 (dungeon)",
    source:"Launch Warlord's Ruin dungeon from the Director. The secret quest is hidden inside — it does NOT appear in your Quest log until you find the trigger.",
    color:C.void,
    steps:[
      "Enter Warlord's Ruin dungeon. Play through normally until you reach the first waterfall room (before the first encounter).",
      "Look for a breakable wall behind the main waterfall. It blends with the environment — shoot it with any weapon to reveal a hidden passage.",
      "Follow the hidden path behind the wall. A short platforming sequence leads to a sealed chamber.",
      "Inside the chamber: interact with the 'Warden's Thorn' artifact. This starts the hidden Buried Bloodline questline.",
      "Now complete the dungeon normally. In EACH of the 3 encounters, a second hidden 'Warden's Thorn' is concealed somewhere in the encounter arena. Find and interact with each one before completing the encounter.",
      "Encounter 1 Thorn location: On the upper ledge, right side of the arena, behind the large pillar.",
      "Encounter 2 Thorn location: In the flooded lower section, submerged behind the far left wall.",
      "Encounter 3 (Riven) Thorn location: On the back wall of the boss chamber, behind the crystal formation on the right.",
      "After collecting all 3 Thorns and completing the final boss, a hidden altar appears near the chest. Interact with it. Buried Bloodline drops here.",
    ],
    tip:"Buried Bloodline has the Devour perk (kills restore health and extend duration). Combined with Void subclass, it creates a self-sustaining health loop — every shotgun kill heals you to full. Exceptional for solo dungeon content." },

  { name:"Oblation: Bloodline (Monument of Triumph)", cat:"exotic", reward:"Cull's Shadow (Exotic Auto Rifle)", expansion:"Monument of Triumph · Jun 2026",
    power:"1950+ recommended", players:"Solo (unlock) then mission",
    source:"Equip a Weapon of Sorrow (Thorn, Osteo Striga, Necrochasm, or Touch of Malice) and run the Scarlet Keep Strike on the Moon.",
    color:C.red,
    steps:[
      "Equip any Weapon of Sorrow: Thorn, Osteo Striga, Necrochasm, or Touch of Malice. These are the only weapons that trigger the unlock.",
      "Launch the Scarlet Keep Strike from the Moon patrol zone (not Nightfall — the base strike).",
      "At the bottom of the first descent into the Scarlet Keep, look for a chamber that is normally sealed. With a Weapon of Sorrow equipped, the seal breaks and the chamber opens. Enter it.",
      "Interact with the Hive altar inside the hidden chamber. This starts the Oblation questline and adds the first quest step.",
      "Return to Moon patrol. Three secret data caches appear as new map markers across the Moon. Visit each cache location and interact with them. Enemies spawn at each cache — kill them all before the cache becomes accessible.",
      "With all 3 caches collected, Oblation: Bloodline becomes accessible in Pinnacle Ops (it does NOT appear as a map icon — open the Director and look in Pinnacle Ops).",
      "Complete the Oblation: Bloodline mission — it has 5 sections through the Scarlet Keep with new elite Hive enemy variants. Stay mobile — the new enemies apply a Void curse debuff on hit.",
      "Cull's Shadow drops on completion. Run Oblation: Soulfed and Oblation: Immolation for all 4 catalysts.",
    ],
    tip:"Cull's Shadow's exotic perk reads enemy health bars and increases damage as enemies get lower. It effectively gets stronger on every kill. The final catalyst from Immolation makes it one-shot minors at max stacks — exceptional for clearing large rooms." },

  // ── CAMPAIGN QUEST CHAINS ──
  { name:"A Guardian Rises (New Light)", cat:"campaign", reward:"Access to the full base game", expansion:"Free to Play",
    power:"Any", players:"Solo",
    source:"Automatically begins when you create a new character.",
    color:C.green,
    steps:[
      "Complete the intro mission on the Cosmodrome — follow Shaw Han and learn basic movement, combat, and abilities.",
      "Unlock the Director and visit the Tower for the first time. Meet Zavala, Shaxx, the Drifter, Ikora, and Tess Everis.",
      "Pick up introductory quests from each vendor — they guide you through basic Strike, Crucible, and Gambit.",
      "Complete the seasonal New Light content Shaw Han assigns on the Cosmodrome.",
      "Once the base quest is done, choose any expansion campaign to continue. Recommended order: Shadowkeep → Beyond Light → Witch Queen → Lightfall → The Final Shape.",
    ],
    tip:"Don't try to do everything at once in New Light. Focus on completing one expansion campaign at a time. The Power level raises naturally through campaign play." },

  { name:"Shadowkeep Campaign — Veil of Darkness", cat:"campaign", reward:"Pit of Heresy dungeon, Nightmare Hunts, access to Garden of Salvation raid", expansion:"Shadowkeep",
    power:"750+ (legacy)", players:"Solo",
    source:"Talk to Eris Morn on the Moon. She gives you 'A Mysterious Disturbance' to begin.",
    color:"#94a3b8",
    steps:[
      "Accept 'A Mysterious Disturbance' from Eris Morn on the Moon.",
      "Complete 8 campaign missions on the Moon — they follow a linear order from your quest log.",
      "Key missions: The Scarlet Keep (assault the tower), Depth of Power (fight Nightmares), The Deathbringer (exotic quest branch — pickup optional), In the Deep (boss fight at the base of the Keep).",
      "After the campaign, unlock Nightmare Hunts — weekly rotating missions hunting specific Nightmare bosses for upgrades.",
      "Pit of Heresy dungeon unlocks after campaign completion — enter it for unique armor and the dungeon exotic (Xenophage, if you complete the hidden questline inside).",
      "Garden of Salvation raid is the endgame — 6-player, requires a coordinated fireteam.",
    ],
    tip:"The Deathbringer exotic quest branches off during Shadowkeep — it's a Void rocket launcher. Pick up 'Memory of Sai Mota' from Eris mid-campaign. Don't skip it." },

  { name:"Beyond Light Campaign — Empire's Fall + Born in Darkness", cat:"campaign", reward:"Stasis subclass for all 3 classes", expansion:"Beyond Light",
    power:"1100+ (legacy)", players:"Solo",
    source:"Travel to Europa. Variks gives you 'The Dark Priestess' to begin.",
    color:C.stasis,
    steps:[
      "Accept 'The Dark Priestess' from Variks on Europa.",
      "Complete 8 campaign missions on Europa. The campaign follows Eramis, the Fallen Kell, as she weaponizes Stasis.",
      "Final campaign boss — Eramis: Fight her in the Riis-Reborn Approach. She uses Stasis attacks. Dodge her large ice projectiles by strafing sideways — they are slow but large. Stay mobile and shoot during her pauses between attacks. 3 phases.",
      "After the campaign: visit the Exo Stranger. She gives you 'Born in Darkness Part 1' — this is the Stasis unlock quest chain.",
      "Born in Darkness Part 1–4: Each part requires completing specific Europa activities with Stasis equipped. Part 1: kill 50 enemies with Stasis. Part 2: complete Exo Challenges and collect Entropic Shards. Part 3: complete specific strikes and patrol activities. Part 4: hunt Nightmares on Europa.",
      "Each completed Part unlocks new Stasis Aspects and Fragments for your class.",
      "Deep Stone Crypt raid unlocks — the endgame 6-player activity for this expansion.",
    ],
    tip:"The Entropic Shards in Born in Darkness Part 2 require the Salvation's Grip grenade launcher to break. Get Salvation's Grip first (quest from the Drifter after the campaign) before starting Part 2." },

  { name:"The Witch Queen Campaign — The Arrival", cat:"campaign", reward:"Weapon Crafting system, Glaive weapon type, Vow of the Disciple raid", expansion:"The Witch Queen",
    power:"1350+ (legacy)", players:"Solo — Legendary difficulty recommended",
    source:"Speak to Ikora Rey in the Tower. She gives you 'The Arrival' when you own the expansion.",
    color:C.void,
    steps:[
      "Speak to Ikora in the Tower. Accept 'The Arrival'.",
      "Travel to Savathun's Throne World. Complete 8 campaign missions following Savathun's deception plot.",
      "Key mission: 'The Mirror' — build a weapon at the Enclave on Mars. This is your first crafting experience. Follow the prompts to understand the red border / Deepsight system.",
      "Campaign bosses include Savathun's Lucent Hive — they can resurrect unless you stomp on their Ghost after killing them. Always stomp the floating Ghost immediately after a Lucent Hive boss dies.",
      "After the campaign: The Enclave on Mars fully unlocks. Start collecting red border weapons across all activities.",
      "'The Wellspring' activity unlocks on Savathun's Throne World — rotating activity that drops craftable weapons and throne world gear.",
      "Vow of the Disciple raid is the endgame — mechanically complex, requires communication. Great exotic: Lubrae's Ruin (Void trace rifle from final boss secret chest).",
    ],
    tip:"Play The Witch Queen on Legendary difficulty if you can. It rewards you with gear that immediately puts you at the expansion's soft cap Power level — saving hours of grinding. The story is also significantly better on Legendary with extra dialogue." },

  { name:"Lightfall Campaign — Mayday", cat:"campaign", reward:"Strand subclass for all 3 classes, Final Warning exotic sidearm", expansion:"Lightfall",
    power:"1600+ recommended", players:"Solo",
    source:"Launch 'Mayday' from the Director after purchasing Lightfall. Begins automatically when you reach Neomuna.",
    color:C.strand,
    steps:[
      "Land on Neomuna (Neptune). The campaign begins with 'Mayday'.",
      "Complete 8 campaign missions. The story follows Calus attacking Neomuna with the Shadow Legion.",
      "Strand unlocks mid-campaign — you'll experience it first during 'The Rescue' mission when crossing the Veil barrier.",
      "After fully unlocking Strand, complete 'The Final Strands' quest from Nimbus on Neomuna. This gives you your first Strand Aspects and Fragments.",
      "Final campaign boss — Calus, Disciple of the Witness: 3-phase fight on the Typhon Imperator ship. Solar damage recommended. Phase 1: survive the arena while shooting the weak points that appear on his back. Phase 2: navigate across the ship's exterior while he pursues. Phase 3: sustained DPS on his head and shoulder weak points.",
      "After the campaign, complete Nimbus's follow-up quest to receive Final Warning (Exotic Strand Sidearm — one of the best weapons in the game).",
      "Root of Nightmares raid unlocks — the endgame 6-player, most accessible raid in the game for beginners.",
    ],
    tip:"Final Warning has Strand-based homing rounds that track enemies. Its exotic perk essentially removes the need to aim precisely at agile targets. It pairs exceptionally well with any Strand subclass build." },

  { name:"The Final Shape Campaign — Transmigration", cat:"campaign", reward:"Prismatic subclass for all 3 classes, Exotic Class Items", expansion:"The Final Shape",
    power:"1800+ recommended", players:"Solo — Legendary recommended",
    source:"Launch 'Transmigration' from the Director. Available after purchasing The Final Shape.",
    color:C.prismatic,
    steps:[
      "Launch 'Transmigration' from the Director.",
      "Enter The Pale Heart (inside The Traveler). Complete 10 campaign missions — the conclusion of the Light vs Darkness story.",
      "Prismatic subclass unlocks during the campaign — you receive it during 'Alone in the Dark' mission when you reach the Pale Heart's core.",
      "After unlocking Prismatic, complete 'Alone in the Dark' to receive your first class-specific Prismatic Aspects and Fragments.",
      "Final boss — The Witness (solo version): Epic encounter across 3 phases inside a Traveler-fragment arena. Phase 1: destroy 4 pylons around the arena while avoiding beam attacks. Phase 2: platform across collapsing Traveler geometry while dealing damage. Phase 3: sustained DPS phase — use everything you have. This is the most important DPS check in the entire game.",
      "Post-campaign: 'Dual Destiny' exotic mission unlocks — requires exactly 2 players with Prismatic. Rewards an Exotic Class Item with random exotic perk combinations.",
      "Salvation's Edge raid unlocks — the hardest, most mechanically complex raid ever made in Destiny 2.",
    ],
    tip:"The Exotic Class Items from Dual Destiny roll with 2 random exotic armor perks from your class's pool — combined on one item. Some combinations are build-defining (Synthoceps + Inmost Light on Titan, Getaway Artist + Fallen Sunstar on Warlock). Farm it." },

  { name:"Forsaken Campaign — Nothing Left to Say", cat:"campaign", reward:"Access to Dreaming City, Shattered Throne dungeon, Forsaken exotics", expansion:"Forsaken",
    power:"750+ (legacy)", players:"Solo",
    source:"Speak to Spider in the Tangled Shore. 'Nothing Left to Say' begins after the intro mission.",
    color:C.orange,
    steps:[
      "Accept 'Nothing Left to Say' from Spider in the Tangled Shore.",
      "Complete 8 campaign missions across the Tangled Shore and Dreaming City. The story follows Cayde-6's death at the hands of Uldren Sov and your hunt for the 8 Barons.",
      "Baron hunts: each mission targets a specific Baron from the Scorn. Each Baron has a unique mechanic — the Hangman uses rope-swinging attacks, the Mindbender summons Nightmares, the Rifleman fights from a distance with a sniper, etc. Learn each Baron's pattern before going aggressive.",
      "Final mission — The Mad Prince: Hunt Uldren Sov in the Watchtower. He summons Taken projectile barrages and has regenerating shields. When he goes immune, destroy the Taken crystals that appear around the arena to drop the shield. 3 phases.",
      "After the campaign, Dreaming City unlocks — a patrol zone with a 3-week curse cycle that changes enemy density and rewards each week.",
      "Shattered Throne dungeon unlocks inside Dreaming City — only accessible during certain curse weeks. Check the curse cycle before attempting.",
      "Forsaken exotic quests unlock from Spider and Petra Venj.",
    ],
    tip:"The Dreaming City curse cycle (week 1 light, week 2 medium, week 3 heavy curse) changes what drops and what encounters are available. The Shattered Throne dungeon and some secrets are only accessible during heavy curse week." },

  { name:"The Edge of Fate Campaign", cat:"campaign", reward:"Desert Perpetual raid, Pantheon difficulty system, Tier 4–5 armor, new subclass aspects", expansion:"The Edge of Fate · Jul 2025",
    power:"2000+ recommended", players:"Solo — Legendary recommended",
    source:"Launch from the Director after purchasing The Edge of Fate. Campaign begins automatically at the new destination.",
    color:C.blue,
    steps:[
      "Launch the campaign from the Director. The Edge of Fate takes place in a new destination revealed through the Edge of Fate prophecy from Renegades lore.",
      "Complete 9 campaign missions. The story continues the post-Final Shape universe with new Vanguard leadership under Ikora.",
      "New enemy types are introduced mid-campaign — modified Vex with Darkness-infused cores. They have Stasis shields (blue) in addition to standard Void. Bring mixed element loadouts.",
      "The campaign introduces the Tier 5 armor system through tutorial missions — you earn your first Tier 5 piece mid-campaign.",
      "After completing the campaign: the Pantheon modifier system unlocks. Pantheon lets you add modifier cards to any raid or dungeon to increase difficulty and rewards.",
      "Desert Perpetual raid unlocks as the expansion endgame. It has 5 encounters and awards Tier 4–5 armor on completion. Master difficulty gives Tier 5.",
      "Complete the post-campaign quest 'Aftermath' from Ikora to receive your new subclass Aspects for all classes.",
    ],
    tip:"The Pantheon system is one of the deepest difficulty customization tools in Destiny history. Stack modifier cards to increase Tier drops — the right modifier combo can make any raid drop Tier 5 gear without doing Master difficulty." },

  { name:"Renegades Campaign — Lawless Frontier", cat:"campaign", reward:"Lawless Frontier destinations (Mars, Venus, Europa), Equilibrium dungeon, Renegades exotic weapon", expansion:"Renegades · Dec 2025",
    power:"2020+ recommended", players:"Solo",
    source:"Speak to the Drifter at Tharsis Outpost on Mars. 'The Arrangement' begins the campaign.",
    color:C.red,
    steps:[
      "Travel to the Tharsis Outpost on Mars — the new social hub replacing part of the Tower's role for this expansion.",
      "Speak to the Drifter. Accept 'The Arrangement' to begin. Eris Morn and Praxic Warlock Aunor Mahal join as key NPCs.",
      "Complete 10 campaign missions tracking Dredgen Bael — a former Guardian turned villain — across Mars, Venus, and Europa.",
      "Key mechanic: the Renegades factions (Cabal Barant Imperium, Fallen Oathbreakers, Vex Recursion) each control territory in the Lawless Frontier. Different missions have you working with or against each faction.",
      "Mid-campaign: you earn access to the Lawless Frontier territories. Unlike patrol zones, each territory has 2 selectable mission-style areas with bounties — no free roam.",
      "Final boss — Dredgen Bael: Corrupted Guardian with a full Guardian ability set. He uses Golden Gun, Void suppression, and Stasis freezing. Counter each ability: dodge the Golden Gun shot (single projectile, predictable), break out of Stasis by meleeing, and use Barrier Champions as cover during the Void suppression phase.",
      "After campaign completion: Equilibrium dungeon unlocks on Venus. Complete it for the expansion's pinnacle armor.",
      "The Renegades exotic weapon quest unlocks from each of the 3 faction leaders — completing all 3 and doing the final Oblation-style exotic mission rewards the expansion's signature exotic.",
    ],
    tip:"Renegades is the final expansion before Monument of Triumph. After completing it, the full Lawless Frontier territory system gives you an entirely new repeatable loop separate from the main game's Pathfinder. Farm the Equilibrium dungeon for the last batch of Tier 5 armor before the final sandbox locked in June 2026." },,

  // ── MORE EXOTIC MISSIONS ──
  { name:"Malfeasance", cat:"exotic", reward:"Malfeasance (Exotic Hand Cannon — bonus damage to Taken)", expansion:"Forsaken",
    power:"Any", players:"1–3",
    source:"Trigger by defeating the Ascendant Primeval Servitor that randomly spawns in Gambit matches.",
    color:"#e87800",
    steps:[
      "Play Gambit until an Ascendant Primeval Servitor spawns as the Primeval boss. This is random — keep playing.",
      "Defeat it. All players who deal damage receive the 'Seething Heart' quest item.",
      "Step 1: Kill 25 Taken bosses or elites across any activity. Blind Well in Dreaming City is fastest.",
      "Step 2: Earn 500 Gambit points through kills, banking motes, and invading.",
      "Step 3: Bank 200 Motes in Gambit without dying. Use small deposits of 5 at a time to stay safe.",
      "Step 4: Kill 25 Taken in a fireteam of 3.",
      "Return to the Drifter in the Tower. Malfeasance is awarded.",
    ],
    tip:"Malfeasance staggers and does bonus damage to all Taken. Best PvE hand cannon for Last Wish raid and Dreaming City content." },

  { name:"Wish-Ender", cat:"exotic", reward:"Wish-Ender (Exotic Bow — see through walls and shields)", expansion:"Forsaken",
    power:"750+ (legacy)", players:"1–3",
    source:"Find the hidden Wishing Well area behind the waterfall in Harbinger's Seclude, Dreaming City.",
    color:"#f59e0b",
    steps:[
      "Go to Harbinger's Seclude in Dreaming City. Climb the rock path behind the main waterfall to the Wishing Well.",
      "Loot the chest to get the Wishing Well Bow (temporary quest weapon).",
      "Enter Shattered Throne dungeon with the bow equipped.",
      "Find and shoot 3 Trueshot targets: glowing Taken symbols on walls. Stand on the matching glowing floor ring for each.",
      "Trueshot 1: Above the first encounter arena wall. Trueshot 2: Labyrinth corridor ceiling. Trueshot 3: Room before final boss.",
      "Complete Shattered Throne fully — defeat Vorgeth and Dul Incaru.",
      "Return to Wishing Well and open the final chest. Wish-Ender is yours.",
    ],
    tip:"Wish-Ender shows enemies and Barrier Champions through solid walls. Fire through walls into enemy positions without exposing yourself — exceptional for any room-clearing or champion encounter." },

  { name:"Deathbringer", cat:"exotic", reward:"Deathbringer (Exotic Void Rocket — rains void orbs)", expansion:"Shadowkeep",
    power:"750+ (legacy)", players:"Solo",
    source:"Speak to Eris Morn on the Moon during or after Shadowkeep campaign. Quest: 'Memory of Sai Mota'.",
    color:"#a855f7",
    steps:[
      "Speak to Eris on the Moon. Accept 'Memory of Sai Mota'.",
      "Kill 10 Nightmares on the Moon using only Void abilities (grenade, melee, or super). Nightmare Hunts are fastest.",
      "Return to Eris. Pick up and complete 'Faculties of the Skull' mission.",
      "Complete 'Of Darkest Harmony' solo mission in the Scarlet Keep (~10 minutes). Ends with a Nightmare boss.",
      "Deathbringer drops on completion.",
    ],
    tip:"Fire Deathbringer HIGH above dense enemy groups. The void orbs spawn at the impact point then fall — the further they fall, the more damage they deal. Maximum fall distance does massive damage to everything below." },

  { name:"Xenophage", cat:"exotic", reward:"Xenophage (Exotic Solar Machine Gun — explosive rounds)", expansion:"Shadowkeep",
    power:"750+ (legacy)", players:"1–3",
    source:"Find 4 runes inside Pit of Heresy dungeon before the first encounter and shoot each with the matching element.",
    color:"#ef4444",
    steps:[
      "Enter Pit of Heresy dungeon on the Moon.",
      "Before the first encounter, find 4 large rune symbols on the walls. Shoot each with the correct element: Arc = rune 1, Solar = rune 2, Void = rune 3, Kinetic = rune 4.",
      "A hidden path opens. Pick up the 'Emergence' quest item inside.",
      "Complete all 3 encounters and defeat Zulmak (final boss) to finish Pit of Heresy.",
      "Kill 50 Hive Wizards (Altar of Sorrow on the Moon spawns them constantly).",
      "Complete 'The Pathfinder' mission on Mercury via Pinnacle Ops in the Director.",
      "Xenophage drops on completion.",
    ],
    tip:"Xenophage's explosive rounds deliver maximum damage instantly with zero travel time. It is one of the best heavy weapons for stationary bosses — every round hits at full power the moment you pull the trigger." },

  { name:"The Lament", cat:"exotic", reward:"The Lament (Exotic Solar Chainsaw Sword)", expansion:"Beyond Light",
    power:"1100+ (legacy)", players:"Solo",
    source:"Complete Beyond Light campaign then speak to Banshee-44 in the Tower. Quest: 'Lost Lament'.",
    color:"#f97316",
    steps:[
      "Complete Beyond Light campaign.",
      "Visit Banshee-44 in the Tower Annex and accept 'Lost Lament'. (Missing? Check the Quest Archive kiosk.)",
      "Find 3 Dead Exo bodies on Europa (glow blue): one in Bray Exoscience, one in Eventide Ruins, one in Creation.",
      "Kill 100 Vex on Europa using any sword.",
      "Complete 'The Glassway' base strike on Europa (the patrol map version, not the Nightfall).",
      "Complete 'Reforging the Past' solo mission from Banshee (approximately 15 minutes).",
      "The Lament drops on completion of 'Reforging the Past'.",
    ],
    tip:"Hold block then immediately attack to rev The Lament into chainsaw mode. Revved attacks deal 3–4x more damage than standard swings. Learn the rev-release rhythm for boss encounters — it is dramatically more effective than normal sword swings." },

  { name:"Parasite", cat:"exotic", reward:"Parasite (Exotic GL — damage scales with Hive kills)", expansion:"The Witch Queen",
    power:"1350+ (legacy)", players:"1–3",
    source:"Complete The Witch Queen campaign then speak to Fynch in Savathun's Throne World. Quest: 'Of Queens and Worms'.",
    color:"#4ade80",
    steps:[
      "Complete The Witch Queen campaign.",
      "Speak to Fynch (patrol vendor in Throne World) and accept 'Of Queens and Worms'.",
      "Collect 8 Worm Offerings hidden across Savathun's Throne World — they glow green and play an audio cue when you're within range.",
      "Complete 3 Altars of Reflection patrol events in the Throne World.",
      "Complete 'The Ghosts' story mission (approximately 20 minutes).",
      "Parasite drops on mission completion.",
    ],
    tip:"Kill 20+ Hive enemies then immediately fire Parasite at a boss — the explosion damage scales directly with your recent Hive kill count and can one-phase most raid bosses with proper setup." },

  { name:"Conditional Finality", cat:"exotic", reward:"Conditional Finality (Exotic Shotgun — freezes AND ignites, counters 2 champion types)", expansion:"Root of Nightmares",
    power:"1800+ recommended", players:"6-player raid",
    source:"Random drop from Nezarec, the final boss of Root of Nightmares raid.",
    color:"#38bdf8",
    steps:[
      "Assemble a 6-player fireteam and launch Root of Nightmares from the Director.",
      "Complete all 4 encounters: Cataclysm, Scission, Macrocosm, and Nezarec (final boss).",
      "Conditional Finality drops randomly from Nezarec's chest at approximately 10-15% per clear.",
      "Weekly lockout applies — run on all 3 characters for triple the chances each week.",
      "If no drop after several weeks: spend Spoils of Conquest (earned from encounter chests) at the Root of Nightmares exotic kiosk in the Tower to focus for it.",
    ],
    tip:"Left barrel freezes (Stasis) and right barrel ignites (Solar). Both barrels hitting the same target simultaneously creates a devastating shatter-ignition explosion and counters BOTH Barrier and Unstoppable Champions in a single shot — no other weapon in the game does this." },

  { name:"Ergo Sum", cat:"exotic", reward:"Ergo Sum (Exotic Prismatic Sword — choose your element blade)", expansion:"The Final Shape",
    power:"1800+", players:"Solo",
    source:"Guaranteed from The Final Shape Legendary campaign completion. Also available as a world drop from Pale Heart activities.",
    color:"#e879f9",
    steps:[
      "Fastest guaranteed method: complete The Final Shape campaign on Legendary difficulty. Ergo Sum is in the final campaign reward chest.",
      "Alternatively farm Pale Heart patrol, lost sectors, and Final Shape strikes for a world drop (random chance).",
      "Take Ergo Sum to the Enclave on Mars and Reshape it — choose your blade element.",
      "Blade options: Splinter of Light (Solar kills), Splinter of Dark (Stasis heavy attack), Splinter of Strand (Threadling spawns), Splinter of Void (Devour on kill).",
      "Match the blade to your Prismatic build's primary element for maximum synergy.",
    ],
    tip:"Ergo Sum directly charges your Transcendence meter with kills due to its Prismatic nature. It is one of the fastest Transcendence-charging weapons in the game — essential for Prismatic builds that need frequent Transcendence windows." },

  { name:"Ager's Scepter", cat:"exotic", reward:"Ager's Scepter (Exotic Stasis Trace Rifle — free max power when Super is full)", expansion:"Season of the Lost",
    power:"1300+ (legacy)", players:"Solo",
    source:"Visit the H.E.L.M. seasonal hub from the Director. Find Mara Sov's room and pick up 'A Hollow Coronation'.",
    color:"#38bdf8",
    steps:[
      "Open the Director and access the H.E.L.M. Find Mara Sov's area and accept 'A Hollow Coronation'.",
      "Tracing the Stars I: Collect 4 Atlas Skews (floating blue crystals) in Dreaming City — one each in Harbinger's Seclude, Divalian Mists, Rheasilvia, and Spine of Keres.",
      "Tracing the Stars II: Collect 4 more Atlas Skews in Dreaming City and complete 3 Blind Well encounters.",
      "Tracing the Stars III: Collect 3 Atlas Skews during Dreaming City Week 3 (heavy curse) and complete 'The Shattered Realm' mission.",
      "Return to Mara Sov. Complete the final ceremony mission. Ager's Scepter is awarded.",
      "Farm the Catalyst for 'Superior Scepter' — fires at maximum power for free when your Super is full.",
    ],
    tip:"With the Catalyst: when your Super is completely full, Ager's Scepter fires at maximum power without draining any Super energy. Keep your Super charged before every engagement for free max-damage Stasis beams." },

  { name:"Vexcalibur", cat:"exotic", reward:"Vexcalibur (Exotic Void Glaive — team overshield)", expansion:"Season of Defiance",
    power:"1750+ recommended", players:"1–3",
    source:"Hidden secret mission. Find the SIVA terminal inside a crashed plane fuselage in the Cosmodrome Mothyards patrol area.",
    color:"#a855f7",
    steps:[
      "Go to the Cosmodrome patrol zone and navigate to the Mothyards (northeast area near the large crashed planes).",
      "Search inside the crashed plane fuselages for a red-glowing SIVA-covered terminal. Interact with it to launch '/node.ovrd.AVALON'.",
      "Complete the AVALON secret mission through its Vex digital-space environments.",
      "Boss: A Vex Mind with 3 floating shield generator cubes surrounding it. Destroy all 3 before the core is vulnerable. Repeat 3 times.",
      "Vexcalibur drops from the completion chest.",
      "Run AVALON on Master difficulty for Catalyst upgrade materials to unlock all 3 exotic perks.",
    ],
    tip:"Vexcalibur generates an overshield that extends to nearby teammates. In a Well of Radiance with Vexcalibur active, your whole fireteam has both Well buffs AND the overshield simultaneously — making the team functionally invincible during raid DPS phases." },

  { name:"Euphony", cat:"exotic", reward:"Euphony (Exotic Strand Linear Fusion Rifle — spawns Threadlings)", expansion:"Season of the Wish",
    power:"1900+ recommended", players:"1–3",
    source:"Complete the Season of the Wish story quest with Riven (multi-week quest). Then complete 'What Remains' followup.",
    color:"#4ade80",
    steps:[
      "Complete the Season of the Wish main story quest — given by Riven in the Last Wish raid area, progresses across multiple weekly quest steps.",
      "After story completion, Riven gives you 'What Remains'.",
      "Complete 5 runs of The Coil on Legend difficulty (roguelite seasonal activity from the Director).",
      "Collect 10 Wishes as drops from the Coil's final bosses.",
      "Return to Riven for a final conversation. Euphony drops from the reward chest.",
    ],
    tip:"Euphony spawns Strand Threadlings on precision hits and deals bonus damage to Suspended targets. On a Broodweaver Warlock with Swarmers, the Threadlings fight independently while you focus on surviving — it practically plays itself." },

  // ── SIDE QUESTS ──
  { name:"Salvation's Grip — Required for Stasis Aspects", cat:"key", reward:"Salvation's Grip (Exotic Stasis GL — REQUIRED to break Entropic Shards)", expansion:"Beyond Light",
    power:"1100+ (legacy)", players:"Solo",
    source:"Complete Beyond Light campaign. Visit the Drifter in the Tower Annex. Quest: 'The Stasis Prototype'.",
    color:"#38bdf8",
    steps:[
      "Complete Beyond Light campaign.",
      "Visit the Drifter in the Tower Annex and accept 'The Stasis Prototype'.",
      "Kill 50 Fallen on Europa using Stasis abilities (grenade, melee, or super).",
      "Collect 10 Energized Ether by killing Fallen Captains on Europa (approximately 50% drop rate).",
      "Complete the Concealed Void Lost Sector on Europa.",
      "Return to the Drifter. Salvation's Grip is awarded.",
      "IMPORTANT: You NEED Salvation's Grip to break Entropic Shards during Born in Darkness Part 2. Get this weapon FIRST before attempting that quest step.",
    ],
    tip:"Salvation's Grip creates Stasis crystals on impact — useful for building immediate cover, blocking enemy movement, and setting up Behemoth Titan shatter combos. Keep it in your vault permanently." },

  { name:"Unlock All Strand Aspects — All 3 Classes", cat:"key", reward:"All 3 Strand Aspects for your class (Lightfall)", expansion:"Lightfall",
    power:"1600+", players:"Solo",
    source:"Complete Lightfall campaign then speak to Nimbus on Neomuna. Quest: 'The Final Strands'.",
    color:"#4ade80",
    steps:[
      "Complete the Lightfall campaign.",
      "Speak to Nimbus on Neomuna and accept 'The Final Strands'.",
      "First Aspect: Kill 10 Unstable Strand enemies on Neomuna — they appear as orange-glowing versions of normal Neomuna enemies.",
      "Second Aspect: Complete 5 Terminal Overload events on Neomuna and collect the event key each time for the bonus chest.",
      "Third Aspect: Complete 3 Partition missions found in the Terminal Overload area after the event ends.",
      "Return to Nimbus after each step for each Aspect.",
    ],
    tip:"All 3 Aspects are essential for a functional Strand build. Each class's unique Aspects are where the real power comes from: Drengr's Lash (Titan barricade burst), Mindspun Invocation (Warlock Threadling grenades), and Threaded Specter (Hunter decoy on dodge)." },

  { name:"Craft Your First Glaive (Witch Queen)", cat:"key", reward:"Any craftable Glaive weapon from The Witch Queen", expansion:"The Witch Queen",
    power:"1350+", players:"Solo",
    source:"Complete The Witch Queen campaign. The Enclave on Mars unlocks at the end of the campaign.",
    color:"#c084fc",
    steps:[
      "Complete The Witch Queen campaign. The Enclave on Mars unlocks automatically at the end.",
      "Visit the Enclave and complete 'The Relic' quest — it teaches the crafting system and gives your first crafted weapon.",
      "Farm red-border (Deepsight Resonance) Glaive weapons from the Wellspring activity or campaign mission replays on Throne World.",
      "Extract Deepsight Resonance from each red-border Glaive by getting kills with it equipped until the resonance bar fills completely.",
      "Once you have 5 copies of the same Glaive pattern extracted, craft it at the Enclave and select your perks.",
    ],
    tip:"The Glaive is the only weapon with a built-in shield — hold the block button while the launcher reloads to project a Void barrier blocking incoming fire. This makes Glaives uniquely powerful for aggressive solo content." },

  { name:"Dual Destiny — Exotic Class Item", cat:"key", reward:"Exotic Class Item (random 2-perk combo)", expansion:"The Final Shape",
    power:"1800+ recommended", players:"EXACTLY 2 — no solo, no 3+",
    source:"Complete The Final Shape campaign → 'Alone in the Dark' unlocks Dual Destiny as a mission in The Pale Heart patrol zone.",
    color:C.prismatic,
    steps:[
      "BOTH players must have Prismatic subclass unlocked. This is the only requirement.",
      "Both players enter The Pale Heart patrol zone. One player must have a Light-aligned subclass active (Solar, Arc, or Void in Prismatic counts if you have matching Aspects). One player must have a Dark-aligned subclass (Stasis or Strand Aspects in Prismatic).",
      "Navigate together to the hidden mission entrance — it's in the central-north area of the Pale Heart, marked by a floating Darkness pyramid symbol. Interact together.",
      "Puzzle rooms: each room requires one player to activate nodes on the Light side while the other shoots barriers on the Dark side — simultaneously. Communication is essential. Call out 'activating' and 'clear' for each room.",
      "Mid-mission encounter: a mirrored boss fight where each player fights their own version. Focus on YOUR boss — do not cross sides.",
      "Final boss: both players must simultaneously deal damage to opposite weak points on the boss's body. One player takes the left side, one takes the right. Coordinate your damage windows.",
      "Exotic Class Item drops at the end for BOTH players. Roll is completely random — 2 exotic perks from your class pool. Highly replayable.",
    ],
    tip:"The best rolls to chase: Hunter — Caliban's Hand + Gyrfalcon's Hauberk (invisibility loop). Titan — Spirit of Synthoceps + Spirit of Inmost Light (melee damage + ability regen). Warlock — Spirit of Getaway Artist + Spirit of Fallen Sunstar (Arc Soul + ability recharge). Farm until you get one of these." },

  { name:"In the Deep — Wicked Implement", cat:"key", reward:"Wicked Implement (Exotic Stasis Sniper Rifle)", expansion:"Season of the Deep",
    power:"1750+ recommended", players:"1–3",
    source:"Play the Deep Dive seasonal activity on Titan. The quest triggers automatically after your first Deep Dive run.",
    color:C.stasis,
    steps:[
      "Play the Deep Dive seasonal activity — it's accessible from the Titan patrol zone or the Director.",
      "After your first completion, Ahsa (the Titan whale NPC) gives you the 'In the Deep' quest.",
      "Collect 3 Strands of Memory: each drops from the final boss of a Deep Dive run. You need 3 separate completions to get all 3.",
      "Return all 3 Strands to Ahsa.",
      "The secret encounter unlocks: during a Tier 3 Deep Dive run, 3 glowing wells appear throughout the dive. All 3 must be activated simultaneously by 3 players (each standing at one well).",
      "If timed correctly, all 3 wells activate together and a hidden path opens below the final boss room.",
      "Follow the hidden path to a secret boss encounter. Defeat it and open the chest. Wicked Implement drops here.",
    ],
    tip:"The 3-player simultaneous well activation is the hardest part. Call out positions before the run: player 1 takes the first well (left corridor), player 2 takes the second well (center platform), player 3 takes the third well (right tunnel). Use voice comms and count down '3-2-1-activate'." },

  { name:"The Navigator — Strand Bow", cat:"key", reward:"The Navigator (Exotic Strand Glaive/Bow hybrid)", expansion:"Root of Nightmares",
    power:"1800+ recommended", players:"1–6 (raid/mission)",
    source:"Complete Root of Nightmares raid once. A secret quest item drops from the Explicator boss (second encounter) — not guaranteed, may require multiple runs.",
    color:C.strand,
    steps:[
      "Complete Root of Nightmares raid. During the Explicator encounter (second boss), look for a secret chest hidden in the back of the encounter arena after killing Explicator.",
      "If the quest item 'Nástroje Osudu' drops, pick it up. It starts 'At the Gates' quest in your Quest log.",
      "Complete the 'At the Gates' objectives: kill 100 enemies with Strand weapons, complete 5 Strand-related Seasonal Challenges, and complete Root of Nightmares once more.",
      "Return to the Hawthorn constellation in Root of Nightmares (the lore area between encounters). Interact with the terminal that now appears.",
      "The Navigator is awarded.",
    ],
    tip:"The Navigator fires Strand projectiles that create Threadling spawns on hit — it functionally generates Strand ability energy through weapon use alone. Exceptional on Threadrunner Hunter and Broodweaver Warlock builds." },

  // ── WEEKLY QUESTS ──
  { name:"Xenology — Weekly Exotic Cipher", cat:"weekly", reward:"1 Exotic Cipher (spend at Monument of Lost Lights)", expansion:"All",
    power:"Any", players:"Solo",
    source:"Pick up from Xûr in the Tower Bazaar every Friday at 10am PDT. Check his second inventory tab.",
    color:C.gold,
    steps:[
      "Visit Xûr in the Tower Bazaar every Friday (he's always in the alley to the right of the Ramen Shop in the Courtyard area — no longer rotates).",
      "Open his inventory. Go to his SECOND tab (not the main shop) and pick up the Xenology bounty. It's free.",
      "Complete the Xenology requirement: 21 Strikes (any difficulty) OR win Crucible or Gambit matches. Wins in Crucible/Gambit count for significantly more progress than losses.",
      "Once complete, Xenology becomes an 'Exotic Cipher' in your inventory.",
      "Take the Exotic Cipher to the Monument of Lost Lights in the Tower (between the vault terminals). Spend it to purchase any vaulted Exotic weapon you're missing.",
      "You can hold a maximum of 5 Exotic Ciphers at once. Don't let them pile up without spending.",
    ],
    tip:"The fastest Xenology completion is 21 Strike runs — take about 2 hours. Crucible wins count for ~3× the progress of Strike completions. If you're comfortable with Crucible, 7 wins completes Xenology faster than 21 Strikes." },

  { name:"Pathfinder — Weekly Progression Track", cat:"weekly", reward:"XP, reputation, Bright Dust, Engrams", expansion:"All",
    power:"Any", players:"Solo or fireteam",
    source:"Open the Director → Pathfinder tab (bottom of the screen). Available to all players.",
    color:C.teal,
    steps:[
      "Open the Director and select the Pathfinder tab at the bottom.",
      "The Pathfinder shows a branching tree of objectives. Each node is a challenge tied to a core playlist (Strikes, Crucible, Gambit) or seasonal activity.",
      "Complete objectives by playing the listed activities. Objectives auto-track — no need to 'equip' them like old bounties.",
      "Completing a node rewards XP toward your Artifact Power bonus.",
      "Reaching end nodes in a branch rewards larger loot (engrams, Bright Dust, seasonal materials).",
      "The Pathfinder resets every Tuesday at the weekly reset. Full completion each week maximizes your Artifact Power gain.",
    ],
    tip:"Stack Pathfinder with your normal farming. If Pathfinder asks for 10 Strike completions and you're farming Nightfall weapons anyway — you complete both simultaneously. Never do Pathfinder in isolation." },
];


// ─── RAIDS ────────────────────────────────────────────────────────────────────
const RAIDS = [
  { name:"Last Wish", expansion:"Forsaken", color:"#a855f7", status:"Active",
    power:"1350+ (legacy)", players:"6", encounters:6,
    encounterList:["Kalli, the Corrupted — kill adds to weaken boss, split in pairs to trigger damage phase","Shuro Chi — memorize repeating symbol pattern, shoot matching symbols across 3 platforms in sync","Morgeth, the Spirekeeper — carry Taken Strength orbs, 2 players max each hold 2, then DPS phase","The Vault — 3 players in vault solve grid puzzle while 3 outside kill Wyverns, swap every cycle","Riven of a Thousand Voices — shoot the glowing eye during her attacks, navigate through rooms split by goo floors","Queenswalk (Secret) — wish 4 on the Wall of Wishes after Riven for a secret lore encounter and chest"],
    exotics:"One Thousand Voices (Exotic Fusion Rifle — ~5% from final chest). Wish-Ender quest starts inside.",
    tip:"Last Wish has a Wall of Wishes at the start with 15 wishes. Wish 4 spawns a secret boss. Wish 7 transports your team to any encounter. Write down the wish codes — they save hours of progression." },

  { name:"Garden of Salvation", expansion:"Shadowkeep", color:"#4ade80", status:"Active",
    power:"750+ (legacy)", players:"6", encounters:4,
    encounterList:["Evade the Consecrated Mind — tether 2 Vex Cyclops using Voltaic Overload buff, move between connection points","Consecrated Mind — tether 4 Cyclops in two waves, damage phase after each wave","Sanctified Mind — same tether mechanic with 4 Cyclops, but faster pace and more adds","Witness DPS Phase — sustained damage after 3 rounds of tethering"],
    exotics:"Divinity (Exotic Trace Rifle — secret quest inside: find 9 puzzles across all 4 encounters, shoot them in order).",
    tip:"Divinity's hidden puzzles are the hardest secret in Destiny raiding. They involve shooting specific geometric patterns that appear in random locations each encounter. Use a guide with exact coordinates for each puzzle location." },

  { name:"Deep Stone Crypt", expansion:"Beyond Light", color:"#38bdf8", status:"Active",
    power:"1100+ (legacy)", players:"6", encounters:4,
    encounterList:["Security — split into Operator (shoots panels), Scanner (calls which panels), Suppressor (kills augmented enemies). Roles rotate by picking up augments","Atraks-1 — same 3 roles, destroy all 4 Atraks-1 copies simultaneously in both space and Europa sections","Taniks, Reborn — 3 roles again, players carry nuclear cores to designated vents while under bomb timer","Taniks, the Abomination — all 6 players cycle augments, 3 carry cores simultaneously to correct vents"],
    exotics:"Eyes of Tomorrow (Exotic Rocket Launcher — ~5% from final chest. Fires tracking missiles at all nearby targets simultaneously).",
    tip:"Deep Stone Crypt has the best lore in any Destiny raid. The space section of Atraks-1 is zero-gravity — movement is completely different. Practice controlling your momentum before jumping in for the first time." },

  { name:"Vault of Glass", expansion:"Legacy (Season of the Chosen)", color:"#60a5fa", status:"Active",
    power:"750+ (legacy)", players:"6", encounters:5,
    encounterList:["Conflux Defense — all 6 guard 3 Confluxes from Vex sacrificing into them. Never let a Vex sacrifice occur","Oracles — 9 oracles spawn sequentially, all 6 players shoot each oracle in order of appearance","The Templar — kill adds, destroy Oracles when they spawn, Oracle-exempt player shoots Templar. Relic holder must cleanse Marking of the Unraveler","Gorgons — stealth maze, kill or ignore Gorgons. One detection = full wipe","Atheon, Time's Conflux — 3 players get portaled to Mercury or Venus, solve oracle sequence inside, rejoin for DPS"],
    exotics:"Vex Mythoclast (Exotic Fusion Rifle — drops from Atheon, ~5%). Corrective Measure (craftable Exotic GL from Conditional chest).",
    tip:"Vex Mythoclast has one of the lowest drop rates in the game. Its Exotic perk (fires in full-auto mode, kills charge it to fire a linear burst) makes it exceptional for add-clear. Expect 10–20+ clears before it drops." },

  { name:"Vow of the Disciple", expansion:"The Witch Queen", color:"#c084fc", status:"Active",
    power:"1350+ (legacy)", players:"6", encounters:4,
    encounterList:["Acquisition — navigate the pyramid ship, shoot symbol sequences on walls, call symbols in fireteam callouts","Caretaker — one team runs symbols on lower floor while another kills Caretaker adds on upper platforms. Boss charges an obelisk — push it back with damage","Exhibition — relay symbols through 3 fireteam members across 3 rooms simultaneously while Scorn pressure mounts","Rhulk, Disciple of the Witness — 4-phase fight, deposit Leeching Force stacks on his back glowing point, DPS during each window"],
    exotics:"Lubrae's Ruin (Exotic Trace Rifle — from secret chest. Activate all 3 plate puzzles in Exhibition to unlock). Destiny 2's most visually impressive raid.",
    tip:"Symbol callouts make or break this raid. Establish a callout system for all 9 Pyramid symbols before you start. The most common: Worm, Grief, Kill, Dark, Stop, Give, Light, Love, Worship. Make sure everyone uses the same word for each symbol." },

  { name:"King's Fall", expansion:"Legacy (Season of the Haunted)", color:"#f97316", status:"Active",
    power:"750+ (legacy)", players:"6", encounters:5,
    encounterList:["Annihilator Totems — 2 players stand on plates to prevent wipes, rest kill ogres and cleanse brand. Swap plate holders regularly","Warpriest — brand runner picks up brand from adds, uses it to cleanse. Kill glyph Hive Knights to enable DPS phase","Golgoroth — 6 players rotate through a gaze role. Gaze holder keeps Golgoroth's eye while others shoot his belly from the pit","Daughters of Oryx — 2 platforms, 3 players each. Brand runner activates, team platforms to correct positions in sync","Oryx, the Taken King — bomb runner detonates Oryx's chest during charge, team runs to elevated platforms on blast, DPS at stagger"],
    exotics:"Touch of Malice (Exotic Scout Rifle — from quest inside King's Fall. Collect 3 Essence fragments across all encounters, then complete a memory sequence).",
    tip:"Touch of Malice's quest requires finding hidden Essence items in specific encounter rooms during the raid. Keep the quest active and check known locations in each room — they're fixed positions that don't change between runs." },

  { name:"Root of Nightmares", expansion:"Lightfall", color:"#4ade80", status:"Active",
    power:"1800+ recommended", players:"6", encounters:4,
    encounterList:["Cataclysm — Light/Dark tether mechanic, connect Light and Dark flowers to create a path, alternate roles each round","Scission — same tether mechanic but faster and with more adds pressure, two teams move through different paths simultaneously","Macrocosm — create Light/Dark planetarium connections across a large open arena with moving platforms","Nezarec, Final God of Pain — split to two sides, Light tethers on one side and Dark tethers on the other, then DPS when both complete"],
    exotics:"Conditional Finality (Exotic Shotgun — from Nezarec chest, ~10–15%). The Navigator (secret quest — check Explicator boss for hidden item).",
    tip:"Root of Nightmares is the most beginner-friendly raid in Destiny 2. The tether mechanic is simple, encounters are short, and DPS phases are generous. Start here if it's your first raid." },

  { name:"Crota's End", expansion:"Legacy (Season of the Witch)", color:"#6ee7b7", status:"Active",
    power:"750+ (legacy)", players:"6", encounters:4,
    encounterList:["Abyss — run through darkness in a set path, use Lamps to push back corruption. Never stop moving forward","Bridge — Swordbearer kills the Knight, picks up sword, crosses bridge and defeats knights on the far side while team maintains the bridge","Ir Yut, the Deathsinger — kill Wizards and Acolytes, then burst Ir Yut in 20 seconds before she kills everyone with her song","Crota, Son of Oryx — Swordbearer kills Gatekeeper Knights, picks up Crota's sword, sprints to Crota and slices him 3 times while chalice bearer keeps shields down"],
    exotics:"No exclusive Exotic — all loot is craftable Hive weapons. Excellent source for The Hive Collective craftable weapons.",
    tip:"The Swordbearer role in Crota's End is the key skill position. Practice timing the sword pickup and sprint to Crota — you have a very narrow window. The sword despawns after 30 seconds, so every movement to Crota must be immediate and direct." },

  { name:"Salvation's Edge", expansion:"The Final Shape", color:"#e879f9", status:"Active",
    power:"1965+ recommended", players:"6", encounters:5,
    encounterList:["Substratum — 3-color portal mechanic, players split into Light/Dark pairs, solve rotating symbol sequences in 3 rooms simultaneously","Repository — build and relay a Prismatic beam across the room using 3 platforms, each platform requires 2 players to align it","Verity's Brow (Ghost Puzzle) — hardest encounter in Destiny raiding history. Players solve a shape-matching logic puzzle across two dimensions simultaneously, while other players outside must mirror the solutions","Witness (Part 1) — 3 columns of Witnesses, each pair handles one column. Stagger all 3 simultaneously within a tight timing window","Witness, Final Confrontation — sustained DPS across 3 phases on the Witness's chest, use all major damage abilities each phase"],
    exotics:"No exclusive Exotic weapon. Drops the highest-stat armor in the game (Tier 5). The raid armor set is one of the most visually striking in Destiny history.",
    tip:"Verity's Brow encounter has made even veteran raid teams take hours. The shape logic puzzle requires each player to solve their individual puzzle while reading and communicating information to outside players simultaneously. Study a diagram before your first attempt — walking in blind will lead to a very long night." },

  { name:"Desert Perpetual", expansion:"The Edge of Fate", color:"#60a5fa", status:"Active",
    power:"2000+ recommended", players:"6", encounters:5,
    encounterList:["Approach — navigate the new destination's outer zone, 3-player split mechanic with rotating safe zones","The Architect — new enemy type with Pantheon modifier vulnerability. Apply modifier cards to shift which abilities counter the boss","Axiom of Glass — Vex-adjacent encounter, time-manipulation mechanics where actions affect parallel timelines","The Reflex — platforming encounter with delayed consequence mechanic — actions in the current phase affect the next phase","Nexus-Prime — final boss. All Pantheon modifier cards stack on this encounter. Hardest version accessible with 3+ stacked modifiers"],
    exotics:"2 new raid-exclusive Exotic weapons — drop from the final encounter and from a secret chest in The Architect encounter.",
    tip:"Desert Perpetual is built around the Pantheon modifier system — adding modifier cards changes which mechanics apply and which rewards you earn. Higher-difficulty Pantheon modifiers stack additional mechanics onto existing encounters. Clear it at base difficulty first, then experiment with Pantheon cards." },

  { name:"Leviathan", expansion:"Curse of Osiris (Vaulted)", color:"#f59e0b", status:"Pinnacle Ops Only",
    power:"750+ (legacy)", players:"6", encounters:4,
    encounterList:["Royal Pools — activate 4 plates, hold platforms to prevent ritual progress, cleanse plate holders using dog/shield mechanic","Pleasure Gardens — stealth maze with War Beasts, collect pollen and deposit at flowers without being detected","Gauntlet — racing mechanic across a large arena, runners sprint while shooters hit targets, full team sync required","Emperor Calus — project team goes inside Calus's mind while the other fights the physical body outside. Symbol callouts between two teams"],
    exotics:"Leviathan loot pool — no current Exotics, but exclusive Leviathan weapons available via Pinnacle Ops completions and Monument of Lost Lights.",
    tip:"The Leviathan was Destiny 2's first raid. If you want to experience it, it's accessible through Pinnacle Ops. The dog race in Pleasure Gardens is one of the most unique encounters in Destiny history." },

  { name:"Scourge of the Past", expansion:"Black Armory (Vaulted)", color:"#94a3b8", status:"Monument of Lost Lights",
    power:"750+ (legacy)", players:"6", encounters:2,
    encounterList:["Sparrow Race — all 6 players ride Sparrows across an industrial zone, completing relay objectives before time runs out","Insurrection Prime — 2 teams split, one inside the mech and one outside. Disable the mech's shields with plasma cores while the other team pushes damage"],
    exotics:"Anarchy (Exotic Grenade Launcher) — now available at Monument of Lost Lights in the Tower.",
    tip:"Anarchy's arcing projectiles stick to surfaces and electrocute everything nearby — it is one of the best passive damage weapons in Destiny. It's now buyable directly from Monument of Lost Lights — no need to farm this raid." },

  { name:"Crown of Sorrow", expansion:"Season of Opulence (Vaulted)", color:"#94a3b8", status:"Pinnacle Ops Only",
    power:"750+ (legacy)", players:"6", encounters:3,
    encounterList:["Pleasure Gardens (Crown) — Hive rune callout mechanic, run runes to matching plates while others shoot Wizards","The Gauntlet (Crown) — rune carriers cleanse, team rotates through marked plates","Gahlran, Sorrow-Bearer — split Hive rune mechanic, damage phase triggered by cleansing all marks"],
    exotics:"No exclusive Exotics. Crown weapons available at Monument of Lost Lights.",
    tip:"One of the shorter raids. If you're going for completion trophies or Triumphs, Crown of Sorrow is fast and approachable compared to most of the active raids." },
];

// ─── DUNGEONS ─────────────────────────────────────────────────────────────────
const DUNGEONS = [
  { name:"Shattered Throne", expansion:"Forsaken", color:"#7c3aed", status:"Active — Only available during Dreaming City curse Week 3",
    power:"750+ (legacy)", players:"1–3", encounters:3,
    encounterList:["Descent — navigate through a linear Taken section, fight Taken Phalanxes and Wizards, no mechanic just combat and movement","Erebos Gol — encounter where 3 players must simultaneously shoot 3 different Taken symbols before the Ogre can be damaged. Wipes on any mistake","Dul Incaru, the Eternal Return — final boss. Kill 3 knights to expose Dul Incaru's crit spot. Each knight empowers a specific damage phase target. 5-minute timer resets on failure"],
    exotics:"Wish-Ender (Exotic Bow — from secret Trueshot quest inside). Dreaming City armor drops.",
    tip:"Shattered Throne only appears during Dreaming City heavy curse week (Week 3 of the rotating cycle). Check the Dreaming City curse schedule online — the heavy curse week repeats every 3 weeks. Solo completion is possible and extremely rewarding for Triumphs." },

  { name:"Pit of Heresy", expansion:"Shadowkeep", color:"#6ee7b7", status:"Active",
    power:"750+ (legacy)", players:"1–3", encounters:4,
    encounterList:["Necropolis — fight through a large Hive area, kill 3 specific Knights each wielding different weapons (lance, sword, shield) to unlock the door","Tunnels of Despair — stealth and movement section through collapsing Hive tunnels with roaming Ogres","Chamber of Suffering — survival encounter on a large platform with Hive flooding in. Kill all Wizards within the time limit without anyone dying","Zulmak, Instrument of Torment — Hive sword mechanic from each of the 3 knights in round 1, use each sword on matching rune platform during DPS"],
    exotics:"Xenophage (secret rune quest before first encounter). Pit of Heresy drops unique Moon armor.",
    tip:"Pit of Heresy is soloable and one of the best ways to farm Moon armor. The Chamber of Suffering can wipe an entire fireteam quickly — spread out and focus Wizards immediately when they spawn." },

  { name:"Prophecy", expansion:"Season of Arrivals (Free to Play)", color:"#60a5fa", status:"Active — Free for all players",
    power:"750+ (legacy)", players:"1–3", encounters:3,
    encounterList:["Phalanx Echo — Light/Dark orb mechanic. Shoot Motes from the correct side (Light or Dark) and dunk them in matching pillars. 9 Motes dunked = DPS phase","The Hexahedron — cube room with 6 faces. Move through the rotating cube, shoot Light or Dark Motes, dunk in correct pillars. Much faster rotations","Kell Echo — same Light/Dark mechanic, but the room actively fills with Taken fog from below. Complete rounds faster or be consumed"],
    exotics:"No exclusive Exotic. Prophecy drops unique Taken-themed armor and weapons.",
    tip:"Prophecy is completely free — no expansion needed. It's a great learning dungeon for mechanics like the Light/Dark orb system that appears in other activities. Solo completions are very achievable for experienced players." },

  { name:"Grasp of Avarice", expansion:"30th Anniversary Pack", color:"#f59e0b", status:"Active",
    power:"1150+ (legacy)", players:"1–3", encounters:3,
    encounterList:["Entrance — collect Treasure and deposit in the chest in the center room. Engram buff stacks to 18, deposit before it kills you","Sparrow Race + Fallen — ride Sparrows through a descending cavern, shoot targets, avoid obstacles, defeat the Ogre at the bottom","Avarokk, the Covetous — collect Scorch Cannon charges from kills, use cannon on Avarokk's weak points to damage. Repeat 4 times"],
    exotics:"Gjallarhorn (Exotic Rocket Launcher — from the Grasp of Avarice Exotic quest 'And Out Fly The Wolves'). 1000 Yard Stare sniper drops here.",
    tip:"Gjallarhorn's quest 'And Out Fly The Wolves' starts inside Grasp of Avarice — collect the hidden items during the dungeon run then complete the quest steps for one of Destiny's most iconic Exotics." },

  { name:"Duality", expansion:"Season of the Haunted", color:"#f97316", status:"Active",
    power:"1350+ (legacy)", players:"1–3", encounters:3,
    encounterList:["Nightmare Caiatl — alternate between the real world and Caiatl's nightmare mindscape. Collect bells in the dream, shoot totems in reality, synchronize transitions","Vault — stealth section, navigate through Calus's vault using nightmare portals without triggering guards","Calus, Venerated — same dual-realm mechanic, split team between real world (shoots totems) and dream world (rings bells). Full team coordination required"],
    exotics:"Heartshadow (Exotic Void Sword — random drop from final boss chest. One of the rarest dungeon Exotics).",
    tip:"Heartshadow turns you temporarily invisible when you heavy-attack with it and kills generate bonus invisibility. The combination makes it the premier tool for solo Nightfall and dungeon runs — you can literally vanish whenever the situation gets dangerous." },

  { name:"Spire of the Watcher", expansion:"Season of the Seraph", color:"#e87800", status:"Active",
    power:"1550+ (legacy)", players:"1–3", encounters:3,
    encounterList:["Akelous, The Siren's Current — Vex Hydra variant. Circuit breaker mechanic: shoot nodes in sequence to create a chain that stuns the boss. Flanking attack on exposed core","Persys, Primordial Ruin — same circuit breaker mechanic but with 3 simultaneous chains required before DPS opens"],
    exotics:"Hierarchy of Needs (Exotic Strand Bow — random drop from final chest. Fires seeking missiles on full draw).",
    tip:"Spire of the Watcher is set inside a Warmind facility — one of the most visually unique dungeon environments. The circuit breaker mechanic rewards players who communicate which nodes to shoot in sequence — mark them before the encounter starts." },

  { name:"Ghosts of the Deep", expansion:"Season of the Deep", color:"#06b6d4", status:"Active",
    power:"1750+ recommended", players:"1–3", encounters:3,
    encounterList:["Ecthar, the Shield of Savathun — kill 3 Wizards to collect Vestige of Light, dunk into the central altar to expose Ecthar's crit spot. 3-phase fight underwater","The Deep — traversal section through the deep ocean, avoid corruption zones and navigate using Titan's light beacons","Šimmumah ur-Nokru, Lucent Hive Wizard — same Vestige mechanic, 3 Wizards, dunk, DPS Šimmumah. Stomp the Ghost immediately after each damage phase or she resurrects"],
    exotics:"Wicked Implement (Exotic Stasis Sniper — from the secret 3-well activation quest inside the dungeon's Tier 3 difficulty).",
    tip:"Ghosts of the Deep is the hardest dungeon in Destiny 2. The underwater environment changes how you move and fight significantly. The final boss's Ghost resurrection mechanic requires every player to stomp immediately after DPS — one miss means a full reset." },

  { name:"Warlord's Ruin", expansion:"Season of the Wish", color:"#dc2626", status:"Active",
    power:"1800+ recommended", players:"1–3", encounters:3,
    encounterList:["Rathil, First Broken Knight of Fikrul — fight through a vertical Ahamkara castle, defeat Rathil with a 3-phase DPS mechanic using Ager's Scepter or Stasis weapons","Hefnd's Vengeance — stealth and traversal through a large outdoor section, followed by a Riven-inspired puzzle encounter","Locus of Communion — final boss. Collect Warden's Thorn items for Buried Bloodline secret quest. DPS phase triggered by destroying 3 Resonance pillars simultaneously"],
    exotics:"Buried Bloodline (Exotic Void Shotgun — from secret Warden's Thorn quest across all 3 encounters). One of the strongest solo Exotics for dungeon content.",
    tip:"Buried Bloodline's Devour perk heals you to full on every kill. Combined with a Void subclass, this creates an almost unkillable solo loop — every enemy death is a full heal. It's the primary reason experienced players farm Warlord's Ruin." },

  { name:"Vesper's Host", expansion:"Episode: Echoes", color:"#818cf8", status:"Active",
    power:"1965+ recommended", players:"1–3", encounters:3,
    encounterList:["Extraction — fight through the Ishtar Collective, activate conduits using Arc/Solar/Void in the correct sequence","Raneiks Unified — boss with 3 elemental phases. Each phase requires the matching element weapon to deal damage. Arc first, then Solar, then Void, then final DPS phase","Node.Ovrd.Avalon — final encounter using Vex time-lock mechanics. Freeze time zones to safely traverse otherwise lethal sections"],
    exotics:"Vesper's Host drops new dungeon-exclusive weapons including a craftable Exotic with unique Strand mechanics.",
    tip:"Vesper's Host is mechanically dense for a dungeon. The Node.Ovrd.Avalon final encounter specifically requires understanding the Vex time-lock zones — practice standing in them first before activating any mechanics." },

  { name:"Liberator", expansion:"The Edge of Fate", color:"#3b82f6", status:"Active",
    power:"2000+ recommended", players:"1–3", encounters:3,
    encounterList:["Opening Descent — new traversal mechanic using Edge of Fate grapple system through a collapsing Ishtar structure","Core Chamber — encounter based on the new Tier armor system — Tier 4+ armor interacts with specific mechanic nodes in ways lower-tier armor cannot","Pariarch Resonant — final boss with a 3-part Prismatic mechanic, each part requiring Light and Dark ability use in specific sequence"],
    exotics:"Liberator drops Edge of Fate exclusive weapons and armor at Tier 4 quality — some of the best stat rolls available outside raids.",
    tip:"Liberator is intended as the gear progression dungeon for The Edge of Fate — running it consistently is the most reliable way to collect Tier 4 armor outside of the Desert Perpetual raid." },

  { name:"Equilibrium", expansion:"Renegades", color:"#dc2626", status:"Active",
    power:"2020+ recommended", players:"1–3", encounters:3,
    encounterList:["Venus Landing — Lawless Frontier traversal through Ishtar Academy ruins, 3-way faction combat mechanic between Cabal Barant, Fallen Oathbreakers, and Vex","Faction War Encounter — all 3 Renegades factions fight each other AND you simultaneously. Use faction mechanics against each other","Dredgen Bael's Remnant — final boss with Guardian ability set — expect Golden Gun, Void suppression, and Stasis freeze attacks in sequence"],
    exotics:"Equilibrium drops the final Renegades exclusive Exotic weapon — Dredgen Bael's personal weapon adapted for Guardians. Also drops Tier 5 armor.",
    tip:"Equilibrium is the last dungeon Bungie released before Monument of Triumph ended development. Its Tier 5 armor drops make it essential for players wanting max-stat builds in the final sandbox." },
];

const QUEST_CATS = ["exotic","campaign","key","weekly","raids","dungeons"];
const QUEST_CAT_LABELS = { exotic:"EXOTIC MISSIONS", campaign:"CAMPAIGNS", key:"KEY QUESTS", weekly:"WEEKLY", raids:"RAIDS", dungeons:"DUNGEONS" };
const QUEST_CAT_COLORS = { exotic:C.gold, campaign:C.purple, key:C.prismatic, weekly:C.teal, raids:C.red, dungeons:C.orange };
  { name:"Exotic Quests — How They Work", color:C.gold, icon:"🌟",
    how:"Exotic quest weapons are available from specific vendors or from completing quests in your Quest log. In the Monument of Triumph state, most exotic quests are permanently available. Start them from the Quest Archive kiosk in the Tower lobby.",
    find:"Tower → Quest Archive kiosk → Filter by 'Exotic Quests'. Every legacy exotic quest is listed here.",
    tip:"Exotic Ciphers (from Xur's Xenology quest) are required for some archive purchases. Complete Xur's Xenology every week — it's the easiest free exotic cipher in the game." },
  { name:"Questline Order for New Players", color:C.blue, icon:"📋",
    how:"1. Complete the New Light intro mission. 2. Visit the Tower — meet Zavala, Ikora, Cayde's legacy. 3. Complete each expansion campaign in release order (Shadowkeep → Beyond Light → Witch Queen → Lightfall → The Final Shape → Edge of Fate → Renegades). 4. Start expansion-specific exotic quests as you unlock them.",
    find:"Quest log (left trigger → Quest tab) tracks all active quests. New quests are given by vendors in the Tower.",
    tip:"The Final Shape campaign is mandatory for Prismatic subclass. Don't skip it." },
  { name:"Finding Quest Items In-Field", color:C.green, icon:"🔍",
    how:"Quest items always show on your Director map as glowing icons when you're in the correct destination. Open the map, zoom into the destination, and look for quest markers (exclamation points or diamond shapes).\n\nFor kill-based quest steps: check your quest description for the enemy type and destination. Patrol the destination and kill matching enemies. Public events and Lost Sectors guarantee encounters.",
    find:"Ghost scan objects are glowing items in the environment that scan to reveal lore or progress quests. Hold the interact button to scan.",
    tip:"If a quest step says 'defeat X enemies' in a specific destination, Lost Sectors in that destination spawn enemies in high concentration. Clear them on loop." },
  { name:"Legacy Exotic Quest Weapons (Notable)", color:C.solar, icon:"🗡️",
    how:"Outbreak Perfected (Zero Hour mission), Whisper of the Worm (The Whisper mission), Dead Man's Tale (Presage mission), Hawkmoon (Harbinger mission), Vox Obscura (Operation: Seraph's Shield), Revision Zero (Operation: Seraph's Shield). Each is a dedicated exotic mission replayable weekly.",
    find:"Director → Destinations → Look for specific icons OR Tower → Quest Archive for the starting quest step.",
    tip:"These exotic missions drop the weapon on first completion, then have a weekly Deepsight Resonance drop for crafting. Run them weekly until you have the pattern unlocked." },
  { name:"Vendor Weekly Quests", color:C.teal, icon:"🔄",
    how:"Each major vendor (Zavala, Shaxx, Drifter, Banshee-44, Saint-14) offers weekly bounty sets and a weekly reputation milestone. Completing them fills their reputation bar for an Engram reward. Each vendor's engrams can be focused at their respective kiosk into specific weapons.",
    find:"Tower → Visit each vendor → Check their bounty and quest offerings every Tuesday (weekly reset).",
    tip:"Prioritize whichever vendor sells the weapon you're chasing this week. Focused engrams from reputation give the best targeted loot without endless RNG." },
];

// ─── WEAPON UPGRADES ─────────────────────────────────────────────────────────
const WEAPON_UPGRADES = [
  { name:"Legendary Masterworking", color:C.gold, icon:"⭐",
    how:"Every Legendary weapon has 10 Masterwork tiers. Each tier costs Enhancement Cores, Glimmer, and Legendary Shards. At Tier 10 (MW10) — the weapon gets a golden border, a stat boost (+10 to one stat, +2 to all others), and most importantly: kills with the weapon generate Orbs of Power that charge your Super and team's abilities.",
    steps:["Hover over any Legendary weapon in your inventory","Select Inspect → scroll to the bottom-left perk slot","Select the Masterwork node and upgrade through each tier","Costs increase each tier — stock Enhancement Cores before starting","MW10 grants full Orb generation on multikills"],
    tip:"Masterworking your primary workhorse weapon first. The Orb generation at MW10 is one of the best ways to keep your Super charged across every activity." },
  { name:"Exotic Catalysts", color:C.prismatic, icon:"🔮",
    how:"Exotic weapons don't Masterwork like Legendaries — they use Catalysts. A Catalyst adds a new perk or stat boost and unlocks full Orb generation. In Monument of Triumph, EVERY Exotic weapon received a Catalyst — including all legacy weapons. Old Catalysts that only gave stat boosts also received real perks.",
    steps:["Earn the Catalyst by playing the activity tied to that Exotic (Strikes, Crucible, Raids, specific missions — varies per weapon)","Equip the Catalyst on the weapon (inspect weapon → Catalyst slot)","Complete the kill/activity requirement shown in the Catalyst description (usually 500 kills)","Hold interact on the completed Catalyst to apply it → Exotic is now fully Masterworked"],
    tip:"Check the Triumphs page under Patterns & Catalysts to see which Catalysts you've found vs. not found. Monument of Triumph added perks to all 9 old Exotics that only had stat boosts — weapons like Riskrunner (Chain Reaction) and Skyburner's Oath (Incandescent) are now dramatically stronger." },
  { name:"Infusion — Raising Power Level", color:C.orange, icon:"⬆️",
    how:"Infusion lets you consume a higher-Power weapon to raise a lower-Power weapon's level up to match. This lets you keep your favorite weapons relevant as your Power increases. Costs Glimmer and Enhancement Cores per infusion.",
    steps:["Find a weapon with higher Power than the one you want to upgrade","Inspect your lower-Power weapon → select Infuse","Choose the higher-Power weapon as the material","Confirm — your lower-Power weapon now matches the higher level, the material is consumed"],
    tip:"Only infuse weapons you genuinely use. Infusion costs stack up — don't waste Enhancement Cores on weapons you'll replace. Crafted weapons level up through use instead of infusion." },
  { name:"Crafted Weapon Leveling & Enhanced Perks", color:C.teal, icon:"🔨",
    how:"Crafted weapons (from the Enclave on Mars) have a level system separate from Power. Level them by using the weapon in combat — or spend Glimmer to fast-level. Higher levels unlock Enhanced perk options:\n\n• Level 11: Left column traits auto-upgrade to Enhanced versions\n• Level 17: Right column traits auto-upgrade to Enhanced versions\n• Two Enhanced Traits + Enhanced Intrinsic = gold border (full Masterwork status)\n\nAt any time, return to the Enclave Relic to Reshape the weapon — change any perk to a different valid option for that weapon.",
    steps:["Craft the weapon at the Enclave on Mars (requires red border pattern unlocked)","Use the weapon in any activity to level it up (kills = XP)","Optionally spend Glimmer at the Enclave to fast-level it","At levels 11 and 17, revisit the Enclave to apply Enhanced perks","At max enhancement tiers: gold border, best-in-slot perk set"],
    tip:"Crafted weapons are the endgame for any weapon you'll use long-term. The ability to choose EXACT perks and enhance them removes RNG entirely. Prioritize getting the pattern for your most-used weapon type first." },
  { name:"Weapon Cosmetics — Shaders, Kill Trackers & Mementos", color:C.pink, icon:"🎨",
    how:"Beyond ornaments, weapons can have several cosmetic customizations:\n\n• Shaders: Change the color scheme of a weapon. Apply any shader you've unlocked from Collections → Weapon. Shaders are account-wide and infinite use.\n\n• Kill Trackers: Display a kill count on the weapon. Two types: Crucible Tracker (PvP kills only) or Combat Tracker (PvE kills). Applied in the mod slot of the weapon.\n\n• Mementos: Special rare cosmetics that apply a unique shader AND animated effect to crafted weapons. Only available on crafted weapons in their Memento socket. Sources: Trials of Osiris, Raids, Gambit, and specific seasonal content.",
    steps:["Shaders: Inspect weapon → Shader slot → apply from your collection","Kill Trackers: Inspect weapon → Mod slot → select Combat Tracker or Crucible Tracker","Mementos: Earn from Trials, Raids, or Gambit → Inspect crafted weapon → Memento socket → apply"],
    tip:"Mementos are some of the rarest cosmetics in the game. The Trials Memento (Flawless passage) and Raid Mementos require significant skill to earn — they're prestige items that show other Guardians you've completed the hardest content." },
];

// ─── ARMOR & STATS ───────────────────────────────────────────────────────────
const ARMOR_STATS = [
  { stat:"Mobility", color:C.green, icon:"🏃",
    affects:"Strafe speed, jump height. Does NOT affect sprint speed.",
    tiers:"Higher = faster directional movement. Every 10 points = one tier. Hunter class ability (Dodge) cooldown is tied to Mobility.",
    pve:"Less critical — 50–60 is usually sufficient unless you're playing Hunter Dodge builds.",
    pvp:"More important in PvP — faster strafing makes you harder to track. Many PvP players stack 100 Mobility." },
  { stat:"Resilience", color:C.blue, icon:"🛡️",
    affects:"Damage resistance in PvE, damage threshold in PvP. Titan Barricade cooldown.",
    tiers:"Tier 10 (100 Resilience) = maximum damage resistance in PvE. Each tier reduces incoming damage. This is the most impactful stat in endgame PvE.",
    pve:"MAX THIS FIRST. 100 Resilience is the difference between surviving and dying to basic attacks in high-tier content. Non-negotiable for Grandmaster Nightfalls and Master raids.",
    pvp:"Certain Resilience tiers change how many bullets kill you. Tier 6+ (60+) matters significantly." },
  { stat:"Recovery", color:C.purple, icon:"💊",
    affects:"Rift recharge speed (Warlock) and health regeneration speed after taking damage.",
    tiers:"Higher Recovery = rift recharges faster. Warlock class ability is directly tied to Recovery — max this for Warlock builds.",
    pve:"Essential for Warlock. Secondary priority for Hunters and Titans after Resilience.",
    pvp:"Recovery speeds up health regen between engagements — useful for aggressive play styles." },
  { stat:"Discipline", color:C.orange, icon:"💥",
    affects:"Grenade recharge speed. Period. Nothing else.",
    tiers:"Tier 10 (100 Discipline) = fastest possible grenade cooldown. Every 10 points = one tier of cooldown reduction.",
    pve:"Critical for grenade-centric builds (Void Hunter, Shadebinder, Dawnblade). Stack high if grenades are part of your damage loop.",
    pvp:"One-shot grenade builds often want high Discipline for more frequent throws." },
  { stat:"Intellect", color:C.gold, icon:"⚡",
    affects:"Super recharge speed. Higher Intellect = Super charges faster from kills and damage.",
    tiers:"Each tier reduces time between Supers. In long activities (raids, dungeons), high Intellect means more Supers per encounter.",
    pve:"Very useful for Super-dependent builds. If your Super is part of your DPS rotation (Well of Radiance, Thundercrash), stack Intellect.",
    pvp:"Super uptime in Trials and Iron Banner can decide rounds. High-Intellect builds get more Super windows." },
  { stat:"Strength", color:C.red, icon:"👊",
    affects:"Melee ability recharge speed. Every melee — Throwing Knife, Consecration, Combination Blow, Nova Warp melee — uses Strength.",
    tiers:"Higher Strength = melee recharges faster between uses.",
    pve:"Essential for melee-centric builds: Striker Titan (Thunderclap), Consecration Titan, Combination Blow Hunter, Arcane Needle Broodweaver.",
    pvp:"Shotgun + melee builds benefit from fast Strength cooldown — fast access to the melee after a bodyshot." },
];

const ARMOR_SYSTEM = [
  { name:"Stat Tiers — How They Work", color:C.gold,
    body:"Stats scale from 0–100 (or 0–200 in Armor 3.0 Edge of Fate builds). Each 10 points = one tier. Only tiers matter — the difference between 51 and 59 Resilience is ZERO. The difference between 59 and 60 is a full tier. Always aim for even multiples of 10: 60, 70, 80, 90, 100.\n\nIn Armor 3.0 (Edge of Fate), the system expanded to 200 total possible points with set bonuses returning for 2-piece and 4-piece armor combinations." },
  { name:"Armor Tiers (Edge of Fate System)", color:C.teal,
    body:"The Edge of Fate expansion introduced tiered armor rarity:\n\n• Tier 1–2: Base gear, lowest stat caps\n• Tier 3: Solid mid-game armor\n• Tier 4: High-end content armor\n• Tier 5: Endgame — drops from Raids (Master/Hard difficulty), Grandmaster Nightfalls, Trials of Osiris, Iron Banner. Has a Tuning Slot for +5/−5 stat fine-tuning.\n\nTier is fixed on drop — you cannot upgrade tier. Ghost Armorer mods can bias which stat archetype you get, but not tier." },
  { name:"High-Stat Armor Farming", color:C.green,
    body:"Best sources for high-stat armor (targeting specific stat spikes):\n\n1. Legend/Master Lost Sectors (daily): drop Exotic armor in the featured slot. Solo only.\n2. Raids (Master difficulty): highest possible stat rolls, Tier 4–5 armor.\n3. Grandmaster Nightfalls: consistent high-stat drops, Tier 4–5.\n4. Dungeons (Master): good stat rolls, Tier 3–4.\n5. Trials of Osiris: competitive PvP rewards, high-stat armor.\n6. Xur Exotic armor: can roll with Ghost mod bias. Always check before buying." },
  { name:"Armor Mod Slots", color:C.blue,
    body:"Every armor piece has slot-specific mod slots:\n\n• Helmet: Ammo Finder mods (Primary/Special/Heavy — increase ammo brick frequency), Siphon mods (generate Orbs on rapid kills), Stat boost mods\n• Arms (Gauntlets): Grenade/Melee ability mods, Loader mods (faster reload), Stat boost mods\n• Chest (Body Armor): Resistance mods (damage reduction), Reserves mods (larger ammo reserves), Stat boost mods\n• Legs (Boots): Ammo Scavenger mods (pick up more ammo), Innervation/Invigoration (ability energy on Orb pickup), Stat boost mods\n• Class Item: Activity-specific mods, Charged Up (more Armor Charge stacks), Stat boost mods\n\nMod costs use Energy — each armor piece has 10 Energy. Mods cost 1–5 Energy. Can only fit mods within the total Energy budget." },
];

// ─── BUILD CRAFTING ───────────────────────────────────────────────────────────
const BUILD_CRAFTING = [
  { name:"Aspects — Your Subclass Foundation", color:C.prismatic, icon:"💎",
    how:"Aspects are the most powerful customization layer of your subclass. Each subclass has 2–3 Aspects available (Prismatic gets more). You equip 2 at a time. Aspects define the core mechanic of your build — they add new behaviors, unlock Fragment slots, and often define the entire build around them.\n\nExamples: Consecration (Solar Titan) enables the slam combo. Devour (Voidwalker) enables self-healing on kills. Grapple (Strand) is an Aspect that enables the grapple mechanic.",
    tip:"Choose your Aspect first, then build everything else around it. The Aspect is the engine. Fragments are the tuning. Mods are the fuel." },
  { name:"Fragments — Fine-Tuning Your Build", color:C.teal, icon:"🔷",
    how:"Fragments are smaller modifiers that enhance specific behaviors of your subclass. You unlock Fragment slots through Aspects (Prismatic has the most). Each Fragment has:\n• A passive bonus effect\n• A stat change (+/− to armor stats — displayed on the Fragment)\n\nFragments can give significant stat bonuses (+10 Recovery, +10 Discipline) OR penalties (−10 Mobility). Factor these into your total stat planning.",
    tip:"Track Fragment stat changes carefully — some give you free stats. Facet of Purpose (+10 Resilience for Prismatic) is essentially a free stat mod. Build around stat bonuses from Fragments before spending mod slots on stats." },
  { name:"Armor Charge System", color:C.orange, icon:"⚡",
    how:"Armor Charge is a stacking buff (up to 3 charges, 6 with Charged Up mod) that powers specific mods:\n\n• Generate Armor Charge: Picking up Orbs of Power (from MW weapons/Siphon mods), using specific mods like Firepower (grenade kills), Reaper (kills after using class ability), Dynamo (class ability near enemies)\n\n• Spend Armor Charge: Mods like Radiant Light (buff damage + spread to allies), Empyrean Reserve (increases Super energy on kill), Protective Light (damage resistance), Elemental Surge mods (30% weapon damage boost for a short time)\n\nArmor Charge decays if you don't spend it.",
    tip:"Build a charge-generate + charge-spend loop. The most common meta: Siphon mod on helmet (generates Orbs) → Orbs generate Armor Charge → Elemental Surge mod consumes charge for 30% weapon damage boost. This is active on almost every endgame build." },
  { name:"Siphon Mods — The Orb Engine", color:C.gold, icon:"🔮",
    how:"Siphon mods on the helmet generate Orbs of Power from rapid kills with matching-element weapons:\n• Kinetic Siphon: Kinetic weapon rapid kills\n• Arc/Solar/Void/Stasis/Strand Siphon: Matching element weapon rapid kills\n\nOrbs generated by MW weapons + Siphon mods are the engine of every endgame build — they charge Supers, trigger Armor Charge, and feed numerous build loops.",
    tip:"Almost every endgame build uses at least one Siphon mod. Stack 2 for doubled Orb generation rate. Match the Siphon element to your primary damage weapon." },
  { name:"Surge Mods — 30% Damage Boost", color:C.green, icon:"📈",
    how:"Elemental Surge mods (on leg armor) give a +30% weapon damage bonus to a specific element for a short window after spending Armor Charge. These are the most impactful damage mods in the game.\n\nStack with matching element weapons for a massive DPS increase during boss damage phases. The bonus is multiplicative with other buffs.\n\nThe Surge mod must match the damage type of the weapon you're using.",
    tip:"For boss DPS phases: use your Armor Charge before the phase begins to pre-load the Surge buff. Then fire your power weapon with the matching element for +30% damage during that window." },
  { name:"Artifact Perks — Seasonal Power Multipliers", color:C.purple, icon:"🏛️",
    how:"The Seasonal Artifact gives you selectable perks as you level it through XP. Monument of Triumph froze the artifact at its final perk set — these perks are now permanently available.\n\nArtifact perks include:\n• Anti-Champion mods (Barrier/Overload/Unstoppable counters — CRITICAL for high-end content)\n• Weapon type bonuses (+damage, +handling to specific archetypes)\n• Build-specific buffs that synergize with subclass abilities\n\nYou can reset and reselect Artifact perks at any time for free.",
    tip:"ALWAYS check which Champion mods are in the Artifact before building for high-end content. If the Artifact has Anti-Barrier rounds for Pulse Rifles, an Anti-Barrier Pulse Rifle becomes mandatory for any content with Barrier Champions." },
  { name:"Build Formula — How to Assemble a Build", color:C.blue, icon:"📋",
    how:"Step-by-step build construction order:\n\n1. PICK YOUR EXOTIC — the Exotic is the identity of every build\n2. PICK YOUR SUBCLASS — match to the Exotic's element or synergy\n3. PICK YOUR ASPECTS — what's the core mechanic the build runs around?\n4. PICK YOUR WEAPONS — which weapon types synergize with your Exotic and Aspects?\n5. PICK YOUR FRAGMENTS — fill remaining Fragment slots, grab stat bonuses\n6. PICK YOUR MODS — Siphon on helmet, relevant mods per slot, Surge on legs to match weapon element\n7. CHECK YOUR STATS — target 100 Resilience always, then 70–100 in your priority stat (Discipline/Intellect/Strength based on build)",
    tip:"Start with the Exotic. Always. A build without a clear Exotic center usually doesn't have a clear identity. Resources like D2 Foundry (d2foundry.gg) and Mobalytics Destiny 2 builds let you browse community meta builds to learn what works." },
];

// ─── KEY VENDORS ─────────────────────────────────────────────────────────────
const VENDORS = [
  { name:"Xûr — Agent of the Nine", color:C.gold, icon:"🟡",
    location:"Tower Bazaar, permanently — alley to the right of the Ramen Shop (Courtyard landing → west into Bazaar → first right in the narrow alley). No longer rotates between planets since The Final Shape. Active Friday 10AM PT through Tuesday reset.",
    sells:"• One Exotic weapon per week (rotating)\n• One Exotic armor piece per class per week (check Ghost Armorer mod for stat bias)\n• Legendary weapons and armor with random rolls\n• Strange Favors buff (buy early to boost Strange Coin drops all week)\n• Fated Engram (gives an Exotic you don't yet own — most efficient collection completion tool)",
    currency:"Strange Coins (earned from ritual playlists — Vanguard, Crucible, Gambit, Onslaught). Xûr no longer takes Legendary Shards as primary currency.",
    tip:"ALWAYS pick up the Xenology quest from Xûr's second inventory page before buying anything. Complete 21 Strikes or win Crucible/Gambit matches → earn one Exotic Cipher. Use the Cipher at the Monument of Lost Lights for vaulted Exotics. You can hold max 5 Ciphers." },
  { name:"Monument of Lost Lights — Exotic Kiosk", color:C.purple, icon:"🏛️",
    location:"Tower — between the two vault terminals near the center. Cannot be missed.",
    sells:"Every Exotic weapon and armor piece from past seasons and DLCs — including vaulted content. All legacy Exotics are purchasable here permanently.",
    currency:"Exotic Cipher (from Xûr's Xenology quest, 1 per week) + Spoils of Conquest (from raid encounters) + Ascendant Shards or Prisms (depending on the item).\n\nSome Exotics only cost Glimmer + Spoils. Others require Exotic Cipher + Ascendant Shard. Check the cost before your weekly Cipher.",
    tip:"Outbreak Perfected, Whisper of the Worm, Izanagi's Burden, Wishender — all purchasable here. If you missed seasons, this is how you complete your Exotic collection. Prioritize Exotics that are core to meta builds: Gjallarhorn, Witherhoard, Dead Man's Tale, Osteo Striga." },
  { name:"Zavala — Commander of the Vanguard", color:C.blue, icon:"🔵",
    location:"Tower — Hall of Guardians, left side.",
    sells:"Vanguard-specific weapons and armor via Vanguard engrams. Focus engrams at his kiosk for specific Nightfall weapons.",
    currency:"Vanguard reputation (earned from Strike/Nightfall completions) + Vanguard engrams.",
    tip:"Focus Vanguard engrams on the week your target Nightfall weapon is the featured one — the drop rate is significantly higher. Zavala's kiosk lets you narrow which weapon you get from a focused engram." },
  { name:"Lord Shaxx — Crucible Handler", color:C.red, icon:"⚔️",
    location:"Tower — Hall of Guardians, center.",
    sells:"Crucible weapons via reputation engrams. Focus for specific PvP weapons.",
    currency:"Crucible reputation (earned from matches, wins give more) + Crucible engrams.",
    tip:"If you're chasing a specific Crucible god roll, focus your engrams at Shaxx's kiosk rather than opening them freely. You halve the perk RNG by narrowing to one weapon." },
  { name:"The Drifter — Gambit Organizer", color:C.strand, icon:"🃏",
    location:"Tower — Annex, far right.",
    sells:"Gambit weapons via reputation engrams. Unique Gambit-exclusive weapons.",
    currency:"Gambit reputation (earned from matches — any outcome counts) + Gambit engrams.",
    tip:"Drifter weekly milestone is the fastest of the three playlist milestones. Complete Gambit first every reset — match outcome doesn't matter for reputation." },
  { name:"Banshee-44 — Tower Gunsmith", color:C.orange, icon:"🔫",
    location:"Tower — right of the landing zone.",
    sells:"Upgrade Modules (essential for Masterworking — daily purchase limit), weapon-specific engrams via Gunsmith reputation.",
    currency:"Glimmer (for Upgrade Modules) + Gunsmith reputation from weapon Orders.",
    tip:"Buy your daily Upgrade Module allotment from Banshee every single day. They're cheap with Glimmer and cap out fast in your inventory — spend before you hit the limit. Upgrade Modules are one of the few resources with a reliable daily income." },
  { name:"Ada-1 — Fashion and Transmog", color:C.pink, icon:"🧵",
    location:"Tower — Annex area.",
    sells:"Armor mods (permanent unlocks), Synthweave Bolts for Armor Synthesis (transmog), shaders, materials.",
    currency:"Glimmer + Legendary Shards for mods. Synthweave Bolts for transmog.",
    tip:"Ada-1 rotates which armor mods she sells each day. Check her inventory every reset — some permanent mods only available through Ada-1 rotation. Buy every mod you don't own the first time you see it." },
  { name:"Saint-14 — Trials of Osiris", color:C.arc, icon:"💛",
    location:"Tower — Hangar area.",
    sells:"Trials of Osiris weapons and armor via Trials engrams. Passage cards for entering Trials (weekend only).",
    currency:"Trials reputation (earned from Trials wins and round wins) + Trials engrams.",
    tip:"Trials Passages reset weekly. Buy the Passage of Mercy if you're new to Trials — it forgives your first loss. Going Flawless (7 wins 0 losses) unlocks the Flawless pool for the remainder of the weekend, giving better loot." },
  { name:"Ikora Rey — Hidden Intelligence", color:C.void, icon:"🟣",
    location:"Tower — Hall of Guardians, right side.",
    sells:"Meditation missions (replay campaign missions for rewards), Hunter/Warlock/Titan exclusive items, Hunter/Warlock class-specific content.",
    currency:"Glimmer + Vanguard medallions.",
    tip:"Ikora's Meditation missions replay campaign content for powerful drops. A reliable early-game Power leveling method for new characters." },
];

// ─── LOST SECTORS ─────────────────────────────────────────────────────────────
const LOST_SECTOR_INFO = [
  { name:"What Are Lost Sectors?", icon:"🗺️", color:C.teal,
    body:"Lost Sectors are small, self-contained dungeons hidden in every patrol destination. Each one has a path of enemies, Elite/Champion encounters, and a final boss who drops a key for the chest. On the map they're marked with a specific icon (a circle with a downward arrow). Walk into the entrance and your location display will show the sector name — that confirms you're inside." },
  { name:"How to Unlock Legend & Master Difficulty", icon:"🔓", color:C.gold,
    body:"You MUST complete the normal version of a Lost Sector at least once before its Legend/Master version appears on the map. After completing it normally, the icon on the map changes when that sector is featured in the daily rotation.\n\nPower requirements (Monument of Triumph final state):\n• Legend: 1940+ recommended\n• Master: 2050+ recommended\n\nBoth difficulties reset daily at 10am PDT alongside the daily reset." },
  { name:"The Daily Rotation — What Changes Each Day", icon:"🔄", color:C.blue,
    body:"Every day one specific Lost Sector becomes the Legend/Master featured sector. The rotation also determines which Exotic armor slot can drop that day:\n\n• Day 1: Helmets\n• Day 2: Leg Armor\n• Day 3: Gauntlets (Arms)\n• Day 4: Chest Armor\n• Then repeats\n\nThis armor slot info is displayed on the banner outside the Lost Sector entrance. Check it before going in — if you need chest armor, do it on chest armor day.\n\nTrack the current day's rotation at d2foundry.gg or destinylfs.com — both show today's sector and armor slot." },
  { name:"Solo Only for Exotic Drops", icon:"👤", color:C.red,
    body:"Exotic armor only drops if you complete the Lost Sector SOLO. If you enter with a fireteam, you only get Enhancement Cores — no Exotic.\n\nDrop rates (approximate, Monument of Triumph state):\n• Legend solo: ~25–33% chance per completion\n• Master solo: ~33–40% chance per completion\n\nGetting a PLATINUM rating (killing ALL Champions before opening the boss chest) gives the highest possible Exotic drop chance. Always kill every Champion." },
  { name:"Revive System & Loadout Lock", icon:"☠️", color:C.orange,
    body:"Inside Legend/Master Lost Sectors:\n• Your loadout is LOCKED — you cannot swap weapons or armor after entering\n• You have a limited number of revives (shown as tokens)\n• Kill Champions to earn extra revive tokens\n• All revive tokens expire after 15 minutes and you're done — time efficiency matters\n• Enemies have Threat modifiers that increase damage from a specific element by 25%\n\nAlways check the sector's modifiers on the banner BEFORE entering — it lists Champion types, shield types, and Threat element. Build your loadout accordingly." },
  { name:"Best Lost Sectors to Farm (Fastest Clears)", icon:"⚡", color:C.green,
    body:"Ranked fastest to slowest for solo farming:\n\n• Concealed Void (Europa) — S tier: short, tight layout, easy boss\n• Extraction (Europa) — A tier: straightforward path, fast boss\n• Bay of Drowned Wishes (Dreaming City) — A tier: compact, predictable\n• Lair of the Worm (Savathun's Throne World) — B tier: medium length, manageable\n• Aphelion's Rest (Dreaming City) — B tier: outdoor movement, slightly longer\n• Perdition (Europa) — C tier: Vex with Void shields, longer routes\n• Bunker E15 (Europa) — C tier: Overload Champions are annoying here\n• The Conflux (Nessus) — D tier: long sector, annoying Vex layouts\n\nWhen the day's featured sector is Concealed Void or Extraction, that's a fast farm day — run it as many times as possible until the Exotic drops." },
  { name:"Champion Types Inside Lost Sectors", icon:"💀", color:C.red,
    body:"Every Legend/Master Lost Sector has specific Champion types listed on the entrance banner. You MUST have the matching anti-Champion mod or perk equipped or Champions are nearly impossible to kill:\n\n• Anti-Barrier (shield icon): Barrier Champion regenerates health and is immune until shield is broken. Use Anti-Barrier weapon perk to pierce the shield and stun it.\n• Overload (swirl icon): Overload Champion constantly regenerates health. Must interrupt it with Overload rounds/bow/SMG to stop the regen and stun.\n• Unstoppable (stop sign icon): Unstoppable Champion cannot be staggered normally. Must use an Unstoppable-perk weapon to stun it before dealing damage.\n\nCheck the Artifact for which weapon types have anti-Champion perks this season — the sector banner tells you which Champions are inside." },
];

const LOST_SECTORS_LIST = [
  { location:"Cosmodrome", sectors:["Forgotten Shore","Widow's Walk","Terminus East","The Drain","Scavenger's Den","Exodus Garden 2A","Veles Labyrinth"] },
  { location:"European Dead Zone (EDZ)", sectors:["Atrium","Widow's Court","Terminus East","The Weep","Flooded Chasm","Pathfinder's Crash","Shaft 13","Skydock IV","The Quarry"] },
  { location:"Nessus", sectors:["The Conflux","Ancient's Haunt","The Carrion Pit","The Orrery","Glade of Echoes","The Cistern"] },
  { location:"Moon", sectors:["K1 Logistics","K1 Communion","K1 Crew Quarters","K1 Revelation"] },
  { location:"Europa", sectors:["Concealed Void","Bunker E15","Perdition","Extraction"] },
  { location:"Dreaming City", sectors:["Bay of Drowned Wishes","Chamber of Starlight","Aphelion's Rest"] },
  { location:"Savathun's Throne World", sectors:["Metamorphosis","Sepulcher","Extraction (Throne World variant)","Lair of the Worm"] },
  { location:"Neomuna", sectors:["Ahimsa Park","Líminal Nadir","Zephyr Concourse"] },
  { location:"The Pale Heart", sectors:["Found Verdict","Blooming Deep","Forgotten Cavern","Seclusion"] },
];

// ─── ENEMIES ──────────────────────────────────────────────────────────────────
const ENEMY_FACTIONS = [
  { name:"Fallen (Eliksni)", color:C.arc, shield:"Arc (blue)", icon:"⚡",
    where:"Cosmodrome, EDZ, Dreaming City, Tangled Shore",
    tiers:"Dregs (weakest, 2 arms), Vandals (snipers/swords), Captains (heavy), Servitors (floating orbs — Ether support), Shanks (drones), Walkers (tanks)",
    shields:"Vandals and Captains can have Arc shields — use an Arc Energy weapon to break them for an explosion. Servitors have Void shields.",
    howToFight:"Kill Vandal snipers first — they shred from range. Servitors heal and overshield nearby Fallen — destroy the Servitor before focusing on anything else. Shanks are weak, kill fast. Captains have thick health bars — use Special or Heavy ammo.",
    champions:"Overload Captains, Anti-Barrier Servitors (in endgame content)",
    tip:"Whenever you see a Servitor floating near a group, destroy it immediately. Every second it's alive is healing the entire Fallen squad around it." },
  { name:"Hive", color:C.solar, shield:"Solar (orange)", icon:"🔥",
    where:"Moon, Savathun's Throne World, various strikes and missions",
    tiers:"Thralls (melee rushers), Acolytes (ranged), Knights (heavy melee/ranged), Wizards (airborne casters), Ogres (heavy turrets), Cursed Thralls (explode on death)",
    shields:"Knights have Solar shields — Arc or Void burst them for shield explosions. Wizards can have Solar or Arc shields depending on the encounter.",
    howToFight:"Never let Thralls rush you — back up and clear them with an area weapon. Wizards hover and cast — they have shields, prioritize breaking the shield then burst them down. Knights charge hard — dodge to the side and shoot the exposed chest. Never stand in front of Ogres for sustained fire — duck and peek.",
    champions:"Barrier Knights, Unstoppable Ogres (endgame)",
    tip:"Cursed Thralls explode with massive Arc damage. Don't let them get within melee range. They look like Thralls but have a golden glow — when in doubt, shoot everything that rushes you." },
  { name:"Cabal", color:C.solar, shield:"Solar/Arc (varies)", icon:"🚀",
    where:"Nessus, Mars (Leviathan), various strikes",
    tiers:"Legionaries (basic soldiers), Psions (psychic snipers), Phalanxes (shield bearers), Centurions (officers), Gladiators (aggressive melee), Colossus (heavy weapons), Harvesters (dropships)",
    shields:"Centurions and officers often have Solar shields — Void or Arc energy weapons to break. Phalanx shields cannot be shot through — flank them or shoot when the shield opens.",
    howToFight:"Phalanxes push their shields to knock you back — stay at distance or sidestep the charge. Psions split into clones when hit with AoE — use precision weapons on the original to prevent cloning. Colossus soldiers are tanky — break their Solar shield first with matching element, then dump damage. Always use cover — Cabal have excellent sustained fire.",
    champions:"Unstoppable Incendiors, Barrier Phalanx, Overload Psions (endgame)",
    tip:"Psions will SPLIT into multiple copies if hit by a grenade or heavy AoE. Use a sniper or hand cannon to precision-kill Psions before they split. Fighting 8 Psions instead of 2 is a common new-player mistake." },
  { name:"Vex", color:C.void, shield:"Void (purple)", icon:"🤖",
    where:"Nessus, Venus (Citadel), Ishtar Sink, various strikes and raids",
    tiers:"Goblins (basic), Hobgoblins (snipers), Fanatics (explode on death), Minotaurs (tanky brawlers), Hydras (rotating shields), Harpies (flying), Wyverns (flying, brutal in endgame)",
    shields:"Hobgoblins go immune (retraction shield) when low health — they fold up and become temporarily invincible. Keep shooting — the immune phase ends and they're vulnerable again. Hydras have rotating Void shields — shoot between shield gaps.",
    howToFight:"Minotaurs teleport short distances — strafe and keep firing through the teleport. Hobgoblins immune phase WILL end — don't stop. Wyverns are the most dangerous standard Vex — they fire rotating beam patterns from mid-air. Prioritize them. Fanatics have a golden glow and rush you — shoot them before they reach melee range or they explode.",
    champions:"Overload Minotaurs, Barrier Hobgoblins (endgame)",
    tip:"Hobgoblin immune phase is a reflex trigger for many players to stop shooting. Don't. Keep pressure on — the phase is brief and they're full health again the moment it ends. You waste more time waiting than shooting through it." },
  { name:"Taken", color:C.void, shield:"Void (purple)", icon:"👁️",
    where:"Dreaming City, Destinations invaded by Taken, Last Wish raid, various story missions",
    tiers:"Taken versions of every other faction — Thralls, Acolytes, Knights, Wizards, Phalanxes, Captains, Hobgoblins, Centurions, Psions, Minotaurs",
    shields:"Taken Phalanxes have shields that face INWARD — you cannot shoot through from the front or behind. Flank 90 degrees to hit them. Same Void shields as standard enemies but Taken variants often have modified behaviors.",
    howToFight:"Taken enemies have modified behaviors compared to their base faction. Taken Knights fire a volley of Void projectiles in a spread — dodge sideways. Taken Captains go invisible briefly before teleporting. Taken Wizards have an exploding eye projectile that tracks. Taken Psions clone constantly without AoE weakness. Taken Minotaurs leave suppression orbs on death — don't stand where they died.",
    champions:"Varies by encounter — often Barrier and Overload Taken",
    tip:"Taken enemies leave Void suppression pools when they die in some encounters. Move immediately after killing a group to avoid standing in residual damage." },
  { name:"Scorn", color:C.void, shield:"Arc (some units)", icon:"💀",
    where:"Dreaming City, Tangled Shore, various missions",
    tiers:"Lurkers (weak), Ravagers (flail melee), Raiders (Void snipers + teleport), Wraiths (flyers), Screebs (explosive rushers — Scorn's Cursed Thrall equivalent), Stalkers (invisible hunters), Abominations (heavy Arc giants)",
    shields:"Raiders have brief Void invincibility when they teleport — wait it out, they reappear immediately. Abominations have no shields but high health.",
    howToFight:"Screebs are the #1 threat — they rush and explode like Cursed Thralls but are faster. Shoot them the moment they appear. Raiders teleport and grant themselves temporary invulnerability — wait for the shimmer to drop then shoot. Wraiths are fragile but harass from angles — use any rapid weapon. Abominations fire Arc bolts slowly but hit hard — use cover and engage from distance.",
    champions:"Overload Raiders, Unstoppable Abominations (endgame)",
    tip:"The Screeb rush is the Scorn's most dangerous tactic. In dense Scorn encounters, always keep part of your attention on what's moving toward you at ground level. A Screeb explosion at full speed can one-shot you in high-difficulty content." },
  { name:"Dread (The Witness's Army)", color:C.strand, shield:"Strand/Stasis", icon:"🌑",
    where:"The Pale Heart, Salvation's Edge raid, endgame Final Shape content",
    tiers:"Husks (basic), Grim (flying snipers), Attendants (support casters), Tormentors (mid-boss tier), Subjugators (elite casters — Strand or Stasis variant)",
    shields:"Subjugators have Strand (green) or Stasis (blue) shields depending on variant. Tormentors have large health pools and unique suppression auras — no traditional shield.",
    howToFight:"Tormentors have a SUPPRESSION AURA — standing too close removes your abilities. Stay at distance and use weapons only for Tormentor fights. Tormentors have weakpoints on their shoulders — precision shots there deal massive bonus damage. Grim snipers are lethal at range — prioritize them over closer enemies. Husks swarm but are fragile. Subjugators spam dangerous Strand/Stasis projectiles from range — break their shields fast and burst them.",
    champions:"Barrier and Unstoppable variants in endgame Dread content",
    tip:"Tormentor shoulder weakpoints are the most important mechanical knowledge for The Pale Heart content. Every Tormentor fight becomes significantly faster when you hit the glowing pads on their shoulders instead of the body." },
];

const CHAMPION_TYPES = [
  { type:"Barrier Champion", color:C.arc, icon:"🛡️",
    identify:"Orange health bar. Will put up an energy shield and regenerate health to full if not interrupted.",
    counter:"Anti-Barrier weapon perk (Artifact mod on specific weapon types each season). When weapon with Anti-Barrier is fired at the shield, it penetrates and staggers the Champion, dropping the shield.",
    tip:"If a Barrier Champion puts up its shield and you don't have Anti-Barrier, wait. The shield drops after a few seconds. Then re-engage." },
  { type:"Overload Champion", color:C.void, icon:"🌀",
    identify:"Orange health bar with a swirling symbol. Constantly regenerates health — will heal through all damage unless interrupted.",
    counter:"Overload weapon perk (Artifact mod). Landing shots with an Overload weapon interrupts the regeneration and stuns the Champion for a moment — deal damage fast during the stun.",
    tip:"You must keep applying Overload stuns or the Champion heals back to full between each shot. Burst it down in the stun window — don't let it breathe." },
  { type:"Unstoppable Champion", color:C.solar, icon:"⛔",
    identify:"Orange health bar with a stop-sign symbol. Cannot be staggered or interrupted by normal means. Charges and attacks through most damage.",
    counter:"Unstoppable weapon perk (Artifact mod). Aiming down sights or charging the weapon with the Unstoppable perk causes a buff — next shot stuns the Champion.",
    tip:"For Unstoppable Champions, the stun is everything — deal as much damage as possible in the 3-4 second stun window before it recovers. Heavy ammo during the stun window deletes most Unstoppable Champions immediately." },
];

// ─── TABS + COLORS ────────────────────────────────────────────────────────────
const TABS = ["BASICS","CLASSES","EXPANSIONS","ACTIVITIES","FARMING","QUESTS","ORNAMENTS","BOUNTIES","WEAPON UPGRADES","ARMOR & STATS","BUILD CRAFTING","VENDORS","LOADOUTS","LOST SECTORS","ENEMIES"];
const TAB_COLORS = { BASICS:C.blue, CLASSES:C.gold, EXPANSIONS:C.purple, ACTIVITIES:C.orange, FARMING:C.green, QUESTS:C.cyan, ORNAMENTS:C.pink, BOUNTIES:C.teal, "WEAPON UPGRADES":C.solar, "ARMOR & STATS":C.arc, "BUILD CRAFTING":C.prismatic, VENDORS:C.strand, LOADOUTS:C.gold, "LOST SECTORS":C.teal, ENEMIES:C.red };
const LOADOUTS = {
  hunter: [
    { rank:"S", name:"Celestial Nighthawk — Boss Nuke", subclass:"Prismatic", subColor:C.prismatic,
      exotic:"Celestial Nighthawk (Helmet)", exoticWeapon:"Still Hunt (Special Sniper)",
      aspects:["Gunpowder Gamble","Winter's Shroud"],
      stats:"100 Resilience · 70+ Discipline · 70+ Intellect",
      loop:"Celestial Nighthawk converts Golden Gun into one massive golden shot that deals enormous damage. Pair with Still Hunt — using Golden Gun charges Still Hunt's own Golden Gun meter, effectively doubling your boss DPS window. Best single-target damage per window in the game. Use Marksman's Dodge near enemies to recharge melee, feed into Transcendence for ability energy, then pop both supers during the same DPS phase.",
      best:"Raid boss DPS checks, dungeon final bosses, any timed damage window",
      tip:"Stagger your Golden Gun and Still Hunt — use one, then the other. Two golden gun burst windows in a single DPS phase. Absolutely destroys any boss with a vulnerability window." },
    { rank:"S", name:"Combination Blow — Melee Loop", subclass:"Prismatic", subColor:C.prismatic,
      exotic:"Gifted Conviction (Chest) or Liar's Handshake (Arms)",
      exoticWeapon:"Praxic Blade (Heavy Sword) — strongly recommended",
      aspects:["Combination Blow","Winter's Shroud (Stasis)"],
      stats:"100 Resilience · 80–100 Strength · 60 Mobility (for Dodge uptime)",
      loop:"Combination Blow stacks melee damage multiplier up to 3× with each kill. Gambler's Dodge recharges melee when you dodge near enemies — keeping the loop alive. Each Combination Blow kill also generates ability energy, healing, and feeds Transcendence. With Liar's Handshake, a Cross Counter melee heals you to full. This loop never stops — you punch everything, everything dies, you stay alive.",
      best:"Grandmaster Nightfalls, Master raids, solo dungeons, high ad-density content",
      tip:"Praxic Blade's heavy blocking refunds HP during heavy pressure phases. Use it to tank through enemy fire then re-enter the punch loop. The build has essentially infinite survivability once the rhythm clicks." },
    { rank:"A", name:"Crackshot — Self-Healing Gunslinger", subclass:"Solar", subColor:C.solar,
      exotic:"Young Ahamkara's Spine (Arms)",
      exoticWeapon:"Any solar primary — Sunshot catalyst recommended",
      aspects:["Crackshot (new 9.7.0 Aspect)","Acrobat's Dodge"],
      stats:"100 Resilience · 80+ Discipline · 60+ Strength",
      loop:"Crackshot fires up to 3 scorching shots at marked targets when you activate your class ability — landing all 3 cures corruption and heals you. Young Ahamkara's Spine dramatically extends Tripmine Grenade duration and gives increased grenade throw distance. Acrobat's Dodge is usable airborne — dodge mid-air to fire Crackshot shots from elevated angles. Excellent self-sustaining solo build.",
      best:"Solo content, difficult patrol zones, solo dungeon runs, aggressive skirmish play",
      tip:"Use Acrobat's Dodge from cover — pop into the air, dodge, land 3 Crackshot hits, drop back behind cover. The aerial angles make this build extremely hard to punish in any open area." },
    { rank:"A", name:"Nightstalker Tether — Team Support", subclass:"Void", subColor:C.void,
      exotic:"Orpheus Rig (Legs) or Sixth Coyote (Chest)",
      exoticWeapon:"Any weapon — Void primary preferred for Volatile Rounds",
      aspects:["Vanishing Step","Stylish Executioner"],
      stats:"100 Resilience · 80+ Discipline · 60+ Recovery",
      loop:"Shadowshot Deadfall tethers groups of enemies, weakening them (30% damage debuff) and suppressing their abilities. Orpheus Rig restores Super energy from tethered targets — a single large group can almost fully recharge the Super. Use invis from Stylish Executioner to reposition after kills, stay alive, and re-engage. Volatile Rounds from Volatile Flow mod make Void weapons explode on hit.",
      best:"Raids (Weaken is the most valuable team debuff), Grandmaster Nightfalls in squads, any grouped high-health enemy content",
      tip:"Tether is one of the most team-valuable things in Destiny 2. The Weaken debuff stacks with everything else. Place tether on the boss at the start of every DPS phase — your squad's damage goes up 30% instantly." },
    { rank:"A", name:"Arc Combination Blow — Lightning Loop", subclass:"Arc", subColor:C.arc,
      exotic:"Liar's Handshake (Arms)",
      exoticWeapon:"Any Arc weapon — Thunderlord or Riskrunner with Catalyst",
      aspects:["Combination Blow","Flow State"],
      stats:"100 Resilience · 80–100 Strength · 60 Mobility",
      loop:"Pure Arc melee loop. Combination Blow works identically to Prismatic version but adds Jolted (Arc damage multiplier) to enemies with each stack. Flow State grants Amplified on Blind or Jolt kills — Amplified boosts movement and weapon handling. Liar's Handshake Cross Counter heals you. Arc Soul from Empowering Rift can supplement while you recharge. Riskrunner with Chain Reaction catalyst adds even more chain lightning.",
      best:"High ad-density content, playlist farming, Arc Surge weeks in Nightfalls",
      tip:"Arc variant of Combo Blow has slightly less survivability than Prismatic but the damage output with full Jolt stacks can exceed it. Best choice on Arc Surge weeks — every punch hits harder." },
  ],
  titan: [
    { rank:"S", name:"Stoicism Consecration — The All-Rounder", subclass:"Prismatic", subColor:C.prismatic,
      exotic:"Spirit of Synthoceps + Spirit of Inmost Light (Exotic Class Item)",
      exoticWeapon:"Praxic Blade (Heavy Sword) or Gjallarhorn (Heavy Rocket)",
      aspects:["Consecration","Drengr's Lash"],
      stats:"100 Resilience · 80+ Strength · 70+ Discipline",
      loop:"The endgame Titan standard. Barricade deploys and Drengr's Lash creates a Strand burst that suspends nearby enemies. Then: slide into Consecration slam — ignites and scorches everything nearby. Synthoceps gives +200% melee damage when 3+ enemies are close. Knockout heals you for every melee kill. Inmost Light refunds ability energy so the cycle never stops. Thundercrash covers boss damage phases. The loop: Barricade → Suspend group → Consecration slam → Repeat.",
      best:"Everything — Grandmaster Nightfalls, Master raids, solo dungeons, playlist farming",
      tip:"This build is genuinely good at everything. If you only build one Titan loadout, make it this one. The Exotic Class Item perk combo of Synthoceps + Inmost Light is what makes it complete — farm it." },
    { rank:"A", name:"Shieldburst + Hallowfire Heart — Solar Support", subclass:"Solar", subColor:C.solar,
      exotic:"Hallowfire Heart (Chest) — reworked in 9.7.0",
      exoticWeapon:"Any Solar weapon — Sunshot or Lord of Wolves with Catalyst",
      aspects:["Shieldburst (new 9.7.0 Aspect)","Roaring Flames"],
      stats:"100 Resilience · 80+ Discipline · 70+ Strength",
      loop:"Shieldburst is the new 9.7.0 Aspect: Towering Barricade slides forward as mobile cover that grants scorching rounds to allies' Solar and Kinetic weapons. Reworked Hallowfire Heart regenerates ALL abilities faster while Super is charged AND boosts Super damage. Stack Roaring Flames for escalating Hammer damage. Excellent team support build — you make your squad's primary weapons scorch targets just by deploying your barricade.",
      best:"Raids and dungeons with heavy add phases, content where team damage buffs matter, Solar Surge weeks",
      tip:"Hallowfire's rework in 9.7.0 made this genuinely competitive with Prismatic for team-focused play. The scorching rounds buff from Shieldburst applies to every ally near the barricade — your whole squad's primaries start igniting everything." },
    { rank:"A", name:"Behemoth Shatter Nuke — Stasis", subclass:"Stasis", subColor:C.stasis,
      exotic:"Icefall Mantle (Arms) or Blastwave Striders (Legs)",
      exoticWeapon:"Any primary — Parasite heavy grenade launcher for burst",
      aspects:["Howl of the Storm","Tectonic Harvest"],
      stats:"100 Resilience · 80+ Discipline · 70+ Strength",
      loop:"Howl of the Storm melee creates a wave of Stasis crystals on sprint melee. Tectonic Harvest generates Stasis shards from destroying crystals (which grant melee energy and resistance). Diamond Lance creates ice spears from Stasis crystal/frozen enemy destruction — throw them for instant freeze. The combo: sprint melee to create crystals → destroy crystals to generate shards → shards feed next melee → freeze chained groups → shatter for massive AoE damage burst.",
      best:"Content with tight enemy clusters, Solo dungeon boss phases (freeze then shatter = huge burst), Stasis Surge weeks",
      tip:"Freeze a boss, then shatter — shatter damage is one of the highest burst damage types in the game. In a solo dungeon, freeze + Parasite + shatter can delete an entire health bar segment in seconds." },
    { rank:"A", name:"Thundercrash — Boss Missile", subclass:"Arc", subColor:C.arc,
      exotic:"Cuirass of the Falling Star (Chest)",
      exoticWeapon:"Arc primary of choice — MIDA Multi-Tool or Riskrunner with Catalyst",
      aspects:["Knockout","Touch of Thunder"],
      stats:"100 Resilience · 80+ Intellect · 60+ Strength",
      loop:"Simple and devastating. Thundercrash + Cuirass of the Falling Star is the highest single-Super damage output in the game — you become a human missile. Knockout heals on melee kills and amplifies you. Touch of Thunder supercharges Flashbang grenades (blind, which is a Champion stun). Stack Intellect for faster Super recharge between phases. In a long boss fight, Thundercrash → charged melee loop → Thundercrash again does more consistent damage than many complex builds.",
      best:"Raid boss phases, dungeon DPS checks, any fight with frequent damage windows",
      tip:"Thundercrash with Cuirass does so much damage that it's sometimes worth banking the Super early in a phase rather than aligning it perfectly. The window is short — learn the timing and fire as close to the boss's crit spot as possible." },
    { rank:"A", name:"Sentinel Ward of Dawn — Team Anchor", subclass:"Void", subColor:C.void,
      exotic:"Mask of the Quiet One (Helmet) or Heart of Inmost Light (Chest)",
      exoticWeapon:"Any weapon — Void primary for Volatile Rounds",
      aspects:["Controlled Demolition","Bastion"],
      stats:"100 Resilience · 80+ Discipline · 60+ Recovery",
      loop:"Ward of Dawn creates an indestructible dome that grants Weapons of Light to all allies inside (+25% weapon damage). This buff doesn't stack additively — it multiplies. In a raid DPS phase: pop Ward of Dawn, everyone steps in, exits with Weapons of Light active, and every weapon does 25% more damage for the window. Heart of Inmost Light empowers abilities on use — using barricade empowers your grenade and melee for massive damage.",
      best:"Raids where DPS phases have a specific timer, content where team survivability is critical, carrying new players through hard content",
      tip:"Ward of Dawn + Weapons of Light + Surge mods + Well of Radiance from a Warlock = the highest possible sustained team DPS multiplier in the game. If your raid team runs this combo every phase, you'll never fail a DPS check." },
  ],
  warlock: [
    { rank:"S", name:"Getaway Artist — Turret Comfort", subclass:"Prismatic", subColor:C.prismatic,
      exotic:"Getaway Artist (Arms) — consumes grenade for permanent Arc Soul turret",
      exoticWeapon:"Any weapon — Khvostov 7G-0X Primary or Outbreak Perfected",
      aspects:["Feed the Void (Devour)","Bleak Watcher"],
      stats:"100 Resilience · 80+ Recovery · 70+ Discipline",
      loop:"Consume your grenade with Getaway Artist → spawns a supercharged Arc Soul turret that shoots autonomously. Then deploy a Bleak Watcher Stasis turret from your grenade — two automatic turrets clear ads while you focus on staying alive and repositioning. Devour (from Feed the Void) triggers on any grenade kill — full heal plus extended Devour timer. You're essentially fielding two AI companions who never stop shooting. Healing Rift covers gap moments.",
      best:"Grandmaster Nightfalls, Master raids (most forgiving endgame build), learning hard content, any content where staying alive matters more than maximum DPS",
      tip:"This is the most beginner-friendly endgame build in the game. It carries itself — the turrets clear constantly, Devour keeps you healed, and you have huge error tolerance. Start here before attempting more complex builds." },
    { rank:"A", name:"Soul Siphon Voidwalker — Room Delete", subclass:"Void", subColor:C.void,
      exotic:"Skull of Dire Ahamkara (Helmet) or Nezarec's Sin (Helmet) or Mantle of Battle Harmony (Chest)",
      exoticWeapon:"Outbreak Perfected Primary or Void heavy of choice",
      aspects:["Soul Siphon (new 9.7.0 Aspect)","Chaos Accelerant"],
      stats:"100 Resilience · 80+ Discipline · 70+ Recovery",
      loop:"Soul Siphon melee channels Void energy to drain health from crowds — hitting multiple enemies gives overshield and class ability energy. Chaos Accelerant overcharges Void grenades (makes them track and chain-explode). Child of the Old Gods attaches a Void soul that suppresses on attach. Skull of Dire Ahamkara restores Super energy on Nova Bomb kill — in a dense room, one Nova Bomb refunds almost the full Super. Devour active = every kill heals to full.",
      best:"High-density add content, any room with 10+ enemies, aggressive Nightfall clearing, Void Surge weeks",
      tip:"Soul Siphon drains multiple enemies simultaneously — position yourself in the CENTER of groups, not the edge. Drain 5+ enemies at once for maximum overshield and energy return. With Skull, a fully charged Nova Bomb in that same group refunds nearly the full Super." },
    { rank:"A", name:"Stormdancer's Brace — Arc Trance", subclass:"Arc", subColor:C.arc,
      exotic:"Stormdancer's Brace (Chest) or Crown of Tempests (Helmet)",
      exoticWeapon:"Riskrunner with Chain Reaction Catalyst, Bad Juju (Primary)",
      aspects:["Ionic Sentry","Arc Soul"],
      stats:"100 Resilience · 80+ Recovery · 70+ Intellect",
      loop:"Stormtrance Super chains lightning between enemies and each kill extends its duration with Stormdancer's Brace. Ionic Sentry places a turret that jolts nearby enemies (Jolted = take more Arc damage, chain lightning on kill). Arc Soul from Rift adds a third persistent damage source. Bad Juju fills Super energy on every kill. Crown of Tempests extends Stormtrance duration even further — you can chain a near-infinite lightning Super through dense rooms.",
      best:"Playlist grinding, Arc Surge weeks, content where you want to feel like a god, extended Super duration contests",
      tip:"Bad Juju is the engine here — every kill gives Super energy. In a room of 20 enemies, you can exit the Super with significant energy already recharged. Stormtrance → Bad Juju kills → Stormtrance again with minimal downtime." },
    { rank:"S", name:"Well of Radiance — Team Support", subclass:"Solar", subColor:C.solar,
      exotic:"Boots of the Assembler (Legs) or Phoenix Protocol (Chest)",
      exoticWeapon:"Eunoia (new — pairs with Hellion Aspect for neutral game) OR any primary",
      aspects:["Hellion","Heat Rises"],
      stats:"100 Resilience · 80+ Recovery · 70+ Discipline",
      loop:"Well of Radiance is the most team-valuable Super in Destiny 2 — plant it, all allies inside gain a Restoration x2 buff (constant healing) and Radiant (increased weapon damage). Boots of the Assembler extends the Well duration and spawns Noble Seekers that travel to allies outside the Well and give them the buff remotely. Phoenix Protocol restores Super energy from kills inside the Well — with a good team, the Super is nearly always recharged. Hellion fires a Solar Flare from your Rift for free neutral ad-clear.",
      best:"Raids (essential for every DPS phase), Master content, any team activity where keeping everyone alive matters",
      tip:"You are the backbone of every raid team as a Well Warlock. Plant Well at the start of every DPS phase — everyone else's job is to stand in it and do damage. Coordinate with a Titan running Ward of Dawn: Well + Ward + Weapons of Light is the maximum team damage state." },
    { rank:"A", name:"Osmiomancy Gloves — Freeze Everything", subclass:"Stasis", subColor:C.stasis,
      exotic:"Osmiomancy Gloves (Arms) — reworked Coldsnap tracking",
      exoticWeapon:"Parasite (Heavy Grenade Launcher) or Icebreaker for synergy",
      aspects:["Bleak Watcher","Glacial Harvest"],
      stats:"100 Resilience · 100 Discipline · 60+ Recovery",
      loop:"Osmiomancy Gloves give Coldsnap Grenades aggressive homing tracking and an extra charge — throw one, it tracks and chains freeze to every nearby enemy. Bleak Watcher converts your grenade into a Stasis turret (use second charge). Glacial Harvest creates Stasis Shards from frozen targets — shards generate class ability energy. The freeze loop: Coldsnap tracks → multiple enemies freeze → Shards spawn → class energy recharges → throw another Coldsnap. With 100 Discipline, Coldsnap is nearly always available.",
      best:"Content with tightly packed enemies, solo dungeon encounters, Stasis Surge weeks, crowd control situations",
      tip:"One Coldsnap with Osmiomancy can freeze a room of 12+ enemies in a chain. The tracking is aggressive enough to curve around cover. Use this in any situation where controlling large groups of enemies is more important than raw damage output." },
  ],
};

// ─── ORNAMENTS ───────────────────────────────────────────────────────────────
const ORNAMENTS = [
  { name:"Bright Dust — The Free Currency", color:C.teal, icon:"💠",
    how:"Bright Dust is the free in-game currency used to buy cosmetics from the Eververse store — including armor ornaments, weapon ornaments, shaders, ships, sparrows, and emotes. Cannot be purchased directly, only earned through gameplay.",
    sources:["Seasonal Challenges (largest source — check challenge list for the Bright Dust icon)","Pathfinder track completions","Season Pass free track rewards","Vanguard Alerts — matchmade activity, 250 Bright Dust per 3 completions","Weekly Active Orders — up to 1,500 Bright Dust per week (soft cap)","Daily Challenges — 2,520 Bright Dust across a full 12-week season","Reaching Weekly Rewards Rank 17 in Seasonal Hub — 1,000 Bright Dust","Exotic Orders completions — 200 Bright Dust each, 6,000 cap per season"],
    tip:"Completing ALL Seasonal Challenges in a season earns approximately 41,500 Bright Dust. Prioritize the ones marked with the Bright Dust icon first." },
  { name:"Eververse Store — Bright Dust Cosmetics", color:C.pink, icon:"🏪",
    how:"Eververse (Tess Everis, Tower) sells a rotating daily selection of cosmetics purchasable with Bright Dust. The store resets every Tuesday at the weekly reset. In Monument of Triumph, Bungie moved to a daily direct-purchase rotation instead of time-limited slots — items cycle predictably.",
    sources:["Armor Ornaments — sets for each class, rotates weekly","Weapon Ornaments — cosmetic skins for specific weapons","Shaders — apply to armor, weapons, and Ghost shells","Ghost Shells, Ships, Sparrows","Emotes and Finishers"],
    tip:"Save Bright Dust for armor ornaments specifically — they're the most visible and have the highest value. Check the Eververse calendar (d2foundry.gg or d2planner.io) to see what's rotating this week before spending." },
  { name:"Bright Engram Focusing", color:C.purple, icon:"🔮",
    how:"In Monument of Triumph, legacy event ornaments (from Solstice, Festival of the Lost, The Dawning, Guardian Games) are no longer time-gated. They're available year-round through Bright Engram Focusing in Eververse. You spend Bright Dust to focus engrams toward specific ornament pools.",
    sources:["Festival of the Lost armor ornaments","Solstice of Heroes ornament sets","The Dawning seasonal cosmetics","Guardian Games ornaments — all now in the Bright Engram pool"],
    tip:"True Exotic Armor Transmog unlocked in Monument of Triumph — Legendary and Common armor ornaments can now be applied to Exotic armor pieces in PvE. This makes ornament hunting significantly more valuable." },
  { name:"Exotic Weapon Ornaments", color:C.solar, icon:"🗡️",
    how:"Exotic weapon ornaments change the visual appearance of specific exotic weapons. Most are earned through Eververse (Bright Dust). Some are earned by completing specific exotic quest milestones or by playing with the weapon a certain number of hours.",
    sources:["Eververse store (Bright Dust — check rotation)","Completing specific exotic weapon quests (some include an ornament as a final reward)","Catalyst completion on some weapons unlocks cosmetic changes","Bright Engram pool for legacy ornaments"],
    tip:"Once you unlock an Exotic Ornament it's permanently in your Collections — it unlocks the ornament slot on ALL instances of that exotic. You never lose access to it." },
  { name:"Armor Transmog (Synthweave / Armor Synthesis)", color:C.arc, icon:"🧵",
    how:"Armor Synthesis lets you convert any armor piece you've collected into a universal ornament, letting you wear any armor's appearance on any stats roll. Use the loom in the Tower to convert armor using Synthweave Bolts.",
    sources:["Synthweave Bolts: earned from Ada-1 quests and seasonal content","Complete Eva Levante's Armor Synthesis bounties for Synthweave","Each character class has a limit per season — manage across all 3 characters"],
    tip:"Transmog your favorite-looking armor sets as soon as you collect them. The visual appearance is permanently unlocked in your Collections even if you shard the original piece." },
  { name:"Raid and Dungeon Exclusive Cosmetics", color:C.gold, icon:"⚔️",
    how:"Every raid and dungeon has exclusive armor and weapon appearance sets that only drop inside. These cannot be obtained any other way — not from Eververse, not from vendors. They drop from encounter completions and final boss chests.",
    sources:["Raid armor sets — unique per raid (Last Wish, Garden of Salvation, Deep Stone Crypt, Vow of the Disciple, Root of Nightmares, Salvation's Edge, Desert Perpetual)","Dungeon armor sets — unique per dungeon (Shattered Throne, Pit of Heresy, Prophecy, etc.)","Raid Exotic weapons drop from specific encounters"],
    tip:"Raid armor in Destiny 2 is almost always the best-looking in the game. Set a goal to complete each raid at least once for the full armor set appearance. They're permanently in Collections once earned." },
];

// ─── BOUNTIES / ORDERS ───────────────────────────────────────────────────────
const BOUNTIES = [
  { name:"Pathfinder — The Main Progression System", color:C.blue, icon:"🗺️",
    how:"Pathfinder replaced the traditional bounty grid with a branching path of objectives. Each step of the Pathfinder gives XP toward your Artifact Power bonus, vendor reputation, and seasonal rewards. Pathfinder is tied to the core playlists — Vanguard Strikes, Crucible, and Gambit.",
    complete:"Pathfinder objectives are listed in the Director. Complete the branching paths by playing the suggested activities. Each node gives XP. Reaching the end of a branch rewards an Engram or Bright Dust.",
    tip:"Do Pathfinder objectives that align with what you're already playing. Don't go out of your way for a Pathfinder node that requires content you don't enjoy — XP accumulates from all nodes regardless of order." },
  { name:"Vanguard Orders (Zavala)", color:"#4f8ef7", icon:"🔵",
    how:"Zavala's Vanguard Orders are weekly activity challenges in the Strikes playlist and Nightfalls. Each completed Order gives Vanguard reputation toward the weekly milestone engram and contributes Bright Dust.",
    complete:"Strike playlist and Nightfall completions automatically progress Vanguard Orders. The weekly milestone fills after a certain number of completions — claim it from Zavala for a Powerful drop. Focused engrams from Vanguard reputation can target specific Nightfall weapons.",
    tip:"If you're grinding a specific Nightfall weapon, focus your Vanguard engrams at Zavala's kiosk to narrow the perk pool. Running the Nightfall on the week that weapon is featured gives the best drop rate." },
  { name:"Crucible Orders (Shaxx)", color:C.red, icon:"⚔️",
    how:"Lord Shaxx's Orders reward PvP play in the Crucible and Trials of Osiris. Weekly milestone fills from wins, with bonus progress from Survival and Trials completions.",
    complete:"Play any Crucible mode for progress. Wins give more reputation than losses but losses still contribute. The weekly milestone gives a Powerful drop — claim it every Tuesday reset.",
    tip:"You don't need to be good at PvP to fill the weekly Crucible milestone. Just play — losses still progress reputation. For Trials of Osiris, going to 7 wins (flawless) unlocks the exclusive passage loot." },
  { name:"Gambit Orders (The Drifter)", color:C.green, icon:"🎲",
    how:"The Drifter's Gambit Orders reward matches played in Gambit. Completions, wins, mote banking, invasions, and Primeval damage all contribute.",
    complete:"Play Gambit matches. Any completion fills the order progress — you don't need to win. The weekly milestone gives a Powerful drop.",
    tip:"Gambit is the fastest order to complete since any match outcome counts and matches are relatively short. Clear your Gambit weekly first, then spend remaining time on Vanguard and Crucible." },
  { name:"Gunsmith Orders (Banshee-44)", color:C.orange, icon:"🔫",
    how:"Banshee-44's Orders reward weapon kills and specific weapon-type challenges. Completing them gives Gunsmith reputation and Upgrade Modules — essential for Masterworking weapons.",
    complete:"Kill enemies with specific weapon types (auto rifles, snipers, fusion rifles, etc.) as specified in each Order. These can be done in any activity — patrol zones are the most efficient.",
    tip:"Stack Gunsmith Orders with Pathfinder objectives. If a Gunsmith Order wants SMG kills and your Pathfinder wants Strikes progress, use an SMG in your Strike to complete both simultaneously." },
  { name:"Seasonal Hub Challenges", color:C.prismatic, icon:"🌟",
    how:"The Seasonal Hub (opened from your Director) tracks all current season objectives including the main Seasonal Challenges. These are longer-form objectives that reward large XP chunks, Bright Dust, and seasonal resources.",
    complete:"Open the Seasonal Hub from the Director. Browse available challenges. Challenges with the Bright Dust icon give the currency directly on completion. The Large Bright Dust Pile bonus unlocks for completing the majority of seasonal challenges.",
    tip:"Knock out Seasonal Challenges in batches — many share the same activity (play 10 Nightfalls, defeat 200 Fallen, etc.) and can be progressed simultaneously rather than one at a time." },
  { name:"Exotic Orders (Tess Everis)", color:C.teal, icon:"💜",
    how:"Eververse's Exotic Orders are special objectives that reward 200 Bright Dust each and have a cap of 30 completions per season (6,000 total Bright Dust). They rotate weekly and require completing specific high-value activities.",
    complete:"Check Tess Everis in the Tower for the current active Exotic Orders. Usually tied to completing a Nightfall, raid encounter, or dungeon. Complete them before the weekly reset.",
    tip:"Exotic Orders are time-gated per week — don't stack them. Complete this week's before reset, then do next week's fresh. Missing a week loses that Bright Dust permanently." },
  { name:"Destination Vendor Orders", color:C.strand, icon:"📍",
    how:"Each destination has a vendor (Failsafe on Nessus, Hawthorne in the Tower, Shaw Han in Cosmodrome, Devrim Kay in EDZ, etc.) with their own Orders. These reward destination materials and reputation toward destination-specific engrams.",
    complete:"Patrol each destination and kill enemies, open chests, and complete public events to fill destination Orders. Claim rewards from the destination vendor when the reputation bar fills.",
    tip:"Destination Orders are efficient to complete during patrol. The Heroic Public Event bonus clears multiple destination orders at once — always trigger the Heroic version." },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function Destiny2Guide() {
  const [tab, setTab] = useState("BASICS");
  const [expanded, setExpanded] = useState(null);
  const [classExpanded, setClassExpanded] = useState(null);
  const [classFilter, setClassFilter] = useState("hunter");
  const [questCat, setQuestCat] = useState("all");
  const [search, setSearch] = useState("");
  const f = (s) => (s||"").toLowerCase().includes(search.toLowerCase());

  return (
    <div style={{...F, background:C.bg, minHeight:"100vh", color:C.text}}>
      <div style={{position:"fixed",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(79,142,247,0.007) 3px,rgba(79,142,247,0.007) 6px)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"relative",zIndex:1,maxWidth:960,margin:"0 auto",padding:"20px 16px"}}>

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:22}}>
          <div style={{display:"inline-block",border:`1px solid ${C.blue}44`,borderTop:`2px solid ${C.blue}`,padding:"3px 18px",marginBottom:6}}>
            <span style={{fontSize:10,letterSpacing:5,color:`${C.blue}88`}}>BUNGIE · 2017–2026 · MONUMENT OF TRIUMPH FINAL SANDBOX</span>
          </div>
          <h1 style={{fontSize:22,fontWeight:900,letterSpacing:3,margin:"5px 0 3px",color:C.textBright,textTransform:"uppercase",textShadow:`0 0 24px ${C.blue}33`}}>DESTINY 2 FIELD GUIDE</h1>
          <p style={{fontSize:16,color:C.textDim,letterSpacing:2,margin:0}}>
            COMPLETE REFERENCE · 10 EXPANSIONS · 3 CLASSES · 18 SUBCLASSES · ALL ACTIVITIES
          </p>
        </div>

        {/* Tabs — 4 columns, 4 rows for 13 tabs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:3,marginBottom:16}}>
          {TABS.map(t=>{
            const col=TAB_COLORS[t]; const active=tab===t;
            return <button key={t} onClick={()=>{setTab(t);setExpanded(null);setClassExpanded(null);setSearch("");}} style={{
              padding:"10px 4px",
              background:active?`${col}12`:C.panel,
              border:active?`1px solid ${col}`:`1px solid ${C.border}`,
              borderTop:active?`2px solid ${col}`:"2px solid transparent",
              color:active?col:C.dim,cursor:"pointer",fontSize:11,letterSpacing:2,...F,fontWeight:active?700:400,
            }}>{t}</button>;
          })}
        </div>

        {/* Search */}
        <div style={{marginBottom:14,position:"relative"}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:`${C.blue}44`,fontSize:13}}>⌕</span>
          <input value={search} onChange={e=>{setSearch(e.target.value);setExpanded(null);setClassExpanded(null);}} placeholder={`SEARCH ${tab}...`}
            style={{width:"100%",boxSizing:"border-box",background:"#090b14",border:`1px solid ${C.border}`,borderLeft:`2px solid ${C.blue}44`,color:"#b8c4f0",padding:"9px 10px 9px 28px",fontSize:11,letterSpacing:1,outline:"none",...F}}/>
        </div>

        {/* ── BASICS ── */}
        {tab==="BASICS" && (
          <>
            {/* Weapon Slots */}
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{width:3,height:14,background:C.blue}}/>
                <span style={{fontSize:14,letterSpacing:4,color:C.blue,fontWeight:700}}>WEAPON SLOTS</span>
                <div style={{flex:1,height:1,background:`${C.blue}22`}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {WEAPON_SLOTS.filter(w=>!search||f(w.slot)||f(w.strength)||f(w.use)).map((w,i)=>{
                  const open=expanded===`ws-${i}`;
                  return (
                    <div key={i} style={{border:`1px solid ${open?w.color+"55":C.border}`,background:C.panel}}>
                      <div onClick={()=>setExpanded(open?null:`ws-${i}`)}
                        style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,background:open?`rgba(255,255,255,0.03)`:"transparent",borderBottom:open?`1px solid ${C.border}`:"none"}}
                        onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
                        onMouseLeave={e=>e.currentTarget.style.background=open?"rgba(255,255,255,0.03)":"transparent"}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{fontSize:16}}>{w.icon}</span>
                          <div>
                            <div style={{fontSize:18,color:C.textBright,fontWeight:700}}>{w.slot} Slot</div>
                            <div style={{fontSize:16,color:C.textDim}}>Ammo: {w.ammo}</div>
                          </div>
                        </div>
                        <span style={{color:C.blue,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
                      </div>
                      {open && (
                        <div style={{padding:"12px 14px"}}>
                          <div style={{marginBottom:8,background:`${C.blue}08`,padding:"8px 10px",borderLeft:`2px solid ${C.blue}44`}}>
                            <div style={{fontSize:12,letterSpacing:2,color:C.blue,marginBottom:3}}>DAMAGE TYPE</div>
                            <div style={{fontSize:16,color:C.text}}>{w.dmgType}</div>
                          </div>
                          <div style={{fontSize:16,color:C.text,lineHeight:1.8,marginBottom:8}}>{w.strength}</div>
                          <div style={{fontSize:16,color:C.textDim,lineHeight:1.7,marginBottom:8}}>{w.use}</div>
                          <div style={{background:`${C.gold}08`,padding:"8px 10px",borderLeft:`2px solid ${C.gold}44`,fontSize:14,color:C.gold}}>⚡ {w.tip}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ammo Types */}
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{width:3,height:14,background:C.cyan}}/>
                <span style={{fontSize:14,letterSpacing:4,color:C.cyan,fontWeight:700}}>AMMO TYPES</span>
                <div style={{flex:1,height:1,background:`${C.cyan}22`}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {AMMO_TYPES.filter(a=>!search||f(a.name)||f(a.desc)).map((a,i)=>(
                  <div key={i} style={{background:C.panel,border:`1px solid ${C.border}`,borderLeft:`3px solid ${a.color}`,padding:"11px 14px",display:"flex",gap:10,alignItems:"flex-start"}}>
                    <span style={{fontSize:15,flexShrink:0}}>{a.symbol}</span>
                    <div>
                      <div style={{fontSize:18,color:C.textBright,fontWeight:700,marginBottom:3}}>{a.name} Ammo</div>
                      <div style={{fontSize:16,color:C.textDim,lineHeight:1.6}}>{a.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Damage Types */}
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{width:3,height:14,background:C.orange}}/>
                <span style={{fontSize:14,letterSpacing:4,color:C.orange,fontWeight:700}}>ELEMENTAL DAMAGE TYPES</span>
                <div style={{flex:1,height:1,background:`${C.orange}22`}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:7}}>
                {DAMAGE_TYPES.filter(d=>!search||f(d.type)||f(d.desc)).map((d,i)=>(
                  <div key={i} style={{background:C.panel,border:`1px solid ${d.color}44`,borderTop:`2px solid ${d.color}`,padding:"10px 12px"}}>
                    <div style={{fontSize:14,color:d.color,fontWeight:700,letterSpacing:2,marginBottom:5}}>{d.type.toUpperCase()}</div>
                    <div style={{fontSize:16,color:C.textDim,lineHeight:1.6}}>{d.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Power Basics */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{width:3,height:14,background:C.gold}}/>
                <span style={{fontSize:14,letterSpacing:4,color:C.gold,fontWeight:700}}>POWER LEVEL & SYSTEMS</span>
                <div style={{flex:1,height:1,background:`${C.gold}22`}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {POWER_BASICS.filter(p=>!search||f(p.title)||f(p.body)).map((p,i)=>(
                  <div key={i} style={{background:C.panel,border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.gold}`,padding:"11px 14px"}}>
                    <div style={{fontSize:18,color:C.textBright,fontWeight:700,marginBottom:5}}>{p.title}</div>
                    <div style={{fontSize:16,color:C.textDim,lineHeight:1.7}}>{p.body}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── CLASSES ── */}
        {tab==="CLASSES" && (
          <>
            <div style={{fontSize:16,color:C.textDim,letterSpacing:2,marginBottom:14}}>
              3 CLASSES · 6 SUBCLASSES EACH · YOU CAN HAVE ONE OF EACH CLASS — RUN ALL 3 FOR MAX REWARDS
            </div>
            {CLASSES.filter(c=>!search||f(c.name)||f(c.role)||f(c.playstyle)).map((cls,ci)=>{
              const open=classExpanded===ci;
              return (
                <div key={ci} style={{border:`1px solid ${open?cls.color+"66":C.border}`,marginBottom:10,background:C.panel}}>
                  {/* Class header */}
                  <div onClick={()=>setClassExpanded(open?null:ci)}
                    style={{padding:"14px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,background:open?`${cls.color}08`:"transparent",borderBottom:open?`1px solid ${C.border}`:"none"}}
                    onMouseEnter={e=>e.currentTarget.style.background=`${cls.color}0a`}
                    onMouseLeave={e=>e.currentTarget.style.background=open?`${cls.color}08`:"transparent"}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:5,flexWrap:"wrap"}}>
                        <span style={{fontSize:22,color:cls.color,fontWeight:900,letterSpacing:2}}>{cls.name.toUpperCase()}</span>
                        <span style={{fontSize:14,color:cls.color,background:`${cls.color}15`,border:`1px solid ${cls.color}44`,padding:"2px 8px",letterSpacing:2}}>{cls.role}</span>
                      </div>
                      <div style={{fontSize:16,color:C.textDim}}>{cls.playstyle}</div>
                    </div>
                    <span style={{color:cls.color,fontSize:14,flexShrink:0,marginTop:2}}>{open?"▲":"▼"}</span>
                  </div>

                  {open && (
                    <div style={{padding:"14px 16px"}}>
                      {/* Class info */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                        <div style={{background:`${cls.color}08`,padding:"8px 10px",borderLeft:`2px solid ${cls.color}44`}}>
                          <div style={{fontSize:12,letterSpacing:2,color:cls.color,marginBottom:3}}>CLASS ABILITY</div>
                          <div style={{fontSize:16,color:C.text,lineHeight:1.6}}>{cls.ability}</div>
                        </div>
                        <div style={{background:`${cls.color}08`,padding:"8px 10px",borderLeft:`2px solid ${cls.color}44`}}>
                          <div style={{fontSize:12,letterSpacing:2,color:cls.color,marginBottom:3}}>JUMP</div>
                          <div style={{fontSize:16,color:C.text,lineHeight:1.6}}>{cls.jump}</div>
                        </div>
                        <div style={{background:`${C.green}08`,padding:"8px 10px",borderLeft:`2px solid ${C.green}44`}}>
                          <div style={{fontSize:12,letterSpacing:2,color:C.green,marginBottom:3}}>PvE STRENGTHS</div>
                          <div style={{fontSize:16,color:C.text,lineHeight:1.6}}>{cls.pve}</div>
                        </div>
                        <div style={{background:`${C.red}08`,padding:"8px 10px",borderLeft:`2px solid ${C.red}44`}}>
                          <div style={{fontSize:12,letterSpacing:2,color:C.red,marginBottom:3}}>PvP STRENGTHS</div>
                          <div style={{fontSize:16,color:C.text,lineHeight:1.6}}>{cls.pvp}</div>
                        </div>
                      </div>
                      {cls.avoid && (
                        <div style={{background:`${C.orange}08`,padding:"8px 10px",borderLeft:`2px solid ${C.orange}44`,marginBottom:14,fontSize:16,color:C.textDim}}>
                          <span style={{color:C.orange,fontWeight:700}}>⚠ Heads up: </span>{cls.avoid}
                        </div>
                      )}

                      {/* Subclasses */}
                      <div style={{fontSize:11,letterSpacing:3,color:C.dim,marginBottom:10}}>SUBCLASSES</div>
                      <div style={{display:"flex",flexDirection:"column",gap:7}}>
                        {cls.subclasses.filter(s=>!search||f(s.name)||f(s.playstyle)||f(s.key)).map((sub,si)=>{
                          const skey=`sub-${ci}-${si}`;
                          const sopen=expanded===skey;
                          return (
                            <div key={si} style={{border:`1px solid ${sopen?sub.color+"55":C.border}`,background:sopen?`${sub.color}05`:"#0d0f1a"}}>
                              <div onClick={()=>setExpanded(sopen?null:skey)}
                                style={{padding:"10px 12px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,borderBottom:sopen?`1px solid ${C.border}`:"none"}}
                                onMouseEnter={e=>e.currentTarget.style.background=`${sub.color}08`}
                                onMouseLeave={e=>e.currentTarget.style.background=sopen?`${sub.color}05`:"#0d0f1a"}>
                                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                                  <span style={{fontSize:15,color:sub.color,fontWeight:700}}>{sub.name}</span>
                                  <span style={{fontSize:14,color:sub.color,background:`${sub.color}15`,border:`1px solid ${sub.color}33`,padding:"1px 6px",letterSpacing:1}}>{sub.element.toUpperCase()}</span>
                                </div>
                                <span style={{color:sub.color,fontSize:13,flexShrink:0}}>{sopen?"▲":"▼"}</span>
                              </div>
                              {sopen && (
                                <div style={{padding:"10px 12px"}}>
                                  <div style={{marginBottom:8}}>
                                    <div style={{fontSize:12,letterSpacing:2,color:sub.color,marginBottom:3}}>SUPER</div>
                                    <div style={{fontSize:16,color:C.text,lineHeight:1.6}}>{sub.super}</div>
                                  </div>
                                  <div style={{marginBottom:8,fontSize:16,color:C.textDim,lineHeight:1.7}}>{sub.playstyle}</div>
                                  <div style={{background:`${sub.color}08`,padding:"7px 10px",borderLeft:`2px solid ${sub.color}44`,fontSize:14,color:sub.color}}>
                                    🔑 {sub.key}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ── EXPANSIONS ── */}
        {tab==="EXPANSIONS" && (
          <>
            <div style={{fontSize:16,color:C.textDim,letterSpacing:2,marginBottom:14}}>
              10 EXPANSIONS TOTAL · GAME IS IN FINAL STATE (MONUMENT OF TRIUMPH, JUNE 2026) · ALL CONTENT PLAYABLE FOREVER
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {EXPANSIONS.filter(e=>!search||f(e.name)||f(e.adds)||f(e.unlocks)).map((exp,i)=>{
                const open=expanded===`exp-${i}`;
                return (
                  <div key={i} style={{border:`1px solid ${open?exp.color+"55":C.border}`,background:C.panel}}>
                    <div onClick={()=>setExpanded(open?null:`exp-${i}`)}
                      style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,background:open?`${exp.color}08`:"transparent",borderBottom:open?`1px solid ${C.border}`:"none"}}
                      onMouseEnter={e=>e.currentTarget.style.background=`${exp.color}0a`}
                      onMouseLeave={e=>e.currentTarget.style.background=open?`${exp.color}08`:"transparent"}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:3}}>
                          <span style={{fontSize:18,color:C.textBright,fontWeight:700}}>{exp.name}</span>
                          <span style={{fontSize:14,color:exp.color,background:`${exp.color}15`,border:`1px solid ${exp.color}44`,padding:"2px 6px"}}>{exp.year}</span>
                          <span style={{fontSize:16,color:C.textDim,letterSpacing:1}}>{exp.status}</span>
                        </div>
                        <div style={{fontSize:16,color:C.textDim}}>{exp.note}</div>
                      </div>
                      <span style={{color:exp.color,fontSize:14,flexShrink:0,marginTop:2}}>{open?"▲":"▼"}</span>
                    </div>
                    {open && (
                      <div style={{padding:"12px 14px"}}>
                        <div style={{marginBottom:8,background:`${exp.color}08`,padding:"8px 10px",borderLeft:`2px solid ${exp.color}44`}}>
                          <div style={{fontSize:12,letterSpacing:2,color:exp.color,marginBottom:3}}>WHAT IT ADDS</div>
                          <div style={{fontSize:16,color:C.text,lineHeight:1.7}}>{exp.adds}</div>
                        </div>
                        {exp.unlocks && (
                          <div style={{background:`${C.gold}08`,padding:"8px 10px",borderLeft:`2px solid ${C.gold}44`,fontSize:14,color:C.gold,lineHeight:1.6}}>
                            🔑 UNLOCKS: {exp.unlocks}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── ACTIVITIES ── */}
        {tab==="ACTIVITIES" && (
          <>
            <div style={{fontSize:16,color:C.textDim,letterSpacing:2,marginBottom:14}}>
              ALL MAJOR ACTIVITIES · RECOMMENDED POWER · WHAT EACH REWARDS
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {ACTIVITIES.filter(a=>!search||f(a.name)||f(a.desc)||f(a.rewards)).map((act,i)=>{
                const open=expanded===`act-${i}`;
                return (
                  <div key={i} style={{border:`1px solid ${open?act.color+"55":C.border}`,background:C.panel}}>
                    <div onClick={()=>setExpanded(open?null:`act-${i}`)}
                      style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,background:open?`${act.color}08`:"transparent",borderBottom:open?`1px solid ${C.border}`:"none"}}
                      onMouseEnter={e=>e.currentTarget.style.background=`${act.color}0a`}
                      onMouseLeave={e=>e.currentTarget.style.background=open?`${act.color}08`:"transparent"}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                          <span style={{fontSize:18,color:C.textBright,fontWeight:700}}>{act.name}</span>
                          <span style={{fontSize:14,color:act.color,background:`${act.color}15`,border:`1px solid ${act.color}44`,padding:"2px 6px",letterSpacing:1}}>{act.tier}</span>
                          <span style={{fontSize:16,color:C.textDim,letterSpacing:1}}>{act.players}</span>
                        </div>
                        <div style={{fontSize:16,color:C.textDim}}>Power: {act.power}</div>
                      </div>
                      <span style={{color:act.color,fontSize:14,flexShrink:0,marginTop:2}}>{open?"▲":"▼"}</span>
                    </div>
                    {open && (
                      <div style={{padding:"12px 14px"}}>
                        <div style={{fontSize:16,color:C.text,lineHeight:1.8,marginBottom:10}}>{act.desc}</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                          <div style={{background:`${C.gold}08`,padding:"8px 10px",borderLeft:`2px solid ${C.gold}44`}}>
                            <div style={{fontSize:12,letterSpacing:2,color:C.gold,marginBottom:3}}>REWARDS</div>
                            <div style={{fontSize:16,color:C.textDim,lineHeight:1.6}}>{act.rewards}</div>
                          </div>
                          <div style={{background:`${act.color}08`,padding:"8px 10px",borderLeft:`2px solid ${act.color}44`}}>
                            <div style={{fontSize:12,letterSpacing:2,color:act.color,marginBottom:3}}>⚡ TIP</div>
                            <div style={{fontSize:16,color:C.textDim,lineHeight:1.6}}>{act.tip}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── FARMING ── */}
        {tab==="FARMING" && (
          <>
            <div style={{fontSize:16,color:C.textDim,letterSpacing:2,marginBottom:14}}>
              HOW TO GRIND EFFICIENTLY · POWER PROGRESSION · EXOTIC FARMING · WEEKLY LOCKOUTS
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {FARMING.filter(f2=>!search||f(f2.topic)||f(f2.body)).map((item,i)=>{
                const open=expanded===`farm-${i}`;
                return (
                  <div key={i} style={{border:`1px solid ${open?item.color+"55":C.border}`,background:C.panel}}>
                    <div onClick={()=>setExpanded(open?null:`farm-${i}`)}
                      style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,background:open?`${item.color}08`:"transparent",borderBottom:open?`1px solid ${C.border}`:"none"}}
                      onMouseEnter={e=>e.currentTarget.style.background=`${item.color}0a`}
                      onMouseLeave={e=>e.currentTarget.style.background=open?`${item.color}08`:"transparent"}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:18}}>{item.icon}</span>
                        <span style={{fontSize:18,color:C.textBright,fontWeight:700}}>{item.topic}</span>
                      </div>
                      <span style={{color:item.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
                    </div>
                    {open && (
                      <div style={{padding:"12px 14px"}}>
                        <div style={{fontSize:16,color:C.text,lineHeight:1.8,whiteSpace:"pre-line",marginBottom:10}}>{item.body}</div>
                        <div style={{background:`${item.color}08`,padding:"8px 12px",borderLeft:`2px solid ${item.color}55`,fontSize:14,color:item.color,lineHeight:1.6}}>⚡ {item.tip}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── QUESTS ── */}
        {tab==="QUESTS" && (
          <>
            {/* Category tabs - 3 columns for 6 categories */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:20}}>
              {QUEST_CATS.map(cat=>{
                const col=QUEST_CAT_COLORS[cat];
                const active=questCat===cat;
                return(
                  <button key={cat} onClick={()=>{setQuestCat(cat);setExpanded(null);}} style={{
                    padding:"14px 8px",
                    background:active?`${col}20`:C.panel,
                    border:active?`2px solid ${col}`:`1px solid ${C.borderDim}`,
                    color:active?col:C.textDim,
                    cursor:"pointer",fontSize:13,letterSpacing:2,...F,
                    fontWeight:active?900:400,
                    textAlign:"center",
                  }}>{QUEST_CAT_LABELS[cat]}</button>
                );
              })}
            </div>

            {/* Quest count banner */}
            <div style={{fontSize:13,color:C.textDim,letterSpacing:2,marginBottom:14,
              background:C.panel,border:`1px solid ${C.borderDim}`,padding:"10px 14px",
              borderLeft:`3px solid ${QUEST_CAT_COLORS[questCat]}`}}>
              {questCat==="raids" && `${RAIDS.length} RAIDS — TAP ANY RAID FOR FULL ENCOUNTER BREAKDOWN`}
              {questCat==="dungeons" && `${DUNGEONS.length} DUNGEONS — TAP ANY DUNGEON FOR FULL ENCOUNTER BREAKDOWN`}
              {!["raids","dungeons"].includes(questCat) && `${QUESTS.filter(q=>q.cat===questCat).length} QUESTS — TAP ANY QUEST FOR STEP BY STEP WALKTHROUGH`}
            </div>

            {/* ── RAIDS VIEW ── */}
            {questCat==="raids" && RAIDS.map((raid,i)=>{
              const open=expanded===`raid-${i}`;
              return(
                <div key={i} style={{border:`1px solid ${open?raid.color+"66":C.borderDim}`,marginBottom:8,background:C.panel}}>
                  <div onClick={()=>setExpanded(open?null:`raid-${i}`)}
                    style={{padding:"16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,
                      background:open?`${raid.color}10`:"transparent",borderBottom:open?`1px solid ${C.borderDim}`:"none"}}
                    onMouseEnter={e=>e.currentTarget.style.background=`${raid.color}0c`}
                    onMouseLeave={e=>e.currentTarget.style.background=open?`${raid.color}10`:"transparent"}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:6}}>
                        <span style={{fontSize:18,color:C.textBright,fontWeight:900}}>{raid.name}</span>
                        <span style={{fontSize:11,color:raid.color,background:`${raid.color}18`,border:`1px solid ${raid.color}44`,padding:"2px 8px",letterSpacing:1}}>{raid.status}</span>
                      </div>
                      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                        <span style={{fontSize:13,color:C.textDim}}>{raid.expansion}</span>
                        <span style={{fontSize:13,color:C.textDim}}>👥 {raid.players} players</span>
                        <span style={{fontSize:13,color:C.textDim}}>⚡ {raid.power}</span>
                        <span style={{fontSize:13,color:C.textDim}}>🗡️ {raid.encounters} encounters</span>
                      </div>
                    </div>
                    <span style={{color:raid.color,fontSize:18,flexShrink:0}}>{open?"▲":"▼"}</span>
                  </div>
                  {open&&(
                    <div style={{padding:"16px"}}>
                      <div style={{marginBottom:14}}>
                        <div style={{fontSize:13,letterSpacing:2,color:raid.color,marginBottom:10}}>ENCOUNTER BREAKDOWN</div>
                        {raid.encounterList.map((enc,ei)=>(
                          <div key={ei} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:10,
                            background:`${raid.color}08`,padding:"12px",borderLeft:`3px solid ${raid.color}44`}}>
                            <span style={{fontSize:13,fontWeight:900,color:raid.color,flexShrink:0,minWidth:24}}>{ei+1}.</span>
                            <span style={{fontSize:15,color:C.text,lineHeight:1.7}}>{enc}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{marginBottom:10,background:`${C.gold}0a`,padding:"12px",borderLeft:`3px solid ${C.gold}55`}}>
                        <div style={{fontSize:13,letterSpacing:2,color:C.gold,marginBottom:5}}>🏆 EXCLUSIVE EXOTICS</div>
                        <div style={{fontSize:15,color:C.text,lineHeight:1.7}}>{raid.exotics}</div>
                      </div>
                      <div style={{background:`${C.cyan}08`,padding:"12px",borderLeft:`3px solid ${C.cyan}44`}}>
                        <div style={{fontSize:13,letterSpacing:2,color:C.cyan,marginBottom:5}}>⚡ PRO TIP</div>
                        <div style={{fontSize:15,color:C.textDim,lineHeight:1.7}}>{raid.tip}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* ── DUNGEONS VIEW ── */}
            {questCat==="dungeons" && DUNGEONS.map((dun,i)=>{
              const open=expanded===`dun-${i}`;
              return(
                <div key={i} style={{border:`1px solid ${open?dun.color+"66":C.borderDim}`,marginBottom:8,background:C.panel}}>
                  <div onClick={()=>setExpanded(open?null:`dun-${i}`)}
                    style={{padding:"16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,
                      background:open?`${dun.color}10`:"transparent",borderBottom:open?`1px solid ${C.borderDim}`:"none"}}
                    onMouseEnter={e=>e.currentTarget.style.background=`${dun.color}0c`}
                    onMouseLeave={e=>e.currentTarget.style.background=open?`${dun.color}10`:"transparent"}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:6}}>
                        <span style={{fontSize:18,color:C.textBright,fontWeight:900}}>{dun.name}</span>
                        <span style={{fontSize:11,color:dun.color,background:`${dun.color}18`,border:`1px solid ${dun.color}44`,padding:"2px 8px",letterSpacing:1}}>{dun.status}</span>
                      </div>
                      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                        <span style={{fontSize:13,color:C.textDim}}>{dun.expansion}</span>
                        <span style={{fontSize:13,color:C.textDim}}>👥 {dun.players}</span>
                        <span style={{fontSize:13,color:C.textDim}}>⚡ {dun.power}</span>
                        <span style={{fontSize:13,color:C.textDim}}>🗡️ {dun.encounters} encounters</span>
                      </div>
                    </div>
                    <span style={{color:dun.color,fontSize:18,flexShrink:0}}>{open?"▲":"▼"}</span>
                  </div>
                  {open&&(
                    <div style={{padding:"16px"}}>
                      <div style={{marginBottom:14}}>
                        <div style={{fontSize:13,letterSpacing:2,color:dun.color,marginBottom:10}}>ENCOUNTER BREAKDOWN</div>
                        {dun.encounterList.map((enc,ei)=>(
                          <div key={ei} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:10,
                            background:`${dun.color}08`,padding:"12px",borderLeft:`3px solid ${dun.color}44`}}>
                            <span style={{fontSize:13,fontWeight:900,color:dun.color,flexShrink:0,minWidth:24}}>{ei+1}.</span>
                            <span style={{fontSize:15,color:C.text,lineHeight:1.7}}>{enc}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{marginBottom:10,background:`${C.gold}0a`,padding:"12px",borderLeft:`3px solid ${C.gold}55`}}>
                        <div style={{fontSize:13,letterSpacing:2,color:C.gold,marginBottom:5}}>🏆 EXOTICS & LOOT</div>
                        <div style={{fontSize:15,color:C.text,lineHeight:1.7}}>{dun.exotics}</div>
                      </div>
                      <div style={{background:`${C.cyan}08`,padding:"12px",borderLeft:`3px solid ${C.cyan}44`}}>
                        <div style={{fontSize:13,letterSpacing:2,color:C.cyan,marginBottom:5}}>⚡ PRO TIP</div>
                        <div style={{fontSize:15,color:C.textDim,lineHeight:1.7}}>{dun.tip}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* ── QUEST LIST VIEW (exotic/campaign/key/weekly) ── */}
            {!["raids","dungeons"].includes(questCat) && (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {QUESTS.filter(q=>q.cat===questCat).map((q,i)=>{
                  const open=expanded===`q-${i}-${questCat}`;
                  const catCol=QUEST_CAT_COLORS[q.cat];
                  return(
                    <div key={i} style={{border:`1px solid ${open?q.color+"66":C.borderDim}`,background:C.panel}}>
                      <div onClick={()=>setExpanded(open?null:`q-${i}-${questCat}`)}
                        style={{padding:"16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,
                          background:open?`${q.color}10`:"transparent",borderBottom:open?`1px solid ${C.borderDim}`:"none"}}
                        onMouseEnter={e=>e.currentTarget.style.background=`${q.color}0c`}
                        onMouseLeave={e=>e.currentTarget.style.background=open?`${q.color}10`:"transparent"}>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:6}}>
                            <span style={{fontSize:18,color:C.textBright,fontWeight:900}}>{q.name}</span>
                            <span style={{fontSize:11,color:C.textDim,letterSpacing:1}}>{q.expansion}</span>
                          </div>
                          <div style={{fontSize:14,color:C.gold}}>🏆 {q.reward}</div>
                        </div>
                        <span style={{color:q.color,fontSize:18,flexShrink:0,marginTop:2}}>{open?"▲":"▼"}</span>
                      </div>
                      {open&&(
                        <div style={{padding:"16px"}}>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                            <div style={{background:`${q.color}0a`,padding:"12px",borderLeft:`3px solid ${q.color}44`}}>
                              <div style={{fontSize:13,letterSpacing:2,color:q.color,marginBottom:5}}>📍 HOW TO START</div>
                              <div style={{fontSize:14,color:C.text,lineHeight:1.6}}>{q.source}</div>
                            </div>
                            <div style={{background:`${C.orange}0a`,padding:"12px",borderLeft:`3px solid ${C.orange}44`}}>
                              <div style={{fontSize:13,letterSpacing:2,color:C.orange,marginBottom:5}}>⚡ REQUIREMENTS</div>
                              <div style={{fontSize:14,color:C.text,lineHeight:1.6}}>{q.power}<br/>{q.players}</div>
                            </div>
                          </div>
                          <div style={{marginBottom:14}}>
                            <div style={{fontSize:13,letterSpacing:3,color:C.green,marginBottom:10}}>📋 STEP BY STEP</div>
                            {q.steps.map((step,si)=>(
                              <div key={si} style={{display:"flex",gap:12,alignItems:"flex-start",
                                background:`${C.green}06`,padding:"12px",marginBottom:6,
                                borderLeft:`3px solid ${C.green}33`}}>
                                <span style={{fontSize:14,fontWeight:900,color:C.green,
                                  background:`${C.green}22`,width:28,height:28,display:"flex",
                                  alignItems:"center",justifyContent:"center",flexShrink:0}}>{si+1}</span>
                                <span style={{fontSize:15,color:C.text,lineHeight:1.8}}>{step}</span>
                              </div>
                            ))}
                          </div>
                          <div style={{background:`${C.gold}0a`,padding:"12px",borderLeft:`3px solid ${C.gold}55`,
                            fontSize:15,color:C.gold,lineHeight:1.7}}>
                            ⚡ {q.tip}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── ORNAMENTS ── */}
        {tab==="ORNAMENTS" && (
          <>
            <div style={{fontSize:16,color:C.textDim,letterSpacing:2,marginBottom:14}}>
              HOW TO EARN COSMETICS · BRIGHT DUST FARMING · TRANSMOG · RAID EXCLUSIVES
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {ORNAMENTS.filter(o=>!search||f(o.name)||f(o.how)).map((o,i)=>{
                const open=expanded===`orn-${i}`;
                return (
                  <div key={i} style={{border:`1px solid ${open?o.color+"55":C.border}`,background:C.panel}}>
                    <div onClick={()=>setExpanded(open?null:`orn-${i}`)}
                      style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,background:open?`${o.color}08`:"transparent",borderBottom:open?`1px solid ${C.border}`:"none"}}
                      onMouseEnter={e=>e.currentTarget.style.background=`${o.color}0a`}
                      onMouseLeave={e=>e.currentTarget.style.background=open?`${o.color}08`:"transparent"}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:18}}>{o.icon}</span>
                        <span style={{fontSize:18,color:C.textBright,fontWeight:700}}>{o.name}</span>
                      </div>
                      <span style={{color:o.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
                    </div>
                    {open && (
                      <div style={{padding:"12px 14px"}}>
                        <div style={{fontSize:16,color:C.text,lineHeight:1.8,marginBottom:10}}>{o.how}</div>
                        <div style={{marginBottom:10}}>
                          <div style={{fontSize:12,letterSpacing:2,color:o.color,marginBottom:6}}>SOURCES</div>
                          <div style={{display:"flex",flexDirection:"column",gap:5}}>
                            {o.sources.map((s2,si)=>(
                              <div key={si} style={{display:"flex",gap:8,fontSize:16,color:C.textDim,lineHeight:1.6}}>
                                <span style={{color:o.color,flexShrink:0,marginTop:2}}>▸</span>
                                <span>{s2}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div style={{background:`${o.color}08`,padding:"8px 12px",borderLeft:`2px solid ${o.color}55`,fontSize:14,color:o.color,lineHeight:1.6}}>⚡ {o.tip}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── BOUNTIES ── */}
        {tab==="BOUNTIES" && (
          <>
            <div style={{fontSize:16,color:C.textDim,letterSpacing:2,marginBottom:14}}>
              PATHFINDER + ORDERS SYSTEM · RESETS EVERY TUESDAY · STACK WITH FARMING
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {BOUNTIES.filter(b=>!search||f(b.name)||f(b.how)||f(b.complete)).map((b,i)=>{
                const open=expanded===`bty-${i}`;
                return (
                  <div key={i} style={{border:`1px solid ${open?b.color+"55":C.border}`,background:C.panel}}>
                    <div onClick={()=>setExpanded(open?null:`bty-${i}`)}
                      style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,background:open?`${b.color}08`:"transparent",borderBottom:open?`1px solid ${C.border}`:"none"}}
                      onMouseEnter={e=>e.currentTarget.style.background=`${b.color}0a`}
                      onMouseLeave={e=>e.currentTarget.style.background=open?`${b.color}08`:"transparent"}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:18}}>{b.icon}</span>
                        <span style={{fontSize:18,color:C.textBright,fontWeight:700}}>{b.name}</span>
                      </div>
                      <span style={{color:b.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
                    </div>
                    {open && (
                      <div style={{padding:"12px 14px"}}>
                        <div style={{fontSize:16,color:C.text,lineHeight:1.8,marginBottom:10}}>{b.how}</div>
                        <div style={{marginBottom:10,background:`${C.green}08`,padding:"8px 10px",borderLeft:`2px solid ${C.green}44`}}>
                          <div style={{fontSize:12,letterSpacing:2,color:C.green,marginBottom:4}}>HOW TO COMPLETE</div>
                          <div style={{fontSize:16,color:C.text,lineHeight:1.7}}>{b.complete}</div>
                        </div>
                        <div style={{background:`${b.color}08`,padding:"8px 12px",borderLeft:`2px solid ${b.color}55`,fontSize:14,color:b.color,lineHeight:1.6}}>⚡ {b.tip}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── WEAPON UPGRADES ── */}
        {tab==="WEAPON UPGRADES" && (
          <>
            <div style={{fontSize:16,color:C.textDim,letterSpacing:2,marginBottom:14}}>
              MASTERWORKING · CATALYSTS · INFUSION · ENHANCED PERKS · WEAPON COSMETICS
            </div>
            {WEAPON_UPGRADES.filter(w=>!search||f(w.name)||f(w.how)).map((w,i)=>{
              const open=expanded===`wu-${i}`;
              return(
                <div key={i} style={{border:`1px solid ${open?w.color+"55":C.border}`,marginBottom:8,background:C.panel}}>
                  <div onClick={()=>setExpanded(open?null:`wu-${i}`)}
                    style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,background:open?`${w.color}08`:"transparent",borderBottom:open?`1px solid ${C.border}`:"none"}}
                    onMouseEnter={e=>e.currentTarget.style.background=`${w.color}0a`}
                    onMouseLeave={e=>e.currentTarget.style.background=open?`${w.color}08`:"transparent"}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:18}}>{w.icon}</span>
                      <span style={{fontSize:18,color:C.textBright,fontWeight:700}}>{w.name}</span>
                    </div>
                    <span style={{color:w.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
                  </div>
                  {open&&(
                    <div style={{padding:"12px 14px"}}>
                      <div style={{fontSize:16,color:C.text,lineHeight:1.8,whiteSpace:"pre-line",marginBottom:10}}>{w.how}</div>
                      {w.steps&&(
                        <div style={{marginBottom:10,background:`${C.green}06`,padding:"8px 10px",borderLeft:`2px solid ${C.green}33`}}>
                          <div style={{fontSize:12,letterSpacing:2,color:C.green,marginBottom:5}}>STEPS</div>
                          {w.steps.map((s2,si)=>(
                            <div key={si} style={{display:"flex",gap:8,marginBottom:si<w.steps.length-1?5:0}}>
                              <span style={{color:C.green,fontWeight:700,flexShrink:0,fontSize:11}}>{si+1}.</span>
                              <span style={{fontSize:16,color:C.text,lineHeight:1.6}}>{s2}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{background:`${w.color}08`,padding:"8px 12px",borderLeft:`2px solid ${w.color}55`,fontSize:14,color:w.color,lineHeight:1.6}}>⚡ {w.tip}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ── ARMOR & STATS ── */}
        {tab==="ARMOR & STATS" && (
          <>
            <div style={{fontSize:16,color:C.textDim,letterSpacing:2,marginBottom:14}}>
              6 STATS · TARGET 100 RESILIENCE ALWAYS · EACH 10 POINTS = ONE TIER
            </div>
            {/* Stat cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:8,marginBottom:20}}>
              {ARMOR_STATS.filter(s=>!search||f(s.stat)||f(s.affects)).map((s,i)=>{
                const open=expanded===`stat-${i}`;
                return(
                  <div key={i} style={{border:`1px solid ${open?s.color+"55":C.border}`,background:C.panel}}>
                    <div onClick={()=>setExpanded(open?null:`stat-${i}`)}
                      style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:open?`${s.color}08`:"transparent",borderBottom:open?`1px solid ${C.border}`:"none"}}
                      onMouseEnter={e=>e.currentTarget.style.background=`${s.color}0a`}
                      onMouseLeave={e=>e.currentTarget.style.background=open?`${s.color}08`:"transparent"}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:16}}>{s.icon}</span>
                        <div>
                          <div style={{fontSize:15,color:s.color,fontWeight:700,letterSpacing:2}}>{s.stat.toUpperCase()}</div>
                          <div style={{fontSize:16,color:C.textDim}}>{s.affects}</div>
                        </div>
                      </div>
                      <span style={{color:s.color,fontSize:13,flexShrink:0}}>{open?"▲":"▼"}</span>
                    </div>
                    {open&&(
                      <div style={{padding:"10px 14px"}}>
                        <div style={{fontSize:16,color:C.textDim,lineHeight:1.7,marginBottom:8}}>{s.tiers}</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                          <div style={{background:`${C.green}08`,padding:"7px 9px",borderLeft:`2px solid ${C.green}44`}}>
                            <div style={{fontSize:9,letterSpacing:2,color:C.green,marginBottom:3}}>PvE</div>
                            <div style={{fontSize:16,color:C.textDim,lineHeight:1.5}}>{s.pve}</div>
                          </div>
                          <div style={{background:`${C.red}08`,padding:"7px 9px",borderLeft:`2px solid ${C.red}44`}}>
                            <div style={{fontSize:9,letterSpacing:2,color:C.red,marginBottom:3}}>PvP</div>
                            <div style={{fontSize:16,color:C.textDim,lineHeight:1.5}}>{s.pvp}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Armor system info */}
            {ARMOR_SYSTEM.filter(a=>!search||f(a.name)||f(a.body)).map((a,i)=>(
              <div key={i} style={{background:C.panel,border:`1px solid ${C.border}`,borderLeft:`3px solid ${a.color}`,padding:"14px 16px",marginBottom:8}}>
                <div style={{fontSize:18,color:C.textBright,fontWeight:700,marginBottom:7}}>{a.name}</div>
                <div style={{fontSize:16,color:C.textDim,lineHeight:1.8,whiteSpace:"pre-line"}}>{a.body}</div>
              </div>
            ))}
          </>
        )}

        {/* ── BUILD CRAFTING ── */}
        {tab==="BUILD CRAFTING" && (
          <>
            <div style={{fontSize:16,color:C.textDim,letterSpacing:2,marginBottom:14}}>
              EXOTIC FIRST → SUBCLASS → ASPECTS → FRAGMENTS → WEAPONS → MODS → STATS
            </div>
            {BUILD_CRAFTING.filter(b=>!search||f(b.name)||f(b.how)).map((b,i)=>{
              const open=expanded===`bc-${i}`;
              return(
                <div key={i} style={{border:`1px solid ${open?b.color+"55":C.border}`,marginBottom:8,background:C.panel}}>
                  <div onClick={()=>setExpanded(open?null:`bc-${i}`)}
                    style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,background:open?`${b.color}08`:"transparent",borderBottom:open?`1px solid ${C.border}`:"none"}}
                    onMouseEnter={e=>e.currentTarget.style.background=`${b.color}0a`}
                    onMouseLeave={e=>e.currentTarget.style.background=open?`${b.color}08`:"transparent"}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:18}}>{b.icon}</span>
                      <span style={{fontSize:18,color:C.textBright,fontWeight:700}}>{b.name}</span>
                    </div>
                    <span style={{color:b.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
                  </div>
                  {open&&(
                    <div style={{padding:"12px 14px"}}>
                      <div style={{fontSize:16,color:C.text,lineHeight:1.8,whiteSpace:"pre-line",marginBottom:10}}>{b.how}</div>
                      <div style={{background:`${b.color}08`,padding:"8px 12px",borderLeft:`2px solid ${b.color}55`,fontSize:14,color:b.color,lineHeight:1.6}}>⚡ {b.tip}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ── VENDORS ── */}
        {tab==="VENDORS" && (
          <>
            <div style={{fontSize:16,color:C.textDim,letterSpacing:2,marginBottom:14}}>
              KEY VENDORS · XÛR EVERY FRIDAY → TUESDAY · MONUMENT OF LOST LIGHTS FOR LEGACY EXOTICS
            </div>
            {VENDORS.filter(v=>!search||f(v.name)||f(v.sells)||f(v.tip)).map((v,i)=>{
              const open=expanded===`vnd-${i}`;
              return(
                <div key={i} style={{border:`1px solid ${open?v.color+"55":C.border}`,marginBottom:8,background:C.panel}}>
                  <div onClick={()=>setExpanded(open?null:`vnd-${i}`)}
                    style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,background:open?`${v.color}08`:"transparent",borderBottom:open?`1px solid ${C.border}`:"none"}}
                    onMouseEnter={e=>e.currentTarget.style.background=`${v.color}0a`}
                    onMouseLeave={e=>e.currentTarget.style.background=open?`${v.color}08`:"transparent"}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:18}}>{v.icon}</span>
                      <span style={{fontSize:18,color:C.textBright,fontWeight:700}}>{v.name}</span>
                    </div>
                    <span style={{color:v.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
                  </div>
                  {open&&(
                    <div style={{padding:"12px 14px"}}>
                      <div style={{marginBottom:8,background:`${v.color}08`,padding:"8px 10px",borderLeft:`2px solid ${v.color}44`}}>
                        <div style={{fontSize:12,letterSpacing:2,color:v.color,marginBottom:3}}>📍 LOCATION</div>
                        <div style={{fontSize:16,color:C.text,lineHeight:1.6}}>{v.location}</div>
                      </div>
                      <div style={{marginBottom:8}}>
                        <div style={{fontSize:12,letterSpacing:2,color:C.gold,marginBottom:3}}>SELLS / OFFERS</div>
                        <div style={{fontSize:16,color:C.textDim,lineHeight:1.7,whiteSpace:"pre-line"}}>{v.sells}</div>
                      </div>
                      {v.currency&&(
                        <div style={{marginBottom:8,background:`${C.gold}08`,padding:"8px 10px",borderLeft:`2px solid ${C.gold}44`}}>
                          <div style={{fontSize:12,letterSpacing:2,color:C.gold,marginBottom:3}}>CURRENCY</div>
                          <div style={{fontSize:16,color:C.textDim,lineHeight:1.7,whiteSpace:"pre-line"}}>{v.currency}</div>
                        </div>
                      )}
                      <div style={{background:`${v.color}08`,padding:"8px 12px",borderLeft:`2px solid ${v.color}55`,fontSize:14,color:v.color,lineHeight:1.6}}>⚡ {v.tip}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ── LOADOUTS ── */}
        {tab==="LOADOUTS" && (
          <>
            <div style={{fontSize:16,color:C.textDim,letterSpacing:2,marginBottom:14}}>
              MONUMENT OF TRIUMPH META · TOP 5 PER CLASS · UPDATED SEP 2026
            </div>

            {/* Class selector */}
            <div style={{display:"flex",gap:4,marginBottom:16}}>
              {[["hunter",C.gold,"HUNTER"],["titan",C.blue,"TITAN"],["warlock",C.purple,"WARLOCK"]].map(([cls,col,label])=>(
                <button key={cls} onClick={()=>{setClassFilter(cls);setExpanded(null);}} style={{
                  flex:1,padding:"10px 6px",
                  background:classFilter===cls?`${col}15`:C.panel,
                  border:classFilter===cls?`1px solid ${col}`:`1px solid ${C.border}`,
                  borderTop:classFilter===cls?`2px solid ${col}`:"2px solid transparent",
                  color:classFilter===cls?col:C.dim,
                  cursor:"pointer",fontSize:14,letterSpacing:3,...F,fontWeight:classFilter===cls?700:400,
                }}>{label}</button>
              ))}
            </div>

            {/* Best weapons callout */}
            <div style={{background:C.panel,border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.gold}`,padding:"10px 14px",marginBottom:14}}>
              <div style={{fontSize:14,letterSpacing:3,color:C.gold,marginBottom:6}}>🔫 WEAPONS THAT FIT EVERY BUILD</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {["Praxic Blade (Heavy Sword)","Still Hunt (Special Sniper)","Khvostov 7G-0X (Primary)","Outbreak Perfected (Primary)","Arbalest (Special Linear — +33% vs Barrier Champions)","Conditional Finality (Shotgun — stuns 2 Champion types)"].map((w,i)=>(
                  <span key={i} style={{fontSize:14,color:C.gold,background:`${C.gold}10`,border:`1px solid ${C.gold}33`,padding:"2px 7px"}}>{w}</span>
                ))}
              </div>
            </div>

            {/* Build cards */}
            {(LOADOUTS[classFilter]||[]).filter(b=>!search||f(b.name)||f(b.loop)||f(b.exotic)).map((b,i)=>{
              const open=expanded===`lo-${i}`;
              const col=b.subColor;
              return(
                <div key={i} style={{border:`1px solid ${open?col+"55":C.border}`,marginBottom:8,background:C.panel}}>
                  {/* Header */}
                  <div onClick={()=>setExpanded(open?null:`lo-${i}`)}
                    style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,background:open?`${col}08`:"transparent",borderBottom:open?`1px solid ${C.border}`:"none"}}
                    onMouseEnter={e=>e.currentTarget.style.background=`${col}0a`}
                    onMouseLeave={e=>e.currentTarget.style.background=open?`${col}08`:"transparent"}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                        <span style={{fontSize:11,letterSpacing:2,color:b.rank===`S`?C.gold:C.teal,background:b.rank===`S`?`${C.gold}20`:`${C.teal}20`,border:`1px solid ${b.rank===`S`?C.gold:C.teal}55`,padding:"1px 7px",fontWeight:900}}>{b.rank}-TIER</span>
                        <span style={{fontSize:18,color:C.textBright,fontWeight:700}}>{b.name}</span>
                        <span style={{fontSize:14,color:col,background:`${col}15`,border:`1px solid ${col}44`,padding:"1px 6px",letterSpacing:1}}>{b.subclass.toUpperCase()}</span>
                      </div>
                      <div style={{fontSize:16,color:C.textDim,letterSpacing:1}}>Exotic: <span style={{color:C.gold}}>{b.exotic}</span></div>
                    </div>
                    <span style={{color:col,fontSize:14,flexShrink:0,marginTop:2}}>{open?"▲":"▼"}</span>
                  </div>

                  {open&&(
                    <div style={{padding:"12px 14px"}}>
                      {/* Exotic weapon */}
                      {b.exoticWeapon&&(
                        <div style={{marginBottom:10,background:`${C.gold}08`,padding:"7px 10px",borderLeft:`2px solid ${C.gold}44`}}>
                          <div style={{fontSize:12,letterSpacing:2,color:C.gold,marginBottom:2}}>EXOTIC WEAPON</div>
                          <div style={{fontSize:16,color:C.text}}>{b.exoticWeapon}</div>
                        </div>
                      )}
                      {/* Aspects + Stats */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                        <div style={{background:`${col}08`,padding:"7px 10px",borderLeft:`2px solid ${col}44`}}>
                          <div style={{fontSize:12,letterSpacing:2,color:col,marginBottom:4}}>KEY ASPECTS</div>
                          {b.aspects.map((a,ai)=>(
                            <div key={ai} style={{fontSize:16,color:C.text,marginBottom:ai<b.aspects.length-1?3:0}}>▸ {a}</div>
                          ))}
                        </div>
                        <div style={{background:`${C.arc}08`,padding:"7px 10px",borderLeft:`2px solid ${C.arc}44`}}>
                          <div style={{fontSize:12,letterSpacing:2,color:C.arc,marginBottom:4}}>TARGET STATS</div>
                          <div style={{fontSize:16,color:C.text,lineHeight:1.7}}>{b.stats}</div>
                        </div>
                      </div>
                      {/* Loop */}
                      <div style={{marginBottom:10}}>
                        <div style={{fontSize:12,letterSpacing:2,color:C.green,marginBottom:4}}>⚙ HOW THE LOOP WORKS</div>
                        <div style={{fontSize:16,color:C.text,lineHeight:1.8,background:`${C.green}06`,padding:"8px 10px",borderLeft:`2px solid ${C.green}33`}}>{b.loop}</div>
                      </div>
                      {/* Best for */}
                      <div style={{marginBottom:10,background:`${col}08`,padding:"7px 10px",borderLeft:`2px solid ${col}44`}}>
                        <div style={{fontSize:12,letterSpacing:2,color:col,marginBottom:3}}>BEST FOR</div>
                        <div style={{fontSize:16,color:C.textDim,lineHeight:1.6}}>{b.best}</div>
                      </div>
                      {/* Tip */}
                      <div style={{background:`${C.gold}08`,padding:"8px 12px",borderLeft:`2px solid ${C.gold}55`,fontSize:14,color:C.gold,lineHeight:1.6}}>⚡ {b.tip}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ── LOST SECTORS ── */}
        {tab==="LOST SECTORS" && (
          <>
            <div style={{fontSize:16,color:C.textDim,letterSpacing:2,marginBottom:14}}>
              DAILY EXOTIC FARM · SOLO ONLY · CHECK ARMOR SLOT BEFORE ENTERING · PLATINUM RATING = BEST ODDS
            </div>
            {/* Info cards */}
            {LOST_SECTOR_INFO.filter(s=>!search||f(s.name)||f(s.body)).map((s,i)=>{
              const open=expanded===`ls-${i}`;
              return(
                <div key={i} style={{border:`1px solid ${open?s.color+"55":C.border}`,marginBottom:8,background:C.panel}}>
                  <div onClick={()=>setExpanded(open?null:`ls-${i}`)}
                    style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,background:open?`${s.color}08`:"transparent",borderBottom:open?`1px solid ${C.border}`:"none"}}
                    onMouseEnter={e=>e.currentTarget.style.background=`${s.color}0a`}
                    onMouseLeave={e=>e.currentTarget.style.background=open?`${s.color}08`:"transparent"}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:18}}>{s.icon}</span>
                      <span style={{fontSize:18,color:C.textBright,fontWeight:700}}>{s.name}</span>
                    </div>
                    <span style={{color:s.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
                  </div>
                  {open&&(
                    <div style={{padding:"12px 14px"}}>
                      <div style={{fontSize:16,color:C.text,lineHeight:1.8,whiteSpace:"pre-line"}}>{s.body}</div>
                    </div>
                  )}
                </div>
              );
            })}
            {/* Sector list by destination */}
            <div style={{marginTop:16}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{width:3,height:14,background:C.teal}}/>
                <span style={{fontSize:14,letterSpacing:4,color:C.teal,fontWeight:700}}>ALL LOST SECTORS BY DESTINATION</span>
                <div style={{flex:1,height:1,background:`${C.teal}22`}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:8}}>
                {LOST_SECTORS_LIST.map((dest,di)=>(
                  <div key={di} style={{background:C.panel,border:`1px solid ${C.border}`,borderTop:`2px solid ${C.teal}44`,padding:"12px 14px"}}>
                    <div style={{fontSize:11,letterSpacing:3,color:C.teal,marginBottom:8,fontWeight:700}}>{dest.location.toUpperCase()}</div>
                    {dest.sectors.map((s,si)=>(
                      <div key={si} style={{display:"flex",gap:6,alignItems:"center",marginBottom:si<dest.sectors.length-1?5:0}}>
                        <span style={{width:3,height:3,background:C.teal,flexShrink:0,display:"inline-block"}}/>
                        <span style={{fontSize:16,color:C.textDim}}>{s}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── ENEMIES ── */}
        {tab==="ENEMIES" && (
          <>
            <div style={{fontSize:16,color:C.textDim,letterSpacing:2,marginBottom:14}}>
              7 FACTIONS · 3 CHAMPION TYPES · BREAK SHIELDS FIRST · CHAMPIONS NEED MATCHING MODS
            </div>

            {/* Champion types callout */}
            <div style={{marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{width:3,height:14,background:C.red}}/>
                <span style={{fontSize:14,letterSpacing:4,color:C.red,fontWeight:700}}>CHAMPION TYPES — CRITICAL FOR ENDGAME</span>
                <div style={{flex:1,height:1,background:`${C.red}22`}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {CHAMPION_TYPES.map((ch,i)=>{
                  const open=expanded===`ch-${i}`;
                  return(
                    <div key={i} style={{border:`1px solid ${open?ch.color+"55":C.border}`,background:C.panel}}>
                      <div onClick={()=>setExpanded(open?null:`ch-${i}`)}
                        style={{padding:"11px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,background:open?`${ch.color}08`:"transparent",borderBottom:open?`1px solid ${C.border}`:"none"}}
                        onMouseEnter={e=>e.currentTarget.style.background=`${ch.color}0a`}
                        onMouseLeave={e=>e.currentTarget.style.background=open?`${ch.color}08`:"transparent"}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{fontSize:16}}>{ch.icon}</span>
                          <span style={{fontSize:18,color:C.textBright,fontWeight:700}}>{ch.type}</span>
                        </div>
                        <span style={{color:ch.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
                      </div>
                      {open&&(
                        <div style={{padding:"10px 14px"}}>
                          <div style={{marginBottom:8,background:`${C.orange}08`,padding:"7px 10px",borderLeft:`2px solid ${C.orange}44`}}>
                            <div style={{fontSize:12,letterSpacing:2,color:C.orange,marginBottom:3}}>HOW TO IDENTIFY</div>
                            <div style={{fontSize:16,color:C.text,lineHeight:1.6}}>{ch.identify}</div>
                          </div>
                          <div style={{marginBottom:8,background:`${C.green}08`,padding:"7px 10px",borderLeft:`2px solid ${C.green}44`}}>
                            <div style={{fontSize:12,letterSpacing:2,color:C.green,marginBottom:3}}>HOW TO COUNTER</div>
                            <div style={{fontSize:16,color:C.text,lineHeight:1.6}}>{ch.counter}</div>
                          </div>
                          <div style={{background:`${ch.color}08`,padding:"7px 10px",borderLeft:`2px solid ${ch.color}44`,fontSize:14,color:ch.color,lineHeight:1.6}}>⚡ {ch.tip}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enemy factions */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <div style={{width:3,height:14,background:C.orange}}/>
              <span style={{fontSize:14,letterSpacing:4,color:C.orange,fontWeight:700}}>ENEMY FACTIONS</span>
              <div style={{flex:1,height:1,background:`${C.orange}22`}}/>
            </div>
            {ENEMY_FACTIONS.filter(e=>!search||f(e.name)||f(e.howToFight)||f(e.where)).map((enemy,i)=>{
              const open=expanded===`en-${i}`;
              return(
                <div key={i} style={{border:`1px solid ${open?enemy.color+"55":C.border}`,marginBottom:8,background:C.panel}}>
                  <div onClick={()=>setExpanded(open?null:`en-${i}`)}
                    style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,background:open?`${enemy.color}08`:"transparent",borderBottom:open?`1px solid ${C.border}`:"none"}}
                    onMouseEnter={e=>e.currentTarget.style.background=`${enemy.color}0a`}
                    onMouseLeave={e=>e.currentTarget.style.background=open?`${enemy.color}08`:"transparent"}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                        <span style={{fontSize:16}}>{enemy.icon}</span>
                        <span style={{fontSize:18,color:C.textBright,fontWeight:700}}>{enemy.name}</span>
                        <span style={{fontSize:14,color:enemy.color,background:`${enemy.color}15`,border:`1px solid ${enemy.color}44`,padding:"1px 6px",letterSpacing:1}}>Shield: {enemy.shield}</span>
                      </div>
                      <div style={{fontSize:16,color:C.textDim}}>Found: {enemy.where}</div>
                    </div>
                    <span style={{color:enemy.color,fontSize:14,flexShrink:0,marginTop:2}}>{open?"▲":"▼"}</span>
                  </div>
                  {open&&(
                    <div style={{padding:"12px 14px"}}>
                      <div style={{marginBottom:10,background:`${C.blue}08`,padding:"8px 10px",borderLeft:`2px solid ${C.blue}44`}}>
                        <div style={{fontSize:12,letterSpacing:2,color:C.blue,marginBottom:4}}>UNIT TYPES</div>
                        <div style={{fontSize:16,color:C.textDim,lineHeight:1.7}}>{enemy.tiers}</div>
                      </div>
                      <div style={{marginBottom:10,background:`${enemy.color}06`,padding:"8px 10px",borderLeft:`2px solid ${enemy.color}44`}}>
                        <div style={{fontSize:12,letterSpacing:2,color:enemy.color,marginBottom:4}}>SHIELD BEHAVIOR</div>
                        <div style={{fontSize:16,color:C.text,lineHeight:1.7}}>{enemy.shields}</div>
                      </div>
                      <div style={{marginBottom:10}}>
                        <div style={{fontSize:12,letterSpacing:2,color:C.green,marginBottom:4}}>⚔ HOW TO FIGHT</div>
                        <div style={{fontSize:16,color:C.text,lineHeight:1.8,background:`${C.green}06`,padding:"8px 10px",borderLeft:`2px solid ${C.green}33`}}>{enemy.howToFight}</div>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                        <div style={{background:`${C.red}08`,padding:"7px 10px",borderLeft:`2px solid ${C.red}44`}}>
                          <div style={{fontSize:12,letterSpacing:2,color:C.red,marginBottom:3}}>CHAMPIONS (ENDGAME)</div>
                          <div style={{fontSize:16,color:C.textDim,lineHeight:1.5}}>{enemy.champions}</div>
                        </div>
                        <div style={{background:`${C.gold}08`,padding:"7px 10px",borderLeft:`2px solid ${C.gold}44`}}>
                          <div style={{fontSize:12,letterSpacing:2,color:C.gold,marginBottom:3}}>⚡ KEY TIP</div>
                          <div style={{fontSize:16,color:C.textDim,lineHeight:1.5}}>{enemy.tip}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        <div style={{marginTop:22,borderTop:`1px solid ${C.border}`,paddingTop:10,fontSize:14,color:C.dimmer,letterSpacing:2,textAlign:"center"}}>
          DESTINY 2 · MONUMENT OF TRIUMPH FINAL SANDBOX · JUNE 2026 · GAME REMAINS ONLINE FOREVER
        </div>
      </div>
    </div>
  );
}
