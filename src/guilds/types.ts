import { EAlignment } from "../common/alignment";
import { TQuest } from "../common/quests";
import { TStatsValues } from "../common/stats";

export enum EGuild {
  Adventurer,
  Warrior,
  Thief,
}

export interface IGuildMembership {
  guild: EGuild;
  // current level in the guild
  level: number;
  // current xp amount in the guild
  xp: number;
  // quest to advance to the next guild level
  quest?: TQuest;
}

export interface IGuildValue {
  guild: EGuild;
  value: number;
}
export type TGuildValues = Array<IGuildValue>;

export interface IGuildSpec {
  // minimum hp character can get when advancing level in the guild
  minHp: number;
  // maximum hp character can get when advancing level in the guild until maxLevel is reached
  maxHp: number;
  // maximum guild level until which character can get up to max hp for leveling
  maxLevel: number;
  // how much exp character needs to get to advance in level in this guild
  xpRatio: number;
  // how often character will be assigned a quest to advance to the next level
  questRatio: number;
  // which stats are required to join the guild
  statsRequired: TStatsValues;
  // which character alignments are allowed to join the guild
  alignments: EAlignment[];
}

export interface IGuildMaster {
  guild: EGuild;
  name: string;
  level: number;
}

/**
 * # Skills
 * Passive skills:
 * - fighting - general skill improving all fighting skills and attack/defense
 * -- critical hit - does double damage, ignores protection
 * -- backstab - does double damage to non-agry monster
 * -- multiple swing - does more attacks per round
 * - thieving - general skill improving all thief related skills
 * -- perception - ability to detect and disarm traps, encounters, identify items
 * -- open locks - ability to open non-magically closed chests
 * -- poison - do a poisoned hit to a monster
 * - magic - general skill to all spellcasters improving spell level and all related skills
 * -- mana regeneration - slowly regenerate mana when in dungeon
 * -- magical resistanse - resist opponents magical and special attacks
 * -- focus - casts a spell at a higher spell level
 * Active skills (can be used explicitly): TO BE DESIGNED
 */

export type TSkillKind = "fight" | "thief" | "magic";
export type TFightingSkills = "fight" | "crit" | "backstab" | "swing";
export type TThievingSkills = "thief" | "perception" | "open" | "poison";
export type TMagicalSkills = "magic" | "regen" | "resist" | "focus";
export type TSkillName = TFightingSkills | TThievingSkills | TMagicalSkills;

export interface ISkill {
  kind: TSkillKind;
  skill: TSkillName;
}

export interface IFightingSkill extends ISkill {
  kind: "fight";
  skill: TFightingSkills;
}

export interface IThievingSkill extends ISkill {
  kind: "thief";
  skill: TThievingSkills;
}

export interface IMagicSkill extends ISkill {
  kind: "magic";
  skill: TMagicalSkills;
}

export type TSkill = IFightingSkill | IThievingSkill | IMagicSkill;
