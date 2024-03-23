import { getNullBag } from "../common/random";
import {
  EEncounterType,
  ETerrain,
  ETerrainEffect,
  IDungeonLevelSpec,
} from "./types";

// for testing purposes pretty low. should be more than 50, may be even 100-200
export const MAX_RESPAWN_TIMEOUT = 100;

const FirstLevel: IDungeonLevelSpec = {
  level: 1,
  width: 10,
  height: 6,
  stairsUp: { x: 8, y: 5 },
  stairsDown: { x: 1, y: 3 },
  terrains: [...getNullBag(18), ETerrain.Water, ETerrain.Water],
  maxTerrain: 6,
  effects: [...getNullBag(18), ETerrainEffect.Fog, ETerrainEffect.Fog],
  maxEffects: 6,
  encounters: [
    ...getNullBag(9),
    EEncounterType.Monster,
    EEncounterType.Monster,
    EEncounterType.Monster,
  ],
  maxEncounters: 20,
};

const SecondLevel: IDungeonLevelSpec = {
  level: 2,
  width: 12,
  height: 12,
  stairsUp: { x: 1, y: 3 },
  stairsDown: { x: 11, y: 3 },
  terrains: [...getNullBag(18), ETerrain.Pit, ETerrain.Pit],
  maxTerrain: 6,
  effects: [
    ...getNullBag(17),
    ETerrainEffect.Fog,
    ETerrainEffect.Fog,
    ETerrainEffect.Darkness,
  ],
  maxEffects: 8,
  encounters: [
    ...getNullBag(8),
    EEncounterType.Monster,
    EEncounterType.Monster,
    EEncounterType.Monster,
    EEncounterType.Monster,
  ],
  maxEncounters: 40,
};

const DungeonSpec: Array<IDungeonLevelSpec> = [
  FirstLevel,
  FirstLevel,
  SecondLevel,
];
export default DungeonSpec;
