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
