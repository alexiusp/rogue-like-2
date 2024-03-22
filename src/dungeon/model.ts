import { RandomBag } from "../common/random";
import { generateNewMonsterByName } from "../monsters/model";
import DungeonSpec from "./dungeonSpecs";
import {
  getAmountOfMonsters,
  getMonstersForLevelAndTerrain,
} from "./encounterSpecs";
import {
  EEncounterType,
  ETerrain,
  ETerrainEffect,
  IMapCoordinates,
  IMonsterEncounter,
  IMonsterMapTile,
  IStairsMapTile,
  TGameTileEncounter,
  TMapTile,
} from "./types";

function generateEncounter(
  type: EEncounterType,
  level: number,
  terrain: ETerrain,
  effects: ETerrainEffect[],
): TGameTileEncounter | undefined {
  switch (type) {
    case EEncounterType.Chest: {
      return;
    }
    case EEncounterType.Event: {
      return;
    }
    case EEncounterType.Monster: {
      const possibleMonsters = getMonstersForLevelAndTerrain(
        level,
        terrain,
        effects,
      );
      if (!possibleMonsters || possibleMonsters.length === 0) {
        return;
      }
      const monsterBag = new RandomBag(possibleMonsters);
      const randomMonsterName = monsterBag.getRandomItem();
      const amount = getAmountOfMonsters(randomMonsterName);
      if (amount === null) {
        return;
      }
      const monsters = new Array(amount)
        .fill(null)
        .map(() => generateNewMonsterByName(randomMonsterName, level));
      const encounter: IMonsterEncounter = {
        type: EEncounterType.Monster,
        monsters,
      };
      return encounter;
    }
    case EEncounterType.Lair: {
      return;
    }
  }
}

export function createTileGenerator(
  level: number,
  terrains = 0,
  effects = 0,
  encounter = 0,
) {
  const levelSpec = DungeonSpec[level];
  let terrainsAmount = terrains;
  const terrainBag = new RandomBag<ETerrain | null>(levelSpec.terrains);
  let effectsAmount = effects;
  const effectsBag = new RandomBag<ETerrainEffect | null>(levelSpec.effects);
  let encounterAmount = encounter;
  const encountersBag = new RandomBag<EEncounterType | null>(
    levelSpec.encounters,
  );
  return function generateDungeonTile(x: number, y: number): TMapTile {
    // check if stairs needs to be placed here
    if (levelSpec.stairsDown) {
      if (x === levelSpec.stairsDown.x && y === levelSpec.stairsDown.y) {
        const stairsDownTile: IStairsMapTile = {
          x,
          y,
          open: false,
          terrain: ETerrain.Floor,
          direction: "down",
        };
        return stairsDownTile;
      }
    }
    if (levelSpec.stairsUp) {
      if (x === levelSpec.stairsUp.x && y === levelSpec.stairsUp.y) {
        const stairsUpTile: IStairsMapTile = {
          x,
          y,
          open: true,
          terrain: ETerrain.Floor,
          direction: "up",
        };
        return stairsUpTile;
      }
    }
    let terrain = ETerrain.Floor;
    // check if special type of terraing can be generated
    if (terrainsAmount < levelSpec.maxTerrain) {
      const newType = terrainBag.getRandomItem();
      if (newType !== null) {
        terrain = newType;
        terrainsAmount += 1;
      }
    }
    const effects: Array<ETerrainEffect> = [];
    // check if terrain effect can be generated
    if (effectsAmount < levelSpec.maxEffects) {
      const newEffect = effectsBag.getRandomItem();
      if (newEffect !== null) {
        effects.push(newEffect);
        effectsAmount += 1;
      }
    }
    let encounter: TGameTileEncounter | undefined;
    // check if an encounter can be generated
    if (encounterAmount < levelSpec.maxEncounters) {
      const newEncounterType = encountersBag.getRandomItem();
      if (newEncounterType !== null) {
        encounter = generateEncounter(
          newEncounterType,
          level,
          terrain,
          effects,
        );
        if (encounter) {
          // if no encounter is possible for this terrain/effects combination
          // don't count it
          encounterAmount += 1;
        }
      }
    }
    return {
      x,
      y,
      open: false,
      terrain,
      effects,
      encounter,
      respawnTimer: 0,
    };
  };
}

