import { getRandomInt, rollDiceCheck } from "../common/random";

export function rollAttack(attackValue: number, defenseValue: number) {
  const rollValue = 50 - attackValue + defenseValue;
  return rollDiceCheck(rollValue, "1D100");
}

export function rollDamage(damageValue: number, protectionValue: number) {
  return Math.max(1, Math.abs(getRandomInt(damageValue, 1) - protectionValue));
}
