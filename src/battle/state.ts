import { createEffect, createEvent, createStore, sample } from "effector";
import {
  ICharacterState,
  getCharacterAttack,
  getCharacterDamage,
  getCharacterDefense,
  getCharacterProtection,
} from "../character/models";
import { $character } from "../character/state";
import {
  EEncounterType,
  IMonsterEncounter,
  IMonsterMapTile,
  getTileIndexByCoordinates,
  rollAttack,
  rollDamage,
} from "../dungeon/model";
import {
  $currentLevel,
  $currentMapTile,
  $dungeonState,
  $encounter,
  startMonsterBattle,
} from "../dungeon/state";
import {
  EAggroMode,
  IGameMonster,
  areAllMonstersDead,
  getMonsterAttack,
  getMonsterDV,
  getMonsterDamage,
  getMonsterPV,
} from "../monsters/model";
import { forward } from "../navigation";
import { TBattleRound, THitResult } from "./model";

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
// TODO: refactor to support multiple attacks
export const characterAttacksMonsterFx = createEffect<
  TMonsterAttackedParams,
  Array<IGameMonster>,
  Array<IGameMonster>
>(
  ({ mapTile, index, character }) =>
    new Promise((resolve, reject) => {
      const monsters = mapTile.encounter.monsters;
      // all monsters must aggro
      for (const m of monsters) {
        // TODO: check if monster is charmed
        m.aggro = EAggroMode.Angry;
      }
      // select attacked monster
      const monster = monsters[index];
      const attack = getCharacterAttack(character);
      const defense = getMonsterDV(monster);
      const attackRoll = rollAttack(attack, defense);
      console.log("attackRoll:", attackRoll);
      if (!attackRoll) {
        reject(monsters);
        return;
      }
      const damage = getCharacterDamage(character);
      const protection = getMonsterPV(monster);
      const damageDone = rollDamage(damage, protection);
      // TODO: for 0 damage done we could have a different animation?
      console.log("damageDone", damageDone);
      monster.hp = Math.max(monster.hp - damageDone, 0);
      monsters[index] = monster;
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
    const mapTile = params.mapTile;
    const tileIndex = getTileIndexByCoordinates(
      { x: mapTile.x, y: mapTile.y },
      levelMap,
    );
    mapTile.encounter = {
      ...mapTile.encounter,
      monsters: updatedMonsters,
    };
    levelMap[tileIndex] = mapTile;
    return {
      ...state,
      [level]: levelMap,
    };
  },
});

const BATTLE_ROUND_DELAY_MS = 1000;
function delay() {
  return new Promise((resolve) => setTimeout(resolve, BATTLE_ROUND_DELAY_MS));
}

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
export const $monstersCursor = createStore<number | null>(null);
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

// set cursor to the first monster when round starts
$monstersCursor.on(startMonstersRound, () => 0);

// event to fire when monster attacks character
// parameter - monster index in the monsters list of an encounter
const characterAttackedByMonster = createEvent<number | null>();

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
      // TODO: for 0 damage done we could have a different animation?
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
    if (clock === null) {
      return false;
    }
    const monster = (src.encounter as IMonsterEncounter).monsters[clock];
    // skip monsters not angry or dead
    if (monster.aggro !== EAggroMode.Angry || monster.hp === 0) {
      return false;
    }
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
    if (clock === null) {
      return false;
    }
    const monster = (src.encounter as IMonsterEncounter).monsters[clock];
    // skipped monsters not angry or dead should trigger immediate transition
    if (monster.aggro !== EAggroMode.Angry || monster.hp === 0) {
      return true;
    }
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
  source: { index: $monstersCursor, length: $monstersLength },
  filter: (src) => {
    const { index, length } = src;
    return (index ?? 0) < length - 2;
  },
  fn: (src) => (src.index ?? 0) + 1,
});

// reset hit result animation
$hitResult.reset(monsterAttackTransitionFx.done);

// trigger transition to character when all monsters attacked
sample({
  clock: monsterAttackTransitionFx.done,
  target: $monstersCursor,
  source: { index: $monstersCursor, length: $monstersLength },
  filter: (src) => {
    const { index, length } = src;
    return (index ?? 0) < length - 2;
  },
  fn: (src) => (src.index ?? 0) + 1,
});

const monsterToCharacterTransition = createEvent();
monsterToCharacterTransition.watch(() =>
  console.info("monsterToCharacterTransition"),
);

sample({
  clock: monsterAttackTransitionFx.finally,
  target: monsterToCharacterTransition,
  source: { index: $monstersCursor, length: $monstersLength },
  filter: (src) => {
    const { index, length } = src;
    return (index ?? 0) === length - 1;
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

export const battleEnded = createEvent();
battleEnded.watch(() => console.info("battleEnded"));
// detect end of the battle after character round
// TODO: add similar detection after monsters round in case they are poisoned etc.
sample({
  clock: characterAttacksMonsterFx.finally,
  filter: (clock) => {
    const result = clock.status === "done" ? clock.result : clock.error;
    return areAllMonstersDead(result);
  },
  target: battleEnded,
});
sample({ clock: battleEnded, target: forward, fn: () => "reward" });

// TODO start reward calculation
//const $encounterReward = createStore();
