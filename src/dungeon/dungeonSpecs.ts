import { getNullBag } from "../common/random";
import { EEncounterType, ETerrainEffect, IDungeonLevelSpec } from "./types";

const FirstLevel: IDungeonLevelSpec = {
  level: 1,
  width: 10,
  height: 6,
  stairsUp: { x: 8, y: 5 },
  stairsDown: { x: 1, y: 3 },
  terrains: [],
  maxTerrain: 0,
  effects: [...getNullBag(18), ETerrainEffect.Fog, ETerrainEffect.Water],
  maxEffects: 0,
  encounters: [
    ...getNullBag(9),
    EEncounterType.Monster,
    EEncounterType.Monster,
    EEncounterType.Monster,
  ],
  maxEncounters: 20,
};

const DungeonSpec: Array<IDungeonLevelSpec> = [FirstLevel, FirstLevel];
export default DungeonSpec;
