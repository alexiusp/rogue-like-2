import { ICharacterState } from "../character/models";
import { EAlignment } from "../common/alignment";
import { RandomBag, TRandomBag, getRandomInt } from "../common/random";
import {
  TStatsValues,
  getStatsAttackModifier,
  getStatsDamageModifier,
  getStatsDefenseModifier,
  getStatsProtectionModifier,
} from "../common/stats";
import { ETerrainEffect } from "../dungeon/types";
import { TGameItem, generateRandomItem } from "../items/models";
import GlobalMonsterCatalogue from "./GlobalMonsterCatalogue";

// type of monster will be used for charming spells
type TMonsterType = "animal" | "insect" | "reptile" | "humanoid" | "undead";

// base monster info stored in the catalogue and common for all monsters
// of the same name
export interface IBaseMonster {
  // unique name to identify
  name: string;
  // picture to render
  picture: string;
  // monster type (can be used in reduced visibility as a monster name)
  type: TMonsterType;
  // Size can be introduced later when we have more races with different sizes
  // size: 'large' | 'big' | 'normal' | 'small' | 'tiny';
  // monster alignment can be used when calculating aggro, charming etc.
  // may be also aligned loot can be of same alignment?
  alignment: EAlignment;
  // general monster difficulty level can be used to calculate attack etc.
  // also puts a restriction to dungeons where it can be found
  level: number;
  // used to calculate attack, defence, hp, mp etc.
  stats: TStatsValues;
  // base values to calculate monster hp and mp
  baseHp: number;
  baseMp: number;
  // possible special abilities (not yet implemented)
  // attacks, resistances, spells etc.
  specials: Array<string>;
  // random bag of possible additional loot (names to calculate from)
  items: TRandomBag<string>;
  // random bag of possible money loot
  money: TRandomBag<number>;
  // random bag for possible amount in encounter
  pack: TRandomBag<number>;
  // possible terraing effects for this monster
  // some monsters can for example only live in water or in sand
  effects: Array<ETerrainEffect | null>;
}

export enum EAggroMode {
  // mode when moster attacks character
  Angry,
  // monster is neutral
  Neutral,
  // monster is charmed / wants to join character
  Peaceful,
}

// monster data which can vary for each monster of the same name
// in the game during runtime
export interface IGameMonster {
  // reference to a monster name (see IBaseMonster) in the catalogue
  monster: string;
  // current values for hp and mp
  // hit points - monster health
  hp: number;
  hpMax: number;
  // mana points - amount of magic powers
  mp: number;
  mpMax: number;
  // current aggro mode
  aggro: EAggroMode;
}

function generateMonsterHp(baseHp: number, level: number, stats: TStatsValues) {
  const baseValue = getRandomInt(baseHp, 10);
  const strBonus = (stats.strength - 14) / 2;
  const endBonus = stats.endurance - 10;
  const finalHp = Math.max(
    1,
    Math.round(baseValue * (1 + level / 10) + strBonus + endBonus),
  );
  console.log("generated monster hp:", baseValue, finalHp);
  return finalHp;
}

// generates a specific monster for given dungeon level
export function generateNewMonsterByName(
  monsterName: string,
  dungeonLevel: number,
): IGameMonster {
  const baseMonster = GlobalMonsterCatalogue[monsterName];
  const levelBonus = dungeonLevel - baseMonster.level + 1;
  const hp = generateMonsterHp(
    baseMonster.baseHp,
    levelBonus,
    baseMonster.stats,
  );
  return {
    monster: monsterName,
    hp,
    hpMax: hp,
    aggro: EAggroMode.Neutral,
    mp: 0,
    mpMax: 0,
  };
}

export function getMonsterDV(monster: IGameMonster) {
  const baseValue = 1;
  const monsterName = monster.monster;
  const monsterDetails = GlobalMonsterCatalogue[monsterName];
  const statsModifier = getStatsDefenseModifier(monsterDetails.stats);
  console.log(
    `getMonsterDV. baseValue:${baseValue} level:1 statsModifier:${statsModifier}`,
  );
  return Math.round(baseValue + monsterDetails.level * statsModifier);
}

export function getMonsterPV(monster: IGameMonster) {
  const baseValue = 0;
  const monsterName = monster.monster;
  const monsterDetails = GlobalMonsterCatalogue[monsterName];
  const statsModifier = getStatsProtectionModifier(monsterDetails.stats);
  console.log(
    `getMonsterPV. baseValue:${baseValue} level:1 statsModifier:${statsModifier}`,
  );
  return Math.round(baseValue + monsterDetails.level * statsModifier);
}

export function getMonsterAttack(monster: IGameMonster) {
  const baseValue = 5;
  const monsterName = monster.monster;
  const monsterDetails = GlobalMonsterCatalogue[monsterName];
  const statsModifier = getStatsAttackModifier(monsterDetails.stats);
  console.log(
    `getMonsterAttack. baseValue:${baseValue} level:1 statsModifier:${statsModifier}`,
  );
  return Math.round(baseValue + monsterDetails.level * statsModifier);
}

export function getMonsterDamage(monster: IGameMonster) {
  const baseValue = 1;
  const monsterName = monster.monster;
  const monsterDetails = GlobalMonsterCatalogue[monsterName];
  const statsModifier = getStatsDamageModifier(monsterDetails.stats);
  console.log(
    `getMonsterDamage. baseValue:${baseValue} level:1 statsModifier:${statsModifier}`,
  );
  return Math.round(baseValue + monsterDetails.level * statsModifier);
}

export function areAllMonstersDead(monsters: IGameMonster[]) {
  return monsters.every((m) => m.hp === 0);
}

export function generateMonstersMoneyReward(monsters: IGameMonster[]) {
  let total = 0;
  for (const monster of monsters) {
    const monsterData = GlobalMonsterCatalogue[monster.monster];
    const moneyBag = new RandomBag(monsterData.money);
    const reward = moneyBag.getRandomItem();
    if (reward !== null) {
      total += reward;
    }
  }
  return total;
}

export function generateMonstersItemsReward(
  monsters: IGameMonster[],
  character: ICharacterState,
) {
  const items: TGameItem[] = [];
  monsters.forEach((monster) => {
    const monsterData = GlobalMonsterCatalogue[monster.monster];
    const moneyBag = new RandomBag(monsterData.items);
    const reward = moneyBag.getRandomItem();
    if (reward !== null) {
      const item = generateRandomItem(reward, character);
      items.push(item);
    }
  });
  return items;
}

function getMonsterXpReward(monster: IGameMonster) {
  const hp = monster.hpMax;
  const monsterData = GlobalMonsterCatalogue[monster.monster];
  return monsterData.level * 10 + hp;
}

export function generateMonstersXpReward(monsters: IGameMonster[]) {
  const total = monsters.reduce((acc, m) => acc + getMonsterXpReward(m), 0);
  return total;
}
