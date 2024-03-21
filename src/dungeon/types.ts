import { TRandomBag } from "../common/random";
import { TGameItem } from "../items/models";
import { IGameMonster } from "../monsters/model";

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
  Monster, // one or several monsters, optionally a chest
  Lair, // one boss, optionally pack of lesser monsters, optionally a chest
  Event, // some random event/npc met in dungeon with possible actions and rewards/losses
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
  terrains: TRandomBag<ETerrain>;
  // max number of non-floor and non-stairs terrain
  maxTerrain: number;
  // random bag to generate effects from
  effects: TRandomBag<ETerrainEffect>;
  // max number of terrains with effect
  maxEffects: number;
  // random bag to generate encounters from
  encounters: TRandomBag<EEncounterType>;
  // max numbers of encounters to generate
  maxEncounters: number;
}

/*
 * event encounter - an event when user must make a choice, roll a dice for attribute
 * and get some reward if succeed or loose some money/xp/health etc. if failed
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

export interface IMonsterEncounter extends IBaseEncounter {
  type: EEncounterType.Monster;
  // monster
  monsters: Array<IGameMonster>;
  chest?: IChest;
}

export interface ILairEncounter extends IBaseEncounter {
  type: EEncounterType.Lair;
  boss: IGameMonster;
  monsters: Array<IGameMonster>;
  chest?: IChest;
}

export interface IChestEncounter extends IBaseEncounter {
  type: EEncounterType.Chest;
  chest: IChest;
}

export type TGameTileEncounter =
  | IMonsterEncounter
  | ILairEncounter
  | IChestEncounter;

interface IBaseMapTile {
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

export interface IEmptyMapTile extends IBaseMapTile {
  encounter: undefined;
}

export interface IMonsterMapTile extends IBaseMapTile {
  encounter: IMonsterEncounter;
}

export interface ILairMapTile extends IBaseMapTile {
  encounter: ILairEncounter;
}

export interface IChestMapTile extends IBaseMapTile {
  encounter: IChestEncounter;
}

// map tile data generated for use in runtime
export type TMapTile =
  | IEmptyMapTile
  | IMonsterMapTile
  | ILairMapTile
  | IChestMapTile;
