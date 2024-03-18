import { RandomBag, getRandomInt, rollDiceCheck } from "../common/random";
import { generateNewMonsterByName } from "../monsters/model";
import DungeonSpec from "./dungeonSpecs";
import getMonstersForLevel from "./encounterSpecs";
import {
  EEncounterType,
  ETerrain,
  ETerrainEffect,
  IMapCoordinates,
  IMonsterEncounter,
  TGameTileEncounter,
  TMapTile,
} from "./types";

function generateEncounter(
  type: EEncounterType,
  level: number,
): TGameTileEncounter | undefined {
  switch (type) {
    case EEncounterType.Chest: {
      // TODO
      return;
    }
    case EEncounterType.Event: {
      // TODO
      return;
    }
    case EEncounterType.Monster: {
      const possibleMonsters = getMonstersForLevel(level);
      const monsterBag = new RandomBag(possibleMonsters);
      // TODO: generate more than one monster
      const randomMonsterName = monsterBag.getRandomItem();
      const monster = generateNewMonsterByName(randomMonsterName, level);
      // TODO: generate chest
      const encounter: IMonsterEncounter = {
        type: EEncounterType.Monster,
        monsters: [monster],
      };
      return encounter;
    }
    case EEncounterType.Lair: {
      // TODO
      return;
    }
  }
}

export function generateDungeonLevel(level: number): Array<TMapTile> {
  const levelSpec = DungeonSpec[level];
  const tiles: Array<TMapTile> = [];
  let terrainsAmount = 0;
  const terrainBag = new RandomBag<ETerrain | null>(levelSpec.terrains);
  let effectsAmount = 0;
  const effectsBag = new RandomBag<ETerrainEffect | null>(levelSpec.effects);
  let encounterAmount = 0;
  const encountersBag = new RandomBag<EEncounterType | null>(
    levelSpec.encounters,
  );
  for (let y = 0; y < levelSpec.height; y++) {
    for (let x = 0; x < levelSpec.width; x++) {
      // check if stairs needs to be placed here
      if (levelSpec.stairsDown) {
        if (x === levelSpec.stairsDown.x && y === levelSpec.stairsDown.y) {
          tiles.push({
            x,
            y,
            open: false,
            terrain: ETerrain.StairsDown,
            effects: [],
            encounter: undefined,
          });
          continue;
        }
      }
      if (levelSpec.stairsUp) {
        if (x === levelSpec.stairsUp.x && y === levelSpec.stairsUp.y) {
          tiles.push({
            x,
            y,
            open: true,
            terrain: ETerrain.StairsUp,
            effects: [],
            encounter: undefined,
          });
          continue;
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
          // TODO: implement a possibility to generate several effects
          effects.push(newEffect);
          effectsAmount += 1;
        }
      }
      let encounter: TGameTileEncounter | undefined;
      // check if an encounter can be generated
      if (encounterAmount < levelSpec.maxEncounters) {
        const newEncounterType = encountersBag.getRandomItem();
        if (newEncounterType !== null) {
          encounter = generateEncounter(newEncounterType, level);
          encounterAmount += 1;
        }
      }
      tiles.push({
        x,
        y,
        open: false,
        terrain,
        effects,
        encounter,
      });
    }
  }
  console.log(`generated ${level} level of the dungeon:`, tiles);
  return tiles;
}

export function isAdjacent(pos1: IMapCoordinates, pos2: IMapCoordinates) {
  if (pos1.x === pos2.x) {
    return pos1.y === pos2.y - 1 || pos1.y === pos2.y + 1;
  }
  if (pos1.y === pos2.y) {
    return pos1.x === pos2.x - 1 || pos1.x === pos2.x + 1;
  }
  return false;
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

export function rollAttack(attackValue: number, defenseValue: number) {
  const rollValue = 50 - attackValue + defenseValue;
  return rollDiceCheck(rollValue, "1D100");
}

export function rollDamage(damageValue: number, protectionValue: number) {
  // TODO: we can change min damage to 0 when we have a special UI to demonstarte it
  return Math.max(1, Math.abs(getRandomInt(damageValue, 1) - protectionValue));
}
