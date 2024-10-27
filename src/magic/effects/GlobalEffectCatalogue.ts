import { createCatalogue } from "../../common/utils";
import { IBaseEffect } from "./types";

const HealEffect: IBaseEffect = {
  name: "heal",
  picture: "heal.svg",
  key: "heal",
  nature: "life",
};

const PoisonEffect: IBaseEffect = {
  name: "poison",
  picture: "poison.svg",
  key: "hurt",
  nature: "earth",
};

const ShieldEffect: IBaseEffect = {
  name: "shield",
  picture: "shield.svg",
  key: "defense",
  nature: "air",
};

const StoneSkinEffect: IBaseEffect = {
  name: "stone skin",
  picture: "stone-skin.svg",
  key: "protection",
  nature: "stone",
};

const SeeInvisible: IBaseEffect = {
  name: "see invisible",
  picture: "see-invisible.svg",
  key: "attack",
  nature: "mind",
};

const BurningEffect: IBaseEffect = {
  name: "burning",
  picture: "burning.svg",
  key: "hurt",
  nature: "fire",
};

const ShockEffect: IBaseEffect = {
  name: "shock",
  picture: "electric.svg",
  key: "hurt",
  nature: "electric",
};

const DiseaseEffect: IBaseEffect = {
  name: "disease",
  picture: "disease.svg",
  key: "hurt",
  nature: "air",
};

const ResistPoisonEffect: IBaseEffect = {
  name: "resist-earth",
  picture: "poison.svg",
  key: "resistance",
  nature: "earth",
};

const GlobalEffectCatalogue: Record<string, IBaseEffect> = createCatalogue([
  HealEffect,
  PoisonEffect,
  ShieldEffect,
  StoneSkinEffect,
  SeeInvisible,
  BurningEffect,
  ShockEffect,
  DiseaseEffect,
  ResistPoisonEffect,
]);
export default GlobalEffectCatalogue;
