/**
 * effects are possible augmentation of character, monster or item properties or statuses
 * basic effects:
 * poison: does power hp of earth damage until timeout
 * paralysis: target can not move(attack), defense reduced to 0 until timeout
 * shield: target receives power-bonus to defense until timeout
 * burning: does power hp of fire damage until timeout
 * heal: restores power hp until timeout
 */

import { TNatureElement } from "../../common/types";

export type TEffectKey =
  | "heal" // increase characters health
  | "hurt" // decrease characters health
  | "defense" // increase characters defense
  | "protection" // increase characters protection
  | "attack" // increase characters attack
  | "damage" // increase characters damage
  | "resistance"; // increase resistance

// base definition of the effect
export interface IBaseEffect {
  // name of the effect to display on UI
  name: string;
  // path to a picture/icon of the effect
  picture: string;
  // keyword to select this effect from the list
  // when applying bonus/damage
  key: TEffectKey;
  // nature of the effect
  nature: TNatureElement;
}

// in-game instance of the effect
export interface IGameEffect {
  // name of the effect
  name: string;
  // power of the effect
  power: number;
  // timeout of the effect, when = 0 will be removed
  // if undefined - will not expire: enchantments from items or curse
  // for instant spells timeout = 1
  timeout?: number;
}
