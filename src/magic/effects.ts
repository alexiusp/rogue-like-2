/**
 * effects are possible augmentation of character, monster or item properties or statuses
 * basic effects:
 * poison: does power hp of earth damage until timeout
 * paralysis: target can not move(attack), defense reduced to 0 until timeout
 * shield: target receives power-bonus to defense until timeout
 * burning: does power hp of fire damage until timeout
 * heal: restores power hp until timeout
 */

import { TNatureElement } from "../common/types";

// base definition of the effect
export interface IBaseEffect {
  // name of the effect to display on UI
  name: string;
  // path to a picture/icon of the effect
  picture: string;
  // keyword to select this effect from the list
  // when applying bonus/damage
  key: string;
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
  // if undefined - will not expire: enchantments on items or curse
  // for instant spells timeout = 1
  timeout?: number;
}

export const GlobalEffectCatalogue: Record<string, IBaseEffect> = {
  heal: {
    name: "heal",
    picture: "",
    key: "heal",
    nature: "life",
  },
  poison: {
    name: "poison",
    picture: "",
    key: "damage",
    nature: "earth",
  },
  shield: {
    name: "shield",
    picture: "",
    key: "defense",
    nature: "air",
  },
  "stone skin": {
    name: "stone skin",
    picture: "",
    key: "protection",
    nature: "stone",
  },
};
