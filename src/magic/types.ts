import { TStatsValues } from "../common/stats";
import { TNatureElement } from "../common/types";

export enum ESpellClass {
  Combat, // usable only in combat
  NonCombat, // usable only outside of the combat
  Both, // usable both in combat and outside
}

// base information about a spell common for all instances
export interface IBaseSpell {
  // unique name of the spell
  name: string;
  // description to show for player
  description: string;
  // path to image
  picture: string;
  // combat/non-combat
  spellClass: ESpellClass;
  // nature of the spell
  nature: TNatureElement;
  // required stats
  statsRequired: TStatsValues;
  // initial power of the spell
  power: number;
  // power increase with each level
  // after those when it was given by the guild
  powerGain: number;
  // ratio of mana costs decrease
  // the bigger the number the more
  // expensive it will to cast the spell
  spRatio: number;
  // effect applied
  effect: string;
  // possible target of the spell
  // in case of number - amount of adjacent targets
  target?: "self" | "all" | number;
}

// properties of a particular instance of the spell
export interface IGameSpell {
  // reference to the base spell
  name: string;
  // level at which the spell is being cast
  // if undefined - at casters spell level
  level?: number;
}
