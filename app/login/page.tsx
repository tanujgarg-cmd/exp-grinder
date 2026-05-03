"use client";
// @ts-nocheck
import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
const WEAPONS = [
  { id: 1, name: "Plasma Dagger", price: 800, damage: 5, speed: 9, type: "attack", rarity: "common", emoji: "🗡️" },
  { id: 2, name: "Ion Blaster", price: 1400, damage: 7, speed: 6, type: "attack", rarity: "common", emoji: "🔫" },
  { id: 3, name: "Photon Shield", price: 1200, damage: 2, speed: 4, type: "defense", rarity: "common", emoji: "🛡️" },
  { id: 4, name: "Spark Knuckles", price: 1000, damage: 6, speed: 8, type: "attack", rarity: "common", emoji: "👊" },
  { id: 5, name: "Pulse Pistol", price: 1600, damage: 8, speed: 7, type: "attack", rarity: "common", emoji: "💫" },
  { id: 6, name: "Steel Barrier", price: 1800, damage: 3, speed: 3, type: "defense", rarity: "common", emoji: "🧱" },
  { id: 47, name: "Nano Buckler", price: 2200, damage: 4, speed: 6, type: "defense", rarity: "common", emoji: "🪬" },
  { id: 53, name: "Shock Guard", price: 2600, damage: 7, speed: 7, type: "both", rarity: "common", emoji: "⚙️" },
  { id: 7, name: "Circuit Blade", price: 2400, damage: 10, speed: 8, type: "attack", rarity: "common", emoji: "⚡" },
  { id: 8, name: "Frag Launcher", price: 3200, damage: 12, speed: 5, type: "attack", rarity: "common", emoji: "💣" },
  { id: 34, name: "Arc Spear", price: 2800, damage: 11, speed: 7, type: "attack", rarity: "common", emoji: "🔱" },
  { id: 9, name: "Neon Katana", price: 3400, damage: 12, speed: 8, type: "attack", rarity: "rare", emoji: "⚔️" },
  { id: 10, name: "Void Cannon", price: 4600, damage: 15, speed: 4, type: "attack", rarity: "rare", emoji: "💥" },
  { id: 11, name: "Quantum Gauntlet", price: 4000, damage: 13, speed: 7, type: "attack", rarity: "rare", emoji: "🥊" },
  { id: 12, name: "Cryo Rifle", price: 5000, damage: 14, speed: 5, type: "attack", rarity: "rare", emoji: "❄️" },
  { id: 13, name: "Phase Cloak", price: 4200, damage: 5, speed: 9, type: "both", rarity: "rare", emoji: "🫥" },
  { id: 14, name: "Thermal Lance", price: 6000, damage: 16, speed: 6, type: "attack", rarity: "rare", emoji: "🔥" },
  { id: 15, name: "Holo Turret", price: 7000, damage: 16, speed: 3, type: "attack", rarity: "rare", emoji: "🏗️" },
  { id: 35, name: "Storm Hatchet", price: 5500, damage: 15, speed: 8, type: "attack", rarity: "rare", emoji: "🪓" },
  { id: 42, name: "Flux Ward", price: 5200, damage: 6, speed: 7, type: "defense", rarity: "rare", emoji: "🔮" },
  { id: 48, name: "Plasma Dome", price: 6500, damage: 7, speed: 5, type: "defense", rarity: "rare", emoji: "🫧" },
  { id: 54, name: "Thorn Mantle", price: 5800, damage: 10, speed: 6, type: "both", rarity: "rare", emoji: "🌿" },
  { id: 16, name: "Nebula Rifle", price: 8000, damage: 18, speed: 5, type: "attack", rarity: "epic", emoji: "✴️" },
  { id: 17, name: "Dark Matter Blade", price: 10000, damage: 20, speed: 9, type: "attack", rarity: "epic", emoji: "🌑" },
  { id: 18, name: "Gravity Hammer", price: 11000, damage: 22, speed: 4, type: "attack", rarity: "epic", emoji: "🔨" },
  { id: 19, name: "Prism Cannon", price: 12000, damage: 21, speed: 6, type: "attack", rarity: "epic", emoji: "🌈" },
  { id: 20, name: "Void Armor", price: 13000, damage: 8, speed: 7, type: "both", rarity: "epic", emoji: "🕳️" },
  { id: 21, name: "Tesla Whip", price: 16000, damage: 23, speed: 8, type: "attack", rarity: "epic", emoji: "⛓️" },
  { id: 36, name: "Plasma Railgun", price: 14000, damage: 22, speed: 5, type: "attack", rarity: "epic", emoji: "🔋" },
  { id: 37, name: "Warp Claws", price: 9000, damage: 19, speed: 10, type: "attack", rarity: "epic", emoji: "🐲" },
  { id: 43, name: "Aegis Matrix", price: 12500, damage: 10, speed: 8, type: "defense", rarity: "epic", emoji: "🧊" },
  { id: 49, name: "Warden Core", price: 15000, damage: 12, speed: 6, type: "defense", rarity: "epic", emoji: "🪨" },
  { id: 55, name: "Tempest Veil", price: 13500, damage: 16, speed: 7, type: "both", rarity: "epic", emoji: "🌪️" },
  { id: 22, name: "Singularity Staff", price: 24000, damage: 24, speed: 5, type: "attack", rarity: "legendary", emoji: "🌀" },
  { id: 23, name: "Chrono Scythe", price: 30000, damage: 26, speed: 8, type: "attack", rarity: "legendary", emoji: "⏳" },
  { id: 24, name: "Antimatter Bow", price: 40000, damage: 28, speed: 7, type: "attack", rarity: "legendary", emoji: "🏹" },
  { id: 25, name: "Dimensional Aegis", price: 50000, damage: 14, speed: 9, type: "both", rarity: "legendary", emoji: "🔰" },
  { id: 38, name: "Starforge Blade", price: 35000, damage: 27, speed: 9, type: "attack", rarity: "legendary", emoji: "⭐" },
  { id: 44, name: "Chrono Bastion", price: 45000, damage: 16, speed: 9, type: "defense", rarity: "legendary", emoji: "⏱️" },
  { id: 50, name: "Radiant Bulwark", price: 48000, damage: 15, speed: 10, type: "defense", rarity: "legendary", emoji: "🌅" },
  { id: 56, name: "Eclipse Fang", price: 42000, damage: 22, speed: 8, type: "both", rarity: "legendary", emoji: "🌘" },
  { id: 26, name: "Entropy Reaver", price: 70000, damage: 30, speed: 9, type: "attack", rarity: "mythic", emoji: "☠️" },
  { id: 27, name: "Supernova Cannon", price: 84000, damage: 32, speed: 6, type: "attack", rarity: "mythic", emoji: "🌟" },
  { id: 28, name: "Godslayer Nexus", price: 100000, damage: 34, speed: 10, type: "attack", rarity: "mythic", emoji: "👁️" },
  { id: 39, name: "Oblivion Lance", price: 90000, damage: 33, speed: 7, type: "attack", rarity: "mythic", emoji: "🕸️" },
  { id: 45, name: "Eternity Shell", price: 95000, damage: 18, speed: 10, type: "defense", rarity: "mythic", emoji: "💎" },
  { id: 51, name: "Celestial Guard", price: 88000, damage: 17, speed: 9, type: "defense", rarity: "mythic", emoji: "🌙" },
  { id: 57, name: "Phantom Crown", price: 92000, damage: 28, speed: 8, type: "both", rarity: "mythic", emoji: "👑" },
  { id: 29, name: "̷E̷R̷R̷O̷R̷ Fang", price: 150000, damage: 36, speed: 10, type: "attack", rarity: "glitched", emoji: "🦷" },
  { id: 30, name: "NULL::Cannon", price: 200000, damage: 38, speed: 8, type: "attack", rarity: "glitched", emoji: "💀" },
  { id: 31, name: "0xDEAD Shield", price: 250000, damage: 20, speed: 10, type: "both", rarity: "glitched", emoji: "🛑" },
  { id: 32, name: "Segfault Scythe", price: 350000, damage: 40, speed: 9, type: "attack", rarity: "glitched", emoji: "👾" },
  { id: 33, name: "OVERFLOW.exe", price: 500000, damage: 42, speed: 10, type: "attack", rarity: "glitched", emoji: "🧿" },
  { id: 40, name: "FATAL::Edge", price: 420000, damage: 41, speed: 10, type: "attack", rarity: "glitched", emoji: "⚠️" },
  { id: 41, name: "KERNEL::Panic", price: 475000, damage: 39, speed: 9, type: "both", rarity: "glitched", emoji: "🔥" },
  { id: 46, name: "NaN::Fortress", price: 380000, damage: 22, speed: 10, type: "defense", rarity: "glitched", emoji: "🏰" },
  { id: 52, name: "VOID::Barrier", price: 300000, damage: 21, speed: 10, type: "defense", rarity: "glitched", emoji: "🌀" },
];
const RARITY_COLORS = {
  common: "#6ee7b7",
  rare: "#60a5fa",
  epic: "#c084fc",
  legendary: "#fbbf24",
  mythic: "#ef4444",
  glitched: "#ff00ff",
  pet: "#ff69b4",
};
const MATERIALS = [
  { id: "plasma", name: "Plasma Shard", emoji: "⚡", price: 1600, color: "#0ff", desc: "Basic energy fragment" },
  { id: "cryo", name: "Cryo Crystal", emoji: "❄️", price: 3200, color: "#60a5fa", desc: "Frozen power core" },
  { id: "inferno", name: "Inferno Core", emoji: "🔥", price: 6000, color: "#f90", desc: "Volatile fire essence" },
  { id: "voidF", name: "Void Fragment", emoji: "🕳️", price: 12000, color: "#c084fc", desc: "Dimensional rift shard" },
  { id: "star", name: "Star Dust", emoji: "✨", price: 24000, color: "#fbbf24", desc: "Cosmic particle" },
  { id: "glitch", name: "Glitch Code", emoji: "👾", price: 48000, color: "#ff00ff", desc: "Corrupted data strand" },
  { id: "dark", name: "Dark Matter", emoji: "🌑", price: 8000, color: "#888", desc: "Universal binding agent" },
];
const POTIONS = [
  { id: "fire", name: "Fire Aspect", emoji: "🔥", color: "#f90",
    desc: "Burns enemy for extra damage each turn",
    craft: { inferno: 3, plasma: 2, dark: 1 },
    effects: [
      { merge: 1, burnDmg: 3 }, { merge: 2, burnDmg: 6 },
      { merge: 3, burnDmg: 10 }, { merge: 4, burnDmg: 15 }, { merge: 5, burnDmg: 22 },
    ],
  },
  { id: "ice", name: "Ice Aspect", emoji: "❄️", color: "#60a5fa",
    desc: "Reduces enemy damage output",
    craft: { cryo: 3, plasma: 2, dark: 1 },
    effects: [
      { merge: 1, slowPct: 10 }, { merge: 2, slowPct: 18 },
      { merge: 3, slowPct: 26 }, { merge: 4, slowPct: 35 }, { merge: 5, slowPct: 45 },
    ],
  },
  { id: "lightning", name: "Lightning Aspect", emoji: "⚡", color: "#fbbf24",
    desc: "Chance to stun enemy, skipping their turn",
    craft: { plasma: 4, inferno: 1, dark: 2 },
    effects: [
      { merge: 1, stunPct: 10 }, { merge: 2, stunPct: 18 },
      { merge: 3, stunPct: 26 }, { merge: 4, stunPct: 35 }, { merge: 5, stunPct: 45 },
    ],
  },
  { id: "poison", name: "Poison Aspect", emoji: "☠️", color: "#0f0",
    desc: "Stacking poison damage each turn",
    craft: { voidF: 2, cryo: 2, dark: 2 },
    effects: [
      { merge: 1, poisonDmg: 2 }, { merge: 2, poisonDmg: 4 },
      { merge: 3, poisonDmg: 7 }, { merge: 4, poisonDmg: 11 }, { merge: 5, poisonDmg: 16 },
    ],
  },
];
function getPotionEffect(potionId, merge) {
  const p = POTIONS.find(p => p.id === potionId);
  return p ? p.effects[Math.min((merge || 1) - 1, 4)] : {};
}
function getUpgradeCost(currentLevel) {
  if (currentLevel >= 50) return null;
  const target = currentLevel + 1;
  if (target <= 6) return target * 1000;
  return 10000 + (target - 7) * 5000;
}
function getWeaponStats(weapon) {
  const lvl = weapon.level || 1;
  if (weapon.rarity === "pet") {
    const merge = weapon.merge || 1;
    const mergeDmg = Math.floor((merge - 1) * weapon.damage * 0.1);
    const mergeSpd = Math.min(Math.floor((merge - 1) * 0.2), 15);
    const mergeDef = (weapon.type === "defense" || weapon.type === "both") ? Math.floor((merge - 1) * 3) + 5 : 0;
    const mergeAtk = (weapon.type === "attack" || weapon.type === "both") ? Math.floor((merge - 1) * 2) + 4 : 0;
    return { damage: weapon.damage + mergeDmg, speed: Math.min(weapon.speed + mergeSpd, 25), defense: mergeDef, attack: mergeAtk };
  }
  const bonusDmg = Math.floor((lvl - 1) * weapon.damage * 0.08);
  const bonusSpd = Math.min(Math.floor((lvl - 1) * 0.15), 10);
  const baseDef = weapon.type === "defense" ? 8 : weapon.type === "both" ? 5 : 0;
  const bonusDef = (weapon.type === "defense" || weapon.type === "both") ? Math.floor((lvl - 1) * baseDef * 0.1) : 0;
  const baseAtk = weapon.type === "attack" ? 6 : weapon.type === "both" ? 4 : 0;
  const bonusAtk = (weapon.type === "attack" || weapon.type === "both") ? Math.floor((lvl - 1) * baseAtk * 0.1) : 0;
  return { damage: weapon.damage + bonusDmg, speed: Math.min(weapon.speed + bonusSpd, 20), defense: baseDef + bonusDef, attack: baseAtk + bonusAtk };
}
function getSellPrice(weapon) {
  const lvl = weapon.level || 1;
  let totalInvested = weapon.price;
  for (let i = 1; i < lvl; i++) {
    totalInvested += getUpgradeCost(i);
  }
  return Math.floor(totalInvested / 2);
}
const TRIVIA_CATEGORIES = [
  { id: "science", name: "SCIENCE & SPACE", icon: "🔬", color: "#6ee7b7", desc: "Physics, biology, astronomy",
    levels: [
      { diff: "easy", coins: 800, time: 75 },
      { diff: "medium", coins: 2000, time: 55 },
      { diff: "hard", coins: 4000, time: 40 },
    ],
    questions: {
      easy: [
        { q: "What planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1 },
        { q: "What gas do plants absorb?", options: ["Oxygen", "Nitrogen", "CO2", "Helium"], answer: 2 },
        { q: "What is the largest organ in the human body?", options: ["Liver", "Brain", "Skin", "Heart"], answer: 2 },
        { q: "How many planets are in our solar system?", options: ["7", "8", "9", "10"], answer: 1 },
        { q: "What is H2O commonly known as?", options: ["Salt", "Water", "Oxygen", "Acid"], answer: 1 },
      
        { q: "What is the center of an atom called?", options: ["Proton", "Electron", "Nucleus", "Neutron"], answer: 2 },
        { q: "Which gas makes up most of Earth's atmosphere?", options: ["Oxygen", "Nitrogen", "CO2", "Helium"], answer: 1 },
        { q: "What type of animal is a dolphin?", options: ["Fish", "Reptile", "Mammal", "Amphibian"], answer: 2 },
        { q: "What is the boiling point of water in Celsius?", options: ["50", "75", "100", "150"], answer: 2 },
        { q: "How many bones does a shark have?", options: ["0", "50", "100", "200"], answer: 0 },
      
        { q: "What is frozen water called?", options: ["Steam", "Vapor", "Ice", "Frost"], answer: 2 },
        { q: "Which planet is closest to the Sun?", options: ["Venus", "Mercury", "Mars", "Earth"], answer: 1 },
        { q: "What do bees make?", options: ["Silk", "Honey", "Wax", "Milk"], answer: 1 },
        { q: "What is the largest planet?", options: ["Saturn", "Neptune", "Jupiter", "Uranus"], answer: 2 },
        { q: "What force keeps us on the ground?", options: ["Magnetism", "Gravity", "Friction", "Inertia"], answer: 1 },
        { q: "What organ pumps blood?", options: ["Brain", "Lungs", "Heart", "Liver"], answer: 2 },
        { q: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], answer: 2 },
        { q: "How many legs do insects have?", options: ["4", "6", "8", "10"], answer: 1 },
        { q: "What is the closest star to Earth?", options: ["Sirius", "Proxima", "Sun", "Vega"], answer: 2 },
      
        { q: "What is the Sun?", options: ["Planet", "Moon", "Star", "Asteroid"], answer: 2 },
        { q: "How many eyes do most spiders have?", options: ["2", "4", "6", "8"], answer: 3 },
        { q: "What gas do we breathe out?", options: ["Oxygen", "CO2", "Nitrogen", "Helium"], answer: 1 },
        { q: "What are baby cats called?", options: ["Puppies", "Kittens", "Cubs", "Calves"], answer: 1 },
        { q: "Is the Sun a solid, liquid, or gas?", options: ["Solid", "Liquid", "Gas", "Plasma"], answer: 3 },
        { q: "What do magnets attract?", options: ["Wood", "Plastic", "Iron", "Glass"], answer: 2 },
        { q: "What is the smallest planet?", options: ["Mars", "Mercury", "Pluto", "Venus"], answer: 1 },
        { q: "What sense do ears provide?", options: ["Sight", "Hearing", "Smell", "Taste"], answer: 1 },
        { q: "What do tadpoles grow into?", options: ["Fish", "Frogs", "Snakes", "Turtles"], answer: 1 },
        { q: "What covers 71% of Earth?", options: ["Sand", "Ice", "Water", "Forest"], answer: 2 },
        { q: "What is a shooting star?", options: ["Star", "Planet", "Meteor", "Comet"], answer: 2 },
        { q: "What animal has the longest neck?", options: ["Horse", "Camel", "Giraffe", "Ostrich"], answer: 2 },
        { q: "What is lava from?", options: ["Ocean", "Volcano", "Glacier", "River"], answer: 1 },
        { q: "How many senses do humans have?", options: ["3", "4", "5", "6"], answer: 2 },
        { q: "What is the opposite of frozen?", options: ["Cold", "Melted", "Solid", "Dry"], answer: 1 },
        { q: "What do plants need to grow?", options: ["Darkness", "Sunlight", "Cold", "Wind"], answer: 1 },
        { q: "What is the biggest bird?", options: ["Eagle", "Ostrich", "Penguin", "Hawk"], answer: 1 },
        { q: "What season comes after spring?", options: ["Fall", "Winter", "Summer", "Spring"], answer: 2 },
        { q: "What is a group of fish called?", options: ["Herd", "Flock", "School", "Pack"], answer: 2 },
        { q: "What planet has rings?", options: ["Mars", "Jupiter", "Saturn", "Venus"], answer: 2 },
        { q: "What is thunder caused by?", options: ["Wind", "Rain", "Lightning", "Clouds"], answer: 2 },
        { q: "What animal is the fastest swimmer?", options: ["Shark", "Dolphin", "Sailfish", "Whale"], answer: 2 },
        { q: "What part of the plant is underground?", options: ["Leaf", "Stem", "Root", "Flower"], answer: 2 },
        { q: "What is a baby horse called?", options: ["Calf", "Lamb", "Foal", "Kid"], answer: 2 },
        { q: "What state of matter is steam?", options: ["Solid", "Liquid", "Gas", "Plasma"], answer: 2 },
        { q: "What bone protects the brain?", options: ["Rib", "Spine", "Skull", "Pelvis"], answer: 2 },
        { q: "What is the largest ocean animal?", options: ["Shark", "Blue Whale", "Squid", "Walrus"], answer: 1 },
        { q: "What layer protects Earth from UV?", options: ["Troposphere", "Ozone", "Crust", "Mantle"], answer: 1 },
        { q: "What is the main ingredient in glass?", options: ["Iron", "Sand", "Clay", "Coal"], answer: 1 },
        { q: "How many teeth do adult humans usually have?", options: ["28", "30", "32", "34"], answer: 2 },
      ],
      medium: [
        { q: "What is the speed of light in km/s?", options: ["150,000", "300,000", "450,000", "600,000"], answer: 1 },
        { q: "Which element has the symbol 'Au'?", options: ["Silver", "Aluminum", "Gold", "Argon"], answer: 2 },
        { q: "What is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Titanium"], answer: 2 },
        { q: "What planet has the Great Red Spot?", options: ["Mars", "Saturn", "Jupiter", "Neptune"], answer: 2 },
        { q: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Membrane"], answer: 2 },
      
        { q: "What is the most abundant gas in the Sun?", options: ["Helium", "Oxygen", "Hydrogen", "Nitrogen"], answer: 2 },
        { q: "Which vitamin does the Sun help produce?", options: ["A", "B12", "C", "D"], answer: 3 },
        { q: "What particle has a positive charge?", options: ["Electron", "Neutron", "Proton", "Photon"], answer: 2 },
        { q: "How many chambers does a human heart have?", options: ["2", "3", "4", "5"], answer: 2 },
        { q: "What is the chemical formula for table salt?", options: ["NaCl", "KCl", "CaCl2", "NaOH"], answer: 0 },
      
        { q: "What is the hardest mineral?", options: ["Quartz", "Topaz", "Diamond", "Ruby"], answer: 2 },
        { q: "What type of rock is marble?", options: ["Igneous", "Sedimentary", "Metamorphic", "Mineral"], answer: 2 },
        { q: "What is the main gas in the air we breathe?", options: ["Oxygen", "Nitrogen", "CO2", "Argon"], answer: 1 },
        { q: "What does a seismograph measure?", options: ["Wind", "Rain", "Earthquakes", "Temperature"], answer: 2 },
        { q: "How many chromosomes do humans have?", options: ["23", "44", "46", "48"], answer: 2 },
        { q: "What is the pH of a neutral solution?", options: ["0", "5", "7", "14"], answer: 2 },
        { q: "Which planet rotates on its side?", options: ["Neptune", "Uranus", "Saturn", "Jupiter"], answer: 1 },
        { q: "What is the study of fungi called?", options: ["Botany", "Mycology", "Zoology", "Ecology"], answer: 1 },
      
        { q: "What is the speed of light?", options: ["300k km/s", "150k km/s", "500k km/s", "100k km/s"], answer: 0 },
        { q: "What planet is known as Earth's twin?", options: ["Mars", "Venus", "Mercury", "Jupiter"], answer: 1 },
        { q: "What is the most common blood type?", options: ["A", "B", "O", "AB"], answer: 2 },
        { q: "What is the tallest type of tree?", options: ["Oak", "Pine", "Redwood", "Birch"], answer: 2 },
        { q: "What does photosynthesis produce?", options: ["CO2", "Water", "Oxygen", "Nitrogen"], answer: 2 },
        { q: "What element is diamond made of?", options: ["Silicon", "Carbon", "Iron", "Calcium"], answer: 1 },
        { q: "What is the study of weather?", options: ["Geology", "Meteorology", "Biology", "Astronomy"], answer: 1 },
        { q: "Which organ filters blood?", options: ["Heart", "Liver", "Kidney", "Spleen"], answer: 2 },
        { q: "What gas fills balloons to float?", options: ["Oxygen", "Hydrogen", "Helium", "Nitrogen"], answer: 2 },
        { q: "What is petrified wood made of?", options: ["Wood", "Stone", "Metal", "Crystal"], answer: 1 },
        { q: "What is the largest internal organ?", options: ["Heart", "Brain", "Liver", "Stomach"], answer: 2 },
        { q: "What animal has blue blood?", options: ["Octopus", "Frog", "Snake", "Fish"], answer: 0 },
        { q: "What is the study of earthquakes?", options: ["Volcanology", "Seismology", "Geology", "Tectonics"], answer: 1 },
        { q: "What vitamin prevents scurvy?", options: ["A", "B", "C", "D"], answer: 2 },
        { q: "What type of energy does the Sun emit?", options: ["Nuclear", "Solar", "Chemical", "Kinetic"], answer: 1 },
        { q: "What is the formula for water?", options: ["H2O", "CO2", "NaCl", "O2"], answer: 0 },
        { q: "What are the building blocks of proteins?", options: ["Sugars", "Amino acids", "Lipids", "Nucleotides"], answer: 1 },
        { q: "What planet has the strongest gravity?", options: ["Saturn", "Neptune", "Jupiter", "Uranus"], answer: 2 },
        { q: "What type of rock forms from lava?", options: ["Sedimentary", "Metamorphic", "Igneous", "Fossil"], answer: 2 },
        { q: "What is dry ice made of?", options: ["Frozen water", "Frozen CO2", "Frozen nitrogen", "Frozen oxygen"], answer: 1 },
        { q: "How many valence electrons does carbon have?", options: ["2", "3", "4", "5"], answer: 2 },
        { q: "What is the second most abundant element on Earth?", options: ["Iron", "Silicon", "Aluminum", "Calcium"], answer: 1 },
        { q: "What animal can regenerate limbs?", options: ["Lizard", "Starfish", "Frog", "Snake"], answer: 1 },
        { q: "What causes tides?", options: ["Wind", "Moon gravity", "Earth rotation", "Sun heat"], answer: 1 },
        { q: "What is the fastest bird?", options: ["Eagle", "Falcon", "Hawk", "Swift"], answer: 1 },
        { q: "What mineral makes bones hard?", options: ["Iron", "Calcium", "Sodium", "Potassium"], answer: 1 },
        { q: "What is a light-year?", options: ["Time unit", "Distance unit", "Speed unit", "Energy unit"], answer: 1 },
        { q: "What structure carries blood away from the heart?", options: ["Veins", "Arteries", "Capillaries", "Nerves"], answer: 1 },
        { q: "What is the only metal that is liquid at room temp?", options: ["Lead", "Mercury", "Tin", "Zinc"], answer: 1 },
        { q: "What is the process of rock breaking down called?", options: ["Erosion", "Weathering", "Sedimentation", "Fusion"], answer: 1 },
      ],
      hard: [
        { q: "What is the Schwarzschild radius related to?", options: ["Atoms", "Black holes", "Stars", "Galaxies"], answer: 1 },
        { q: "Which particle has no electric charge?", options: ["Proton", "Electron", "Neutron", "Positron"], answer: 2 },
        { q: "What is the most abundant element in the universe?", options: ["Oxygen", "Carbon", "Hydrogen", "Helium"], answer: 2 },
        { q: "What is absolute zero in Celsius?", options: ["-273.15°C", "-100°C", "-459.67°C", "0°C"], answer: 0 },
        { q: "What causes tides on Earth?", options: ["Wind", "Moon's gravity", "Sun's heat", "Earth's spin"], answer: 1 },
      
        { q: "What is the half-life of Carbon-14?", options: ["2,730 yrs", "5,730 yrs", "11,460 yrs", "28,650 yrs"], answer: 1 },
        { q: "Which organ produces insulin?", options: ["Liver", "Pancreas", "Kidney", "Spleen"], answer: 1 },
        { q: "What is the most electronegative element?", options: ["Oxygen", "Chlorine", "Fluorine", "Nitrogen"], answer: 2 },
      
        { q: "What is Avogadro's number?", options: ["6.02x10^23", "3.14x10^23", "9.8x10^23", "1.6x10^23"], answer: 0 },
        { q: "What force holds atomic nuclei together?", options: ["Gravity", "Electromagnetic", "Strong nuclear", "Weak nuclear"], answer: 2 },
        { q: "What is the unit of electrical resistance?", options: ["Watt", "Volt", "Ohm", "Ampere"], answer: 2 },
        { q: "Which subatomic particle was discovered last?", options: ["Proton", "Neutron", "Electron", "Higgs boson"], answer: 3 },
        { q: "What is the escape velocity from Earth?", options: ["7.9 km/s", "11.2 km/s", "15.4 km/s", "25.0 km/s"], answer: 1 },
        { q: "What is the Heisenberg principle about?", options: ["Relativity", "Uncertainty", "Entanglement", "Superposition"], answer: 1 },
        { q: "How many known moons does Jupiter have?", options: ["16", "52", "79+", "12"], answer: 2 },
        { q: "What is the speed of sound in air (m/s)?", options: ["243", "343", "443", "543"], answer: 1 },
        { q: "What type of bond shares electrons?", options: ["Ionic", "Covalent", "Metallic", "Hydrogen"], answer: 1 },
      
        { q: "What is the Chandrasekhar limit?", options: ["Black hole mass", "Star mass limit", "Planet size", "Galaxy radius"], answer: 1 },
        { q: "What is the most abundant protein in the body?", options: ["Keratin", "Collagen", "Hemoglobin", "Insulin"], answer: 1 },
        { q: "What is the Krebs cycle part of?", options: ["Digestion", "Cell respiration", "Photosynthesis", "DNA replication"], answer: 1 },
        { q: "What is the charge of a neutron?", options: ["Positive", "Negative", "Neutral", "Variable"], answer: 2 },
        { q: "What is the SI unit of force?", options: ["Joule", "Watt", "Newton", "Pascal"], answer: 2 },
        { q: "What is the photoelectric effect?", options: ["Light bending", "Light emitting electrons", "Light reflecting", "Light absorbing"], answer: 1 },
        { q: "What is CRISPR used for?", options: ["Microscopy", "Gene editing", "Drug synthesis", "Brain scanning"], answer: 1 },
        { q: "What is the Doppler effect?", options: ["Light bending", "Frequency shift", "Color change", "Sound echo"], answer: 1 },
        { q: "What is the triple point of water?", options: ["0C", "0.01C", "100C", "-273C"], answer: 1 },
        { q: "What is the Pauli exclusion principle about?", options: ["Gravity", "Electrons", "Light", "Energy"], answer: 1 },
        { q: "What is dark matter?", options: ["Black holes", "Invisible mass", "Antimatter", "Dark energy"], answer: 1 },
        { q: "What is the strongest acid?", options: ["HCl", "H2SO4", "Fluoroantimonic", "HNO3"], answer: 2 },
        { q: "What is the unit of frequency?", options: ["Hertz", "Ohm", "Tesla", "Weber"], answer: 0 },
        { q: "What is entropy?", options: ["Energy", "Disorder", "Temperature", "Pressure"], answer: 1 },
        { q: "What is quantum tunneling?", options: ["Digging", "Particles passing barriers", "Light bending", "Sound waves"], answer: 1 },
        { q: "What particle carries the electromagnetic force?", options: ["Gluon", "W boson", "Photon", "Graviton"], answer: 2 },
        { q: "What is the Planck constant unit?", options: ["J/s", "J*s", "N/m", "kg/m"], answer: 1 },
        { q: "What is the age of the universe?", options: ["10B yrs", "13.8B yrs", "15B yrs", "20B yrs"], answer: 1 },
        { q: "What organelle makes ATP?", options: ["Nucleus", "Ribosome", "Mitochondria", "Lysosome"], answer: 2 },
        { q: "What is the Drake equation about?", options: ["Black holes", "Alien civilizations", "Star formation", "Galaxy size"], answer: 1 },
        { q: "What is Ohm's Law?", options: ["F=ma", "V=IR", "E=mc2", "PV=nRT"], answer: 1 },
        { q: "What bond is strongest?", options: ["Hydrogen", "Van der Waals", "Covalent", "Ionic"], answer: 2 },
        { q: "What is a quasar?", options: ["Dead star", "Active galactic nucleus", "Nebula", "Asteroid"], answer: 1 },
        { q: "What is the observer effect?", options: ["Bias", "Measurement changes outcome", "Optical illusion", "Parallax"], answer: 1 },
        { q: "What is the Roche limit?", options: ["Orbital decay distance", "Tidal destruction distance", "Light escape distance", "Gravity range"], answer: 1 },
        { q: "What is a Bose-Einstein condensate?", options: ["5th state of matter", "Chemical compound", "Nuclear reaction", "Crystal structure"], answer: 0 },
        { q: "What causes the Northern Lights?", options: ["Moonlight", "Solar wind", "Earth heat", "Star light"], answer: 1 },
        { q: "What is the Hubble constant?", options: ["Star brightness", "Universe expansion rate", "Light speed", "Gravity strength"], answer: 1 },
        { q: "What is the most common isotope of hydrogen?", options: ["Protium", "Deuterium", "Tritium", "Helium-3"], answer: 0 },
        { q: "What is a neutron star made of?", options: ["Iron", "Neutrons", "Plasma", "Dark matter"], answer: 1 },
      ],
    }},
  { id: "tech", name: "TECH & COMPUTERS", icon: "💻", color: "#60a5fa", desc: "Software, hardware, internet",
    levels: [
      { diff: "easy", coins: 1000, time: 70 },
      { diff: "medium", coins: 2400, time: 50 },
      { diff: "hard", coins: 4800, time: 35 },
    ],
    questions: {
      easy: [
        { q: "How many bits in a byte?", options: ["4", "6", "8", "16"], answer: 2 },
        { q: "What does CPU stand for?", options: ["Central Power Unit", "Central Processing Unit", "Computer Personal Unit", "Core Process Utility"], answer: 1 },
        { q: "Who founded Microsoft?", options: ["Steve Jobs", "Bill Gates", "Elon Musk", "Jeff Bezos"], answer: 1 },
        { q: "What does HTML stand for?", options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyper Transfer Mail Language"], answer: 0 },
        { q: "What is the main language of the web?", options: ["Python", "Java", "JavaScript", "C++"], answer: 2 },
      
        { q: "Who created Facebook?", options: ["Bill Gates", "Steve Jobs", "Mark Zuckerberg", "Jeff Bezos"], answer: 2 },
        { q: "What company made the iPhone?", options: ["Samsung", "Google", "Apple", "Microsoft"], answer: 2 },
        { q: "What is the brain of a computer?", options: ["RAM", "CPU", "Hard Drive", "Monitor"], answer: 1 },
        { q: "What does USB stand for?", options: ["Universal Serial Bus", "Ultra Speed Bridge", "Unified System Board", "Universal System Backup"], answer: 0 },
      
        { q: "What does PDF stand for?", options: ["Portable Document Format", "Personal Data File", "Print Document Format", "Public Data Format"], answer: 0 },
        { q: "What is Google's search engine rival?", options: ["Yahoo", "Bing", "DuckDuckGo", "All of these"], answer: 3 },
        { q: "What does RAM stand for?", options: ["Random Access Memory", "Read All Memory", "Run Active Memory", "Rapid Access Module"], answer: 0 },
        { q: "What social media uses tweets?", options: ["Facebook", "Instagram", "Twitter/X", "TikTok"], answer: 2 },
        { q: "What device converts voice to digital?", options: ["Speaker", "Monitor", "Microphone", "Keyboard"], answer: 2 },
        { q: "What does GPS stand for?", options: ["Global Position System", "General Purpose System", "Global Positioning System", "Geographic Point System"], answer: 2 },
        { q: "What company makes Android?", options: ["Apple", "Google", "Samsung", "Microsoft"], answer: 1 },
        { q: "What is the most used browser?", options: ["Firefox", "Safari", "Chrome", "Edge"], answer: 2 },
        { q: "What stores data permanently in a PC?", options: ["RAM", "CPU", "Hard Drive", "GPU"], answer: 2 },
      
        { q: "What does URL stand for?", options: ["Universal Resource Locator", "Unified Record Link", "User Request Language", "Upload Resource Line"], answer: 0 },
        { q: "What is spam?", options: ["Virus", "Junk email", "Firewall", "Browser"], answer: 1 },
        { q: "What does OS mean?", options: ["Open Source", "Operating System", "Online Service", "Output Signal"], answer: 1 },
        { q: "What is a pixel?", options: ["Sound unit", "Smallest screen dot", "File type", "Code language"], answer: 1 },
        { q: "What is Bluetooth?", options: ["Color", "Wireless connection", "Browser", "App"], answer: 1 },
        { q: "What is a cursor?", options: ["Virus", "Mouse pointer", "File", "Cable"], answer: 1 },
        { q: "What does FAQ mean?", options: ["Fast Access Query", "Frequently Asked Questions", "File And Queue", "Format All Queries"], answer: 1 },
        { q: "What is an emoji?", options: ["Virus", "Digital icon", "Font", "App"], answer: 1 },
        { q: "What is a screenshot?", options: ["Photo of screen", "Virus scan", "Download", "Upload"], answer: 0 },
        { q: "What is an app?", options: ["Hardware", "Software application", "Cable", "Battery"], answer: 1 },
        { q: "What device has a touchscreen?", options: ["Printer", "Smartphone", "Mouse", "Router"], answer: 1 },
        { q: "What is a browser?", options: ["Hardware", "Internet viewer", "Game", "File type"], answer: 1 },
        { q: "What does download mean?", options: ["Delete", "Upload", "Get from internet", "Send email"], answer: 2 },
        { q: "What is a password used for?", options: ["Speed", "Security", "Display", "Sound"], answer: 1 },
        { q: "What company made Windows?", options: ["Apple", "Google", "IBM", "Microsoft"], answer: 3 },
        { q: "What is cloud storage?", options: ["USB drive", "Online storage", "Hard disk", "DVD"], answer: 1 },
        { q: "What does Ctrl+C do?", options: ["Cut", "Copy", "Close", "Create"], answer: 1 },
        { q: "What is a hashtag?", options: ["Phone number", "Social media tag", "Password", "Email"], answer: 1 },
        { q: "What is Instagram for?", options: ["Email", "Photos/videos", "Documents", "Gaming"], answer: 1 },
        { q: "What powers a laptop without a plug?", options: ["Solar", "Battery", "Wind", "Gas"], answer: 1 },
        { q: "What is an update?", options: ["Deletion", "New version", "Virus", "Backup"], answer: 1 },
        { q: "What does Ctrl+Z do?", options: ["Zoom", "Undo", "Save", "Print"], answer: 1 },
        { q: "What is antivirus software?", options: ["Game", "Protects from malware", "Browser", "OS"], answer: 1 },
        { q: "What is drag and drop?", options: ["Coding", "Move with mouse", "Download", "Delete"], answer: 1 },
        { q: "What does LOL mean?", options: ["Lots of Love", "Laugh Out Loud", "Long Online Life", "Level of Logic"], answer: 1 },
        { q: "What is a GIF?", options: ["Sound file", "Animated image", "Document", "Program"], answer: 1 },
        { q: "What is a QR code?", options: ["Bar code type", "Scannable square code", "Password", "Virus"], answer: 1 },
        { q: "What is streaming?", options: ["Downloading", "Playing media live", "Uploading", "Coding"], answer: 1 },
        { q: "What is a selfie?", options: ["Screenshot", "Self-portrait photo", "Profile pic", "Filter"], answer: 1 },
        { q: "What is airplane mode?", options: ["Game mode", "Turns off wireless", "Fast mode", "Safe mode"], answer: 1 },
      ],
      medium: [
        { q: "What year was the first iPhone released?", options: ["2005", "2006", "2007", "2008"], answer: 2 },
        { q: "Who created Linux?", options: ["Bill Gates", "Steve Jobs", "Linus Torvalds", "Dennis Ritchie"], answer: 2 },
        { q: "What is the binary for the number 10?", options: ["1000", "1010", "1100", "1001"], answer: 1 },
        { q: "What protocol does HTTPS use for security?", options: ["SSH", "SSL/TLS", "FTP", "SMTP"], answer: 1 },
      
        { q: "What does SSD stand for?", options: ["Solid State Drive", "Super Speed Disk", "System Storage Device", "Serial Signal Drive"], answer: 0 },
        { q: "Who founded Amazon?", options: ["Elon Musk", "Jeff Bezos", "Larry Page", "Tim Cook"], answer: 1 },
        { q: "What does GPU stand for?", options: ["General Power Unit", "Graphics Processing Unit", "Global Performance Utility", "Graphics Power Unit"], answer: 1 },
      
        { q: "What language is Android built with?", options: ["Python", "Java/Kotlin", "Swift", "C#"], answer: 1 },
        { q: "What does IoT stand for?", options: ["Internet of Things", "Input of Technology", "Integrated Online Tech", "Internal Operating Tool"], answer: 0 },
        { q: "Who co-founded Apple with Steve Jobs?", options: ["Bill Gates", "Steve Wozniak", "Tim Cook", "Elon Musk"], answer: 1 },
        { q: "What is phishing?", options: ["A game", "A scam email", "A coding language", "A firewall"], answer: 1 },
        { q: "What does VPN stand for?", options: ["Virtual Private Network", "Very Protected Network", "Visual Processing Node", "Verified Public Network"], answer: 0 },
        { q: "What language does iOS use?", options: ["Java", "Python", "Swift", "Ruby"], answer: 2 },
        { q: "What company makes Windows?", options: ["Apple", "Google", "IBM", "Microsoft"], answer: 3 },
        { q: "What is cloud computing?", options: ["Weather tech", "Remote servers", "Satellite internet", "Quantum computing"], answer: 1 },
      
        { q: "What is open source?", options: ["Paid software", "Free public code", "Hardware", "Cloud"], answer: 1 },
        { q: "What is an IP address?", options: ["Email address", "Device network ID", "Website name", "Password"], answer: 1 },
        { q: "What is machine learning?", options: ["Robots walking", "AI learning from data", "3D printing", "Cloud computing"], answer: 1 },
        { q: "What is a firewall?", options: ["Physical wall", "Network security", "Browser", "Cable"], answer: 1 },
        { q: "What does HTTPS mean?", options: ["Hyper Transfer Protocol Secure", "High Tech Protocol System", "Home Transfer Page Secure", "Hyper Text Process Server"], answer: 0 },
        { q: "What is two-factor authentication?", options: ["Double password", "Two-step verification", "Two accounts", "Dual screen"], answer: 1 },
        { q: "What is a chatbot?", options: ["Chat room", "AI conversation program", "Video call", "Social media"], answer: 1 },
        { q: "What is latency?", options: ["Speed", "Delay in data transfer", "Bandwidth", "Storage"], answer: 1 },
        { q: "What is a domain name?", options: ["IP address", "Website name", "Email server", "File type"], answer: 1 },
        { q: "What year was Google founded?", options: ["1996", "1998", "2000", "2002"], answer: 1 },
        { q: "What is cryptocurrency?", options: ["Physical money", "Digital currency", "Gift card", "Stock"], answer: 1 },
        { q: "What is a cookie in web browsing?", options: ["Food", "Stored data file", "Virus", "Image"], answer: 1 },
        { q: "What does SEO stand for?", options: ["Search Engine Optimization", "System Error Output", "Secure Email Option", "Software Engineering Operations"], answer: 0 },
        { q: "What is RAM used for?", options: ["Storage", "Temporary memory", "Display", "Power"], answer: 1 },
        { q: "What is a podcast?", options: ["Blog post", "Audio/video series", "Social media", "Game"], answer: 1 },
        { q: "What is an algorithm?", options: ["Hardware", "Set of instructions", "Display", "Network"], answer: 1 },
        { q: "What does NFC stand for?", options: ["Near Field Communication", "New File Creator", "Network Function Control", "Normal Format Code"], answer: 0 },
        { q: "What is virtual reality?", options: ["Video game", "Computer-generated world", "Social media", "Cloud storage"], answer: 1 },
        { q: "What is a server?", options: ["Computer serving data", "Monitor", "Keyboard", "Mouse"], answer: 0 },
        { q: "What is a bug in software?", options: ["Insect", "Error in code", "Feature", "Update"], answer: 1 },
        { q: "What is debugging?", options: ["Adding bugs", "Fixing errors", "Deleting files", "Installing"], answer: 1 },
        { q: "What is a pixel resolution?", options: ["Color depth", "Number of pixels", "Screen size", "Brightness"], answer: 1 },
        { q: "What is Bluetooth named after?", options: ["Color", "Danish king", "Inventor", "Company"], answer: 1 },
        { q: "What is a kernel?", options: ["Shell", "OS core", "App", "File"], answer: 1 },
        { q: "What does LAN stand for?", options: ["Large Area Network", "Local Area Network", "Long Access Node", "Linked Array Network"], answer: 1 },
        { q: "What is overclocking?", options: ["Slowing down", "Running hardware faster", "Cooling system", "Power saving"], answer: 1 },
        { q: "What is a UX designer?", options: ["Coder", "User experience designer", "Network admin", "Database manager"], answer: 1 },
        { q: "What is the dark web?", options: ["Hidden internet", "Broken sites", "Old web", "Slow internet"], answer: 0 },
        { q: "What year was Tesla founded?", options: ["2001", "2003", "2005", "2007"], answer: 1 },
        { q: "What is a proxy server?", options: ["Direct connection", "Intermediary server", "Firewall", "Router"], answer: 1 },
      ],
      hard: [
        { q: "What is the time complexity of binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], answer: 2 },
        { q: "What does ACID stand for in databases?", options: ["Atomicity, Consistency, Isolation, Durability", "Access, Control, Index, Data", "Async, Cache, Input, Deploy", "Alter, Create, Insert, Delete"], answer: 0 },
        { q: "Who invented the World Wide Web?", options: ["Vint Cerf", "Tim Berners-Lee", "Alan Turing", "Robert Kahn"], answer: 1 },
        { q: "What does a compiler do?", options: ["Runs code line by line", "Translates code to machine code", "Debugs errors", "Manages memory"], answer: 1 },
        { q: "What is a race condition?", options: ["Fast algorithm", "Concurrent access bug", "Network latency", "Memory overflow"], answer: 1 },
      
        { q: "What year was Bitcoin created?", options: ["2007", "2008", "2009", "2010"], answer: 2 },
        { q: "What is the smallest unit of data?", options: ["Byte", "Bit", "Nibble", "Word"], answer: 1 },
        { q: "What does API stand for?", options: ["Application Programming Interface", "Automated Process Integration", "Advanced Program Interface", "Application Protocol Interface"], answer: 0 },
      
        { q: "What is a blockchain?", options: ["Database type", "Distributed ledger", "Programming language", "Network protocol"], answer: 1 },
        { q: "What does SQL stand for?", options: ["Structured Query Language", "System Quality Language", "Simple Question Logic", "Sequential Query Loop"], answer: 0 },
        { q: "What is the CAP theorem about?", options: ["Databases", "Networks", "Algorithms", "Security"], answer: 0 },
        { q: "What is containerization in software?", options: ["File compression", "OS-level virtualization", "Data encryption", "Memory management"], answer: 1 },
        { q: "What does CI/CD stand for?", options: ["Code Integration/Code Delivery", "Continuous Integration/Continuous Delivery", "Central Interface/Central Data", "Common Input/Common Dispatch"], answer: 1 },
        { q: "What is Big O notation used for?", options: ["File size", "Algorithm complexity", "Network speed", "Memory usage"], answer: 1 },
        { q: "What is a hash function?", options: ["Encryption key", "One-way mapping", "Password manager", "Data compressor"], answer: 1 },
        { q: "What layer is HTTP in the OSI model?", options: ["Layer 4", "Layer 5", "Layer 6", "Layer 7"], answer: 3 },
      
        { q: "What is a neural network?", options: ["Brain scan", "AI model mimicking brain", "Network cable", "Database"], answer: 1 },
        { q: "What is TCP/IP?", options: ["File format", "Internet protocol suite", "Programming language", "Hardware"], answer: 1 },
        { q: "What is a microservice?", options: ["Small app", "Independent service component", "Micro computer", "Small database"], answer: 1 },
        { q: "What is garbage collection in programming?", options: ["File deletion", "Automatic memory management", "Virus scan", "Data backup"], answer: 1 },
        { q: "What is a Turing machine?", options: ["Computer brand", "Theoretical computation model", "AI robot", "Search engine"], answer: 1 },
        { q: "What is polymorphism?", options: ["Single form", "Many forms in OOP", "Database term", "Network type"], answer: 1 },
        { q: "What does CORS stand for?", options: ["Cross-Origin Resource Sharing", "Central Online Resource System", "Code Output Result Server", "Common Object Request Service"], answer: 0 },
        { q: "What is a deadlock?", options: ["Broken lock", "Processes waiting forever", "Network timeout", "Slow code"], answer: 1 },
        { q: "What is WebAssembly?", options: ["JavaScript library", "Low-level web bytecode", "HTML framework", "CSS processor"], answer: 1 },
        { q: "What is a load balancer?", options: ["Weight scale", "Traffic distributor", "Code optimizer", "Memory cleaner"], answer: 1 },
        { q: "What is sharding?", options: ["Breaking glass", "Database partitioning", "Code splitting", "Memory division"], answer: 1 },
        { q: "What is a mutex?", options: ["Music player", "Mutual exclusion lock", "Network tool", "File format"], answer: 1 },
        { q: "What is idempotency?", options: ["Speed metric", "Same result on repeat calls", "Data type", "Error type"], answer: 1 },
        { q: "What is a monorepo?", options: ["Single file", "Single repo for multiple projects", "One branch", "One commit"], answer: 1 },
        { q: "What is GraphQL?", options: ["Database", "API query language", "Graph library", "File format"], answer: 1 },
        { q: "What is Kubernetes?", options: ["Programming language", "Container orchestration", "Database", "Operating system"], answer: 1 },
        { q: "What is DNS?", options: ["Domain Name System", "Digital Network Service", "Data Node Server", "Direct Name Search"], answer: 0 },
        { q: "What is a JWT?", options: ["JSON Web Token", "Java Web Tool", "JavaScript Widget Template", "Joint Wireless Transfer"], answer: 0 },
        { q: "What is memoization?", options: ["Memorizing", "Caching function results", "Data storage", "Note taking"], answer: 1 },
        { q: "What is a singleton pattern?", options: ["Many instances", "One instance only", "No instances", "Two instances"], answer: 1 },
        { q: "What is eventual consistency?", options: ["Instant sync", "Data syncs over time", "Never syncs", "Random sync"], answer: 1 },
        { q: "What is a CDN?", options: ["Content Delivery Network", "Central Data Node", "Code Development Network", "Cache Distribution Node"], answer: 0 },
        { q: "What is OAuth?", options: ["Password manager", "Authorization protocol", "Encryption", "VPN type"], answer: 1 },
        { q: "What is WebSocket?", options: ["HTTP request", "Full-duplex communication", "File transfer", "Email protocol"], answer: 1 },
        { q: "What is a B-tree used for?", options: ["Graphics", "Database indexing", "Network routing", "AI training"], answer: 1 },
        { q: "What is a bloom filter?", options: ["Image filter", "Probabilistic data structure", "Sound filter", "Network filter"], answer: 1 },
        { q: "What is ACID in databases?", options: ["Chemical term", "Transaction properties", "Data format", "Query language"], answer: 1 },
        { q: "What is a lambda function?", options: ["Named function", "Anonymous function", "Recursive function", "Main function"], answer: 1 },
        { q: "What is the halting problem?", options: ["Stopping a program", "Undecidable problem", "Slow code", "Memory leak"], answer: 1 },
        { q: "What is P vs NP?", options: ["Math equation", "Unsolved CS problem", "Programming language", "Data structure"], answer: 1 },
      ],
    }},
  { id: "logic", name: "MATH & LOGIC", icon: "🧮", color: "#ff6b6b", desc: "Puzzles, patterns, reasoning",
    levels: [
      { diff: "easy", coins: 1200, time: 80 },
      { diff: "medium", coins: 2800, time: 60 },
      { diff: "hard", coins: 5600, time: 40 },
    ],
    questions: {
      easy: [
        { q: "What is 15% of 200?", options: ["20", "25", "30", "35"], answer: 2 },
        { q: "What comes next: 2, 4, 8, 16, ?", options: ["20", "24", "32", "36"], answer: 2 },
        { q: "If a train goes 60 mph for 2 hours, how far?", options: ["100 mi", "110 mi", "120 mi", "130 mi"], answer: 2 },
        { q: "What is the square root of 144?", options: ["10", "11", "12", "14"], answer: 2 },
        { q: "How many seconds in an hour?", options: ["3,000", "3,200", "3,600", "4,000"], answer: 2 },
      
        { q: "What comes next: 1, 1, 2, 3, 5, ?", options: ["6", "7", "8", "9"], answer: 2 },
        { q: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], answer: 1 },
        { q: "What is 7 x 8?", options: ["48", "54", "56", "63"], answer: 2 },
      
        { q: "What is 25% of 80?", options: ["15", "20", "25", "30"], answer: 1 },
        { q: "How many sides does a triangle have?", options: ["2", "3", "4", "5"], answer: 1 },
        { q: "What is 9 x 9?", options: ["72", "81", "90", "99"], answer: 1 },
        { q: "What is 100 divided by 4?", options: ["20", "25", "30", "35"], answer: 1 },
        { q: "How many minutes in 2 hours?", options: ["100", "110", "120", "130"], answer: 2 },
        { q: "What is 50 + 75?", options: ["115", "120", "125", "130"], answer: 2 },
        { q: "What shape has 4 equal sides?", options: ["Rectangle", "Square", "Triangle", "Circle"], answer: 1 },
        { q: "What is half of 246?", options: ["113", "118", "123", "128"], answer: 2 },
      ],
      medium: [
        { q: "What is 7! (7 factorial)?", options: ["720", "5040", "40320", "362880"], answer: 1 },
        { q: "Next in sequence: 1, 1, 2, 3, 5, 8, ?", options: ["11", "12", "13", "14"], answer: 2 },
        { q: "A die is rolled. P(even number)?", options: ["1/6", "1/3", "1/2", "2/3"], answer: 2 },
        { q: "What is log₂(64)?", options: ["4", "5", "6", "8"], answer: 2 },
        { q: "If x² - 9 = 0, what are the solutions?", options: ["±3", "±9", "3", "9"], answer: 0 },
      
        { q: "What is the value of pi to 2 decimals?", options: ["3.12", "3.14", "3.16", "3.18"], answer: 1 },
        { q: "If x + 5 = 12, what is x?", options: ["5", "6", "7", "8"], answer: 2 },
        { q: "What is 2 to the power of 10?", options: ["512", "1000", "1024", "2048"], answer: 2 },
        { q: "What is the next prime after 29?", options: ["30", "31", "33", "37"], answer: 1 },
        { q: "What angle do clock hands make at 3:00?", options: ["60", "90", "120", "180"], answer: 1 },
      
        { q: "What is 13 squared?", options: ["156", "163", "169", "176"], answer: 2 },
        { q: "What is the LCM of 4 and 6?", options: ["8", "10", "12", "24"], answer: 2 },
        { q: "How many degrees in a right angle?", options: ["45", "60", "90", "180"], answer: 2 },
        { q: "What is the GCD of 18 and 24?", options: ["3", "4", "6", "8"], answer: 2 },
        { q: "What is 3! (3 factorial)?", options: ["3", "6", "9", "12"], answer: 1 },
        { q: "If a triangle has sides 3,4,5 what type is it?", options: ["Equilateral", "Isosceles", "Right", "Obtuse"], answer: 2 },
        { q: "What is 0.75 as a fraction?", options: ["1/2", "2/3", "3/4", "4/5"], answer: 2 },
        { q: "What is the mean of 10, 20, 30?", options: ["15", "20", "25", "30"], answer: 1 },
        { q: "How many faces does a dodecahedron have?", options: ["8", "10", "12", "20"], answer: 2 },
      ],
      hard: [
        { q: "What is the derivative of x³?", options: ["x²", "2x²", "3x²", "3x"], answer: 2 },
        { q: "How many ways to arrange 5 books?", options: ["25", "60", "120", "720"], answer: 2 },
        { q: "What is the integral of 2x?", options: ["x", "x²", "x² + C", "2x² + C"], answer: 2 },
        { q: "What is the sum of first 100 natural numbers?", options: ["4,950", "5,000", "5,050", "5,100"], answer: 2 },
        { q: "In how many ways can 3 items be chosen from 7?", options: ["21", "35", "42", "210"], answer: 1 },
      
        { q: "What is the derivative of x cubed?", options: ["x2", "2x2", "3x2", "3x3"], answer: 2 },
        { q: "What is log base 2 of 256?", options: ["6", "7", "8", "9"], answer: 2 },
        { q: "What is the sum of angles in a pentagon?", options: ["360", "450", "540", "720"], answer: 2 },
        { q: "What is 17 squared?", options: ["269", "279", "289", "299"], answer: 2 },
        { q: "How many edges does a cube have?", options: ["6", "8", "10", "12"], answer: 3 },
      
        { q: "What is the limit of 1/x as x approaches infinity?", options: ["1", "0", "Infinity", "Undefined"], answer: 1 },
        { q: "What is the area of a circle with radius 5?", options: ["25pi", "10pi", "50pi", "5pi"], answer: 0 },
        { q: "What is the binary of decimal 42?", options: ["101010", "110010", "100110", "101100"], answer: 0 },
        { q: "What is i squared (imaginary number)?", options: ["1", "-1", "i", "-i"], answer: 1 },
        { q: "How many vertices does an icosahedron have?", options: ["8", "10", "12", "20"], answer: 2 },
        { q: "What is the Fibonacci number after 89?", options: ["123", "134", "144", "155"], answer: 2 },
        { q: "What is the integral of 1/x?", options: ["x", "ln(x)", "1/x2", "e^x"], answer: 1 },
        { q: "What is 2^20?", options: ["524288", "1048576", "2097152", "4194304"], answer: 1 },
        { q: "How many primes are under 50?", options: ["12", "13", "15", "17"], answer: 2 },
      ],
    }},
  { id: "history", name: "HISTORY & WORLD", icon: "🏛️", color: "#fbbf24", desc: "Ancient & modern history",
    levels: [
      { diff: "easy", coins: 800, time: 75 },
      { diff: "medium", coins: 2000, time: 55 },
      { diff: "hard", coins: 4000, time: 40 },
    ],
    questions: {
      easy: [
        { q: "Who was the first President of the USA?", options: ["Lincoln", "Washington", "Adams", "Jefferson"], answer: 1 },
        { q: "In which year did World War II end?", options: ["1943", "1944", "1945", "1946"], answer: 2 },
        { q: "The Great Wall is in which country?", options: ["Japan", "China", "India", "Korea"], answer: 1 },
        { q: "Who discovered America?", options: ["Magellan", "Columbus", "Drake", "Vespucci"], answer: 1 },
        { q: "Which empire built the Colosseum?", options: ["Greek", "Roman", "Egyptian", "Persian"], answer: 1 },
      
        { q: "Who was the first man on the Moon?", options: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "John Glenn"], answer: 2 },
        { q: "What year did the Titanic sink?", options: ["1910", "1912", "1914", "1916"], answer: 1 },
        { q: "Which country gave the Statue of Liberty to the US?", options: ["England", "Spain", "France", "Germany"], answer: 2 },
        { q: "What ancient wonder is in Egypt?", options: ["Colosseum", "Pyramids", "Parthenon", "Stonehenge"], answer: 1 },
        { q: "Who was known as the Iron Lady?", options: ["Queen Victoria", "Margaret Thatcher", "Angela Merkel", "Indira Gandhi"], answer: 1 },
      
        { q: "What wall divided Germany?", options: ["Great Wall", "Berlin Wall", "Hadrian's Wall", "Iron Curtain"], answer: 1 },
        { q: "Who was the first woman to fly solo across the Atlantic?", options: ["Earhart", "Ride", "Thatcher", "Curie"], answer: 0 },
        { q: "What did Vikings use to travel?", options: ["Chariots", "Longships", "Camels", "Trains"], answer: 1 },
        { q: "Which war lasted from 1914-1918?", options: ["WWII", "WWI", "Civil War", "Cold War"], answer: 1 },
        { q: "What civilization built pyramids in Central America?", options: ["Greek", "Roman", "Maya", "Egyptian"], answer: 2 },
        { q: "Who invented the telephone?", options: ["Edison", "Bell", "Tesla", "Morse"], answer: 1 },
        { q: "What was the Roman language?", options: ["Greek", "Latin", "Italian", "Spanish"], answer: 1 },
        { q: "Who was the King of Rock and Roll?", options: ["Beatles", "Elvis", "MJ", "Prince"], answer: 1 },
        { q: "What country built the Great Wall?", options: ["Japan", "India", "China", "Korea"], answer: 2 },
      ],
      medium: [
        { q: "The French Revolution started in which year?", options: ["1776", "1789", "1799", "1804"], answer: 1 },
        { q: "Who was the first Emperor of China?", options: ["Kublai Khan", "Qin Shi Huang", "Sun Tzu", "Confucius"], answer: 1 },
        { q: "Which war was fought between 1950-1953?", options: ["Vietnam", "Korean", "Gulf", "Falklands"], answer: 1 },
        { q: "Who painted the Mona Lisa?", options: ["Michelangelo", "Da Vinci", "Raphael", "Donatello"], answer: 1 },
        { q: "The Berlin Wall fell in which year?", options: ["1987", "1989", "1991", "1993"], answer: 1 },
      
        { q: "Which empire was ruled by Sultans?", options: ["Roman", "Mongol", "Ottoman", "British"], answer: 2 },
        { q: "What year did India gain independence?", options: ["1945", "1947", "1949", "1950"], answer: 1 },
        { q: "The Renaissance began in which country?", options: ["France", "England", "Italy", "Spain"], answer: 2 },
        { q: "What was the Cold War between?", options: ["UK and France", "USA and USSR", "China and Japan", "Germany and Russia"], answer: 1 },
        { q: "Who was the first female PM of the UK?", options: ["May", "Thatcher", "Blair", "Victoria"], answer: 1 },
      
        { q: "Who wrote the Declaration of Independence?", options: ["Washington", "Jefferson", "Franklin", "Adams"], answer: 1 },
        { q: "What empire ruled much of South America?", options: ["Aztec", "Maya", "Inca", "Olmec"], answer: 2 },
        { q: "When did the Soviet Union collapse?", options: ["1989", "1990", "1991", "1992"], answer: 2 },
        { q: "Who was the first female Nobel Prize winner?", options: ["Curie", "Earhart", "Nightingale", "Austen"], answer: 0 },
        { q: "What ancient city was buried by Vesuvius?", options: ["Rome", "Athens", "Pompeii", "Sparta"], answer: 2 },
        { q: "Who was the first President of South Africa after apartheid?", options: ["Tutu", "Mandela", "Zuma", "Mbeki"], answer: 1 },
        { q: "What treaty ended WWI?", options: ["Paris", "Versailles", "Vienna", "Westphalia"], answer: 1 },
        { q: "Who built the Taj Mahal?", options: ["Akbar", "Shah Jahan", "Ashoka", "Babur"], answer: 1 },
        { q: "What year was the UN founded?", options: ["1940", "1943", "1945", "1948"], answer: 2 },
      ],
      hard: [
        { q: "The Treaty of Westphalia was signed in?", options: ["1618", "1648", "1688", "1714"], answer: 1 },
        { q: "Who founded the Mongol Empire?", options: ["Kublai Khan", "Tamerlane", "Genghis Khan", "Attila"], answer: 2 },
        { q: "The Magna Carta was signed in which year?", options: ["1066", "1215", "1348", "1453"], answer: 1 },
        { q: "Which civilization built Machu Picchu?", options: ["Aztec", "Maya", "Inca", "Olmec"], answer: 2 },
        { q: "The Hundred Years' War was between?", options: ["Spain & Portugal", "England & France", "Rome & Carthage", "Austria & Prussia"], answer: 1 },
      
        { q: "The Battle of Hastings was in which year?", options: ["1066", "1166", "1266", "966"], answer: 0 },
        { q: "Who was the last Pharaoh of Egypt?", options: ["Nefertiti", "Hatshepsut", "Cleopatra", "Ramses"], answer: 2 },
        { q: "Who unified Germany in 1871?", options: ["Kaiser Wilhelm", "Bismarck", "Frederick", "Metternich"], answer: 1 },
        { q: "The Aztec capital was called?", options: ["Cusco", "Tenochtitlan", "Machu Picchu", "Chichen Itza"], answer: 1 },
        { q: "The Silk Road connected Rome to where?", options: ["India", "Japan", "China", "Persia"], answer: 2 },
      
        { q: "What was the Rosetta Stone used to decode?", options: ["Latin", "Hieroglyphics", "Sanskrit", "Cuneiform"], answer: 1 },
        { q: "Who was the first Holy Roman Emperor?", options: ["Augustus", "Charlemagne", "Constantine", "Julius Caesar"], answer: 1 },
        { q: "What year was the printing press invented?", options: ["1340", "1440", "1540", "1640"], answer: 1 },
        { q: "The Opium Wars were between Britain and?", options: ["India", "Japan", "China", "France"], answer: 2 },
        { q: "What was the capital of the Byzantine Empire?", options: ["Rome", "Athens", "Constantinople", "Alexandria"], answer: 2 },
        { q: "Who led the Bolshevik Revolution?", options: ["Stalin", "Lenin", "Trotsky", "Marx"], answer: 1 },
        { q: "What was the largest empire in history?", options: ["Roman", "Mongol", "British", "Ottoman"], answer: 2 },
        { q: "The Meiji Restoration was in which country?", options: ["China", "Korea", "Japan", "India"], answer: 2 },
        { q: "What civilization invented the wheel?", options: ["Egyptian", "Greek", "Sumerian", "Chinese"], answer: 2 },
      ],
    }},
  { id: "geography", name: "GEOGRAPHY", icon: "🌍", color: "#0ff", desc: "Countries, capitals, landmarks",
    levels: [
      { diff: "easy", coins: 800, time: 75 },
      { diff: "medium", coins: 2400, time: 55 },
      { diff: "hard", coins: 4800, time: 40 },
    ],
    questions: {
      easy: [
        { q: "What is the largest ocean?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], answer: 2 },
        { q: "Which continent is Egypt in?", options: ["Asia", "Europe", "Africa", "South America"], answer: 2 },
        { q: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Rome"], answer: 2 },
        { q: "Which is the longest river?", options: ["Amazon", "Nile", "Mississippi", "Yangtze"], answer: 1 },
        { q: "How many continents are there?", options: ["5", "6", "7", "8"], answer: 2 },
      
        { q: "What is the largest country by area?", options: ["China", "USA", "Canada", "Russia"], answer: 3 },
        { q: "Which river flows through London?", options: ["Seine", "Thames", "Danube", "Rhine"], answer: 1 },
        { q: "What is the capital of Japan?", options: ["Seoul", "Beijing", "Tokyo", "Bangkok"], answer: 2 },
        { q: "Which ocean is the smallest?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 2 },
        { q: "What continent is Brazil in?", options: ["Africa", "Europe", "N. America", "S. America"], answer: 3 },
      
        { q: "What is the biggest continent?", options: ["Africa", "Europe", "Asia", "N. America"], answer: 2 },
        { q: "What country is shaped like a boot?", options: ["Spain", "Greece", "Italy", "Portugal"], answer: 2 },
        { q: "What is the capital of Germany?", options: ["Munich", "Berlin", "Hamburg", "Frankfurt"], answer: 1 },
        { q: "Which country has kangaroos?", options: ["Brazil", "India", "Australia", "Mexico"], answer: 2 },
        { q: "What is the largest lake in Africa?", options: ["Chad", "Victoria", "Tanganyika", "Malawi"], answer: 1 },
        { q: "What ocean is between the US and Europe?", options: ["Pacific", "Indian", "Atlantic", "Arctic"], answer: 2 },
        { q: "What is the capital of Spain?", options: ["Barcelona", "Madrid", "Seville", "Valencia"], answer: 1 },
        { q: "Which country has the most volcanoes?", options: ["Japan", "Indonesia", "USA", "Iceland"], answer: 1 },
        { q: "What is the longest wall in the world?", options: ["Berlin Wall", "Great Wall", "Hadrian's Wall", "Western Wall"], answer: 1 },
      ],
      medium: [
        { q: "Which country has the most islands?", options: ["Indonesia", "Philippines", "Sweden", "Japan"], answer: 2 },
        { q: "What is the smallest country?", options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], answer: 1 },
        { q: "The Sahara Desert is in which continent?", options: ["Asia", "Africa", "Australia", "South America"], answer: 1 },
        { q: "Which mountain is the tallest?", options: ["K2", "Everest", "Kangchenjunga", "Makalu"], answer: 1 },
        { q: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], answer: 2 },
      
        { q: "Which desert is the largest hot desert?", options: ["Gobi", "Sahara", "Arabian", "Kalahari"], answer: 1 },
        { q: "What is the capital of Canada?", options: ["Toronto", "Vancouver", "Ottawa", "Montreal"], answer: 2 },
        { q: "Mount Kilimanjaro is in which country?", options: ["Kenya", "Ethiopia", "Tanzania", "Uganda"], answer: 2 },
        { q: "What is the longest river in Europe?", options: ["Danube", "Rhine", "Volga", "Thames"], answer: 2 },
        { q: "Which country has the most people?", options: ["India", "China", "USA", "Indonesia"], answer: 0 },
      
        { q: "What is the driest desert?", options: ["Sahara", "Gobi", "Atacama", "Arabian"], answer: 2 },
        { q: "Which river flows through Egypt?", options: ["Amazon", "Nile", "Ganges", "Tigris"], answer: 1 },
        { q: "What is the capital of Turkey?", options: ["Istanbul", "Ankara", "Izmir", "Antalya"], answer: 1 },
        { q: "What is the smallest US state?", options: ["Delaware", "Connecticut", "Rhode Island", "Vermont"], answer: 2 },
        { q: "Which sea is the saltiest?", options: ["Black Sea", "Dead Sea", "Red Sea", "Caspian Sea"], answer: 1 },
        { q: "What country has the most lakes?", options: ["USA", "Russia", "Canada", "Finland"], answer: 2 },
        { q: "What is the highest waterfall?", options: ["Niagara", "Angel Falls", "Victoria", "Iguazu"], answer: 1 },
        { q: "Which continent has no countries?", options: ["Australia", "Antarctica", "Arctic", "Oceania"], answer: 1 },
        { q: "What is the capital of Egypt?", options: ["Alexandria", "Cairo", "Luxor", "Giza"], answer: 1 },
      ],
      hard: [
        { q: "Which strait separates Asia and North America?", options: ["Malacca", "Gibraltar", "Bering", "Hormuz"], answer: 2 },
        { q: "What is the deepest ocean point?", options: ["Mariana Trench", "Puerto Rico Trench", "Java Trench", "Tonga Trench"], answer: 0 },
        { q: "Which country has the most time zones?", options: ["Russia", "USA", "France", "China"], answer: 2 },
        { q: "The Andes span how many countries?", options: ["5", "6", "7", "8"], answer: 2 },
        { q: "Which lake is the deepest?", options: ["Caspian Sea", "Lake Baikal", "Lake Tanganyika", "Lake Superior"], answer: 1 },
      
        { q: "Which country has the most UNESCO sites?", options: ["China", "Italy", "Spain", "France"], answer: 1 },
        { q: "What is the driest continent?", options: ["Africa", "Australia", "Antarctica", "Asia"], answer: 2 },
        { q: "Which African country was never colonized?", options: ["Nigeria", "Ethiopia", "Egypt", "Ghana"], answer: 1 },
        { q: "What is the capital of New Zealand?", options: ["Auckland", "Christchurch", "Wellington", "Hamilton"], answer: 2 },
        { q: "What is the largest island in the world?", options: ["Borneo", "Madagascar", "Greenland", "Sumatra"], answer: 2 },
      
        { q: "What is the longest coastline country?", options: ["USA", "Russia", "Canada", "Australia"], answer: 2 },
        { q: "Which country spans the most time zones?", options: ["Russia", "USA", "France", "China"], answer: 2 },
        { q: "What is the highest capital city?", options: ["Quito", "Bogota", "La Paz", "Mexico City"], answer: 2 },
        { q: "What trench is the deepest?", options: ["Java", "Puerto Rico", "Mariana", "Philippine"], answer: 2 },
        { q: "What is the largest landlocked country?", options: ["Mongolia", "Chad", "Kazakhstan", "Bolivia"], answer: 2 },
        { q: "Which country has the most borders?", options: ["Russia", "China", "Brazil", "Germany"], answer: 1 },
        { q: "What is the most populated island?", options: ["Borneo", "Java", "Sumatra", "Honshu"], answer: 1 },
        { q: "What river flows through the most capitals?", options: ["Nile", "Danube", "Rhine", "Amazon"], answer: 1 },
        { q: "Which African country is largest by area?", options: ["Sudan", "DRC", "Algeria", "Libya"], answer: 2 },
      ],
    }},
  { id: "general", name: "GENERAL KNOWLEDGE", icon: "🧠", color: "#f0f", desc: "Random fun facts",
    levels: [
      { diff: "easy", coins: 600, time: 75 },
      { diff: "medium", coins: 1800, time: 55 },
      { diff: "hard", coins: 3600, time: 40 },
    ],
    questions: {
      easy: [
        { q: "How many legs does a spider have?", options: ["6", "8", "10", "12"], answer: 1 },
        { q: "What color do you get mixing red and blue?", options: ["Green", "Purple", "Orange", "Brown"], answer: 1 },
        { q: "How many months have 31 days?", options: ["5", "6", "7", "8"], answer: 2 },
        { q: "What is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Platinum"], answer: 2 },
        { q: "How many players in a football team?", options: ["9", "10", "11", "12"], answer: 2 },
      
        { q: "What is the largest mammal?", options: ["Elephant", "Blue Whale", "Giraffe", "Hippo"], answer: 1 },
        { q: "How many days in a leap year?", options: ["364", "365", "366", "367"], answer: 2 },
        { q: "What color is an emerald?", options: ["Red", "Blue", "Green", "Yellow"], answer: 2 },
        { q: "How many strings on a standard guitar?", options: ["4", "5", "6", "7"], answer: 2 },
        { q: "What is the fastest land animal?", options: ["Lion", "Cheetah", "Horse", "Gazelle"], answer: 1 },
      
        { q: "What planet do we live on?", options: ["Mars", "Venus", "Earth", "Jupiter"], answer: 2 },
        { q: "How many letters in the English alphabet?", options: ["24", "25", "26", "27"], answer: 2 },
        { q: "What is a baby dog called?", options: ["Kitten", "Cub", "Puppy", "Foal"], answer: 2 },
        { q: "What month has the fewest days?", options: ["April", "February", "June", "November"], answer: 1 },
        { q: "What is the tallest animal?", options: ["Elephant", "Horse", "Giraffe", "Camel"], answer: 2 },
        { q: "How many continents are there?", options: ["5", "6", "7", "8"], answer: 2 },
        { q: "What color is the sky on a clear day?", options: ["Green", "Blue", "Red", "White"], answer: 1 },
        { q: "What do caterpillars turn into?", options: ["Moths", "Butterflies", "Beetles", "Bees"], answer: 1 },
        { q: "How many days in a week?", options: ["5", "6", "7", "8"], answer: 2 },
      ],
      medium: [
        { q: "What is the speed of light (approx)?", options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "100,000 km/s"], answer: 0 },
        { q: "How many bones in the human body?", options: ["186", "206", "226", "256"], answer: 1 },
        { q: "What year was the internet invented?", options: ["1969", "1975", "1983", "1991"], answer: 0 },
        { q: "Which blood type is universal donor?", options: ["A+", "B+", "AB+", "O-"], answer: 3 },
        { q: "What is the most spoken language?", options: ["English", "Spanish", "Mandarin", "Hindi"], answer: 2 },
      
        { q: "How many teeth does an adult have?", options: ["28", "30", "32", "34"], answer: 2 },
        { q: "What is the largest organ inside the body?", options: ["Heart", "Liver", "Lungs", "Brain"], answer: 1 },
        { q: "How many colors in a rainbow?", options: ["5", "6", "7", "8"], answer: 2 },
        { q: "What is the smallest bone in the body?", options: ["Stapes", "Femur", "Patella", "Radius"], answer: 0 },
        { q: "What metal is liquid at room temperature?", options: ["Lead", "Mercury", "Tin", "Zinc"], answer: 1 },
      
        { q: "What is the largest bird?", options: ["Eagle", "Ostrich", "Condor", "Albatross"], answer: 1 },
        { q: "What vitamin is in citrus fruits?", options: ["A", "B", "C", "D"], answer: 2 },
        { q: "What is the deepest ocean?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], answer: 2 },
        { q: "What is the currency of Japan?", options: ["Yuan", "Won", "Yen", "Baht"], answer: 2 },
        { q: "What is the hardest substance in the body?", options: ["Bone", "Nail", "Enamel", "Cartilage"], answer: 2 },
        { q: "How many lungs do humans have?", options: ["1", "2", "3", "4"], answer: 1 },
        { q: "What is the longest bone in the body?", options: ["Tibia", "Humerus", "Femur", "Spine"], answer: 2 },
        { q: "What is a group of lions called?", options: ["Pack", "Herd", "Pride", "Flock"], answer: 2 },
        { q: "What element does O represent?", options: ["Gold", "Osmium", "Oxygen", "Oganesson"], answer: 2 },
      ],
      hard: [
        { q: "What is the pH of pure water?", options: ["6", "7", "8", "9"], answer: 1 },
        { q: "How many hearts does an octopus have?", options: ["1", "2", "3", "4"], answer: 2 },
        { q: "What is the rarest blood type?", options: ["O-", "AB-", "B-", "A-"], answer: 1 },
        { q: "How long is a light-year in km?", options: ["9.5 billion", "9.5 trillion", "9.5 quadrillion", "950 billion"], answer: 1 },
        { q: "Which element has the highest melting point?", options: ["Iron", "Tungsten", "Carbon", "Platinum"], answer: 1 },
      
        { q: "What is the most common element in the universe?", options: ["Oxygen", "Carbon", "Hydrogen", "Helium"], answer: 2 },
        { q: "What temperature is same in C and F?", options: ["-40", "-32", "0", "32"], answer: 0 },
        { q: "How many bones in the human hand?", options: ["17", "22", "27", "32"], answer: 2 },
        { q: "What year was the first email sent?", options: ["1969", "1971", "1973", "1975"], answer: 1 },
        { q: "What is the deepest-diving whale?", options: ["Blue", "Humpback", "Sperm", "Orca"], answer: 2 },
      
        { q: "What is the only mammal that can fly?", options: ["Squirrel", "Bat", "Sugar glider", "Lemur"], answer: 1 },
        { q: "What color is cobalt?", options: ["Red", "Green", "Blue", "Yellow"], answer: 2 },
        { q: "What is the human body's largest artery?", options: ["Carotid", "Femoral", "Aorta", "Pulmonary"], answer: 2 },
        { q: "How many taste buds does a human have?", options: ["2,000", "5,000", "10,000", "20,000"], answer: 2 },
        { q: "What is the oldest known civilization?", options: ["Egyptian", "Greek", "Sumerian", "Chinese"], answer: 2 },
        { q: "What is the densest planet?", options: ["Jupiter", "Mars", "Earth", "Mercury"], answer: 2 },
        { q: "What percentage of the brain is water?", options: ["50%", "60%", "73%", "85%"], answer: 2 },
        { q: "What is the rarest M&M color?", options: ["Red", "Brown", "Green", "Orange"], answer: 1 },
        { q: "What animal has the most legs?", options: ["Centipede", "Millipede", "Spider", "Crab"], answer: 1 },
      ],
    }},
  { id: "entertainment", name: "MOVIES & TV", icon: "🎬", color: "#ef4444", desc: "Films, TV, music",
    levels: [
      { diff: "easy", coins: 800, time: 75 },
      { diff: "medium", coins: 2000, time: 55 },
      { diff: "hard", coins: 4000, time: 40 },
    ],
    questions: {
      easy: [
        { q: "Who directed Jurassic Park?", options: ["Cameron", "Spielberg", "Lucas", "Nolan"], answer: 1 },
        { q: "Which superhero is The Man of Steel?", options: ["Batman", "Iron Man", "Superman", "Thor"], answer: 2 },
        { q: "What franchise features lightsabers?", options: ["Star Trek", "Star Wars", "Halo", "Marvel"], answer: 1 },
        { q: "Who played Jack in Titanic?", options: ["Brad Pitt", "Tom Cruise", "Leo DiCaprio", "Matt Damon"], answer: 2 },
        { q: "What is the highest-grossing film ever?", options: ["Titanic", "Endgame", "Avatar", "Star Wars"], answer: 2 },
      
        { q: "What color is Shrek?", options: ["Blue", "Red", "Green", "Yellow"], answer: 2 },
        { q: "What is Pikachu's type?", options: ["Fire", "Water", "Electric", "Grass"], answer: 2 },
        { q: "What is Superman's weakness?", options: ["Fire", "Water", "Kryptonite", "Silver"], answer: 2 },
        { q: "What animal is Simba?", options: ["Tiger", "Bear", "Lion", "Panther"], answer: 2 },
        { q: "Who lives in a pineapple under the sea?", options: ["Nemo", "SpongeBob", "Patrick", "Dory"], answer: 1 },
      
        { q: "What is Mario's brother's name?", options: ["Wario", "Luigi", "Toad", "Yoshi"], answer: 1 },
        { q: "What does Elsa sing in Frozen?", options: ["Let It Be", "Let It Go", "Let It Snow", "Let It Rain"], answer: 1 },
        { q: "What color is Sonic the Hedgehog?", options: ["Red", "Green", "Blue", "Yellow"], answer: 2 },
        { q: "Who is Mickey Mouse's girlfriend?", options: ["Daisy", "Minnie", "Goofy", "Pluto"], answer: 1 },
        { q: "What is the name of Shrek's donkey?", options: ["Donkey", "Burro", "Jack", "Eddie"], answer: 0 },
        { q: "What game has creepers and Endermen?", options: ["Fortnite", "Roblox", "Minecraft", "Terraria"], answer: 2 },
        { q: "Who is the villain in The Lion King?", options: ["Simba", "Mufasa", "Scar", "Zazu"], answer: 2 },
        { q: "What school does Harry Potter attend?", options: ["Narnia", "Xavier's", "Hogwarts", "Mordor"], answer: 2 },
        { q: "What is the name of Thor's hammer?", options: ["Excalibur", "Mjolnir", "Stormbreaker", "Sting"], answer: 1 },
      ],
      medium: [
        { q: "Which band sang Bohemian Rhapsody?", options: ["Beatles", "Queen", "Led Zeppelin", "Pink Floyd"], answer: 1 },
        { q: "What year was the first Harry Potter film?", options: ["1999", "2000", "2001", "2002"], answer: 2 },
        { q: "Who created Mickey Mouse?", options: ["Warner Bros", "Pixar", "Walt Disney", "DreamWorks"], answer: 2 },
        { q: "The Mandalorian is in which universe?", options: ["Marvel", "DC", "Star Wars", "Star Trek"], answer: 2 },
        { q: "Who directed The Dark Knight trilogy?", options: ["Snyder", "Nolan", "Burton", "Whedon"], answer: 1 },
      
        { q: "Who played Iron Man in the MCU?", options: ["Chris Evans", "Chris Hemsworth", "Robert Downey Jr", "Mark Ruffalo"], answer: 2 },
        { q: "What year was Minecraft released?", options: ["2009", "2010", "2011", "2012"], answer: 2 },
        { q: "How many Infinity Stones are there?", options: ["4", "5", "6", "7"], answer: 2 },
        { q: "Which studio made Toy Story?", options: ["DreamWorks", "Disney", "Pixar", "Illumination"], answer: 2 },
        { q: "What planet is Superman from?", options: ["Mars", "Krypton", "Asgard", "Vulcan"], answer: 1 },
      
        { q: "What is the name of Batman's city?", options: ["Metropolis", "Star City", "Gotham", "Central City"], answer: 2 },
        { q: "Who is the main character in Zelda?", options: ["Zelda", "Link", "Ganon", "Epona"], answer: 1 },
        { q: "What year did Fortnite release?", options: ["2015", "2016", "2017", "2018"], answer: 2 },
        { q: "Who composed the Harry Potter music?", options: ["Zimmer", "Williams", "Shore", "Elfman"], answer: 1 },
        { q: "What is the highest-rated TV show on IMDb?", options: ["Game of Thrones", "Breaking Bad", "The Wire", "Sopranos"], answer: 1 },
        { q: "Who played Joker in The Dark Knight?", options: ["Nicholson", "Leto", "Phoenix", "Ledger"], answer: 3 },
        { q: "What studio made Shrek?", options: ["Pixar", "DreamWorks", "Disney", "Sony"], answer: 1 },
        { q: "How many Harry Potter books are there?", options: ["5", "6", "7", "8"], answer: 2 },
        { q: "What is the name of Iron Man's AI?", options: ["Cortana", "Alexa", "JARVIS", "Hal"], answer: 2 },
      ],
      hard: [
        { q: "Which film won Best Picture at 2020 Oscars?", options: ["1917", "Joker", "Parasite", "Once Upon a Time"], answer: 2 },
        { q: "What was Pixar's first feature film?", options: ["Bug's Life", "Toy Story", "Finding Nemo", "Monsters Inc"], answer: 1 },
        { q: "Who composed the score for Inception?", options: ["Williams", "Zimmer", "Elfman", "Shore"], answer: 1 },
        { q: "Which TV show has the most Emmy wins?", options: ["Game of Thrones", "Frasier", "Saturday Night Live", "The Simpsons"], answer: 0 },
        { q: "What year was Netflix founded?", options: ["1995", "1997", "1999", "2001"], answer: 1 },
      
        { q: "Which country produces the most films yearly?", options: ["USA", "China", "India", "Nigeria"], answer: 2 },
        { q: "Who directed Pulp Fiction?", options: ["Scorsese", "Tarantino", "Coppola", "Fincher"], answer: 1 },
        { q: "What was the first video game console?", options: ["Atari", "NES", "Magnavox Odyssey", "ColecoVision"], answer: 2 },
        { q: "Who wrote The Lord of the Rings?", options: ["C.S. Lewis", "J.R.R. Tolkien", "George R.R. Martin", "J.K. Rowling"], answer: 1 },
        { q: "What AI is in 2001: A Space Odyssey?", options: ["JARVIS", "HAL 9000", "Skynet", "WOPR"], answer: 1 },
      
        { q: "What is the best-selling video game ever?", options: ["GTA V", "Minecraft", "Tetris", "Wii Sports"], answer: 1 },
        { q: "Who directed Inception and Interstellar?", options: ["Spielberg", "Nolan", "Cameron", "Villeneuve"], answer: 1 },
        { q: "What anime has the most episodes?", options: ["Naruto", "One Piece", "Dragon Ball", "Sazae-san"], answer: 3 },
        { q: "What movie won the first Best Picture Oscar?", options: ["Wings", "Sunrise", "The Jazz Singer", "Ben-Hur"], answer: 0 },
        { q: "Who invented the Game Boy?", options: ["Sony", "Sega", "Nintendo", "Atari"], answer: 2 },
        { q: "What is the longest-running TV show?", options: ["The Simpsons", "Gunsmoke", "Doctor Who", "Coronation Street"], answer: 0 },
        { q: "What is Studio Ghibli's highest-grossing film?", options: ["Totoro", "Spirited Away", "Howl's Castle", "Ponyo"], answer: 1 },
        { q: "Who voiced Woody in Toy Story?", options: ["Tim Allen", "Tom Hanks", "Robin Williams", "Billy Crystal"], answer: 1 },
        { q: "What year did YouTube launch?", options: ["2003", "2004", "2005", "2006"], answer: 2 },
      ],
    }},
  { id: "sports", name: "SPORTS", icon: "⚽", color: "#6ee7b7", desc: "Athletes, records, games",
    levels: [
      { diff: "easy", coins: 800, time: 75 },
      { diff: "medium", coins: 2000, time: 55 },
      { diff: "hard", coins: 4000, time: 40 },
    ],
    questions: {
      easy: [
        { q: "How many players on a basketball court per team?", options: ["4", "5", "6", "7"], answer: 1 },
        { q: "Which sport uses a shuttlecock?", options: ["Tennis", "Badminton", "Squash", "Table Tennis"], answer: 1 },
        { q: "The Olympics happen every how many years?", options: ["2", "3", "4", "5"], answer: 2 },
        { q: "Which country invented cricket?", options: ["India", "Australia", "England", "South Africa"], answer: 2 },
        { q: "How many points for a touchdown in NFL?", options: ["3", "5", "6", "7"], answer: 2 },
      
        { q: "What is a perfect score in bowling?", options: ["200", "250", "300", "350"], answer: 2 },
        { q: "In which sport do you use a puck?", options: ["Hockey", "Lacrosse", "Cricket", "Baseball"], answer: 0 },
        { q: "How many rings on the Olympic flag?", options: ["3", "4", "5", "6"], answer: 2 },
        { q: "What sport uses a racket and shuttlecock?", options: ["Tennis", "Badminton", "Squash", "Ping Pong"], answer: 1 },
        { q: "How many quarters in a basketball game?", options: ["2", "3", "4", "5"], answer: 2 },
      
        { q: "What sport uses a bat and ball on a diamond?", options: ["Cricket", "Baseball", "Golf", "Tennis"], answer: 1 },
        { q: "How many players on a volleyball team?", options: ["4", "5", "6", "7"], answer: 2 },
        { q: "What color is a tennis ball?", options: ["White", "Yellow", "Green", "Orange"], answer: 1 },
        { q: "What sport is Tiger Woods famous for?", options: ["Tennis", "Baseball", "Golf", "Boxing"], answer: 2 },
        { q: "How many bases in baseball?", options: ["3", "4", "5", "6"], answer: 1 },
        { q: "What do you hit in badminton?", options: ["Ball", "Puck", "Shuttlecock", "Disc"], answer: 2 },
        { q: "What sport is played in a pool?", options: ["Water polo", "Tennis", "Golf", "Cricket"], answer: 0 },
        { q: "How many periods in ice hockey?", options: ["2", "3", "4", "5"], answer: 1 },
        { q: "What do you wear on your feet to ice skate?", options: ["Cleats", "Skates", "Boots", "Sneakers"], answer: 1 },
      ],
      medium: [
        { q: "Who has the most Grand Slam titles (men)?", options: ["Federer", "Nadal", "Djokovic", "Sampras"], answer: 2 },
        { q: "Which country won the 2022 FIFA World Cup?", options: ["France", "Brazil", "Argentina", "Germany"], answer: 2 },
        { q: "What is the 100m sprint world record?", options: ["9.48s", "9.58s", "9.68s", "9.78s"], answer: 1 },
        { q: "Which sport is played at Wimbledon?", options: ["Golf", "Cricket", "Tennis", "Polo"], answer: 2 },
        { q: "How many holes in a golf course?", options: ["9", "12", "15", "18"], answer: 3 },
      
        { q: "Which country has won the most World Cups?", options: ["Germany", "Italy", "Argentina", "Brazil"], answer: 3 },
        { q: "How long is a marathon in miles?", options: ["24.2", "25.2", "26.2", "27.2"], answer: 2 },
        { q: "In cricket, how many balls in an over?", options: ["4", "5", "6", "8"], answer: 2 },
        { q: "What is the maximum break in snooker?", options: ["127", "137", "147", "155"], answer: 2 },
        { q: "How many sets to win in men's Grand Slam tennis?", options: ["2", "3", "4", "5"], answer: 1 },
      
        { q: "What country invented basketball?", options: ["USA", "Canada", "UK", "France"], answer: 0 },
        { q: "How many points for a 3-pointer in basketball?", options: ["1", "2", "3", "4"], answer: 2 },
        { q: "What is the Tour de France?", options: ["Running race", "Cycling race", "Car rally", "Boat race"], answer: 1 },
        { q: "Who has the most Ballon d'Or awards?", options: ["Ronaldo", "Messi", "Pele", "Maradona"], answer: 1 },
        { q: "What is the national sport of Japan?", options: ["Karate", "Judo", "Sumo", "Kendo"], answer: 2 },
        { q: "How many sets in a volleyball match?", options: ["3", "4", "5", "6"], answer: 2 },
        { q: "What sport uses the term 'birdie'?", options: ["Tennis", "Golf", "Badminton", "Both B&C"], answer: 3 },
        { q: "Where were the 2020 Olympics held?", options: ["Beijing", "London", "Tokyo", "Paris"], answer: 2 },
        { q: "What is the weight of a boxing heavyweight?", options: ["175+ lbs", "190+ lbs", "200+ lbs", "220+ lbs"], answer: 2 },
      ],
      hard: [
        { q: "Who holds the most Olympic gold medals?", options: ["Bolt", "Phelps", "Latynina", "Nurmi"], answer: 1 },
        { q: "Which F1 driver has the most championships?", options: ["Schumacher", "Hamilton", "Fangio", "Senna"], answer: 1 },
        { q: "Where were the first modern Olympics?", options: ["Paris", "London", "Athens", "Berlin"], answer: 2 },
        { q: "Diameter of a basketball hoop in inches?", options: ["16", "18", "20", "22"], answer: 1 },
        { q: "Most Cricket World Cup wins?", options: ["India", "Australia", "West Indies", "England"], answer: 1 },
      
        { q: "Only country in every FIFA World Cup?", options: ["Germany", "Argentina", "Italy", "Brazil"], answer: 3 },
        { q: "How many dimples on a golf ball?", options: ["236", "336", "436", "536"], answer: 1 },
        { q: "What is the oldest Grand Slam?", options: ["US Open", "French Open", "Wimbledon", "Australian Open"], answer: 2 },
        { q: "Which NBA player has most career points?", options: ["Jordan", "Kareem", "LeBron", "Kobe"], answer: 2 },
        { q: "What sport is called the sweet science?", options: ["Fencing", "Boxing", "Wrestling", "Judo"], answer: 1 },
      
        { q: "What sport has the most participants globally?", options: ["Cricket", "Soccer", "Basketball", "Swimming"], answer: 1 },
        { q: "Who has the most Grand Slam titles (all)?", options: ["Federer", "Nadal", "Djokovic", "Serena Williams"], answer: 2 },
        { q: "What is the diameter of a soccer goal (m)?", options: ["7.32", "7.62", "8.00", "8.32"], answer: 0 },
        { q: "What year were the first Winter Olympics?", options: ["1916", "1920", "1924", "1928"], answer: 2 },
        { q: "Who holds the 200m world record?", options: ["Bolt", "Blake", "Gay", "Powell"], answer: 0 },
        { q: "What martial art is in the Olympics since 2020?", options: ["Kung Fu", "Taekwondo", "Karate", "Jiu-Jitsu"], answer: 2 },
        { q: "How long is an Olympic swimming pool (m)?", options: ["25", "50", "75", "100"], answer: 1 },
        { q: "What country has won the most Olympic golds?", options: ["China", "Russia", "UK", "USA"], answer: 3 },
        { q: "What is the heaviest ball in sports?", options: ["Basketball", "Bowling ball", "Shot put", "Medicine ball"], answer: 1 },
      ],
    }},
];
function scrambleWord(word, attempts = 0) {
  if (attempts > 20 || word.length <= 2) {
    const arr = word.split("");
    [arr[0], arr[arr.length - 1]] = [arr[arr.length - 1], arr[0]];
    return arr.join("");
  }
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  const result = arr.join("");
  return result === word ? scrambleWord(word, attempts + 1) : result;
}
const WORD_CATEGORIES = [
  { id: "space", name: "SPACE & ASTRONOMY", icon: "🚀", color: "#60a5fa", desc: "Stars, planets, cosmos",
    levels: [
      { diff: "easy", coins: 400, time: 75 },
      { diff: "medium", coins: 1200, time: 55 },
      { diff: "hard", coins: 2800, time: 40 },
    ],
    words: {
      easy: [
        { answer: "STAR", hint: "It shines at night" },
        { answer: "MOON", hint: "Orbits the Earth" },
        { answer: "MARS", hint: "The Red Planet" },
        { answer: "VOID", hint: "Empty space" },
      
        { answer: "SUN", hint: "Our closest star" },
      
        { answer: "ORBIT", hint: "Path around a planet" },
        { answer: "DUST", hint: "Cosmic particles" },
        { answer: "GLOW", hint: "Stars do this" },
        { answer: "DARK", hint: "Most of space is this" },
        { answer: "RING", hint: "Saturn has these" },
        { answer: "BEAM", hint: "Light travels in one" },
        { answer: "CORE", hint: "Center of a planet" },
        { answer: "POLE", hint: "North or south end" },
        { answer: "DAWN", hint: "Sunrise on a planet" },
        { answer: "VAST", hint: "Space is incredibly this" },
        { answer: "FUEL", hint: "Rockets need this" },
      ],
      medium: [
        { answer: "COMET", hint: "Icy traveler with a tail" },
        { answer: "LUNAR", hint: "Related to the moon" },
        { answer: "SOLAR", hint: "Related to the sun" },
      
        { answer: "ROCKET", hint: "Space vehicle" },
        { answer: "SATURN", hint: "Planet with rings" },
        { answer: "GALAXY", hint: "Collection of stars" },
      
        { answer: "CRATER", hint: "Impact hole on moon" },
        { answer: "PULSAR", hint: "Rotating neutron star" },
        { answer: "DEBRIS", hint: "Space junk" },
        { answer: "QUASAR", hint: "Extremely bright object" },
        { answer: "LAUNCH", hint: "Rocket liftoff" },
        { answer: "METEOR", hint: "Shooting star" },
        { answer: "ZENITH", hint: "Highest point in sky" },
        { answer: "COSMOS", hint: "The entire universe" },
        { answer: "DWARF", hint: "Type of small star" },
        { answer: "FLARE", hint: "Solar eruption" },
      ],
      hard: [
        { answer: "ASTEROID", hint: "Rocky space object" },
        { answer: "SUPERNOVA", hint: "Massive star explosion" },
        { answer: "SATELLITE", hint: "Orbiting object" },
        { answer: "TELESCOPE", hint: "Used to see far away" },
      
        { answer: "NEBULA", hint: "Stellar nursery" },
        { answer: "ECLIPSE", hint: "Shadow alignment" },
      
        { answer: "SOLSTICE", hint: "Longest or shortest day" },
        { answer: "APHELION", hint: "Farthest point from sun" },
        { answer: "REDSHIFT", hint: "Light stretching effect" },
        { answer: "WORMHOLE", hint: "Theoretical space tunnel" },
        { answer: "EXOPLANET", hint: "Planet outside our system" },
        { answer: "MAGNITUDE", hint: "Star brightness measure" },
        { answer: "RADIATION", hint: "Energy from stars" },
        { answer: "METEORITE", hint: "Space rock on ground" },
        { answer: "CELESTIAL", hint: "Related to the heavens" },
        { answer: "PERIHELION", hint: "Closest point to sun" },
      ],
    }},
  { id: "animals", name: "ANIMALS & NATURE", icon: "🐾", color: "#6ee7b7", desc: "Wildlife, plants, ecosystems",
    levels: [
      { diff: "easy", coins: 400, time: 75 },
      { diff: "medium", coins: 1200, time: 55 },
      { diff: "hard", coins: 2800, time: 40 },
    ],
    words: {
      easy: [
        { answer: "WOLF", hint: "Howls at the moon" },
        { answer: "FROG", hint: "Leaps and ribbits" },
        { answer: "HAWK", hint: "Bird of prey" },
        { answer: "BEAR", hint: "Hibernates in winter" },
      
        { answer: "FISH", hint: "Aquatic creature" },
        { answer: "BIRD", hint: "Feathered flyer" },
      
        { answer: "DEER", hint: "Forest animal with antlers" },
        { answer: "SEAL", hint: "Ocean mammal" },
        { answer: "MOTH", hint: "Nocturnal butterfly" },
        { answer: "CRAB", hint: "Sideways walker" },
        { answer: "WASP", hint: "Stinging insect" },
        { answer: "GOAT", hint: "Mountain climber" },
        { answer: "DUCK", hint: "Quacking bird" },
        { answer: "MOLE", hint: "Underground digger" },
        { answer: "TOAD", hint: "Warty amphibian" },
        { answer: "NEWT", hint: "Small salamander" },
      ],
      medium: [
        { answer: "SHARK", hint: "Apex ocean predator" },
        { answer: "EAGLE", hint: "Majestic bird of prey" },
        { answer: "CORAL", hint: "Underwater reef builder" },
        { answer: "PANDA", hint: "Black and white bear" },
      
        { answer: "MONKEY", hint: "Tree-swinging primate" },
        { answer: "TURTLE", hint: "Slow shelled reptile" },
        { answer: "PARROT", hint: "Talking bird" },
        { answer: "RABBIT", hint: "Long-eared hopper" },
      
        { answer: "FALCON", hint: "Fastest bird alive" },
        { answer: "BADGER", hint: "Black and white digger" },
        { answer: "SALMON", hint: "Upstream swimming fish" },
        { answer: "BEETLE", hint: "Hard-shelled insect" },
        { answer: "LIZARD", hint: "Scaly reptile" },
        { answer: "DONKEY", hint: "Stubborn equine" },
        { answer: "JAGUAR", hint: "Spotted jungle cat" },
        { answer: "WALRUS", hint: "Tusked Arctic mammal" },
        { answer: "SPIDER", hint: "Eight-legged web maker" },
        { answer: "OYSTER", hint: "Pearl-making shellfish" },
        { answer: "PIGEON", hint: "City bird" },
        { answer: "MANTIS", hint: "Praying insect" },
      ],
      hard: [
        { answer: "ELEPHANT", hint: "Largest land animal" },
        { answer: "PREDATOR", hint: "Hunts for food" },
        { answer: "CHAMELEON", hint: "Changes color" },
        { answer: "NOCTURNAL", hint: "Active at night" },
      
        { answer: "CHEETAH", hint: "Fastest land animal" },
        { answer: "PANGOLIN", hint: "Scaly anteater" },
        { answer: "PLATYPUS", hint: "Duck-billed mammal" },
      
        { answer: "FLAMINGO", hint: "Pink long-legged bird" },
        { answer: "SCORPION", hint: "Stinging arachnid" },
        { answer: "MANATEE", hint: "Gentle sea cow" },
        { answer: "TORTOISE", hint: "Slow land reptile" },
        { answer: "NARWHAL", hint: "Unicorn of the sea" },
        { answer: "ANTEATER", hint: "Long tongue insect eater" },
        { answer: "ANACONDA", hint: "Giant South American snake" },
        { answer: "KANGAROO", hint: "Australian hopper" },
        { answer: "ARMADILLO", hint: "Armored mammal" },
        { answer: "PORCUPINE", hint: "Quill-covered rodent" },
        { answer: "WOLVERINE", hint: "Fierce small predator" },
      ],
    }},
  { id: "tech", name: "TECHNOLOGY", icon: "💻", color: "#c084fc", desc: "Gadgets, code, internet",
    levels: [
      { diff: "easy", coins: 500, time: 75 },
      { diff: "medium", coins: 1400, time: 55 },
      { diff: "hard", coins: 3200, time: 40 },
    ],
    words: {
      easy: [
        { answer: "CODE", hint: "What programmers write" },
        { answer: "WIFI", hint: "Wireless internet" },
        { answer: "BYTE", hint: "8 bits" },
        { answer: "CHIP", hint: "Inside a computer" },
      
        { answer: "APP", hint: "Phone program" },
        { answer: "WEB", hint: "Internet network" },
      
        { answer: "LINK", hint: "Clickable URL" },
        { answer: "DATA", hint: "Digital information" },
        { answer: "SCAN", hint: "Read a document digitally" },
        { answer: "SPAM", hint: "Unwanted email" },
        { answer: "ICON", hint: "Small screen image" },
        { answer: "PING", hint: "Network test signal" },
        { answer: "BOOT", hint: "Starting up a computer" },
        { answer: "PORT", hint: "Connection socket" },
        { answer: "SITE", hint: "Web location" },
        { answer: "HACK", hint: "Break into a system" },
      ],
      medium: [
        { answer: "CLOUD", hint: "Online storage" },
        { answer: "PIXEL", hint: "Tiny screen dot" },
        { answer: "CACHE", hint: "Temporary storage" },
        { answer: "DEBUG", hint: "Fix errors in code" },
      
        { answer: "SERVER", hint: "Hosts websites" },
        { answer: "PYTHON", hint: "Popular coding language" },
        { answer: "ROUTER", hint: "Network traffic director" },
        { answer: "BINARY", hint: "Language of 0s and 1s" },
      
        { answer: "KERNEL", hint: "OS core component" },
        { answer: "COOKIE", hint: "Browser tracking data" },
        { answer: "CURSOR", hint: "Screen pointer" },
        { answer: "MALWARE", hint: "Malicious software" },
        { answer: "DOMAIN", hint: "Website address name" },
        { answer: "BACKUP", hint: "Copy for safety" },
        { answer: "WIDGET", hint: "Small app component" },
        { answer: "PLUGIN", hint: "Software extension" },
        { answer: "RENDER", hint: "Generate visual output" },
        { answer: "SYNTAX", hint: "Code grammar rules" },
        { answer: "TOGGLE", hint: "On/off switch" },
        { answer: "STREAM", hint: "Live data flow" },
      ],
      hard: [
        { answer: "ALGORITHM", hint: "Step-by-step process" },
        { answer: "BANDWIDTH", hint: "Data transfer capacity" },
        { answer: "ENCRYPTED", hint: "Secured with a cipher" },
        { answer: "FIREWALL", hint: "Network security barrier" },
      
        { answer: "ETHERNET", hint: "Wired network standard" },
        { answer: "COMPILER", hint: "Code translator" },
        { answer: "PROTOCOL", hint: "Communication rules" },
      
        { answer: "FIRMWARE", hint: "Hardware-embedded software" },
        { answer: "DEBUGGER", hint: "Bug-finding tool" },
        { answer: "METADATA", hint: "Data about data" },
        { answer: "RECURSION", hint: "Function calling itself" },
        { answer: "CONTAINER", hint: "Isolated software package" },
        { answer: "BOOTSTRAP", hint: "Self-starting process" },
        { answer: "PROCESSOR", hint: "CPU full name" },
        { answer: "FRAMEWORK", hint: "Code foundation structure" },
        { answer: "INTERFACE", hint: "User interaction layer" },
        { answer: "BLOCKCHAIN", hint: "Distributed ledger tech" },
      ],
    }},
  { id: "science", name: "SCIENCE & CHEMISTRY", icon: "🔬", color: "#fbbf24", desc: "Elements, reactions, physics",
    levels: [
      { diff: "easy", coins: 500, time: 75 },
      { diff: "medium", coins: 1400, time: 55 },
      { diff: "hard", coins: 3200, time: 40 },
    ],
    words: {
      easy: [
        { answer: "ATOM", hint: "Smallest unit of matter" },
        { answer: "CELL", hint: "Basic unit of life" },
        { answer: "IRON", hint: "Element Fe" },
        { answer: "ACID", hint: "Low pH substance" },
      
        { answer: "HEAT", hint: "Thermal energy" },
        { answer: "WAVE", hint: "Energy transfer pattern" },
      
        { answer: "LENS", hint: "Focuses light" },
        { answer: "MASS", hint: "Amount of matter" },
        { answer: "SEED", hint: "Plant starter" },
        { answer: "RUST", hint: "Iron oxidation" },
        { answer: "BONE", hint: "Skeleton part" },
        { answer: "STEM", hint: "Plant support structure" },
        { answer: "CORE", hint: "Earth's center" },
        { answer: "GENE", hint: "DNA unit" },
        { answer: "VOLT", hint: "Electricity measure" },
        { answer: "FERN", hint: "Ancient plant type" },
        { answer: "LUNG", hint: "Breathing organ" },
      ],
      medium: [
        { answer: "PROTON", hint: "Positive particle" },
        { answer: "PLASMA", hint: "Fourth state of matter" },
        { answer: "ENZYME", hint: "Biological catalyst" },
        { answer: "FUSION", hint: "Stars run on this" },
      
        { answer: "MAGNET", hint: "Attracts iron" },
        { answer: "PHOTON", hint: "Light particle" },
      
        { answer: "PRISM", hint: "Splits white light" },
        { answer: "FOSSIL", hint: "Preserved ancient life" },
        { answer: "NEUTRON", hint: "Neutral atomic particle" },
        { answer: "REFLEX", hint: "Automatic body response" },
        { answer: "OXYGEN", hint: "We breathe this gas" },
        { answer: "CARBON", hint: "Basis of organic life" },
        { answer: "THEORY", hint: "Scientific explanation" },
        { answer: "GENOME", hint: "Complete DNA set" },
        { answer: "STATIC", hint: "Electric charge buildup" },
        { answer: "BEAKER", hint: "Lab glass container" },
      ],
      hard: [
        { answer: "MOLECULE", hint: "Group of bonded atoms" },
        { answer: "CATALYST", hint: "Speeds up reactions" },
        { answer: "ELECTRON", hint: "Negative particle" },
        { answer: "SPECTRUM", hint: "Range of wavelengths" },
      
        { answer: "ISOTOPE", hint: "Same element different mass" },
        { answer: "ENTROPY", hint: "Measure of disorder" },
        { answer: "QUANTUM", hint: "Smallest discrete unit" },
      
        { answer: "ANTIMATTER", hint: "Opposite of matter" },
        { answer: "SYNTHESIS", hint: "Building complex from simple" },
        { answer: "PHOTOSYNTHESIS", hint: "Plant energy process" },
        { answer: "CHROMOSOME", hint: "DNA package in cell" },
        { answer: "ELECTRODE", hint: "Conducts electricity" },
        { answer: "FREQUENCY", hint: "Wave cycles per second" },
        { answer: "HYDROGEN", hint: "Lightest element" },
        { answer: "MOMENTUM", hint: "Mass times velocity" },
        { answer: "VELOCITY", hint: "Speed with direction" },
        { answer: "ORGANISM", hint: "Living thing" },
        { answer: "EQUILIBRIUM", hint: "State of balance" },
        { answer: "VISCOSITY", hint: "Fluid thickness measure" },
      ],
    }},
  { id: "history", name: "HISTORY", icon: "🏛️", color: "#fbbf24", desc: "Past events, civilizations",
    levels: [
      { diff: "easy", coins: 500, time: 75 },
      { diff: "medium", coins: 1400, time: 55 },
      { diff: "hard", coins: 3200, time: 40 },
    ],
    words: {
      easy: [
        { answer: "KING", hint: "Male ruler" },
        { answer: "ROME", hint: "Ancient empire's capital" },
        { answer: "ARMY", hint: "Military force" },
        { answer: "GOLD", hint: "Precious metal for trade" },
      
        { answer: "FORT", hint: "Military stronghold" },
        { answer: "SHIP", hint: "Ocean vessel" },
        { answer: "COIN", hint: "Ancient currency" },
        { answer: "SILK", hint: "Luxury ancient fabric" },
      
        { answer: "DUKE", hint: "Noble rank" },
        { answer: "HERO", hint: "Brave person" },
        { answer: "FLAG", hint: "National symbol" },
        { answer: "TOMB", hint: "Burial place" },
        { answer: "WALL", hint: "China built a great one" },
        { answer: "IRON", hint: "An age of metal" },
        { answer: "OATH", hint: "Solemn promise" },
        { answer: "RAID", hint: "Surprise attack" },
        { answer: "MONK", hint: "Religious devotee" },
        { answer: "LORD", hint: "Medieval ruler" },
        { answer: "SERF", hint: "Medieval laborer" },
        { answer: "CROWN", hint: "Royal headwear" },
      ],
      medium: [
        { answer: "EMPIRE", hint: "Large kingdom" },
        { answer: "KNIGHT", hint: "Medieval warrior" },
        { answer: "THRONE", hint: "Royal seat" },
        { answer: "PLAGUE", hint: "Black Death" },
      
        { answer: "CASTLE", hint: "Medieval fortress" },
        { answer: "VIKING", hint: "Norse warrior" },
        { answer: "TEMPLE", hint: "Place of worship" },
        { answer: "SCROLL", hint: "Ancient document" },
      
        { answer: "TREATY", hint: "Peace agreement" },
        { answer: "COLONY", hint: "Overseas territory" },
        { answer: "BISHOP", hint: "Church leader" },
        { answer: "RANSOM", hint: "Payment for captive" },
        { answer: "FEUDAL", hint: "Medieval land system" },
        { answer: "TRENCH", hint: "WWI fighting ditch" },
        { answer: "MUSKET", hint: "Early firearm" },
        { answer: "SULTAN", hint: "Ottoman ruler" },
        { answer: "SAMURAI", hint: "Japanese warrior" },
        { answer: "CHARIOT", hint: "Ancient war vehicle" },
        { answer: "PILGRIM", hint: "Religious traveler" },
        { answer: "ANCIENT", hint: "Very old civilization" },
      ],
      hard: [
        { answer: "REVOLUTION", hint: "Overthrow of power" },
        { answer: "GLADIATOR", hint: "Roman arena fighter" },
        { answer: "PHARAOH", hint: "Egyptian ruler" },
        { answer: "CRUSADE", hint: "Medieval holy war" },
      
        { answer: "DYNASTY", hint: "Ruling family line" },
        { answer: "EMPEROR", hint: "Supreme ruler" },
        { answer: "MEDIEVAL", hint: "Middle Ages period" },
        { answer: "ARTIFACT", hint: "Historical object" },
      
        { answer: "MONARCHY", hint: "Rule by a king" },
        { answer: "ALLIANCE", hint: "Military partnership" },
        { answer: "CONQUEST", hint: "Military takeover" },
        { answer: "DIPLOMAT", hint: "International negotiator" },
        { answer: "COLOSSEUM", hint: "Roman arena" },
        { answer: "RENAISSANCE", hint: "Cultural rebirth period" },
        { answer: "ARMISTICE", hint: "War ceasefire" },
        { answer: "HIEROGLYPH", hint: "Egyptian writing symbol" },
        { answer: "GUILLOTINE", hint: "French execution device" },
        { answer: "ABOLITION", hint: "Ending of slavery" },
        { answer: "INQUISITION", hint: "Religious persecution" },
        { answer: "PARLIAMENT", hint: "Legislative body" },
      ],
    }},
  { id: "geography", name: "GEOGRAPHY", icon: "🌍", color: "#0ff", desc: "Places, landforms",
    levels: [
      { diff: "easy", coins: 400, time: 75 },
      { diff: "medium", coins: 1200, time: 55 },
      { diff: "hard", coins: 2800, time: 40 },
    ],
    words: {
      easy: [
        { answer: "LAKE", hint: "Body of fresh water" },
        { answer: "HILL", hint: "Small mountain" },
        { answer: "CAVE", hint: "Underground opening" },
        { answer: "REEF", hint: "Underwater coral structure" },
      
        { answer: "SAND", hint: "Beach material" },
        { answer: "PEAK", hint: "Mountain top" },
        { answer: "POND", hint: "Small body of water" },
        { answer: "GULF", hint: "Large ocean inlet" },
      
        { answer: "CAPE", hint: "Land jutting into sea" },
        { answer: "BANK", hint: "River edge" },
        { answer: "DUNE", hint: "Sand hill" },
        { answer: "FORD", hint: "Shallow river crossing" },
        { answer: "VALE", hint: "Wide valley" },
        { answer: "COVE", hint: "Small sheltered bay" },
        { answer: "MESA", hint: "Flat-topped hill" },
        { answer: "TIDE", hint: "Ocean rise and fall" },
        { answer: "BAY", hint: "Curved coastline indent" },
        { answer: "CLIFF", hint: "Steep rock face" },
        { answer: "RIDGE", hint: "Long narrow hilltop" },
      ],
      medium: [
        { answer: "CANYON", hint: "Deep valley with steep sides" },
        { answer: "ISLAND", hint: "Land surrounded by water" },
        { answer: "DESERT", hint: "Dry sandy region" },
        { answer: "GLACIER", hint: "Slow-moving ice river" },
      
        { answer: "VALLEY", hint: "Low land between hills" },
        { answer: "JUNGLE", hint: "Dense tropical forest" },
        { answer: "LAGOON", hint: "Shallow coastal water" },
        { answer: "SUMMIT", hint: "Highest point" },
      
        { answer: "RAVINE", hint: "Narrow steep valley" },
        { answer: "TUNDRA", hint: "Frozen treeless land" },
        { answer: "STEPPE", hint: "Flat grassland" },
        { answer: "GEYSER", hint: "Hot water eruption" },
        { answer: "GORGE", hint: "Deep narrow valley" },
        { answer: "MARSH", hint: "Wetland area" },
        { answer: "STRAIT", hint: "Narrow water channel" },
        { answer: "OASIS", hint: "Desert water source" },
        { answer: "DELTA", hint: "River mouth formation" },
        { answer: "BASIN", hint: "Low-lying land area" },
        { answer: "TROPIC", hint: "Hot climate zone" },
        { answer: "PRAIRIE", hint: "North American grassland" },
      ],
      hard: [
        { answer: "PENINSULA", hint: "Land surrounded by water on 3 sides" },
        { answer: "CONTINENT", hint: "Major landmass" },
        { answer: "ARCHIPELAGO", hint: "Chain of islands" },
        { answer: "TECTONIC", hint: "Earth's moving plates" },
      
        { answer: "SAVANNAH", hint: "Tropical grassland" },
        { answer: "PLATEAU", hint: "Flat elevated land" },
        { answer: "ESTUARY", hint: "River meets the sea" },
      
        { answer: "VOLCANIC", hint: "Eruption-related" },
        { answer: "MERIDIAN", hint: "Longitude line" },
        { answer: "ALTITUDE", hint: "Height above sea level" },
        { answer: "LATITUDE", hint: "Distance from equator" },
        { answer: "MONSOON", hint: "Seasonal wind shift" },
        { answer: "ISTHMUS", hint: "Narrow land strip" },
        { answer: "MANGROVE", hint: "Coastal tree swamp" },
        { answer: "PERMAFROST", hint: "Permanently frozen ground" },
        { answer: "TRIBUTARY", hint: "River branch" },
        { answer: "TOPOGRAPHY", hint: "Land surface features" },
        { answer: "HEMISPHERE", hint: "Half of the globe" },
        { answer: "CONTINENTAL", hint: "Related to landmasses" },
      ],
    }},
  { id: "sports", name: "SPORTS", icon: "⚽", color: "#6ee7b7", desc: "Games, athletes",
    levels: [
      { diff: "easy", coins: 400, time: 75 },
      { diff: "medium", coins: 1200, time: 55 },
      { diff: "hard", coins: 2800, time: 40 },
    ],
    words: {
      easy: [
        { answer: "GOAL", hint: "Score in football" },
        { answer: "RACE", hint: "Speed competition" },
        { answer: "TEAM", hint: "Group of players" },
        { answer: "BALL", hint: "Round sports object" },
      
        { answer: "KICK", hint: "Football move" },
        { answer: "JUMP", hint: "Leap into air" },
        { answer: "SWIM", hint: "Water movement" },
        { answer: "PASS", hint: "Throw to teammate" },
      
        { answer: "WIN", hint: "Opposite of lose" },
        { answer: "NET", hint: "Tennis divider" },
        { answer: "RUN", hint: "Track event" },
        { answer: "BAT", hint: "Cricket hitting tool" },
        { answer: "HOOP", hint: "Basketball ring" },
        { answer: "DIVE", hint: "Pool entry sport" },
        { answer: "PUCK", hint: "Hockey disk" },
        { answer: "FOUL", hint: "Rule violation" },
        { answer: "SERVE", hint: "Tennis start shot" },
        { answer: "SCORE", hint: "Game points" },
        { answer: "COACH", hint: "Team leader" },
        { answer: "PITCH", hint: "Soccer field or throw" },
      ],
      medium: [
        { answer: "SPRINT", hint: "Short fast run" },
        { answer: "TACKLE", hint: "Defensive move in football" },
        { answer: "TROPHY", hint: "Winner's prize" },
        { answer: "LEAGUE", hint: "Group of competing teams" },
      
        { answer: "GOALIE", hint: "Defends the net" },
        { answer: "BOXING", hint: "Ring combat sport" },
        { answer: "ARCHER", hint: "Bow and arrow athlete" },
        { answer: "HURDLE", hint: "Jump-over barrier" },
      
        { answer: "VOLLEY", hint: "Hit before bounce" },
        { answer: "PENALTY", hint: "Punishment kick" },
        { answer: "REFEREE", hint: "Game official" },
        { answer: "STRIKER", hint: "Forward scorer" },
        { answer: "PLAYOFF", hint: "Elimination round" },
        { answer: "INNING", hint: "Baseball turn segment" },
        { answer: "WICKET", hint: "Cricket target" },
        { answer: "JAVELIN", hint: "Throwing spear event" },
        { answer: "OFFENSE", hint: "Attacking team" },
        { answer: "FUMBLE", hint: "Dropped ball error" },
        { answer: "STEROID", hint: "Banned performance drug" },
      ],
      hard: [
        { answer: "MARATHON", hint: "26.2 mile race" },
        { answer: "OLYMPICS", hint: "Global sports event" },
        { answer: "DECATHLON", hint: "10-event competition" },
        { answer: "GYMNASIUM", hint: "Indoor sports facility" },
      
        { answer: "TRIATHLON", hint: "Three-sport event" },
        { answer: "FREESTYLE", hint: "Swimming stroke" },
        { answer: "DRIBBLING", hint: "Ball control skill" },
        { answer: "ATHLETICS", hint: "Track and field events" },
      
        { answer: "ENDURANCE", hint: "Stamina ability" },
        { answer: "AGGREGATE", hint: "Combined score total" },
        { answer: "QUALIFIER", hint: "Preliminary round" },
        { answer: "DEFENDING", hint: "Current champion status" },
        { answer: "UNDERDOG", hint: "Expected to lose" },
        { answer: "RELEGATED", hint: "Dropped to lower league" },
        { answer: "REBOUND", hint: "Ball bounce recovery" },
        { answer: "OVERTIME", hint: "Extra game period" },
        { answer: "SEMIFINAL", hint: "Round before the final" },
        { answer: "SPORTSMANSHIP", hint: "Fair play spirit" },
        { answer: "TOURNAMENT", hint: "Competition series" },
      ],
    }},
  { id: "food", name: "FOOD & COOKING", icon: "🍕", color: "#ef4444", desc: "Dishes, ingredients",
    levels: [
      { diff: "easy", coins: 400, time: 75 },
      { diff: "medium", coins: 1200, time: 55 },
      { diff: "hard", coins: 2800, time: 40 },
    ],
    words: {
      easy: [
        { answer: "RICE", hint: "Asian staple grain" },
        { answer: "SOUP", hint: "Liquid food in a bowl" },
        { answer: "CAKE", hint: "Birthday dessert" },
        { answer: "FISH", hint: "Seafood protein" },
      
        { answer: "CORN", hint: "Yellow vegetable on cob" },
        { answer: "MILK", hint: "White dairy drink" },
        { answer: "NUTS", hint: "Crunchy tree snacks" },
        { answer: "PEAR", hint: "Green bell-shaped fruit" },
      
        { answer: "SALT", hint: "White seasoning" },
        { answer: "PLUM", hint: "Small purple fruit" },
        { answer: "STEW", hint: "Slow-cooked pot meal" },
        { answer: "LIME", hint: "Small green citrus" },
        { answer: "HERB", hint: "Cooking plant" },
        { answer: "BEAN", hint: "Pod vegetable" },
        { answer: "LAMB", hint: "Young sheep meat" },
        { answer: "LOAF", hint: "Shape of bread" },
        { answer: "WRAP", hint: "Tortilla roll meal" },
        { answer: "TACO", hint: "Mexican folded shell" },
        { answer: "PORK", hint: "Pig meat" },
        { answer: "BEET", hint: "Red root vegetable" },
      ],
      medium: [
        { answer: "BUTTER", hint: "Dairy spread" },
        { answer: "PEPPER", hint: "Spicy seasoning" },
        { answer: "PASTRY", hint: "Baked dough treat" },
        { answer: "GINGER", hint: "Spicy root" },
      
        { answer: "CHEESE", hint: "Dairy solid" },
        { answer: "GARLIC", hint: "Pungent cooking bulb" },
        { answer: "WAFFLE", hint: "Grid-patterned breakfast" },
        { answer: "COFFEE", hint: "Caffeinated drink" },
      
        { answer: "MUFFIN", hint: "Small baked cake" },
        { answer: "RAISIN", hint: "Dried grape" },
        { answer: "NOODLE", hint: "Asian pasta" },
        { answer: "YOGURT", hint: "Fermented milk" },
        { answer: "PICKLE", hint: "Brined cucumber" },
        { answer: "ALMOND", hint: "Tree nut" },
        { answer: "LENTIL", hint: "Small pulse legume" },
        { answer: "RADISH", hint: "Spicy red root" },
        { answer: "FONDUE", hint: "Melted cheese dish" },
        { answer: "SORBET", hint: "Frozen fruit dessert" },
        { answer: "QUINOA", hint: "Protein-rich grain" },
        { answer: "WASABI", hint: "Japanese hot paste" },
      ],
      hard: [
        { answer: "CINNAMON", hint: "Sweet brown spice" },
        { answer: "TURMERIC", hint: "Yellow Indian spice" },
        { answer: "MARINARA", hint: "Italian tomato sauce" },
        { answer: "SOURDOUGH", hint: "Fermented bread" },
      
        { answer: "AVOCADO", hint: "Green creamy fruit" },
        { answer: "SAFFRON", hint: "Most expensive spice" },
        { answer: "BRIOCHE", hint: "Rich French bread" },
        { answer: "CARDAMOM", hint: "Aromatic Indian spice" },
      
        { answer: "FOCACCIA", hint: "Italian flatbread" },
        { answer: "PROSCIUTTO", hint: "Italian cured ham" },
        { answer: "MERINGUE", hint: "Whipped egg white dessert" },
        { answer: "ARUGULA", hint: "Peppery salad leaf" },
        { answer: "TIRAMISU", hint: "Italian coffee dessert" },
        { answer: "CHORIZO", hint: "Spicy Spanish sausage" },
        { answer: "GAZPACHO", hint: "Cold Spanish soup" },
        { answer: "CROISSANT", hint: "French crescent pastry" },
        { answer: "GNOCCHI", hint: "Italian potato dumpling" },
        { answer: "BAGUETTE", hint: "Long French bread" },
        { answer: "RICOTTA", hint: "Italian soft cheese" },
        { answer: "KOMBUCHA", hint: "Fermented tea drink" },
      ],
    }},
];
const BOT_NAMES = ["N3bulaX", "CyberPh4ntom", "Gl1tchWolf", "NeonSh4dow", "Pix3lStorm", "V0idRaider", "ByteHunt3r", "D4rkPulse"];
const MATH_GAME_TYPES = [
  { id: "addsub", name: "ADD & SUBTRACT", icon: "➕", color: "#6ee7b7", desc: "Addition & subtraction",
    levels: [
      { diff: "easy", coins: 400, time: 75, label: "Small numbers (1-50)" },
      { diff: "medium", coins: 1000, time: 55, label: "Medium numbers (10-200)" },
      { diff: "hard", coins: 2000, time: 40, label: "Large numbers (100-999)" },
    ]},
  { id: "muldiv", name: "MULTIPLY & DIVIDE", icon: "✖️", color: "#60a5fa", desc: "Multiplication & division",
    levels: [
      { diff: "easy", coins: 800, time: 70, label: "Single digits (2-9)" },
      { diff: "medium", coins: 1800, time: 50, label: "Double digits (5-25)" },
      { diff: "hard", coins: 3200, time: 35, label: "Large factors (10-50)" },
    ]},
  { id: "bodmas", name: "BODMAS", icon: "🔢", color: "#f0f", desc: "Order of operations",
    levels: [
      { diff: "easy", coins: 1200, time: 65, label: "2 operations, small numbers" },
      { diff: "medium", coins: 2600, time: 45, label: "3 operations, brackets" },
      { diff: "hard", coins: 4400, time: 30, label: "Nested brackets, 4 ops" },
    ]},
  { id: "fractions", name: "FRACTIONS", icon: "⅓", color: "#fbbf24", desc: "Fractions & decimals",
    levels: [
      { diff: "easy", coins: 1600, time: 70, label: "Simple halves & quarters" },
      { diff: "medium", coins: 3400, time: 50, label: "Mixed fractions & decimals" },
      { diff: "hard", coins: 5600, time: 35, label: "Complex decimal operations" },
    ]},
  { id: "algebra", name: "ALGEBRA", icon: "𝑥", color: "#c084fc", desc: "Solve for x",
    levels: [
      { diff: "easy", coins: 2000, time: 75, label: "Simple linear (ax + b = c)" },
      { diff: "medium", coins: 4000, time: 55, label: "Two-step & both sides" },
      { diff: "hard", coins: 7200, time: 35, label: "Quadratics & multi-var" },
    ]},
  { id: "speed", name: "SPEED MATH", icon: "⚡", color: "#ef4444", desc: "Big number mental math",
    levels: [
      { diff: "easy", coins: 2800, time: 65, label: "3-digit operations" },
      { diff: "medium", coins: 6000, time: 45, label: "4-digit mixed ops" },
      { diff: "hard", coins: 10000, time: 30, label: "Extreme mental math" },
    ]},
];
function generateMathChoices(answer) {
  const wrong = new Set();
  while (wrong.size < 3) {
    const offset = Math.floor(Math.random() * Math.max(10, Math.abs(answer))) + 1;
    const w = answer + (Math.random() > 0.5 ? offset : -offset);
    if (w !== answer && !wrong.has(w)) wrong.add(w);
  }
  const choices = [answer, ...wrong].sort(() => Math.random() - 0.5);
  return { choices, correctIndex: choices.indexOf(answer) };
}
function generateTypedProblem(type, diff) {
  let question, answer;
  const d = diff || "medium";
  switch (type) {
    case "addsub": {
      const range = d === "easy" ? [1,50] : d === "medium" ? [10,200] : [100,999];
      const a = Math.floor(Math.random() * (range[1]-range[0])) + range[0];
      const b = Math.floor(Math.random() * (range[1]-range[0])) + range[0];
      if (Math.random() > 0.5) { question = `${a} + ${b}`; answer = a + b; }
      else { const big = Math.max(a, b); const sm = Math.min(a, b); question = `${big} - ${sm}`; answer = big - sm; }
      break;
    }
    case "muldiv": {
      const mRange = d === "easy" ? [2,9] : d === "medium" ? [5,25] : [10,50];
      if (Math.random() > 0.4) {
        const a = Math.floor(Math.random()*(mRange[1]-mRange[0]))+mRange[0];
        const b = Math.floor(Math.random()*(mRange[1]-mRange[0]))+mRange[0];
        question = `${a} × ${b}`; answer = a * b;
      } else {
        const b = Math.floor(Math.random()*(mRange[1]-mRange[0]))+mRange[0];
        const ans = Math.floor(Math.random()*(mRange[1]-mRange[0]))+mRange[0];
        question = `${b * ans} ÷ ${b}`; answer = ans;
      }
      break;
    }
    case "bodmas": {
      const r = d === "easy" ? 10 : d === "medium" ? 20 : 30;
      const easyT = [
        () => { const a=Math.floor(Math.random()*r)+2,b=Math.floor(Math.random()*r)+2,c=Math.floor(Math.random()*8)+2; return { q:`${a} + ${b} × ${c}`, a:a+b*c }; },
        () => { const a=Math.floor(Math.random()*r)+2,b=Math.floor(Math.random()*r)+2,c=Math.floor(Math.random()*8)+2; return { q:`${a} × ${b} - ${c}`, a:a*b-c }; },
      ];
      const medT = [
        ...easyT,
        () => { const a=Math.floor(Math.random()*r)+2,b=Math.floor(Math.random()*r)+2,c=Math.floor(Math.random()*r)+2; return { q:`(${a} + ${b}) × ${c}`, a:(a+b)*c }; },
        () => { const a=Math.floor(Math.random()*r)+2,b=Math.floor(Math.random()*10)+2,c=Math.floor(Math.random()*10)+1; return { q:`${a} × ${b} + ${c} × ${a}`, a:a*b+c*a }; },
      ];
      const hardT = [
        ...medT,
        () => { const a=Math.floor(Math.random()*r)+2,b=Math.floor(Math.random()*r)+2,c=Math.floor(Math.random()*10)+2,e=Math.floor(Math.random()*10)+1; return { q:`(${a} + ${b}) × (${c} - ${e})`, a:(a+b)*(c-e>0?c-e:e-c) }; },
        () => { const a=Math.floor(Math.random()*15)+2,b=Math.floor(Math.random()*10)+2,c=Math.floor(Math.random()*10)+2,e=Math.floor(Math.random()*5)+1; return { q:`${a} × ${b} - ${c} × ${e} + ${a}`, a:a*b-c*e+a }; },
      ];
      const templates = d === "easy" ? easyT : d === "medium" ? medT : hardT;
      const t = templates[Math.floor(Math.random()*templates.length)]();
      question = t.q; answer = t.a; break;
    }
    case "fractions": {
      if (d === "easy") {
        const pairs = [[1,2,1,2],[1,4,1,4],[1,2,1,4],[1,4,3,4]];
        const [n1,d1,n2,d2] = pairs[Math.floor(Math.random()*pairs.length)];
        question = `${n1}/${d1} + ${n2}/${d2}`; answer = Math.round((n1/d1+n2/d2)*100)/100;
      } else if (d === "medium") {
        const templates = [
          () => { const pairs=[[1,3,1,6],[2,3,1,3],[3,4,1,4],[2,5,3,5],[1,2,1,3]]; const [n1,d1,n2,d2]=pairs[Math.floor(Math.random()*pairs.length)]; return { q:`${n1}/${d1} + ${n2}/${d2}`, a:Math.round((n1/d1+n2/d2)*100)/100 }; },
          () => { const a=(Math.floor(Math.random()*5)+1)*0.5; const b=Math.floor(Math.random()*15)+2; return { q:`${a} × ${b}`, a:a*b }; },
        ];
        const t = templates[Math.floor(Math.random()*templates.length)]();
        question = t.q; answer = t.a;
      } else {
        const templates = [
          () => { const a=(Math.floor(Math.random()*30)+1)*0.05; const b=Math.floor(Math.random()*50)+20; return { q:`${a.toFixed(2)} × ${b}`, a:Math.round(a*b*100)/100 }; },
          () => { const a=Math.floor(Math.random()*8)+2; const b=Math.floor(Math.random()*8)+2; const c=Math.floor(Math.random()*8)+2; const d1=Math.floor(Math.random()*8)+2; return { q:`${a}/${b} + ${c}/${d1}`, a:Math.round((a/b+c/d1)*100)/100 }; },
          () => { const a=(Math.floor(Math.random()*20)+5)*0.1; const b=(Math.floor(Math.random()*20)+5)*0.1; return { q:`${a.toFixed(1)} + ${b.toFixed(1)}`, a:Math.round((a+b)*100)/100 }; },
        ];
        const t = templates[Math.floor(Math.random()*templates.length)]();
        question = t.q; answer = t.a;
      }
      break;
    }
    case "algebra": {
      if (d === "easy") {
        const x=Math.floor(Math.random()*10)+1,a=Math.floor(Math.random()*5)+2,b=Math.floor(Math.random()*15)+1;
        question = `Solve: ${a}x + ${b} = ${a*x+b}`; answer = x;
      } else if (d === "medium") {
        const templates = [
          () => { const x=Math.floor(Math.random()*12)+1,a=Math.floor(Math.random()*6)+2,b=Math.floor(Math.random()*10)+1; return { q:`${a}x - ${b} = ${a*x-b}`, a:x }; },
          () => { const x=Math.floor(Math.random()*10)+2,a=Math.floor(Math.random()*5)+2,b=Math.floor(Math.random()*5)+1,c=Math.floor(Math.random()*Math.max(a-1,1))+1; return { q:`${a}x + ${b} = ${c}x + ${b+(a-c)*x}`, a:x }; },
        ];
        const t = templates[Math.floor(Math.random()*templates.length)]();
        question = `Solve: ${t.q}`; answer = t.a;
      } else {
        const templates = [
          () => { const x=Math.floor(Math.random()*8)+2; return { q:`x² = ${x*x}  (x > 0)`, a:x }; },
          () => { const x=Math.floor(Math.random()*6)+2,a=Math.floor(Math.random()*5)+2,b=Math.floor(Math.random()*8)+3,c=Math.floor(Math.random()*3)+1; return { q:`${a}(x + ${c}) = ${a*(x+c)}`, a:x }; },
          () => { const x=Math.floor(Math.random()*10)+1,a=Math.floor(Math.random()*8)+2,b=Math.floor(Math.random()*8)+2,c=Math.floor(Math.random()*5)+1; return { q:`${a}x + ${b}x - ${c} = ${(a+b)*x-c}`, a:x }; },
        ];
        const t = templates[Math.floor(Math.random()*templates.length)]();
        question = `Solve: ${t.q}`; answer = t.a;
      }
      break;
    }
    case "speed": {
      if (d === "easy") {
        const templates = [
          () => { const a=Math.floor(Math.random()*900)+100,b=Math.floor(Math.random()*900)+100; return { q:`${a} + ${b}`, a:a+b }; },
          () => { const a=Math.floor(Math.random()*900)+200,b=Math.floor(Math.random()*Math.min(a,500))+50; return { q:`${a} - ${b}`, a:a-b }; },
        ];
        const t = templates[Math.floor(Math.random()*templates.length)]();
        question = t.q; answer = t.a;
      } else if (d === "medium") {
        const templates = [
          () => { const a=Math.floor(Math.random()*9000)+1000,b=Math.floor(Math.random()*9000)+1000; return { q:`${a} + ${b}`, a:a+b }; },
          () => { const a=Math.floor(Math.random()*90)+11,b=Math.floor(Math.random()*90)+11; return { q:`${a} × ${b}`, a:a*b }; },
          () => { const b=Math.floor(Math.random()*30)+5,ans=Math.floor(Math.random()*40)+10; return { q:`${b*ans} ÷ ${b}`, a:ans }; },
        ];
        const t = templates[Math.floor(Math.random()*templates.length)]();
        question = t.q; answer = t.a;
      } else {
        const templates = [
          () => { const a=Math.floor(Math.random()*900)+100,b=Math.floor(Math.random()*900)+100; return { q:`${a} × ${b}`, a:a*b }; },
          () => { const a=Math.floor(Math.random()*9000)+1000,b=Math.floor(Math.random()*9000)+1000,c=Math.floor(Math.random()*900)+100; return { q:`${a} + ${b} - ${c}`, a:a+b-c }; },
          () => { const b=Math.floor(Math.random()*90)+10,ans=Math.floor(Math.random()*90)+10; return { q:`${b*ans} ÷ ${b}`, a:ans }; },
        ];
        const t = templates[Math.floor(Math.random()*templates.length)]();
        question = t.q; answer = t.a;
      }
      break;
    }
    default: { question = "1 + 1"; answer = 2; }
  }
  const { choices, correctIndex } = generateMathChoices(answer);
  return { question, answer, choices, correctIndex };
}
const NeonText = ({ children, color = "#0ff", size = "1.1rem", glow = true, style = {} }) => (
  <span style={{ color, fontSize: size, fontWeight: 600, textShadow: glow ? `0 0 10px ${color}, 0 0 20px ${color}40, 0 0 40px ${color}20` : "none", ...style, }}>{children}</span>
);
const GlowButton = ({ children, onClick, color = "#0ff", disabled = false, style = {} }) => (
  <button disabled={disabled} onClick={onClick} style={{
    background: disabled ? "#1a1a2e" : `linear-gradient(135deg, ${color}15, ${color}30)`,
    border: `1px solid ${disabled ? "#333" : color}`,
    color: disabled ? "#555" : color, padding: "12px 24px", borderRadius: "8px",
    fontSize: "0.85rem", cursor: disabled ? "not-allowed" : "pointer",
    textShadow: disabled ? "none" : `0 0 10px ${color}`,
    boxShadow: disabled ? "none" : `0 0 15px ${color}20, inset 0 0 15px ${color}10`,
    transition: "all 0.3s ease", letterSpacing: "1px", ...style,
  }}>{children}</button>
);
const Panel = ({ children, style = {}, ...rest }) => (
  <div {...rest} style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0d1117 100%)", border: "1px solid #1a1a3e", borderRadius: "12px", padding: "24px", ...style, }}>{children}</div>
);
const HealthBar = ({ current, max, color = "#0f0", label }) => (
  <div style={{ width: "100%" }}>
    {label && <div style={{ fontSize: "0.85rem", color: "#888", marginBottom: 4 }}>{label}</div>}
    <div style={{ background: "#111", borderRadius: 6, height: 20, overflow: "hidden", border: "1px solid #222" }}>
      <div style={{ width: `${Math.max(0, (current / max) * 100)}%`, height: "100%", background: `linear-gradient(90deg, ${color}, ${color}aa)`, boxShadow: `0 0 10px ${color}60`, transition: "width 0.5s ease", borderRadius: 6, }} />
    </div>
    <div style={{ fontSize: "0.9rem", color, textAlign: "right", marginTop: 2 }}>
      {current}/{max}
    </div>
  </div>
);
function MathGame({ onComplete }) {
  const [phase, setPhase] = useState("select"); // select, difficulty, playing, result
  const [gameType, setGameType] = useState(null);
  const [gameDiff, setGameDiff] = useState(null);
  const [problems, setProblems] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [allCorrect, setAllCorrect] = useState(true);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const totalRounds = 5;
  const DIFF_COLORS = { easy: "#6ee7b7", medium: "#fbbf24", hard: "#ef4444" };
  const selectType = (type) => {
    setGameType(type);
    setPhase("difficulty");
  };
  const startGame = (level) => {
    setGameDiff(level);
    const probs = Array.from({ length: totalRounds }, () => generateTypedProblem(gameType.id, level.diff));
    setProblems(probs);
    setCurrent(0);
    setSelected(null);
    setAllCorrect(true);
    setCorrectCount(0);
    setTimeLeft(level.time);
    setPhase("playing");
  };
  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) {
      setResult({ earned: 0, correctCount, reason: "Time's up!" });
      setPhase("result");
      return;
    }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase]);
  const pick = (idx) => {
    if (selected !== null || phase !== "playing") return;
    setSelected(idx);
    const isCorrect = idx === problems[current].correctIndex;
    const newCorrectCount = isCorrect ? correctCount + 1 : correctCount;
    const newAllCorrect = allCorrect && isCorrect;
    if (isCorrect) setCorrectCount(c => c + 1);
    if (!isCorrect) setAllCorrect(false);
    setTimeout(() => {
      if (current >= totalRounds - 1) {
        const earned = newAllCorrect ? gameDiff.coins : 0;
        setResult({
          earned,
          correctCount: newCorrectCount,
          reason: newAllCorrect ? "PERFECT! All correct!" : `Missed ${totalRounds - newCorrectCount}/${totalRounds} — no payout`,
        });
        setPhase("result");
        return;
      }
      setCurrent(c => c + 1);
      setSelected(null);
    }, 1000);
  };
  if (phase === "select") {
    return (
      <div>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <NeonText size="1rem" color="#0ff">SELECT CHALLENGE TYPE</NeonText>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: 4 }}>Pick a category, then choose your difficulty!</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MATH_GAME_TYPES.map(t => (
            <div key={t.id} onClick={() => selectType(t)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "linear-gradient(135deg, #0a0a1a, #0d1117)", border: `1px solid ${t.color}25`, borderRadius: 10, cursor: "pointer", }}>
              <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: `${t.color}15`, borderRadius: 8, border: `1px solid ${t.color}40`, fontSize: "1.3rem", }}>{t.icon}</div>
              <div style={{ flex: 1 }}>
                <NeonText size="0.8rem" color={t.color}>{t.name}</NeonText>
                <div style={{ color: "#555", fontSize: "0.85rem", marginTop: 2 }}>{t.desc}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <NeonText size="0.75rem" color="#fbbf24" glow={false}>💰 {t.levels[0].coins}–{t.levels[2].coins}</NeonText>
                <div style={{ color: "#555", fontSize: "0.75rem" }}>3 levels</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (phase === "difficulty") {
    return (
      <div>
        <button onClick={() => { setGameType(null); setPhase("select"); }} style={{ background: "none", border: "1px solid #333", color: "#888", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: "0.85rem", marginBottom: 16, }}>← BACK</button>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: "2rem", marginBottom: 8 }}>{gameType.icon}</div>
          <NeonText size="1.1rem" color={gameType.color}>{gameType.name}</NeonText>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: 4 }}>Choose difficulty — all-or-nothing!</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {gameType.levels.map((level) => (
            <div key={level.diff} onClick={() => startGame(level)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px", background: "linear-gradient(135deg, #0a0a1a, #0d1117)", border: `1px solid ${DIFF_COLORS[level.diff]}30`, borderRadius: 10, cursor: "pointer", }}>
              <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", background: `${DIFF_COLORS[level.diff]}10`, borderRadius: 8, border: `1px solid ${DIFF_COLORS[level.diff]}40`, }}>
                <NeonText size="0.7rem" color={DIFF_COLORS[level.diff]} glow={false}>
                  {level.diff === "easy" ? "E" : level.diff === "medium" ? "M" : "H"}
                </NeonText>
              </div>
              <div style={{ flex: 1 }}>
                <NeonText size="0.85rem" color={DIFF_COLORS[level.diff]}>
                  {level.diff.toUpperCase()}
                </NeonText>
                <div style={{ color: "#666", fontSize: "0.85rem", marginTop: 2 }}>{level.label}</div>
                <div style={{ color: "#555", fontSize: "0.8rem", marginTop: 2 }}>⏱ {level.time}s time limit</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <NeonText size="1rem" color="#fbbf24" glow={false}>💰 {level.coins}</NeonText>
                <div style={{ color: "#555", fontSize: "0.75rem" }}>all-or-nothing</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (phase === "result") {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{result.earned > 0 ? "🎉" : "💀"}</div>
        <NeonText size="1.5rem" color={result.earned > 0 ? "#0f0" : "#f44"}>
          {result.earned > 0 ? "PERFECT RUN!" : "FAILED"}
        </NeonText>
        <div style={{ color: "#666", fontSize: "0.9rem", marginTop: 4 }}>
          {gameType.name} • {gameDiff.diff.toUpperCase()}
        </div>
        <div style={{ color: "#888", fontSize: "0.85rem", margin: "8px 0 4px" }}>
          {result.reason}
        </div>
        <div style={{ margin: "16px 0" }}>
          <NeonText size="1.3rem" color="#fbbf24">
            {result.earned > 0 ? `+${result.earned} coins!` : "+0 coins"}
          </NeonText>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", margin: "12px 0" }}>
          {problems.map((_, i) => (
            <div key={i} style={{
              width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.8rem", fontWeight: 700,
              background: i < result.correctCount ? "#00ff0011" : "#ff444411",
              border: `1px solid ${i < result.correctCount ? "#0f0" : "#f44"}`,
              color: i < result.correctCount ? "#0f0" : "#f44",
            }}>{i < result.correctCount ? "✓" : "✗"}</div>
          ))}
        </div>
        <GlowButton onClick={() => onComplete(result.earned)} color={result.earned > 0 ? "#0f0" : "#f0f"}>
          COLLECT & EXIT
        </GlowButton>
      </div>
    );
  }
  const prob = problems[current];
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div>
          <NeonText color={gameType.color} size="0.7rem">{gameType.icon} {gameType.name}</NeonText>
          <span style={{ color: DIFF_COLORS[gameDiff.diff], fontSize: "0.75rem", marginLeft: 8 }}>
            {gameDiff.diff.toUpperCase()}
          </span>
        </div>
        <NeonText color={timeLeft < 10 ? "#f44" : "#0ff"} size="0.8rem">⏱ {timeLeft}s</NeonText>
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 20 }}>
        {problems.map((_, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: i < current ? (i < correctCount ? "#0f0" : "#f44") : i === current ? gameType.color : "#222", border: `1px solid ${i === current ? gameType.color : "#333"}`, boxShadow: i === current ? `0 0 8px ${gameType.color}60` : "none", }} />
        ))}
      </div>
      <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: 6 }}>ROUND {current + 1} OF {totalRounds}</div>
      <div style={{ margin: "16px 0 24px", padding: "20px", background: "#05050f", borderRadius: 10, border: "1px solid #1a1a3e", }}>
        <NeonText size="1.8rem" color="#fff">{prob.question} = ?</NeonText>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxWidth: 400, margin: "0 auto" }}>
        {prob.choices.map((choice, i) => {
          let bg = "linear-gradient(135deg, #0a0a2a, #111)";
          let border = "#1a1a4e";
          let textColor = "#ddd";
          if (selected !== null) {
            if (i === prob.correctIndex) { bg = "linear-gradient(135deg, #0f020, #0a2a0a)"; border = "#0f0"; textColor = "#0f0"; }
            else if (i === selected) { bg = "linear-gradient(135deg, #2a0a0a, #1a0a0a)"; border = "#f44"; textColor = "#f44"; }
          }
          return (
            <button key={i} onClick={() => pick(i)} style={{
              background: bg, border: `1px solid ${border}`, color: textColor,
              padding: "16px 8px", borderRadius: 8, fontSize: "1.1rem",
              cursor: selected !== null ? "default" : "pointer",
              fontWeight: selected !== null && i === prob.correctIndex ? 700 : 400,
            }}>
              {typeof choice === "number" ? (Number.isInteger(choice) ? choice : choice.toFixed(2)) : choice}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <NeonText color="#fbbf24" size="0.8rem" glow={false}>💰 {gameDiff.coins} (all-or-nothing)</NeonText>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: allCorrect ? "#0f0" : "#f44" }} />
          <span style={{ color: allCorrect ? "#0f0" : "#f44", fontSize: "0.9rem" }}>
            {allCorrect ? "PERFECT" : "STREAK BROKEN"}
          </span>
        </div>
      </div>
    </div>
  );
}
function TriviaGame({ onComplete }) {
  const [phase, setPhase] = useState("select");
  const [category, setCategory] = useState(null);
  const [gameDiff, setGameDiff] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [allCorrect, setAllCorrect] = useState(true);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const totalRounds = 5;
  const usedQuestions = useRef({});
  const DIFF_COLORS = { easy: "#6ee7b7", medium: "#fbbf24", hard: "#ef4444" };
  const selectCategory = (cat) => { setCategory(cat); setPhase("difficulty"); };
  const startGame = (level) => {
    setGameDiff(level);
    const pool = category.questions[level.diff];
    const key = `${category.id}_${level.diff}`;
    if (!usedQuestions.current[key]) usedQuestions.current[key] = [];
    let available = pool.filter((_, i) => !usedQuestions.current[key].includes(i));
    if (available.length < totalRounds) {
      usedQuestions.current[key] = [];
      available = [...pool];
    }
    const shuffled = available.sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, totalRounds);
    picked.forEach(q => {
      const idx = pool.indexOf(q);
      if (idx >= 0) usedQuestions.current[key].push(idx);
    });
    setQuestions(picked);
    setCurrent(0); setSelected(null); setAllCorrect(true); setCorrectCount(0);
    setTimeLeft(level.time);
    setPhase("playing");
  };
  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) { setResult({ earned: 0, correctCount, reason: "Time's up!" }); setPhase("result"); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase]);
  const pick = (idx) => {
    if (selected !== null || phase !== "playing") return;
    setSelected(idx);
    const isCorrect = idx === questions[current].answer;
    const newCorrectCount = isCorrect ? correctCount + 1 : correctCount;
    const newAllCorrect = allCorrect && isCorrect;
    if (isCorrect) setCorrectCount(c => c + 1);
    if (!isCorrect) setAllCorrect(false);
    setTimeout(() => {
      if (current >= totalRounds - 1) {
        const earned = newAllCorrect ? gameDiff.coins : 0;
        setResult({ earned, correctCount: newCorrectCount, reason: newAllCorrect ? "PERFECT! All correct!" : `Missed ${totalRounds - newCorrectCount}/${totalRounds} — no payout` });
        setPhase("result");
        return;
      }
      setCurrent(c => c + 1); setSelected(null);
    }, 1000);
  };
  if (phase === "select") {
    return (
      <div>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <NeonText size="1rem" color="#f0f">SELECT TRIVIA CATEGORY</NeonText>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: 4 }}>Pick a topic, then choose difficulty!</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {TRIVIA_CATEGORIES.map(c => (
            <div key={c.id} onClick={() => selectCategory(c)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "linear-gradient(135deg, #0a0a1a, #0d1117)", border: `1px solid ${c.color}25`, borderRadius: 10, cursor: "pointer", }}>
              <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: `${c.color}15`, borderRadius: 8, border: `1px solid ${c.color}40`, fontSize: "1.3rem", }}>{c.icon}</div>
              <div style={{ flex: 1 }}>
                <NeonText size="0.8rem" color={c.color}>{c.name}</NeonText>
                <div style={{ color: "#555", fontSize: "0.85rem", marginTop: 2 }}>{c.desc}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <NeonText size="0.75rem" color="#fbbf24" glow={false}>💰 {c.levels[0].coins}–{c.levels[2].coins}</NeonText>
                <div style={{ color: "#555", fontSize: "0.75rem" }}>3 levels</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (phase === "difficulty") {
    return (
      <div>
        <button onClick={() => { setCategory(null); setPhase("select"); }} style={{ background: "none", border: "1px solid #333", color: "#888", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: "0.85rem", marginBottom: 16, }}>← BACK</button>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: "2rem", marginBottom: 8 }}>{category.icon}</div>
          <NeonText size="1.1rem" color={category.color}>{category.name}</NeonText>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: 4 }}>All-or-nothing — answer all 5 correctly!</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {category.levels.map(level => (
            <div key={level.diff} onClick={() => startGame(level)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px", background: "linear-gradient(135deg, #0a0a1a, #0d1117)", border: `1px solid ${DIFF_COLORS[level.diff]}30`, borderRadius: 10, cursor: "pointer", }}>
              <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", background: `${DIFF_COLORS[level.diff]}10`, borderRadius: 8, border: `1px solid ${DIFF_COLORS[level.diff]}40`, }}>
                <NeonText size="0.7rem" color={DIFF_COLORS[level.diff]} glow={false}>
                  {level.diff === "easy" ? "E" : level.diff === "medium" ? "M" : "H"}
                </NeonText>
              </div>
              <div style={{ flex: 1 }}>
                <NeonText size="0.85rem" color={DIFF_COLORS[level.diff]}>{level.diff.toUpperCase()}</NeonText>
                <div style={{ color: "#555", fontSize: "0.8rem", marginTop: 2 }}>⏱ {level.time}s time limit</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <NeonText size="1rem" color="#fbbf24" glow={false}>💰 {level.coins}</NeonText>
                <div style={{ color: "#555", fontSize: "0.75rem" }}>all-or-nothing</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (phase === "result") {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{result.earned > 0 ? "🎉" : "💀"}</div>
        <NeonText size="1.5rem" color={result.earned > 0 ? "#0f0" : "#f44"}>
          {result.earned > 0 ? "PERFECT RUN!" : "FAILED"}
        </NeonText>
        <div style={{ color: "#666", fontSize: "0.9rem", marginTop: 4 }}>
          {category.name} • {gameDiff.diff.toUpperCase()}
        </div>
        <div style={{ color: "#888", fontSize: "0.85rem", margin: "8px 0 4px" }}>{result.reason}</div>
        <div style={{ margin: "16px 0" }}>
          <NeonText size="1.3rem" color="#fbbf24">{result.earned > 0 ? `+${result.earned} coins!` : "+0 coins"}</NeonText>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", margin: "12px 0" }}>
          {questions.map((_, i) => (
            <div key={i} style={{
              width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.8rem", fontWeight: 700,
              background: i < result.correctCount ? "#00ff0011" : "#ff444411",
              border: `1px solid ${i < result.correctCount ? "#0f0" : "#f44"}`,
              color: i < result.correctCount ? "#0f0" : "#f44",
            }}>{i < result.correctCount ? "✓" : "✗"}</div>
          ))}
        </div>
        <GlowButton onClick={() => onComplete(result.earned)} color={result.earned > 0 ? "#0f0" : "#f0f"}>COLLECT & EXIT</GlowButton>
      </div>
    );
  }
  const q = questions[current];
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div>
          <NeonText color={category.color} size="0.7rem">{category.icon} {category.name}</NeonText>
          <span style={{ color: DIFF_COLORS[gameDiff.diff], fontSize: "0.75rem", marginLeft: 8 }}>
            {gameDiff.diff.toUpperCase()}
          </span>
        </div>
        <NeonText color={timeLeft < 10 ? "#f44" : "#0ff"} size="0.8rem">⏱ {timeLeft}s</NeonText>
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 20 }}>
        {questions.map((_, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: i < current ? (i < correctCount ? "#0f0" : "#f44") : i === current ? category.color : "#222", border: `1px solid ${i === current ? category.color : "#333"}`, boxShadow: i === current ? `0 0 8px ${category.color}60` : "none", }} />
        ))}
      </div>
      <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: 6 }}>QUESTION {current + 1} OF {totalRounds}</div>
      <div style={{ margin: "16px 0 24px", padding: "20px", background: "#05050f", borderRadius: 10, border: "1px solid #1a1a3e", minHeight: 60 }}>
        <NeonText size="1.15rem" color="#fff">{q.q}</NeonText>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxWidth: 450, margin: "0 auto" }}>
        {q.options.map((opt, i) => {
          let bg = "linear-gradient(135deg, #0a0a2a, #111)";
          let border = "#1a1a4e";
          let textColor = "#ddd";
          if (selected !== null) {
            if (i === q.answer) { bg = "linear-gradient(135deg, #0f020, #0a2a0a)"; border = "#0f0"; textColor = "#0f0"; }
            else if (i === selected) { bg = "linear-gradient(135deg, #2a0a0a, #1a0a0a)"; border = "#f44"; textColor = "#f44"; }
          }
          return (
            <button key={i} onClick={() => pick(i)} style={{ background: bg, border: `1px solid ${border}`, color: textColor, padding: "14px 10px", borderRadius: 8, fontSize: "0.9rem", cursor: selected !== null ? "default" : "pointer", fontWeight: selected !== null && i === q.answer ? 700 : 400, }}>{opt}</button>
          );
        })}
      </div>
      <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <NeonText color="#fbbf24" size="0.8rem" glow={false}>💰 {gameDiff.coins} (all-or-nothing)</NeonText>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: allCorrect ? "#0f0" : "#f44" }} />
          <span style={{ color: allCorrect ? "#0f0" : "#f44", fontSize: "0.9rem" }}>
            {allCorrect ? "PERFECT" : "STREAK BROKEN"}
          </span>
        </div>
      </div>
    </div>
  );
}
const MEMORY_CATEGORIES = [
  { id: "emoji", name: "EMOJI PAIRS", icon: "😎", color: "#fbbf24", desc: "Faces & objects",
    levels: [
      { diff: "easy", coins: 800, time: 20, grid: 12 },
      { diff: "medium", coins: 2000, time: 15, grid: 16 },
      { diff: "hard", coins: 4400, time: 10, grid: 24 },
    ],
    symbols: { easy: ["😀", "😎", "🥳", "😱", "🤖", "👻"], medium: ["😀", "😎", "🥳", "😱", "🤖", "👻", "🎭", "💀"], hard: ["😀", "😎", "🥳", "😱", "🤖", "👻", "🎭", "💀", "🤡", "😈", "🥶", "🫠"] }
  },
  { id: "space", name: "SPACE SYMBOLS", icon: "🚀", color: "#60a5fa", desc: "Planets & rockets",
    levels: [
      { diff: "easy", coins: 800, time: 20, grid: 12 },
      { diff: "medium", coins: 2000, time: 15, grid: 16 },
      { diff: "hard", coins: 4400, time: 10, grid: 24 },
    ],
    symbols: { easy: ["🚀", "🌍", "⭐", "🌙", "☄️", "🛸"], medium: ["🚀", "🌍", "⭐", "🌙", "☄️", "🛸", "🪐", "🌌"], hard: ["🚀", "🌍", "⭐", "🌙", "☄️", "🛸", "🪐", "🌌", "🌕", "🔭", "🌠", "🛰️"] }
  },
  { id: "animals", name: "ANIMAL PAIRS", icon: "🐾", color: "#6ee7b7", desc: "Wildlife matching",
    levels: [
      { diff: "easy", coins: 800, time: 20, grid: 12 },
      { diff: "medium", coins: 2000, time: 15, grid: 16 },
      { diff: "hard", coins: 4400, time: 10, grid: 24 },
    ],
    symbols: { easy: ["🐶", "🐱", "🐻", "🦊", "🐸", "🦁"], medium: ["🐶", "🐱", "🐻", "🦊", "🐸", "🦁", "🐺", "🦅"], hard: ["🐶", "🐱", "🐻", "🦊", "🐸", "🦁", "🐺", "🦅", "🦈", "🐙", "🦋", "🐢"] }
  },
  { id: "numbers", name: "NUMBERS & MATH", icon: "🔢", color: "#c084fc", desc: "Numeric matching",
    levels: [
      { diff: "easy", coins: 1000, time: 20, grid: 12 },
      { diff: "medium", coins: 2400, time: 15, grid: 16 },
      { diff: "hard", coins: 5200, time: 10, grid: 24 },
    ],
    symbols: { easy: ["π", "∞", "∑", "√", "Δ", "Ω"], medium: ["π", "∞", "∑", "√", "Δ", "Ω", "∫", "λ"], hard: ["π", "∞", "∑", "√", "Δ", "Ω", "∫", "λ", "θ", "φ", "ε", "σ"] }
  },
  { id: "shapes", name: "COLORS & SHAPES", icon: "🔷", color: "#0ff", desc: "Geometric matching",
    levels: [
      { diff: "easy", coins: 800, time: 20, grid: 12 },
      { diff: "medium", coins: 2000, time: 15, grid: 16 },
      { diff: "hard", coins: 4400, time: 10, grid: 24 },
    ],
    symbols: { easy: ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠"], medium: ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠", "⬛", "🔶"], hard: ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠", "⬛", "🔶", "🔷", "⬜", "🟤", "💠"] }
  },
  { id: "flags", name: "FLAGS & COUNTRIES", icon: "🏳️", color: "#ef4444", desc: "National flag pairs",
    levels: [
      { diff: "easy", coins: 1000, time: 20, grid: 12 },
      { diff: "medium", coins: 2400, time: 15, grid: 16 },
      { diff: "hard", coins: 5200, time: 10, grid: 24 },
    ],
    symbols: { easy: ["🇺🇸", "🇬🇧", "🇯🇵", "🇮🇳", "🇧🇷", "🇫🇷"], medium: ["🇺🇸", "🇬🇧", "🇯🇵", "🇮🇳", "🇧🇷", "🇫🇷", "🇩🇪", "🇰🇷"], hard: ["🇺🇸", "🇬🇧", "🇯🇵", "🇮🇳", "🇧🇷", "🇫🇷", "🇩🇪", "🇰🇷", "🇨🇦", "🇦🇺", "🇮🇹", "🇪🇸"] }
  },
];
function MemoryGame({ onComplete }) {
  const [phase, setPhase] = useState("select");
  const [category, setCategory] = useState(null);
  const [gameDiff, setGameDiff] = useState(null);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const DIFF_COLORS = { easy: "#6ee7b7", medium: "#fbbf24", hard: "#ef4444" };
  const selectCategory = (cat) => { setCategory(cat); setPhase("difficulty"); };
  const startGame = (level) => {
    setGameDiff(level);
    const syms = category.symbols[level.diff];
    const deck = [...syms, ...syms].sort(() => Math.random() - 0.5).map((s, i) => ({ id: i, symbol: s, flipped: false, matched: false }));
    setCards(deck);
    setFlipped([]); setScore(0); setMoves(0);
    setTimeLeft(level.time);
    setPhase("playing");
  };
  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0 || cards.every(c => c.matched)) {
      setPhase("result");
      return;
    }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, cards, phase]);
  const flip = (id) => {
    if (phase !== "playing" || flipped.length >= 2 || cards[id].flipped || cards[id].matched) return;
    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newFlipped;
      if (newCards[a].symbol === newCards[b].symbol) {
        newCards[a].matched = true;
        newCards[b].matched = true;
        setCards([...newCards]);
        setFlipped([]);
      } else {
        const flipSpeed = gameDiff.diff === "easy" ? 600 : gameDiff.diff === "medium" ? 450 : 300;
        setTimeout(() => {
          newCards[a].flipped = false;
          newCards[b].flipped = false;
          setCards([...newCards]);
          setFlipped([]);
        }, flipSpeed);
      }
    }
  };
  if (phase === "select") {
    return (
      <div>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <NeonText size="1rem" color="#6ee7b7">SELECT CARD THEME</NeonText>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: 4 }}>Pick a theme, then choose difficulty!</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MEMORY_CATEGORIES.map(c => (
            <div key={c.id} onClick={() => selectCategory(c)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "linear-gradient(135deg, #0a0a1a, #0d1117)", border: `1px solid ${c.color}25`, borderRadius: 10, cursor: "pointer", }}>
              <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: `${c.color}15`, borderRadius: 8, border: `1px solid ${c.color}40`, fontSize: "1.3rem", }}>{c.icon}</div>
              <div style={{ flex: 1 }}>
                <NeonText size="0.8rem" color={c.color}>{c.name}</NeonText>
                <div style={{ color: "#555", fontSize: "0.85rem", marginTop: 2 }}>{c.desc}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <NeonText size="0.75rem" color="#fbbf24" glow={false}>💰 {c.levels[0].coins}–{c.levels[2].coins}</NeonText>
                <div style={{ color: "#555", fontSize: "0.75rem" }}>all-or-nothing</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (phase === "difficulty") {
    return (
      <div>
        <button onClick={() => { setCategory(null); setPhase("select"); }} style={{ background: "none", border: "1px solid #333", color: "#888", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: "0.85rem", marginBottom: 16, }}>← BACK</button>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: "2rem", marginBottom: 8 }}>{category.icon}</div>
          <NeonText size="1.1rem" color={category.color}>{category.name}</NeonText>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: 4 }}>Match ALL pairs before time runs out to earn!</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {category.levels.map(level => (
            <div key={level.diff} onClick={() => startGame(level)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px", background: "linear-gradient(135deg, #0a0a1a, #0d1117)", border: `1px solid ${DIFF_COLORS[level.diff]}30`, borderRadius: 10, cursor: "pointer", }}>
              <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", background: `${DIFF_COLORS[level.diff]}10`, borderRadius: 8, border: `1px solid ${DIFF_COLORS[level.diff]}40`, }}>
                <NeonText size="0.7rem" color={DIFF_COLORS[level.diff]} glow={false}>
                  {level.diff === "easy" ? "E" : level.diff === "medium" ? "M" : "H"}
                </NeonText>
              </div>
              <div style={{ flex: 1 }}>
                <NeonText size="0.85rem" color={DIFF_COLORS[level.diff]}>{level.diff.toUpperCase()}</NeonText>
                <div style={{ color: "#555", fontSize: "0.8rem", marginTop: 2 }}>⏱ {level.time}s • {level.grid / 2} pairs ({level.grid} cards)</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <NeonText size="1rem" color="#fbbf24" glow={false}>💰 {level.coins}</NeonText>
                <div style={{ color: "#555", fontSize: "0.75rem" }}>all-or-nothing</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (phase === "result") {
    const totalPairs = gameDiff.grid / 2;
    const matched = cards.filter(c => c.matched).length / 2;
    const won = matched === totalPairs;
    const earned = won ? gameDiff.coins : 0;
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{won ? "🎉" : "💀"}</div>
        <NeonText size="1.5rem" color={won ? "#0f0" : "#f44"}>
          {won ? "ALL MATCHED!" : "FAILED"}
        </NeonText>
        <div style={{ color: "#666", fontSize: "0.9rem", marginTop: 4 }}>
          {category.name} • {gameDiff.diff.toUpperCase()}
        </div>
        <div style={{ color: "#888", fontSize: "0.85rem", margin: "8px 0" }}>
          {matched}/{totalPairs} pairs in {moves} moves{!won && ` — need all ${totalPairs} to earn`}
        </div>
        <div style={{ margin: "16px 0" }}>
          <NeonText size="1.3rem" color="#fbbf24">{won ? `+${earned.toLocaleString()} coins!` : "+0 coins"}</NeonText>
        </div>
        <GlowButton onClick={() => onComplete(earned)} color={won ? "#0f0" : "#f0f"}>COLLECT & EXIT</GlowButton>
      </div>
    );
  }
  const cols = gameDiff.grid <= 12 ? 4 : gameDiff.grid <= 16 ? 4 : 6;
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div>
          <NeonText color={category.color} size="0.7rem">{category.icon} {category.name}</NeonText>
          <span style={{ color: DIFF_COLORS[gameDiff.diff], fontSize: "0.75rem", marginLeft: 8 }}>
            {gameDiff.diff.toUpperCase()}
          </span>
        </div>
        <NeonText color={timeLeft < 10 ? "#f44" : "#0ff"} size="0.8rem">⏱ {timeLeft}s</NeonText>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <NeonText color="#888" size="0.7rem" glow={false}>Moves: {moves}</NeonText>
        <NeonText color={cards.filter(c => c.matched).length === cards.length ? "#0f0" : "#888"} size="0.7rem" glow={false}>{cards.filter(c => c.matched).length / 2}/{gameDiff.grid / 2} pairs</NeonText>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: cols > 4 ? 6 : 8, maxWidth: cols > 4 ? 450 : 360, margin: "0 auto", }}>
        {cards.map(card => (
          <button key={card.id} onClick={() => flip(card.id)} style={{
            width: "100%", aspectRatio: "1", borderRadius: cols > 4 ? 6 : 8, fontSize: cols > 4 ? "1.1rem" : "1.5rem",
            border: card.matched ? `1px solid #0f0` : card.flipped ? `1px solid ${category.color}` : "1px solid #1a1a4e",
            background: card.matched ? "#00ff0011" : card.flipped ? `${category.color}15` : "#0a0a1a",
            color: card.flipped || card.matched ? "#fff" : "transparent",
            cursor: card.matched ? "default" : "pointer",
            boxShadow: card.matched ? "0 0 10px #0f040" : card.flipped ? `0 0 10px ${category.color}40` : "none",
          }}>
            {card.flipped || card.matched ? card.symbol : "?"}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <NeonText color="#fbbf24" size="0.65rem" glow={false}>💰 {gameDiff.coins.toLocaleString()} (all-or-nothing) • {cards.filter(c => c.matched).length / 2}/{gameDiff.grid / 2} pairs</NeonText>
      </div>
    </div>
  );
}
function WordGame({ onComplete }) {
  const [phase, setPhase] = useState("select");
  const [category, setCategory] = useState(null);
  const [gameDiff, setGameDiff] = useState(null);
  const [puzzles, setPuzzles] = useState([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const totalRounds = 5;
  const usedWords = useRef({});
  const DIFF_COLORS = { easy: "#6ee7b7", medium: "#fbbf24", hard: "#ef4444" };
  const selectCategory = (cat) => { setCategory(cat); setPhase("difficulty"); };
  const startGame = (level) => {
    setGameDiff(level);
    const pool = category.words[level.diff];
    const key = `${category.id}_${level.diff}`;
    if (!usedWords.current[key]) usedWords.current[key] = [];
    let available = pool.filter((_, i) => !usedWords.current[key].includes(i));
    if (available.length < totalRounds) {
      usedWords.current[key] = [];
      available = [...pool];
    }
    const shuffled = available.sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, totalRounds).map(w => ({
      ...w, answer: w.answer.toUpperCase(), scrambled: scrambleWord(w.answer.toUpperCase()),
    }));
    picked.forEach(p => {
      const idx = pool.findIndex(w => w.answer.toUpperCase() === p.answer);
      if (idx >= 0) usedWords.current[key].push(idx);
    });
    setPuzzles(picked);
    setCurrent(0); setInput(""); setScore(0); setShowHint(false); setFeedback(null);
    setTimeLeft(level.time);
    setPhase("playing");
  };
  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) { setPhase("result"); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase]);
  const submit = () => {
    if (phase !== "playing" || feedback) return;
    const pts = gameDiff.coins;
    const isCorrect = input.toUpperCase().trim() === puzzles[current].answer;
    if (isCorrect) {
      const earned = showHint ? Math.floor(pts / 2) : pts;
      setScore(s => s + earned);
      setFeedback({ correct: true, msg: `+${earned} coins!` });
    } else {
      setFeedback({ correct: false, msg: `Answer: ${puzzles[current].answer}` });
    }
    setTimeout(() => {
      if (current >= totalRounds - 1) { setPhase("result"); return; }
      setCurrent(c => c + 1);
      setInput(""); setShowHint(false); setFeedback(null);
    }, 1200);
  };
  const getFinalScore = () => {
    if (phase !== "result") return score;
    return score;
  };
  if (phase === "select") {
    return (
      <div>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <NeonText size="1rem" color="#fbbf24">SELECT WORD CATEGORY</NeonText>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: 4 }}>Unscramble 5 words — earn per correct answer!</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {WORD_CATEGORIES.map(c => (
            <div key={c.id} onClick={() => selectCategory(c)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "linear-gradient(135deg, #0a0a1a, #0d1117)", border: `1px solid ${c.color}25`, borderRadius: 10, cursor: "pointer", }}>
              <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: `${c.color}15`, borderRadius: 8, border: `1px solid ${c.color}40`, fontSize: "1.3rem", }}>{c.icon}</div>
              <div style={{ flex: 1 }}>
                <NeonText size="0.8rem" color={c.color}>{c.name}</NeonText>
                <div style={{ color: "#555", fontSize: "0.85rem", marginTop: 2 }}>{c.desc}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <NeonText size="0.75rem" color="#fbbf24" glow={false}>💰 {c.levels[0].coins}–{c.levels[2].coins}</NeonText>
                <div style={{ color: "#555", fontSize: "0.75rem" }}>per word</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (phase === "difficulty") {
    return (
      <div>
        <button onClick={() => { setCategory(null); setPhase("select"); }} style={{ background: "none", border: "1px solid #333", color: "#888", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: "0.85rem", marginBottom: 16, }}>← BACK</button>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: "2rem", marginBottom: 8 }}>{category.icon}</div>
          <NeonText size="1.1rem" color={category.color}>{category.name}</NeonText>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: 4 }}>Harder = longer words, more coins, less time!</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {category.levels.map(level => (
            <div key={level.diff} onClick={() => startGame(level)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px", background: "linear-gradient(135deg, #0a0a1a, #0d1117)", border: `1px solid ${DIFF_COLORS[level.diff]}30`, borderRadius: 10, cursor: "pointer", }}>
              <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", background: `${DIFF_COLORS[level.diff]}10`, borderRadius: 8, border: `1px solid ${DIFF_COLORS[level.diff]}40`, }}>
                <NeonText size="0.7rem" color={DIFF_COLORS[level.diff]} glow={false}>
                  {level.diff === "easy" ? "E" : level.diff === "medium" ? "M" : "H"}
                </NeonText>
              </div>
              <div style={{ flex: 1 }}>
                <NeonText size="0.85rem" color={DIFF_COLORS[level.diff]}>{level.diff.toUpperCase()}</NeonText>
                <div style={{ color: "#555", fontSize: "0.8rem", marginTop: 2 }}>⏱ {level.time}s • {level.diff === "easy" ? "3-4" : level.diff === "medium" ? "5-6" : "7+"} letter words</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <NeonText size="1rem" color="#fbbf24" glow={false}>💰 {level.coins}</NeonText>
                <div style={{ color: "#555", fontSize: "0.75rem" }}>per word</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (phase === "result") {
    const finalScore = getFinalScore();
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{finalScore > 0 ? "🎉" : "💀"}</div>
        <NeonText size="1.5rem" color={finalScore > 0 ? "#0f0" : "#f44"}>
          {finalScore >= gameDiff.coins * totalRounds ? "PERFECT!" : finalScore > 0 ? "NICE WORK!" : "NO COINS"}
        </NeonText>
        <div style={{ color: "#666", fontSize: "0.9rem", marginTop: 4 }}>
          {category.name} • {gameDiff.diff.toUpperCase()}
        </div>
        <div style={{ margin: "16px 0" }}>
          <NeonText size="1.3rem" color="#fbbf24">+{finalScore.toLocaleString()} coins</NeonText>
        </div>
        <GlowButton onClick={() => onComplete(finalScore)} color={finalScore > 0 ? "#0f0" : "#f0f"}>COLLECT & EXIT</GlowButton>
      </div>
    );
  }
  const puzzle = puzzles[current];
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div>
          <NeonText color={category.color} size="0.7rem">{category.icon} {category.name}</NeonText>
          <span style={{ color: DIFF_COLORS[gameDiff.diff], fontSize: "0.75rem", marginLeft: 8 }}>
            {gameDiff.diff.toUpperCase()}
          </span>
        </div>
        <NeonText color={timeLeft < 10 ? "#f44" : "#0ff"} size="0.8rem">⏱ {timeLeft}s</NeonText>
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 16 }}>
        {puzzles.map((_, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: i === current ? category.color : i < current ? "#0f0" : "#222", border: `1px solid ${i === current ? category.color : "#333"}`, boxShadow: i === current ? `0 0 8px ${category.color}60` : "none", }} />
        ))}
      </div>
      <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: 6 }}>WORD {current + 1} OF {totalRounds}</div>
      <div style={{ margin: "12px 0" }}>
        <NeonText size="0.85rem" color="#888">Unscramble the word:</NeonText>
        <div style={{ margin: "15px 0", display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {puzzle.scrambled.split("").map((ch, i) => (
            <div key={i} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a2a", border: `1px solid ${category.color}40`, borderRadius: 8, color: category.color, fontSize: "1.3rem", boxShadow: `0 0 8px ${category.color}15`, }}>{ch}</div>
          ))}
        </div>
        {showHint && <div style={{ color: "#fbbf24", fontSize: "0.85rem", fontStyle: "italic" }}>Hint: {puzzle.hint}</div>}
        {!showHint && !feedback && (
          <button onClick={() => setShowHint(true)} style={{ background: "none", border: "1px solid #fbbf2440", color: "#fbbf24", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: "0.9rem", }}>Show Hint (½ coins)</button>
        )}
      </div>
      {feedback && (
        <div style={{ color: feedback.correct ? "#0f0" : "#f44", fontSize: "1.1rem", margin: 10 }}>
          {feedback.correct ? "✓ " : "✗ "}{feedback.msg}
        </div>
      )}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="Type word..." autoFocus
          style={{ background: "#0a0a1a", border: `1px solid ${category.color}40`, color: "#0ff", padding: "12px 20px", borderRadius: 8, fontSize: "1.1rem", outline: "none", width: 200, textAlign: "center", textTransform: "uppercase", }} />
        <GlowButton onClick={submit} disabled={!!feedback}>SUBMIT</GlowButton>
      </div>
      <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <NeonText color="#fbbf24" size="0.8rem" glow={false}>💰 {score} earned</NeonText>
        <NeonText color="#888" size="0.7rem" glow={false}>{gameDiff.coins}/word</NeonText>
      </div>
    </div>
  );
}
function PvPBattle({ playerWeapons, onComplete }) {
  const [phase, setPhase] = useState("select");
  const [battleMode, setBattleMode] = useState("auto");
  const [miniBoss, setMiniBoss] = useState(false);
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);
  const [enemy, setEnemy] = useState(null);
  const [result, setResult] = useState(null);
  const [turnReady, setTurnReady] = useState(false);
  const [playerAnim, setPlayerAnim] = useState("");
  const DEF_REDUCTION = { common: 2, rare: 3, epic: 5, legendary: 8, mythic: 12, glitched: 15, pet: 4 };
  const getDefenseReduction = (weapons) => {
    const defWeapons = weapons.filter(w => w.type === "defense" || w.type === "both");
    if (defWeapons.length === 0) return 0;
    const best = defWeapons.reduce((a, b) => (DEF_REDUCTION[b.rarity] || 0) > (DEF_REDUCTION[a.rarity] || 0) ? b : a);
    return DEF_REDUCTION[best.rarity] || 0;
  };
  const playerDefReduction = getDefenseReduction(playerWeapons);
  const [enemyAnim, setEnemyAnim] = useState("");
  const [floatText, setFloatText] = useState(null);
  const [screenShake, setScreenShake] = useState(false);
  const [turnLabel, setTurnLabel] = useState("");
  const [turnCount, setTurnCount] = useState(0);
  const triggerShake = () => { setScreenShake(true); setTimeout(() => setScreenShake(false), 300); };
  const showFloat = (text, color, side) => {
    setFloatText({ text, color, side });
    setTimeout(() => setFloatText(null), 900);
  };
  const animateAttack = (who, dmg, callback) => {
    if (who === "player") {
      setPlayerAnim("attack");
      setTimeout(() => {
        setPlayerAnim("");
        setEnemyAnim("hit");
        triggerShake();
        showFloat(`-${dmg}`, "#f44", "right");
        setTimeout(() => { setEnemyAnim(""); if (callback) callback(); }, 500);
      }, 400);
    } else {
      setEnemyAnim("attack");
      setTimeout(() => {
        setEnemyAnim("");
        setPlayerAnim("hit");
        triggerShake();
        showFloat(`-${dmg}`, "#f44", "left");
        setTimeout(() => { setPlayerAnim(""); if (callback) callback(); }, 500);
      }, 400);
    }
  };
  const animateDefend = (who, callback) => {
    if (who === "player") {
      setPlayerAnim("defend");
      showFloat("🛡 BLOCK", "#0f0", "left");
      setTimeout(() => { setPlayerAnim(""); if (callback) callback(); }, 600);
    } else {
      setEnemyAnim("defend");
      showFloat("🛡 BLOCK", "#0f0", "right");
      setTimeout(() => { setEnemyAnim(""); if (callback) callback(); }, 600);
    }
  };
  const startSearch = () => {
    if (!selectedWeapon) return;
    setPhase("searching");
    const BOSS_NAMES = ["💀 TITAN-X", "🔥 INFERNO PRIME", "⚡ STORM LORD", "🌑 DARK KING", "👁️ THE WATCHER"];
    const bot = miniBoss ? BOSS_NAMES[Math.floor(Math.random() * BOSS_NAMES.length)] : BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
    const bossPool = WEAPONS.filter(w => w.rarity === "mythic" || w.rarity === "glitched");
    const botWeapon = miniBoss ? { ...bossPool[Math.floor(Math.random() * bossPool.length)], level: Math.floor(Math.random() * 20) + 15 } : WEAPONS[Math.floor(Math.random() * WEAPONS.length)];
    const finalMode = battleMode;
    setTimeout(() => {
      setEnemy({ name: bot, weapon: botWeapon });
      setBattleMode(finalMode);
      setPhase("battle");
      setTurnLabel(miniBoss ? "⚠️ BOSS FIGHT!" : "FIGHT!");
      setTimeout(() => setTurnLabel(""), 1000);
      if (finalMode === "auto") runAutoBattle(selectedWeapon, botWeapon, bot);
      else { setTurnReady(true); startArena(); }
    }, miniBoss ? 3000 : 2000);
  };
  const runAutoBattle = (pw, ew, eName) => {
    let ph = 100, eh = 100;
    const events = [];
    let turn = 0;
    const playerDef = getWeaponStats(pw).defense || 0;
    const botDef = (ew.type === "defense" ? 8 : ew.type === "both" ? 5 : 0) + Math.floor(Math.random() * 3);
    const pPotions = pw.potions || [];
    const fireLvl = pPotions.find(p => p.id === "fire");
    const iceLvl = pPotions.find(p => p.id === "ice");
    const lightLvl = pPotions.find(p => p.id === "lightning");
    const poisonLvl = pPotions.find(p => p.id === "poison");
    const fireEff = fireLvl ? getPotionEffect("fire", fireLvl.merge) : null;
    const iceEff = iceLvl ? getPotionEffect("ice", iceLvl.merge) : null;
    const lightEff = lightLvl ? getPotionEffect("lightning", lightLvl.merge) : null;
    const poisonEff = poisonLvl ? getPotionEffect("poison", poisonLvl.merge) : null;
    let poisonStack = 0;
    while (ph > 0 && eh > 0 && turn < 20) {
      const rawPDmg = Math.floor(getWeaponStats(pw).damage * (0.7 + Math.random() * 0.6));
      let pDmg = Math.max(1, rawPDmg - botDef);
      let pEffect = "";
      if (fireEff) { pDmg += fireEff.burnDmg; pEffect = "🔥"; }
      if (poisonEff) { poisonStack += poisonEff.poisonDmg; pDmg += poisonStack; pEffect += "☠️"; }
      eh -= pDmg;
      events.push({ who: "player", dmg: pDmg, php: ph, ehp: Math.max(0, eh), action: "attack", effect: pEffect });
      if (eh <= 0) break;
      let rawEDmg = Math.floor(ew.damage * (0.7 + Math.random() * 0.6));
      if (iceEff) rawEDmg = Math.floor(rawEDmg * (1 - iceEff.slowPct / 100));
      if (lightEff && Math.random() * 100 < lightEff.stunPct) {
        events.push({ who: "enemy", dmg: 0, php: ph, ehp: eh, action: "stunned", effect: "⚡" });
        turn++;
        continue;
      }
      const eDmg = Math.max(1, rawEDmg - playerDef);
      ph -= eDmg;
      events.push({ who: "enemy", dmg: eDmg, php: Math.max(0, ph), ehp: eh, action: "attack" });
      turn++;
    }
    const finalWon = eh <= 0;
    let i = 0;
    const playNext = () => {
      if (i >= events.length) {
        setTimeout(() => {
          setResult({ won: finalWon, coins: finalWon ? 4000 : -1000, miniBoss });
          setPhase("result");
        }, 600);
        return;
      }
      const ev = events[i];
      setTurnCount(Math.floor(i / 2) + 1);
      if (ev.action === "stunned") {
        setTurnLabel("⚡ STUNNED!");
        setEnemyAnim("hit");
        showFloat("⚡ STUN", "#fbbf24", "right");
        setTimeout(() => { setEnemyAnim(""); setTurnLabel(""); i++; setTimeout(playNext, 400); }, 800);
      } else {
        const effectLabel = ev.effect ? ` ${ev.effect}` : "";
        setTurnLabel((ev.who === "player" ? "YOUR TURN" : "ENEMY TURN") + effectLabel);
        setTimeout(() => {
          animateAttack(ev.who, ev.dmg, () => {
            setPlayerHP(ev.php);
            setEnemyHP(ev.ehp);
            setTurnLabel("");
            i++;
            setTimeout(playNext, 400);
          });
        }, 300);
      }
    };
    setTimeout(playNext, 800);
  };
  // Arena state for realtime mode
  const [arenaPlayerX, setArenaPlayerX] = useState(50);
  const [arenaEnemyX, setArenaEnemyX] = useState(50);
  const [projectiles, setProjectiles] = useState([]);
  const [canShoot, setCanShoot] = useState(true);
  const arenaRef = useRef(null);
  const gameLoopRef = useRef(null);
  const enemyAIRef = useRef(null);

  // Get potion ball color
  const getBallColor = (weapon) => {
    const potions = weapon?.potions || [];
    if (potions.find(p => p.id === "fire")) return "#f90";
    if (potions.find(p => p.id === "ice")) return "#60a5fa";
    if (potions.find(p => p.id === "lightning")) return "#fbbf24";
    if (potions.find(p => p.id === "poison")) return "#0f0";
    return "#0ff";
  };

  const startArena = () => {
    setArenaPlayerX(50);
    setArenaEnemyX(50);
    setProjectiles([]);
    setCanShoot(true);
  };

  // Game loop for projectiles
  useEffect(() => {
    if (phase !== "battle" || battleMode !== "realtime") return;
    const loop = setInterval(() => {
      setProjectiles(prev => {
        const updated = prev.map(p => ({
          ...p,
          y: p.fromPlayer ? p.y - 2.5 : p.y + 2.5, // move toward target
        })).filter(p => p.y > -5 && p.y < 105);
        // Check hits
        updated.forEach(p => {
          if (p.fromPlayer && p.y <= 8) {
            // Check if enemy is near the ball's x position
            if (Math.abs(p.x - arenaEnemyX) < 12) {
              p.hit = true;
              const dmg = Math.max(1, Math.floor(getWeaponStats(selectedWeapon).damage * (0.8 + Math.random() * 0.3)));
              setEnemyHP(h => {
                const newHP = Math.max(0, h - dmg);
                if (newHP <= 0) {
                  setResult({ won: true, coins: 4800, miniBoss });
                  setPhase("result");
                }
                return newHP;
              });
              showFloat(`-${dmg}`, "#0ff", "right");
              triggerShake();
            }
          } else if (!p.fromPlayer && p.y >= 92) {
            if (Math.abs(p.x - arenaPlayerX) < 12) {
              p.hit = true;
              const eDmg = Math.max(1, Math.floor(enemy.weapon.damage * (0.7 + Math.random() * 0.4)));
              setPlayerHP(h => {
                const newHP = Math.max(0, h - eDmg);
                if (newHP <= 0) {
                  setResult({ won: false, coins: -1000, miniBoss });
                  setPhase("result");
                }
                return newHP;
              });
              showFloat(`-${eDmg}`, "#f44", "left");
              triggerShake();
            }
          }
        });
        return updated.filter(p => !p.hit);
      });
    }, 50);
    gameLoopRef.current = loop;
    return () => clearInterval(loop);
  }, [phase, battleMode, arenaPlayerX, arenaEnemyX]);

  // Enemy AI: move and shoot
  useEffect(() => {
    if (phase !== "battle" || battleMode !== "realtime") return;
    const ai = setInterval(() => {
      // Move randomly
      setArenaEnemyX(x => {
        const dir = (Math.random() - 0.5) * 20;
        return Math.max(8, Math.min(92, x + dir));
      });
      // Shoot every ~2.5 seconds
      if (Math.random() < 0.4) {
        setProjectiles(prev => [...prev, {
          id: Date.now() + Math.random(),
          x: arenaEnemyX,
          y: 8,
          fromPlayer: false,
          color: "#f0f",
        }]);
      }
    }, 600);
    enemyAIRef.current = ai;
    return () => clearInterval(ai);
  }, [phase, battleMode, arenaEnemyX]);

  const arenaShoot = () => {
    if (!canShoot || phase !== "battle") return;
    setCanShoot(false);
    const ballColor = getBallColor(selectedWeapon);
    setProjectiles(prev => [...prev, {
      id: Date.now(),
      x: arenaPlayerX,
      y: 92,
      fromPlayer: true,
      color: ballColor,
    }]);
    setTimeout(() => setCanShoot(true), 2000);
  };

  const moveArena = (dir) => {
    if (phase !== "battle") return;
    setArenaPlayerX(x => Math.max(8, Math.min(92, x + dir * 15)));
  };

  // Keyboard controls for arena
  useEffect(() => {
    if (phase !== "battle" || battleMode !== "realtime") return;
    const handleKey = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") { e.preventDefault(); moveArena(-1); }
      if (e.key === "ArrowRight" || e.key === "d") { e.preventDefault(); moveArena(1); }
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); arenaShoot(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase, battleMode, canShoot, arenaPlayerX]);

  if (!playerWeapons.length) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <NeonText size="1.2rem" color="#f44">NO WEAPONS EQUIPPED</NeonText>
        <p style={{ color: "#888", marginTop: 12 }}>Visit the shop first to buy a weapon before entering the arena.</p>
      </div>
    );
  }
  if (phase === "result") {
    return (
      <div style={{ textAlign: "center", padding: 30 }}>
        <div style={{ fontSize: "3rem", marginBottom: 12, animation: "float 2s ease-in-out infinite" }}>
          {result.won ? "🏆" : "💀"}
        </div>
        <NeonText size="2rem" color={result.won ? "#0f0" : "#f44"}>
          {result.won ? "VICTORY!" : "DEFEAT"}
        </NeonText>
        <div style={{ color: "#888", fontSize: "0.8rem", marginTop: 8 }}>
          Battle lasted {turnCount} turns
        </div>
        <div style={{ margin: "16px 0" }}>
          {result.won ? (
            <NeonText size="1.3rem" color="#0f0">+{result.coins.toLocaleString()} coins</NeonText>
          ) : (
            <NeonText size="1rem" color="#f44">Penalty: -1,000 coins or lose a weapon level</NeonText>
          )}
        </div>
        <GlowButton onClick={() => onComplete(result)} color={result.won ? "#0f0" : "#f0f"}>
          {result.won ? "COLLECT & EXIT" : "EXIT"}
        </GlowButton>
      </div>
    );
  }
  if (phase === "searching") {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <div style={{ fontSize: "3rem", animation: "pulse 1s infinite" }}>⚔️</div>
        <NeonText size="1.1rem" color="#f0f">SEARCHING FOR OPPONENT...</NeonText>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 6 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#f0f", animation: `pulse 1s infinite ${i * 0.3}s`, }} />
          ))}
        </div>
      </div>
    );
  }
  if (phase === "battle") {
    const StickFigure = ({ anim, color, side, weaponEmoji }) => {
      const flip = side === "right" ? -1 : 1;
      let headY = 25, bodyY1 = 35, bodyY2 = 65, armAngle = 0, legSpread = 15;
      let armX = 0, armY = 0, dx = 0, opacity = 1, glow = color;
      if (anim === "attack") { armAngle = -60 * flip; dx = 25 * flip; armX = 20 * flip; armY = -10; glow = "#fff"; }
      else if (anim === "hit") { dx = -12 * flip; opacity = 0.6; headY = 28; glow = "#f44"; }
      else if (anim === "defend") { armAngle = 30 * flip; armX = 5 * flip; armY = 5; glow = "#0f0"; }
      return (
        <svg width="80" height="130" viewBox="0 0 80 130" style={{
          transition: "all 0.3s ease",
          transform: `translateX(${dx}px)`,
          filter: anim === "hit" ? "brightness(2) drop-shadow(0 0 8px #f44)"
            : anim === "attack" ? `drop-shadow(0 0 12px ${color})`
            : anim === "defend" ? "drop-shadow(0 0 10px #0f0)"
            : `drop-shadow(0 0 6px ${color}40)`,
          opacity,
        }}>
          {}
          <circle cx="40" cy={headY} r="10" fill="none" stroke={glow} strokeWidth="2.5" />
          <circle cx={side === "left" ? 44 : 36} cy={headY - 2} r="1.5" fill={anim === "hit" ? "#f44" : color} />
          <circle cx={side === "left" ? 37 : 43} cy={headY - 2} r="1.5" fill={anim === "hit" ? "#f44" : color} />
          {}
          <line x1="40" y1={bodyY1} x2="40" y2={bodyY2} stroke={glow} strokeWidth="2.5" strokeLinecap="round" />
          {}
          <line x1="40" y1="42" x2={40 + 22 * flip + armX} y2={50 + armY}
            stroke={glow} strokeWidth="2.5" strokeLinecap="round"
            style={{ transition: "all 0.25s ease", transform: `rotate(${armAngle}deg)`, transformOrigin: "40px 42px" }} />
          <line x1="40" y1="42" x2={40 - 18 * flip} y2={55}
            stroke={glow} strokeWidth="2.5" strokeLinecap="round" />
          {}
          {anim === "attack" && (
            <text x={40 + 28 * flip + armX} y={42 + armY} fontSize="18" textAnchor="middle"
              style={{ transition: "all 0.2s" }}>{weaponEmoji}</text>
          )}
          {anim !== "attack" && (
            <text x={40 + 24 * flip} y={52} fontSize="14" textAnchor="middle" opacity="0.8">{weaponEmoji}</text>
          )}
          {}
          <line x1="40" y1={bodyY2} x2={40 - legSpread + (anim === "attack" ? 8 * flip : 0)} y2="105"
            stroke={glow} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="40" y1={bodyY2} x2={40 + legSpread + (anim === "attack" ? 5 * flip : 0)} y2="105"
            stroke={glow} strokeWidth="2.5" strokeLinecap="round" />
          {}
          {anim === "defend" && (
            <ellipse cx={40 + 12 * flip} cy="50" rx="14" ry="20" fill="none" stroke="#0f0" strokeWidth="1.5" opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="0.8s" repeatCount="indefinite" />
            </ellipse>
          )}
          {}
          {anim === "hit" && <g>
            <line x1={40 - 8 * flip} y1="40" x2={40 - 18 * flip} y2="32" stroke="#f44" strokeWidth="2" opacity="0.8" />
            <line x1={40 - 6 * flip} y1="48" x2={40 - 16 * flip} y2="50" stroke="#f90" strokeWidth="2" opacity="0.7" />
            <line x1={40 - 4 * flip} y1="35" x2={40 - 12 * flip} y2="28" stroke="#ff0" strokeWidth="1.5" opacity="0.6" />
          </g>}
        </svg>
      );
    };
    return (
      <div style={{ transform: screenShake ? `translate(${Math.random()*8-4}px, ${Math.random()*8-4}px)` : "none", transition: screenShake ? "none" : "transform 0.1s" }}>
        {}
        {turnLabel && (
          <div style={{ textAlign: "center", marginBottom: 8, padding: "8px 0", background: "linear-gradient(90deg, transparent, #fff10, transparent)", }}>
            <NeonText size="1rem" color="#fff">{turnLabel}</NeonText>
          </div>
        )}
        {}
        <div style={{ background: "linear-gradient(180deg, #020010, #0a0025, #050015, #020010)", borderRadius: 12, padding: "16px", border: "1px solid #1a1a3e", position: "relative", overflow: "hidden", }}>
          {}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.04, background: "repeating-linear-gradient(90deg, #0ff 0, #0ff 1px, transparent 1px, transparent 30px), repeating-linear-gradient(0deg, #0ff 0, #0ff 1px, transparent 1px, transparent 30px)", }} />
          {}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 10, position: "relative", zIndex: 2 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <NeonText size="0.6rem" color="#0ff">YOU</NeonText>
                <span style={{ color: "#0ff", fontSize: "0.7rem" }}>{playerHP}/100</span>
              </div>
              <div style={{ background: "#111", borderRadius: 4, height: 10, overflow: "hidden", border: "1px solid #222" }}>
                <div style={{ width: `${playerHP}%`, height: "100%", background: playerHP > 50 ? "linear-gradient(90deg, #0ff, #0f0)" : playerHP > 25 ? "linear-gradient(90deg, #fbbf24, #f90)" : "linear-gradient(90deg, #f44, #f00)", transition: "width 0.5s, background 0.5s", borderRadius: 4, boxShadow: `0 0 8px ${playerHP > 50 ? "#0ff" : playerHP > 25 ? "#f90" : "#f44"}50`, }} />
              </div>
              <div style={{ color: "#666", fontSize: "0.5rem", marginTop: 2 }}>
                {selectedWeapon?.emoji} {selectedWeapon?.name} LV{selectedWeapon?.level || 1}
              </div>
            </div>
            <div style={{ textAlign: "center", padding: "0 4px" }}>
              <div style={{ fontSize: "0.75rem", color: "#666" }}>
                {turnCount > 0 ? `T${turnCount}` : "VS"}
              </div>
              <NeonText size="1rem" color="#f44">⚡</NeonText>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <NeonText size="0.6rem" color="#f0f">{enemy?.name}</NeonText>
                <span style={{ color: "#f0f", fontSize: "0.7rem" }}>{enemyHP}/100</span>
              </div>
              <div style={{ background: "#111", borderRadius: 4, height: 10, overflow: "hidden", border: "1px solid #222" }}>
                <div style={{ width: `${enemyHP}%`, height: "100%", background: enemyHP > 50 ? "linear-gradient(90deg, #f0f, #c0f)" : enemyHP > 25 ? "linear-gradient(90deg, #fbbf24, #f90)" : "linear-gradient(90deg, #f44, #f00)", transition: "width 0.5s, background 0.5s", borderRadius: 4, boxShadow: `0 0 8px ${enemyHP > 50 ? "#f0f" : enemyHP > 25 ? "#f90" : "#f44"}50`, }} />
              </div>
              <div style={{ color: "#666", fontSize: "0.5rem", marginTop: 2, textAlign: "right" }}>
                {enemy?.weapon?.emoji} {enemy?.weapon?.name}
              </div>
            </div>
          </div>
          {battleMode === "auto" && (<>
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", minHeight: 150, position: "relative", zIndex: 2, padding: "0 10px", }}>
            {}
            <div style={{ position: "relative" }}>
              <StickFigure anim={playerAnim} color="#0ff" side="left" weaponEmoji={selectedWeapon?.emoji || "⚔️"} />
              {floatText && floatText.side === "left" && (
                <div style={{
                  position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                  color: floatText.color, fontSize: "1.4rem", fontWeight: 900,
                  animation: "floatUp 0.9s forwards",
                  textShadow: `0 0 15px ${floatText.color}`,
                }}>{floatText.text}</div>
              )}
            </div>
            {}
            {(playerAnim === "attack" || enemyAnim === "attack") && (
              <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", fontSize: "2rem", animation: "pulse 0.3s", filter: "drop-shadow(0 0 15px #ff0)", }}>💥</div>
            )}
            {}
            <div style={{ position: "relative" }}>
              <StickFigure anim={enemyAnim} color="#f0f" side="right" weaponEmoji={enemy?.weapon?.emoji || "🗡️"} />
              {floatText && floatText.side === "right" && (
                <div style={{
                  position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                  color: floatText.color, fontSize: "1.4rem", fontWeight: 900,
                  animation: "floatUp 0.9s forwards",
                  textShadow: `0 0 15px ${floatText.color}`,
                }}>{floatText.text}</div>
              )}
            </div>
          </div>
          {}
          <div style={{ height: 2, borderRadius: 2, marginTop: 8, background: "linear-gradient(90deg, #0ff30, #fff20, #f0f30)", }} />
          </>)}
        </div>
        {}
        <div style={{ fontSize: "0.8rem", color: "#555", textAlign: "center", margin: "10px 0 6px" }}>
          {battleMode === "realtime" ? "⚡ ARENA BATTLE" : "🤖 AUTO-BATTLE"}
        </div>
        {}
        {battleMode === "realtime" && (
          <div>
            {/* Arena */}
            <div ref={arenaRef} style={{
              position: "relative", width: "100%", height: 320, borderRadius: 12,
              background: "linear-gradient(180deg, #0a001a, #050520, #0a001a)",
              border: "1px solid #1a1a3e", overflow: "hidden", marginBottom: 12,
            }}>
              {/* Grid lines */}
              <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "#ffffff08" }} />
              <div style={{ position: "absolute", top: 0, bottom: 0, left: "25%", width: 1, background: "#ffffff05" }} />
              <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 1, background: "#ffffff05" }} />
              <div style={{ position: "absolute", top: 0, bottom: 0, left: "75%", width: 1, background: "#ffffff05" }} />

              {/* Enemy (top) */}
              <div style={{
                position: "absolute", top: 10, left: `${arenaEnemyX}%`, transform: "translateX(-50%)",
                transition: "left 0.3s ease",
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem" }}>{enemy?.weapon?.emoji || "🗡️"}</div>
                  <div style={{ fontSize: "0.5rem", color: "#f0f", fontFamily: "'Orbitron', sans-serif", marginTop: 2 }}>{enemy?.name}</div>
                </div>
              </div>

              {/* Player (bottom) */}
              <div style={{
                position: "absolute", bottom: 10, left: `${arenaPlayerX}%`, transform: "translateX(-50%)",
                transition: "left 0.15s ease",
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.5rem", color: "#0ff", fontFamily: "'Orbitron', sans-serif", marginBottom: 2 }}>YOU</div>
                  <div style={{ fontSize: "1.5rem" }}>{selectedWeapon?.emoji || "⚔️"}</div>
                </div>
              </div>

              {/* Projectiles */}
              {projectiles.map(p => (
                <div key={p.id} style={{
                  position: "absolute",
                  left: `${p.x}%`, top: `${p.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: 12, height: 12, borderRadius: "50%",
                  background: p.color,
                  boxShadow: `0 0 12px ${p.color}, 0 0 24px ${p.color}60`,
                  transition: "top 0.05s linear",
                }} />
              ))}

              {/* Float text */}
              {floatText && (
                <div style={{
                  position: "absolute",
                  top: floatText.side === "right" ? 40 : "auto",
                  bottom: floatText.side === "left" ? 60 : "auto",
                  left: "50%", transform: "translateX(-50%)",
                  color: floatText.color, fontSize: "1.4rem", fontWeight: 900,
                  animation: "floatUp 0.9s forwards",
                  textShadow: `0 0 15px ${floatText.color}`, zIndex: 10,
                }}>{floatText.text}</div>
              )}

              {/* Cooldown indicator */}
              {!canShoot && (
                <div style={{
                  position: "absolute", bottom: 50, left: "50%", transform: "translateX(-50%)",
                  color: "#f4480", fontSize: "0.75rem", fontFamily: "'Orbitron', sans-serif",
                }}>RELOADING...</div>
              )}
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <GlowButton onClick={() => moveArena(-1)} color="#fbbf24" style={{ flex: 1, fontSize: "0.85rem", padding: "14px 8px" }}>
                ← MOVE
              </GlowButton>
              <GlowButton onClick={arenaShoot} disabled={!canShoot} color={canShoot ? "#ef4444" : "#555"} style={{ flex: 2, fontSize: "0.85rem", padding: "14px 8px" }}>
                {canShoot ? `🎯 ATTACK` : "⏳ RELOAD"}
              </GlowButton>
              <GlowButton onClick={() => moveArena(1)} color="#fbbf24" style={{ flex: 1, fontSize: "0.85rem", padding: "14px 8px" }}>
                MOVE →
              </GlowButton>
            </div>
          </div>
        )}
      </div>
    );
  }
  return (
    <div>
      <NeonText size="1rem" color="#f0f">SELECT YOUR WEAPON</NeonText>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10, margin: "16px 0" }}>
        {playerWeapons.map(w => (
          <button key={w.id} onClick={() => setSelectedWeapon(w)} style={{
            background: selectedWeapon?.id === w.id ? `${RARITY_COLORS[w.rarity]}15` : "#0a0a1a",
            border: `1px solid ${selectedWeapon?.id === w.id ? RARITY_COLORS[w.rarity] : "#222"}`,
            borderRadius: 8, padding: 12, cursor: "pointer", textAlign: "center",
            boxShadow: selectedWeapon?.id === w.id ? `0 0 15px ${RARITY_COLORS[w.rarity]}30` : "none",
          }}>
            <div style={{ fontSize: "1.5rem" }}>{w.emoji}</div>
            <div style={{ color: RARITY_COLORS[w.rarity], fontSize: "0.9rem" }}>{w.name}</div>
            <div style={{ color: "#888", fontSize: "0.8rem" }}>DMG:{getWeaponStats(w).damage}{getWeaponStats(w).attack > 0 ? ` ATK:${getWeaponStats(w).attack}` : ""}{getWeaponStats(w).defense > 0 ? ` DEF:${getWeaponStats(w).defense}` : ""}</div>
            <div style={{ color: "#0ff", fontSize: "0.7rem", marginTop: 2 }}>LVL {w.level || 1}</div>
          </button>
        ))}
      </div>
      {}
      {playerDefReduction > 0 && (
        <div style={{ padding: "10px 14px", marginBottom: 12, borderRadius: 8, background: "#00ff0000", border: "1px solid #0f020", display: "flex", alignItems: "center", gap: 10, }}>
          <span style={{ fontSize: "1.2rem" }}>🛡</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#0f0", fontSize: "0.9rem" }}>
              DEFENSE ACTIVE: -{playerDefReduction} DMG per hit
            </div>
            <div style={{ color: "#666", fontSize: "0.75rem" }}>
              From your best defense/both weapon in inventory
            </div>
          </div>
        </div>
      )}
      <div style={{ marginBottom: 16 }}>
        <NeonText size="0.8rem" color="#888">Battle Mode Preference:</NeonText>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {["auto", "realtime"].map(mode => (
            <button key={mode} onClick={() => setBattleMode(mode)} style={{
              background: battleMode === mode ? "#00ffff11" : "#0a0a1a",
              border: `1px solid ${battleMode === mode ? "#0ff" : "#222"}`,
              color: battleMode === mode ? "#0ff" : "#666", padding: "8px 16px",
              borderRadius: 6, cursor: "pointer", fontSize: "0.8rem",
            }}>
              {mode === "auto" ? "🤖 Auto" : "⚡ Real-time"}
            </button>
          ))}
        </div>
        <div style={{ color: "#555", fontSize: "0.85rem", marginTop: 6 }}>
          Auto = watch the battle. Real-time = top-down arena, dodge and shoot!
        </div>
      </div>
      {}
      <button onClick={() => setMiniBoss(!miniBoss)} style={{
        width: "100%", padding: "12px 16px", marginBottom: 12,
        display: "flex", alignItems: "center", gap: 12,
        background: miniBoss ? "linear-gradient(135deg, #2a0a0a, #1a0505)" : "#0a0a1a",
        border: `1px solid ${miniBoss ? "#ff444455" : "#1a1a3e"}`,
        borderRadius: 10, cursor: "pointer",
        boxShadow: miniBoss ? "0 0 15px #f4420" : "none",
      }}>
        <div style={{ fontSize: "1.5rem" }}>{miniBoss ? "🔥" : "👤"}</div>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ color: miniBoss ? "#f44" : "#888", fontSize: "0.8rem" }}>
            {miniBoss ? "⚠️ MINI-BOSS MODE" : "NORMAL MODE"}
          </div>
          <div style={{ color: "#666", fontSize: "0.75rem", marginTop: 2 }}>
            {miniBoss ? "Harder enemy, 2x coin reward if you win!" : "Tap to enable mini-boss (harder, bigger reward)"}
          </div>
        </div>
        <div style={{ width: 40, height: 22, borderRadius: 11, background: miniBoss ? "#f44" : "#333", position: "relative", }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: miniBoss ? 20 : 2, }} />
        </div>
      </button>
      <GlowButton onClick={startSearch} disabled={!selectedWeapon} color={miniBoss ? "#f44" : "#f0f"} style={{ width: "100%" }}>
        {miniBoss ? "🔥 CHALLENGE BOSS" : "⚔ FIND OPPONENT"}
      </GlowButton>
    </div>
  );
}
export default function XPGrinder() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [initialState, setInitialState] = useState(null);

  useEffect(() => {
    const sbAuth = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    sbAuth.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        sbAuth.from("players").select("game_state").eq("user_id", data.user.id).single().then(({ data: pData }) => {
          if (pData?.game_state) setInitialState(pData.game_state);
          else setStateLoaded(true);
          setAuthLoading(false);
        });
      } else {
        window.location.href = "/";
      }
    });
  }, []);

  const onLogout = async () => {
    const sbAuth = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    await sbAuth.auth.signOut();
    window.location.href = "/";
  };

  const onSave = async (stateJson) => {
    if (!user) return;
    const sbAuth = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    await sbAuth.from("players").upsert({ user_id: user.id, email: user.email, game_state: stateJson }, { onConflict: "user_id" });
  };

  const [screen, setScreen] = useState("hub");  const [coins, setCoins] = useState(4000);
  const coinsRef = useRef(4000);
  const debtRef = useRef(0);
  const [debt, setDebt] = useState(0);
  const getToday = () => new Date().toLocaleDateString();
  useEffect(() => { coinsRef.current = coins; }, [coins]);
  useEffect(() => { debtRef.current = debt; }, [debt]);
  const [gamesLeft, setGamesLeft] = useState({ math: 5, trivia: 5, word: 5, memory: 5 });
  const totalGamesLeft = Object.values(gamesLeft).reduce((a, b) => a + b, 0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [inventory, setInventory] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [notification, setNotification] = useState(null);
  const [lastClaimDate, setLastClaimDate] = useState(null);
  const [lastLoginDate, setLastLoginDate] = useState(getToday());
  const [stateLoaded, setStateLoaded] = useState(false);
  const [streak, setStreak] = useState(1);
  const [coinDoubler, setCoinDoubler] = useState(false);
  const [wheelSpun, setWheelSpun] = useState(false);
  const [wheelResult, setWheelResult] = useState(null);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const dailyClaimed = lastClaimDate === getToday();
  useEffect(() => {
    if (!stateLoaded) return;
    const checkReset = () => {
      const today = getToday();
      if (lastLoginDate !== today) {
        setGamesLeft({ math: 5, trivia: 5, word: 5, memory: 5 });
        setWheelSpun(false);
        setWheelResult(null);
        setCoinDoubler(false);
        setCoinFlipsUsed(0);
        setBountyAttempts({});
        setStreak(s => s + 1);
        setLastLoginDate(today);
      }
    };
    checkReset();
    const interval = setInterval(checkReset, 30000);
    return () => clearInterval(interval);
  }, [lastLoginDate, stateLoaded]);

  const [packResult, setPackResult] = useState(null);
  const [packOpening, setPackOpening] = useState(false);
  const PETS = [
    { id: "pet_dragon", name: "Cyber Dragon", damage: 25, speed: 10, type: "attack", rarity: "pet", emoji: "🐉" },
    { id: "pet_phoenix", name: "Neon Phoenix", damage: 25, speed: 11, type: "attack", rarity: "pet", emoji: "🦅" },
    { id: "pet_wolf", name: "Glitch Wolf", damage: 25, speed: 9, type: "attack", rarity: "pet", emoji: "🐺" },
    { id: "pet_cat", name: "Void Cat", damage: 25, speed: 12, type: "both", rarity: "pet", emoji: "🐱" },
    { id: "pet_bot", name: "Mini Mech", damage: 25, speed: 8, type: "attack", rarity: "pet", emoji: "🤖" },
    { id: "pet_ghost", name: "Phantom Wisp", damage: 25, speed: 13, type: "defense", rarity: "pet", emoji: "👻" },
  ];
  const notify = (msg, color = "#0ff") => {
    setNotification({ msg, color });
    setTimeout(() => setNotification(null), 2500);
  };
  const loseCoins = (amount) => {
    let resultRef = { current: null };
    setCoins(currentCoins => {
      if (currentCoins >= amount) {
        coinsRef.current = currentCoins - amount;
        resultRef.current = { type: "coins", amount };
        return currentCoins - amount;
      }
      const remaining = amount - currentCoins;
      coinsRef.current = 0;
      // Check weapons
      const allWeapons = [...inventory];
      if (allWeapons.length === 0) {
        setDebt(d => { debtRef.current = d + remaining; return d + remaining; });
        notify(`💀 Debt increased by ${remaining.toLocaleString()}!`, "#f44");
        resultRef.current = { type: "debt", amount: remaining };
        return 0;
      }
      const best = allWeapons.reduce((a, b) => getWeaponStats(a).damage > getWeaponStats(b).damage ? a : b);
      if (best.rarity === "pet") {
        setInventory(inv => inv.filter(w => w.id !== best.id));
        notify(`💀 Can't pay! ${best.emoji} ${best.name} was DESTROYED!`, "#f44");
        resultRef.current = { type: "destroyed", weapon: best };
        return 0;
      }
      if ((best.level || 1) > 2) {
        setInventory(inv => inv.map(w => w.id === best.id ? { ...w, level: w.level - 2 } : w));
        notify(`💀 Can't pay! ${best.emoji} ${best.name} lost 2 levels!`, "#f44");
        resultRef.current = { type: "levelLoss", weapon: best, levels: 2 };
        return 0;
      } else {
        setInventory(inv => inv.filter(w => w.id !== best.id));
        notify(`💀 Can't pay! ${best.emoji} ${best.name} was DESTROYED!`, "#f44");
        resultRef.current = { type: "destroyed", weapon: best };
        return 0;
      }
    });
    return resultRef.current;
  };
  const earnCoins = (amount) => {
    if (amount <= 0) return;
    setTotalCoinsEarned(t => t + amount);
    setDebt(currentDebt => {
      if (currentDebt > 0) {
        if (amount >= currentDebt) {
          const leftover = amount - currentDebt;
          notify(`💀 Debt collected: -${currentDebt.toLocaleString()} coins. ${leftover > 0 ? `+${leftover.toLocaleString()} remaining.` : "Debt cleared!"}`, "#f44");
          debtRef.current = 0;
          setCoins(c => { coinsRef.current = c + leftover; return c + leftover; });
          unlockAchievement("survive_debt");
          return 0;
        } else {
          notify(`💀 Debt collected: -${amount.toLocaleString()} coins. Remaining debt: ${(currentDebt - amount).toLocaleString()}`, "#f44");
          debtRef.current = currentDebt - amount;
          return currentDebt - amount;
        }
      } else {
        setCoins(c => { coinsRef.current = c + amount; return c + amount; });
        return 0;
      }
    });
  };
  const openPack = () => {
    if (coins < 3000 || packOpening) return;
    setCoins(c => { coinsRef.current = c - 3000; return c - 3000; });
    setPackOpening(true);
    setPackResult(null);
    setPacksOpened(p => p + 1);
    setTimeout(() => {
      const roll = Math.random() * 100;
      let result;
      if (roll < 60) {
        const badRoll = Math.floor(Math.random() * 8);
        if (badRoll === 0) {
          const loss = Math.floor(Math.random() * 2001) + 1000;
          loseCoins(loss);
          result = { type: "bad", icon: "💸", title: "COIN DRAIN", desc: `Lost ${loss.toLocaleString()} coins!`, color: "#f44" };
        } else if (badRoll === 1) {
          loseCoins(15000);
          result = { type: "bad", icon: "💀", title: "MEGA DRAIN", desc: "Lost 15,000 coins!", color: "#f44" };
        } else if (badRoll === 2) {
          const targets = inventory.filter(w => w.rarity === "pet" || (w.level || 1) > 1);
          if (targets.length > 0) {
            const target = targets[Math.floor(Math.random() * targets.length)];
            if (target.rarity === "pet") {
              setInventory(inv => inv.filter(w => w.id !== target.id));
              result = { type: "bad", icon: "💥", title: "PET DESTROYED", desc: `${target.emoji} ${target.name} was crushed!`, color: "#f44" };
            } else {
              const drop = Math.min(3, target.level - 1);
              setInventory(inv => inv.map(w => w.id === target.id ? { ...w, level: w.level - drop } : w));
              result = { type: "bad", icon: "⬇️", title: "LEVEL CRUSH", desc: `${target.emoji} ${target.name} lost ${drop} levels!`, color: "#f44" };
            }
          } else {
            loseCoins(5000);
            result = { type: "bad", icon: "💀", title: "BAD LUCK", desc: "Nothing to downgrade... Lost 5,000 coins!", color: "#f44" };
          }
        } else if (badRoll === 3) {
          loseCoins(8000);
          result = { type: "bad", icon: "📈", title: "TAX RAID!", desc: "Lost 8,000 coins to a surprise raid!", color: "#f44" };
        } else if (badRoll === 4) {
          if (inventory.length > 0) {
            const target = inventory[Math.floor(Math.random() * inventory.length)];
            setInventory(inv => inv.filter(w => w.id !== target.id));
            result = { type: "bad", icon: "💥", title: "WEAPON DESTROYED", desc: `${target.emoji} ${target.name} (LVL ${target.level}) obliterated!`, color: "#f44" };
          } else {
            loseCoins(8000);
            result = { type: "bad", icon: "💀", title: "BAD LUCK", desc: "No weapons... Lost 8,000 coins!", color: "#f44" };
          }
        } else if (badRoll === 5) {
          loseCoins(10000);
          result = { type: "bad", icon: "🔥", title: "MELTDOWN", desc: "Catastrophic energy failure! Lost 10,000 coins!", color: "#f44" };
        } else if (badRoll === 6) {
          if (totalGamesLeft > 0) {
            setGamesLeft({ math: 0, trivia: 0, word: 0, memory: 0 });
            result = { type: "bad", icon: "🎮", title: "TOTAL BLACKOUT", desc: "All remaining game attempts wiped for today!", color: "#f44" };
          } else {
            loseCoins(5000);
            result = { type: "bad", icon: "💀", title: "BAD LUCK", desc: "No games to lose... Lost 5,000 coins!", color: "#f44" };
          }
        } else {
          if (inventory.length >= 2) {
            const sorted = [...inventory].sort(() => Math.random() - 0.5);
            const victim1 = sorted[0], victim2 = sorted[1];
            setInventory(inv => inv.filter(w => w.id !== victim1.id && w.id !== victim2.id));
            result = { type: "bad", icon: "☠️", title: "DOUBLE KILL", desc: `${victim1.emoji} ${victim1.name} AND ${victim2.emoji} ${victim2.name} destroyed!`, color: "#f44" };
          } else if (inventory.length === 1) {
            const victim = inventory[0];
            setInventory([]);
            result = { type: "bad", icon: "💥", title: "WEAPON DESTROYED", desc: `${victim.emoji} ${victim.name} destroyed!`, color: "#f44" };
          } else {
            loseCoins(15000);
            result = { type: "bad", icon: "💀", title: "DEVASTATION", desc: "No weapons... Lost 15,000 coins!", color: "#f44" };
          }
        }
      } else if (roll < 75) {
        result = { type: "refund", icon: "🔄", title: "REFUND PACK", desc: "Energy recycled! Your coins have been returned.", color: "#fbbf24" };
        earnCoins(3000);
      } else if (roll < 85) {
        const pet = PETS[Math.floor(Math.random() * PETS.length)];
        const instanceId = `${pet.id}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        result = { type: "pet", icon: "🐾", title: "PET UNLOCKED!", desc: `${pet.emoji} ${pet.name} has joined your arsenal!`, color: "#f0f", pet };
        setInventory(inv => [...inv, { ...pet, id: instanceId, level: 1, merge: 1, price: 3000 }]);
      } else {
        const goodRoll = Math.floor(Math.random() * 4);
        if (goodRoll === 0) {
          const winAmount = Math.floor(Math.random() * 7001) + 8000;
          earnCoins(winAmount);
          result = { type: "good", icon: "💰", title: "COIN SURGE!", desc: `Massive payout of ${winAmount.toLocaleString()} coins!`, color: "#0f0" };
        } else if (goodRoll === 1) {
          const rareWeapons = WEAPONS.filter(w => (w.rarity === "rare" || w.rarity === "epic") && !inventory.find(i => i.id === w.id));
          if (rareWeapons.length > 0) {
            const weapon = rareWeapons[Math.floor(Math.random() * rareWeapons.length)];
            setInventory(inv => [...inv, { ...weapon, level: 1 }]);
            result = { type: "good", icon: "⚔️", title: "FREE WEAPON!", desc: `${weapon.emoji} ${weapon.name} (${weapon.rarity}) added to your arsenal!`, color: "#0f0", weapon };
          } else {
            const winAmount = 12000;
            earnCoins(winAmount);
            result = { type: "good", icon: "💰", title: "COIN SURGE!", desc: `All rare/epic weapons owned! +${winAmount.toLocaleString()} coins instead!`, color: "#0f0" };
          }
        } else if (goodRoll === 2) {
          const upgradeable = inventory.filter(w => (w.level || 1) < 50 && w.rarity !== "pet");
          if (upgradeable.length > 0) {
            const target = upgradeable[Math.floor(Math.random() * upgradeable.length)];
            setInventory(inv => inv.map(w => w.id === target.id ? { ...w, level: (w.level || 1) + 1 } : w));
            result = { type: "good", icon: "⬆️", title: "FREE UPGRADE!", desc: `${target.emoji} ${target.name} upgraded to LVL ${(target.level || 1) + 1}!`, color: "#0f0" };
          } else {
            const winAmount = 10000;
            earnCoins(winAmount);
            result = { type: "good", icon: "💰", title: "COIN SURGE!", desc: `All weapons maxed! +${winAmount.toLocaleString()} coins instead!`, color: "#0f0" };
          }
        } else {
          setGamesLeft(g => ({ math: g.math + 1, trivia: g.trivia + 1, word: g.word + 1, memory: g.memory + 1 }));
          result = { type: "good", icon: "🎮", title: "ENERGY BOOST!", desc: "+1 extra game in every category!", color: "#0f0" };
        }
      }
      setPackResult(result);
      setPackOpening(false);
    }, 1500);
  };
  const claimDaily = () => {
    if (dailyClaimed) return;
    const streakBonus = streak >= 7 ? 5000 : streak >= 5 ? 3000 : streak >= 3 ? 2000 : 0;
    const total = 1000 + streakBonus;
    earnCoins(total);
    setLastClaimDate(getToday());
    addXP(50);
    notify(streakBonus > 0 ? `✅ +${total.toLocaleString()} coins! (${streak}-day streak bonus: +${streakBonus.toLocaleString()})` : "✅ Daily check-in: +1,000 coins!", "#0f0");
  };
  const WHEEL_PRIZES = [
    { label: "💰 +500", coins: 500, color: "#888" },
    { label: "💰 +1,000", coins: 1000, color: "#0ff" },
    { label: "💰 +3,000", coins: 3000, color: "#0f0" },
    { label: "💰 +5,000", coins: 5000, color: "#0f0" },
    { label: "💰 +8,000", coins: 8000, color: "#fbbf24" },
    { label: "💰 +10,000", coins: 10000, color: "#fbbf24" },
    { label: "💀 -500", coins: -500, color: "#f44" },
    { label: "💀 -1,000", coins: -1000, color: "#f44" },
    { label: "💀 -3,000", coins: -3000, color: "#f44" },
    { label: "💀 -5,000", coins: -5000, color: "#f44" },
    { label: "💀 Lose a level", coins: 0, effect: "loseLevel", color: "#f44" },
    { label: "💀 Lose 2 levels", coins: 0, effect: "lose2Levels", color: "#f44" },
  ];
  const spinWheel = () => {
    if (wheelSpinning) return;
    setWheelSpinning(true);
    setWheelResult(null);
    setTimeout(() => {
      const prize = WHEEL_PRIZES[Math.floor(Math.random() * WHEEL_PRIZES.length)];
      if (prize.effect === "loseLevel") {
        const targets = inventory.filter(w => w.rarity === "pet" || (w.level || 1) > 1);
        if (targets.length > 0) {
          const target = targets[Math.floor(Math.random() * targets.length)];
          if (target.rarity === "pet") {
            setInventory(inv => inv.filter(w => w.id !== target.id));
            setWheelResult({ ...prize, label: `💀 ${target.emoji} ${target.name} DESTROYED!` });
          } else {
            setInventory(inv => inv.map(w => w.id === target.id ? { ...w, level: w.level - 1 } : w));
            setWheelResult({ ...prize, label: `💀 ${target.emoji} ${target.name} lost a level!` });
          }
        } else {
          loseCoins(1000);
          setWheelResult({ ...prize, label: "💀 -1,000 coins (nothing to downgrade)", coins: -1000 });
        }
      } else if (prize.effect === "lose2Levels") {
        if (inventory.length > 0) {
          const target = inventory.reduce((a, b) => getWeaponStats(a).damage > getWeaponStats(b).damage ? a : b);
          if (target.rarity === "pet" || (target.level || 1) <= 2) {
            setInventory(inv => inv.filter(w => w.id !== target.id));
            setWheelResult({ ...prize, label: `💀 ${target.emoji} ${target.name} DESTROYED!` });
          } else {
            setInventory(inv => inv.map(w => w.id === target.id ? { ...w, level: w.level - 2 } : w));
            setWheelResult({ ...prize, label: `💀 ${target.emoji} ${target.name} lost 2 levels!` });
          }
        } else {
          loseCoins(2000);
          setWheelResult({ ...prize, label: "💀 -2,000 coins (no weapons)", coins: -2000 });
        }
      } else {
        if (prize.coins > 0) earnCoins(prize.coins);
        else if (prize.coins < 0) loseCoins(Math.abs(prize.coins));
        setWheelResult(prize);
      }
      setWheelSpinning(false);
    }, 2000);
  };
  const buyCoinDoubler = () => {
    if (coinDoubler) return;
    if (coins < 2000) { notify("Need 2,000 coins!", "#f44"); return; }
    setCoins(c => c - 2000);
    setCoinDoubler(true);
    notify("⚡ Coin Doubler active! Next game pays 2x!", "#fbbf24");
  };
  const recycleWeapons = (rarity) => {
    const weapons = inventory.filter(w => w.rarity === rarity && w.rarity !== "pet");
    if (weapons.length < 3) { notify(`Need 3 ${rarity} weapons to recycle!`, "#f44"); return; }
    const toRemove = weapons.slice(0, 3).map(w => w.id);
    const nextTier = { common: "rare", rare: "epic", epic: "legendary", legendary: "mythic", mythic: "glitched" };
    const targetRarity = nextTier[rarity];
    if (!targetRarity) { notify("Can't recycle this tier!", "#f44"); return; }
    const candidates = WEAPONS.filter(w => w.rarity === targetRarity && !inventory.find(i => i.id === w.id));
    const allCandidates = candidates.length > 0 ? candidates : WEAPONS.filter(w => w.rarity === targetRarity);
    const reward = allCandidates[Math.floor(Math.random() * allCandidates.length)];
    setInventory(inv => [...inv.filter(w => !toRemove.includes(w.id)), { ...reward, level: 1 }]);
    notify(`♻️ Recycled 3 ${rarity}s → ${reward.emoji} ${reward.name} (${targetRarity})!`, "#0f0");
  };
  const buyMaterial = (matId, qty = 1) => {
    const mat = MATERIALS.find(m => m.id === matId);
    if (!mat) return;
    const cost = mat.price * qty;
    if (coins < cost) { notify("Not enough coins!", "#f44"); return; }
    setCoins(c => c - cost);
    setMaterials(m => ({ ...m, [matId]: (m[matId] || 0) + qty }));
    notify(`Bought ${qty}x ${mat.emoji} ${mat.name}!`, mat.color);
  };
  const craftPotion = (potionId) => {
    const potion = POTIONS.find(p => p.id === potionId);
    if (!potion) return;
    const hasAll = Object.entries(potion.craft).every(([m, q]) => (materials[m] || 0) >= q);
    if (!hasAll) { notify("Not enough materials!", "#f44"); return; }
    setMaterials(m => {
      const u = { ...m };
      Object.entries(potion.craft).forEach(([matId, qty]) => { u[matId] -= qty; });
      return u;
    });
    setPotions(p => [...p, { id: potionId, merge: 1 }]);
    notify(`🧪 Crafted ${potion.emoji} ${potion.name}!`, potion.color);
  };
  const mergePotion = (index1, index2) => {
    const pot1 = potions[index1];
    const pot2 = potions[index2];
    if (!pot1 || !pot2 || pot1.id !== pot2.id) { notify("Must merge same potion type!", "#f44"); return; }
    if (pot1.merge >= 5) { notify("Already max merge!", "#f44"); return; }
    const newMerge = Math.min((pot1.merge || 1) + 1, 5);
    setPotions(p => {
      const updated = p.filter((_, i) => i !== index1 && i !== index2);
      return [...updated, { id: pot1.id, merge: newMerge }];
    });
    const potion = POTIONS.find(p => p.id === pot1.id);
    notify(`🔀 Merged ${potion.emoji} ${potion.name} → Merge ${newMerge}!`, potion.color);
  };
  const applyPotion = (potionIndex, weaponId) => {
    const weapon = inventory.find(w => w.id === weaponId);
    if (!weapon) return;
    const appliedPotions = weapon.potions || [];
    if (appliedPotions.length >= 2) { notify("Weapon already has 2 potions!", "#f44"); return; }
    const pot = potions[potionIndex];
    if (appliedPotions.find(p => p.id === pot.id)) { notify("Already has this potion type!", "#f44"); return; }
    setInventory(inv => inv.map(w => w.id === weaponId ? { ...w, potions: [...appliedPotions, { ...pot }] } : w));
    setPotions(p => p.filter((_, i) => i !== potionIndex));
    const potion = POTIONS.find(p => p.id === pot.id);
    notify(`🧪 Applied ${potion.emoji} ${potion.name} M${pot.merge} to ${weapon.emoji} ${weapon.name}!`, potion.color);
  };
  const removePotion = (weaponId, potionId) => {
    const weapon = inventory.find(w => w.id === weaponId);
    if (!weapon) return;
    const removed = weapon.potions.find(p => p.id === potionId);
    setInventory(inv => inv.map(w => w.id === weaponId ? { ...w, potions: (w.potions || []).filter(p => p.id !== potionId) } : w));
    setPotions(p => [...p, removed]);
    notify("Potion removed and returned to inventory", "#888");
  };
  const addXP = (amount) => {
    let newXP = xp + amount;
    let newLevel = level;
    let xpNeeded = newLevel * 200 + 100;
    while (newXP >= xpNeeded && newLevel < 100) {
      newXP -= xpNeeded;
      newLevel++;
      xpNeeded = newLevel * 200 + 100;
    }
    if (newLevel > level) {
      setLevel(newLevel);
      notify(`⬆ LEVEL UP! Now level ${newLevel}!`, "#fbbf24");
    }
    setXp(newXP);
  };
  const xpNeeded = level * 200 + 100;
  const startGame = (game, diff) => {
    setSelectedGame(game);
    setDifficulty(diff);
    setPlaying(true);
    setGamesLeft(g => ({ ...g, [game]: g[game] - 1 }));
  };
  const getRandomMaterialDrop = (earned) => {
    const drops = [];
    // Drops scale with earnings: more coins = harder game = better drops
    const dropCount = earned >= 2000 ? 3 : earned >= 800 ? 2 : 1;
    // Material pool scales with earnings
    const pool = earned >= 2000
      ? ["plasma", "cryo", "inferno", "voidF", "star", "dark"]
      : earned >= 800
      ? ["plasma", "cryo", "inferno", "dark"]
      : ["plasma", "dark"];
    // Rare glitch drop chance on high earnings
    if (earned >= 3000 && Math.random() < 0.15) pool.push("glitch");
    for (let i = 0; i < dropCount; i++) {
      const matId = pool[Math.floor(Math.random() * pool.length)];
      const existing = drops.find(d => d.id === matId);
      if (existing) existing.qty++;
      else drops.push({ id: matId, qty: 1 });
    }
    return drops;
  };

  const onGameComplete = (earned) => {
    const finalEarned = coinDoubler && earned > 0 ? earned * 2 : earned;
    if (coinDoubler && earned > 0) setCoinDoubler(false);
    if (finalEarned > 0) setTotalGamesWon(g => g + 1);
    earnCoins(finalEarned);
    addXP(finalEarned);
    // Material drops on win
    let dropMsg = "";
    if (earned > 0) {
      const drops = getRandomMaterialDrop(earned);
      drops.forEach(drop => {
        setMaterials(m => ({ ...m, [drop.id]: (m[drop.id] || 0) + drop.qty }));
        const mat = MATERIALS.find(m => m.id === drop.id);
        dropMsg += ` ${mat.emoji}x${drop.qty}`;
      });
    }
    setLastResult(finalEarned);
    setPlaying(false);
    setSelectedGame(null);
    setDifficulty(null);
    if (coinDoubler && earned > 0) notify(`⚡ DOUBLED! +${finalEarned.toLocaleString()} coins! +${dropMsg.trim()}`, "#fbbf24");
    else if (dropMsg && earned > 0) notify(`+${finalEarned.toLocaleString()} coins +${dropMsg.trim()} materials!`, "#c084fc");
  };
  const buyWeapon = (weapon) => {
    if (coins < weapon.price) { notify("Not enough coins!", "#f44"); return; }
    if (inventory.find(w => w.id === weapon.id)) { notify("Already owned!", "#f44"); return; }
    setCoins(c => c - weapon.price);
    setInventory(inv => [...inv, { ...weapon, level: 1 }]);
    notify(`${weapon.emoji} ${weapon.name} acquired!`, RARITY_COLORS[weapon.rarity]);
  };
  const [selectedGearId, setSelectedGearId] = useState(null);
  const [confirmSell, setConfirmSell] = useState(false);
  const [mergeMode, setMergeMode] = useState(false);
  const [achievements, setAchievements] = useState({});
  const [showAchievement, setShowAchievement] = useState(null);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [totalPvPWins, setTotalPvPWins] = useState(0);
  const [totalGamesWon, setTotalGamesWon] = useState(0);
  const [packsOpened, setPacksOpened] = useState(0);
  const [materials, setMaterials] = useState({ plasma: 0, cryo: 0, inferno: 0, voidF: 0, star: 0, glitch: 0, dark: 0 });
  const [potions, setPotions] = useState([]);
  const [bounties, setBounties] = useState([]);
  const [bountyDate, setBountyDate] = useState(null);
  const [coinFlipping, setCoinFlipping] = useState(false);
  const [coinFlipsUsed, setCoinFlipsUsed] = useState(0);
  const [coinFlipPot, setCoinFlipPot] = useState(0);
  const [coinFlipPhase, setCoinFlipPhase] = useState("pick"); // pick, flipping, won, lost

  const flipCoin = (amount) => {
    if (amount > 5000 || amount < 1000) return;
    const flipFee = coinFlipsUsed >= 2 ? 2000 : 0;
    const totalNeeded = amount + flipFee;
    if (coins < totalNeeded || coinFlipping) return;
    setCoinFlipping(true);
    setCoinFlipPhase("flipping");
    setCoins(c => { coinsRef.current = c - totalNeeded; return c - totalNeeded; });
    setCoinFlipsUsed(f => f + 1);
    setTimeout(() => {
      const won = Math.random() < 0.5;
      setCoinFlipping(false);
      if (won) {
        const newPot = amount * 2;
        setCoinFlipPot(newPot);
        setCoinFlipPhase("won");
        notify(`🪙 HEADS! Pot is now ${newPot.toLocaleString()} coins!`, "#0f0");
      } else {
        setCoinFlipPot(0);
        setCoinFlipPhase("lost");
        notify(`🪙 TAILS! You lost ${amount.toLocaleString()} coins!`, "#f44");
      }
    }, 1500);
  };

  const doubleOrNothing = () => {
    if (coinFlipping || coinFlipPot <= 0) return;
    setCoinFlipping(true);
    setCoinFlipPhase("flipping");
    setTimeout(() => {
      const won = Math.random() < 0.5;
      setCoinFlipping(false);
      if (won) {
        const newPot = coinFlipPot * 2;
        setCoinFlipPot(newPot);
        setCoinFlipPhase("won");
        notify(`🪙 HEADS! Pot doubled to ${newPot.toLocaleString()} coins!`, "#0f0");
      } else {
        setCoinFlipPot(0);
        setCoinFlipPhase("lost");
        notify(`🪙 TAILS! You lost everything!`, "#f44");
      }
    }, 1500);
  };

  const cashOutFlip = () => {
    earnCoins(coinFlipPot);
    notify(`💰 Cashed out ${coinFlipPot.toLocaleString()} coins!`, "#fbbf24");
    setCoinFlipPot(0);
    setCoinFlipPhase("pick");
  };  useEffect(() => {
    const today = getToday();
    if (bountyDate !== today) {
      const bountyBots = ["N3bulaX", "CyberPh4ntom", "Gl1tchWolf", "NeonSh4dow", "Pix3lStorm", "V0idRaider", "ByteHunt3r", "D4rkPulse", "ZeroCool", "DarkByt3"];
      const rewards = [8000, 12000, 18000, 25000, 35000];
      const shuffled = bountyBots.sort(() => Math.random() - 0.5).slice(0, 3);
      // Only strong weapons: epic, legendary, mythic, glitched
      const strongWeapons = WEAPONS.filter(w => ["epic", "legendary", "mythic", "glitched"].includes(w.rarity));
      const newBounties = shuffled.map((name, i) => {
        const baseWeapon = strongWeapons[Math.floor(Math.random() * strongWeapons.length)];
        // Bonus level 15-30 for extra damage
        const bountyLevel = 15 + Math.floor(Math.random() * 16);
        return {
          id: i,
          name,
          reward: rewards[Math.floor(Math.random() * rewards.length)],
          completed: false,
          weapon: { ...baseWeapon, level: bountyLevel },
        };
      });
      setBounties(newBounties);
      setBountyDate(today);
    }
  }, [bountyDate]);

  const [activeBounty, setActiveBounty] = useState(null);
  const [bountyFightPhase, setBountyFightPhase] = useState(null);
  const [bountyFightHP, setBountyFightHP] = useState({ player: 100, enemy: 100 });
  const [bountyAttempts, setBountyAttempts] = useState({});

  const completeBounty = (bountyId) => {
    setBounties(b => b.map(bn => bn.id === bountyId ? { ...bn, completed: true } : bn));
    const bounty = bounties.find(b => b.id === bountyId);
    if (bounty) earnCoins(bounty.reward);
  };

  const bountyLosePenalty = () => {
    const allWeapons = [...inventory].filter(w => w.rarity !== "pet");
    if (allWeapons.length > 0) {
      const best = allWeapons.reduce((a, b) => getWeaponStats(a).damage > getWeaponStats(b).damage ? a : b);
      if ((best.level || 1) > 3) {
        setInventory(inv => inv.map(w => w.id === best.id ? { ...w, level: w.level - 3 } : w));
        notify(`💀 ${best.emoji} ${best.name} lost 3 levels!`, "#f44");
      } else {
        setInventory(inv => inv.filter(w => w.id !== best.id));
        notify(`💀 ${best.emoji} ${best.name} was DESTROYED!`, "#f44");
      }
    } else {
      setDebt(d => { debtRef.current = d + 5000; return d + 5000; });
      notify(`💀 No weapons to penalize! +5,000 debt!`, "#f44");
    }
  };

  const startBountyFight = (bounty) => {
    if (inventory.length === 0) { notify("You need a weapon first!", "#f44"); return; }
    const attempts = bountyAttempts[bounty.id] || 0;
    if (attempts >= 2) { notify("No attempts left for this bounty today!", "#f44"); return; }
    setBountyAttempts(a => ({ ...a, [bounty.id]: (a[bounty.id] || 0) + 1 }));
    setActiveBounty(bounty);
    setBountyFightPhase("fighting");
    // Enemy HP scales with rarity: epic=150, legendary=200, mythic=250, glitched=300
    const enemyMaxHP = { epic: 150, legendary: 200, mythic: 250, glitched: 300 }[bounty.weapon.rarity] || 150;
    setBountyFightHP({ player: 100, enemy: enemyMaxHP, enemyMax: enemyMaxHP });
    const bestWeapon = inventory.reduce((a, b) => getWeaponStats(a).damage > getWeaponStats(b).damage ? a : b);
    const pDmg = getWeaponStats(bestWeapon).damage;
    // Enemy damage boosted by their level
    const eDmg = (bounty.weapon.damage || 5) * (1 + (bounty.weapon.level - 1) * 0.08);
    let php = 100, ehp = enemyMaxHP;
    let step = 0;
    const fightInterval = setInterval(() => {
      step++;
      // Player attacks (enemy defense reduces damage)
      const enemyDef = bounty.weapon.type === "defense" ? 8 : bounty.weapon.type === "both" ? 5 : 3;
      const pHit = Math.max(1, Math.floor(pDmg * (0.6 + Math.random() * 0.5)) - enemyDef);
      ehp = Math.max(0, ehp - pHit);
      setBountyFightHP(prev => ({ ...prev, enemy: ehp }));
      if (ehp <= 0) {
        clearInterval(fightInterval);
        setTimeout(() => {
          setBountyFightPhase("won");
          completeBounty(bounty.id);
          notify(`🎯 Bounty complete! +${bounty.reward.toLocaleString()} coins!`, "#0f0");
        }, 500);
        return;
      }
      // Enemy attacks (player defense reduces damage)
      setTimeout(() => {
        const playerDef = getWeaponStats(bestWeapon).defense || 0;
        const eHit = Math.max(1, Math.floor(eDmg * (0.8 + Math.random() * 0.6)) - playerDef);
        php = Math.max(0, php - eHit);
        setBountyFightHP(prev => ({ ...prev, player: php }));
        if (php <= 0) {
          clearInterval(fightInterval);
          setTimeout(() => {
            setBountyFightPhase("lost");
            bountyLosePenalty();
            notify(`💀 Bounty failed! ${bounty.name} defeated you!`, "#f44");
          }, 500);
        }
      }, 300);
    }, 800);
  };

  // Load saved state on mount
  useEffect(() => {
    if (!initialState) return;
    try {
      const s = typeof initialState === "string" ? JSON.parse(initialState) : initialState;
      if (s.coins !== undefined) setCoins(s.coins);
      if (s.debt !== undefined) setDebt(s.debt);
      if (s.xp !== undefined) setXp(s.xp);
      if (s.level !== undefined) setLevel(s.level);
      if (s.inventory) setInventory(s.inventory);
      if (s.gamesLeft) setGamesLeft(s.gamesLeft);
      if (s.streak !== undefined) setStreak(s.streak);
      if (s.lastClaimDate) setLastClaimDate(s.lastClaimDate);
      if (s.lastLoginDate) setLastLoginDate(s.lastLoginDate);
      if (s.achievements) setAchievements(s.achievements);
      if (s.totalCoinsEarned !== undefined) setTotalCoinsEarned(s.totalCoinsEarned);
      if (s.totalPvPWins !== undefined) setTotalPvPWins(s.totalPvPWins);
      if (s.totalGamesWon !== undefined) setTotalGamesWon(s.totalGamesWon);
      if (s.packsOpened !== undefined) setPacksOpened(s.packsOpened);
      if (s.materials) setMaterials(s.materials);
      if (s.potions) setPotions(s.potions);
      if (s.bounties) setBounties(s.bounties);
      if (s.bountyDate) setBountyDate(s.bountyDate);
      if (s.bountyAttempts) setBountyAttempts(s.bountyAttempts);
      setStateLoaded(true);
    } catch (e) { console.error("Failed to load state:", e); setStateLoaded(true); }
  }, []);

  // Save on page close/refresh
  useEffect(() => {
    const saveBeforeLeave = () => {
      if (!onSave) return;
      const state = {
        coins: coinsRef.current, debt: debtRef.current, xp, level, inventory, gamesLeft, streak,
        lastClaimDate, lastLoginDate,
        achievements, totalCoinsEarned, totalPvPWins, totalGamesWon, packsOpened,
        materials, potions, bounties, bountyDate, bountyAttempts,
      };
      onSave(JSON.stringify(state));
    };
    window.addEventListener("beforeunload", saveBeforeLeave);
    return () => window.removeEventListener("beforeunload", saveBeforeLeave);
  }, [xp, level, inventory, gamesLeft, streak, achievements, materials, potions, totalCoinsEarned, totalPvPWins, totalGamesWon, packsOpened]);

  // Auto-save every 10 seconds
  useEffect(() => {
    if (!onSave) return;
    const saveInterval = setInterval(() => {
      const state = {
        coins, debt, xp, level, inventory, gamesLeft, streak,
        lastClaimDate, lastLoginDate,
        achievements, totalCoinsEarned, totalPvPWins, totalGamesWon, packsOpened,
        materials, potions, bounties, bountyDate, bountyAttempts,
      };
      onSave(JSON.stringify(state));
    }, 10000);
    return () => clearInterval(saveInterval);
  }, [coins, debt, xp, level, inventory, gamesLeft, streak, achievements, materials, potions]);
  const ACHIEVEMENTS = [
    { id: "first_weapon", name: "Armed & Dangerous", desc: "Buy your first weapon", icon: "🗡️", reward: 500 },
    { id: "first_pvp", name: "First Blood", desc: "Win your first PvP battle", icon: "⚔️", reward: 1000 },
    { id: "first_game", name: "Player One", desc: "Win your first mini-game", icon: "🎮", reward: 500 },
    { id: "own_5", name: "Arsenal Builder", desc: "Own 5 weapons", icon: "🎒", reward: 2000 },
    { id: "own_10", name: "Weapon Hoarder", desc: "Own 10 weapons", icon: "🏪", reward: 5000 },
    { id: "own_20", name: "Armory King", desc: "Own 20 weapons", icon: "👑", reward: 10000 },
    { id: "first_rare", name: "Rare Find", desc: "Own a rare weapon", icon: "💙", reward: 1000 },
    { id: "first_epic", name: "Epic Discovery", desc: "Own an epic weapon", icon: "💜", reward: 3000 },
    { id: "first_legendary", name: "Legendary Status", desc: "Own a legendary weapon", icon: "💛", reward: 5000 },
    { id: "first_mythic", name: "Myth Maker", desc: "Own a mythic weapon", icon: "❤️", reward: 10000 },
    { id: "first_glitched", name: "Reality Breaker", desc: "Own a glitched weapon", icon: "💜", reward: 20000 },
    { id: "first_pet", name: "Pet Parent", desc: "Get your first pet", icon: "🐾", reward: 1500 },
    { id: "pvp_5", name: "Brawler", desc: "Win 5 PvP battles", icon: "🥊", reward: 3000 },
    { id: "pvp_25", name: "Gladiator", desc: "Win 25 PvP battles", icon: "🏛️", reward: 10000 },
    { id: "pvp_50", name: "Warlord", desc: "Win 50 PvP battles", icon: "⚔️", reward: 25000 },
    { id: "boss_kill", name: "Boss Slayer", desc: "Defeat a mini-boss", icon: "🔥", reward: 5000 },
    { id: "games_10", name: "Grinder", desc: "Win 10 mini-games", icon: "💪", reward: 2000 },
    { id: "games_50", name: "No-Lifer", desc: "Win 50 mini-games", icon: "🧠", reward: 10000 },
    { id: "games_100", name: "Game God", desc: "Win 100 mini-games", icon: "🏆", reward: 30000 },
    { id: "earn_10k", name: "Hustler", desc: "Earn 10,000 total coins", icon: "💰", reward: 1000 },
    { id: "earn_100k", name: "Tycoon", desc: "Earn 100,000 total coins", icon: "💎", reward: 5000 },
    { id: "earn_500k", name: "Mogul", desc: "Earn 500,000 total coins", icon: "🏦", reward: 15000 },
    { id: "lvl10_weapon", name: "Sharpened", desc: "Upgrade a weapon to LVL 10", icon: "⬆️", reward: 3000 },
    { id: "lvl25_weapon", name: "Mastercraft", desc: "Upgrade a weapon to LVL 25", icon: "⭐", reward: 10000 },
    { id: "lvl50_weapon", name: "Perfection", desc: "Max a weapon to LVL 50", icon: "🌟", reward: 50000 },
    { id: "merge_pet", name: "Pet Fusion", desc: "Merge a pet to merge 5", icon: "🐉", reward: 5000 },
    { id: "open_10_packs", name: "Gambler", desc: "Open 10 energy packs", icon: "🎰", reward: 2000 },
    { id: "open_50_packs", name: "Addict", desc: "Open 50 energy packs", icon: "🎲", reward: 10000 },
    { id: "survive_debt", name: "Debt Free", desc: "Pay off debt", icon: "🔓", reward: 3000 },
    { id: "total_lvl_10", name: "Getting Stronger", desc: "Reach Total Level 10", icon: "📈", reward: 2000 },
    { id: "total_lvl_50", name: "Powerhouse", desc: "Reach Total Level 50", icon: "💥", reward: 15000 },
    { id: "total_lvl_100", name: "Unstoppable", desc: "Reach Total Level 100", icon: "🌀", reward: 50000 },
  ];
  const unlockAchievement = (id) => {
    if (achievements[id]) return;
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return;
    setAchievements(prev => ({ ...prev, [id]: true }));
    earnCoins(ach.reward);
    setShowAchievement(ach);
    setTimeout(() => setShowAchievement(null), 3000);
  };
  useEffect(() => {
    const totalLvl = Math.floor(inventory.reduce((sum, w) => sum + (w.rarity === "pet" ? (6 + (w.merge || 1)) : (w.level || 1)), 0) / 2);
    if (inventory.length >= 1 && inventory.some(w => w.rarity !== "pet")) unlockAchievement("first_weapon");
    if (inventory.length >= 5) unlockAchievement("own_5");
    if (inventory.length >= 10) unlockAchievement("own_10");
    if (inventory.length >= 20) unlockAchievement("own_20");
    if (inventory.some(w => w.rarity === "rare")) unlockAchievement("first_rare");
    if (inventory.some(w => w.rarity === "epic")) unlockAchievement("first_epic");
    if (inventory.some(w => w.rarity === "legendary")) unlockAchievement("first_legendary");
    if (inventory.some(w => w.rarity === "mythic")) unlockAchievement("first_mythic");
    if (inventory.some(w => w.rarity === "glitched")) unlockAchievement("first_glitched");
    if (inventory.some(w => w.rarity === "pet")) unlockAchievement("first_pet");
    if (inventory.some(w => (w.level || 1) >= 10)) unlockAchievement("lvl10_weapon");
    if (inventory.some(w => (w.level || 1) >= 25)) unlockAchievement("lvl25_weapon");
    if (inventory.some(w => (w.level || 1) >= 50)) unlockAchievement("lvl50_weapon");
    if (inventory.some(w => w.rarity === "pet" && (w.merge || 1) >= 5)) unlockAchievement("merge_pet");
    if (totalLvl >= 10) unlockAchievement("total_lvl_10");
    if (totalLvl >= 50) unlockAchievement("total_lvl_50");
    if (totalLvl >= 100) unlockAchievement("total_lvl_100");
    if (totalCoinsEarned >= 10000) unlockAchievement("earn_10k");
    if (totalCoinsEarned >= 100000) unlockAchievement("earn_100k");
    if (totalCoinsEarned >= 500000) unlockAchievement("earn_500k");
    if (totalPvPWins >= 1) unlockAchievement("first_pvp");
    if (totalPvPWins >= 5) unlockAchievement("pvp_5");
    if (totalPvPWins >= 25) unlockAchievement("pvp_25");
    if (totalPvPWins >= 50) unlockAchievement("pvp_50");
    if (totalGamesWon >= 1) unlockAchievement("first_game");
    if (totalGamesWon >= 10) unlockAchievement("games_10");
    if (totalGamesWon >= 50) unlockAchievement("games_50");
    if (totalGamesWon >= 100) unlockAchievement("games_100");
    if (packsOpened >= 10) unlockAchievement("open_10_packs");
    if (packsOpened >= 50) unlockAchievement("open_50_packs");
  }, [inventory, totalCoinsEarned, totalPvPWins, totalGamesWon, packsOpened]);
  const [mergeTargetId, setMergeTargetId] = useState(null);
  const upgradeWeapon = (weaponId) => {
    const weapon = inventory.find(w => w.id === weaponId);
    if (!weapon) return;
    if (weapon.rarity === "pet") { notify("Pets can't be upgraded!", "#f44"); return; }
    const cost = getUpgradeCost(weapon.level);
    if (!cost) { notify("Already max level!", "#f44"); return; }
    if (coins < cost) { notify("Not enough coins!", "#f44"); return; }
    setCoins(c => c - cost);
    setInventory(inv => inv.map(w => w.id === weaponId ? { ...w, level: w.level + 1 } : w));
    notify(`${weapon.emoji} ${weapon.name} → LVL ${weapon.level + 1}!`, "#0ff");
  };
  const sellWeapon = (weaponId) => {
    const weapon = inventory.find(w => w.id === weaponId);
    if (!weapon) return;
    const sellPrice = getSellPrice(weapon);
    earnCoins(sellPrice);
    setInventory(inv => inv.filter(w => w.id !== weaponId));
    setSelectedGearId(null);
    setConfirmSell(false);
    notify(`Sold ${weapon.emoji} ${weapon.name} for 💰${sellPrice.toLocaleString()}!`, "#fbbf24");
  };
  const mergePets = (keepId, sacrificeId) => {
    const keep = inventory.find(w => w.id === keepId);
    const sacrifice = inventory.find(w => w.id === sacrificeId);
    if (!keep || !sacrifice || keep.rarity !== "pet" || sacrifice.rarity !== "pet") return;
    if ((keep.merge || 1) >= 50) { notify("Already max merge!", "#f44"); return; }
    setInventory(inv => inv
      .filter(w => w.id !== sacrificeId)
      .map(w => w.id === keepId ? { ...w, merge: (w.merge || 1) + 1 } : w)
    );
    setMergeMode(false);
    setMergeTargetId(null);
    notify(`${keep.emoji} ${keep.name} → MERGE ${(keep.merge || 1) + 1}!`, "#ff69b4");
  };
  const mergeWeapons = (keepId, sacrificeId) => {
    const keep = inventory.find(w => w.id === keepId);
    const sacrifice = inventory.find(w => w.id === sacrificeId);
    if (!keep || !sacrifice) return;
    if (keep.rarity !== sacrifice.rarity) return;
    if (keep.type !== sacrifice.type && keep.type !== "both" && sacrifice.type !== "both") return;
    if (keep.rarity === "pet") return;
    const boost = keep.level <= 4 ? 2 : 3;
    const newLevel = Math.min(keep.level + boost, 50);
    setInventory(inv => inv
      .filter(w => w.id !== sacrificeId)
      .map(w => w.id === keepId ? { ...w, level: newLevel } : w)
    );
    setMergeMode(false);
    setMergeTargetId(null);
    setSelectedGearId(keepId);
    notify(`${keep.emoji} ${keep.name} → LVL ${newLevel}! (+${boost} from merge)`, "#0ff");
  };
  const onBattleComplete = (result) => {
    if (result.won) {
      setTotalPvPWins(w => w + 1);
      if (result.miniBoss) unlockAchievement("boss_kill");
      const bonus = result.miniBoss ? result.coins * 2 : result.coins;
      earnCoins(bonus);
      addXP(bonus * 2);
      notify(result.miniBoss ? `🔥 BOSS DEFEATED! +${bonus.toLocaleString()} coins!` : `Victory! +${bonus.toLocaleString()} coins`, "#0f0");
    } else {
      loseCoins(1000);
      if (coins >= 1000) notify("Defeat! -1,000 coins", "#f44");
    }
    setScreen("hub");
  };
  const games = [
    { id: "math", name: "MATH BLITZ", icon: "➗", color: "#0ff", desc: "6 challenge types, all-or-nothing" },
    { id: "trivia", name: "TRIVIA SURGE", icon: "🧠", color: "#f0f", desc: "8 categories, all-or-nothing" },
    { id: "memory", name: "MEMORY CORE", icon: "🔮", color: "#6ee7b7", desc: "8 themes, all-or-nothing" },
    { id: "word", name: "WORD HACK", icon: "📝", color: "#fbbf24", desc: "8 categories, earn per word" },
  ];
  const difficulties = [
    { id: "easy", label: "EASY", coins: "320-600/round", color: "#6ee7b7" },
    { id: "medium", label: "MEDIUM", coins: "720-1200/round", color: "#fbbf24" },
    { id: "hard", label: "HARD", coins: "1400-2200/round", color: "#f44" },
  ];
  // ─── SOCIAL SYSTEM ───
  const supabaseUrl = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_SUPABASE_URL : "";
  const supabaseKey = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : "";
  const sb = useRef(null);
  if (!sb.current && supabaseUrl && supabaseKey) sb.current = createBrowserClient(supabaseUrl, supabaseKey);

  const [friends, setFriends] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  // Calculate player power score from inventory
  const calculatePower = (inv) => {
    if (!inv || inv.length === 0) return 0;
    let totalPower = 0;
    inv.forEach(w => {
      const stats = getWeaponStats(w);
      // Base: damage + defense + speed
      let weaponPower = (stats.damage || 0) * 3 + (stats.defense || 0) * 2 + (stats.speed || 0);
      // Rarity multiplier
      const rarityMult = { common: 1, rare: 1.3, epic: 1.7, legendary: 2.2, mythic: 3, glitched: 4, pet: 1.5 }[w.rarity] || 1;
      weaponPower *= rarityMult;
      // Potion bonus
      const potions = w.potions || [];
      potions.forEach(p => { weaponPower += (p.merge || 1) * 15; });
      totalPower += weaponPower;
    });
    return Math.floor(totalPower);
  };

  const myPower = calculatePower(inventory);

  // Rank tiers
  const getRank = (power) => {
    if (power >= 20000) return { name: "GLITCH LORD", color: "#ff00ff", icon: "👾" };
    if (power >= 10000) return { name: "MYTHIC", color: "#fbbf24", icon: "💫" };
    if (power >= 5000) return { name: "LEGENDARY", color: "#f90", icon: "🔥" };
    if (power >= 2500) return { name: "EPIC", color: "#c084fc", icon: "⚡" };
    if (power >= 1000) return { name: "RARE", color: "#60a5fa", icon: "💎" };
    if (power >= 300) return { name: "NOVICE", color: "#0f0", icon: "🛡️" };
    return { name: "ROOKIE", color: "#888", icon: "👶" };
  };

  const [leaderboardCache, setLeaderboardCache] = useState({ data: null, timestamp: 0 });

  const loadLeaderboard = async (force = false) => {
    if (!sb.current) return;
    // Use cache if less than 60 seconds old
    const now = Date.now();
    if (!force && leaderboardCache.data && (now - leaderboardCache.timestamp) < 60000) {
      setLeaderboard(leaderboardCache.data);
      return;
    }
    try {
      const { data } = await sb.current.from("players").select("email, game_state").limit(100);
      if (data) {
        const ranked = data.map(p => {
          let inv = [];
          try {
            const s = typeof p.game_state === "string" ? JSON.parse(p.game_state) : p.game_state;
            inv = s?.inventory || [];
          } catch (e) {}
          return { email: p.email, power: calculatePower(inv), weapons: inv.length };
        }).filter(p => p.power > 0).sort((a, b) => b.power - a.power);
        setLeaderboard(ranked);
        setLeaderboardCache({ data: ranked, timestamp: now });
      }
    } catch (e) { console.error("Leaderboard error:", e); }
  };
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [friendEmail, setFriendEmail] = useState("");
  const [chatFriend, setChatFriend] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialTab, setSocialTab] = useState("leaderboard");
  const [adminPlayers, setAdminPlayers] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminExpanded, setAdminExpanded] = useState(null);

  const loadAdminData = async () => {
    if (!sb.current || user?.email !== "tanuj.garg@gmail.com") return;
    setAdminLoading(true);
    try {
      const { data } = await sb.current.from("players").select("*");
      if (data) {
        const parsed = data.map(p => {
          let state = {};
          try { state = typeof p.game_state === "string" ? JSON.parse(p.game_state) : (p.game_state || {}); } catch(e) {}
          return { ...p, parsed: state };
        });
        setAdminPlayers(parsed);
      }
    } catch(e) { console.error("Admin load error:", e); }
    setAdminLoading(false);
  };
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const chatEndRef = useRef(null);

  const loadSocialData = async () => {
    if (!sb.current || !user) return;
    setSocialLoading(true);
    try {
      const { data: allReqs } = await sb.current.from("friend_requests").select("*").or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
      if (allReqs) {
        setFriends(allReqs.filter(r => r.status === "accepted"));
        setPendingRequests(allReqs.filter(r => r.status === "pending" && r.receiver_id === user.id));
        setSentRequests(allReqs.filter(r => r.status === "pending" && r.sender_id === user.id));
      }
    } catch (e) { console.error("Social load error:", e); }
    setSocialLoading(false);
  };

  useEffect(() => { if (screen === "social") { loadSocialData(); loadLeaderboard(); } if (screen === "admin") { loadAdminData(); } }, [screen]);
  // Preload leaderboard shortly after game start so it's cached and ready
  useEffect(() => {
    if (!user || !sb.current) return;
    const timer = setTimeout(() => loadLeaderboard(), 2000);
    return () => clearTimeout(timer);
  }, [user]);

  const sendFriendRequest = async () => {
    if (!sb.current || !user || !friendEmail.trim()) return;
    if (friendEmail.trim().toLowerCase() === user.email.toLowerCase()) {
      notify("You can't add yourself!", "#f44"); return;
    }
    setSocialLoading(true);
    try {
      // Find the user by email in players table
      const { data: players } = await sb.current.from("players").select("user_id, email").eq("email", friendEmail.trim().toLowerCase());
      if (!players || players.length === 0) {
        notify("Player not found! They need to sign up first.", "#f44");
        setSocialLoading(false); return;
      }
      const target = players[0];
      const { error } = await sb.current.from("friend_requests").insert({
        sender_id: user.id,
        receiver_id: target.user_id,
        sender_email: user.email,
        receiver_email: target.email,
      });
      if (error) {
        if (error.code === "23505") notify("Request already sent!", "#f44");
        else notify("Error: " + error.message, "#f44");
      } else {
        notify(`Friend request sent to ${friendEmail}!`, "#0f0");
        setFriendEmail("");
        loadSocialData();
      }
    } catch (e) { notify("Error sending request", "#f44"); }
    setSocialLoading(false);
  };

  const respondToRequest = async (requestId, accept) => {
    if (!sb.current) return;
    const { error } = await sb.current.from("friend_requests").update({ status: accept ? "accepted" : "rejected" }).eq("id", requestId);
    if (!error) {
      notify(accept ? "Friend request accepted!" : "Request declined.", accept ? "#0f0" : "#888");
      loadSocialData();
    }
  };

  const loadChat = async (friend) => {
    if (!sb.current || !user) return;
    const friendId = friend.sender_id === user.id ? friend.receiver_id : friend.sender_id;
    setChatFriend({ ...friend, friendId, friendEmail: friend.sender_id === user.id ? friend.receiver_email : friend.sender_email });
    setSocialTab("chat");
    const { data } = await sb.current.from("messages").select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true }).limit(50);
    setChatMessages(data || []);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const sendMessage = async () => {
    if (!sb.current || !user || !chatFriend || !chatInput.trim()) return;
    const { error } = await sb.current.from("messages").insert({
      sender_id: user.id,
      receiver_id: chatFriend.friendId,
      content: chatInput.trim(),
    });
    if (!error) {
      setChatMessages(prev => [...prev, { sender_id: user.id, content: chatInput.trim(), created_at: new Date().toISOString() }]);
      setChatInput("");
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  // Poll for new messages every 3 seconds when in chat
  useEffect(() => {
    if (socialTab !== "chat" || !chatFriend || !sb.current) return;
    const poll = setInterval(async () => {
      const friendId = chatFriend.friendId;
      const { data } = await sb.current.from("messages").select("*")
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${user.id})`)
        .order("created_at", { ascending: true }).limit(50);
      if (data) setChatMessages(data);
    }, 3000);
    return () => clearInterval(poll);
  }, [socialTab, chatFriend]);

  const navItems = [
    { id: "hub", icon: "🏠", label: "HUB" },
    { id: "arena", icon: "🎮", label: "PLAY" },
    { id: "shop", icon: "🛒", label: "SHOP" },
    { id: "craft", icon: "⚒️", label: "CRAFT" },
    { id: "battle", icon: "⚔️", label: "PVP" },
    { id: "inventory", icon: "🎒", label: "GEAR" },
    { id: "social", icon: "👥", label: "SOCIAL" },
    ...(user?.email === "tanuj.garg@gmail.com" ? [{ id: "admin", icon: "🔧", label: "ADMIN" }] : []),
  ];
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #020108 0%, #0a0015 30%, #050510 100%)", color: "#f0f0f0", position: "relative", overflow: "hidden", fontSize: "1.05rem", }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a1a; }
        ::-webkit-scrollbar-thumb { background: #0ff; border-radius: 4px; }
        @keyframes scanline { 0% { top: -100%; } 100% { top: 100%; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes glitch { 0%, 100% { transform: translate(0); } 25% { transform: translate(-2px, 1px); } 75% { transform: translate(2px, -1px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes floatUp { 0% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } 50% { opacity: 1; transform: translateX(-50%) translateY(-20px) scale(1.3); } 100% { opacity: 0; transform: translateX(-50%) translateY(-45px) scale(0.8); } }
      `}</style>
      {}
      {notification && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 200, background: "#0a0a1a", border: `1px solid ${notification.color}`, borderRadius: 8, padding: "12px 24px", boxShadow: `0 0 20px ${notification.color}40`, }}>
          <NeonText color={notification.color} size="0.85rem">{notification.msg}</NeonText>
        </div>
      )}
      {}
      {showAchievement && (
        <div style={{ position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)", zIndex: 250, background: "linear-gradient(135deg, #0a0a2a, #1a0a3a)", border: "1px solid #fbbf24", borderRadius: 12, padding: "16px 24px", animation: "floatUp 3s forwards", textAlign: "center", minWidth: 220, }}>
          <div style={{ fontSize: "2rem", marginBottom: 6 }}>{showAchievement.icon}</div>
          <NeonText color="#fbbf24" size="0.7rem">🏆 ACHIEVEMENT UNLOCKED</NeonText>
          <NeonText color="#fff" size="1rem" style={{ margin: "6px 0" }}>{showAchievement.name}</NeonText>
          <div style={{ color: "#888", fontSize: "0.85rem" }}>{showAchievement.desc}</div>
          <NeonText color="#0f0" size="0.8rem" style={{ marginTop: 6 }}>+{showAchievement.reward.toLocaleString()} coins!</NeonText>
        </div>
      )}
      {}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a3e", background: "linear-gradient(90deg, #0a001a, #050510, #0a001a)", display: "flex", justifyContent: "space-between", alignItems: "center", }}>
        <div>
          <NeonText color="#f0f" size="1.3rem" style={{ fontWeight: 900 }}>
            EXP GRINDER
          </NeonText>
          <div style={{ fontSize: "0.8rem", color: "#555", letterSpacing: 2 }}>
            {user ? user.email?.split("@")[0] : "NEON ARENA v1.0"}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            {onSave && <button onClick={() => { const state = { coins, debt, xp, level, inventory, gamesLeft, streak, lastClaimDate, lastLoginDate, achievements, totalCoinsEarned, totalPvPWins, totalGamesWon, packsOpened, materials, potions, bounties, bountyDate, bountyAttempts }; onSave(JSON.stringify(state)); notify("💾 Game saved!", "#0f0"); }} style={{ background: "none", border: "1px solid #0f030", color: "#0f0", padding: "2px 8px", borderRadius: 4, fontSize: "0.5rem", cursor: "pointer", fontFamily: "'Orbitron', sans-serif" }}>💾 SAVE</button>}
            {onLogout && <button onClick={onLogout} style={{ background: "none", border: "1px solid #f4430", color: "#f44", padding: "2px 8px", borderRadius: 4, fontSize: "0.5rem", cursor: "pointer", fontFamily: "'Orbitron', sans-serif" }}>LOGOUT</button>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", color: "#888" }}>TOTAL LVL</div>
            <NeonText color="#0ff" size="1rem">{Math.floor(inventory.reduce((sum, w) => sum + (w.rarity === "pet" ? (6 + (w.merge || 1)) : (w.level || 1)), 0) / 2)}</NeonText>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", color: "#888" }}>COINS</div>
            <NeonText color="#fbbf24" size="1rem">💰 {coins.toLocaleString()}</NeonText>
            {debt > 0 && <div style={{ fontSize: "0.5rem", color: "#f44" }}>DEBT: {debt.toLocaleString()}</div>}
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", color: "#888" }}>GAMES</div>
            <NeonText color={totalGamesLeft === 0 ? "#f44" : "#0ff"} size="1rem">{totalGamesLeft}/20</NeonText>
          </div>
        </div>
      </div>
      {}
      <div style={{ padding: "0 20px", marginTop: 8 }}>
        <div style={{ background: "#111", borderRadius: 4, height: 6, overflow: "hidden" }}>
          <div style={{ width: `${(xp / xpNeeded) * 100}%`, height: "100%", background: "linear-gradient(90deg, #f0f, #0ff)", transition: "width 0.5s", }} />
        </div>
        <div style={{ fontSize: "0.75rem", color: "#555", textAlign: "right" }}>{xp}/{xpNeeded} XP</div>
      </div>
      {}
      <div style={{ padding: "16px 20px", paddingBottom: 80 }}>
        {}
        {screen === "hub" && (
          <div>
            <div style={{ textAlign: "center", margin: "30px 0" }}>
              <div style={{ fontSize: "3rem", animation: "float 3s ease-in-out infinite" }}>⚡</div>
              <NeonText size="1.5rem" color="#fff" style={{ fontWeight: 700 }}>WELCOME TO EXP GRINDER</NeonText>
              <p style={{ color: "#666", fontSize: "0.8rem", marginTop: 8 }}>
                {totalGamesLeft > 0 ? `${totalGamesLeft} game${totalGamesLeft !== 1 ? "s" : ""} remaining today (5 per category).` : "Daily limit reached. Return tomorrow!"}
              </p>
            </div>
            {}
            <button onClick={claimDaily} disabled={dailyClaimed} style={{
              width: "100%", padding: "14px 20px", marginBottom: 16, cursor: dailyClaimed ? "default" : "pointer",
              display: "flex", alignItems: "center", gap: 14,
              background: dailyClaimed ? "linear-gradient(135deg, #0a1a0a, #0d1117)" : "linear-gradient(135deg, #0a0a1a, #1a0a2a)",
              border: dailyClaimed ? "1px solid #0f030" : "1px solid #fbbf2440",
              borderRadius: 12,
              boxShadow: dailyClaimed ? "none" : "0 0 15px #fbbf2415",
            }}>
              <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: dailyClaimed ? "#00ff0011" : "#fbbf2415", borderRadius: 10, border: `1px solid ${dailyClaimed ? "#00ff0044" : "#fbbf2440"}`, fontSize: "1.4rem", }}>{dailyClaimed ? "✅" : "📅"}</div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <NeonText size="0.85rem" color={dailyClaimed ? "#0f0" : "#fbbf24"}>
                  {dailyClaimed ? "CHECK-IN CLAIMED!" : "DAILY CHECK-IN"}
                </NeonText>
                <div style={{ color: "#555", fontSize: "0.85rem", marginTop: 2 }}>
                  {dailyClaimed ? "Come back tomorrow for more!" : "Tap to collect 1,000 free coins"}
                </div>
              </div>
              {!dailyClaimed && <NeonText size="1rem" color="#fbbf24">💰 1,000</NeonText>}
            </button>
            {}
            {packResult ? (
              <div style={{ marginBottom: 16, padding: 20, textAlign: "center", background: "linear-gradient(135deg, #0a0a1a, #0d1117)", border: `1px solid ${packResult.color}40`, borderRadius: 12, boxShadow: `0 0 25px ${packResult.color}20`, }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>{packResult.icon}</div>
                <NeonText size="1.1rem" color={packResult.color}>{packResult.title}</NeonText>
                <div style={{ color: "#888", fontSize: "0.8rem", margin: "8px 0" }}>
                  {packResult.desc}
                </div>
                {packResult.type === "pet" && packResult.pet && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 8 }}>
                    <span style={{ fontSize: "1.5rem" }}>{packResult.pet.emoji}</span>
                    <div>
                      <NeonText size="0.85rem" color="#ff69b4">{packResult.pet.name}</NeonText>
                      <div style={{ color: "#888", fontSize: "0.8rem" }}>DMG: {packResult.pet.damage} • SPD: {packResult.pet.speed} • PET (can't level up)</div>
                    </div>
                  </div>
                )}
                {packResult.weapon && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 8 }}>
                    <span style={{ fontSize: "1.5rem" }}>{packResult.weapon.emoji}</span>
                    <div>
                      <NeonText size="0.85rem" color={RARITY_COLORS[packResult.weapon.rarity]}>{packResult.weapon.name}</NeonText>
                      <div style={{ color: "#888", fontSize: "0.8rem" }}>DMG: {packResult.weapon.damage} • SPD: {packResult.weapon.speed} • {packResult.weapon.rarity.toUpperCase()}</div>
                    </div>
                  </div>
                )}
                <button onClick={() => setPackResult(null)} style={{ marginTop: 12, background: `${packResult.color}15`, border: `1px solid ${packResult.color}40`, color: packResult.color, padding: "8px 20px", borderRadius: 6, cursor: "pointer", fontSize: "0.9rem", }}>DISMISS</button>
              </div>
            ) : (
              <button onClick={openPack} disabled={coins < 3000 || packOpening} style={{
                width: "100%", padding: "14px 20px", marginBottom: 16, cursor: coins < 3000 || packOpening ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: 14,
                background: packOpening ? "linear-gradient(135deg, #1a0a2a, #0d1117)" : "linear-gradient(135deg, #0a0a1a, #0d1117)",
                border: `1px solid ${coins < 3000 ? "#333" : "#c084fc40"}`,
                borderRadius: 12,
                boxShadow: coins >= 3000 && !packOpening ? "0 0 15px #c084fc15" : "none",
                opacity: coins < 3000 ? 0.5 : 1,
              }}>
                <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "#c084fc15", borderRadius: 10, border: "1px solid #c084fc40", fontSize: "1.4rem", animation: packOpening ? "pulse 0.8s infinite" : "none", }}>{packOpening ? "✨" : "🎁"}</div>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <NeonText size="0.85rem" color={coins < 3000 ? "#555" : "#c084fc"}>
                    {packOpening ? "OPENING..." : "ENERGY PACK"}
                  </NeonText>
                  <div style={{ color: "#555", fontSize: "0.8rem", marginTop: 2 }}>
                    {packOpening ? "Channeling energy..." : "60% bad • 15% refund • 10% pet • 15% good"}
                  </div>
                </div>
                {!packOpening && <NeonText size="0.9rem" color={coins < 3000 ? "#555" : "#fbbf24"}>💰 3,000</NeonText>}
              </button>
            )}
            {lastResult !== null && (
              <Panel style={{ marginBottom: 16, textAlign: "center" }}>
                <NeonText size="0.85rem" color="#0f0">LAST GAME: +{lastResult} coins earned!</NeonText>
              </Panel>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Panel style={{ cursor: "pointer", textAlign: "center" }} onClick={() => setScreen("arena")}>
                <div style={{ fontSize: "2rem" }}>🎮</div>
                <NeonText size="0.8rem" color="#0ff">PLAY GAMES</NeonText>
                <div style={{ color: "#555", fontSize: "0.85rem" }}>Earn coins</div>
              </Panel>
              <Panel style={{ cursor: "pointer", textAlign: "center" }} onClick={() => setScreen("battle")}>
                <div style={{ fontSize: "2rem" }}>⚔️</div>
                <NeonText size="0.8rem" color="#f0f">PVP BATTLE</NeonText>
                <div style={{ color: "#555", fontSize: "0.85rem" }}>Fight players</div>
              </Panel>
              <Panel style={{ cursor: "pointer", textAlign: "center" }} onClick={() => setScreen("shop")}>
                <div style={{ fontSize: "2rem" }}>🛒</div>
                <NeonText size="0.8rem" color="#fbbf24">WEAPON SHOP</NeonText>
                <div style={{ color: "#555", fontSize: "0.85rem" }}>{WEAPONS.length} weapons</div>
              </Panel>
              <Panel style={{ cursor: "pointer", textAlign: "center" }} onClick={() => setScreen("inventory")}>
                <div style={{ fontSize: "2rem" }}>🎒</div>
                <NeonText size="0.8rem" color="#6ee7b7">MY GEAR</NeonText>
                <div style={{ color: "#555", fontSize: "0.85rem" }}>{inventory.length} owned</div>
              </Panel>
            </div>
            {}
            {}
            <button onClick={() => setScreen("achievements")} style={{
              width: "100%", marginTop: 16, padding: "16px 20px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 14,
              background: "linear-gradient(135deg, #0a0a1a 0%, #0d1117 100%)",
              border: "1px solid #fbbf2430", borderRadius: 12,
            }}>
              <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", background: "#fbbf2415", borderRadius: 10, border: "1px solid #fbbf2440", fontSize: "1.6rem", }}>🏆</div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <NeonText size="0.9rem" color="#fbbf24">ACHIEVEMENTS</NeonText>
                <div style={{ color: "#888", fontSize: "0.8rem", marginTop: 2 }}>
                  {Object.keys(achievements).length}/{ACHIEVEMENTS.length} unlocked
                </div>
              </div>
              <NeonText size="1.2rem" color="#fbbf24">→</NeonText>
            </button>
            {}

            {/* ─── BOUNTY BOARD ─── */}
            <Panel style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <NeonText size="0.85rem" color="#ef4444">🎯 BOUNTY BOARD</NeonText>
                <span style={{ color: "#555", fontSize: "0.7rem", fontFamily: "'Orbitron', sans-serif" }}>DAILY TARGETS</span>
              </div>

              {/* Active bounty fight */}
              {activeBounty && bountyFightPhase ? (
                <div style={{ padding: 16, background: "#05050f", borderRadius: 10, border: "1px solid #ef444440" }}>
                  <div style={{ textAlign: "center", marginBottom: 10 }}>
                    <NeonText size="0.9rem" color={bountyFightPhase === "won" ? "#0f0" : bountyFightPhase === "lost" ? "#f44" : "#ef4444"}>
                      {bountyFightPhase === "fighting" ? `⚔️ VS ${activeBounty.name}` : bountyFightPhase === "won" ? `🎉 ${activeBounty.name} DEFEATED!` : `💀 YOU LOST!`}
                    </NeonText>
                  </div>
                  {/* Health bars */}
                  <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                        <span style={{ color: "#0ff", fontSize: "0.75rem" }}>YOU</span>
                        <span style={{ color: "#0ff", fontSize: "0.7rem" }}>{bountyFightHP.player}/100</span>
                      </div>
                      <div style={{ background: "#111", borderRadius: 4, height: 8, overflow: "hidden" }}>
                        <div style={{ width: `${bountyFightHP.player}%`, height: "100%", background: bountyFightHP.player > 50 ? "#0ff" : bountyFightHP.player > 25 ? "#f90" : "#f44", transition: "width 0.3s", borderRadius: 4 }} />
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                        <span style={{ color: "#f0f", fontSize: "0.75rem" }}>{activeBounty.name}</span>
                        <span style={{ color: "#f0f", fontSize: "0.7rem" }}>{bountyFightHP.enemy}/{bountyFightHP.enemyMax || 100}</span>
                      </div>
                      <div style={{ background: "#111", borderRadius: 4, height: 8, overflow: "hidden" }}>
                        <div style={{ width: `${(bountyFightHP.enemy / (bountyFightHP.enemyMax || 100)) * 100}%`, height: "100%", background: bountyFightHP.enemy > (bountyFightHP.enemyMax || 100) * 0.5 ? "#f0f" : bountyFightHP.enemy > (bountyFightHP.enemyMax || 100) * 0.25 ? "#f90" : "#f44", transition: "width 0.3s", borderRadius: 4 }} />
                      </div>
                    </div>
                  </div>
                  {bountyFightPhase === "fighting" && (
                    <div style={{ textAlign: "center", fontSize: "1.5rem", animation: "pulse 0.5s infinite" }}>⚔️</div>
                  )}
                  {bountyFightPhase === "won" && (
                    <div style={{ textAlign: "center" }}>
                      <NeonText size="1rem" color="#fbbf24">+{activeBounty.reward.toLocaleString()} coins!</NeonText>
                      <button onClick={() => { setActiveBounty(null); setBountyFightPhase(null); }} style={{
                        marginTop: 10, padding: "8px 20px", borderRadius: 6, cursor: "pointer",
                        background: "#0f020", border: "1px solid #0f050", color: "#0f0",
                        fontSize: "0.9rem", fontFamily: "'Orbitron', sans-serif",
                      }}>COLLECT</button>
                    </div>
                  )}
                  {bountyFightPhase === "lost" && (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ color: "#888", fontSize: "0.8rem" }}>Your best weapon lost 3 levels or you gained debt!</div>
                      <button onClick={() => { setActiveBounty(null); setBountyFightPhase(null); }} style={{
                        marginTop: 10, padding: "8px 20px", borderRadius: 6, cursor: "pointer",
                        background: "#f4420", border: "1px solid #f4450", color: "#f44",
                        fontSize: "0.9rem", fontFamily: "'Orbitron', sans-serif",
                      }}>BACK</button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div style={{ color: "#888", fontSize: "0.75rem", marginBottom: 10 }}>Defeat these targets for bonus rewards!</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {bounties.map(bounty => (
                      <div key={bounty.id} style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                        background: bounty.completed ? "#0f008" : "#05050f", borderRadius: 8,
                        border: `1px solid ${bounty.completed ? "#0f030" : "#ef444430"}`,
                        opacity: bounty.completed ? 0.6 : 1,
                      }}>
                        <div style={{
                          width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                          background: bounty.completed ? "#0f015" : "#ef444415", borderRadius: 8,
                          border: `1px solid ${bounty.completed ? "#0f040" : "#ef444440"}`, fontSize: "1.2rem",
                        }}>{bounty.completed ? "✅" : "🎯"}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: bounty.completed ? "#0f0" : "#ef4444", fontSize: "0.8rem", fontFamily: "'Orbitron', sans-serif" }}>
                            {bounty.completed ? `${bounty.name} ✓` : bounty.name}
                          </div>
                          <div style={{ color: "#666", fontSize: "0.7rem" }}>
                            {bounty.weapon.emoji} {bounty.weapon.name} LV{bounty.weapon.level} ({bounty.weapon.rarity}) • 💰 {bounty.reward.toLocaleString()}
                          </div>
                        </div>
                        {bounty.completed ? (
                          <span style={{ color: "#0f0", fontSize: "0.75rem", fontFamily: "'Orbitron', sans-serif" }}>DONE</span>
                        ) : (bountyAttempts[bounty.id] || 0) >= 2 ? (
                          <span style={{ color: "#f44", fontSize: "0.7rem", fontFamily: "'Orbitron', sans-serif" }}>0 LEFT</span>
                        ) : (
                          <div style={{ textAlign: "center" }}>
                            <button onClick={() => startBountyFight(bounty)} style={{
                              padding: "6px 14px", borderRadius: 6, cursor: "pointer",
                              background: "#ef444420", border: "1px solid #ef444450",
                              color: "#ef4444", fontSize: "0.85rem", fontFamily: "'Orbitron', sans-serif",
                            }}>⚔️ FIGHT</button>
                            <div style={{ color: "#666", fontSize: "0.45rem", marginTop: 2 }}>{2 - (bountyAttempts[bounty.id] || 0)}/2</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Panel>

            {/* ─── COIN FLIP ─── */}
            <Panel style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <NeonText size="0.85rem" color="#fbbf24">🪙 COIN FLIP</NeonText>
                <span style={{ color: coinFlipsUsed >= 2 ? "#f44" : "#0f0", fontSize: "0.7rem", fontFamily: "'Orbitron', sans-serif" }}>
                  {coinFlipsUsed >= 2 ? "💰 2,000/flip" : `${2 - coinFlipsUsed} FREE LEFT`}
                </span>
              </div>
              <div style={{ color: "#888", fontSize: "0.75rem", marginBottom: 12 }}>
                Heads = double. Tails = lose all. Keep flipping to multiply or cash out!
              </div>
              {coinFlipPhase === "flipping" ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ fontSize: "2.5rem", animation: "pulse 0.3s infinite" }}>🪙</div>
                  <NeonText size="0.9rem" color="#fbbf24">FLIPPING...</NeonText>
                </div>
              ) : coinFlipPhase === "won" ? (
                <div style={{ textAlign: "center", padding: "12px 0" }}>
                  <div style={{ fontSize: "2rem", marginBottom: 6 }}>🎉</div>
                  <NeonText size="1.2rem" color="#0f0">POT: {coinFlipPot.toLocaleString()} coins</NeonText>
                  <div style={{ color: "#888", fontSize: "0.8rem", margin: "8px 0" }}>Double to {(coinFlipPot * 2).toLocaleString()} or cash out?</div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10 }}>
                    <button onClick={cashOutFlip} style={{
                      padding: "10px 20px", borderRadius: 8, cursor: "pointer",
                      background: "#0f020", border: "1px solid #0f050",
                      color: "#0f0", fontSize: "0.85rem", fontFamily: "'Orbitron', sans-serif",
                    }}>💰 CASH OUT</button>
                    <button onClick={doubleOrNothing} style={{
                      padding: "10px 20px", borderRadius: 8, cursor: "pointer",
                      background: "#f4420", border: "1px solid #f4450",
                      color: "#f44", fontSize: "0.85rem", fontFamily: "'Orbitron', sans-serif",
                    }}>🔥 DOUBLE OR NOTHING</button>
                  </div>
                </div>
              ) : coinFlipPhase === "lost" ? (
                <div style={{ textAlign: "center", padding: "12px 0" }}>
                  <div style={{ fontSize: "2rem", marginBottom: 6 }}>💀</div>
                  <NeonText size="1rem" color="#f44">YOU LOST EVERYTHING!</NeonText>
                  <button onClick={() => setCoinFlipPhase("pick")} style={{
                    marginTop: 10, padding: "8px 20px", borderRadius: 6, cursor: "pointer",
                    background: "#fbbf2420", border: "1px solid #fbbf2440",
                    color: "#fbbf24", fontSize: "0.9rem", fontFamily: "'Orbitron', sans-serif",
                  }}>TRY AGAIN</button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[1000, 2000, 3000, 5000].map(amt => {
                    const fee = coinFlipsUsed >= 2 ? 2000 : 0;
                    const canAfford = coins >= amt + fee;
                    return (
                      <button key={amt} onClick={() => flipCoin(amt)} disabled={!canAfford} style={{
                        padding: "12px 8px", borderRadius: 8, cursor: canAfford ? "pointer" : "not-allowed",
                        background: canAfford ? "#fbbf2410" : "#111",
                        border: `1px solid ${canAfford ? "#fbbf2440" : "#222"}`,
                        color: canAfford ? "#fbbf24" : "#333",
                        fontSize: "0.85rem", fontFamily: "'Orbitron', sans-serif",
                        opacity: !canAfford ? 0.4 : 1,
                      }}>💰 {amt.toLocaleString()}</button>
                    );
                  })}
                </div>
              )}
            </Panel>

            <Panel style={{ marginTop: 16 }}>
              <NeonText size="0.75rem" color="#888">PLAYER STATS</NeonText>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 10 }}>
                <div style={{ textAlign: "center" }}>
                  <NeonText size="1.2rem" color="#f0f">{Math.floor(inventory.reduce((sum, w) => sum + (w.rarity === "pet" ? (6 + (w.merge || 1)) : (w.level || 1)), 0) / 2)}</NeonText>
                  <div style={{ color: "#555", fontSize: "0.8rem" }}>Total Level</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <NeonText size="1.2rem" color="#fbbf24">{coins.toLocaleString()}</NeonText>
                  <div style={{ color: "#555", fontSize: "0.8rem" }}>Coins</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <NeonText size="1.2rem" color="#0ff">{inventory.length}</NeonText>
                  <div style={{ color: "#555", fontSize: "0.8rem" }}>Weapons</div>
                </div>
              </div>
            </Panel>
            {}
            {streak > 1 && (
              <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, background: `linear-gradient(135deg, ${streak >= 7 ? "#fbbf2410" : "#00ffff00"}, #0a0a1a)`, border: `1px solid ${streak >= 7 ? "#fbbf2440" : streak >= 3 ? "#00ffff33" : "#1a1a3e"}`, display: "flex", alignItems: "center", gap: 10, }}>
                <div style={{ fontSize: "1.3rem" }}>{streak >= 7 ? "🔥" : streak >= 3 ? "⚡" : "📅"}</div>
                <div style={{ flex: 1 }}>
                  <NeonText size="0.75rem" color={streak >= 7 ? "#fbbf24" : "#0ff"}>{streak}-DAY STREAK!</NeonText>
                  <div style={{ color: "#888", fontSize: "0.75rem" }}>
                    Check-in bonus: +{streak >= 7 ? "5,000" : streak >= 5 ? "3,000" : streak >= 3 ? "2,000" : "0"} extra coins
                  </div>
                </div>
              </div>
            )}
            {}
            <div style={{ marginTop: 12, padding: 16, borderRadius: 12, background: "linear-gradient(135deg, #0a0a1a, #0d1117)", border: "1px solid #fbbf2430", }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <NeonText size="0.8rem" color="#fbbf24">🎡 LUCKY WHEEL</NeonText>
                <span style={{ color: "#f44", fontSize: "0.7rem" }}>⚠ RISK & REWARD</span>
              </div>
              {wheelResult && !wheelSpinning ? (
                <div style={{ textAlign: "center", padding: "8px 0" }}>
                  <NeonText size="1rem" color={wheelResult.color}>{wheelResult.label}</NeonText>
                  <button onClick={() => { setWheelResult(null); spinWheel(); }} style={{ marginTop: 10, width: "100%", padding: 10, borderRadius: 8, cursor: "pointer", background: "linear-gradient(135deg, #fbbf2420, #0a0a1a)", border: "1px solid #fbbf2440", color: "#fbbf24", fontSize: "0.8rem", }}>🎡 SPIN AGAIN</button>
                </div>
              ) : (
                <button onClick={spinWheel} disabled={wheelSpinning} style={{
                  width: "100%", padding: 12, borderRadius: 8, cursor: wheelSpinning ? "wait" : "pointer",
                  background: wheelSpinning ? "linear-gradient(135deg, #fbbf2430, #f0f20)" : "linear-gradient(135deg, #fbbf2420, #0a0a1a)",
                  border: `1px solid ${wheelSpinning ? "#fbbf24" : "#1a1a3e"}`,
                  color: wheelSpinning ? "#fbbf24" : "#ccc", fontSize: "0.85rem",
                  animation: wheelSpinning ? "pulse 0.5s infinite" : "none",
                }}>
                  {wheelSpinning ? "🎡 SPINNING..." : "🎡 SPIN (free — win or lose!)"}
                </button>
              )}
            </div>
            {}
            <button onClick={buyCoinDoubler} disabled={coinDoubler || coins < 2000} style={{
              width: "100%", marginTop: 12, padding: "12px 16px",
              display: "flex", alignItems: "center", gap: 12, cursor: coinDoubler ? "default" : coins < 2000 ? "not-allowed" : "pointer",
              background: coinDoubler ? "linear-gradient(135deg, #0a1a0a, #0d1117)" : "linear-gradient(135deg, #0a0a1a, #0d1117)",
              border: `1px solid ${coinDoubler ? "#00ff0044" : "#fbbf2430"}`,
              borderRadius: 12,
              opacity: !coinDoubler && coins < 2000 ? 0.5 : 1,
            }}>
              <div style={{ fontSize: "1.3rem" }}>{coinDoubler ? "✅" : "⚡"}</div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <NeonText size="0.8rem" color={coinDoubler ? "#0f0" : "#fbbf24"}>
                  {coinDoubler ? "DOUBLER ACTIVE!" : "COIN DOUBLER"}
                </NeonText>
                <div style={{ color: "#bbb", fontSize: "0.75rem", marginTop: 2 }}>
                  {coinDoubler ? "Your next game win pays 2x coins" : "Pay 2,000 to double next game earnings"}
                </div>
              </div>
              {!coinDoubler && <NeonText size="0.8rem" color="#fbbf24">💰 2,000</NeonText>}
            </button>
            {}
            <div style={{ marginTop: 12, padding: 16, borderRadius: 12, background: "linear-gradient(135deg, #0a0a1a, #0d1117)", border: "1px solid #6ee7b730", }}>
              <NeonText size="0.8rem" color="#6ee7b7">♻️ RECYCLER</NeonText>
              <div style={{ color: "#bbb", fontSize: "0.75rem", margin: "6px 0 10px" }}>
                Trade 3 weapons of the same tier → get 1 random weapon from the next tier up
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["common", "rare", "epic", "legendary", "mythic"].map(r => {
                  const count = inventory.filter(w => w.rarity === r).length;
                  return (
                    <button key={r} onClick={() => recycleWeapons(r)} disabled={count < 3} style={{
                      padding: "6px 10px", borderRadius: 6, cursor: count >= 3 ? "pointer" : "not-allowed",
                      background: count >= 3 ? `${RARITY_COLORS[r]}15` : "#0a0a1a",
                      border: `1px solid ${count >= 3 ? RARITY_COLORS[r] + "50" : "#222"}`,
                      color: count >= 3 ? RARITY_COLORS[r] : "#444",
                      fontSize: "0.75rem",
                    }}>
                      {r.toUpperCase()} ({count}/3)
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─── SHOP ─── */}
        {screen === "shop" && (
          <div>
            <NeonText size="1.2rem" color="#fbbf24">🛒 WEAPON SHOP</NeonText>
            <p style={{ color: "#888", fontSize: "0.9rem", margin: "8px 0 16px" }}>
              {WEAPONS.length} weapons available. Buy, collect, dominate.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["common", "rare", "epic", "legendary", "mythic", "glitched"].map(rarity => (
                <div key={rarity}>
                  <NeonText size="0.75rem" color={RARITY_COLORS[rarity]} style={{ marginBottom: 6, textTransform: "uppercase" }}>
                    ── {rarity} ──
                  </NeonText>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {WEAPONS.filter(w => w.rarity === rarity).map(w => {
                      const owned = inventory.find(i => i.id === w.id);
                      return (
                        <div key={w.id} style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                          background: owned ? "#0f008" : "#05050f", borderRadius: 8,
                          border: `1px solid ${owned ? "#0f030" : RARITY_COLORS[rarity] + "20"}`,
                        }}>
                          <span style={{ fontSize: "1.3rem" }}>{w.emoji}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ color: RARITY_COLORS[rarity], fontSize: "0.8rem", fontFamily: "'Orbitron', sans-serif" }}>{w.name}</div>
                            <div style={{ color: "#666", fontSize: "0.75rem" }}>
                              DMG: {w.damage} • SPD: {w.speed}{(w.type === "defense" || w.type === "both") ? ` • DEF: ${w.type === "defense" ? 8 : 5}` : ""} • {w.type === "attack" ? "⚔ ATK" : w.type === "defense" ? "🛡 DEF" : "⚔🛡 BOTH"}
                            </div>
                          </div>
                          {owned ? (
                            <span style={{ color: "#0f0", fontSize: "0.75rem", fontFamily: "'Orbitron', sans-serif" }}>OWNED</span>
                          ) : (
                            <button onClick={() => buyWeapon(w)} disabled={coins < w.price} style={{
                              padding: "6px 12px", borderRadius: 6, cursor: coins >= w.price ? "pointer" : "not-allowed",
                              background: coins >= w.price ? `${RARITY_COLORS[rarity]}15` : "#111",
                              border: `1px solid ${coins >= w.price ? RARITY_COLORS[rarity] + "40" : "#222"}`,
                              color: coins >= w.price ? "#fbbf24" : "#333",
                              fontSize: "0.85rem", fontFamily: "'Orbitron', sans-serif",
                            }}>💰 {w.price.toLocaleString()}</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── BATTLE ─── */}
        {screen === "battle" && (
          <div>
            <NeonText size="1.2rem" color="#f0f">⚔️ PVP ARENA</NeonText>
            <p style={{ color: "#666", fontSize: "0.8rem", margin: "8px 0 16px" }}>
              Challenge other grinders in combat.
            </p>
            {inventory.length === 0 ? (
              <Panel style={{ textAlign: "center", padding: 30 }}>
                <div style={{ fontSize: "2rem", marginBottom: 10 }}>🗡️</div>
                <NeonText size="0.9rem" color="#888">You need a weapon to battle!</NeonText>
                <div style={{ color: "#555", fontSize: "0.85rem", marginTop: 6 }}>Buy one from the Shop first.</div>
              </Panel>
            ) : (
              <Panel>
                <PvPBattle playerWeapons={inventory} onComplete={onBattleComplete} />
              </Panel>
            )}
          </div>
        )}

        {screen === "craft" && (
          <div>
            <NeonText size="1.2rem" color="#f90">⚒️ CRAFTING FORGE</NeonText>
            <p style={{ color: "#bbb", fontSize: "0.9rem", margin: "8px 0 16px" }}>
              Buy materials or earn them by winning mini-games!
            </p>
            {}
            <Panel style={{ marginBottom: 16 }}>
              <NeonText size="0.8rem" color="#888">YOUR MATERIALS</NeonText>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 10 }}>
                {MATERIALS.map(mat => (
                  <div key={mat.id} style={{ textAlign: "center", padding: "8px 4px", background: "#05050f", borderRadius: 8, border: `1px solid ${(materials[mat.id] || 0) > 0 ? mat.color + "40" : "#1a1a3e"}` }}>
                    <div style={{ fontSize: "1.2rem" }}>{mat.emoji}</div>
                    <NeonText size="0.7rem" color={(materials[mat.id] || 0) > 0 ? mat.color : "#555"}>{materials[mat.id] || 0}</NeonText>
                    <div style={{ color: "#555", fontSize: "0.45rem" }}>{mat.name.split(" ")[0]}</div>
                  </div>
                ))}
              </div>
            </Panel>
            {}
            <Panel style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <NeonText size="0.8rem" color="#fbbf24">🛒 BUY MATERIALS</NeonText>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {MATERIALS.map(mat => (
                  <div key={mat.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#05050f", borderRadius: 8, border: `1px solid ${mat.color}20`, }}>
                    <span style={{ fontSize: "1.2rem" }}>{mat.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: mat.color, fontSize: "0.8rem" }}>{mat.name}</div>
                      <div style={{ color: "#666", fontSize: "0.7rem" }}>{mat.desc}</div>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[1, 5, 10].map(qty => (
                        <button key={qty} onClick={() => buyMaterial(mat.id, qty)} disabled={coins < mat.price * qty} style={{
                          padding: "4px 8px", borderRadius: 4, cursor: coins >= mat.price * qty ? "pointer" : "not-allowed",
                          background: coins >= mat.price * qty ? `${mat.color}15` : "#111",
                          border: `1px solid ${coins >= mat.price * qty ? mat.color + "40" : "#222"}`,
                          color: coins >= mat.price * qty ? mat.color : "#333",
                          fontSize: "0.7rem",
                        }}>
                          {qty}x 💰{(mat.price * qty).toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Potion Crafting */}
            <Panel style={{ marginTop: 16 }}>
              <NeonText size="0.8rem" color="#c084fc">🧪 CRAFT POTIONS</NeonText>
              <div style={{ color: "#bbb", fontSize: "0.75rem", margin: "6px 0 12px" }}>Craft potions, merge 2 of the same type to power up (max M5). Apply up to 2 per weapon.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {POTIONS.map(pot => {
                  const canCraftPot = Object.entries(pot.craft).every(([m, q]) => (materials[m] || 0) >= q);
                  return (
                    <div key={pot.id} style={{
                      padding: 12, borderRadius: 10,
                      background: canCraftPot ? `${pot.color}08` : "#05050f",
                      border: `1px solid ${canCraftPot ? pot.color + "40" : "#1a1a3e"}`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: "1.4rem" }}>{pot.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <NeonText size="0.8rem" color={pot.color}>{pot.name}</NeonText>
                          <div style={{ color: "#888", fontSize: "0.7rem" }}>{pot.desc}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                        {Object.entries(pot.craft).map(([matId, qty]) => {
                          const mat = MATERIALS.find(m => m.id === matId);
                          const have = materials[matId] || 0;
                          return (
                            <span key={matId} style={{
                              padding: "2px 6px", borderRadius: 4, fontSize: "0.75rem",
                              background: have >= qty ? "#0f010" : "#f4408",
                              border: `1px solid ${have >= qty ? "#0f030" : "#f4420"}`,
                              color: have >= qty ? "#0f0" : "#f44", fontFamily: "'Orbitron', sans-serif",
                            }}>{mat?.emoji} {have}/{qty}</span>
                          );
                        })}
                      </div>
                      <div style={{ display: "flex", gap: 6, fontSize: "0.5rem", color: "#666", marginBottom: 8, flexWrap: "wrap" }}>
                        {pot.effects.map((e, i) => (
                          <span key={i} style={{ padding: "2px 6px", borderRadius: 4, background: "#111", border: "1px solid #222" }}>
                            M{e.merge}: {e.burnDmg ? `+${e.burnDmg} burn` : e.slowPct ? `-${e.slowPct}% DMG` : e.stunPct ? `${e.stunPct}% stun` : `+${e.poisonDmg} stack`}
                          </span>
                        ))}
                      </div>
                      <button onClick={() => craftPotion(pot.id)} disabled={!canCraftPot} style={{
                        width: "100%", padding: 8, borderRadius: 6,
                        background: canCraftPot ? `${pot.color}20` : "#111",
                        border: `1px solid ${canCraftPot ? pot.color : "#222"}`,
                        color: canCraftPot ? pot.color : "#333",
                        fontSize: "0.9rem", fontFamily: "'Orbitron', sans-serif", cursor: canCraftPot ? "pointer" : "not-allowed",
                      }}>🧪 CRAFT {pot.name.toUpperCase()}</button>
                    </div>
                  );
                })}
              </div>
            </Panel>

            {/* Potion Inventory + Merge + Apply */}
            {potions.length > 0 && (
              <Panel style={{ marginTop: 16 }}>
                <NeonText size="0.8rem" color="#c084fc">🧪 YOUR POTIONS ({potions.length})</NeonText>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                  {potions.map((pot, idx) => {
                    const potion = POTIONS.find(p => p.id === pot.id);
                    const eff = getPotionEffect(pot.id, pot.merge);
                    const canMerge = potions.filter((p, i) => i !== idx && p.id === pot.id).length > 0 && pot.merge < 5;
                    return (
                      <div key={idx} style={{
                        padding: 10, borderRadius: 8,
                        background: "#05050f", border: `1px solid ${potion.color}30`,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: "1.3rem" }}>{potion.emoji}</span>
                          <div style={{ flex: 1 }}>
                            <NeonText size="0.75rem" color={potion.color}>{potion.name} M{pot.merge}{pot.merge >= 5 ? " (MAX)" : ""}</NeonText>
                            <div style={{ color: "#888", fontSize: "0.7rem" }}>
                              {eff.burnDmg ? `+${eff.burnDmg} burn/turn` : eff.slowPct ? `-${eff.slowPct}% enemy DMG` : eff.stunPct ? `${eff.stunPct}% stun` : `+${eff.poisonDmg} stack/turn`}
                            </div>
                          </div>
                          {canMerge && (
                            <button onClick={() => {
                              const other = potions.findIndex((p, i) => i !== idx && p.id === pot.id);
                              if (other >= 0) mergePotion(idx, other);
                            }} style={{
                              padding: "4px 10px", borderRadius: 4, fontSize: "0.7rem",
                              background: `${potion.color}15`, border: `1px solid ${potion.color}40`,
                              color: potion.color, cursor: "pointer", fontFamily: "'Orbitron', sans-serif",
                            }}>🔀 MERGE → M{Math.min(pot.merge + 1, 5)}</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Apply to weapon */}
                {inventory.filter(w => w.rarity !== "pet").length > 0 && (
                  <div style={{ marginTop: 12, padding: 10, background: "#0a0a2a", borderRadius: 8, border: "1px solid #1a1a3e" }}>
                    <NeonText size="0.7rem" color="#888">APPLY POTION TO WEAPON</NeonText>
                    <div style={{ color: "#666", fontSize: "0.7rem", margin: "4px 0 8px" }}>Max 2 per weapon. Same type can't stack.</div>
                    {potions.map((pot, pIdx) => {
                      const potion = POTIONS.find(p => p.id === pot.id);
                      const eligible = inventory.filter(w => w.rarity !== "pet" && ((w.potions || []).length < 2) && !(w.potions || []).find(p => p.id === pot.id));
                      if (eligible.length === 0) return null;
                      return (
                        <div key={pIdx} style={{ marginBottom: 8 }}>
                          <div style={{ color: potion.color, fontSize: "0.85rem", fontFamily: "'Orbitron', sans-serif", marginBottom: 4 }}>
                            {potion.emoji} {potion.name} M{pot.merge} →
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {eligible.map(w => (
                              <button key={w.id} onClick={() => applyPotion(pIdx, w.id)} style={{
                                padding: "4px 8px", borderRadius: 4, fontSize: "0.7rem",
                                background: `${RARITY_COLORS[w.rarity]}10`, border: `1px solid ${RARITY_COLORS[w.rarity]}30`,
                                color: RARITY_COLORS[w.rarity], cursor: "pointer", fontFamily: "'Orbitron', sans-serif",
                              }}>{w.emoji} {w.name}</button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Panel>
            )}
          </div>
        )}
        {}
        {screen === "arena" && !playing && (
          <div>
            <NeonText size="1.2rem" color="#0ff">🎮 GAME ARENA</NeonText>
            <p style={{ color: "#666", fontSize: "0.8rem", margin: "8px 0 16px" }}>
              {totalGamesLeft > 0 ? "Choose a mini-game to play. 4 games per category." : "All games used up for today!"}
            </p>
            {!selectedGame && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {games.map(g => {
                  const left = gamesLeft[g.id] || 0;
                  return (
                  <Panel key={g.id} style={{ cursor: left > 0 ? "pointer" : "not-allowed", textAlign: "center", opacity: left > 0 ? 1 : 0.35 }}
                    onClick={() => { if (left <= 0) return; if (g.id === "math" || g.id === "trivia" || g.id === "word" || g.id === "memory") { startGame(g.id, "custom"); } else { setSelectedGame(g.id); } }}>
                    <div style={{ fontSize: "2rem", margin: "8px 0" }}>{g.icon}</div>
                    <NeonText size="0.8rem" color={g.color}>{g.name}</NeonText>
                    <div style={{ color: "#555", fontSize: "0.85rem", marginTop: 4 }}>{g.desc}</div>
                    <div style={{ marginTop: 6, fontSize: "0.75rem", color: left === 0 ? "#f44" : left <= 1 ? "#fbbf24" : "#0ff", }}>{left === 0 ? "NO GAMES LEFT" : `${left}/5 remaining`}</div>
                  </Panel>
                  );
                })}
              </div>
            )}
            {selectedGame && !difficulty && (
              <div>
                <GlowButton onClick={() => setSelectedGame(null)} color="#888" style={{ marginBottom: 16, fontSize: "0.85rem" }}>← BACK</GlowButton>
                <NeonText size="1rem" color="#fff">SELECT DIFFICULTY</NeonText>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                  {difficulties.map(d => (
                    <Panel key={d.id} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                      onClick={() => startGame(selectedGame, d.id)}>
                      <div>
                        <NeonText size="0.9rem" color={d.color}>{d.label}</NeonText>
                        <div style={{ color: "#555", fontSize: "0.85rem" }}>{d.coins}</div>
                      </div>
                      <NeonText size="1.2rem" color={d.color}>→</NeonText>
                    </Panel>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {}
        {playing && (
          <div>
            <Panel>
              {selectedGame === "math" && <MathGame onComplete={onGameComplete} />}
              {selectedGame === "trivia" && <TriviaGame onComplete={onGameComplete} />}
              {selectedGame === "word" && <WordGame onComplete={onGameComplete} />}
              {selectedGame === "memory" && <MemoryGame onComplete={onGameComplete} />}
            </Panel>
          </div>
        )}
        {}
        {screen === "achievements" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <button onClick={() => setScreen("hub")} style={{ background: "none", border: "1px solid #333", color: "#888", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: "0.85rem", }}>← HUB</button>
              <NeonText size="1.2rem" color="#fbbf24">🏆 ACHIEVEMENTS</NeonText>
              <span style={{ color: "#888", fontSize: "0.85rem" }}>
                {Object.keys(achievements).length}/{ACHIEVEMENTS.length}
              </span>
            </div>
            {}
            <div style={{ marginBottom: 20 }}>
              <div style={{ background: "#111", borderRadius: 6, height: 8, overflow: "hidden", border: "1px solid #222" }}>
                <div style={{ width: `${(Object.keys(achievements).length / ACHIEVEMENTS.length) * 100}%`, height: "100%", background: "linear-gradient(90deg, #fbbf24, #f0f)", borderRadius: 6, transition: "width 0.5s", }} />
              </div>
            </div>
            {}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ACHIEVEMENTS.map(ach => {
                const unlocked = achievements[ach.id];
                return (
                  <div key={ach.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: unlocked ? "#fbbf2408" : "#0a0a1a", borderRadius: 10, border: `1px solid ${unlocked ? "#fbbf2440" : "#1a1a3e"}`, opacity: unlocked ? 1 : 0.5, }}>
                    <div style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", borderRadius: 8, background: unlocked ? "#fbbf2415" : "#111", border: `1px solid ${unlocked ? "#fbbf2440" : "#222"}`, }}>{unlocked ? ach.icon : "🔒"}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: unlocked ? "#fff" : "#555", fontSize: "0.85rem", }}>{ach.name}</div>
                      <div style={{ color: unlocked ? "#ccc" : "#666", fontSize: "0.8rem", marginTop: 2 }}>{ach.desc}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {unlocked ? (
                        <NeonText size="0.65rem" color="#0f0">✅ DONE</NeonText>
                      ) : (
                        <NeonText size="0.65rem" color="#fbbf24" glow={false}>💰 {ach.reward.toLocaleString()}</NeonText>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {screen === "inventory" && (
          <div>
            <NeonText size="1.2rem" color="#6ee7b7">🎒 MY GEAR</NeonText>
            <p style={{ color: "#666", fontSize: "0.8rem", margin: "8px 0 16px" }}>
              {inventory.length} weapon{inventory.length !== 1 ? "s" : ""} in your arsenal.
            </p>
            {inventory.length === 0 ? (
              <Panel style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔒</div>
                <NeonText size="0.9rem" color="#555">ARSENAL EMPTY</NeonText>
                <p style={{ color: "#444", fontSize: "0.8rem", marginTop: 8 }}>Visit the shop to buy weapons.</p>
                <GlowButton onClick={() => setScreen("shop")} color="#fbbf24" style={{ marginTop: 16 }}>GO TO SHOP</GlowButton>
              </Panel>
            ) : selectedGearId ? (() => {
              const w = inventory.find(i => i.id === selectedGearId);
              if (!w) return null;
              const stats = getWeaponStats(w);
              const cost = getUpgradeCost(w.level);
              return (
                <div>
                  <button onClick={() => { setSelectedGearId(null); setConfirmSell(false); setMergeMode(false); }} style={{
                    background: "none", border: "1px solid #333", color: "#888", padding: "6px 14px",
                    borderRadius: 6, cursor: "pointer", fontSize: "0.85rem", marginBottom: 16,
                  }}>← BACK</button>
                  <Panel style={{ textAlign: "center" }}>
                    <div style={{
                      width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center",
                      background: `${RARITY_COLORS[w.rarity]}15`, borderRadius: 14,
                      border: `2px solid ${RARITY_COLORS[w.rarity]}`, fontSize: "2.5rem",
                      boxShadow: `0 0 25px ${RARITY_COLORS[w.rarity]}30`,
                      margin: "0 auto 16px",
                    }}>{w.emoji}</div>
                    <NeonText size="1.2rem" color={RARITY_COLORS[w.rarity]}>{w.name}</NeonText>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
                      <span style={{
                        fontSize: "0.75rem", color: RARITY_COLORS[w.rarity], padding: "2px 8px",
                        border: `1px solid ${RARITY_COLORS[w.rarity]}40`, borderRadius: 4,
                        textTransform: "uppercase",
                      }}>{w.rarity}</span>
                      {w.rarity === "pet" ? (
                        <span style={{
                          fontSize: "0.75rem", color: "#ff69b4", padding: "2px 8px",
                          background: "#ff69b410", border: "1px solid #ff69b440", borderRadius: 4,
                        }}>MERGE {w.merge || 1}</span>
                      ) : (
                        <span style={{
                          fontSize: "0.75rem", color: "#0ff", padding: "2px 8px",
                          background: "#0ff10", border: "1px solid #0ff40", borderRadius: 4,
                        }}>LVL {w.level}</span>
                      )}
                      <span style={{
                        fontSize: "0.75rem", color: "#888", padding: "2px 8px",
                        border: "1px solid #333", borderRadius: 4,
                      }}>{w.type === "attack" ? "⚔ ATK" : w.type === "defense" ? "🛡 DEF" : "⚔🛡 BOTH"}</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: (stats.attack > 0 && stats.defense > 0) ? "1fr 1fr" : (stats.defense > 0 || stats.attack > 0) ? "1fr 1fr 1fr" : "1fr 1fr", gap: 12, margin: "20px 0" }}>
                      <div style={{ background: "#0a0a2a", borderRadius: 8, padding: "14px 10px", border: "1px solid #1a1a3e" }}>
                        <div style={{ color: "#888", fontSize: "0.75rem" }}>DAMAGE</div>
                        <NeonText size="1.4rem" color="#f44">{stats.damage}</NeonText>
                        {w.rarity === "pet" && (w.merge || 1) > 1 && <div style={{ color: "#ff69b4", fontSize: "0.75rem" }}>+{stats.damage - w.damage} from merges</div>}
                        {w.rarity !== "pet" && w.level > 1 && <div style={{ color: "#0f0", fontSize: "0.75rem" }}>+{stats.damage - w.damage} from upgrades</div>}
                      </div>
                      <div style={{ background: "#0a0a2a", borderRadius: 8, padding: "14px 10px", border: "1px solid #1a1a3e" }}>
                        <div style={{ color: "#888", fontSize: "0.75rem" }}>SPEED</div>
                        <NeonText size="1.4rem" color="#0ff">{stats.speed}</NeonText>
                        {w.level > 1 && <div style={{ color: "#0f0", fontSize: "0.75rem" }}>+{stats.speed - w.speed} from upgrades</div>}
                      </div>
                      {stats.attack > 0 && (
                        <div style={{ background: "#0a0a2a", borderRadius: 8, padding: "14px 10px", border: "1px solid #1a1a3e" }}>
                          <div style={{ color: "#888", fontSize: "0.75rem" }}>ATTACK</div>
                          <NeonText size="1.4rem" color="#f90">{stats.attack}</NeonText>
                          <div style={{ color: "#666", fontSize: "0.7rem" }}>+{stats.attack} bonus DMG</div>
                        </div>
                      )}
                      {stats.defense > 0 && (
                        <div style={{ background: "#0a0a2a", borderRadius: 8, padding: "14px 10px", border: "1px solid #1a1a3e" }}>
                          <div style={{ color: "#888", fontSize: "0.75rem" }}>DEFENSE</div>
                          <NeonText size="1.4rem" color="#0f0">{stats.defense}</NeonText>
                          <div style={{ color: "#666", fontSize: "0.7rem" }}>-{stats.defense} DMG per hit</div>
                        </div>
                      )}
                    </div>

                    {/* Applied Potions */}
                    {(w.potions || []).length > 0 && (
                      <div style={{ marginBottom: 12, padding: 12, background: "#0a0a2a", borderRadius: 8, border: "1px solid #1a1a3e" }}>
                        <NeonText size="0.7rem" color="#c084fc">🧪 APPLIED POTIONS</NeonText>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                          {w.potions.map(pot => {
                            const potion = POTIONS.find(p => p.id === pot.id);
                            const eff = getPotionEffect(pot.id, pot.merge);
                            return (
                              <div key={pot.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: `${potion.color}08`, borderRadius: 6, border: `1px solid ${potion.color}30` }}>
                                <span style={{ fontSize: "1.1rem" }}>{potion.emoji}</span>
                                <div style={{ flex: 1 }}>
                                  <span style={{ color: potion.color, fontSize: "0.85rem", fontFamily: "'Orbitron', sans-serif" }}>{potion.name} M{pot.merge}</span>
                                  <div style={{ color: "#888", fontSize: "0.7rem" }}>
                                    {eff.burnDmg ? `+${eff.burnDmg} burn/turn` : eff.slowPct ? `-${eff.slowPct}% enemy DMG` : eff.stunPct ? `${eff.stunPct}% stun` : `+${eff.poisonDmg} stack/turn`}
                                  </div>
                                </div>
                                <button onClick={() => removePotion(w.id, pot.id)} style={{
                                  padding: "3px 8px", borderRadius: 4, fontSize: "0.5rem",
                                  background: "none", border: "1px solid #f4430", color: "#f44",
                                  cursor: "pointer", fontFamily: "'Orbitron', sans-serif",
                                }}>REMOVE</button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Add Potion to Weapon */}
                    {w.rarity !== "pet" && (w.potions || []).length < 2 && potions.length > 0 && (
                      <div style={{ marginBottom: 16, padding: 12, background: "#0a0a2a", borderRadius: 8, border: "1px solid #c084fc30" }}>
                        <NeonText size="0.7rem" color="#c084fc">🧪 ADD POTION ({2 - (w.potions || []).length} slot{2 - (w.potions || []).length > 1 ? "s" : ""} available)</NeonText>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                          {potions.map((pot, pIdx) => {
                            const potion = POTIONS.find(p => p.id === pot.id);
                            const alreadyHas = (w.potions || []).find(p => p.id === pot.id);
                            if (alreadyHas) return null;
                            const eff = getPotionEffect(pot.id, pot.merge);
                            return (
                              <button key={pIdx} onClick={() => applyPotion(pIdx, w.id)} style={{
                                display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                                background: `${potion.color}10`, borderRadius: 6, border: `1px solid ${potion.color}40`,
                                cursor: "pointer", width: "100%", textAlign: "left",
                              }}>
                                <span style={{ fontSize: "1.1rem" }}>{potion.emoji}</span>
                                <div style={{ flex: 1 }}>
                                  <span style={{ color: potion.color, fontSize: "0.85rem", fontFamily: "'Orbitron', sans-serif" }}>{potion.name} M{pot.merge}</span>
                                  <div style={{ color: "#888", fontSize: "0.5rem" }}>
                                    {eff.burnDmg ? `+${eff.burnDmg} burn/turn` : eff.slowPct ? `-${eff.slowPct}% enemy DMG` : eff.stunPct ? `${eff.stunPct}% stun` : `+${eff.poisonDmg} stack/turn`}
                                  </div>
                                </div>
                                <span style={{ color: "#0f0", fontSize: "0.75rem", fontFamily: "'Orbitron', sans-serif" }}>+ ADD</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {w.rarity !== "pet" && (w.potions || []).length < 2 && potions.length === 0 && (
                      <div style={{ marginBottom: 16, padding: 10, background: "#0a0a2a", borderRadius: 8, border: "1px solid #1a1a3e", textAlign: "center" }}>
                        <div style={{ color: "#555", fontSize: "0.75rem" }}>🧪 No potions in inventory. Craft them in the CRAFT tab!</div>
                      </div>
                    )}

                    {/* Level progress */}
                    {w.rarity !== "pet" && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ color: "#888", fontSize: "0.8rem" }}>LEVEL PROGRESS</span>
                        <span style={{ color: "#0ff", fontSize: "0.8rem" }}>{w.level}/50</span>
                      </div>
                      <div style={{ background: "#111", borderRadius: 6, height: 10, overflow: "hidden", border: "1px solid #222" }}>
                        <div style={{
                          width: `${(w.level / 50) * 100}%`, height: "100%",
                          background: `linear-gradient(90deg, #0ff, ${RARITY_COLORS[w.rarity]})`,
                          boxShadow: "0 0 8px #0ff40", transition: "width 0.5s",
                          borderRadius: 6,
                        }} />
                      </div>
                    </div>
                    )}

                    {/* Upgrade section */}
                    {w.rarity === "pet" ? (() => {
                      const otherPets = inventory.filter(p => p.rarity === "pet" && p.id !== w.id);
                      const canMerge = (w.merge || 1) < 50 && otherPets.length > 0;
                      return (
                        <div>
                          {/* Merge progress */}
                          <div style={{ marginBottom: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                              <span style={{ color: "#ff69b4", fontSize: "0.8rem" }}>MERGE PROGRESS</span>
                              <span style={{ color: "#ff69b4", fontSize: "0.8rem" }}>{w.merge || 1}/50</span>
                            </div>
                            <div style={{ background: "#111", borderRadius: 6, height: 10, overflow: "hidden", border: "1px solid #222" }}>
                              <div style={{
                                width: `${((w.merge || 1) / 50) * 100}%`, height: "100%",
                                background: "linear-gradient(90deg, #ff69b4, #f0f)",
                                boxShadow: "0 0 8px #ff69b440", transition: "width 0.5s", borderRadius: 6,
                              }} />
                            </div>
                          </div>

                          {!mergeMode ? (
                            <div style={{
                              background: "#ff69b408", borderRadius: 10, padding: 16,
                              border: "1px solid #ff69b430",
                            }}>
                              <NeonText size="0.85rem" color="#ff69b4">🐾 PET MERGE</NeonText>
                              <div style={{ color: "#666", fontSize: "0.85rem", margin: "6px 0 12px" }}>
                                Sacrifice another pet to increase merge level. +10% DMG per merge.
                              </div>
                              {canMerge ? (
                                <GlowButton onClick={() => setMergeMode(true)} color="#ff69b4" style={{ width: "100%", fontSize: "0.8rem" }}>
                                  🔀 SELECT PET TO SACRIFICE ({otherPets.length} available)
                                </GlowButton>
                              ) : (w.merge || 1) >= 50 ? (
                                <div style={{ textAlign: "center" }}>
                                  <NeonText size="0.9rem" color="#ff69b4">⭐ MAX MERGE ⭐</NeonText>
                                </div>
                              ) : (
                                <div style={{ color: "#555", fontSize: "0.85rem", textAlign: "center" }}>
                                  No other pets to merge with. Open Energy Packs to get more!
                                </div>
                              )}
                            </div>
                          ) : (
                            <div style={{
                              background: "#ff69b408", borderRadius: 10, padding: 16,
                              border: "1px solid #ff69b440",
                            }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <NeonText size="0.85rem" color="#ff69b4">SELECT SACRIFICE</NeonText>
                                <button onClick={() => setMergeMode(false)} style={{
                                  background: "none", border: "1px solid #333", color: "#888", padding: "4px 10px",
                                  borderRadius: 4, cursor: "pointer", fontSize: "0.8rem",
                                }}>CANCEL</button>
                              </div>
                              <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 10 }}>
                                The sacrificed pet will be destroyed permanently.
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {otherPets.map(p => (
                                  <button key={p.id} onClick={() => mergePets(w.id, p.id)} style={{
                                    display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                                    background: "#0a0a1a", border: "1px solid #ff69b430", borderRadius: 8,
                                    cursor: "pointer", transition: "all 0.3s", width: "100%",
                                  }}>
                                    <span style={{ fontSize: "1.3rem" }}>{p.emoji}</span>
                                    <div style={{ flex: 1, textAlign: "left" }}>
                                      <div style={{ color: "#ff69b4", fontSize: "0.8rem" }}>{p.name}</div>
                                      <div style={{ color: "#666", fontSize: "0.75rem" }}>Merge {p.merge || 1} • DMG: {getWeaponStats(p).damage}</div>
                                    </div>
                                    <span style={{ color: "#f44", fontSize: "0.8rem" }}>SACRIFICE</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })() : cost ? (
                      <div style={{
                        background: "#05050f", borderRadius: 10, padding: 16,
                        border: "1px solid #1a1a3e",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                          <div>
                            <NeonText size="0.8rem" color="#fbbf24">UPGRADE TO LVL {w.level + 1}</NeonText>
                            <div style={{ color: "#888", fontSize: "0.8rem", marginTop: 2 }}>
                              +{Math.floor(w.damage * 0.08)} DMG boost
                            </div>
                          </div>
                          <NeonText size="1rem" color="#fbbf24" glow={false}>💰 {cost.toLocaleString()}</NeonText>
                        </div>
                        <GlowButton onClick={() => upgradeWeapon(w.id)} disabled={coins < cost}
                          color={coins >= cost ? "#fbbf24" : "#555"} style={{ width: "100%", fontSize: "0.85rem" }}>
                          {coins >= cost ? `⬆ UPGRADE — ${cost.toLocaleString()} COINS` : `NEED ${(cost - coins).toLocaleString()} MORE`}
                        </GlowButton>
                      </div>
                    ) : (
                      <div style={{
                        background: "#0ff08", borderRadius: 10, padding: 16,
                        border: "1px solid #0ff30", textAlign: "center",
                      }}>
                        <NeonText size="1rem" color="#0ff">⭐ MAX LEVEL ⭐</NeonText>
                        <div style={{ color: "#666", fontSize: "0.9rem", marginTop: 4 }}>This weapon is fully upgraded!</div>
                      </div>
                    )}

                    {/* Weapon Merge section (non-pet only) */}
                    {w.rarity !== "pet" && w.level < 50 && (() => {
                      const mergeable = inventory.filter(m => m.id !== w.id && m.rarity === w.rarity && (m.type === w.type || m.type === "both" || w.type === "both") && m.rarity !== "pet");
                      const boost = w.level <= 4 ? 2 : 3;
                      if (mergeable.length === 0) return null;
                      const mergePartner = mergeTargetId ? inventory.find(m => m.id === mergeTargetId) : null;
                      return (
                        <div style={{ marginTop: 12 }}>
                          {!mergeMode ? (
                            <div style={{
                              background: "#0ff08", borderRadius: 10, padding: 16,
                              border: "1px solid #0ff20",
                            }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                <NeonText size="0.8rem" color="#0ff">🔀 WEAPON MERGE</NeonText>
                                <span style={{ color: "#0ff", fontSize: "0.8rem" }}>+{boost} LEVELS</span>
                              </div>
                              <div style={{ color: "#666", fontSize: "0.8rem", marginBottom: 10 }}>
                                Merge with a same-tier weapon. LVL 1-4: +2 levels. LVL 5+: +3 levels. You choose which to keep!
                              </div>
                              <GlowButton onClick={() => { setMergeMode(true); setMergeTargetId(null); }} color="#0ff" style={{ width: "100%", fontSize: "0.8rem" }}>
                                🔀 SELECT MERGE PARTNER ({mergeable.length} available)
                              </GlowButton>
                            </div>
                          ) : !mergePartner ? (
                            <div style={{
                              background: "#0a0a2a", borderRadius: 10, padding: 16,
                              border: "1px solid #0ff40",
                            }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                <NeonText size="0.8rem" color="#0ff">SELECT PARTNER</NeonText>
                                <button onClick={() => setMergeMode(false)} style={{
                                  background: "none", border: "1px solid #333", color: "#888", padding: "4px 10px",
                                  borderRadius: 4, cursor: "pointer", fontSize: "0.8rem",
                                }}>CANCEL</button>
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {mergeable.map(m => {
                                  const mStats = getWeaponStats(m);
                                  return (
                                    <button key={m.id} onClick={() => setMergeTargetId(m.id)} style={{
                                      display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                                      background: "#0a0a1a", border: `1px solid ${RARITY_COLORS[m.rarity]}30`, borderRadius: 8,
                                      cursor: "pointer", transition: "all 0.3s", width: "100%",
                                    }}>
                                      <span style={{ fontSize: "1.3rem" }}>{m.emoji}</span>
                                      <div style={{ flex: 1, textAlign: "left" }}>
                                        <div style={{ color: RARITY_COLORS[m.rarity], fontSize: "0.8rem" }}>{m.name}</div>
                                        <div style={{ color: "#666", fontSize: "0.75rem" }}>LVL {m.level} • DMG: {mStats.damage} • {m.type === "attack" ? "ATK" : m.type === "defense" ? "DEF" : "BOTH"}</div>
                                      </div>
                                      <NeonText size="0.7rem" color="#0ff">SELECT</NeonText>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div style={{
                              background: "#0a0a2a", borderRadius: 10, padding: 16,
                              border: "1px solid #0ff40",
                            }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <NeonText size="0.85rem" color="#0ff">CHOOSE WHICH TO KEEP</NeonText>
                                <button onClick={() => { setMergeTargetId(null); setMergeMode(false); }} style={{
                                  background: "none", border: "1px solid #333", color: "#888", padding: "4px 10px",
                                  borderRadius: 4, cursor: "pointer", fontSize: "0.8rem",
                                }}>CANCEL</button>
                              </div>
                              <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 12, textAlign: "center" }}>
                                The kept weapon gains +{boost} levels. The other is destroyed.
                              </div>
                              <div style={{ display: "flex", gap: 10 }}>
                                {[w, mergePartner].map((wpn) => {
                                  const wpnStats = getWeaponStats(wpn);
                                  const wpnBoost = wpn.level <= 4 ? 2 : 3;
                                  return (
                                    <button key={wpn.id} onClick={() => mergeWeapons(wpn.id, wpn.id === w.id ? mergePartner.id : w.id)} style={{
                                      flex: 1, padding: "14px 8px", background: "#0a0a1a",
                                      border: `1px solid ${RARITY_COLORS[wpn.rarity]}40`, borderRadius: 10,
                                      cursor: "pointer", textAlign: "center", transition: "all 0.3s",
                                    }}>
                                      <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>{wpn.emoji}</div>
                                      <div style={{ color: RARITY_COLORS[wpn.rarity], fontSize: "0.9rem" }}>{wpn.name}</div>
                                      <div style={{ color: "#888", fontSize: "0.75rem", margin: "4px 0" }}>
                                        LVL {wpn.level} → <span style={{ color: "#0f0" }}>LVL {Math.min(wpn.level + wpnBoost, 50)}</span>
                                      </div>
                                      <div style={{ color: "#666", fontSize: "0.7rem" }}>DMG: {wpnStats.damage} • SPD: {wpnStats.speed}</div>
                                      <div style={{
                                        marginTop: 8, padding: "6px 0", background: "#0f015",
                                        border: "1px solid #0f040", borderRadius: 6,
                                        color: "#0f0", fontSize: "0.85rem",
                                      }}>✓ KEEP THIS</div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Sell section */}
                    <div style={{ marginTop: 16, borderTop: "1px solid #1a1a3e", paddingTop: 16 }}>
                      {!confirmSell ? (
                        <button onClick={() => setConfirmSell(true)} style={{
                          width: "100%", background: "none", border: "1px solid #f4430",
                          color: "#f44", padding: "10px", borderRadius: 8, cursor: "pointer",
                          fontSize: "0.9rem",
                          transition: "all 0.3s",
                        }}>
                          💰 SELL FOR {getSellPrice(w).toLocaleString()} COINS
                        </button>
                      ) : (
                        <div style={{
                          background: "#2a0a0a", borderRadius: 10, padding: 16,
                          border: "1px solid #f4440",
                        }}>
                          <NeonText size="0.85rem" color="#f44">ARE YOU SURE?</NeonText>
                          <div style={{ color: "#888", fontSize: "0.85rem", margin: "8px 0" }}>
                            You'll get 💰{getSellPrice(w).toLocaleString()} back (half of total investment). This cannot be undone.
                          </div>
                          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                            <GlowButton onClick={() => sellWeapon(w.id)} color="#f44" style={{ flex: 1, fontSize: "0.9rem" }}>
                              CONFIRM SELL
                            </GlowButton>
                            <GlowButton onClick={() => setConfirmSell(false)} color="#888" style={{ flex: 1, fontSize: "0.9rem" }}>
                              CANCEL
                            </GlowButton>
                          </div>
                        </div>
                      )}
                    </div>
                  </Panel>
                </div>
              );
            })() : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {inventory.map(w => {
                  const stats = getWeaponStats(w);
                  return (
                    <Panel key={w.id} onClick={() => { setSelectedGearId(w.id); setConfirmSell(false); setMergeMode(false); }} style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
                      <div style={{
                        width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center",
                        background: `${RARITY_COLORS[w.rarity]}15`, borderRadius: 10,
                        border: `1px solid ${RARITY_COLORS[w.rarity]}`, fontSize: "1.8rem",
                        boxShadow: `0 0 15px ${RARITY_COLORS[w.rarity]}30`, position: "relative",
                      }}>
                        {w.emoji}
                        <div style={{
                          position: "absolute", bottom: -4, right: -4, background: "#0a0a1a",
                          border: `1px solid ${w.rarity === "pet" ? "#ff69b4" : "#0ff"}`, borderRadius: 4, padding: "1px 5px",
                          fontSize: "0.5rem", color: w.rarity === "pet" ? "#ff69b4" : "#0ff",
                        }}>{w.rarity === "pet" ? `M${w.merge || 1}` : `LV${w.level}`}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <NeonText size="0.9rem" color={RARITY_COLORS[w.rarity]}>{w.name}</NeonText>
                        <div style={{ color: "#888", fontSize: "0.9rem", marginTop: 4 }}>
                          ⚔ DMG: {stats.damage}{stats.attack > 0 ? " | 🗡 ATK: " + stats.attack : ""}{stats.defense > 0 ? " | 🛡 DEF: " + stats.defense : ""} &nbsp; ⚡ SPD: {stats.speed}
                        </div>
                        {(w.potions || []).length > 0 && (
                          <div style={{ display: "flex", gap: 4, marginTop: 3 }}>
                            {w.potions.map(p => {
                              const pot = POTIONS.find(pp => pp.id === p.id);
                              return <span key={p.id} style={{ fontSize: "0.7rem", padding: "1px 5px", borderRadius: 3, background: `${pot?.color}15`, border: `1px solid ${pot?.color}30`, color: pot?.color }}>{pot?.emoji} M{p.merge}</span>;
                            })}
                          </div>
                        )}
                        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                          <span style={{
                            fontSize: "0.7rem", color: RARITY_COLORS[w.rarity], padding: "2px 6px",
                            border: `1px solid ${RARITY_COLORS[w.rarity]}40`, borderRadius: 4,
                            textTransform: "uppercase",
                          }}>{w.rarity}</span>
                          <span style={{
                            fontSize: "0.7rem", color: w.rarity === "pet" ? "#ff69b4" : "#0ff", padding: "2px 6px",
                            background: w.rarity === "pet" ? "#ff69b410" : "#0ff10",
                            border: `1px solid ${w.rarity === "pet" ? "#ff69b440" : "#0ff40"}`, borderRadius: 4,
                          }}>{w.rarity === "pet" ? `MERGE ${w.merge || 1}` : `LVL ${w.level}`}</span>
                        </div>
                      </div>
                      <NeonText size="1rem" color="#888">→</NeonText>
                    </Panel>
                  );
                })}
              </div>
            )}
          </div>
        )}

{/* ─── ADMIN ─── */}
        {screen === "admin" && user?.email === "tanuj.garg@gmail.com" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <NeonText size="1.3rem" color="#f90">🔧 ADMIN PANEL</NeonText>
              <button onClick={loadAdminData} disabled={adminLoading} style={{
                padding: "8px 16px", borderRadius: 6, cursor: "pointer",
                background: "#f9020", border: "1px solid #f9050",
                color: "#f90", fontSize: "0.9rem", fontFamily: "'Orbitron', sans-serif",
              }}>{adminLoading ? "LOADING..." : "🔄 REFRESH"}</button>
            </div>
            <div style={{ color: "#888", fontSize: "0.9rem", marginBottom: 16 }}>
              {adminPlayers.length} registered players
            </div>
            {adminPlayers.length === 0 && !adminLoading && (
              <Panel style={{ textAlign: "center", padding: 30 }}>
                <NeonText size="0.9rem" color="#888">Click REFRESH to load player data</NeonText>
              </Panel>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {adminPlayers.map(p => {
                const s = p.parsed;
                const inv = s.inventory || [];
                const power = calculatePower(inv);
                const rank = getRank(power);
                const isExpanded = adminExpanded === p.email;
                return (
                  <Panel key={p.id} style={{ cursor: "pointer", border: `1px solid ${rank.color}30` }}
                    onClick={() => setAdminExpanded(isExpanded ? null : p.email)}>
                    {/* Player summary row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                        background: `${rank.color}15`, border: `1px solid ${rank.color}40`, fontSize: "1.3rem",
                      }}>{rank.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "#fff", fontSize: "0.85rem", fontFamily: "'Orbitron', sans-serif" }}>{p.email}</div>
                        <div style={{ color: "#888", fontSize: "0.8rem", marginTop: 2 }}>
                          {rank.name} • ⚡{power} • 💰{(s.coins || 0).toLocaleString()} coins • LVL {s.level || 1} • {inv.length} weapons
                        </div>
                      </div>
                      <NeonText size="0.8rem" color="#888">{isExpanded ? "▲" : "▼"}</NeonText>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div style={{ marginTop: 16, borderTop: "1px solid #1a1a3e", paddingTop: 16 }}>
                        {/* Stats grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                          {[
                            { label: "COINS", value: (s.coins || 0).toLocaleString(), color: "#fbbf24" },
                            { label: "DEBT", value: (s.debt || 0).toLocaleString(), color: s.debt > 0 ? "#f44" : "#0f0" },
                            { label: "XP", value: (s.xp || 0).toLocaleString(), color: "#c084fc" },
                            { label: "LEVEL", value: s.level || 1, color: "#0ff" },
                            { label: "PVP WINS", value: s.totalPvPWins || 0, color: "#f0f" },
                            { label: "GAMES WON", value: s.totalGamesWon || 0, color: "#6ee7b7" },
                            { label: "TOTAL EARNED", value: (s.totalCoinsEarned || 0).toLocaleString(), color: "#fbbf24" },
                            { label: "PACKS OPENED", value: s.packsOpened || 0, color: "#c084fc" },
                          ].map((stat, i) => (
                            <div key={i} style={{ textAlign: "center", padding: "8px 4px", background: "#05050f", borderRadius: 6, border: "1px solid #1a1a3e" }}>
                              <div style={{ color: "#666", fontSize: "0.5rem", marginBottom: 2 }}>{stat.label}</div>
                              <NeonText size="0.85rem" color={stat.color}>{stat.value}</NeonText>
                            </div>
                          ))}
                        </div>

                        {/* Games remaining today */}
                        {s.gamesLeft && (
                          <div style={{ marginBottom: 16 }}>
                            <NeonText size="0.7rem" color="#0ff">🎮 GAMES REMAINING TODAY</NeonText>
                            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                              {Object.entries(s.gamesLeft).map(([game, left]) => (
                                <div key={game} style={{
                                  flex: 1, textAlign: "center", padding: "6px 4px", borderRadius: 6,
                                  background: "#05050f", border: `1px solid ${left > 0 ? "#0ff30" : "#f4430"}`,
                                }}>
                                  <div style={{ color: "#888", fontSize: "0.7rem", textTransform: "uppercase" }}>{game}</div>
                                  <NeonText size="0.8rem" color={left > 0 ? "#0ff" : "#f44"}>{left}/5</NeonText>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Streak & daily info */}
                        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                          <div style={{ flex: 1, padding: "8px 10px", borderRadius: 6, background: "#05050f", border: "1px solid #1a1a3e" }}>
                            <div style={{ color: "#888", fontSize: "0.7rem" }}>STREAK</div>
                            <NeonText size="0.85rem" color="#fbbf24">🔥 {s.streak || 0} days</NeonText>
                          </div>
                          <div style={{ flex: 1, padding: "8px 10px", borderRadius: 6, background: "#05050f", border: "1px solid #1a1a3e" }}>
                            <div style={{ color: "#888", fontSize: "0.7rem" }}>LAST LOGIN</div>
                            <NeonText size="0.7rem" color="#888" glow={false}>{s.lastLoginDate || "N/A"}</NeonText>
                          </div>
                          <div style={{ flex: 1, padding: "8px 10px", borderRadius: 6, background: "#05050f", border: "1px solid #1a1a3e" }}>
                            <div style={{ color: "#888", fontSize: "0.7rem" }}>ACHIEVEMENTS</div>
                            <NeonText size="0.85rem" color="#fbbf24">{Object.keys(s.achievements || {}).length}/{ACHIEVEMENTS.length}</NeonText>
                          </div>
                        </div>

                        {/* Weapons inventory */}
                        <NeonText size="0.7rem" color="#6ee7b7">🎒 WEAPONS ({inv.length})</NeonText>
                        {inv.length === 0 ? (
                          <div style={{ color: "#555", fontSize: "0.85rem", marginTop: 6 }}>No weapons yet</div>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 6 }}>
                            {inv.map((w, wi) => {
                              const stats = getWeaponStats(w);
                              return (
                                <div key={wi} style={{
                                  display: "flex", alignItems: "center", gap: 8, padding: "6px 10px",
                                  background: "#05050f", borderRadius: 6, border: `1px solid ${RARITY_COLORS[w.rarity]}20`,
                                }}>
                                  <span style={{ fontSize: "1.1rem" }}>{w.emoji}</span>
                                  <div style={{ flex: 1 }}>
                                    <span style={{ color: RARITY_COLORS[w.rarity], fontSize: "0.9rem", fontFamily: "'Orbitron', sans-serif" }}>
                                      {w.name}
                                    </span>
                                    <span style={{ color: "#888", fontSize: "0.75rem", marginLeft: 8 }}>
                                      {w.rarity === "pet" ? `M${w.merge || 1}` : `LV${w.level || 1}`} • DMG:{stats.damage} SPD:{stats.speed}
                                      {stats.defense > 0 ? ` DEF:${stats.defense}` : ""}
                                      {stats.attack > 0 ? ` ATK:${stats.attack}` : ""}
                                    </span>
                                  </div>
                                  {(w.potions || []).map(pot => {
                                    const potion = POTIONS.find(pp => pp.id === pot.id);
                                    return <span key={pot.id} style={{ fontSize: "0.9rem" }}>{potion?.emoji}M{pot.merge}</span>;
                                  })}
                                  <span style={{
                                    fontSize: "0.5rem", color: RARITY_COLORS[w.rarity], padding: "2px 6px",
                                    border: `1px solid ${RARITY_COLORS[w.rarity]}40`, borderRadius: 4, textTransform: "uppercase",
                                  }}>{w.rarity}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Materials */}
                        {s.materials && (
                          <div style={{ marginTop: 12 }}>
                            <NeonText size="0.7rem" color="#f90">⚒️ MATERIALS</NeonText>
                            <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                              {MATERIALS.map(mat => {
                                const qty = s.materials[mat.id] || 0;
                                if (qty === 0) return null;
                                return (
                                  <span key={mat.id} style={{
                                    padding: "3px 8px", borderRadius: 4, fontSize: "0.8rem",
                                    background: `${mat.color}10`, border: `1px solid ${mat.color}30`, color: mat.color,
                                  }}>{mat.emoji} {qty}</span>
                                );
                              })}
                              {Object.values(s.materials || {}).every(v => v === 0) && (
                                <span style={{ color: "#555", fontSize: "0.8rem" }}>None</span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Potions */}
                        {(s.potions || []).length > 0 && (
                          <div style={{ marginTop: 12 }}>
                            <NeonText size="0.7rem" color="#c084fc">🧪 POTIONS ({s.potions.length})</NeonText>
                            <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                              {s.potions.map((pot, pi) => {
                                const potion = POTIONS.find(pp => pp.id === pot.id);
                                return (
                                  <span key={pi} style={{
                                    padding: "3px 8px", borderRadius: 4, fontSize: "0.8rem",
                                    background: `${potion?.color}10`, border: `1px solid ${potion?.color}30`, color: potion?.color,
                                  }}>{potion?.emoji} {potion?.name} M{pot.merge}</span>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Bounty status */}
                        {(s.bounties || []).length > 0 && (
                          <div style={{ marginTop: 12 }}>
                            <NeonText size="0.7rem" color="#ef4444">🎯 BOUNTIES</NeonText>
                            <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                              {s.bounties.map((b, bi) => (
                                <span key={bi} style={{
                                  padding: "3px 8px", borderRadius: 4, fontSize: "0.75rem",
                                  background: b.completed ? "#0f010" : "#f4410",
                                  border: `1px solid ${b.completed ? "#0f030" : "#f4430"}`,
                                  color: b.completed ? "#0f0" : "#f44",
                                }}>{b.name} {b.completed ? "✅" : "❌"} 💰{b.reward.toLocaleString()}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div style={{ marginTop: 12, color: "#444", fontSize: "0.7rem" }}>
                          Registered: {new Date(p.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </Panel>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── SOCIAL ─── */}
        {screen === "social" && (
          <div>
            <NeonText size="1.2rem" color="#c084fc">👥 SOCIAL</NeonText>

            {/* Tab buttons */}
            <div style={{ display: "flex", gap: 6, margin: "12px 0", flexWrap: "wrap" }}>
              {[{ id: "leaderboard", label: "🏆 RANKS" }, { id: "friends", label: "FRIENDS" }, { id: "requests", label: `REQUESTS${pendingRequests.length ? ` (${pendingRequests.length})` : ""}` }, ...(chatFriend ? [{ id: "chat", label: "💬 CHAT" }] : [])].map(tab => (
                <button key={tab.id} onClick={() => setSocialTab(tab.id)} style={{
                  flex: 1, minWidth: 80, padding: "8px 4px", borderRadius: 6, cursor: "pointer",
                  background: socialTab === tab.id ? "#c084fc20" : "#05050f",
                  border: `1px solid ${socialTab === tab.id ? "#c084fc" : "#1a1a3e"}`,
                  color: socialTab === tab.id ? "#c084fc" : "#666",
                  fontSize: "0.8rem", fontFamily: "'Orbitron', sans-serif",
                }}>{tab.label}</button>
              ))}
            </div>

            {/* LEADERBOARD TAB */}
            {socialTab === "leaderboard" && (
              <div>
                {/* Your rank */}
                <Panel style={{ marginBottom: 12 }}>
                  <NeonText size="0.75rem" color="#fbbf24">YOUR POWER</NeonText>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                    <div style={{
                      width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center",
                      background: `${getRank(myPower).color}15`, borderRadius: 10,
                      border: `1px solid ${getRank(myPower).color}50`, fontSize: "1.5rem",
                    }}>{getRank(myPower).icon}</div>
                    <div style={{ flex: 1 }}>
                      <NeonText size="1rem" color={getRank(myPower).color}>{getRank(myPower).name}</NeonText>
                      <div style={{ color: "#888", fontSize: "0.8rem" }}>⚡ Power: {myPower.toLocaleString()}</div>
                    </div>
                  </div>
                </Panel>

                {/* Rank tiers */}
                <Panel style={{ marginBottom: 12 }}>
                  <NeonText size="0.7rem" color="#888">RANK TIERS</NeonText>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
                    {[
                      { min: 20000, rank: "GLITCH LORD", color: "#ff00ff", icon: "👾" },
                      { min: 10000, rank: "MYTHIC", color: "#fbbf24", icon: "💫" },
                      { min: 5000, rank: "LEGENDARY", color: "#f90", icon: "🔥" },
                      { min: 2500, rank: "EPIC", color: "#c084fc", icon: "⚡" },
                      { min: 1000, rank: "RARE", color: "#60a5fa", icon: "💎" },
                      { min: 300, rank: "NOVICE", color: "#0f0", icon: "🛡️" },
                      { min: 0, rank: "ROOKIE", color: "#888", icon: "👶" },
                    ].map(t => (
                      <div key={t.rank} style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "4px 8px",
                        background: myPower >= t.min && (t.min >= 20000 || myPower < [20000, 20000, 10000, 5000, 2500, 1000, 300][[20000, 10000, 5000, 2500, 1000, 300, 0].indexOf(t.min)]) ? `${t.color}10` : "transparent",
                        borderRadius: 4, border: `1px solid ${t.color}20`,
                      }}>
                        <span style={{ fontSize: "0.9rem" }}>{t.icon}</span>
                        <span style={{ color: t.color, fontSize: "0.8rem", fontFamily: "'Orbitron', sans-serif", flex: 1 }}>{t.rank}</span>
                        <span style={{ color: "#555", fontSize: "0.7rem" }}>{t.min.toLocaleString()}+</span>
                      </div>
                    ))}
                  </div>
                </Panel>

                {/* Global leaderboard */}
                <Panel>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <NeonText size="0.75rem" color="#fbbf24">🏆 GLOBAL LEADERBOARD</NeonText>
                    <button onClick={() => loadLeaderboard(true)} style={{
                      padding: "4px 10px", borderRadius: 4, cursor: "pointer",
                      background: "#0ff15", border: "1px solid #0ff40",
                      color: "#0ff", fontSize: "0.7rem", fontFamily: "'Orbitron', sans-serif",
                    }}>🔄 REFRESH</button>
                  </div>
                  {leaderboard.length === 0 ? (
                    <div style={{ color: "#555", fontSize: "0.85rem", marginTop: 10, textAlign: "center", padding: 20 }}>
                      Loading rankings...
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
                      {leaderboard.slice(0, 20).map((p, i) => {
                        const rank = getRank(p.power);
                        const isMe = p.email === user.email;
                        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
                        return (
                          <div key={p.email} style={{
                            display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                            background: isMe ? `${rank.color}15` : "#05050f", borderRadius: 6,
                            border: `1px solid ${isMe ? rank.color + "50" : "#1a1a3e"}`,
                          }}>
                            <div style={{
                              width: 36, textAlign: "center", fontSize: i < 3 ? "1.1rem" : "0.7rem",
                              color: i < 3 ? "#fbbf24" : "#666", fontFamily: "'Orbitron', sans-serif",
                            }}>{medal}</div>
                            <span style={{ fontSize: "1rem" }}>{rank.icon}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ color: isMe ? "#fbbf24" : "#eee", fontSize: "0.85rem", fontFamily: "'Orbitron', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {p.email}{isMe ? " (YOU)" : ""}
                              </div>
                              <div style={{ color: rank.color, fontSize: "0.7rem" }}>{rank.name} • {p.weapons} weapon{p.weapons !== 1 ? "s" : ""}</div>
                            </div>
                            <div style={{ color: "#fbbf24", fontSize: "0.85rem", fontFamily: "'Orbitron', sans-serif" }}>⚡ {p.power.toLocaleString()}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Panel>
              </div>
            )}

            {/* FRIENDS TAB */}
            {socialTab === "friends" && (
              <div>
                {/* Add friend */}
                <Panel style={{ marginBottom: 12 }}>
                  <NeonText size="0.75rem" color="#0ff">ADD FRIEND</NeonText>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input type="email" placeholder="Start typing email..." value={friendEmail}
                      onChange={async (e) => { setFriendEmail(e.target.value); const q = e.target.value.trim(); if (q.length >= 2 && sb.current) { const { data } = await sb.current.from("players").select("email").ilike("email", `%${q}%`).limit(5); setEmailSuggestions((data || []).map(p => p.email).filter(em => em !== user?.email)); } else { setEmailSuggestions([]); } }}
                      onKeyDown={(e) => e.key === "Enter" && sendFriendRequest()}
                      style={{
                        flex: 1, padding: "10px 12px", borderRadius: 6,
                        background: "#05050f", border: "1px solid #1a1a3e", color: "#fff",
                        fontSize: "0.8rem", fontFamily: "'Share Tech Mono', monospace", outline: "none",
                      }} />
                    <button onClick={sendFriendRequest} disabled={socialLoading || !friendEmail.trim()} style={{
                      padding: "10px 16px", borderRadius: 6, cursor: "pointer",
                      background: "#c084fc20", border: "1px solid #c084fc50",
                      color: "#c084fc", fontSize: "0.9rem", fontFamily: "'Orbitron', sans-serif",
                    }}>SEND</button>
                  </div>
                  {emailSuggestions.length > 0 && (
                    <div style={{ marginTop: 6, borderRadius: 6, overflow: "hidden", border: "1px solid #1a1a3e" }}>
                      {emailSuggestions.map(em => (
                        <button key={em} onClick={() => { setFriendEmail(em); setEmailSuggestions([]); }} style={{
                          width: "100%", padding: "10px 12px", background: "#0a0a2a", border: "none",
                          borderBottom: "1px solid #1a1a3e", color: "#0ff", fontSize: "0.85rem",
                          fontFamily: "'Share Tech Mono', monospace", cursor: "pointer", textAlign: "left",
                        }}>{em}</button>
                      ))}
                    </div>
                  )}
                </Panel>

                {/* Friends list */}
                <Panel>
                  <NeonText size="0.75rem" color="#0f0">MY FRIENDS ({friends.length})</NeonText>
                  {friends.length === 0 ? (
                    <div style={{ color: "#555", fontSize: "0.85rem", marginTop: 10, textAlign: "center", padding: 20 }}>
                      No friends yet. Send a request above!
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                      {friends.map(f => {
                        const fEmail = f.sender_id === user.id ? f.receiver_email : f.sender_email;
                        return (
                          <div key={f.id} style={{
                            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                            background: "#05050f", borderRadius: 8, border: "1px solid #0f030",
                          }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: "50%", display: "flex",
                              alignItems: "center", justifyContent: "center",
                              background: "#0f015", border: "1px solid #0f040", fontSize: "1rem",
                            }}>👤</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ color: "#0f0", fontSize: "0.9rem", fontFamily: "'Orbitron', sans-serif" }}>{fEmail}</div>
                              <div style={{ color: "#555", fontSize: "0.5rem" }}>Friend</div>
                            </div>
                            <button onClick={() => loadChat(f)} style={{
                              padding: "6px 12px", borderRadius: 6, cursor: "pointer",
                              background: "#c084fc15", border: "1px solid #c084fc40",
                              color: "#c084fc", fontSize: "0.8rem", fontFamily: "'Orbitron', sans-serif",
                            }}>💬 CHAT</button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Panel>

                {/* Sent requests */}
                {sentRequests.length > 0 && (
                  <Panel style={{ marginTop: 12 }}>
                    <NeonText size="0.7rem" color="#fbbf24">SENT REQUESTS ({sentRequests.length})</NeonText>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                      {sentRequests.map(r => (
                        <div key={r.id} style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                          background: "#05050f", borderRadius: 6, border: "1px solid #fbbf2420",
                        }}>
                          <span style={{ color: "#fbbf24", fontSize: "0.85rem" }}>⏳</span>
                          <span style={{ color: "#ccc", fontSize: "0.85rem", flex: 1 }}>{r.receiver_email}</span>
                          <span style={{ color: "#666", fontSize: "0.7rem" }}>Pending</span>
                        </div>
                      ))}
                    </div>
                  </Panel>
                )}
              </div>
            )}

            {/* REQUESTS TAB */}
            {socialTab === "requests" && (
              <Panel>
                <NeonText size="0.75rem" color="#fbbf24">INCOMING REQUESTS ({pendingRequests.length})</NeonText>
                {pendingRequests.length === 0 ? (
                  <div style={{ color: "#555", fontSize: "0.85rem", marginTop: 10, textAlign: "center", padding: 20 }}>
                    No pending requests.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                    {pendingRequests.map(r => (
                      <div key={r.id} style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                        background: "#05050f", borderRadius: 8, border: "1px solid #fbbf2430",
                      }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: "50%", display: "flex",
                          alignItems: "center", justifyContent: "center",
                          background: "#fbbf2415", border: "1px solid #fbbf2440", fontSize: "1rem",
                        }}>👤</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: "#fbbf24", fontSize: "0.9rem", fontFamily: "'Orbitron', sans-serif" }}>{r.sender_email}</div>
                          <div style={{ color: "#555", fontSize: "0.5rem" }}>wants to be friends</div>
                        </div>
                        <button onClick={() => respondToRequest(r.id, true)} style={{
                          padding: "6px 10px", borderRadius: 4, cursor: "pointer",
                          background: "#0f020", border: "1px solid #0f050",
                          color: "#0f0", fontSize: "0.75rem", fontFamily: "'Orbitron', sans-serif",
                        }}>✓ ACCEPT</button>
                        <button onClick={() => respondToRequest(r.id, false)} style={{
                          padding: "6px 10px", borderRadius: 4, cursor: "pointer",
                          background: "#f4415", border: "1px solid #f4430",
                          color: "#f44", fontSize: "0.75rem", fontFamily: "'Orbitron', sans-serif",
                        }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            )}

            {/* CHAT TAB */}
            {socialTab === "chat" && chatFriend && (
              <Panel>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <button onClick={() => setSocialTab("friends")} style={{
                    background: "none", border: "1px solid #333", color: "#888",
                    padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: "0.75rem",
                  }}>←</button>
                  <NeonText size="0.75rem" color="#c084fc">💬 {chatFriend.friendEmail}</NeonText>
                </div>

                {/* Messages */}
                <div style={{
                  height: 300, overflowY: "auto", padding: 10, borderRadius: 8,
                  background: "#020108", border: "1px solid #1a1a3e", marginBottom: 10,
                }}>
                  {chatMessages.length === 0 ? (
                    <div style={{ color: "#555", fontSize: "0.85rem", textAlign: "center", paddingTop: 100 }}>
                      No messages yet. Say hello!
                    </div>
                  ) : chatMessages.map((msg, i) => {
                    const isMe = msg.sender_id === user.id;
                    return (
                      <div key={i} style={{
                        display: "flex", justifyContent: isMe ? "flex-end" : "flex-start",
                        marginBottom: 8,
                      }}>
                        <div style={{
                          maxWidth: "75%", padding: "8px 12px", borderRadius: 12,
                          background: isMe ? "#c084fc20" : "#0ff10",
                          border: `1px solid ${isMe ? "#c084fc40" : "#0ff30"}`,
                          borderBottomRightRadius: isMe ? 2 : 12,
                          borderBottomLeftRadius: isMe ? 12 : 2,
                        }}>
                          <div style={{ color: "#eee", fontSize: "0.9rem", wordBreak: "break-word" }}>{msg.content}</div>
                          <div style={{ color: "#555", fontSize: "0.45rem", marginTop: 4, textAlign: isMe ? "right" : "left" }}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="text" placeholder="Type a message..." value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    style={{
                      flex: 1, padding: "10px 12px", borderRadius: 8,
                      background: "#05050f", border: "1px solid #1a1a3e", color: "#fff",
                      fontSize: "0.8rem", fontFamily: "'Share Tech Mono', monospace", outline: "none",
                    }} />
                  <button onClick={sendMessage} disabled={!chatInput.trim()} style={{
                    padding: "10px 16px", borderRadius: 8, cursor: chatInput.trim() ? "pointer" : "not-allowed",
                    background: "#c084fc20", border: "1px solid #c084fc50",
                    color: "#c084fc", fontSize: "0.8rem", fontFamily: "'Orbitron', sans-serif",
                  }}>SEND</button>
                </div>
              </Panel>
            )}
          </div>
        )}
      </div>

      {/* ─── NAV BAR ─── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(180deg, #0a0a1aee, #050510)",
        borderTop: "1px solid #1a1a3e", padding: "8px 0",
        display: "flex", justifyContent: "space-around",
        backdropFilter: "blur(10px)",
      }}>
        {navItems.map(nav => (
          <button key={nav.id} onClick={() => { setScreen(nav.id); setSelectedGame(null); setDifficulty(null); setPlaying(false); setSelectedGearId(null); setConfirmSell(false); setMergeMode(false); }}
            style={{
              background: "none", border: "none", cursor: "pointer", textAlign: "center",
              padding: "6px 12px", borderRadius: 8,
              opacity: screen === nav.id ? 1 : 0.7,
              transition: "all 0.3s",
            }}>
            <div style={{ fontSize: "1.2rem" }}>{nav.icon}</div>
            <div style={{
              fontSize: "0.7rem", letterSpacing: 1,
              color: screen === nav.id ? "#0ff" : "#aaa",
              textShadow: screen === nav.id ? "0 0 10px #0ff" : "none",
            }}>{nav.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
