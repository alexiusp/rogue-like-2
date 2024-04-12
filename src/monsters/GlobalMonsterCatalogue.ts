import { EAlignment } from "../common/alignment";
import { ItemLootByLevel, MoneyLootByLevel } from "../common/loot";
import { getNumberBag } from "../common/random";
import { createCatalogue } from "../common/utils";
import { ETerrain, ETerrainEffect } from "../dungeon/types";
import { IBaseMonster } from "./model";

/**
 * Ideas for monsters:
 * Animals:
 *  - Rabid Rat
 *  - Stranded Dog
 *  - Cave Bear
 *  - Black bear
 *  - Wild boar
 *  - Giant Owl
 *  - Giant Raven
 *  - Cave Lion
 *  - Sabretooth Tiger
 * Insects:
 *  - Black spider
 *  - Giant Ant, Ant Queen as lair monster
 *  - Wasp, Wasp drone as a companion in lair
 *  - Scorpions
 * Reptiles:
 *  - Bull snake
 *  - Pit viper
 *  - Stone cobra
 *  - Rattlesnake
 * Humanoid:
 *  - Kobolds
 *  - Goblins
 *  - Orks
 *  - Ogres
 *  - Trolls
 * Undead:
 *  - Skeleton
 *  - Zombie
 *  - Mummy
 *  - Ghost
 * Elementals:
 *  - some lesser elementals?
 *  - Gargoyle
 *  - Golems
 *  - Elementals
 * Water dwellers:
 *  - Dungeon pike
 *  - Alligator
 *  - Piranha
 *  - some water folk (need to invent some lore)
 * Lycanthrope:
 *  - Wererat
 *  - Weredog
 *  - Werewolf
 *  - Wereboar
 * Dragons:
 *  - Pseudo Dragon
 *  - Baby Wyrm
 *  - Water Wyrm
 *  - Fire Wyrm
 */

const GiantRat: IBaseMonster = {
  name: "Giant Rat",
  picture: "giant-rat.png",
  type: "animal",
  alignment: EAlignment.Neutral,
  level: 1,
  stats: {
    strength: 4,
    intelligence: 0,
    wisdom: 0,
    endurance: 4,
    charisma: 0,
    dexterity: 4,
  },
  baseHp: 15,
  baseMp: 0,
  specials: [],
  items: [...ItemLootByLevel[1]],
  money: [...MoneyLootByLevel[2]],
  // this monster can not live in water or sand
  terrains: [ETerrain.Floor, ETerrain.Pit],
  effects: [
    ETerrainEffect.Antimagic,
    ETerrainEffect.Darkness,
    ETerrainEffect.Extinguish,
    ETerrainEffect.Fog,
  ],
  pack: [...getNumberBag(14, 1), 4, 3, 3, 2, 2, 2],
};

const GiantSpider: IBaseMonster = {
  name: "Giant Spider",
  picture: "Giant_Spider.webp",
  type: "insect",
  alignment: EAlignment.Neutral,
  level: 2,
  stats: {
    strength: 8,
    intelligence: 0,
    wisdom: 0,
    endurance: 9,
    charisma: 0,
    dexterity: 10,
  },
  baseHp: 18,
  baseMp: 0,
  specials: [],
  items: [...ItemLootByLevel[2]],
  money: [...MoneyLootByLevel[2]],
  // this monster can not live in water or sand
  terrains: [ETerrain.Floor, ETerrain.Pit],
  effects: [
    ETerrainEffect.Antimagic,
    ETerrainEffect.Darkness,
    ETerrainEffect.Extinguish,
    ETerrainEffect.Fog,
  ],
  pack: [...getNumberBag(7, 1), 3, 2, 2],
};

const PoisonousSnake: IBaseMonster = {
  name: "Poisonous Snake",
  picture: "Poisonous_Snake.webp",
  type: "reptile",
  alignment: EAlignment.Neutral,
  level: 2,
  stats: {
    strength: 10,
    intelligence: 0,
    wisdom: 0,
    endurance: 9,
    charisma: 0,
    dexterity: 8,
  },
  baseHp: 8,
  baseMp: 0,
  specials: [],
  items: [...ItemLootByLevel[2]],
  money: [...MoneyLootByLevel[2]],
  // this monster can not live in water
  terrains: [ETerrain.Floor, ETerrain.Pit, ETerrain.Quicksand],
  effects: [
    ETerrainEffect.Antimagic,
    ETerrainEffect.Darkness,
    ETerrainEffect.Extinguish,
    ETerrainEffect.Fog,
  ],
  // only single
  pack: [1],
};

const GlobalMonsterCatalogue: Record<string, IBaseMonster> = createCatalogue([
  GiantRat,
  GiantSpider,
  PoisonousSnake,
]);

export default GlobalMonsterCatalogue;
