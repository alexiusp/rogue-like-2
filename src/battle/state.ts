import { createEffect, createEvent, createStore, sample } from "effector";
import {
  ICharacterState,
  getCharacterAttack,
  getCharacterDamage,
  getCharacterDefense,
  getCharacterProtection,
} from "../character/models";
import {
  $character,
  $characterIsDead,
  characterResurrected,
} from "../character/state";
import { createDelayEffect } from "../common/delay";
import { getTileIndexByCoordinates } from "../dungeon/model";
import {
  $currentLevel,
  $currentMapTile,
  $dungeonState,
  $encounter,
  startMonsterBattle,
} from "../dungeon/state";
import {
  EEncounterType,
  IMonsterEncounter,
  IMonsterMapTile,
} from "../dungeon/types";
import { TGameItem, itemsAreSame } from "../items/models";
import { messageAdded } from "../messages/state";
import {
  EAggroMode,
  IGameMonster,
  areAllMonstersDead,
  generateMonstersItemsReward,
  generateMonstersMoneyReward,
  generateMonstersXpReward,
  getMonsterAttack,
  getMonsterDV,
  getMonsterDamage,
  getMonsterPV,
} from "../monsters/model";
import { forward } from "../navigation";
import { rollAttack, rollDamage } from "./model";
import { IEncounterReward, TBattleRound, THitResult } from "./types";

const startCharacterRound = createEvent();
startCharacterRound.watch(() => console.info("startCharacterRound"));
sample({
  clock: startMonsterBattle,
  target: startCharacterRound,
});

export const $battleRound = createStore<TBattleRound>("character");
$battleRound.reset(startCharacterRound);
//$battleRound.on(startCharacterRound, () => 'character');
$battleRound.watch((s) => console.info("battle round:", s));

export const $hitResult = createStore<THitResult | null>(null);
$hitResult.reset(startMonsterBattle);
$hitResult.reset(startCharacterRound);
$hitResult.watch((hitResult) => console.info("hitResult:", hitResult));

type TMonsterAttackedParams = {
  mapTile: IMonsterMapTile;
  index: number;
  character: ICharacterState;
};
// calculate results of an character attacking a single monster
export const characterAttacksMonsterFx = createEffect<
  TMonsterAttackedParams,
  Array<IGameMonster>,
  Array<IGameMonster>
>(
  ({ mapTile, index, character }) =>
    new Promise((resolve, reject) => {
      // all monsters must aggro
      const monsters = mapTile.encounter.monsters.map((m) => ({
        ...m,
        aggro: EAggroMode.Angry,
      }));
      // select attacked monster
      const monster = monsters[index];
      const attack = getCharacterAttack(character);
      const defense = getMonsterDV(monster);
      const attackRoll = rollAttack(attack, defense);
      console.log("attackRoll:", attackRoll);
      if (!attackRoll) {
        messageAdded(`You missed ${monster.monster}`);
        reject(monsters);
        return;
      }
      const damage = getCharacterDamage(character);
      const protection = getMonsterPV(monster);
      const damageDone = rollDamage(damage, protection);
      console.log("damageDone", damageDone);
      monster.hp = Math.max(monster.hp - damageDone, 0);
      monsters[index] = monster;
      messageAdded(`You hit ${monster.monster} for ${damageDone}`);
      resolve(monsters);
    }),
);

// event to fire from UI
export const monsterAttacked = createEvent<number>();
// collect data from stores to calculate an attack
sample({
  clock: monsterAttacked,
  source: { tile: $currentMapTile, character: $character },
  target: characterAttacksMonsterFx,
  fn: ({ tile, character }, index) => {
    const mapTile = tile as IMonsterMapTile;
    const params: TMonsterAttackedParams = { mapTile, character, index };
    return params;
  },
});

const characterToMonsterTransition = createEvent();
characterToMonsterTransition.watch(() =>
  console.info("characterToMonsterTransition"),
);
// stop rounds rotation when all monsters are dead
sample({
  clock: characterAttacksMonsterFx.finally,
  filter: (clock) => {
    const result = clock.status === "done" ? clock.result : clock.error;
    return !areAllMonstersDead(result);
  },
  target: characterToMonsterTransition,
});
// switch round stage after attack is done
$battleRound.on(characterToMonsterTransition, () => "character-to-monster");
// set animation state to result of an attack
$hitResult.on(characterAttacksMonsterFx.done, () => "hit");
$hitResult.on(characterAttacksMonsterFx.fail, () => "miss");

// update dungeon state with results of an attack
sample({
  clock: characterAttacksMonsterFx.finally,
  source: { state: $dungeonState, level: $currentLevel },
  target: $dungeonState,
  fn: (source, clock) => {
    const params = clock.params;
    const result = clock.status === "done" ? clock.result : clock.error;
    const { state, level } = source;
    const updatedMonsters = [...result];
    const levelMap = [...state[level]];
    const updatedMapTile = { ...params.mapTile };
    const tileIndex = getTileIndexByCoordinates(
      { x: updatedMapTile.x, y: updatedMapTile.y },
      levelMap,
    );
    updatedMapTile.encounter = {
      ...updatedMapTile.encounter,
      monsters: updatedMonsters,
    };
    levelMap[tileIndex] = updatedMapTile;
    return {
      ...state,
      [level]: levelMap,
    };
  },
});

