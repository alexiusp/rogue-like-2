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
} from "../character/models";
import { $character } from "../character/state";
import { loadData, saveData } from "../common/db";
import {
  EAggroMode,
  IGameMonster,
  getMonsterDV,
  getMonsterPV,
} from "../monsters/model";
import { forward } from "../navigation";
import DungeonSpec from "./dungeonSpecs";
import {
  ETerrain,
  IMapCoordinates,
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

// redirect to encounter screen if moved to tile with it
sample({
  clock: moveCharacter,
  source: $currentMapTile,
  target: forward,
  filter: (mapTile) => {
    return !!mapTile.encounter;
  },
  fn: () => "encounter",
});

type TBattleRound =
  | "character"
  | "character-to-monster"
  | "monster"
  | "monster-to-character";

export const $battleRound = createStore<TBattleRound>("character");

type THitResult = "hit" | "miss";
export const $hitResult = createStore<THitResult | null>(null);

type TMonsterAttackedParams = {
  mapTile: IMonsterMapTile;
  index: number;
  character: ICharacterState;
};
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

const monsterAttacked = createEvent<number>();
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

$battleRound.on(
  characterAttacksMonsterFx.finally,
  () => "character-to-monster",
);
$hitResult.on(characterAttacksMonsterFx.done, () => "hit");
$hitResult.on(characterAttacksMonsterFx.fail, () => "miss");

sample({
  clock: characterAttacksMonsterFx.finally,
  source: { state: $dungeonState, level: $currentLevel },
  target: $dungeonState,
  fn: (source, clock) => {
    const params = clock.params;
    const result = clock.status === "done" ? clock.result : clock.error;
    const { state, level } = source;

    return {
      ...state,
    };
  },
});

function delay() {
  return new Promise((resolve) => setTimeout(resolve, 500));
}

const characterToMonsterTransition = createEffect(delay);
const monsterToCharacterTransition = createEffect(delay);
$battleRound.on(characterToMonsterTransition.done, () => "monster");
$battleRound.on(monsterToCharacterTransition.done, () => "character");

export const monstersAttackCharacter = createEffect(() => {});
