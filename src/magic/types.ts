import { TStatsValues } from "../common/stats";
import { TNatureElement } from "../common/types";

export enum ESpellClass {
  Combat, //usable only in combat
  NonCombat, // usable both in combat and outside
}

/**
 * damage of the spell is determined by power of the spell
 * timeout: for enchantments effect - time for spell to wear off - also determined by power
 * base level of the spell (amount of mana required to cast)
 * is defined by the guild level when this spell becomes available
 */
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
  // target of the spell
  target?: "self" | "all" | number;
}

export interface IGameSpell {
  // reference to the base spell
  name: string;
  // level at which the spell is being cast
  // if undefined - at casters spell level
  level?: number;
}