const BATTLE_ROUND_DELAY_MS = 1000;
const delay = createDelayEffect(BATTLE_ROUND_DELAY_MS);

const characterToMonsterTransitionFx = createEffect(delay);
// reset hit result when transition done
$hitResult.reset(characterToMonsterTransitionFx.done);

// trigger character to monster transition effect when round triggered
sample({
  clock: characterToMonsterTransition,
  target: characterToMonsterTransitionFx,
});

const startMonstersRound = createEvent();
// trigger monsters round when transition done
sample({
  clock: characterToMonsterTransitionFx.done,
  target: startMonstersRound,
});
// switch to battle round when transition done
$battleRound.on(startMonstersRound, () => "monster");

// length of monsters array of current encounter
const $monstersLength = createStore<number>(0);
$monstersLength.watch((length) => console.info("$monstersLength:", length));
export const $monstersCursor = createStore<number | null>(null);
$monstersCursor.watch((cursor) => console.info("$monstersCursor:", cursor));
$monstersCursor.reset(startCharacterRound);

// calculate monsters length
sample({
  clock: startMonsterBattle,
  source: $encounter,
  target: $monstersLength,
  filter: (encounter) => encounter?.type === EEncounterType.Monster,
  fn: (encounter) => {
    return (encounter as IMonsterEncounter).monsters.length;
  },
});

// set cursor to the first alive monster when round starts
sample({
  clock: startMonstersRound,
  source: $encounter,
  target: $monstersCursor,
  fn: (encounter) => {
    if (!encounter || encounter.type !== EEncounterType.Monster) {
      throw Error("Wrong encounter");
    }
    let cursor = 0;
    while (encounter.monsters[cursor].hp === 0) {
      cursor += 1;
    }
    return cursor;
  },
});

// event to fire when monster attacks character
// parameter - monster index in the monsters list of an encounter
const characterAttackedByMonster = createEvent<number | null>();
characterAttackedByMonster.watch((cursor) =>
  console.info("characterAttackedByMonster:", cursor),
);

sample({
  clock: $monstersCursor,
  source: $monstersCursor,
  filter(src) {
    return src !== null;
  },
  target: characterAttackedByMonster,
});

type TCharacterAttackedParams = {
  monster: IGameMonster;
  character: ICharacterState;
};
export const monsterAttackCharacterFx = createEffect<
  TCharacterAttackedParams,
  ICharacterState
>(
  (params) =>
    new Promise((resolve, reject) => {
      const { character, monster } = params;
      const attack = getMonsterAttack(monster);
      const defense = getCharacterDefense(character);
      const attackRoll = rollAttack(attack, defense);
      console.log("attack roll:", attackRoll);
      if (!attackRoll) {
        reject();
        return;
      }
      const damage = getMonsterDamage(monster);
      const protection = getCharacterProtection(character);
      const damageDone = rollDamage(damage, protection);
      console.log("damageDone", damageDone);
      const hp = Math.max(character.hp - damageDone, 0);
      character.hp = hp;
      resolve(character);
    }),
);

// trigger monster attack calculation
sample({
  clock: characterAttackedByMonster,
  source: { character: $character, encounter: $encounter },
  target: monsterAttackCharacterFx,
  filter: (src, clock) => {
    console.log("characterAttackedByMonster monster attack start check", clock);
    if (clock === null) {
      return false;
    }
    const monster = (src.encounter as IMonsterEncounter).monsters[clock];
    // skip monsters not angry or dead
    if (monster.aggro !== EAggroMode.Angry || monster.hp === 0) {
      console.log(
        "characterAttackedByMonster dead or not angry - skip",
        EAggroMode[monster.aggro],
        monster.hp,
      );
      return false;
    }
    console.log("characterAttackedByMonster monster attack start check", true);
    return true;
  },
  fn(src, clock) {
    const monster = (src.encounter as IMonsterEncounter).monsters[clock!];
    const character = src.character;
    return {
      character,
      monster,
    };
  },
});

// pause between different monster attacks
export const monsterAttackTransitionFx = createEffect(delay);

// trigger delay transition when monster was skipped
sample({
  clock: characterAttackedByMonster,
  source: { character: $character, encounter: $encounter },
  target: monsterAttackTransitionFx,
  filter: (src, clock) => {
    console.log("characterAttackedByMonster monster skip check", clock);
    if (clock === null) {
      return false;
    }
    const monster = (src.encounter as IMonsterEncounter).monsters[clock];
    // skipped monsters not angry or dead should trigger immediate transition
    if (monster.aggro !== EAggroMode.Angry || monster.hp === 0) {
      console.log(
        "characterAttackedByMonster monster dead or not angry - trigger transition to next",
        monster,
        clock,
      );
      return true;
    }
    console.log("characterAttackedByMonster monster skip check", false);
    return false;
  },
});

