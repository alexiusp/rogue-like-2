import { EAlignment } from "../common/alignment";
import { getRandomInt } from "../common/random";
import { NoStatsRequired } from "../common/stats";
import {
  EGuild,
  IGuildMaster,
  IGuildMembership,
  IGuildSpec,
  TGuildSkillProgressionMap,
  TGuildValues,
  TSkillName,
} from "./types";

export const FullGuildsList: Readonly<EGuild[]> = [
  EGuild.Adventurer,
  EGuild.Warrior,
  EGuild.Thief,
] as const;

export const ZeroGuilds: TGuildValues = FullGuildsList.map((guild) => ({
  guild,
  value: 1,
}));

export function isNotGuildRestricted(requirements: TGuildValues) {
  return requirements.length === FullGuildsList.length;
}

export const GuildSpecs: Record<EGuild, IGuildSpec> = {
  [EGuild.Adventurer]: {
    minHp: 1,
    maxHp: 9,
    maxLevel: 30,
    xpRatio: 8,
    questRatio: 20,
    statsRequired: NoStatsRequired,
    alignments: [EAlignment.Good, EAlignment.Neutral, EAlignment.Evil],
  },
  [EGuild.Warrior]: {
    minHp: 2,
    maxHp: 10,
    maxLevel: 28,
    xpRatio: 16,
    questRatio: 20,
    statsRequired: {
      strength: 14,
      intelligence: 7,
      wisdom: 5,
      endurance: 10,
      charisma: 3,
      dexterity: 8,
    },
    alignments: [EAlignment.Good, EAlignment.Neutral, EAlignment.Evil],
  },
  [EGuild.Thief]: {
    minHp: 2,
    maxHp: 4,
    maxLevel: 21,
    xpRatio: 15,
    questRatio: 15,
    statsRequired: {
      strength: 8,
      intelligence: 12,
      wisdom: 8,
      endurance: 6,
      charisma: 5,
      dexterity: 17,
    },
    alignments: [EAlignment.Neutral],
  },
};

const experienceProgression = [
  0, 100, 200, 500, 1000, 1500, 2000, 3000, 4500, 6000, 8000,
];

function getGuildProgression(xpRatio: number) {
  return experienceProgression.map((v) => (v / 100) * (100 + xpRatio));
}

export function getGuildXpRequirementsForLevel(guild: EGuild, level: number) {
  const progression = getGuildProgression(GuildSpecs[guild].xpRatio);
  return progression[level];
}

export function getInitialGuildMasters(): IGuildMaster[] {
  return FullGuildsList.map((guild) => ({
    guild,
    name: `Master ${EGuild[guild]}`,
    level: Math.round(
      GuildSpecs[guild].maxLevel + GuildSpecs[guild].xpRatio / 8,
    ),
  }));
}

export const GuildSkillsProgressionMap: TGuildSkillProgressionMap = {
  [EGuild.Adventurer]: {
    fight: 11,
    crit: 0,
    backstab: 0,
    swing: 0,
    thief: 9,
    perception: 8,
    open: 0,
    poison: 0,
    magic: 0,
    regen: 0,
    resist: 0,
    focus: 0,
  },
  [EGuild.Warrior]: {
    fight: 20,
    crit: 15,
    backstab: 0,
    swing: 9,
    thief: 3,
    perception: 3,
    open: 0,
    poison: 0,
    magic: 0,
    regen: 0,
    resist: 0,
    focus: 0,
  },
  [EGuild.Thief]: {
    fight: 10,
    crit: 0,
    backstab: 15,
    swing: 0,
    thief: 15,
    perception: 5,
    open: 5,
    poison: 3,
    magic: 0,
    regen: 0,
    resist: 0,
    focus: 0,
  },
};

function getSkillProgressionRate(skill: TSkillName, guild: EGuild) {
  return GuildSkillsProgressionMap[guild][skill];
}

export function getSkillLevelForGuildLevel(
  skill: TSkillName,
  guild: EGuild,
  guildLevel: number,
) {
  const ratio = getSkillProgressionRate(skill, guild);
  if (!ratio) {
    // if ratio = 0 no skill will be given by this guild
    return 0;
  }
  const value = Math.floor((guildLevel + (20 - ratio)) / (20 - ratio));
  /*
  console.log(
    `Guild ${EGuild[guild]} provides ${skill}*${value} on level ${guildLevel}`,
  );
  */
  return value;
}

// general skills: fighting, thief and magic are calculated in total for all guilds
export function getTotalSkillFromGuilds(
  name: TSkillName,
  guilds: IGuildMembership[],
) {
  let total = 0;
  for (const guildMembership of guilds) {
    const { guild, level } = guildMembership;
    total += getSkillLevelForGuildLevel(name, guild, level);
  }
  return total;
}

// abilities are calculated by max value
export function getMaxSkillFromGuilds(
  name: TSkillName,
  guilds: IGuildMembership[],
) {
  let max = 0;
  let maxGuild = guilds[0].guild;
  for (const membership of guilds) {
    const { guild, level } = membership;
    const skill = getSkillLevelForGuildLevel(name, guild, level);
    if (max < skill) {
      max = skill;
      maxGuild = guild;
    }
  }
  return { max, guild: maxGuild };
}

export function generateHpForGuildLevel(guildId: EGuild, level: number) {
  const guildSpec = GuildSpecs[guildId];
  if (level > guildSpec.maxLevel) {
    return guildSpec.minHp;
  }
  return getRandomInt(guildSpec.maxHp, guildSpec.minHp);
}

export function getGuildsAttackModifier(guilds: IGuildMembership[]) {
  const fightingSkill = getTotalSkillFromGuilds("fight", guilds);
  return 1 + fightingSkill * 0.1;
}

export function getGuildsDamageModifier(guilds: IGuildMembership[]) {
  const fightingSkill = getTotalSkillFromGuilds("fight", guilds);
  return 1 + fightingSkill * 0.2;
}

export function getGuildsDefenseModifier(guilds: IGuildMembership[]) {
  const fightingSkill = getTotalSkillFromGuilds("fight", guilds);
  return 1 + fightingSkill * 0.2;
}

export function getGuildsProtectionModifier(guilds: IGuildMembership[]) {
  const fightingSkill = getTotalSkillFromGuilds("fight", guilds);
  return 1 + fightingSkill * 0.1;
}
