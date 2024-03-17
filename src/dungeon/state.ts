import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import {
  ICharacterState,
  getCharacterAttack,
  getCharacterDamage,
  getCharacterDefense,
  getCharacterProtection,
} from "../character/models";
import { $character } from "../character/state";
import { loadData, saveData } from "../common/db";
import {
  EAggroMode,
  IGameMonster,
  getMonsterAttack,
  getMonsterDV,
  getMonsterDamage,
  getMonsterPV,
} from "../monsters/model";
import { forward } from "../navigation";
import DungeonSpec from "./dungeonSpecs";
import {
  EEncounterType,
  ETerrain,
  IMapCoordinates,
  IMonsterEncounter,
  IMonsterMapTile,
  TMapTile,
  generateDungeonLevel,
  getMapTileByCoordinates,
  getTileIndexByCoordinates,
  rollAttack,
  rollDamage,
} from "./model";

type TDungeonState = {
  [level: number]: Array<TMapTile>;
};

const startState: TDungeonState = (() => {
  const cachedData = loadData<TDungeonState>("dungeon");
  if (cachedData !== null) {
    return cachedData;
  }
  return {
    [1]: generateDungeonLevel(1),
  };
})();

export const $dungeonState = createStore<TDungeonState>(startState);
export const dungeonSaved = createEvent();
$dungeonState.on(dungeonSaved, (state) => {
  saveData("dungeon", state);
  return state;
});
export const dungeonLoaded = createEvent();
$dungeonState.on(dungeonLoaded, (state) => {
  const dungeonState = loadData<TDungeonState>("dungeon");
  if (!dungeonState) {
    return state;
  }
  return dungeonState;
});

// this must be removed after development phase
// characters must start every new session from the city
const startingLevel: number = (() => {
  const cachedData = loadData<number>("dungeon-level");
  if (cachedData !== null) {
    return cachedData;
  }
  return 1;
})();

export const $currentLevel = createStore(startingLevel);
$currentLevel.on(dungeonSaved, (state) => {
  saveData("dungeon-level", state);
  return state;
});
$currentLevel.on(dungeonLoaded, (state) => {
  const levelState = loadData<number>("dungeon-level");
  if (!levelState) {
    return state;
  }
  return levelState;
});

export const $characterPosition = createStore<IMapCoordinates>({ x: 0, y: 0 });
export const moveCharacter = createEvent<IMapCoordinates>();
$characterPosition.on(moveCharacter, (_, newPos) => newPos);
$characterPosition.watch((currentPos) => {
  console.info("character position:", currentPos);
});

export const $dungeonLevelMap = combine(
  $currentLevel,
  $dungeonState,
  $characterPosition,
  (level, state, position) => {
    const levelSpec = DungeonSpec[level];
    const levelMap = state[level];
    console.log("$dungeonLevelMap update");
    return {
      width: levelSpec.width,
      height: levelSpec.height,
      map: levelMap,
      character: position,
    };
  },
);

export const $currentMapTile = $dungeonLevelMap.map((state) => {
  console.log("$currentMapTile update");
  return getMapTileByCoordinates(state.character, state.map);
});

export const startDungeonLevel = createEvent<number>();
$currentLevel.on(startDungeonLevel, (_, level) => level);

// position character on the map when starting a level
sample({
  clock: startDungeonLevel,
  source: $dungeonState,
  target: moveCharacter,
  fn: (dungeonState, level) => {
    console.log("dungeon start sampler", level);
    const levelMap = dungeonState[level];
    const ladderIndex = levelMap.findIndex(
      (tile) => tile.terrain === ETerrain.StairsUp,
    );
    console.log("ladder", ladderIndex, levelMap);
    if (ladderIndex < 0) {
      throw new Error("Invalid map! Ladder not found!");
    }
    const ladderTile = levelMap[ladderIndex];
    return {
      x: ladderTile.x,
      y: ladderTile.y,
    };
  },
});

