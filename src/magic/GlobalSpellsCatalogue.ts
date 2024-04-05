import { ESpellClass, IBaseSpell } from "./types";

const MinorHealSpell: IBaseSpell = {
  name: "minor heal",
  description:
    "This general heal spell is useful for removing small wounds only, so it will not help any other type of  injury...",
  picture: "heal-minor.png",
  spellClass: ESpellClass.Both,
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
  spRatio: 3,
  effect: "heal",
  target: "self",
};

const Shield: IBaseSpell = {
  name: "shield",
  description: "Character receives a bonus to character's defense",
  picture: "shield.png",
  spellClass: ESpellClass.NonCombat,
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
  spRatio: 4,
  effect: "shield",
  target: "self",
};

const SeeInvisible: IBaseSpell = {
  name: "see invisible",
  description: "Allows character to see invisible",
  picture: "see-invisible.png",
  spellClass: ESpellClass.NonCombat,
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
  spRatio: 6,
  effect: "see invisible",
  target: "self",
};

const Firebolt: IBaseSpell = {
  name: "firebolt",
  description:
    "This simplest of Fire Spells creates a small flame arrow and hurls it into a monster, burning anything that gets in its way.",
  picture: "firebolt.png",
  spellClass: ESpellClass.Combat,
  nature: "fire",
  statsRequired: {
    strength: 0,
    intelligence: 12,
    wisdom: 9,
    endurance: 0,
    charisma: 0,
    dexterity: 0,
  },
  power: 5,
  powerGain: 2,
  spRatio: 1,
  effect: "burning",
  target: 1,
};

const GlobalBaseSpellsCatalogue: Record<string, IBaseSpell> = {
  [MinorHealSpell.name]: MinorHealSpell,
  [Shield.name]: Shield,
  [SeeInvisible.name]: SeeInvisible,
  [Firebolt.name]: Firebolt,
};
export default GlobalBaseSpellsCatalogue;
