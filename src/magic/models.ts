import GlobalBaseSpellsCatalogue from "./GlobalSpellsCatalogue";
import { IGameEffect } from "./effects/types";
import { ESpellClass } from "./types";

function createHealEffect(power: number): IGameEffect {
  // effect for healing spell - instant i.e. timeout = 1
  return {
    name: "heal",
    power,
    timeout: 1,
  };
}

export function createEffectForASpell(
  spellName: string,
  castingLevel: number,
): IGameEffect | undefined {
  const baseSpell = GlobalBaseSpellsCatalogue[spellName];
  const spellPower = baseSpell.power + baseSpell.powerGain * castingLevel;
  switch (baseSpell.effect) {
    case "heal":
      return createHealEffect(spellPower);
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
