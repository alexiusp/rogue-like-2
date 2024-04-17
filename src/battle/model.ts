import {
  getCharacterAttack,
  getCharacterDamage,
  getCharacterDefense,
  getCharacterProtection,
} from "../character/models";
import { TCharacterCombinedState } from "../character/types";
import { getRandomInt, rollDiceCheck } from "../common/random";
import { getTileIndexByCoordinates } from "../dungeon/model";
import { IMonsterMapTile, TDungeonState, TMapTile } from "../dungeon/types";
import {
  EAggroMode,
  IGameMonster,
  getMonsterAttack,
  getMonsterDV,
  getMonsterDamage,
  getMonsterPV,
} from "../monsters/model";
import { TMonstersHitResult } from "./types";

export function rollAttack(attackValue: number, defenseValue: number) {
  const rollValue = 50 - attackValue + defenseValue;
  return rollDiceCheck(rollValue, "1D100");
}

export function rollAttackCharacterVsMonster(
  character: TCharacterCombinedState,
  monster: IGameMonster,
) {
  const attack = getCharacterAttack(character);
  const defense = getMonsterDV(monster);
  return rollAttack(attack, defense);
}

export function rollDamage(damageValue: number, protectionValue: number) {
  console.log(
    `rollDamage damageValue:${damageValue} vs protectionValue:${protectionValue}`,
  );
  return Math.max(1, Math.abs(getRandomInt(damageValue, 1) - protectionValue));
}

export function rollDamageCharacterVsMonster(
  character: TCharacterCombinedState,
  monster: IGameMonster,
) {
  const damage = getCharacterDamage(character);
  const protection = getMonsterPV(monster);
  const damageDone = rollDamage(damage, protection);
  return Math.min(damageDone, monster.hp);
}

export function rollAttackMonsterVsCharacter(
  character: TCharacterCombinedState,
  monster: IGameMonster,
  isDefending: boolean,
) {
  const attack = getMonsterAttack(monster);
  const defense = getCharacterDefense(character, isDefending);
  return rollAttack(attack, defense);
}

export function rollDamageMonsterVsCharacter(
  character: TCharacterCombinedState,
  monster: IGameMonster,
) {
  const damage = getMonsterDamage(monster);
  const protection = getCharacterProtection(character);
  const damageDone = rollDamage(damage, protection);
  return Math.min(damageDone, character.hp);
}

type TToggleMonstersAggroParams = {
  level: number;
  tile: TMapTile;
  state: TDungeonState;
};
export function toggleMonstersAggro({
  level,
  tile,
  state,
}: TToggleMonstersAggroParams): TDungeonState {
  const mapTile = tile as IMonsterMapTile;
  const monsters = mapTile.encounter.monsters.map((m) => ({
    ...m,
    aggro: EAggroMode.Angry,
  }));

  const levelMap = [...state[level]];
  const updatedMapTile = { ...mapTile };
  const tileIndex = getTileIndexByCoordinates(
    { x: updatedMapTile.x, y: updatedMapTile.y },
    levelMap,
  );
  updatedMapTile.encounter = {
    ...updatedMapTile.encounter,
    monsters,
  };
  levelMap[tileIndex] = updatedMapTile;
  const updatedState = [...state];
  updatedState.splice(level, 1, levelMap);
  return updatedState;
}

export function updateDungeonStateWithResultsOfAnAttack(
  level: number,
  tile: TMapTile,
  state: TDungeonState,
  monsters: IGameMonster[] | null,
  result: TMonstersHitResult,
): TDungeonState {
  if (!monsters) {
    throw new Error("wrong monsters state");
  }
  const updatedMonsters = monsters.map((monster, index) => {
    if (result.length === 0) {
      // skip udpate if result is empty
      return monster;
    }
    const damageDone = result[index];
    if (damageDone !== null) {
      return {
        ...monster,
        hp: Math.max(monster.hp + damageDone, 0),
      };
    }
    return monster;
  });

  const levelMap = [...state[level]];
  const updatedMapTile = { ...tile } as IMonsterMapTile;
  const tileIndex = getTileIndexByCoordinates(
    { x: updatedMapTile.x, y: updatedMapTile.y },
    levelMap,
  );
  updatedMapTile.encounter = {
    ...updatedMapTile.encounter,
    monsters: updatedMonsters,
  };
  levelMap[tileIndex] = updatedMapTile;
  const updatedState = [...state];
  updatedState.splice(level, 1, levelMap);
  return updatedState;
}

export function shouldCharacterBeAttackedByMonster(
  cursor: number | null,
  monsters: IGameMonster[] | null,
) {
  console.log("shouldCharacterBeAttackedByMonster start check", cursor);
  if (cursor === null) {
    return false;
  }
  if (!monsters) {
    return false;
  }
  const monster = monsters[cursor];
  // skip monsters not angry or dead
  if (monster.aggro !== EAggroMode.Angry || monster.hp === 0) {
    console.log(
      "monster dead or not angry",
      EAggroMode[monster.aggro],
      monster.hp,
    );
    console.log("shouldCharacterBeAttackedByMonster check", false);
    return false;
  }
  console.log("shouldCharacterBeAttackedByMonster check", true);
  return true;
}
