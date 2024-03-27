import {
  ESpellClass,
  ESpellType,
  IBaseNonCombatInstant,
  TBaseSpell,
} from "./types";

const MinorHealSpell: IBaseNonCombatInstant = {
  name: "minor heal",
  description:
    "This general heal spell is useful for removing small wounds only, so it will not help any other type of  injury...",
  picture: "",
  type: ESpellType.Instant,
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
};

const GlobalSpellsCatalogue: Record<string, TBaseSpell> = {
  "minor heal": MinorHealSpell,
};
export default GlobalSpellsCatalogue;
