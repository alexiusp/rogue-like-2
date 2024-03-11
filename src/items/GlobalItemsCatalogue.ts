import { EGuild, TGuildValues } from "../common/guilds";
import { TStatsValues } from "../common/stats";
import { TBaseItem } from "./models";

const ZeroStats: TStatsValues = {
  strength: 0,
  intelligence: 0,
  wisdom: 0,
  endurance: 0,
  charisma: 0,
  dexterity: 0,
};

const ZeroGuilds: TGuildValues = [{ guild: EGuild.Adventurer, value: 1 }];

const GlobalItemsCatalogue: { [name: string]: TBaseItem } = {
  "Bronze Dagger": {
    name: "Bronze Dagger",
    kind: "dagger",
    material: "Bronze",
    slot: "weapon",
    aligned: false,
    statsRequired: {
      strength: 4,
      intelligence: 0,
      wisdom: 0,
      endurance: 0,
      charisma: 0,
      dexterity: 6,
    },
    statsBonuses: ZeroStats,
    guildRequired: ZeroGuilds,
    attributes: {
      damage: 3,
    },
    hands: 1,
    swings: 1,
  },
  "Healing Potion": {
    name: "Healing Potion",
    kind: "potion",
    spell: "heal",
    aligned: false,
    statsRequired: ZeroStats,
    statsBonuses: ZeroStats,
    guildRequired: ZeroGuilds,
    uses: 5,
  },
};

export default GlobalItemsCatalogue;
