import { RandomBag } from "../common/random";
import { TGameItem } from "../items/models";
import { IGameMonster, generateNewMonsterByName } from "../monsters/model";
import DungeonSpec from "./dungeonSpecs";
import getMonstersForLevel from "./encounterSpecs";

export interface IMapCoordinates {
  x: number;
  y: number;
}

export enum ETerrain {
  Floor, // most common terrain type - nothing special
  StairsUp, // character can go to the previos level here
  StairsDown, // character can go to the next level here
  Pit, // character receives damage if not levitating
  Teleporter, // character is teleported randomly
  Chute, // character receives damage and falls to the next level
}

export enum ETerrainEffect {
  Fog, // reduces visibility and accuracy
  Darkness, // reduces visibility and accuracy
  Water, // character starts to drown after some time unless levitating or similar
  Quicksand, // character starts to loose health after some time unless levitating or similar
  Antimagic, // character can not cast magic
  Extinguish, // same as antimagic but also existing spells are removed
}

export enum EEncounterType {
  Monster, // single monster, optionally a chest
  Pack, // pack of monsters of the same type, optionally a chest
  Lair, // one boss, optionally pack of lesser monsters, optionally a chest
  Event, // TODO: to be implemented
  Chest, // chest
}

// specification what needs to be set to generate a dungeon
export interface IDungeonLevelSpec {
  // diificulty level
  level: number;
  // size/dimentions
  width: number;
  height: number;
  // does level has stairs?
  stairsUp?: IMapCoordinates;
  stairsDown?: IMapCoordinates;
  // random bag to generate terrain from
  terrains: Array<ETerrain | null>;
  // max number of non-floor and non-stairs terrain
  maxTerrain: number;
  // random bag to generate effects from
  effects: Array<ETerrainEffect | null>;
  // max number of terrains with effect
  maxEffects: number;
  // random bag to generate encounters from
  encounters: Array<EEncounterType | null>;
  // max numbers of encounters to generate
  maxEncounters: number;
}

/* TODO:
 * event encounter - an event when user must make a choice, roll a dice for attribute and get some reward if succeed
 */

interface ITrap {
  spell: string;
  level: number;
}

export interface IChest {
  isOpened: boolean;
  isLocked: boolean;
  trap?: ITrap;
  items: Array<TGameItem>;
  money: number;
}

interface IBaseEncounter {
  // type to differentiate subtypes
  type: EEncounterType;
}

interface IMonsterEncounter extends IBaseEncounter {
  type: EEncounterType.Monster;
  // monster
  monster: IGameMonster;
  chest?: IChest;
}

interface IMonsterPackEncounter extends IBaseEncounter {
  type: EEncounterType.Pack;
  // monster
  monsters: Array<IGameMonster>;
  chest?: IChest;
}

interface ILairEncounter extends IBaseEncounter {
  type: EEncounterType.Lair;
  boss: IGameMonster;
  monsters: Array<IGameMonster>;
  chest?: IChest;
}

interface IChestEncounter extends IBaseEncounter {
  type: EEncounterType.Chest;
  chest: IChest;
}

type TGameTileEncounter =
  | IMonsterEncounter
  | IMonsterPackEncounter
  | ILairEncounter
  | IChestEncounter;

// map tile data generated for use in runtime
export interface IMapTile {
  x: number;
  y: number;
  // is map tile already opened by character
  open: boolean;
  // terrain type to render
  terrain: ETerrain;
  // effects to render
  effects: Array<ETerrainEffect>;
  // encounter to trigger/render
  encounter?: TGameTileEncounter;
}

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
      const randomMonsterName = monsterBag.getRandomItem();
      const monster = generateNewMonsterByName(randomMonsterName, level);
      // TODO: generate chest
      const encounter: IMonsterEncounter = {
        type: EEncounterType.Monster,
        monster,
      };
      return encounter;
    }
    case EEncounterType.Lair: {
      // TODO
      return;
    }
    case EEncounterType.Pack: {
      // TODO
      return;
    }
  }
}

export function generateDungeonLevel(level: number): Array<IMapTile> {
  const levelSpec = DungeonSpec[level];
  const tiles: Array<IMapTile> = [];
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
  levelMap: IMapTile[],
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
  levelMap: IMapTile[],
) {
  const tileIndex = getTileIndexByCoordinates(coordinates, levelMap);
  return levelMap[tileIndex];
}
