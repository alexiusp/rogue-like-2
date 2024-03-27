import { TStatsValues } from "../common/stats";

export type TMagicNature =
  | "fire"
  | "cold"
  | "earth"
  | "water"
  | "air"
  | "stone"
  | "life"
  | "electric"
  | "mind"
  | "astral";
/**
 * Nature: magical nature of the spell (if any) - some creatures might be resistant
 *
 * common spells/effects according to nature:
 *
 * fire: burning hands, fire bolt
 * cold: cold blast, ice spray
 * earth: poison, sand burst, sand walking
 * water: acid, water walking
 * air: disease, levitate, ethereal portal
 * stone: petrification, stone skin
 * life: drain stats, drain life, healing, dispel undead
 * electric: shock, lightning bolt, chain lightning
 * mind: paralysis, charm, sight veil, see invisible
 * astral: teleport, banish demon, charm of opening
 */

export enum ESpellType {
  Instant, // spells effect applied instantly after casting
  Continuous, // spells effect applied over time
}

export enum ESpellClass {
  Combat,
  NonCombat,
  Both,
}

export interface IBaseSpell {
  // unique name of the spell
  name: string;
  // description to show for player
  description: string;
  // path to image
  picture: string;
  // instant/continuous
  type: ESpellType;
  // combat/non-combat
  class: ESpellClass;
  // required stats
  statsRequired: TStatsValues;
  // initial power of the spell
  power: number;
  // power increas with each level
  levelModifier: number;
}

/**
 * to define:
 * damage: damage of the spell
 * timeout: for enchantments - time for spell to wear off
 */
