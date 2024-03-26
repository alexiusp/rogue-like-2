export enum EStat {
  strength, //chance to hit, damage bonus
  endurance, //number of HP, chance of resurrect, resist special attacks and magic in combat, PV bonus
  dexterity, //chance to hit, disarm traps, resist stealing, flee from combat, surpirse attack chance, DV bonus
  wisdom, //chance to hit, max magic points, trap identify, item identify, flee from combat
  intelligence, //chance to hit, max magic points, identify item
  charisma, //chance to monster join or aggro, prices in shop
}

export type TStatNames = keyof typeof EStat;

export const StatList: Readonly<Array<TStatNames>> = [
  "strength",
  "intelligence",
  "wisdom",
  "endurance",
  "charisma",
  "dexterity",
];

export type TStatsValues = Record<TStatNames, number>;

export const ZeroStats: TStatsValues = {
  strength: 0,
  intelligence: 0,
  wisdom: 0,
  endurance: 0,
  charisma: 0,
  dexterity: 0,
};

export const NoStatsRequired: TStatsValues = {
  strength: 1,
  intelligence: 1,
  wisdom: 1,
  endurance: 1,
  charisma: 1,
  dexterity: 1,
};

export function getStatBonus(statValue: number) {
  if (statValue <= 1) {
    return -5;
  }
  if (statValue <= 4) {
    return -4;
  }
  if (statValue <= 6) {
    return -3;
  }
  if (statValue <= 8) {
    return -2;
  }
  if (statValue <= 10) {
    return -1;
  }
  if (statValue <= 12) {
    return 0;
  }
  if (statValue <= 15) {
    return 1;
  }
  if (statValue <= 18) {
    return 2;
  }
  if (statValue <= 22) {
    return 3;
  }
  return 4;
}

export function getStatsAttackModifier(stats: TStatsValues) {
  const { strength, dexterity, wisdom, intelligence } = stats;
  const strengthModifier = getStatBonus(strength);
  const dexterityModifier = getStatBonus(dexterity);
  const wisdomModifier = getStatBonus(wisdom);
  const intelligenceModifier = getStatBonus(intelligence);
  const value =
    strengthModifier +
    dexterityModifier * 0.5 +
    wisdomModifier * 0.25 +
    intelligenceModifier * 0.25;
  return 1 + value / 20;
}

export function getStatsDamageModifier(stats: TStatsValues) {
  const { strength } = stats;
  const strengthModifier = getStatBonus(strength);
  return 1 + strengthModifier / 10;
}

export function getStatsDefenseModifier(stats: TStatsValues) {
  const { dexterity } = stats;
  const dexterityModifier = getStatBonus(dexterity);
  return 1 + dexterityModifier / 10;
}

export function getStatsProtectionModifier(stats: TStatsValues) {
  const { endurance } = stats;
  const enduranceModifier = getStatBonus(endurance);
  return 1 + enduranceModifier / 10;
}

export function statsSufficient(
  stats: TStatsValues,
  statsRequired: TStatsValues,
) {
  const str = stats.strength >= statsRequired.strength;
  const int = stats.intelligence >= statsRequired.intelligence;
  const wis = stats.wisdom >= statsRequired.wisdom;
  const end = stats.endurance >= statsRequired.endurance;
  const cha = stats.charisma >= statsRequired.charisma;
  const dex = stats.dexterity >= statsRequired.dexterity;
  return str && int && wis && end && cha && dex;
}
