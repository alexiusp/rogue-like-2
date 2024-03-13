import { EAlignment } from "../common/alignment";
import { TStatsValues } from "../common/stats";
import GlobalMonsterCatalogue from "./GlobalMonsterCatalogue";

// type of monster will be used for charming spells
type TMonsterType = "animal" | "insect" | "humanoid" | "undead";

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
  items: Array<string | null>;
  // random bag of possible money loot
  money: Array<number | null>;
}

enum EAggroMode {
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
  const baseValue = 10 + baseHp;
  const strBonus = (stats.strength - 14) / 2;
  const endBonus = stats.endurance - 10;
  console.info("monster hp generated:", baseValue, level, strBonus, endBonus);
  return Math.round(baseValue * (1 + level / 10) + strBonus + endBonus);
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
    // TODO: magic is not implemented yet
    mp: 0,
    mpMax: 0,
  };
}
