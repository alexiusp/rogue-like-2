import { EAlignment } from "../common/alignment";
import { getNullBag, getNumberBag } from "../common/random";
import { ETerrainEffect } from "../dungeon/types";
import { IBaseMonster } from "./model";

const BaseLevel1ItemLoot: (string | null)[] = [
  "Bronze Dagger",
  "Bronze Dagger",
  "Bronze Dagger",
  "Bronze Dagger",
  "Wooden Shield",
  "Wooden Shield",
  "Leather Boots",
  "Leather Belt",
  "Healing Potion",
  "Healing Potion",
  ...getNullBag(30),
];

const BaseLevel2ItemLoot: (string | null)[] = [
  "Bronze Dagger",
  "Iron Dagger",
  "Iron Dagger",
  "Iron Dagger",
  "Wooden Shield",
  "Leather Boots",
  "Leather Belt",
  "Healing Potion",
  "Healing Potion",
  "Healing Potion",
  ...getNullBag(30),
];

const BaseLevel1MoneyLoot: (number | null)[] = [
  50,
  50,
  20,
  20,
  20,
  10,
  10,
  10,
  10,
  null,
];

const BaseLevel2MoneyLoot: (number | null)[] = [
  100,
  100,
  50,
  50,
  50,
  20,
  20,
  20,
  20,
  20,
  ...getNullBag(2),
];

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
    items: [...BaseLevel1ItemLoot],
    money: [...BaseLevel1MoneyLoot],
    // this monster can not live in water or sand
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
    items: [...BaseLevel2ItemLoot],
    money: [...BaseLevel2MoneyLoot],
    // this monster can not live in water or sand
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
    items: [...BaseLevel2ItemLoot],
    money: [...BaseLevel2MoneyLoot],
    // this monster can not live in water
    effects: [
      ETerrainEffect.Quicksand,
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
