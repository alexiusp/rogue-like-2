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

const Shield: IBaseSpell = {
  name: "shield",
  description: "Character receives a bonus to character's defense",
  picture: "",
  class: ESpellClass.NonCombat,
  nature: "air",
  statsRequired: {
    strength: 0,
    intelligence: 11,
    wisdom: 11,
    endurance: 0,
    charisma: 11,
    dexterity: 0,
  },
  power: 20,
  powerGain: 10,
  effect: "shield",
  target: "self",
};

const SeeInvisible: IBaseSpell = {
  name: "see invisible",
  description: "Allows character to see invisible",
  picture: "",
  class: ESpellClass.NonCombat,
  nature: "mind",
  statsRequired: {
    strength: 0,
    intelligence: 12,
    wisdom: 12,
    endurance: 0,
    charisma: 12,
    dexterity: 0,
  },
  power: 1,
  powerGain: 0,
  effect: "see invisible",
  target: "self",
};

const GlobalBaseSpellsCatalogue: Record<string, IBaseSpell> = {
  [MinorHealSpell.name]: MinorHealSpell,
  [Shield.name]: Shield,
  [SeeInvisible.name]: SeeInvisible,
};
export default GlobalBaseSpellsCatalogue;
