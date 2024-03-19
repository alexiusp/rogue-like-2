import { EAlignment } from "../common/alignment";
import { ZeroStats } from "../common/stats";
import {
  EGuild,
  IGuildMaster,
  IGuildMembership,
  IGuildSpec,
  TGuildValues,
  TSkill,
  TSkillName,
} from "./types";

export const FullGuildsList: Readonly<EGuild[]> = [
  EGuild.Adventurer,
  EGuild.Warrior,
  EGuild.Thief,
] as const;

export const ZeroGuilds: TGuildValues = [
  { guild: EGuild.Adventurer, value: 1 },
];

export const GuildSpecs: Record<EGuild, IGuildSpec> = {
  [EGuild.Adventurer]: {
    minHp: 1,
    maxHp: 9,
    maxLevel: 30,
    xpRatio: 8,
    questRatio: 20,
    statsRequired: ZeroStats,
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
  // TODO: generate/predefine names for guild masters
  return FullGuildsList.map((guild) => ({
    guild,
    name: "GuildMaster",
    level: Math.round(
      GuildSpecs[guild].maxLevel + GuildSpecs[guild].xpRatio / 8,
    ),
  }));
}

export const GuildSkills: Record<EGuild, Array<TSkill | null>> = {
  [EGuild.Adventurer]: [
    null,
    null,
    { kind: "fight", skill: "fight" },
    { kind: "thief", skill: "thief" },
  ],
  [EGuild.Warrior]: [
    null,
    { kind: "fight", skill: "fight" },
    { kind: "fight", skill: "fight" },
    { kind: "thief", skill: "thief" },
  ],
  [EGuild.Thief]: [
    null,
    null,
    { kind: "fight", skill: "fight" },
    { kind: "thief", skill: "thief" },
  ],
};

function getAllSkillsFromGuilds(guilds: IGuildMembership[]) {
  const skills: TSkill[] = [];
  for (const guildMembership of guilds) {
    const { guild, level } = guildMembership;
    const guildSkills = GuildSkills[guild];
    for (let l = 1; l <= level; l++) {
      const skill = guildSkills[l];
      if (skill !== null) {
        skills.push(skill);
      }
    }
  }
  return skills;
}

// general skills: fighting, thief and magic are calculated in total
export function getTotalSkillFromGuilds(
  name: TSkillName,
  guilds: IGuildMembership[],
) {
  const skills = getAllSkillsFromGuilds(guilds);
  return skills.reduce((acc, skill) => {
    if (skill.skill === name) {
      return acc + 1;
    }
    return acc;
  }, 0);
}

// abilities are calculated by max value
export function getMaxSkillFromGuilds(
  name: TSkillName,
  guilds: IGuildMembership[],
) {
  let max = 0;
  let maxGuild = guilds[0].guild;
  for (const membership of guilds) {
    let amount = 0;
    const { guild, level } = membership;
    const guildSkills = GuildSkills[guild];
    for (let l = 1; l <= level; l++) {
      const skill = guildSkills[l];
      if (skill !== null && skill.skill === name) {
        amount += 1;
      }
    }
    if (max < amount) {
      max = amount;
      maxGuild = guild;
    }
  }
  return { max, guild: maxGuild };
}
