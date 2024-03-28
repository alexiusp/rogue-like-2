import { ESpellClass, IBaseSpell } from "./types";

const MinorHealSpell: IBaseSpell = {
  name: "minor heal",
  description:
    "This general heal spell is useful for removing small wounds only, so it will not help any other type of  injury...",
  picture: "",
  class: ESpellClass.NonCombat,
  nature: "life",
  statsRequired: {
    strength: 0,
    intelligence: 13,
    wisdom: 13,
    endurance: 0,
    charisma: 0,
    dexterity: 0,
  },
  power: 15,
  powerGain: 5,
  effect: "heal",
  target: "self",
};

const GlobalBaseSpellsCatalogue: Record<string, IBaseSpell> = {
  "minor heal": MinorHealSpell,
};
export default GlobalBaseSpellsCatalogue;