// set animation state to result of an attack
$hitResult.on(monsterAttackCharacterFx.done, () => "hit");
$hitResult.on(monsterAttackCharacterFx.fail, () => "miss");

// update character state after successfull attack
$character.on(monsterAttackCharacterFx.done, (_, params) => {
  return {
    ..._,
    ...params.result,
  };
});

// monster attack completed - start transition to next monster
sample({
  clock: monsterAttackCharacterFx.finally,
  target: monsterAttackTransitionFx,
});

// switch to next monster if any
sample({
  clock: monsterAttackTransitionFx.done,
  target: $monstersCursor,
  source: {
    index: $monstersCursor,
    length: $monstersLength,
    characterIsDead: $characterIsDead,
    encounter: $encounter,
  },
  fn: (src) => {
    const { index, length, characterIsDead, encounter } = src;
    // check if round ended
    const check = index !== null && index < length - 1 && !characterIsDead;
    if (!check) {
      console.log("round ended");
      // set cursor to null if last alive monster
      return null;
    }
    const monsters = (encounter as IMonsterEncounter).monsters;
    let cursor = index + 1;
    // find next alive and angry monster
    while (
      index < length - 1 ||
      !monsters[cursor].hp ||
      monsters[cursor].aggro !== EAggroMode.Angry
    ) {
      cursor += 1;
    }
    console.log("switch to next monster", cursor);
    // if no alive monsters left set cursor to null
    return monsters[cursor].hp ? cursor : null;
  },
});

// reset hit result animation
$hitResult.reset(monsterAttackTransitionFx.done);

// trigger transition to character when all monsters attacked
const monsterToCharacterTransition = createEvent();
monsterToCharacterTransition.watch(() =>
  console.info("monsterToCharacterTransition"),
);

sample({
  clock: monsterAttackTransitionFx.finally,
  target: monsterToCharacterTransition,
  source: { index: $monstersCursor, length: $monstersLength },
  filter: (src) => {
    const { index } = src;
    // if cursor is reset to null - monster phase is finished
    const monstersAttackFinished = index === null;
    console.log("monstersAttackFinished", monstersAttackFinished);
    return monstersAttackFinished;
  },
});
// switch round stage after attack is done
$battleRound.on(monsterToCharacterTransition, () => "monster-to-character");

const monsterToCharacterTransitionFx = createEffect(delay);

// trigger monster to character transition effect when round triggered
sample({
  clock: monsterToCharacterTransition,
  target: monsterToCharacterTransitionFx,
});

// start new character round when transition finished
sample({
  clock: monsterToCharacterTransitionFx.done,
  target: startCharacterRound,
});

export const battleEnded = createEvent<IGameMonster[]>();

// detect end of the battle after character round
sample({
  clock: characterAttacksMonsterFx.finally,
  filter: (clock) => {
    const result = clock.status === "done" ? clock.result : clock.error;
    return areAllMonstersDead(result);
  },
  fn(clock) {
    const result = clock.status === "done" ? clock.result : clock.error;
    return result;
  },
  target: battleEnded,
});
sample({ clock: battleEnded, target: forward, fn: () => "reward" });

export const $encounterMoneyReward = createStore(0);
export const $encounterItemsReward = createStore<TGameItem[]>([]);
export const $encounterXpReward = createStore(0);

//const encounterEndedWithReward = createEvent<IEncounterReward>();
const rewardCalculationFx = createEffect<
  { character: ICharacterState; monsters: IGameMonster[] },
  IEncounterReward
>(({ character, monsters }) => {
  const money = generateMonstersMoneyReward(monsters);
  const xp = generateMonstersXpReward(monsters);
  const items = generateMonstersItemsReward(monsters, character);
  const pluralSuffix = items.length > 1 ? "s" : "";
  messageAdded(
    `You've got ${money} gold, ${xp} experience and ${items.length} item${pluralSuffix} as a reward for this victory!`,
  );
  const reward: IEncounterReward = {
    money,
    xp,
    items,
  };
  return reward;
});

sample({
  clock: battleEnded,
  source: $character,
  target: rewardCalculationFx,
  fn: (character, monsters) => ({ character, monsters }),
});

$encounterMoneyReward.on(
  rewardCalculationFx.doneData,
  (_, reward) => reward.money,
);
$encounterItemsReward.on(
  rewardCalculationFx.doneData,
  (_, reward) => reward.items,
);
$encounterXpReward.on(rewardCalculationFx.doneData, (_, reward) => reward.xp);

export const itemDropped = createEvent<TGameItem>();
$encounterItemsReward.on(itemDropped, (items, item) => {
  const index = items.findIndex(itemsAreSame(item));
  if (index < 0) {
    throw new Error("Item to drop not found in the loot!");
  }
  const udpatedItems = [...items];
  udpatedItems.splice(index, 1);
  return udpatedItems;
});

export const waitForRescueTeam = createEvent();
sample({
  clock: waitForRescueTeam,
  source: $currentLevel,
  target: characterResurrected,
});
