import { RandomBag } from "../common/random";
import GlobalMonsterCatalogue from "../monsters/GlobalMonsterCatalogue";
import { ETerrain, ETerrainEffect } from "./types";

const MonstersByLevel = [
  [],
  ["Giant Rat", "Giant Spider", "Poisonous Snake"],
  ["Giant Rat", "Giant Spider", "Poisonous Snake"],
  ["Giant Rat", "Giant Spider", "Poisonous Snake"],
  ["Giant Rat", "Giant Spider", "Poisonous Snake"],
  ["Giant Rat", "Giant Spider", "Poisonous Snake"],
  ["Giant Rat", "Giant Spider", "Poisonous Snake"],
  ["Giant Rat", "Giant Spider", "Poisonous Snake"],
];

export function getMonstersForLevelAndTerrain(
  level: number,
  terrain: ETerrain,
  effects: ETerrainEffect[],
) {
  let levelMonsters = MonstersByLevel[level];
  // filter by terrain
  levelMonsters = levelMonsters.filter((monsterName) => {
    const baseMonster = GlobalMonsterCatalogue[monsterName];
    return baseMonster.terrains.includes(terrain);
  });
  // filter by effects
  return levelMonsters.filter((monsterName) => {
    const baseMonster = GlobalMonsterCatalogue[monsterName];
    const canLive = effects.reduce(
      (canLiveForNow, tEffect) =>
        canLiveForNow && baseMonster.effects.includes(tEffect),
      true,
    );
    return canLive;
  });
}

export function getAmountOfMonsters(monsterName: string) {
  const baseMonster = GlobalMonsterCatalogue[monsterName];
  const randomBag = new RandomBag(baseMonster.pack);
  return randomBag.getRandomItem();
}
