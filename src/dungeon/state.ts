import { combine, createEvent, createStore, sample } from "effector";
import { rollAggro } from "../character/models";
import { $character } from "../character/state";
import { loadCharacterData, saveCharacterData } from "../common/db";
import { EAggroMode, areAllMonstersDead } from "../monsters/model";
import { forward } from "../navigation";
import DungeonSpec from "./dungeonSpecs";
import {
  generateDungeonLevel,
  getMapTileByCoordinates,
  getTileIndexByCoordinates,
  isStairsDown,
  isStairsUp,
} from "./model";
import {
  EEncounterType,
  ETerrain,
  IMapCoordinates,
  IMonsterEncounter,
  TMapTile,
} from "./types";

type TDungeonState = {
  [level: number]: Array<TMapTile>;
};

const startState: TDungeonState = (() => {
  const cachedData = loadCharacterData<TDungeonState>("dungeon");
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
  saveCharacterData("dungeon", state);
  return state;
});
export const dungeonLoaded = createEvent();
$dungeonState.on(dungeonLoaded, (state) => {
  const dungeonState = loadCharacterData<TDungeonState>("dungeon");
  if (!dungeonState) {
    return state;
  }
  return dungeonState;
});

// this must be removed after development phase
// characters must start every new session from the city
const startingLevel: number = (() => {
  const cachedData = loadCharacterData<number>("dungeon-level");
  if (cachedData !== null) {
    return cachedData;
  }
  return 1;
})();

export const $currentLevel = createStore(startingLevel);
$currentLevel.on(dungeonSaved, (state) => {
  saveCharacterData("dungeon-level", state);
  return state;
});
$currentLevel.on(dungeonLoaded, (state) => {
  const levelState = loadCharacterData<number>("dungeon-level");
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

export const startEncounter = createEvent();
startEncounter.watch(() => console.info("startEncounter"));

// trigger startEncounter event
sample({
  clock: moveCharacter,
  source: $currentMapTile,
  target: startEncounter,
  filter: (mapTile) => {
    const encounter = mapTile.encounter;
    if (!encounter) {
      return false;
    }
    if (encounter.type === EEncounterType.Monster) {
      // check for alive monsters
      return !areAllMonstersDead(encounter.monsters);
    }
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
export const $encounter = $currentMapTile.map((tile) => tile.encounter ?? null);

// see src/battle/model for further details about battle calculation
export const startMonsterBattle = createEvent();
startMonsterBattle.watch(() => console.info("startMonsterBattle"));

// trigger startMonsterBattle
sample({
  clock: startEncounter,
  target: startMonsterBattle,
  source: $encounter,
  filter: (encounter) =>
    !!encounter && encounter.type === EEncounterType.Monster,
});

export const $isOnStairsUp = $currentMapTile.map((tile) =>
  isStairsUp(tile.terrain),
);
export const $isOnStairsDown = $currentMapTile.map((tile) =>
  isStairsDown(tile.terrain),
);

// roll for aggro when entering battle
sample({
  clock: startMonsterBattle,
  source: {
    mapTile: $currentMapTile,
    character: $character,
    state: $dungeonState,
    level: $currentLevel,
  },
  target: $dungeonState,
  fn: ({ character, level, mapTile, state }) => {
    const levelMap = [...state[level]];
    const tileIndex = getTileIndexByCoordinates(
      { x: mapTile.x, y: mapTile.y },
      levelMap,
    );
    const monsters = (mapTile.encounter as IMonsterEncounter).monsters;
    const updatedMonsters = monsters.map((monster) => {
      const isAggro = rollAggro(character, monster);
      console.log(`monster ${monster.monster} get angry: ${isAggro}`);
      return {
        ...monster,
        aggro: isAggro ? EAggroMode.Angry : EAggroMode.Neutral,
      };
    });
    // check charisma and alignment for triggering aggro
    mapTile.encounter = {
      ...(mapTile.encounter as IMonsterEncounter),
      monsters: updatedMonsters,
    };
    levelMap[tileIndex] = mapTile;
    return {
      ...state,
      [level]: levelMap,
    };
  },
});
