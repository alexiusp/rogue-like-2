import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { rollAggro } from "../character/models";
import { $character } from "../character/state";
import { loadCharacterData, saveCharacterData } from "../common/db";
import { createDelayEffect } from "../common/delay";
import { messageAdded } from "../messages/state";
import { EAggroMode, areAllMonstersDead } from "../monsters/model";
import { forward } from "../navigation";
import DungeonSpec from "./dungeonSpecs";
import {
  areSameCoordinates,
  generateDungeonLevel,
  getMapTileByCoordinates,
  getTileIndexByCoordinates,
  isMonsterEncounterTile,
  isTileStairs,
  respawnTiles,
} from "./model";
import {
  EEncounterType,
  ICommonMapTile,
  IMapCoordinates,
  IStairsMapTile,
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
  const dungeon: TDungeonState = {};
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

export const startDungeonLevel = createEvent<number>();
$currentLevel.on(startDungeonLevel, (_, level) => level);

sample({
  clock: startDungeonLevel,
  target: messageAdded,
  fn: (level) => `Entering dungeon level ${level}`,
});

// position character on the map when starting a level
sample({
  clock: startDungeonLevel,
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
export const $encounter = $currentMapTile.map(
  (tile) => (tile as ICommonMapTile).encounter ?? null,
);
$encounter.watch((encounter) => console.log("encounter udpated:", encounter));

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
    character: $character,
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
    return {
      ...state,
      [level]: levelMap,
    };
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
    let levelMap = [...state[level]];
    // increase all respawn timeouts
    for (let index = 0; index < levelMap.length; index++) {
      const tile = levelMap[index];
      if (!tile.open || isTileStairs(tile)) {
        continue;
      }
      let respawnTimer = tile.respawnTimer + 1;
      // reset timer when character visit the tile
      if (areSameCoordinates(pos, { x: tile.x, y: tile.y })) {
        respawnTimer = 0;
      }
      // and we need to regenerate (respawn) this tile
      const udpatedTile: ICommonMapTile = {
        ...tile,
        respawnTimer,
      };
      levelMap[index] = udpatedTile;
    }
    // check if respawn timer reached limit on any of the tiles
    // and regenerate tiles where it does
    levelMap = respawnTiles(level, levelMap);
    return {
      ...state,
      [level]: levelMap,
    };
  },
});