// open map tile when moving character
sample({
  clock: moveCharacter,
  source: { state: $dungeonState, level: $currentLevel },
  target: $dungeonState,
  fn: ({ state, level }, coordinates) => {
    const levelMap = state[level];
    const tileIndex = getTileIndexByCoordinates(coordinates, levelMap);
    const mapTile = levelMap[tileIndex];
    mapTile.open = true;
    console.log("opening tile", mapTile);
    levelMap.splice(tileIndex, 1, mapTile);
    return {
      ...state,
      [level]: levelMap,
    };
  },
});

const startEncounter = createEvent();
startEncounter.watch(() => console.info("startEncounter"));

// trigger startEncounter event
sample({
  clock: moveCharacter,
  source: $currentMapTile,
  target: startEncounter,
  filter: (mapTile) => {
    return !!mapTile.encounter;
  },
});

// redirect to encounter screen if moved to tile with it
sample({
  clock: startEncounter,
  target: forward,
  fn: () => "encounter",
});

// current encounter
const $encounter = $currentMapTile.map((tile) => tile.encounter);

const startMonsterBattle = createEvent();
startMonsterBattle.watch(() => console.info("startMonsterBattle"));
// trigger startMonsterBattle
sample({
  clock: startEncounter,
  target: startMonsterBattle,
  source: $encounter,
  filter: (encounter) =>
    !!encounter && encounter.type === EEncounterType.Monster,
});

const startCharacterRound = createEvent();
startCharacterRound.watch(() => console.info("startCharacterRound"));
sample({
  clock: startMonsterBattle,
  target: startCharacterRound,
});

type TBattleRound =
  | "character"
  | "character-to-monster"
  | "monster"
  | "monster-to-character";

export const $battleRound = createStore<TBattleRound>("character");
$battleRound.reset(startCharacterRound);
//$battleRound.on(startCharacterRound, () => 'character');
$battleRound.watch((s) => console.info("battle round:", s));

type THitResult = "hit" | "miss";
export const $hitResult = createStore<THitResult | null>(null);
$hitResult.reset(startMonsterBattle);
$hitResult.reset(startCharacterRound);

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
      console.log("attack", attack, "defense", defense);
      const attackRoll = rollAttack(attack, defense);
      console.log("attack result:", attackRoll);
      if (!attackRoll) {
        reject(monsters);
        return;
      }
      const damage = getCharacterDamage(character);
      console.log("damage", damage);
      const protection = getMonsterPV(monster);
      console.log("protection", protection);
      const damageDone = rollDamage(damage, protection);
      console.log("damageDone", damageDone);
      monster.hp = Math.max(monster.hp - damageDone, 0);
      monsters[index] = monster;
      resolve(monsters);
    }),
);

// event to fire from UI
const monsterAttacked = createEvent<number>();
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

function delay() {
  return new Promise((resolve) => setTimeout(resolve, 500));
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
      console.log("monsterAttackCharacterFx", character, monster);

      if (monster.aggro !== EAggroMode.Angry || monster.hp === 0) {
        reject();
      }
      const attack = getMonsterAttack(monster);
      const defense = getCharacterDefense(character);
      console.log("attack", attack, "defense", defense);
      const attackRoll = rollAttack(attack, defense);
      console.log("attack result:", attackRoll);
      if (!attackRoll) {
        reject();
      }
      const damage = getMonsterDamage(monster);
      console.log("damage", damage);
      const protection = getCharacterProtection(character);
      console.log("protection", protection);
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

// TODO: trigger changes on single monster attack (hit animation, transition)
// TODO: update state on done and fail of the attack effect
// TODO: trigger changes of monster cursor when transition effect is done

const monsterToCharacterTransitionFx = createEffect(delay);
$battleRound.on(monsterToCharacterTransitionFx.done, () => "character");
$hitResult.reset(monsterToCharacterTransitionFx.done);
