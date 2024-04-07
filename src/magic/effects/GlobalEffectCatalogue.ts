import { IBaseEffect } from "./types";

export const GlobalEffectCatalogue: Record<string, IBaseEffect> = {
  heal: {
    name: "heal",
    picture: "heal.svg",
    key: "heal",
    nature: "life",
  },
  poison: {
    name: "poison",
    picture: "poison.svg",
    key: "hurt",
    nature: "earth",
  },
  shield: {
    name: "shield",
    picture: "shield.svg",
    key: "defense",
    nature: "air",
  },
  "stone skin": {
    name: "stone skin",
    picture: "stone-skin.svg",
    key: "protection",
    nature: "stone",
  },
  "see invisible": {
    name: "see invisible",
    picture: "see-invisible.svg",
    key: "attack",
    nature: "mind",
  },
  burning: {
    name: "burning",
    picture: "burning.svg",
    key: "hurt",
    nature: "fire",
  },
};
