import { EAlignment } from "../common/alignment";
import { ZeroStats } from "../common/stats";
import { EGuild, IGuildMaster, IGuildSpec, TGuildValues } from "./types";

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
