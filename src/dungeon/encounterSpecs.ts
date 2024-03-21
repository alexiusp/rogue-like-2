import { RandomBag } from "../common/random";
import GlobalMonsterCatalogue from "../monsters/GlobalMonsterCatalogue";
import { ETerrain, ETerrainEffect } from "./types";

const MonstersByLevel = [
  [],
  ["Giant Rat", "Giant Spider", "Poisonous Snake"],
  ["Giant Rat", "Giant Spider", "Poisonous Snake"],
];

export function getMonstersForLevelAndTerrain(
  level: number,
  terrain: ETerrain,
  effects: ETerrainEffect[],
) {
  const levelMonsters = MonstersByLevel[level];
  // filter by terrain
  if (terrain !== ETerrain.Floor) {
    // currently we don't have any monsters for any other
    // terraing than normal floor
    return [];
  }
  // filter by effects
  return levelMonsters.filter((monsterName) => {
    const baseMonster = GlobalMonsterCatalogue[monsterName];
    const canLive = effects.reduce(
      (canLiveForNow, tEffect) =>
        canLiveForNow && baseMonster.effects.includes(tEffect),
      true,
    );
    console.log(
      `${monsterName} can live in (${effects.map((e) => ETerrainEffect[e]).join(",")}): ${canLive}`,
    );
    return canLive;
  });
}

export function getAmountOfMonsters(monsterName: string) {
  const baseMonster = GlobalMonsterCatalogue[monsterName];
  const randomBag = new RandomBag(baseMonster.pack);
  return randomBag.getRandomItem();
}
