import { ZeroGuilds } from "../common/guilds";
import { ZeroStats } from "../common/stats";
import { TBaseItem } from "./models";

const GlobalItemsCatalogue: { [name: string]: TBaseItem } = {
  "Bronze Dagger": {
    name: "Bronze Dagger",
    picture: "bronze_dagger.png",
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
    picture: "potionRed.png",
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