export function generateDungeonLevel(level: number): Array<TMapTile> {
  const generator = createTileGenerator(level);
  const levelSpec = DungeonSpec[level];
  const tiles: Array<TMapTile> = [];
  for (let y = 0; y < levelSpec.height; y++) {
    for (let x = 0; x < levelSpec.width; x++) {
      tiles.push(generator(x, y));
    }
  }
  console.log(`generated ${level} level of the dungeon:`, tiles);
  return tiles;
}

export function areAdjacentCoordinates(
  pos1: IMapCoordinates,
  pos2: IMapCoordinates,
) {
  if (pos1.x === pos2.x) {
    return pos1.y === pos2.y - 1 || pos1.y === pos2.y + 1;
  }
  if (pos1.y === pos2.y) {
    return pos1.x === pos2.x - 1 || pos1.x === pos2.x + 1;
  }
  return false;
}

export function areSameCoordinates(
  pos1: IMapCoordinates,
  pos2: IMapCoordinates,
) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

export function getTileIndexByCoordinates(
  coordinates: IMapCoordinates,
  levelMap: TMapTile[],
) {
  const tileIndex = levelMap.findIndex(
    (tile) => tile.x === coordinates.x && tile.y === coordinates.y,
  );
  if (tileIndex < 0) {
    throw new Error("Invalid coordinates! Map tile not found!");
  }
  return tileIndex;
}

export function getMapTileByCoordinates(
  coordinates: IMapCoordinates,
  levelMap: TMapTile[],
) {
  const tileIndex = getTileIndexByCoordinates(coordinates, levelMap);
  return levelMap[tileIndex];
}

export function isTileStairs(tile: TMapTile): tile is IStairsMapTile {
  return !!(tile as IStairsMapTile).direction;
}

export function isMonsterEncounterTile(
  tile: TMapTile,
): tile is IMonsterMapTile {
  if (isTileStairs(tile)) {
    return false;
  }
  return !!tile.encounter && tile.encounter.type === EEncounterType.Monster;
}

// for testing purposes pretty low. should be more than 50, may be even 100-200
export const MAX_RESPAWN_TIMEOUT = 20;

function countSpecialTerrains(levelMap: TMapTile[]) {
  return levelMap.reduce(
    (acc, tile) => (tile.terrain !== ETerrain.Floor ? acc + 1 : acc),
    0,
  );
}

function countEffects(levelMap: TMapTile[]) {
  return levelMap.reduce(
    (acc, tile) => (!isTileStairs(tile) ? acc + tile.effects.length : acc),
    0,
  );
}

function countEncounters(levelMap: TMapTile[]) {
  return levelMap.reduce(
    (acc, tile) => (!isTileStairs(tile) && tile.encounter ? acc + 1 : acc),
    0,
  );
}

export function respawnTiles(level: number, levelMap: TMapTile[]) {
  // count special terraings, effects and encounters
  // already present on the map
  const terrainsGenerated = countSpecialTerrains(levelMap);
  const effectsGenerated = countEffects(levelMap);
  const encounterGenerated = countEncounters(levelMap);
  // create tile genreator for given conditions
  const generator = createTileGenerator(
    level,
    terrainsGenerated,
    effectsGenerated,
    encounterGenerated,
  );
  const udpatedMap = levelMap.map((tile) => {
    // skip stairs and not affected tiles
    if (isTileStairs(tile) || tile.respawnTimer < MAX_RESPAWN_TIMEOUT) {
      return tile;
    }
    return generator(tile.x, tile.y);
  });
  return udpatedMap;
}
