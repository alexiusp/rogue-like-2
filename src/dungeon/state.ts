import { combine, createEvent, createStore, sample } from "effector";
import { loadData, saveData } from "../common/db";
import DungeonSpec from "./dungeonSpecs";
import {
  ETerrain,
  IMapCoordinates,
  IMapTile,
  generateDungeonLevel,
} from "./model";

type TDungeonState = {
  [level: number]: Array<IMapTile>;
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

export const startDungeonLevel = createEvent<number>();
$currentLevel.on(startDungeonLevel, (_, level) => level);
$dungeonState.on(startDungeonLevel, (state, level) => {
  const levelMap = state[level];
  const ladderIndex = levelMap.findIndex(
    (tile) => tile.terrain === ETerrain.StairsUp,
  );
  console.log("ladder", ladderIndex, levelMap);
  if (ladderIndex < 0) {
    throw new Error("Invalid map! Ladder not found!");
  }
  const updatedTile = levelMap[ladderIndex];
  updatedTile.open = true;
  levelMap.splice(ladderIndex, 1, updatedTile);
  state[level] = levelMap;
  return state;
});
sample({
  clock: startDungeonLevel,
  source: $dungeonState,
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
  target: moveCharacter,
});

export const $dungeonLevelMap = combine(
  $currentLevel,
  $dungeonState,
  $characterPosition,
  (level, state, position) => {
    const levelSpec = DungeonSpec[level];
    const levelMap = state[level];

    return {
      width: levelSpec.width,
      height: levelSpec.height,
      map: levelMap,
      character: position,
    };
  },
);
