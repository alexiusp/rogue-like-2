import { getRandomInt, rollDiceCheck } from "../common/random";
import {
  TStatsValues,
  getStatBonus,
  getStatsAttackModifier,
  getStatsDamageModifier,
  getStatsDefenseModifier,
  getStatsProtectionModifier,
} from "../common/stats";
import {
  getGuildsAttackModifier,
  getGuildsDamageModifier,
  getGuildsDefenseModifier,
  getGuildsProtectionModifier,
  getMaxSkillFromGuilds,
  getTotalSkillFromGuilds,
} from "../guilds/models";
import { EGuild } from "../guilds/types";
import {
  IdLevel,
  getEquippedItemsAttack,
  getEquippedItemsDamage,
  getEquippedItemsDefense,
  getEquippedItemsProtection,
} from "../items/models";
import GlobalMonsterCatalogue from "../monsters/GlobalMonsterCatalogue";
import { IGameMonster } from "../monsters/model";
import {
  ECharacterRace,
  RaceAgeMap,
  getRaceAttackModifier,
  getRaceDamageModifier,
  getRaceDefenseModifier,
  getRaceHealthModifier,
  getRaceManaModifier,
  getRaceProtectionModifier,
} from "./races";
import {
  EGender,
  IBaseCharacterInfo,
  ICharacterState,
  TCharacterCombinedState,
} from "./types";

