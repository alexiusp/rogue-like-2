import { TQuest } from "./quests";

export enum EGuild {
  Adventurer,
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

export const ZeroGuilds: TGuildValues = [
  { guild: EGuild.Adventurer, value: 1 },
];

export const GuildXpRequirements = {
  [EGuild.Adventurer]: [1000, 2000, 5000],
};
