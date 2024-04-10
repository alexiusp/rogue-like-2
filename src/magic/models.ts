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

function createShockEffect(power: number, timeout: number = 1): IGameEffect {
  return {
    name: "shock",
    power,
    timeout,
  };
}

function createSeeInvisibleEffect(
  power: number,
  timeout?: number,
): IGameEffect {
  return {
    name: "see invisible",
    power,
    timeout,
  };
}

export function createEffectForASpell(
  spellName: string,
  castingLevel: number,
  fromItem: boolean = false,
): IGameEffect | undefined {
  const baseSpell = GlobalBaseSpellsCatalogue[spellName];
  const spellPower = baseSpell.power + baseSpell.powerGain * castingLevel;
  switch (spellName) {
    case "minor heal":
      return createHealEffect(spellPower);
    case "firebolt":
      return createBurningEffect(spellPower);
    case "see invisible": {
      const timeout = fromItem ? undefined : 1;
      return createSeeInvisibleEffect(spellPower, timeout);
    }
    case "shock":
      return createShockEffect(spellPower);
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
