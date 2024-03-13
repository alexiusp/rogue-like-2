import { getNullBag } from "../common/random";
import { EEncounterType, IDungeonLevelSpec } from "./model";

const FirstLevel: IDungeonLevelSpec = {
  level: 1,
  width: 10,
  height: 6,
  stairsUp: { x: 8, y: 5 },
  stairsDown: { x: 1, y: 3 },
  terrains: [],
  maxTerrain: 0,
  effects: [],
  maxEffects: 0,
  encounters: [...getNullBag(9), EEncounterType.Monster],
  maxEncounters: 20,
};

const DungeonSpec: Array<IDungeonLevelSpec> = [FirstLevel, FirstLevel];
export default DungeonSpec;
