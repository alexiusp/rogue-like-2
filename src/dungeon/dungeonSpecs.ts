import { getNullBag } from "../common/random";
import {
  EEncounterType,
  ETerrain,
  ETerrainEffect,
  IDungeonLevelSpec,
} from "./types";

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

const DungeonSpec: Array<IDungeonLevelSpec> = [FirstLevel, FirstLevel];
export default DungeonSpec;
