import GlobalBaseSpellsCatalogue from "./GlobalSpellsCatalogue";
import { IGameEffect } from "./effects/types";
import { ESpellClass } from "./types";

function createHealEffect(power: number, timeout: number = 1): IGameEffect {
  // effect for healing spell - instant i.e. timeout = 1
  return {
    name: "heal",
    power,
    timeout,
  };
}

function createBurningEffect(power: number, timeout: number = 1): IGameEffect {
  return {
    name: "burning",
    power,
    timeout,
  };
}

export function createEffectForASpell(
  spellName: string,
  castingLevel: number,
): IGameEffect | undefined {
  const baseSpell = GlobalBaseSpellsCatalogue[spellName];
  const spellPower = baseSpell.power + baseSpell.powerGain * castingLevel;
  switch (spellName) {
    case "minor heal":
      return createHealEffect(spellPower);
    case "firebolt":
      return createBurningEffect(spellPower);
  }
  return;
}

export function isSpellNonCombat(spellName: string) {
  const baseSpell = GlobalBaseSpellsCatalogue[spellName];
  return baseSpell.spellClass !== ESpellClass.Combat;
}

export function isSpellCombat(spellName: string) {
  const baseSpell = GlobalBaseSpellsCatalogue[spellName];
  return baseSpell.spellClass !== ESpellClass.NonCombat;
}

export function isTargetedSpell(spellName: string) {
  const baseSpell = GlobalBaseSpellsCatalogue[spellName];
  return typeof baseSpell.target === "number";
}

export function isTargetedOnSelfSpell(spellName: string) {
  const baseSpell = GlobalBaseSpellsCatalogue[spellName];
  return baseSpell.target === "self";
}
