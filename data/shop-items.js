// data/shop-items.js — Cosmetic items purchasable with XP
const SHOP_ITEMS = [
  { id:'title_iron', name:'Iron Warrior', type:'title', cost:500, value:'Iron Warrior' },
  { id:'title_steel', name:'Steel Champion', type:'title', cost:1000, value:'Steel Champion' },
  { id:'title_bronze', name:'Bronze God', type:'title', cost:2500, value:'Bronze God' },
  { id:'title_silver', name:'Silver King', type:'title', cost:5000, value:'Silver King' },
  { id:'title_gold', name:'Gold Titan', type:'title', cost:10000, value:'Gold Titan' },
  { id:'frame_fire', name:'Fire Frame', type:'frame', cost:750, value:'🔥' },
  { id:'frame_lightning', name:'Lightning Frame', type:'frame', cost:1500, value:'⚡' },
  { id:'frame_star', name:'Star Frame', type:'frame', cost:3000, value:'⭐' },
  { id:'frame_crown', name:'Crown Frame', type:'frame', cost:7500, value:'👑' },
  { id:'booster_2x', name:'2x XP Boost (1 day)', type:'booster', cost:2000, value:'2x' }
];

window.SHOP_ITEMS = SHOP_ITEMS;
