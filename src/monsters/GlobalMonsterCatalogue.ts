import { EAlignment } from "../common/alignment";
import { ItemLootByLevel, MoneyLootByLevel } from "../common/loot";
import { getNumberBag } from "../common/random";
import { ETerrain, ETerrainEffect } from "../dungeon/types";
import { IBaseMonster } from "./model";

const GlobalMonsterCatalogue: { [name: string]: IBaseMonster } = {
  "Giant Rat": {
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
  },
  "Giant Spider": {
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
  },
  "Poisonous Snake": {
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
  },
};

export default GlobalMonsterCatalogue;
