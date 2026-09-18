import { useState } from "react";

const C = {
  bg:"#060810", panel:"#0c0e18", border:"#1a1e30",
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
const QUEST_GUIDES = [
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
          <p style={{fontSize:11,color:C.textDim,letterSpacing:2,margin:0}}>
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
                <span style={{fontSize:12,letterSpacing:4,color:C.blue,fontWeight:700}}>WEAPON SLOTS</span>
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
                            <div style={{fontSize:14,color:C.textBright,fontWeight:700}}>{w.slot} Slot</div>
                            <div style={{fontSize:11,color:C.textDim}}>Ammo: {w.ammo}</div>
                          </div>
                        </div>
                        <span style={{color:C.blue,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
                      </div>
                      {open && (
                        <div style={{padding:"12px 14px"}}>
                          <div style={{marginBottom:8,background:`${C.blue}08`,padding:"8px 10px",borderLeft:`2px solid ${C.blue}44`}}>
                            <div style={{fontSize:10,letterSpacing:2,color:C.blue,marginBottom:3}}>DAMAGE TYPE</div>
                            <div style={{fontSize:12,color:C.text}}>{w.dmgType}</div>
                          </div>
                          <div style={{fontSize:13,color:C.text,lineHeight:1.8,marginBottom:8}}>{w.strength}</div>
                          <div style={{fontSize:13,color:C.textDim,lineHeight:1.7,marginBottom:8}}>{w.use}</div>
                          <div style={{background:`${C.gold}08`,padding:"8px 10px",borderLeft:`2px solid ${C.gold}44`,fontSize:12,color:C.gold}}>⚡ {w.tip}</div>
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
                <span style={{fontSize:12,letterSpacing:4,color:C.cyan,fontWeight:700}}>AMMO TYPES</span>
                <div style={{flex:1,height:1,background:`${C.cyan}22`}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {AMMO_TYPES.filter(a=>!search||f(a.name)||f(a.desc)).map((a,i)=>(
                  <div key={i} style={{background:C.panel,border:`1px solid ${C.border}`,borderLeft:`3px solid ${a.color}`,padding:"11px 14px",display:"flex",gap:10,alignItems:"flex-start"}}>
                    <span style={{fontSize:15,flexShrink:0}}>{a.symbol}</span>
                    <div>
                      <div style={{fontSize:13,color:C.textBright,fontWeight:700,marginBottom:3}}>{a.name} Ammo</div>
                      <div style={{fontSize:12,color:C.textDim,lineHeight:1.6}}>{a.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Damage Types */}
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{width:3,height:14,background:C.orange}}/>
                <span style={{fontSize:12,letterSpacing:4,color:C.orange,fontWeight:700}}>ELEMENTAL DAMAGE TYPES</span>
                <div style={{flex:1,height:1,background:`${C.orange}22`}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:7}}>
                {DAMAGE_TYPES.filter(d=>!search||f(d.type)||f(d.desc)).map((d,i)=>(
                  <div key={i} style={{background:C.panel,border:`1px solid ${d.color}44`,borderTop:`2px solid ${d.color}`,padding:"10px 12px"}}>
                    <div style={{fontSize:12,color:d.color,fontWeight:700,letterSpacing:2,marginBottom:5}}>{d.type.toUpperCase()}</div>
                    <div style={{fontSize:12,color:C.textDim,lineHeight:1.6}}>{d.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Power Basics */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{width:3,height:14,background:C.gold}}/>
                <span style={{fontSize:12,letterSpacing:4,color:C.gold,fontWeight:700}}>POWER LEVEL & SYSTEMS</span>
                <div style={{flex:1,height:1,background:`${C.gold}22`}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {POWER_BASICS.filter(p=>!search||f(p.title)||f(p.body)).map((p,i)=>(
                  <div key={i} style={{background:C.panel,border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.gold}`,padding:"11px 14px"}}>
                    <div style={{fontSize:13,color:C.textBright,fontWeight:700,marginBottom:5}}>{p.title}</div>
                    <div style={{fontSize:12,color:C.textDim,lineHeight:1.7}}>{p.body}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── CLASSES ── */}
        {tab==="CLASSES" && (
          <>
            <div style={{fontSize:12,color:C.textDim,letterSpacing:2,marginBottom:14}}>
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
                        <span style={{fontSize:18,color:cls.color,fontWeight:900,letterSpacing:2}}>{cls.name.toUpperCase()}</span>
                        <span style={{fontSize:10,color:cls.color,background:`${cls.color}15`,border:`1px solid ${cls.color}44`,padding:"2px 8px",letterSpacing:2}}>{cls.role}</span>
                      </div>
                      <div style={{fontSize:12,color:C.textDim}}>{cls.playstyle}</div>
                    </div>
                    <span style={{color:cls.color,fontSize:14,flexShrink:0,marginTop:2}}>{open?"▲":"▼"}</span>
                  </div>

                  {open && (
                    <div style={{padding:"14px 16px"}}>
                      {/* Class info */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                        <div style={{background:`${cls.color}08`,padding:"8px 10px",borderLeft:`2px solid ${cls.color}44`}}>
                          <div style={{fontSize:10,letterSpacing:2,color:cls.color,marginBottom:3}}>CLASS ABILITY</div>
                          <div style={{fontSize:12,color:C.text,lineHeight:1.6}}>{cls.ability}</div>
                        </div>
                        <div style={{background:`${cls.color}08`,padding:"8px 10px",borderLeft:`2px solid ${cls.color}44`}}>
                          <div style={{fontSize:10,letterSpacing:2,color:cls.color,marginBottom:3}}>JUMP</div>
                          <div style={{fontSize:12,color:C.text,lineHeight:1.6}}>{cls.jump}</div>
                        </div>
                        <div style={{background:`${C.green}08`,padding:"8px 10px",borderLeft:`2px solid ${C.green}44`}}>
                          <div style={{fontSize:10,letterSpacing:2,color:C.green,marginBottom:3}}>PvE STRENGTHS</div>
                          <div style={{fontSize:12,color:C.text,lineHeight:1.6}}>{cls.pve}</div>
                        </div>
                        <div style={{background:`${C.red}08`,padding:"8px 10px",borderLeft:`2px solid ${C.red}44`}}>
                          <div style={{fontSize:10,letterSpacing:2,color:C.red,marginBottom:3}}>PvP STRENGTHS</div>
                          <div style={{fontSize:12,color:C.text,lineHeight:1.6}}>{cls.pvp}</div>
                        </div>
                      </div>
                      {cls.avoid && (
                        <div style={{background:`${C.orange}08`,padding:"8px 10px",borderLeft:`2px solid ${C.orange}44`,marginBottom:14,fontSize:12,color:C.textDim}}>
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
                                  <span style={{fontSize:13,color:sub.color,fontWeight:700}}>{sub.name}</span>
                                  <span style={{fontSize:10,color:sub.color,background:`${sub.color}15`,border:`1px solid ${sub.color}33`,padding:"1px 6px",letterSpacing:1}}>{sub.element.toUpperCase()}</span>
                                </div>
                                <span style={{color:sub.color,fontSize:13,flexShrink:0}}>{sopen?"▲":"▼"}</span>
                              </div>
                              {sopen && (
                                <div style={{padding:"10px 12px"}}>
                                  <div style={{marginBottom:8}}>
                                    <div style={{fontSize:10,letterSpacing:2,color:sub.color,marginBottom:3}}>SUPER</div>
                                    <div style={{fontSize:12,color:C.text,lineHeight:1.6}}>{sub.super}</div>
                                  </div>
                                  <div style={{marginBottom:8,fontSize:12,color:C.textDim,lineHeight:1.7}}>{sub.playstyle}</div>
                                  <div style={{background:`${sub.color}08`,padding:"7px 10px",borderLeft:`2px solid ${sub.color}44`,fontSize:12,color:sub.color}}>
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
            <div style={{fontSize:12,color:C.textDim,letterSpacing:2,marginBottom:14}}>
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
                          <span style={{fontSize:14,color:C.textBright,fontWeight:700}}>{exp.name}</span>
                          <span style={{fontSize:10,color:exp.color,background:`${exp.color}15`,border:`1px solid ${exp.color}44`,padding:"2px 6px"}}>{exp.year}</span>
                          <span style={{fontSize:10,color:C.textDim,letterSpacing:1}}>{exp.status}</span>
                        </div>
                        <div style={{fontSize:11,color:C.textDim}}>{exp.note}</div>
                      </div>
                      <span style={{color:exp.color,fontSize:14,flexShrink:0,marginTop:2}}>{open?"▲":"▼"}</span>
                    </div>
                    {open && (
                      <div style={{padding:"12px 14px"}}>
                        <div style={{marginBottom:8,background:`${exp.color}08`,padding:"8px 10px",borderLeft:`2px solid ${exp.color}44`}}>
                          <div style={{fontSize:10,letterSpacing:2,color:exp.color,marginBottom:3}}>WHAT IT ADDS</div>
                          <div style={{fontSize:12,color:C.text,lineHeight:1.7}}>{exp.adds}</div>
                        </div>
                        {exp.unlocks && (
                          <div style={{background:`${C.gold}08`,padding:"8px 10px",borderLeft:`2px solid ${C.gold}44`,fontSize:12,color:C.gold,lineHeight:1.6}}>
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
            <div style={{fontSize:12,color:C.textDim,letterSpacing:2,marginBottom:14}}>
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
                          <span style={{fontSize:14,color:C.textBright,fontWeight:700}}>{act.name}</span>
                          <span style={{fontSize:10,color:act.color,background:`${act.color}15`,border:`1px solid ${act.color}44`,padding:"2px 6px",letterSpacing:1}}>{act.tier}</span>
                          <span style={{fontSize:10,color:C.textDim,letterSpacing:1}}>{act.players}</span>
                        </div>
                        <div style={{fontSize:11,color:C.textDim}}>Power: {act.power}</div>
                      </div>
                      <span style={{color:act.color,fontSize:14,flexShrink:0,marginTop:2}}>{open?"▲":"▼"}</span>
                    </div>
                    {open && (
                      <div style={{padding:"12px 14px"}}>
                        <div style={{fontSize:13,color:C.text,lineHeight:1.8,marginBottom:10}}>{act.desc}</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                          <div style={{background:`${C.gold}08`,padding:"8px 10px",borderLeft:`2px solid ${C.gold}44`}}>
                            <div style={{fontSize:10,letterSpacing:2,color:C.gold,marginBottom:3}}>REWARDS</div>
                            <div style={{fontSize:12,color:C.textDim,lineHeight:1.6}}>{act.rewards}</div>
                          </div>
                          <div style={{background:`${act.color}08`,padding:"8px 10px",borderLeft:`2px solid ${act.color}44`}}>
                            <div style={{fontSize:10,letterSpacing:2,color:act.color,marginBottom:3}}>⚡ TIP</div>
                            <div style={{fontSize:12,color:C.textDim,lineHeight:1.6}}>{act.tip}</div>
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
            <div style={{fontSize:12,color:C.textDim,letterSpacing:2,marginBottom:14}}>
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
                        <span style={{fontSize:14,color:C.textBright,fontWeight:700}}>{item.topic}</span>
                      </div>
                      <span style={{color:item.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
                    </div>
                    {open && (
                      <div style={{padding:"12px 14px"}}>
                        <div style={{fontSize:13,color:C.text,lineHeight:1.8,whiteSpace:"pre-line",marginBottom:10}}>{item.body}</div>
                        <div style={{background:`${item.color}08`,padding:"8px 12px",borderLeft:`2px solid ${item.color}55`,fontSize:12,color:item.color,lineHeight:1.6}}>⚡ {item.tip}</div>
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
            <div style={{fontSize:12,color:C.textDim,letterSpacing:2,marginBottom:14}}>
              WHERE TO FIND QUESTS · HOW TO TRACK ITEMS · EXOTIC QUEST SOURCES
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {QUEST_GUIDES.filter(q=>!search||f(q.name)||f(q.how)||f(q.find)).map((q,i)=>{
                const open=expanded===`q-${i}`;
                return (
                  <div key={i} style={{border:`1px solid ${open?q.color+"55":C.border}`,background:C.panel}}>
                    <div onClick={()=>setExpanded(open?null:`q-${i}`)}
                      style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,background:open?`${q.color}08`:"transparent",borderBottom:open?`1px solid ${C.border}`:"none"}}
                      onMouseEnter={e=>e.currentTarget.style.background=`${q.color}0a`}
                      onMouseLeave={e=>e.currentTarget.style.background=open?`${q.color}08`:"transparent"}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:18}}>{q.icon}</span>
                        <span style={{fontSize:14,color:C.textBright,fontWeight:700}}>{q.name}</span>
                      </div>
                      <span style={{color:q.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
                    </div>
                    {open && (
                      <div style={{padding:"12px 14px"}}>
                        <div style={{marginBottom:8}}>
                          <div style={{fontSize:10,letterSpacing:2,color:q.color,marginBottom:4}}>HOW IT WORKS</div>
                          <div style={{fontSize:13,color:C.text,lineHeight:1.8,whiteSpace:"pre-line"}}>{q.how}</div>
                        </div>
                        <div style={{marginBottom:8,background:`${C.cyan}08`,padding:"8px 10px",borderLeft:`2px solid ${C.cyan}44`}}>
                          <div style={{fontSize:10,letterSpacing:2,color:C.cyan,marginBottom:3}}>📍 WHERE TO FIND</div>
                          <div style={{fontSize:12,color:C.text,lineHeight:1.6}}>{q.find}</div>
                        </div>
                        <div style={{background:`${q.color}08`,padding:"8px 10px",borderLeft:`2px solid ${q.color}44`,fontSize:12,color:q.color,lineHeight:1.6}}>⚡ {q.tip}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── ORNAMENTS ── */}
        {tab==="ORNAMENTS" && (
          <>
            <div style={{fontSize:12,color:C.textDim,letterSpacing:2,marginBottom:14}}>
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
                        <span style={{fontSize:14,color:C.textBright,fontWeight:700}}>{o.name}</span>
                      </div>
                      <span style={{color:o.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
                    </div>
                    {open && (
                      <div style={{padding:"12px 14px"}}>
                        <div style={{fontSize:13,color:C.text,lineHeight:1.8,marginBottom:10}}>{o.how}</div>
                        <div style={{marginBottom:10}}>
                          <div style={{fontSize:10,letterSpacing:2,color:o.color,marginBottom:6}}>SOURCES</div>
                          <div style={{display:"flex",flexDirection:"column",gap:5}}>
                            {o.sources.map((s2,si)=>(
                              <div key={si} style={{display:"flex",gap:8,fontSize:12,color:C.textDim,lineHeight:1.6}}>
                                <span style={{color:o.color,flexShrink:0,marginTop:2}}>▸</span>
                                <span>{s2}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div style={{background:`${o.color}08`,padding:"8px 12px",borderLeft:`2px solid ${o.color}55`,fontSize:12,color:o.color,lineHeight:1.6}}>⚡ {o.tip}</div>
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
            <div style={{fontSize:12,color:C.textDim,letterSpacing:2,marginBottom:14}}>
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
                        <span style={{fontSize:14,color:C.textBright,fontWeight:700}}>{b.name}</span>
                      </div>
                      <span style={{color:b.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
                    </div>
                    {open && (
                      <div style={{padding:"12px 14px"}}>
                        <div style={{fontSize:13,color:C.text,lineHeight:1.8,marginBottom:10}}>{b.how}</div>
                        <div style={{marginBottom:10,background:`${C.green}08`,padding:"8px 10px",borderLeft:`2px solid ${C.green}44`}}>
                          <div style={{fontSize:10,letterSpacing:2,color:C.green,marginBottom:4}}>HOW TO COMPLETE</div>
                          <div style={{fontSize:12,color:C.text,lineHeight:1.7}}>{b.complete}</div>
                        </div>
                        <div style={{background:`${b.color}08`,padding:"8px 12px",borderLeft:`2px solid ${b.color}55`,fontSize:12,color:b.color,lineHeight:1.6}}>⚡ {b.tip}</div>
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
            <div style={{fontSize:12,color:C.textDim,letterSpacing:2,marginBottom:14}}>
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
                      <span style={{fontSize:14,color:C.textBright,fontWeight:700}}>{w.name}</span>
                    </div>
                    <span style={{color:w.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
                  </div>
                  {open&&(
                    <div style={{padding:"12px 14px"}}>
                      <div style={{fontSize:13,color:C.text,lineHeight:1.8,whiteSpace:"pre-line",marginBottom:10}}>{w.how}</div>
                      {w.steps&&(
                        <div style={{marginBottom:10,background:`${C.green}06`,padding:"8px 10px",borderLeft:`2px solid ${C.green}33`}}>
                          <div style={{fontSize:10,letterSpacing:2,color:C.green,marginBottom:5}}>STEPS</div>
                          {w.steps.map((s2,si)=>(
                            <div key={si} style={{display:"flex",gap:8,marginBottom:si<w.steps.length-1?5:0}}>
                              <span style={{color:C.green,fontWeight:700,flexShrink:0,fontSize:11}}>{si+1}.</span>
                              <span style={{fontSize:12,color:C.text,lineHeight:1.6}}>{s2}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{background:`${w.color}08`,padding:"8px 12px",borderLeft:`2px solid ${w.color}55`,fontSize:12,color:w.color,lineHeight:1.6}}>⚡ {w.tip}</div>
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
            <div style={{fontSize:12,color:C.textDim,letterSpacing:2,marginBottom:14}}>
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
                          <div style={{fontSize:13,color:s.color,fontWeight:700,letterSpacing:2}}>{s.stat.toUpperCase()}</div>
                          <div style={{fontSize:11,color:C.textDim}}>{s.affects}</div>
                        </div>
                      </div>
                      <span style={{color:s.color,fontSize:13,flexShrink:0}}>{open?"▲":"▼"}</span>
                    </div>
                    {open&&(
                      <div style={{padding:"10px 14px"}}>
                        <div style={{fontSize:12,color:C.textDim,lineHeight:1.7,marginBottom:8}}>{s.tiers}</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                          <div style={{background:`${C.green}08`,padding:"7px 9px",borderLeft:`2px solid ${C.green}44`}}>
                            <div style={{fontSize:9,letterSpacing:2,color:C.green,marginBottom:3}}>PvE</div>
                            <div style={{fontSize:11,color:C.textDim,lineHeight:1.5}}>{s.pve}</div>
                          </div>
                          <div style={{background:`${C.red}08`,padding:"7px 9px",borderLeft:`2px solid ${C.red}44`}}>
                            <div style={{fontSize:9,letterSpacing:2,color:C.red,marginBottom:3}}>PvP</div>
                            <div style={{fontSize:11,color:C.textDim,lineHeight:1.5}}>{s.pvp}</div>
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
                <div style={{fontSize:13,color:C.textBright,fontWeight:700,marginBottom:7}}>{a.name}</div>
                <div style={{fontSize:12,color:C.textDim,lineHeight:1.8,whiteSpace:"pre-line"}}>{a.body}</div>
              </div>
            ))}
          </>
        )}

        {/* ── BUILD CRAFTING ── */}
        {tab==="BUILD CRAFTING" && (
          <>
            <div style={{fontSize:12,color:C.textDim,letterSpacing:2,marginBottom:14}}>
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
                      <span style={{fontSize:14,color:C.textBright,fontWeight:700}}>{b.name}</span>
                    </div>
                    <span style={{color:b.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
                  </div>
                  {open&&(
                    <div style={{padding:"12px 14px"}}>
                      <div style={{fontSize:13,color:C.text,lineHeight:1.8,whiteSpace:"pre-line",marginBottom:10}}>{b.how}</div>
                      <div style={{background:`${b.color}08`,padding:"8px 12px",borderLeft:`2px solid ${b.color}55`,fontSize:12,color:b.color,lineHeight:1.6}}>⚡ {b.tip}</div>
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
            <div style={{fontSize:12,color:C.textDim,letterSpacing:2,marginBottom:14}}>
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
                      <span style={{fontSize:14,color:C.textBright,fontWeight:700}}>{v.name}</span>
                    </div>
                    <span style={{color:v.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
                  </div>
                  {open&&(
                    <div style={{padding:"12px 14px"}}>
                      <div style={{marginBottom:8,background:`${v.color}08`,padding:"8px 10px",borderLeft:`2px solid ${v.color}44`}}>
                        <div style={{fontSize:10,letterSpacing:2,color:v.color,marginBottom:3}}>📍 LOCATION</div>
                        <div style={{fontSize:12,color:C.text,lineHeight:1.6}}>{v.location}</div>
                      </div>
                      <div style={{marginBottom:8}}>
                        <div style={{fontSize:10,letterSpacing:2,color:C.gold,marginBottom:3}}>SELLS / OFFERS</div>
                        <div style={{fontSize:12,color:C.textDim,lineHeight:1.7,whiteSpace:"pre-line"}}>{v.sells}</div>
                      </div>
                      {v.currency&&(
                        <div style={{marginBottom:8,background:`${C.gold}08`,padding:"8px 10px",borderLeft:`2px solid ${C.gold}44`}}>
                          <div style={{fontSize:10,letterSpacing:2,color:C.gold,marginBottom:3}}>CURRENCY</div>
                          <div style={{fontSize:12,color:C.textDim,lineHeight:1.7,whiteSpace:"pre-line"}}>{v.currency}</div>
                        </div>
                      )}
                      <div style={{background:`${v.color}08`,padding:"8px 12px",borderLeft:`2px solid ${v.color}55`,fontSize:12,color:v.color,lineHeight:1.6}}>⚡ {v.tip}</div>
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
            <div style={{fontSize:12,color:C.textDim,letterSpacing:2,marginBottom:14}}>
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
                  cursor:"pointer",fontSize:12,letterSpacing:3,...F,fontWeight:classFilter===cls?700:400,
                }}>{label}</button>
              ))}
            </div>

            {/* Best weapons callout */}
            <div style={{background:C.panel,border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.gold}`,padding:"10px 14px",marginBottom:14}}>
              <div style={{fontSize:10,letterSpacing:3,color:C.gold,marginBottom:6}}>🔫 WEAPONS THAT FIT EVERY BUILD</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {["Praxic Blade (Heavy Sword)","Still Hunt (Special Sniper)","Khvostov 7G-0X (Primary)","Outbreak Perfected (Primary)","Arbalest (Special Linear — +33% vs Barrier Champions)","Conditional Finality (Shotgun — stuns 2 Champion types)"].map((w,i)=>(
                  <span key={i} style={{fontSize:10,color:C.gold,background:`${C.gold}10`,border:`1px solid ${C.gold}33`,padding:"2px 7px"}}>{w}</span>
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
                        <span style={{fontSize:14,color:C.textBright,fontWeight:700}}>{b.name}</span>
                        <span style={{fontSize:10,color:col,background:`${col}15`,border:`1px solid ${col}44`,padding:"1px 6px",letterSpacing:1}}>{b.subclass.toUpperCase()}</span>
                      </div>
                      <div style={{fontSize:11,color:C.textDim,letterSpacing:1}}>Exotic: <span style={{color:C.gold}}>{b.exotic}</span></div>
                    </div>
                    <span style={{color:col,fontSize:14,flexShrink:0,marginTop:2}}>{open?"▲":"▼"}</span>
                  </div>

                  {open&&(
                    <div style={{padding:"12px 14px"}}>
                      {/* Exotic weapon */}
                      {b.exoticWeapon&&(
                        <div style={{marginBottom:10,background:`${C.gold}08`,padding:"7px 10px",borderLeft:`2px solid ${C.gold}44`}}>
                          <div style={{fontSize:10,letterSpacing:2,color:C.gold,marginBottom:2}}>EXOTIC WEAPON</div>
                          <div style={{fontSize:12,color:C.text}}>{b.exoticWeapon}</div>
                        </div>
                      )}
                      {/* Aspects + Stats */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                        <div style={{background:`${col}08`,padding:"7px 10px",borderLeft:`2px solid ${col}44`}}>
                          <div style={{fontSize:10,letterSpacing:2,color:col,marginBottom:4}}>KEY ASPECTS</div>
                          {b.aspects.map((a,ai)=>(
                            <div key={ai} style={{fontSize:11,color:C.text,marginBottom:ai<b.aspects.length-1?3:0}}>▸ {a}</div>
                          ))}
                        </div>
                        <div style={{background:`${C.arc}08`,padding:"7px 10px",borderLeft:`2px solid ${C.arc}44`}}>
                          <div style={{fontSize:10,letterSpacing:2,color:C.arc,marginBottom:4}}>TARGET STATS</div>
                          <div style={{fontSize:11,color:C.text,lineHeight:1.7}}>{b.stats}</div>
                        </div>
                      </div>
                      {/* Loop */}
                      <div style={{marginBottom:10}}>
                        <div style={{fontSize:10,letterSpacing:2,color:C.green,marginBottom:4}}>⚙ HOW THE LOOP WORKS</div>
                        <div style={{fontSize:12,color:C.text,lineHeight:1.8,background:`${C.green}06`,padding:"8px 10px",borderLeft:`2px solid ${C.green}33`}}>{b.loop}</div>
                      </div>
                      {/* Best for */}
                      <div style={{marginBottom:10,background:`${col}08`,padding:"7px 10px",borderLeft:`2px solid ${col}44`}}>
                        <div style={{fontSize:10,letterSpacing:2,color:col,marginBottom:3}}>BEST FOR</div>
                        <div style={{fontSize:12,color:C.textDim,lineHeight:1.6}}>{b.best}</div>
                      </div>
                      {/* Tip */}
                      <div style={{background:`${C.gold}08`,padding:"8px 12px",borderLeft:`2px solid ${C.gold}55`,fontSize:12,color:C.gold,lineHeight:1.6}}>⚡ {b.tip}</div>
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
            <div style={{fontSize:12,color:C.textDim,letterSpacing:2,marginBottom:14}}>
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
                      <span style={{fontSize:14,color:C.textBright,fontWeight:700}}>{s.name}</span>
                    </div>
                    <span style={{color:s.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
                  </div>
                  {open&&(
                    <div style={{padding:"12px 14px"}}>
                      <div style={{fontSize:13,color:C.text,lineHeight:1.8,whiteSpace:"pre-line"}}>{s.body}</div>
                    </div>
                  )}
                </div>
              );
            })}
            {/* Sector list by destination */}
            <div style={{marginTop:16}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{width:3,height:14,background:C.teal}}/>
                <span style={{fontSize:12,letterSpacing:4,color:C.teal,fontWeight:700}}>ALL LOST SECTORS BY DESTINATION</span>
                <div style={{flex:1,height:1,background:`${C.teal}22`}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:8}}>
                {LOST_SECTORS_LIST.map((dest,di)=>(
                  <div key={di} style={{background:C.panel,border:`1px solid ${C.border}`,borderTop:`2px solid ${C.teal}44`,padding:"12px 14px"}}>
                    <div style={{fontSize:11,letterSpacing:3,color:C.teal,marginBottom:8,fontWeight:700}}>{dest.location.toUpperCase()}</div>
                    {dest.sectors.map((s,si)=>(
                      <div key={si} style={{display:"flex",gap:6,alignItems:"center",marginBottom:si<dest.sectors.length-1?5:0}}>
                        <span style={{width:3,height:3,background:C.teal,flexShrink:0,display:"inline-block"}}/>
                        <span style={{fontSize:11,color:C.textDim}}>{s}</span>
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
            <div style={{fontSize:12,color:C.textDim,letterSpacing:2,marginBottom:14}}>
              7 FACTIONS · 3 CHAMPION TYPES · BREAK SHIELDS FIRST · CHAMPIONS NEED MATCHING MODS
            </div>

            {/* Champion types callout */}
            <div style={{marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{width:3,height:14,background:C.red}}/>
                <span style={{fontSize:12,letterSpacing:4,color:C.red,fontWeight:700}}>CHAMPION TYPES — CRITICAL FOR ENDGAME</span>
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
                          <span style={{fontSize:14,color:C.textBright,fontWeight:700}}>{ch.type}</span>
                        </div>
                        <span style={{color:ch.color,fontSize:14,flexShrink:0}}>{open?"▲":"▼"}</span>
                      </div>
                      {open&&(
                        <div style={{padding:"10px 14px"}}>
                          <div style={{marginBottom:8,background:`${C.orange}08`,padding:"7px 10px",borderLeft:`2px solid ${C.orange}44`}}>
                            <div style={{fontSize:10,letterSpacing:2,color:C.orange,marginBottom:3}}>HOW TO IDENTIFY</div>
                            <div style={{fontSize:12,color:C.text,lineHeight:1.6}}>{ch.identify}</div>
                          </div>
                          <div style={{marginBottom:8,background:`${C.green}08`,padding:"7px 10px",borderLeft:`2px solid ${C.green}44`}}>
                            <div style={{fontSize:10,letterSpacing:2,color:C.green,marginBottom:3}}>HOW TO COUNTER</div>
                            <div style={{fontSize:12,color:C.text,lineHeight:1.6}}>{ch.counter}</div>
                          </div>
                          <div style={{background:`${ch.color}08`,padding:"7px 10px",borderLeft:`2px solid ${ch.color}44`,fontSize:12,color:ch.color,lineHeight:1.6}}>⚡ {ch.tip}</div>
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
              <span style={{fontSize:12,letterSpacing:4,color:C.orange,fontWeight:700}}>ENEMY FACTIONS</span>
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
                        <span style={{fontSize:14,color:C.textBright,fontWeight:700}}>{enemy.name}</span>
                        <span style={{fontSize:10,color:enemy.color,background:`${enemy.color}15`,border:`1px solid ${enemy.color}44`,padding:"1px 6px",letterSpacing:1}}>Shield: {enemy.shield}</span>
                      </div>
                      <div style={{fontSize:11,color:C.textDim}}>Found: {enemy.where}</div>
                    </div>
                    <span style={{color:enemy.color,fontSize:14,flexShrink:0,marginTop:2}}>{open?"▲":"▼"}</span>
                  </div>
                  {open&&(
                    <div style={{padding:"12px 14px"}}>
                      <div style={{marginBottom:10,background:`${C.blue}08`,padding:"8px 10px",borderLeft:`2px solid ${C.blue}44`}}>
                        <div style={{fontSize:10,letterSpacing:2,color:C.blue,marginBottom:4}}>UNIT TYPES</div>
                        <div style={{fontSize:12,color:C.textDim,lineHeight:1.7}}>{enemy.tiers}</div>
                      </div>
                      <div style={{marginBottom:10,background:`${enemy.color}06`,padding:"8px 10px",borderLeft:`2px solid ${enemy.color}44`}}>
                        <div style={{fontSize:10,letterSpacing:2,color:enemy.color,marginBottom:4}}>SHIELD BEHAVIOR</div>
                        <div style={{fontSize:12,color:C.text,lineHeight:1.7}}>{enemy.shields}</div>
                      </div>
                      <div style={{marginBottom:10}}>
                        <div style={{fontSize:10,letterSpacing:2,color:C.green,marginBottom:4}}>⚔ HOW TO FIGHT</div>
                        <div style={{fontSize:13,color:C.text,lineHeight:1.8,background:`${C.green}06`,padding:"8px 10px",borderLeft:`2px solid ${C.green}33`}}>{enemy.howToFight}</div>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                        <div style={{background:`${C.red}08`,padding:"7px 10px",borderLeft:`2px solid ${C.red}44`}}>
                          <div style={{fontSize:10,letterSpacing:2,color:C.red,marginBottom:3}}>CHAMPIONS (ENDGAME)</div>
                          <div style={{fontSize:12,color:C.textDim,lineHeight:1.5}}>{enemy.champions}</div>
                        </div>
                        <div style={{background:`${C.gold}08`,padding:"7px 10px",borderLeft:`2px solid ${C.gold}44`}}>
                          <div style={{fontSize:10,letterSpacing:2,color:C.gold,marginBottom:3}}>⚡ KEY TIP</div>
                          <div style={{fontSize:12,color:C.textDim,lineHeight:1.5}}>{enemy.tip}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        <div style={{marginTop:22,borderTop:`1px solid ${C.border}`,paddingTop:10,fontSize:10,color:C.dimmer,letterSpacing:2,textAlign:"center"}}>
          DESTINY 2 · MONUMENT OF TRIUMPH FINAL SANDBOX · JUNE 2026 · GAME REMAINS ONLINE FOREVER
        </div>
      </div>
    </div>
  );
}
