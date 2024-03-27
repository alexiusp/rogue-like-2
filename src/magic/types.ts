import { TStatsValues } from "../common/stats";
import { TNatureElement } from "../common/types";

export enum ESpellType {
  Instant, // spells effect applied instantly after casting
  Continuous, // spells effect applied over time
}

export enum ESpellClass {
  Combat,
  NonCombat,
  //  Universal,
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
  // instant/continuous
  type: ESpellType;
  // combat/non-combat
  class: ESpellClass;
  // nature of the spell
  nature: TNatureElement;
  // required stats
  statsRequired: TStatsValues;
  // initial power of the spell
  power: number;
  // power increase with each level
  // after those when it was given by the guild
  powerGain: number;
}

export interface IBaseCombatSpell extends IBaseSpell {
  class: ESpellClass.Combat;
  target: "self" | "all" | number;
}

export interface IBaseCombatInstant extends IBaseCombatSpell {
  type: ESpellType.Instant;
}

export interface IBaseCombatEnchantment extends IBaseCombatSpell {
  type: ESpellType.Continuous;
  effect: string;
}

export interface IBaseNonCombatSpell extends IBaseSpell {
  class: ESpellClass.NonCombat;
}

export interface IBaseNonCombatInstant extends IBaseNonCombatSpell {
  type: ESpellType.Instant;
}

export interface IBaseNonCombatEnchantment extends IBaseNonCombatSpell {
  type: ESpellType.Continuous;
  effect: string;
}

export type TBaseSpell =
  | IBaseCombatInstant
  | IBaseCombatEnchantment
  | IBaseNonCombatInstant
  | IBaseNonCombatEnchantment;
