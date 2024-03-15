import { EAlignment } from "../common/alignment";
import { EGuild, IGuildMembership } from "../common/guilds";
import { getRandomInt } from "../common/random";
import {
  TStatNames,
  TStatsValues,
  getStatsAttackModifier,
  getStatsDamageModifier,
  getStatsDefenseModifier,
  getStatsProtectionModifier,
} from "../common/stats";
import {
  TGameItem,
  getEquippedItemsAttack,
  getEquippedItemsDamage,
  getEquippedItemsDefense,
  getEquippedItemsProtection,
} from "../items/models";
import {
  ECharacterRace,
  RaceAgeMap,
  RaceStatsMap,
  getRaceAttackModifier,
  getRaceDamageModifier,
  getRaceDefenseModifier,
  getRaceHealthModifier,
  getRaceProtectionModifier,
} from "./races";

export enum EGender {
  Male,
  Female,
  Other,
}

export interface ICharacter {
  picture: string;
  gender: EGender;
  race: ECharacterRace;
  alignment: EAlignment;
  name: string;
  stats: TStatsValues;
}

export function getInitialCharacterHealth({ gender, race, stats }: ICharacter) {
  // TODO: implement bonuses from races, no race bonuses for elf or human
  const raceBonus = getRaceHealthModifier(race);
  const strBonus = Math.round((stats.strength - 14) / 2);
  const endBonus = Math.round(stats.endurance - 10);
  let genderBonus = 0;
  if (gender === EGender.Male) {
    genderBonus += 1;
  }
  if (gender === EGender.Female) {
    genderBonus -= 1;
  }
  return getRandomInt(20, 10) + raceBonus + strBonus + endBonus + genderBonus;
}

export interface ICharacterState extends ICharacter {
  // characters age
  age: number;
  // hit points - character health
  hp: number;
  hpMax: number;
  // mana points - amount of magic powers
  mp: number;
  mpMax: number;
  // guild memebership info
  guilds: Array<IGuildMembership>;
  // currently selected guild
  guild: EGuild;
  // money
  money: number;
  items: Array<TGameItem>;
}

export function createNewCharacter(charData: ICharacter): ICharacterState {
  const race = charData.race;
  const hp = getInitialCharacterHealth(charData);
  // TODO: implement magic points generation
  return {
    ...charData,
    age: RaceAgeMap[race][0],
    hp,
    hpMax: hp,
    mp: 0,
    mpMax: 0,
    guilds: [
      {
        guild: EGuild.Adventurer,
        level: 1,
        xp: 0,
      },
    ],
    guild: EGuild.Adventurer,
    money: 100,
    items: [],
  };
}

export function getCharacterGuild(guild: EGuild, character: ICharacterState) {
  return character.guilds.find((g) => g.guild === guild);
}

export function getCharacterGuildXp(guild: EGuild, character: ICharacterState) {
  const guildInfo = getCharacterGuild(guild, character);
  return guildInfo?.xp ?? 0;
}

export function getCharacterTotalXp(character: ICharacterState) {
  return character.guilds.reduce((sum, guild) => sum + guild.xp, 0);
}

export const rerollStat = (statName: TStatNames, charRace: ECharacterRace) => {
  const minValue = RaceStatsMap[statName][charRace][0];
  const maxValue = RaceStatsMap[statName][charRace][1];
  return getRandomInt(maxValue, minValue);
};

export function getCharacterAttack(character: ICharacterState) {
  const baseValue = 10;
  // modifier by race
  const raceModifier = getRaceAttackModifier(character.race);
  // modifier from stats
  const statsModifier = getStatsAttackModifier(character.stats);
  // TODO: modifier by guild skills
  const skillsModifier = 1;
  // modifier from equipped items
  const itemsModifier = getEquippedItemsAttack(character.items);
  return Math.round(
    (baseValue + itemsModifier) * raceModifier * statsModifier * skillsModifier,
  );
}

export function getCharacterDamage(character: ICharacterState) {
  const baseValue = 1;
  // get base damage value from item
  const itemValue = getEquippedItemsDamage(character.items);
  // modifier by race
  const raceModifier = getRaceDamageModifier(character.race);
  // modifier from stats
  const statsModifier = getStatsDamageModifier(character.stats);
  // TODO: modifier by guild skills
  const skillsModifier = 1;
  return Math.round(
    (baseValue + itemValue) * raceModifier * statsModifier * skillsModifier,
  );
}

export function getCharacterDefense(character: ICharacterState) {
  const baseValue = 0;
  // get base defense value from item
  const itemValue = getEquippedItemsDefense(character.items);
  // modifier by race
  const raceModifier = getRaceDefenseModifier(character.race);
  // modifier from stats
  const statsModifier = getStatsDefenseModifier(character.stats);
  // TODO: modifier by guild skills
  const skillsModifier = 1;
  return Math.round(
    (baseValue + itemValue) * raceModifier * statsModifier * skillsModifier,
  );
}

export function getCharacterProtection(character: ICharacterState) {
  const baseValue = 0;
  // get base defense value from item
  const itemValue = getEquippedItemsProtection(character.items);
  // modifier by race
  const raceModifier = getRaceProtectionModifier(character.race);
  // modifier from stats
  const statsModifier = getStatsProtectionModifier(character.stats);
  // TODO: modifier by guild skills
  const skillsModifier = 1;
  return Math.round(
    (baseValue + itemValue) * raceModifier * statsModifier * skillsModifier,
  );
}
