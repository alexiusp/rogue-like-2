import { IBaseEffect } from "./types";

export const GlobalEffectCatalogue: Record<string, IBaseEffect> = {
  heal: {
    name: "heal",
    picture: "heal-minor.png",
    key: "heal",
    nature: "life",
  },
  poison: {
    name: "poison",
    picture: "",
    key: "hurt",
    nature: "earth",
  },
  shield: {
    name: "shield",
    picture: "shield.png",
    key: "defense",
    nature: "air",
  },
  "stone skin": {
    name: "stone skin",
    picture: "",
    key: "protection",
    nature: "stone",
  },
  "see invisible": {
    name: "see invisible",
    picture: "",
    key: "attack",
    nature: "mind",
  },
};