export function getInitialCharacterHealth(
  race: ECharacterRace,
  gender: EGender,
  stats: TStatsValues,
) {
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

export function getInitialCharacterMana(
  race: ECharacterRace,
  stats: TStatsValues,
) {
  const raceBonus = getRaceManaModifier(race);
  const intBonus = Math.round(stats.intelligence - 10);
  const wisBonus = Math.round((stats.wisdom - 14) / 2);
  return getRandomInt(20, 10) * raceBonus + intBonus + wisBonus;
}

export function createNewCharacter(
  charData: ICharacterState,
  baseData: IBaseCharacterInfo,
  stats: TStatsValues,
): ICharacterState {
  const race = charData.race;
  const hp = getInitialCharacterHealth(race, baseData.gender, stats);
  const mp = getInitialCharacterMana(race, stats);
  return {
    ...charData,
    age: RaceAgeMap[race][0],
    hp,
    hpMax: hp,
    mp: mp,
    mpMax: mp,
    guilds: [
      {
        guild: EGuild.Adventurer,
        level: 1,
        xp: 0,
      },
    ],
    guild: EGuild.Adventurer,
    money: 100,
  };
}

export function getCharacterGuild(guild: EGuild, character: ICharacterState) {
  return character.guilds.find((g) => g.guild === guild);
}

export function findCharacterGuildIndex(
  guild: EGuild,
  character: ICharacterState,
) {
  return character.guilds.findIndex((g) => g.guild === guild);
}

export function getCharacterGuildXp(guild: EGuild, character: ICharacterState) {
  const guildInfo = getCharacterGuild(guild, character);
  return guildInfo?.xp ?? 0;
}

export function getCharacterGuildLevel(
  guild: EGuild,
  character: ICharacterState,
) {
  const guildInfo = getCharacterGuild(guild, character);
  return guildInfo?.level ?? 1;
}

export function getCharacterTotalXp(character: ICharacterState) {
  return character.guilds.reduce((sum, guild) => sum + guild.xp, 0);
}

export function getCharacterAttack(character: TCharacterCombinedState) {
  const baseValue = 20;
  // modifier by race
  const raceModifier = getRaceAttackModifier(character.race);
  // modifier from stats
  const statsModifier = getStatsAttackModifier(character.stats);
  // modifier by guild skills
  const skillsModifier = getGuildsAttackModifier(character.guilds);
  // modifier from equipped items
  const itemsModifier = getEquippedItemsAttack(character.items);
  return Math.round(
    (baseValue + itemsModifier) * raceModifier * statsModifier * skillsModifier,
  );
}

export function getCharacterDamage(character: TCharacterCombinedState) {
  const baseValue = 5;
  // get base damage value from item
  const itemValue = getEquippedItemsDamage(character.items);
  // modifier by race
  const raceModifier = getRaceDamageModifier(character.race);
  // modifier from stats
  const statsModifier = getStatsDamageModifier(character.stats);
  // modifier by guild skills
  const skillsModifier = getGuildsDamageModifier(character.guilds);
  return Math.round(
    (baseValue + itemValue) * raceModifier * statsModifier * skillsModifier,
  );
}

export function getCharacterDefense(
  character: TCharacterCombinedState,
  defending: boolean = false,
) {
  const baseValue = 0;
  // get base defense value from item
  const itemValue = getEquippedItemsDefense(character.items);
  // modifier by race
  const raceModifier = getRaceDefenseModifier(character.race);
  // modifier from stats
  const statsModifier = getStatsDefenseModifier(character.stats);
  // modifier by guild skills
  const skillsModifier = getGuildsDefenseModifier(character.guilds);
  // modifier by denfend mode
  const defendModifier = defending ? 2 : 1;
  return Math.round(
    (baseValue + itemValue) *
      raceModifier *
      statsModifier *
      skillsModifier *
      defendModifier,
  );
}

export function getCharacterProtection(character: TCharacterCombinedState) {
  const baseValue = 0;
  // get base defense value from item
  const itemValue = getEquippedItemsProtection(character.items);
  // modifier by race
  const raceModifier = getRaceProtectionModifier(character.race);
  // modifier from stats
  const statsModifier = getStatsProtectionModifier(character.stats);
  // modifier by guild skills
  const skillsModifier = getGuildsProtectionModifier(character.guilds);
  return Math.round(
    (baseValue + itemValue) * raceModifier * statsModifier * skillsModifier,
  );
}

export function rollAggro(
  character: TCharacterCombinedState,
  monster: IGameMonster,
) {
  const { alignment, guild, stats } = character;
  const baseMonster = GlobalMonsterCatalogue[monster.monster];
  const difLevel = getCharacterGuildLevel(guild, character) - baseMonster.level;
  const levelBonus = (difLevel - 1) * 4;
  const statBonus = getStatBonus(stats.charisma) * 2;
  const monsterAlignment = baseMonster.alignment;
  const alignmentBonus = alignment !== monsterAlignment ? -2 : 2;
  const rollValue = 50 + levelBonus + statBonus + alignmentBonus;
  return rollDiceCheck(rollValue, "1D100");
}

export function rollCharacterIdSkill(character: TCharacterCombinedState) {
  let idLevel: IdLevel = 0;
  const intBonus = getStatBonus(character.stats.intelligence);
  const wisBonus = getStatBonus(character.stats.wisdom);
  const perceptionSkill = getMaxSkillFromGuilds("perception", character.guilds);
  const thiefSkill = getTotalSkillFromGuilds("thief", character.guilds);
  const skillBonus = 2 * perceptionSkill.max + thiefSkill;
  // two dice checks one for each id level
  const diceCheck1 = rollDiceCheck(
    20 - intBonus - wisBonus - skillBonus,
    "1D20",
  );
  if (diceCheck1) {
    idLevel = 1;
  }
  const diceCheck2 = rollDiceCheck(
    20 - intBonus - wisBonus - skillBonus,
    "1D20",
  );
  if (diceCheck2) {
    idLevel = 2;
  }
  return idLevel;
}

export function rollCharacterFleeChance(character: TCharacterCombinedState) {
  const baseValue = 50;
  const dexBonus = getStatBonus(character.stats.dexterity);
  const wisBonus = getStatBonus(character.stats.wisdom);
  const thiefSkill = getTotalSkillFromGuilds("thief", character.guilds);
  const rollValue = baseValue + 2 * (dexBonus + thiefSkill) + wisBonus;
  return rollDiceCheck(rollValue, "1D100");
}
