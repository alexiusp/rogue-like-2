import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { rollAggro } from "../character/models";
import {
  $character,
  $characterBaseInfo,
  $characterState,
} from "../character/state";
import { IBaseCharacterInfo } from "../character/types";
import { loadCharacterData, saveCharacterData } from "../common/db";
import { createDelayEffect } from "../common/delay";
import { messageAdded } from "../messages/state";
import { EAggroMode, areAllMonstersDead } from "../monsters/model";
import { forward } from "../navigation";
import DungeonSpec from "./dungeonSpecs";
import {
  doesTileHasChest,
  generateDungeonLevel,
  getMapTileByCoordinates,
  getTileIndexByCoordinates,
  isMonsterEncounterTile,
  isTileStairs,
  respawnTiles,
  updateDungeonRespawnCounters,
} from "./model";
import {
  EEncounterType,
  IChest,
  ICommonMapTile,
  IMapCoordinates,
  IStairsMapTile,
  TDungeonState,
  TMapTile,
} from "./types";

const startState: TDungeonState = (() => {
  const cachedData = loadCharacterData<TDungeonState>("dungeon");
  if (cachedData !== null) {
    return cachedData;
  }
  // initialize with empty array as "level 0"
  const dungeon: TDungeonState = [[]];
  for (let level = 1; level < DungeonSpec.length; level++) {
    dungeon[level] = generateDungeonLevel(level);
  }
  return dungeon;
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
$dungeonState.watch((state) => console.log("dungeon state updated:", state));

export const $currentLevel = createStore(1);

export const $characterPosition = createStore<IMapCoordinates>({ x: 0, y: 0 });
export const moveCharacter = createEvent<IMapCoordinates>();
export const characterPositionChanged = createEvent<IMapCoordinates>();
$characterPosition.on(characterPositionChanged, (_, newPos) => newPos);
$characterPosition.watch((currentPos) => {
  console.info("character position:", currentPos);
});

const delay = createDelayEffect(300);
const characterMovementFx = createEffect<IMapCoordinates, IMapCoordinates>(
  async (pos) => {
    // wait some time before moving character to position
    await delay();
    return pos;
  },
);
// start delay after opening tile
sample({ clock: moveCharacter, target: characterMovementFx });
// after delay move character to tile
sample({
  clock: characterMovementFx.doneData,
  target: characterPositionChanged,
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
$dungeonLevelMap.watch((dungeonLevelMap) =>
  console.log("dungeonLevelMap updated", dungeonLevelMap),
);

export const $currentMapTile = $dungeonLevelMap.map((state) => {
  const tile = getMapTileByCoordinates(state.character, state.map);
  return tile;
});
$currentMapTile.watch((currentMapTile) =>
  console.log("$currentMapTile updated", currentMapTile),
);

export const descendToDungeonLevel = createEvent<number>();
export const ascendToDungeonLevel = createEvent<number>();
$currentLevel.on(descendToDungeonLevel, (_, level) => level);
$currentLevel.on(ascendToDungeonLevel, (_, level) => level);

sample({
  clock: descendToDungeonLevel,
  target: messageAdded,
  fn: (level) => `Descending to dungeon level ${level}`,
});

sample({
  clock: ascendToDungeonLevel,
  target: messageAdded,
  fn: (level) => `Returning back to dungeon level ${level}`,
});

// position character on the map when starting a level
sample({
  clock: descendToDungeonLevel,
  source: $dungeonState,
  target: characterPositionChanged,
  fn: (dungeonState, level) => {
    const levelMap = dungeonState[level];
    const ladderIndex = levelMap.findIndex(
      (tile) => (tile as IStairsMapTile).direction === "up",
    );
    if (ladderIndex < 0) {
      console.error(levelMap, ladderIndex);
      throw new Error("Invalid map! Ladder not found!");
    }
    const ladderTile = levelMap[ladderIndex];
    return {
      x: ladderTile.x,
      y: ladderTile.y,
    };
  },
});
// position character on the map when starting a level
sample({
  clock: ascendToDungeonLevel,
  source: $dungeonState,
  target: characterPositionChanged,
  fn: (dungeonState, level) => {
    const levelMap = dungeonState[level];
    const ladderIndex = levelMap.findIndex(
      (tile) => (tile as IStairsMapTile).direction === "down",
    );
    if (ladderIndex < 0) {
      console.error(levelMap, ladderIndex);
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
    const updatedState = [...state];
    updatedState.splice(level, 1, levelMap);
    return updatedState;
  },
});

export const startEncounter = createEvent();
startEncounter.watch(() => console.info("startEncounter"));

// trigger startEncounter event
sample({
  clock: characterPositionChanged,
  source: $currentMapTile,
  target: startEncounter,
  filter: (mapTile) => {
    if (isTileStairs(mapTile)) {
      return false;
    }
    const encounter = mapTile.encounter;
    if (!encounter) {
      return false;
    }
    if (encounter.type === EEncounterType.Monster) {
      // check for alive monsters
      const aliveMonsters = !areAllMonstersDead(encounter.monsters);
      const unopenedChest = !!encounter.chest && !encounter.chest.isOpened;
      return aliveMonsters || unopenedChest;
    }
    if (encounter.type === EEncounterType.Chest) {
      return !encounter.chest.isOpened;
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
export const $encounter = $currentMapTile.map(
  (tile) => (tile as ICommonMapTile).encounter ?? null,
);
$encounter.watch((encounter) => console.log("encounter udpated:", encounter));

// if there is a chest
export const $chest = $encounter.map((encounter) =>
  encounter !== null && encounter.chest ? encounter.chest : null,
);
$chest.watch((chest) => console.log("chest updated", chest));

// see src/battle/model for further details about battle calculation
export const startMonsterBattle = createEvent();
startMonsterBattle.watch(() => console.info("startMonsterBattle"));

sample({
  clock: startMonsterBattle,
  target: forward,
  fn: () => "battle",
});

// trigger startMonsterBattle
sample({
  clock: startEncounter,
  target: startMonsterBattle,
  source: $encounter,
  filter: (encounter) =>
    !!encounter &&
    encounter.type === EEncounterType.Monster &&
    !areAllMonstersDead(encounter.monsters),
});

export const $isOnStairsUp = $currentMapTile.map(
  (tile) => isTileStairs(tile) && tile.direction == "up",
);
export const $isOnStairsDown = $currentMapTile.map(
  (tile) => isTileStairs(tile) && tile.direction == "down",
);

// roll for aggro when entering battle
sample({
  clock: startMonsterBattle,
  source: {
    mapTile: $currentMapTile,
    character: $characterState,
    state: $dungeonState,
    level: $currentLevel,
  },
  target: $dungeonState,
  fn: ({ character, level, mapTile, state }) => {
    if (!isMonsterEncounterTile(mapTile)) {
      return state;
    }
    const levelMap = [...state[level]];
    const tileIndex = getTileIndexByCoordinates(
      { x: mapTile.x, y: mapTile.y },
      levelMap,
    );
    const monsters = mapTile.encounter.monsters;
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
      ...mapTile.encounter,
      monsters: updatedMonsters,
    };
    levelMap[tileIndex] = mapTile;
    const updatedState = [...state];
    updatedState.splice(level, 1, levelMap);
    return updatedState;
  },
});

sample({
  clock: characterPositionChanged,
  source: {
    state: $dungeonState,
    level: $currentLevel,
  },
  target: $dungeonState,
  fn({ level, state }, pos) {
    // udpate respawn timeouts on the whole dungeon map
    const updatedState = updateDungeonRespawnCounters(state, level, pos);
    // get current level
    let levelMap = updatedState[level];
    // check if respawn timer reached limit
    // on any of the tiles of the current level
    // and regenerate tiles where it does
    levelMap = respawnTiles(level, levelMap);
    updatedState.splice(level, 1, levelMap);
    return updatedState;
  },
});

export const chestIsOpened = createEvent();

// input parameters for opening the chest
type TOpenChestEffectProps = {
  mapTile: TMapTile;
  character: IBaseCharacterInfo;
};

// effect must check if chest is trapped and if yes - roll for disarm
// if disarm was successfull effect must resolve, otherwise fail
const openingChestFx = createEffect<TOpenChestEffectProps, void, void>(
  ({ character, mapTile }: TOpenChestEffectProps) =>
    new Promise((resolve, reject) => {
      if (!doesTileHasChest(mapTile)) {
        reject();
        throw Error("Tile does not have any chests!");
      }
      const updatedTile = {
        ...mapTile,
      };
      const chest = updatedTile.encounter.chest;
      if (!chest) {
        reject();
        throw Error("Tile does not have any chests!");
      }
      // TODO: roll for successfull disarming of the trap (traps are not implemented yet)
      console.log(
        "character successfully disarmed trap and opened the chest!",
        character.name,
      );
      resolve();
      return;
    }),
);

sample({
  clock: chestIsOpened,
  target: openingChestFx,
  source: {
    mapTile: $currentMapTile,
    character: $characterBaseInfo,
  },
  filter({ mapTile }) {
    if (!doesTileHasChest(mapTile)) {
      return false;
    }
    const chest = mapTile.encounter.chest;
    if (!chest) {
      return false;
    }
    return true;
  },
});

// refresh dungeon map - toggle chest opened state
sample({
  clock: openingChestFx.done,
  target: $dungeonState,
  source: {
    mapTile: $currentMapTile,
    state: $dungeonState,
    level: $currentLevel,
  },
  fn({ level, mapTile, state }) {
    if (!doesTileHasChest(mapTile)) {
      throw new Error("Wrong tile does not have any chests!");
    }
    const levelMap = [...state[level]];
    const tileIndex = getTileIndexByCoordinates(
      { x: mapTile.x, y: mapTile.y },
      levelMap,
    );
    const updatedTile = {
      ...mapTile,
    };
    const chest = updatedTile.encounter.chest;
    if (!chest) {
      throw new Error("Wrong tile does not have any chests!");
    }
    const updatedChest: IChest = {
      ...chest,
      isOpened: true,
    };
    updatedTile.encounter = {
      ...mapTile.encounter,
      chest: updatedChest,
    };
    levelMap[tileIndex] = updatedTile;
    const updatedState: TDungeonState = [...state];
    updatedState.splice(level, 1, levelMap);
    return updatedState;
  },
});

// TODO: implement trap damaging character on effect fail
sample({
  clock: openingChestFx.fail,
  target: $character,
  source: {
    mapTile: $currentMapTile,
    character: $character,
  },
  fn(src) {
    return src.character;
  },
});

export const chestContentsPickedUp = createEvent();

// update chest - remove items and money
sample({
  clock: chestContentsPickedUp,
  target: $dungeonState,
  source: {
    mapTile: $currentMapTile,
    state: $dungeonState,
    level: $currentLevel,
  },
  fn({ level, mapTile, state }) {
    if (!doesTileHasChest(mapTile)) {
      throw new Error("Wrong tile does not have any chests!");
    }
    const levelMap = [...state[level]];
    const tileIndex = getTileIndexByCoordinates(
      { x: mapTile.x, y: mapTile.y },
      levelMap,
    );
    const updatedTile = {
      ...mapTile,
    };
    const chest = updatedTile.encounter.chest;
    if (!chest) {
      throw new Error("Wrong tile does not have any chests!");
    }
    const updatedChest: IChest = {
      ...chest,
      items: [],
      money: 0,
    };
    updatedTile.encounter = {
      ...mapTile.encounter,
      chest: updatedChest,
    };
    levelMap[tileIndex] = updatedTile;
    const updatedState: TDungeonState = [...state];
    updatedState.splice(level, 1, levelMap);
    return updatedState;
  },
});
